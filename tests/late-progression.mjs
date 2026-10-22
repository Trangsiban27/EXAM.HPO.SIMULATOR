import assert from 'node:assert/strict';
import { build } from 'esbuild';
const b=await build({stdin:{contents:`export * as THREE from 'three';export {ExamEngine} from './src/game/ExamEngine';export {AUTO_DRIVE_WAYPOINTS_BY_CLASS} from './src/game/autoDrive/autoDriveRoutes';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('module','exports',b.outputFiles[0].text)(m,m.exports);
const {THREE,ExamEngine,AUTO_DRIVE_WAYPOINTS_BY_CLASS}=m.exports;
const p=(x,z)=>new THREE.Vector3(x,0,z);
const root=new THREE.Group();
const courseRoot=new THREE.Group();root.add(courseRoot);
for(const [name,x,z] of [['start',0,0],['end',-10,5]]) {
 const gate=new THREE.Group();gate.name=`s-curve-${name}-yellow-dashed-line`;
 for(const dz of [-1,1]) {const dash=new THREE.Object3D();dash.position.set(x,.09,z+dz);gate.add(dash);}courseRoot.add(gate);
}
const parkingLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.12,-3),new THREE.Vector3(0,.12,3)]));
parkingLine.position.x=-30;parkingLine.name='WidthDimension';root.add(parkingLine);
const railParent=new THREE.Group();railParent.position.set(200,0,100);root.add(railParent);
const rail=new THREE.Mesh(new THREE.PlaneGeometry(7,.2));rail.rotation.x=-Math.PI/2;
rail.name='road-11a-railway-white-line';railParent.add(rail);
const finish=new THREE.Mesh(new THREE.BoxGeometry(.2,.01,7));finish.position.set(290,0,0);finish.name='EX11_FINISH_LINE';root.add(finish);
root.updateMatrixWorld(true);
const finishLight={isVehicleInTriggerZone:position=>position.x>=300&&position.x<=302&&Math.abs(position.z)<2};
const track={root,trafficLights:[],getTrafficLight:id=>id==='WEST'?finishLight:undefined,
 getWindingCourses:()=>[{vehicleClass:'B',course:{root:courseRoot,width:4}}],
 parkingTimerGates:[{line:parkingLine,vehicleClass:'B'}]};
let now=1000;Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
const engine=new ExamEngine('normal');engine.wireTrafficLights(track);
const tick=(front,position=front.clone().add(p(2.1,0)))=>{now+=100;return engine.update({position,frontPosition:front,speedKmh:5,rpm:800,engineRunning:true,stalled:false,leftSignal:false,seatBeltFastened:true},'idle',.016);};
engine.startFromLesson(6);
assert.equal(engine.currentExerciseTitle,'Đang đến bài 6');
tick(p(1,0));tick(p(-1,0));
assert.equal(engine.activeIndex,5);assert.match(engine.currentExerciseTitle,/Bài 6:/);
tick(p(-9,5));tick(p(-11,5));
assert.equal(engine.activeIndex,6);assert.equal(engine.currentExerciseTitle,'Đang đến bài 7');
tick(p(-28,0));tick(p(-31,0));
assert.match(engine.currentExerciseTitle,/Bài 7:/);
tick(p(-28,0));
assert.equal(engine.activeIndex,7);assert.equal(engine.currentExerciseTitle,'Đang đến bài 8');
tick(p(200,91));
assert.equal(engine.activeIndex,7);assert.match(engine.currentExerciseTitle,/Bài 8:/);
const anchors=AUTO_DRIVE_WAYPOINTS_BY_CLASS.B.exam08ToExam09;
function anchorTick(id,distance,lateral=0) {
 const a=anchors.find(point=>point.popupLessonId===id);
 const forward=p(-Math.sin(a.heading),-Math.cos(a.heading));const right=p(forward.z,-forward.x);
 const position=p(a.x,a.z).addScaledVector(forward,distance).addScaledVector(right,lateral);
 return tick(position.clone().addScaledVector(forward,2.1),position);
}
anchorTick(9,-1);anchorTick(9,1);
assert.equal(engine.activeIndex,8);assert.match(engine.currentExerciseTitle,/Bài 9:/);
anchorTick(10,-1);anchorTick(10,1);
assert.equal(engine.activeIndex,9);assert.match(engine.currentExerciseTitle,/Bài 10:/);
assert.equal(engine.isFinished,false);
tick(p(298.9,0),p(301,0));
assert.equal(engine.activeIndex,10);assert.match(engine.currentExerciseTitle,/Bài 11:/);
assert.equal(engine.isFinished,false);
tick(p(288.9,0),p(291,0));
assert.equal(engine.isFinished,true);assert.equal(engine.disqualified,false);
assert.equal(engine.currentExerciseTitle,'Hoàn thành bài thi');assert.equal(engine.score,100);
engine.startFromLesson(9);assert.equal(engine.activeIndex,8);assert.equal(engine.isFinished,false);
anchorTick(9,-1,10);anchorTick(9,1,10);
assert.equal(engine.currentExerciseTitle,'Đang đến bài 9','Adjacent road must not activate anchor');
anchorTick(9,2);anchorTick(9,-1);
assert.equal(engine.currentExerciseTitle,'Đang đến bài 9','Reverse crossing does not enter lesson');
anchorTick(9,1);assert.match(engine.currentExerciseTitle,/Bài 9:/);
engine.startFromLesson(11);assert.equal(engine.currentExerciseTitle,'Đang đến bài 11');
tick(p(288.9,0),p(291,0));assert.equal(engine.isFinished,false,'Must enter lesson 11 before finish');
engine.reset();assert.equal(engine.activeIndex,0);assert.equal(engine.approaching,true);
console.log('PASS: full manual progression 6→7→8→9→10→11→finish; HUD; selected lessons; lateral/direction guards; reset');
