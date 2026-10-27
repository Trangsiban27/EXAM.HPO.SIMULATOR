import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { build } from 'esbuild';

const bundle = await build({ stdin: { contents: `export * as THREE from 'three';
 export { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
 export { Vehicle3 } from './src/game/Vehicle3';
 export { configureSunShadows } from './src/game/shadowStyle';`, resolveDir: process.cwd() },
 bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, GLTFLoader, Vehicle3, configureSunShadows } = module.exports;
globalThis.ProgressEvent = class { constructor(type, init) { Object.assign(this, init); } };
const buffer = fs.readFileSync('public/models/hiepphat_toyota_vios_g_nowheels.glb');
const jsonLength = buffer.readUInt32LE(12), source = JSON.parse(buffer.subarray(20,20+jsonLength));
assert.equal(source.images?.length ?? 0, 0);
assert.equal(source.textures?.length ?? 0, 0);
assert.ok(source.materials.every(material => !material.normalTexture));
const bin = buffer.subarray(28+jsonLength);
source.buffers = [{ byteLength: bin.length, uri: `data:application/octet-stream;base64,${bin.toString('base64')}` }];
const { scene: model } = await new GLTFLoader().parseAsync(JSON.stringify(source), '');
const meshes = [], materials = new Set(), faces = new Set();
let triangles = 0, duplicates = 0;
const geometryHash = geometry => {
 const hash = crypto.createHash('sha256');
 for (const attribute of [geometry.index, ...Object.values(geometry.attributes)]) {
  if (attribute) hash.update(new Uint8Array(attribute.array.buffer, attribute.array.byteOffset, attribute.array.byteLength));
 }
 return hash.digest('hex');
};
model.traverse(mesh => {
 if (!(mesh instanceof THREE.Mesh)) return;
 meshes.push({ mesh, hash: geometryHash(mesh.geometry) });
 for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material);
 const positions = mesh.geometry.getAttribute('position'), indices = mesh.geometry.index;
 for (let i = 0; i < (indices?.count ?? positions.count); i += 3) {
  const vertices = [0,1,2].map(offset => {
   const index = indices ? indices.getX(i+offset) : i+offset;
   return [positions.getX(index), positions.getY(index), positions.getZ(index)]
    .map(value => Math.round(value*1e6)).join(',');
  }).sort().join('|');
  if (faces.has(vertices)) duplicates++; else faces.add(vertices);
  triangles++;
 }
});
assert.equal(duplicates,0,'No duplicate triangle surfaces, within or across the nine original meshes');
const beforeMaterials = new Map([...materials].map(material => [material, JSON.stringify(material.toJSON())]));
const vehicle = new Vehicle3(); vehicle.attachModel(model);
let glassMeshes = 0;
for (const { mesh, hash } of meshes) {
 assert.equal(geometryHash(mesh.geometry),hash,'Positions, normals, indices and dimensions remain unchanged');
 const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
 const glass = list.every(material => material.transparent && material.opacity < 1);
 assert.equal(mesh.castShadow,!glass);
 assert.equal(mesh.receiveShadow,true);
 if(glass)glassMeshes++;
}
assert.equal(glassMeshes,3);
for (const material of materials) {
 assert.equal(JSON.stringify(material.toJSON()),beforeMaterials.get(material),
  'Paint, glass, interior materials, opacity, sides, and polygonOffset must remain unchanged');
}
const sun = new THREE.DirectionalLight();
const cameraBefore = sun.shadow.camera.toJSON(), mapBefore = sun.shadow.mapSize.clone();
configureSunShadows(sun);
assert.equal(sun.shadow.bias,-.0003);assert.equal(sun.shadow.normalBias,.04);
assert.deepEqual(sun.shadow.camera.toJSON(),cameraBefore);assert.ok(sun.shadow.mapSize.equals(mapBefore));
const result = { meshes: meshes.length, triangles, duplicates, textures: source.textures?.length ?? 0,
 normalMaps: 0, transparentMeshesWithoutSolidShadows: glassMeshes,
 assetSha256: crypto.createHash('sha256').update(buffer).digest('hex'),
 geometryAndMaterialsUnchanged: true, bias: sun.shadow.bias, normalBias: sun.shadow.normalBias };
if (process.env.VIOS_DIAGNOSTICS_DIR) fs.writeFileSync(`${process.env.VIOS_DIAGNOSTICS_DIR}/structure.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
