import assert from 'node:assert/strict';
import { build } from 'esbuild';
const b=await build({stdin:{contents:`export * as THREE from 'three';export {Exam07ParkingTimer} from './src/game/exercises/Exam07ParkingTimer';export {ExamEngine} from './src/game/ExamEngine';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('module','exports',b.outputFiles[0].text)(m,m.exports);
const {THREE,Exam07ParkingTimer,ExamEngine}=m.exports;
function fixture(rotation=0,vehicleClass='B') {
 const root=new THREE.Group();root.position.set(-40,0,-80);root.rotation.y=rotation;
 const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3,.12,-2.65),new THREE.Vector3(-3,.12,2.65)]));
 line.name='WidthDimension';const hidden=new THREE.Group();hidden.visible=false;hidden.add(line);root.add(hidden);root.updateMatrixWorld(true);
 return {gate:{line,vehicleClass},point:(x,z=0)=>root.localToWorld(new THREE.Vector3(x,0,z))};
}
for(const rotation of [0,Math.PI/2,-Math.PI/2,.42]) {
 const {gate,point}=fixture(rotation);const timer=new Exam07ParkingTimer();
 const tick=(now,x,z=0,gates=[gate])=>timer.update(point(x,z),gates,now);
 assert.equal(tick(500000,-1).length,0,'Approach time is excluded');
 tick(501000,-2);tick(502000,-4); // swept entrance
 assert.equal(tick(622000,-5).length,0,'Exactly 120 seconds is allowed');
 assert.equal(tick(622001,-5).length,1,'Over 120 seconds deducts 5');
 assert.equal(tick(900000,-5).length,0,'Only one deduction for this timeout');
 tick(900010,-2);assert.equal(tick(1200000,-5).length,0,'Outgoing crossing ends timer');
 timer.reset();tick(0,-2);tick(1000,-4);tick(60000,-2);
 assert.equal(tick(500000,-1).length,0,'Timely exit costs nothing');
 timer.reset();tick(0,-2);tick(1000,-3.01);tick(2000,-3.03);tick(3000,-4);
 assert.equal(tick(121001,-4).length,1,'Lingering at entry cannot count as exit');
 timer.reset();tick(0,-2,7);tick(1000,-4,7);
 assert.equal(tick(500000,-5,7).length,0,'Passing beside the gate cannot start timer');
 timer.reset();tick(0,-2,0,[{...gate,vehicleClass:'C'}]);tick(1000,-4,0,[{...gate,vehicleClass:'C'}]);
 assert.equal(tick(500000,-5,0,[{...gate,vehicleClass:'C'}]).length,0,'Wrong-class bay does not start B timer');
}
const {gate,point}=fixture();const engine=new ExamEngine('normal');
engine.wireTrafficLights({trafficLights:[],getTrafficLight:()=>undefined,parkingTimerGates:[gate]});
engine.activeIndex=6;engine.scoringStarted=true;
let now=1000;Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
const tick=x=>engine.update({position:point(x+2.1),frontPosition:point(x),speedKmh:2,rpm:800,engineRunning:true,stalled:false,leftSignal:false,seatBeltFastened:true},'idle',.016);
tick(-2);tick(-4);now+=120001;assert.match(tick(-4),/Bài 7/);assert.equal(engine.score,95);
now+=240000;tick(-4);assert.equal(engine.score,95);
engine.reset();assert.equal(engine.score,100);
console.log('PASS: WidthDimension entry/exit; rotation and hidden line; 120s boundary; one deduction; no lingering reset; class filter; score/reset');
