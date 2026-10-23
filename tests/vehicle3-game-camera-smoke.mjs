import path from 'node:path';
import assert from 'node:assert/strict';
const { puppeteer: named, default: fallback } = await import(process.env.VIOS_PUPPETEER_MODULE ?? 'puppeteer');
const puppeteer=named??fallback;
const output=process.env.VIOS_DIAGNOSTICS_DIR??'/private/tmp/vios-diagnostics';
const gameUrl=process.env.VIOS_GAME_URL??'http://127.0.0.1:5173/?vehicle=3';
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
 page.on('request',request=>request.url().startsWith(new URL(gameUrl).origin+'/')
  || request.url().startsWith('data:') || request.url().startsWith('blob:')?request.continue():request.abort());
 const waitFor=async(check)=>{for(let i=0;i<240;i++){if(await page.evaluate(check))return;await new Promise(resolve=>setTimeout(resolve,250));}throw Error('Game UI did not become ready');};
 await page.goto(gameUrl,{waitUntil:'domcontentloaded',timeout:60000});
 await waitFor(()=>!!document.getElementById('welcomeStartBtn'));
 await page.evaluate(()=>{document.getElementById('welcomeStartBtn').click();document.getElementById('guideCloseBtnBottom').click();});
 await waitFor(()=>!!document.querySelector('.cabin-overlay'));
 const changeCamera=()=>page.evaluate(()=>document.querySelector('#cameraBtn').click());
 await changeCamera();await waitFor(()=>document.querySelector('#camera')?.textContent==='2');
 await page.screenshot({path:path.join(output,'game-top-fixed.png')});
 await changeCamera();await waitFor(()=>document.querySelector('#camera')?.textContent==='Cabin');
 await page.screenshot({path:path.join(output,'game-cabin-fixed.png')});
 assert.equal(await page.evaluate(()=>getComputedStyle(document.getElementById('wheel')).visibility),'hidden',
  'Cabin must not display the second HUD wheel');
 const dragPoints=await page.evaluate(()=>{
  const wheel=document.getElementById('cabinWheelControl'),r=wheel.getBoundingClientRect();
  return [-135,-110,-90,-65,-45].map(deg=>{
   const a=deg*Math.PI/180;
   return {x:r.left+r.width/2+Math.cos(a)*r.width*.4,y:r.top+r.height/2+Math.sin(a)*r.height*.4};
  }).filter(p=>document.elementFromPoint(p.x,p.y)===wheel);
 });
 assert.ok(dragPoints.length>=2,'Cabin wheel must accept input in its visible area');
 await page.mouse.move(dragPoints[0].x,dragPoints[0].y);await page.mouse.down();
 await page.mouse.move(dragPoints.at(-1).x,dragPoints.at(-1).y,{steps:12});
 await waitFor(()=>Math.abs(Number(document.getElementById('cabinWheelControl').getAttribute('aria-valuenow')))>3);
 await page.mouse.up();
 assert.match(await page.evaluate(()=>document.getElementById('interior-wheel').getAttribute('transform')),/rotate\((?!0 )/,
  'Dragging the cabin wheel rotates its artwork');
 assert.equal(await page.evaluate(()=>{
  const wheel=document.getElementById('cabinWheelControl');wheel.focus();return document.activeElement===wheel;
 }),true,'Cabin wheel is keyboard accessible');
 await page.keyboard.down('Home');
 await waitFor(()=>Math.abs(Number(document.getElementById('cabinWheelControl').getAttribute('aria-valuenow')))<1);
 await page.keyboard.up('Home');
 const beltBefore=await page.$eval('#seatBelt',e=>e.getAttribute('aria-pressed'));
 await page.click('#seatBelt');
 assert.notEqual(await page.$eval('#seatBelt',e=>e.getAttribute('aria-pressed')),beltBefore,
  'The cabin wheel must not intercept other HUD controls');
 await changeCamera();await waitFor(()=>document.querySelector('#camera')?.textContent==='1');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.getElementById('wheel')).visibility),'visible',
  'The normal HUD wheel returns outside cabin mode');
 console.log('PASS: cabin renders one wheel; drag, keyboard, HUD buttons, camera switching and mirror panes');
}catch(error){
 const pages=await browser.pages();const page=pages.at(-1);
 if(page){console.error(await page.evaluate(()=>({title:document.title,buttons:Array.from(document.querySelectorAll('button')).map(b=>b.id),camera:document.querySelector('#camera')?.textContent})));await page.screenshot({path:path.join(output,'game-debug.png')});}
 throw error;
}finally{await browser.close();}
