/** Preserve the source appearance while reducing static display geometry. */
import fs from 'node:fs';
import { build } from 'esbuild';
import { MeshoptSimplifier } from 'meshoptimizer';
const bundled = await build({ stdin: { contents: `export * as THREE from 'three';
export {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';`, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundled.outputFiles[0].text)(module, module.exports);
const { THREE, GLTFLoader, GLTFExporter } = module.exports;
globalThis.ProgressEvent ??= class {};
globalThis.FileReader ??= class {
    readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); }
};
await MeshoptSimplifier.ready;
MeshoptSimplifier.useExperimentalFeatures = true;
const input = fs.readFileSync('public/models/toyota_vios_parking.glb');
const length = input.readUInt32LE(12), json = JSON.parse(input.subarray(20, 20 + length)), bin = input.subarray(28 + length);
json.buffers = [{ byteLength: bin.length, uri: `data:application/octet-stream;base64,${bin.toString('base64')}` }];
const { scene } = await new GLTFLoader().parseAsync(JSON.stringify(json), '');
scene.rotation.y = Math.PI; scene.updateMatrixWorld(true);
const box = new THREE.Box3().setFromObject(scene), center = box.getCenter(new THREE.Vector3());
const offset = new THREE.Vector3(center.x, box.min.y, center.z);
const buckets = new Map();
let sourceTriangles = 0;
scene.traverse(mesh => {
    if (!mesh.isMesh) return;
    if (!mesh.geometry.attributes.normal) mesh.geometry.computeVertexNormals();
    const material = mesh.material;
    let bucket = buckets.get(material.name);
    if (!bucket) {
        bucket = { material, positions: [], normals: [], indices: [], vertices: new Map() };
        buckets.set(material.name, bucket);
    }
    const position = mesh.geometry.attributes.position, normal = mesh.geometry.attributes.normal, indices = mesh.geometry.index;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
    for (let i = 0; i < (indices?.count ?? position.count); i += 3) {
        sourceTriangles++;
        for (let n = 0; n < 3; n++) {
            const index = indices ? indices.getX(i + n) : i + n;
            const p = new THREE.Vector3().fromBufferAttribute(position, index).applyMatrix4(mesh.matrixWorld).sub(offset);
            const v = new THREE.Vector3().fromBufferAttribute(normal, index).applyMatrix3(normalMatrix).normalize();
            // Preserve normal seams and smooth shading, rather than averaging
            // unrelated panels or flattening the original wheel detail.
            const key = [...p.toArray(), ...v.toArray()].map(n => Math.round(n * 1e6)).join(',');
            let id = bucket.vertices.get(key);
            if (id === undefined) {
                id = bucket.positions.length / 3; bucket.vertices.set(key, id);
                bucket.positions.push(...p.toArray()); bucket.normals.push(...v.toArray());
            }
            bucket.indices.push(id);
        }
    }
});
const output = new THREE.Group(); output.name = 'ParkingViosOptimized';
let triangles = 0;
for (const bucket of buckets.values()) {
    const positions = new Float32Array(bucket.positions), normals = new Float32Array(bucket.normals);
    const [reduced] = MeshoptSimplifier.simplifyWithAttributes(new Uint32Array(bucket.indices), positions, 3,
        normals, 3, [.015, .015, .015], null,
        Math.max(3, Math.floor(bucket.indices.length * .32 / 3) * 3), .002);
    const compact = [], compactNormals = [], map = new Map(), ids = [];
    for (const id of reduced) {
        if (!map.has(id)) {
            map.set(id, compact.length / 3);
            compact.push(...positions.subarray(id * 3, id * 3 + 3));
            compactNormals.push(...normals.subarray(id * 3, id * 3 + 3));
        }
        ids.push(map.get(id));
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(compact, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(compactNormals, 3)); geometry.setIndex(ids);
    // Retain paint, trim, wheel finishes, glass tint/opacity and interior.
    const material = bucket.material.clone();
    material.flatShading = false;
    const mesh = new THREE.Mesh(geometry, material); mesh.name = `ParkingVios_${material.name}`; output.add(mesh);
    triangles += ids.length / 3;
}
output.userData = { sourceTriangles, triangles, preservesSourceNormals: true, staticDisplayOnly: true };
const result = await new GLTFExporter().parseAsync(output, { binary: true });
fs.writeFileSync('public/models/hiepphat_toyota_vios.meshopt.glb', Buffer.from(result));
console.log(JSON.stringify({ sourceTriangles, triangles, fourCarsTriangles: triangles * 4, materials: buckets.size, bytes: result.byteLength }));
