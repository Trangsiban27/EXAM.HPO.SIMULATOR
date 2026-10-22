import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({stdin:{contents:`export { ManualTransmission } from './src/game/ManualTransmission';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const module={exports:{}};
new Function('module','exports',bundle.outputFiles[0].text)(module,module.exports);
const {ManualTransmission}=module.exports;
for(const gear of [-1,1,2,3,4,5]) for(const slope of [-.15,0,.15]) {
 const t=new ManualTransmission();
 t.gear=gear; t.car.engine.start(); t.car.engine.rpm=200; t.car.stalled=true;
 const keys=new Set(['Enter','Digit2']);
 const input={isDown:code=>keys.has(code),getAnalog:()=>undefined};
 t.stopInPlace(input);
 for(let i=0;i<300;i++) {
  assert.equal(t.update(.016,input,0,slope),0);
  assert.equal(t.running,true);
  assert.equal(t.car.stalled,false);
  assert.equal(t.gear,0);
 }
 keys.clear(); t.update(.016,input,0,slope);
 keys.add('Digit1'); t.update(.016,input,0,slope);
 assert.equal(t.gear,1,'Can select first while clutch is held');
 for(let i=0;i<60;i++) t.update(.016,input,0,slope);
 assert.equal(t.running,true,'Selected first remains running while held');
 keys.add('KeyW'); let speed=0;
 for(let i=0;i<360;i++) speed=t.update(.016,input,speed,0);
 assert.equal(t.running,true); assert.ok(speed>0,'Accelerator resumes driving');
 t.reset(); assert.equal(t.holdingPosition,false);
}
console.log('PASS: automatic handoff from forward/reverse gears; slopes; stale keys; first-gear restart; reset');
