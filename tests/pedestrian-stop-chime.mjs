import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({ stdin: { contents: `export * as THREE from 'three';
export { ExamEngine } from './src/game/ExamEngine';
export { EXAM_02_STOP_LINE_X } from './src/game/exam/examCourseGeometry';
export { startPosition, FRONT_PROBE_OFFSET_M } from './src/game/startPosition';`, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, ExamEngine, EXAM_02_STOP_LINE_X, startPosition, FRONT_PROBE_OFFSET_M } = module.exports;
const originalPerformance = Object.getOwnPropertyDescriptor(globalThis, 'performance');
const originalAudio = globalThis.Audio;
let now = 1000;
const clips = [];
Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });
globalThis.Audio = class {
    paused = false;
    constructor(src) { this.src = src; clips.push(this); }
    play() { return Promise.resolve(); }
    pause() { this.paused = true; }
};

function attempt() {
    const exam = new ExamEngine('normal');
    exam.startFromLesson(2);
    const tick = (ms, { distance = .2, speed = 0, z = startPosition.lineZ + startPosition.laneOffset } = {}) => {
        now += ms;
        const front = new THREE.Vector3(EXAM_02_STOP_LINE_X - distance, .06, z);
        exam.update({ position: front.clone().add(new THREE.Vector3(-FRONT_PROBE_OFFSET_M, 0, 0)),
            frontPosition: front, speedKmh: speed, rpm: 800, engineRunning: true, stalled: false,
            seatBeltFastened: true, leftSignal: false, clutch: 1 }, 'idle', .016);
    };
    return { exam, tick };
}

try {
    const valid = attempt();
    valid.tick(0); valid.tick(300);
    assert.equal(valid.exam.pedestrianExercise.stopClassification, 'VALID_STOP');
    assert.equal(valid.exam.score, 100, 'Stop scoring still recognises the original 0.3 s dwell');
    valid.tick(1699);
    assert.equal(clips.length, 0, 'No recording before two seconds stopped');
    valid.tick(1);
    assert.equal(clips.length, 1);
    assert.equal(clips[0].src, '/voice/bai3/chuonghoanthanhbai.mp3');
    valid.tick(5000); valid.tick(100, { speed: 2 }); valid.tick(100); valid.tick(2000);
    assert.equal(clips.length, 1, 'Holding the brake and stopping again cannot repeat the chime');
    valid.exam.reset();
    assert.equal(clips[0].paused, true, 'Restart stops the previous recording');
    valid.exam.startFromLesson(2); valid.tick(0); valid.tick(2000);
    assert.equal(clips.length, 2, 'Restart rearms the cue');
    valid.exam.reset();

    const interrupted = attempt();
    interrupted.tick(0); interrupted.tick(1500);
    interrupted.tick(100, { speed: .6 });
    interrupted.tick(100); interrupted.tick(1999);
    assert.equal(clips.length, 2, 'Movement resets the full two-second countdown');
    interrupted.tick(1);
    assert.equal(clips.length, 3);
    interrupted.exam.reset();

    for (const settings of [{ distance: .6 }, { distance: -.1 }, { z: startPosition.lineZ + 10 }]) {
        const invalid = attempt();
        invalid.tick(0, settings); invalid.tick(300, settings); invalid.tick(2000, settings);
        assert.equal(clips.length, 3, 'An invalid stopping position cannot confirm completion');
        invalid.exam.reset();
    }

    const departed = attempt();
    departed.tick(0); departed.tick(300);
    departed.tick(200, { distance: -6, speed: 5 });
    departed.tick(3000, { distance: -7, speed: 5 });
    assert.equal(clips.length, 3, 'Leaving before two seconds must not play a delayed chime');
    departed.exam.reset();

    const hill = new ExamEngine('normal');
    hill.hillExercise.playReadyBeep();
    assert.equal(clips.at(-1).src, '/voice/bai3/chuonghoanthanhbai.mp3', 'The hill still uses the same recording');
    hill.reset();
    assert.equal(clips.at(-1).paused, true);
    console.log('PASS: valid pedestrian stop rings at 2 s once; movement/invalid positions/exit/reset; hill recording preserved');
} finally {
    Object.defineProperty(globalThis, 'performance', originalPerformance);
    if (originalAudio === undefined) delete globalThis.Audio; else globalThis.Audio = originalAudio;
}
