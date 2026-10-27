import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
const bundle = await build({ stdin: { contents: `export * as THREE from 'three';
export {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export * from './src/game/ParkingDisplayCars';`, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, GLTFLoader, addParkingDisplayCars, PARKING_DISPLAY_POSITIONS, DISPLAY_CAR_LAYER } = module.exports;
globalThis.ProgressEvent = class {};
globalThis.document = { baseURI: 'http://localhost/' };
const bytes = fs.readFileSync('public/models/hiepphat_toyota_vios.meshopt.glb');
assert.ok(bytes.length < 2500000);
const length = bytes.readUInt32LE(12), json = JSON.parse(bytes.subarray(20, 20 + length)), bin = bytes.subarray(28 + length);
assert.equal(json.animations?.length ?? 0, 0); assert.equal(json.textures?.length ?? 0, 0);
const sourceBytes = fs.readFileSync('public/models/toyota_vios_parking.glb');
const sourceJson = JSON.parse(sourceBytes.subarray(20, 20 + sourceBytes.readUInt32LE(12)));
for (const material of json.materials) {
    const original = sourceJson.materials.find(item => item.name === material.name);
    assert.ok(original);
    assert.deepEqual(material.pbrMetallicRoughness, original.pbrMetallicRoughness, 'Original paint, trim, metal and glass finishes preserved');
    assert.equal(material.alphaMode, original.alphaMode);
    assert.equal(material.doubleSided, original.doubleSided);
}
json.buffers = [{ byteLength: bin.length, uri: `data:application/octet-stream;base64,${bin.toString('base64')}` }];
const source = await new GLTFLoader().parseAsync(JSON.stringify(json), '');
let loads = 0;
GLTFLoader.prototype.loadAsync = async url => { loads++; assert.ok(url.endsWith('/hiepphat_toyota_vios.meshopt.glb')); return source; };
const parent = new THREE.Group(); const group = await addParkingDisplayCars(parent);
assert.equal(group.children.length, 6); assert.equal(PARKING_DISPLAY_POSITIONS.length, 8);
let triangles = 0;
for (const mesh of group.children) {
    assert.ok(mesh.isInstancedMesh); assert.equal(mesh.count, 8);
    assert.equal(mesh.castShadow, false); assert.equal(mesh.receiveShadow, false);
    assert.equal(mesh.matrixAutoUpdate, false);
    assert.equal(mesh.layers.mask, 1 << DISPLAY_CAR_LAYER);
    assert.ok(!new THREE.PerspectiveCamera().layers.test(mesh.layers), 'Auxiliary cameras cannot render cars');
    triangles += mesh.geometry.index.count / 3;
    for (let i = 0; i < PARKING_DISPLAY_POSITIONS.length; i++) {
        const matrix = new THREE.Matrix4(); mesh.getMatrixAt(i, matrix);
        const p = new THREE.Vector3().setFromMatrixPosition(matrix);
        assert.ok(Math.abs(p.x - PARKING_DISPLAY_POSITIONS[i].x) < 1e-5);
        assert.ok(Math.abs(p.z - PARKING_DISPLAY_POSITIONS[i].z) < 1e-5);
    }
}
assert.ok(triangles > 50000 && triangles < 100000);
await addParkingDisplayCars(new THREE.Group()); assert.equal(loads, 1, 'Asset loads once and shares resources');
console.log(`PASS: ${bytes.length} bytes, ${triangles} triangles/car, eight static instances, six material batches, no shadows/animation, excluded from auxiliary cameras, single asset load`);
