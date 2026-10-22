import path from 'node:path';
const { puppeteer: named, default: fallback } = await import(process.env.VIOS_PUPPETEER_MODULE ?? 'puppeteer');
const puppeteer=named??fallback;
const output=process.env.VIOS_DIAGNOSTICS_DIR??'/private/tmp/vios-diagnostics';
const browser=await puppeteer.launch({headless:true,
 executablePath:process.env.VIOS_CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
 userDataDir:path.join(output,'game-chrome-profile'),
 args:['--no-first-run','--disable-background-networking']});
try{
 const page=await browser.newPage();await page.setViewport({width:1280,height:900,deviceScaleFactor:1});
 page.on('pageerror',error=>console.error('PAGE ERROR',error));
 let failures=0;page.on('requestfailed',request=>{if(failures++<8)console.error('REQUEST',request.url(),request.failure()?.errorText);});
 await page.evaluateOnNewDocument(()=>{
  const original=window.fetch.bind(window);
  window.fetch=(url,init)=>String(url).includes('127.0.0.1:7243/ingest/')
   ?Promise.resolve(new Response(null,{status:204})):original(url,init);
 });
 await page.setRequestInterception(true);
 page.on('request',request=>/^http:\/\/(127\.0\.0\.1|localhost):5173\//.test(request.url())
  || request.url().startsWith('data:') || request.url().startsWith('blob:')?request.continue():request.abort());
 const waitFor=async(check)=>{for(let i=0;i<240;i++){if(await page.evaluate(check))return;await new Promise(resolve=>setTimeout(resolve,250));}throw Error('Game UI did not become ready');};
 await page.goto('http://127.0.0.1:5173/?vehicle=3',{waitUntil:'domcontentloaded',timeout:60000});
 await waitFor(()=>!!document.getElementById('welcomeStartBtn'));
 await page.evaluate(()=>{document.getElementById('welcomeStartBtn').click();document.getElementById('guideCloseBtnBottom').click();});
 await waitFor(()=>!!document.querySelector('.cabin-overlay'));
 const changeCamera=()=>page.evaluate(()=>document.querySelector('#cameraBtn').click());
 await changeCamera();await waitFor(()=>document.querySelector('#camera')?.textContent==='2');
 await page.screenshot({path:path.join(output,'game-top-fixed.png')});
 await changeCamera();await waitFor(()=>document.querySelector('#camera')?.textContent==='Cabin');
 await page.screenshot({path:path.join(output,'game-cabin-fixed.png')});
 console.log('PASS: actual game top/cabin views and mirror/shoulder panes captured');
}catch(error){
 const pages=await browser.pages();const page=pages.at(-1);
 if(page){console.error(await page.evaluate(()=>({title:document.title,buttons:Array.from(document.querySelectorAll('button')).map(b=>b.id),camera:document.querySelector('#camera')?.textContent})));await page.screenshot({path:path.join(output,'game-debug.png')});}
 throw error;
}finally{await browser.close();}
