import assert from 'node:assert/strict';
import { build } from 'esbuild';
const b=await build({stdin:{contents:`export * as THREE from 'three';export {ParkingBoundaryScoring} from './src/game/exercises/ParkingBoundaryScoring';export {PerpendicularParkingBayB} from './src/game/PerpendicularParkingBayB';export {PerpendicularParkingBayC} from './src/game/PerpendicularParkingBayC';export {ExamEngine} from './src/game/ExamEngine';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('module','exports',b.outputFiles[0].text)(m,m.exports);
const {THREE,ParkingBoundaryScoring,PerpendicularParkingBayB,PerpendicularParkingBayC,ExamEngine}=m.exports;
for(const rotation of [0,.71,Math.PI/2]) {
 const root=new THREE.Group();root.position.set(-40,0,-70);root.rotation.y=rotation;
 const boundary=new THREE.Group();root.add(boundary);
 const paint=new THREE.Mesh(new THREE.BoxGeometry(.04,.01,6));boundary.add(paint);
 const entrance=new THREE.Mesh(new THREE.BoxGeometry(3,.01,.1));entrance.position.set(0,.1,10);root.add(entrance);
 root.updateMatrixWorld(true);
 const scorer=new ParkingBoundaryScoring([boundary]);
 const point=(x,z=0)=>root.localToWorld(new THREE.Vector3(x,.35,z));
 const tick=(ms,x,z=0,count=1)=>scorer.update(Array.from({length:count},()=>point(x,z)),ms);
 assert.equal(tick(0,.121).length,0,'Tyre does not yet touch actual paint');
 assert.equal(tick(100,.119).length,1,'Tyre edge touches paint');
 assert.equal(tick(5100,0).length,0,'Exactly 5 seconds adds nothing');
 assert.equal(tick(5101,0).length,1,'Over 5 seconds costs 5');
 assert.equal(tick(5102,0).length,0,'No per-frame duplicate');
 assert.equal(tick(10101,0).length,1,'Next continuous 5 seconds costs 5');
 tick(10102,1);
 assert.equal(tick(10200,0).length,1,'Re-entry costs 5 without a 3-second cooldown');
 scorer.reset();assert.equal(tick(0,0,0,4).length,1,'Four wheels in same contact do not duplicate event');
 scorer.reset();tick(0,1);assert.equal(tick(16,-1).length,1,'Fast crossing cannot skip thin line');
 assert.equal(tick(32,-2).length,0,'Leaving line is not another offence');
 scorer.reset();assert.equal(tick(200000,0,10).length,0,'Entrance marking outside boundary group is excluded');
}
const ringGroup=new THREE.Group();
ringGroup.add(new THREE.Mesh(new THREE.RingGeometry(1.98,2.02,64,1,0,Math.PI/2).rotateX(-Math.PI/2)));
const ringScorer=new ParkingBoundaryScoring([ringGroup]);
assert.equal(ringScorer.update([new THREE.Vector3(1,0,-1)],0).length,0,'Curved line bounding-box interior is safe');
assert.equal(ringScorer.update([new THREE.Vector3(Math.SQRT2,.35,-Math.SQRT2)],16).length,1,'Curved painted line is detected');
for(const Bay of [PerpendicularParkingBayB,PerpendicularParkingBayC]) {
 const bay=new Bay({x:20,z:-60,rotationY:.63,mainRoadBottomRadiusM:1,parkingBottomRadiusM:.5});
 const scorer=new ParkingBoundaryScoring([bay.examBoundaryGroup]);
 bay.root.updateMatrixWorld(true);
 let tested=0;
 bay.examBoundaryGroup.traverse(mesh=>{
  if(!(mesh instanceof THREE.Mesh))return;
  const pos=mesh.geometry.getAttribute('position'),idx=mesh.geometry.index;
  for(let i=0;i<(idx?.count??pos.count);i+=3) {
   const point=j=>new THREE.Vector3().fromBufferAttribute(pos,idx?idx.getX(i+j):i+j).applyMatrix4(mesh.matrixWorld);
   const a=point(0),b=point(1),c=point(2);
   if(Math.abs((b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x))<1e-8)continue;
   const wheel=a.add(b).add(c).divideScalar(3);wheel.y=.35;
   scorer.reset();assert.equal(scorer.update([wheel],0).length,1,`${Bay.name}/${mesh.name}`);tested++;break;
  }
 });
 assert.ok(tested>=10,'All straight and curved yellow boundary meshes tested');
}
const group=new THREE.Group();group.add(new THREE.Mesh(new THREE.BoxGeometry(.04,.01,5)));
const engine=new ExamEngine('normal');engine.wireTrafficLights({trafficLights:[],getTrafficLight:()=>undefined,perpendicularParkingBoundaryGroups:[group]});
let now=1000;Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
const sample={position:new THREE.Vector3(),frontPosition:new THREE.Vector3(2.1,0,0),wheelPositions:{FL:new THREE.Vector3(0,.35,0)},speedKmh:0,rpm:800,engineRunning:true,stalled:false,leftSignal:false,seatBeltFastened:true};
engine.update(sample,'idle',.016);assert.equal(engine.score,100,'No deductions before start');
engine.startFromLesson(7);engine.update(sample,'idle',.016);assert.equal(engine.score,95);
now+=5001;engine.update(sample,'idle',.016);assert.equal(engine.score,90);
engine.reset();assert.equal(engine.score,100);
console.log('PASS: all B/C boundary meshes; actual tyre overlap; curves; 5s repeats; release/re-entry; swept contact; entrance exclusion; scoring gate/reset');
