import assert from 'node:assert/strict';
import { build } from 'esbuild';
const b=await build({stdin:{contents:`export * as THREE from 'three';export {ParkingClassCheck} from './src/game/exercises/ParkingClassCheck';export {ExamEngine} from './src/game/ExamEngine';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('module','exports',b.outputFiles[0].text)(m,m.exports);
const {THREE,ParkingClassCheck,ExamEngine}=m.exports;
for(const cls of ['B','C','D','E']) for(const rotation of [0,.71,Math.PI/2]) {
 const root=new THREE.Group();root.position.set(-40,0,-70);root.rotation.y=rotation;root.updateMatrixWorld(true);
 const zone={root,vehicleClass:cls,bounds:new THREE.Box3(new THREE.Vector3(-1.5,-10,.05),new THREE.Vector3(1.5,10,8))};
 const p=(x,z)=>root.localToWorld(new THREE.Vector3(x,0,z));
 const c=new ParkingClassCheck();
 assert.equal(c.update([zone],[p(0,-2)]),false,'Approach/control road remains valid');
 assert.equal(c.update([zone],[p(0,1)]),cls!=='B','Entering wrong bay is detected');
 assert.equal(c.update([zone],[p(0,2)]),false,'No repeated report');
 c.reset();c.update([zone],[p(0,-1)]);
 assert.equal(c.update([zone],[p(0,9)]),cls!=='B','Swept detection cannot skip bay');
 const engine=new ExamEngine('normal');
 engine.wireTrafficLights({trafficLights:[],getTrafficLight:()=>undefined,parkingClassZones:[zone]});
 engine.activeIndex=5;engine.scoringStarted=true;
 // Reverse into the bay: front stays outside while rear enters.
 engine.update({position:p(0,-.5),frontPosition:p(0,-2.6),speedKmh:2,rpm:800,engineRunning:true,stalled:false,leftSignal:false,seatBeltFastened:true},'idle',.016);
 assert.equal(engine.disqualified,cls!=='B');
 if(cls!=='B')assert.equal(engine.disqualifyReason,'đi không đúng hình của hạng xe');
 engine.reset();assert.equal(engine.disqualified,false);
}
console.log('PASS: B permitted; C/D/E rejected; adjacent road valid; reverse and swept entry; rotated zones; reset');
