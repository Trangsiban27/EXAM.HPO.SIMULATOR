import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
const output = await build({ stdin: { contents: `export * as THREE from 'three';
export { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export { Vehicle3 } from './src/game/Vehicle3';`, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', output.outputFiles[0].text)(module, module.exports);
const { THREE, GLTFLoader, Vehicle3 } = module.exports;
globalThis.ProgressEvent = class {};
async function load(path) {
    const data = fs.readFileSync(path), length = data.readUInt32LE(12);
    const json = JSON.parse(data.subarray(20, 20 + length));
    const bin = data.subarray(28 + length);
    json.buffers = [{ byteLength: bin.length, uri: `data:application/octet-stream;base64,${bin.toString('base64')}` }];
    return (await new GLTFLoader().parseAsync(JSON.stringify(json), '')).scene;
}
const body = await load('public/models/hiepphat_toyota_vios_g_nowheels.glb');
const geometryBefore = [];
body.traverse(mesh => { if (mesh.isMesh) geometryBefore.push([mesh, mesh.geometry, mesh.material]); });
const car = new Vehicle3(); car.attachModel(body); car.root.updateMatrixWorld(true);
assert.ok(Math.abs(body.position.y - .07782500237226532) < 1e-7, 'Body uses calibrated contact, not underbody contact');
assert.ok(new THREE.Box3().setFromObject(body).min.y > .18, 'Underbody retains road clearance');
for (const [mesh, geometry, material] of geometryBefore) {
    assert.equal(mesh.geometry, geometry); assert.equal(mesh.material, material);
}
let triangles = 0, meshCount = 0;
const tyreGeometries = new Set(), alloyGeometries = new Set();
for (const id of ['FL', 'FR', 'RL', 'RR']) {
    const pivot = car.wheelAssembly.getWheel(id);
    const tyre = pivot.getObjectByName('ProceduralTyre');
    const face = pivot.getObjectByName('ProceduralAlloyFace');
    assert.ok(tyre && face, `${id} has one procedural tyre and alloy face`);
    assert.equal(pivot.children.filter(child => child.name.endsWith('RollingPivot')).length, 1);
    const bounds = new THREE.Box3().setFromObject(tyre);
    assert.ok(Math.abs(bounds.min.y) < .002, `${id} tyre touches ground`);
    assert.ok(bounds.getSize(new THREE.Vector3()).y > .58, 'Tyre retains its calibrated diameter');
    assert.ok(Math.abs(pivot.position.y - .297) < 1e-8, 'Scoring pivot height unchanged');
    assert.ok(id.endsWith('L') ? face.position.x < -.08 : face.position.x > .08, 'Rim faces outward');
    const caliper = pivot.getObjectByName('BrakeCaliper');
    assert.notEqual(caliper.parent.parent, tyre.parent, 'Caliper does not spin with tyre');
    tyreGeometries.add(tyre.geometry);
    alloyGeometries.add(pivot.getObjectByName('SplitFiveSpokeAlloy').geometry);
    pivot.traverse(mesh => { if (mesh.isMesh) {
        meshCount++; triangles += (mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count) / 3;
    } });
}
assert.equal(tyreGeometries.size, 1, 'Tyre geometry shared by four wheels');
assert.equal(alloyGeometries.size, 1, 'Alloy geometry shared by four wheels');
assert.equal(meshCount, 20, 'Five batched meshes per wheel');
assert.ok(triangles < 40000);
assert.ok(!fs.readFileSync('src/game/Vehicle3.ts', 'utf8').includes('toyota_vios_g_wheels.glb'));
const before = car.wheelAssembly.rolling.map(roll => roll.rotation.x);
car.wheelAssembly.updateRolling(3, .1);
car.wheelAssembly.rolling.forEach((roll, index) => assert.notEqual(roll.rotation.x, before[index]));
car.wheelAssembly.reset();
assert.ok(car.wheelAssembly.rolling.every(roll => roll.rotation.x === 0));
assert.equal(car.wheelAssembly.frontPivots.length, 2);
console.log(`PASS: original ground clearance, unchanged body geometry/materials and scoring pivots, four procedural wheels (${triangles} triangles, ${meshCount} meshes), rolling/reset`);
