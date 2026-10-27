import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({ stdin: { contents: `export * as THREE from 'three';
export { createStartCanopy } from './src/game/createStartCanopy';
export { VehicleViewOcclusion } from './src/game/VehicleViewOcclusion';`, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, createStartCanopy, VehicleViewOcclusion } = module.exports;
const scene = new THREE.Scene();
const canopy = createStartCanopy({ width: 12, depth: 10,
    position: new THREE.Vector3(), rotationY: 0 });
const vehicle = new THREE.Group();
const camera = new THREE.PerspectiveCamera();
scene.add(canopy, vehicle, camera);
const occlusion = new VehicleViewOcclusion();

vehicle.position.set(0, 0, 5);
camera.position.set(0, 12, 12);
occlusion.fade(scene, camera, vehicle);
const roof = canopy.getObjectByName('start-canopy-curved-blue-roof');
assert.equal(canopy.visible, true, 'The canopy stays visible while faded');
assert.equal(roof.material.opacity, .15, 'The roof becomes 85% transparent');
assert.equal(roof.material.transparent, true);
assert.equal(roof.material.depthWrite, false, 'The faded roof cannot occlude the car in the depth buffer');
const fadedMaterial = roof.material;
occlusion.restore();
assert.equal(roof.material.opacity, 1, 'Original opacity is restored before mirrors or develop views');
assert.equal(roof.material.transparent, false);
assert.equal(roof.material.depthWrite, true);
const originalMaterial = roof.material;

vehicle.position.set(0, 0, 1);
camera.position.set(0, 12, -20);
occlusion.fade(scene, camera, vehicle);
assert.equal(roof.material.opacity, .15, 'The road ahead is visible through the roof');
assert.equal(roof.material, fadedMaterial, 'Repeated frames reuse the faded material');
assert.equal(originalMaterial.opacity, 1, 'The original material is never modified');
occlusion.restore();

vehicle.position.set(0, 0, -1);
camera.position.set(0, 12, -1);
occlusion.fade(scene, camera, vehicle);
assert.equal(roof.material.opacity, .15, 'Partial coverage also fades the roof');
occlusion.restore();

vehicle.position.set(-30, 0, -20);
camera.position.set(-30, 12, -8);
occlusion.fade(scene, camera, vehicle);
assert.equal(roof.material, originalMaterial, 'The normal roof returns after the car passes it');

vehicle.position.set(0, 0, 5);
camera.position.set(0, 1.32, 2);
occlusion.fade(scene, camera, vehicle);
assert.equal(roof.material, originalMaterial, 'Unobstructed views below the roof keep the original material');

vehicle.position.set(0, 0, -5);
camera.position.set(0, 6, -10);
occlusion.fade(scene, camera, vehicle);
assert.equal(roof.material, originalMaterial, 'Objects beyond the car do not count as obstructions');

canopy.visible = false;
occlusion.fade(scene, camera, vehicle);
occlusion.restore();
assert.equal(canopy.visible, false, 'An already hidden canopy must stay hidden');
canopy.visible = true;

const transformed = new THREE.Scene();
const rotatedCanopy = createStartCanopy({ width: 12, depth: 10,
    position: new THREE.Vector3(20, 0, 30), rotationY: Math.PI / 2 });
transformed.add(rotatedCanopy, vehicle, camera);
rotatedCanopy.updateWorldMatrix(true, true);
vehicle.position.copy(rotatedCanopy.localToWorld(new THREE.Vector3(0, 0, 5)));
camera.position.copy(rotatedCanopy.localToWorld(new THREE.Vector3(0, 12, 12)));
occlusion.fade(transformed, camera, vehicle);
assert.equal(rotatedCanopy.getObjectByName('start-canopy-curved-blue-roof').material.opacity, .15,
    'Translated and rotated canopies use world coordinates');
occlusion.restore();
assert.equal(rotatedCanopy.getObjectByName('start-canopy-curved-blue-roof').material.opacity, 1);

console.log('PASS: 85% canopy transparency, material reuse/restore, partial coverage, outside/under-roof views, hidden state, transforms');
