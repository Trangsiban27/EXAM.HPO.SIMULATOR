const fs = require('fs');
const path = require('path');

// Read GLB file
const glbPath = path.join(__dirname, 'public/models/hiepphat_toyota_vios_g_nowheels.glb');
const buffer = fs.readFileSync(glbPath);

// GLB is GLTF binary format
const magic = buffer.readUInt32LE(0);
if (magic !== 0x46546C67) {
    console.log('Not a valid GLB file');
    process.exit(1);
}

const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

console.log('GLB Version:', version);
console.log('File length:', length);

// Get JSON chunk
const jsonLength = buffer.readUInt32LE(12);
const jsonType = buffer.readUInt32LE(16);
console.log('JSON chunk length:', jsonLength, 'type:', jsonType);

const jsonData = buffer.slice(20, 20 + jsonLength);
const json = JSON.parse(jsonData.toString('utf8'));

// List all nodes and their names
console.log('\n=== NODES ===');
if (json.nodes) {
    json.nodes.forEach((node, i) => {
        console.log(`[${i}] name: "${node.name}", mesh: ${node.mesh}, children: ${node.children?.length || 0}`);
    });
}

// List all meshes
console.log('\n=== MESHES ===');
if (json.meshes) {
    json.meshes.forEach((mesh, i) => {
        console.log(`[${i}] name: "${mesh.name}", primitives: ${mesh.primitives.length}`);
        mesh.primitives.forEach((p, j) => {
            console.log(`  [${j}] material: ${p.material}, attributes: ${Object.keys(p.attributes).join(', ')}`);
        });
    });
}

// List materials
console.log('\n=== MATERIALS ===');
if (json.materials) {
    json.materials.forEach((mat, i) => {
        console.log(`[${i}] name: "${mat.name}", alphaMode: ${mat.alphaMode}`);
    });
}

// Search for wheel-related names
console.log('\n=== WHEEL-RELATED ===');
const allNames = [];
if (json.nodes) json.nodes.forEach(n => n.name && allNames.push(n.name));
if (json.meshes) json.meshes.forEach(m => m.name && allNames.push(m.name));

const wheelPatterns = /wheel|rim|hub|spoke|tire|tyre/i;
const lightPatterns = /light|lamp|signal|turn|head|tail/i;
const carBodyPatterns = /body|chassis|hood|trunk|door|roof|windshield|window|bumper|grille|mirror/i;

console.log('Wheel-related:', allNames.filter(n => wheelPatterns.test(n)));
console.log('Light-related:', allNames.filter(n => lightPatterns.test(n)));
console.log('Car body parts:', allNames.filter(n => carBodyPatterns.test(n)));

// Print all unique names
console.log('\n=== ALL NAMES ===');
allNames.forEach(n => console.log(n));
