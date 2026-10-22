import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle=await build({stdin:{contents:`export * as THREE from 'three'; export { ExamEngine } from './src/game/ExamEngine';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const module={exports:{}};new Function('module','exports',bundle.outputFiles[0].text)(module,module.exports);
const {THREE,ExamEngine}=module.exports;
function fixture(vehicleClass,rotation,mode='normal') {
 const root=new THREE.Group();root.position.set(40,0,-70);root.rotation.y=rotation;
 const gate=new THREE.Group();gate.name='s-curve-start-yellow-dashed-line';
 for(const z of [-1,1]) {const dash=new THREE.Object3D();dash.position.set(0,.09,z);gate.add(dash);}root.add(gate);root.updateMatrixWorld(true);
 const engine=new ExamEngine(mode);
 engine.wireTrafficLights({trafficLights:[],getTrafficLight:()=>undefined,getWindingCourses:()=>[{vehicleClass,course:{root,width:4}}]});
 engine.activeIndex=5;engine.scoringStarted=true;
 const tick=(x,z=0)=>engine.update({position:root.localToWorld(new THREE.Vector3(x+2.1,0,z)),frontPosition:root.localToWorld(new THREE.Vector3(x,0,z)),speedKmh:5,rpm:800,engineRunning:true,stalled:false,leftSignal:false,seatBeltFastened:true},'idle',.016);
 return {engine,tick};
}
for(const rotation of [0,Math.PI/2,.37]) for(const cls of ['B','C','D','E']) {
 const {engine,tick}=fixture(cls,rotation);
 tick(1);assert.equal(engine.disqualified,false);
 tick(-1);assert.equal(engine.disqualified,cls!=='B');
 if(cls!=='B') assert.equal(engine.disqualifyReason,'đi không đúng hình của hạng xe');
 const outside=fixture(cls,rotation);outside.tick(1,5);outside.tick(-1,5);
 assert.equal(outside.engine.disqualified,false,'Passing beside entrance is valid');
}
const errors=fixture('C',.4,'errors-only');errors.tick(0);errors.tick(0);
assert.equal(errors.engine.disqualified,false);
assert.equal(errors.engine.penalties.length,1);
errors.engine.reset();assert.equal(errors.engine.wrongWindingReported,false);
console.log('PASS: B allowed; C/D/E disqualified at S entrance; rotated and swept gates; outside; errors-only; reset');
