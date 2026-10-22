import assert from 'node:assert/strict';
import { build } from 'esbuild';
const b=await build({stdin:{contents:`export * as THREE from 'three'; export { Exam06SCurveTimer } from './src/game/exercises/Exam06SCurveTimer';export {ExamEngine} from './src/game/ExamEngine';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('module','exports',b.outputFiles[0].text)(m,m.exports);
const {THREE,Exam06SCurveTimer,ExamEngine}=m.exports;
function fixture(rotation=0,cls='B') {
 const root=new THREE.Group();root.rotation.y=rotation;root.position.set(20,0,-60);
 for(const [name,x,z] of [['start',0,0],['end',-10,5]]) {
  const gate=new THREE.Group();gate.name=`s-curve-${name}-yellow-dashed-line`;
  for(const dz of [-1,1]){const dash=new THREE.Object3D();dash.position.set(x,.09,z+dz);gate.add(dash);}root.add(gate);
 }
 root.updateMatrixWorld(true);
 const entry={vehicleClass:cls,course:{root,width:4}};
 const point=(x,z=0)=>root.localToWorld(new THREE.Vector3(x,0,z));
 return {entry,point};
}
for(const rotation of [0,.6,Math.PI/2]) {
 const {entry,point}=fixture(rotation);const t=new Exam06SCurveTimer();
 const tick=(ms,x,z=0)=>t.update(point(x,z),[entry],ms);
 assert.equal(tick(300000,4).length,0,'No time penalty before entry');
 tick(301000,1);tick(302000,-1); // swept start gate, including spaces between dashes
 assert.equal(tick(422000,-4).length,0,'Exactly 120 seconds is allowed');
 assert.equal(tick(422001,-4).length,1);
 assert.equal(tick(422002,-4).length,0,'No repeated per-frame deduction');
 tick(423000,0); // revisiting entry must not restart clock
 assert.equal(tick(542001,-4).length,1,'Another 120 seconds costs 5');
 tick(543000,-9,5);tick(543010,-11,5); // swept exit
 assert.equal(tick(1000000,-12,5).length,0,'Timer stops at final gate');
 t.reset();assert.equal(tick(2000000,4).length,0);
}
const {entry,point}=fixture();const engine=new ExamEngine('normal');
engine.wireTrafficLights({trafficLights:[],getTrafficLight:()=>undefined,getWindingCourses:()=>[entry]});
engine.activeIndex=5;engine.scoringStarted=true;
let now=1000;Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
const tick=x=>engine.update({position:point(x+2.1),frontPosition:point(x),speedKmh:0,rpm:800,engineRunning:true,stalled:false,leftSignal:false,seatBeltFastened:true},'idle',.016);
assert.equal(engine.currentExerciseTitle,'Bài 6: Qua đường vòng quanh co');
tick(0);assert.equal(engine.currentExerciseTitle,'Bài 6: Qua đường vòng quanh co');now+=120001;assert.match(tick(-4),/Bài 6/);assert.equal(engine.score,95);
tick(-4);assert.equal(engine.score,95);now+=120000;tick(-4);assert.equal(engine.score,90);
engine.reset();assert.equal(engine.score,100);assert.notEqual(engine.currentExerciseTitle,'Bài 6: Qua đường vòng quanh co');
console.log('PASS: S timer start/end, swept rotated gates, recurring 120s, no duplicate/restart, score and reset');
