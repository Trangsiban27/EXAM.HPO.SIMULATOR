import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({
    stdin: {
        contents: `export * as THREE from 'three';
            export { RedWhiteCurbContact } from './src/game/RedWhiteCurbContact';
            export { ExamEngine } from './src/game/ExamEngine';
            export { StartApproachVoice } from './src/ui/StartApproachVoice';`,
        resolveDir: process.cwd(),
    },
    bundle: true, write: false, platform: 'node', format: 'cjs',
});
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, RedWhiteCurbContact, ExamEngine, StartApproachVoice } = module.exports;
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const wheelsAt = (x, z = 0) => ({
    FL: new THREE.Vector3(x, .297, z),
    FR: new THREE.Vector3(100, .297, 100),
    RL: new THREE.Vector3(102, .297, 100),
    RR: new THREE.Vector3(104, .297, 100),
});

// White road markings remain harmless, even if legacy names are present.
const whiteOnly = new THREE.Group();
const whiteLine = new THREE.Mesh(new THREE.BoxGeometry(.1, .005, 4), material);
whiteLine.name = 'legacy-red-white-curb';
whiteOnly.add(whiteLine);
assert.equal(new RedWhiteCurbContact(whiteOnly).touches(wheelsAt(0)), false);

const root = new THREE.Group();
const curb = new THREE.Mesh(new THREE.BoxGeometry(.3, .22, 4), material);
curb.name = 'raised-sidewalk';
curb.position.y = .17;
curb.userData.sidewalkCurb = true;
root.add(curb);
const contact = new RedWhiteCurbContact(root);
assert.equal(contact.touches(wheelsAt(-.4)), false, 'A wheel clear of the sidewalk is safe');
assert.equal(contact.touches(wheelsAt(-.29)), true, 'The tire edge can touch the curb before its center');
contact.reset();
assert.equal(contact.touches(wheelsAt(0)), true, 'Direct sidewalk contact is detected');
contact.reset();
assert.equal(contact.touches(wheelsAt(-1)), false);
assert.equal(contact.touches(wheelsAt(1)), true, 'A fast wheel sweep across the curb is detected');
contact.reset();
assert.equal(contact.touches(wheelsAt(1)), false, 'Reset prevents a stale teleport sweep');

// Contact geometry follows transformed map modules, not their original local coordinates.
const transformedRoot = new THREE.Group();
const moduleRoot = new THREE.Group();
moduleRoot.position.set(10, .3, 5);
moduleRoot.rotation.y = Math.PI / 2;
moduleRoot.scale.set(1.2, 1, .8);
moduleRoot.add(curb.clone());
transformedRoot.add(moduleRoot);
transformedRoot.updateMatrixWorld(true);
const transformedContact = new RedWhiteCurbContact(transformedRoot);
const localContact = new THREE.Vector3(0, 0, .9).applyMatrix4(moduleRoot.matrixWorld);
assert.equal(transformedContact.touches(wheelsAt(localContact.x, localContact.z)), true);
transformedContact.reset();
assert.equal(transformedContact.touches(wheelsAt(0)), false);
moduleRoot.visible = false;
assert.equal(new RedWhiteCurbContact(transformedRoot).touches(wheelsAt(localContact.x, localContact.z)), false);

// Every wheel participates, including the rear passenger-side wheel.
for (const id of ['FL', 'FR', 'RL', 'RR']) {
    contact.reset();
    const wheels = wheelsAt(100);
    wheels[id].set(0, .297, 0);
    assert.equal(contact.touches(wheels), true, `${id} must detect sidewalk contact`);
}

const normal = new ExamEngine('normal');
assert.equal(normal.disqualifyForRedWhiteCurb(), false, 'Contact before start does not disqualify');
normal.startFromLesson(2);
assert.equal(normal.disqualifyForRedWhiteCurb(), true);
assert.equal(normal.isFinished, true);
assert.equal(normal.disqualifyReason, 'Lái xe lên vỉa hè');
assert.equal(normal.disqualifyForRedWhiteCurb(), false, 'A finished attempt is not disqualified again');
normal.reset();
assert.equal(normal.disqualifyForRedWhiteCurb(), false, 'A reset attempt awaits its start command');
const errorsOnly = new ExamEngine('errors-only');
errorsOnly.startFromLesson(2);
assert.equal(errorsOnly.disqualifyForRedWhiteCurb(), false);
assert.equal(errorsOnly.isFinished, false);

// The renamed error retains its existing curb-disqualification recording.
const originalWindow = globalThis.window;
const originalAudio = globalThis.Audio;
const audio = [];
try {
    globalThis.window = new EventTarget();
    globalThis.Audio = class {
        constructor(src) { this.src = src; audio.push(this); }
        play() { return Promise.resolve(); }
        pause() {}
    };
    const voice = new StartApproachVoice({
        onInstructionsEnded() {}, onStartAnnouncement() {}, onStartEnded() {},
    });
    voice.reportEvents([], 'Lái xe lên vỉa hè', true);
    assert.equal(audio.length, 1);
    assert.equal(audio[0].src, '/voice/bai1/laixelenviahe_biloai.mp3');
    voice.reset();
} finally {
    globalThis.window = originalWindow;
    globalThis.Audio = originalAudio;
}

console.log('PASS: harmless white lines; raised-curb tire edges, sweeps, transforms and four wheels; exam guards; sidewalk voice');
