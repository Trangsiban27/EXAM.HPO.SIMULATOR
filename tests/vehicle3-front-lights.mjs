import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
const b=await build({stdin:{contents:`export * as THREE from 'three';export {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';export {Vehicle3} from './src/game/Vehicle3';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('module','exports',b.outputFiles[0].text)(m,m.exports);
const {THREE,GLTFLoader,Vehicle3}=m.exports;
globalThis.ProgressEvent=class{constructor(type,init){Object.assign(this,init)}};
const glb=fs.readFileSync('public/models/toyota_vios_g.glb');
const jsonLength=glb.readUInt32LE(12),json=JSON.parse(glb.subarray(20,20+jsonLength));
const bin=glb.subarray(28+jsonLength);
json.buffers=[{byteLength:bin.length,uri:'data:application/octet-stream;base64,'+bin.toString('base64')}];
// Keep the real body geometry and hierarchy; skip image decoding in this Node test.
json.images=[];json.textures=[];json.materials=json.materials.map(mat=>({name:mat.name,pbrMetallicRoughness:{baseColorFactor:[1,1,1,1]}}));
const {scene:model}=await new GLTFLoader().parseAsync(JSON.stringify(json),'');
const car=new Vehicle3();car.attachModel(model);car.root.updateWorldMatrix(true,true);
const lamps=['FrontTurnSignalLeft','FrontTurnSignalRight'].map(name=>car.root.getObjectByName(name));
assert.ok(lamps.every(Boolean),'Both front lenses must fit real body geometry');
const ray=new THREE.Raycaster();
const direction=new THREE.Vector3(0,0,1).transformDirection(car.visual.matrixWorld);
for(const lamp of lamps) {
 const pos=lamp.geometry.getAttribute('position');
 for(let i=0;i<pos.count;i++) {
  const local=new THREE.Vector3().fromBufferAttribute(pos,i);
  assert.ok(local.y>.66&&local.y<.74,'Lenses are in headlamp clusters, below the bonnet');
  assert.ok(local.z< -1.7&&local.z> -2.05,'Lens stays at front body surface');
  const world=lamp.localToWorld(local.clone());
  ray.set(world.clone().addScaledVector(direction,-.02),direction);
  const surface=ray.intersectObject(model,true)[0];
  assert.ok(surface&&surface.point.distanceTo(world)<.012,'Every vertex sits flush with actual body');
 }
 const normals=lamp.geometry.getAttribute('normal');
 for(let i=0;i<normals.count;i++)assert.ok(normals.getZ(i)<0,'Lens faces outward at front');
}
let now=0;Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
car.setSignal({left:true,right:false,hazard:false});car.updateSignalBlink();
assert.equal(lamps[0].material.emissive.getHex(),0xffa000);
assert.equal(lamps[1].material.emissive.getHex(),0);
assert.equal(lamps[1].material.color.getHex(),0xb7bec0,'Unlit lens is neutral silver');
now=600;car.updateSignalBlink();assert.equal(lamps[0].material.emissive.getHex(),0);
now=0;car.setSignal({left:false,right:false,hazard:true});car.updateSignalBlink();
assert.ok(lamps.every(lamp=>lamp.material.emissive.getHex()===0xffa000));
console.log('PASS: actual Vios GLB; both front lenses fit headlamp surfaces, face outward, blink independently and with hazards');
const rearNames=['RearTurnSignalLeft','RearTurnSignalRight','RearBrakeLightLeft','RearBrakeLightRight'];
const rear=rearNames.map(name=>car.root.getObjectByName(name));
assert.ok(rear.every(Boolean),'All rear lamps must fit original tail-light clusters');
const rearDirection=new THREE.Vector3(0,0,-1).transformDirection(car.visual.matrixWorld);
for(const lamp of rear) {
 const pos=lamp.geometry.getAttribute('position'),normals=lamp.geometry.getAttribute('normal');
 for(let i=0;i<pos.count;i++) {
  const local=new THREE.Vector3().fromBufferAttribute(pos,i);
  assert.ok(local.y>.77&&local.y<.89,'Rear lamps stay below boot lid');
  assert.ok(local.z>2.06&&local.z<2.26,'Rear lens remains on original body');
  assert.ok(normals.getZ(i)>0,'Rear lens faces outward');
  const world=lamp.localToWorld(local.clone());
  ray.set(world.clone().addScaledVector(rearDirection,-.02),rearDirection);
  const surface=ray.intersectObject(model,true)[0];
  assert.ok(surface&&surface.point.distanceTo(world)<.012,'Every rear vertex sits flush');
 }
 const size=lamp.geometry.boundingBox.getSize(new THREE.Vector3());
 assert.ok(size.x<.15&&size.y<.06,'Rear lenses have small strip footprints');
}
car.setSignal({left:true,right:false,hazard:false});car.updateSignalBlink();car.updateBrakeLights(true);
assert.equal(rear[0].material.emissive.getHex(),0xffa000);
assert.equal(rear[1].material.emissive.getHex(),0);
assert.ok(rear.slice(2).every(lamp=>lamp.material.emissive.getHex()===0xff1018),'Brake lamps work alongside indicator');
now=600;car.updateSignalBlink();
assert.ok(rear.slice(2).every(lamp=>lamp.material.emissive.getHex()===0xff1018),'Blink does not turn off braking');
car.updateBrakeLights(false);
assert.ok(rear.slice(2).every(lamp=>lamp.material.emissive.getHex()===0));
now=0;car.setSignal({left:false,right:false,hazard:true});car.updateSignalBlink();
assert.ok(rear.slice(0,2).every(lamp=>lamp.material.emissive.getHex()===0xffa000));
console.log('PASS: four flush rear strips on actual GLB; outward normals; independent indicators, hazards and braking');
