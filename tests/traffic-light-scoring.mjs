import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({
    stdin: {
        contents: `export * as THREE from 'three';
            export { TrafficLight } from './src/game/TrafficLight';
            export { TrafficLightScoring } from './src/game/exercises/TrafficLightScoring';
            export { ExamEngine } from './src/game/ExamEngine';`,
        resolveDir: process.cwd(),
    },
    bundle: true, write: false, platform: 'node', format: 'cjs',
});
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, TrafficLight, TrafficLightScoring, ExamEngine } = module.exports;
globalThis.document = { createElement: () => ({ getContext: () => ({ fillRect() {}, fillText() {} }) }) };
let now = 1000;
Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });

function fixture(rotation, origin = 0, markerId = 'TEST', alwaysGreen = false) {
    const matrix = new THREE.Matrix4().makeTranslation(origin, 0, 0)
        .multiply(new THREE.Matrix4().makeRotationY(rotation));
    const stopBar = new THREE.Mesh(new THREE.BoxGeometry(4, .012, .5));
    stopBar.position.set(0, .095, 1);
    stopBar.applyMatrix4(matrix);
    const exits = new THREE.Box3(new THREE.Vector3(-8, -1, -10), new THREE.Vector3(8, 3, 0))
        .applyMatrix4(matrix);
    const light = new TrafficLight(origin, 0, 4, rotation, {
        markerId, alwaysGreen, stopLineX: 0, stopLineZ: 5,
        triggerStart: 10, triggerLength: 2, triggerStartX: -2, triggerLengthX: 4,
        showStopLine: false,
        scoring: {
            stopBar,
            exitBounds: { minX: exits.min.x, maxX: exits.max.x, minZ: exits.min.z, maxZ: exits.max.z },
        },
    });
    const scorer = new TrafficLightScoring(light);
    const input = (z, x = 0, dt = .016, overrides = {}) => ({
        position: new THREE.Vector3(x, 0, z + 2.1).applyMatrix4(matrix),
        frontPosition: new THREE.Vector3(x, 0, z).applyMatrix4(matrix),
        speedKmh: 2, rpm: 800, engineRunning: true, stalled: false, clutch: 0, dt,
        leftSignal: false, seatBeltFastened: true, ...overrides,
    });
    const tick = (z, x = 0, dt = .016, overrides = {}) => {
        const snapshot = input(z, x, dt, overrides);
        light.update(0, snapshot.position);
        return scorer.update(snapshot);
    };
    return { light, scorer, input, tick };
}
const points = result => result?.penalties.reduce((total, event) => total + event.points, 0) ?? 0;

for (const rotation of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    // All four orientations use the white stopbar for red-light violations.
    const red = fixture(rotation);
    red.tick(9);
    assert.equal(points(red.tick(6)), 0, 'Crossing only the yellow line is not running red');
    assert.equal(points(red.tick(1)), 10);
    assert.equal(points(red.tick(.9)), 0, 'A red crossing is charged once');

    const yellow = fixture(rotation);
    yellow.tick(9); yellow.light.goGreenNow();
    yellow.light.update(10, new THREE.Vector3(1000, 0, 1000));
    assert.equal(yellow.light.phase, 'yellow');
    assert.equal(points(yellow.tick(1)), 0);

    // Stop evaluation works on either side of the yellow line, including beyond 1.15 m.
    for (const [distance, expected] of [[.5, 0], [2, 5], [-2, 5]]) {
        const stopped = fixture(rotation);
        stopped.tick(9);
        stopped.tick(5 + distance, 0, .016, { speedKmh: 0 });
        now += 301;
        assert.equal(points(stopped.tick(5 + distance, 0, .016, { speedKmh: 0 })), expected);
        assert.equal(points(stopped.tick(5 + distance, 0, .016, { speedKmh: 0 })), 0);
    }

    const timeout = fixture(rotation);
    timeout.tick(9); timeout.light.goGreenNow(); timeout.tick(8);
    assert.equal(points(timeout.tick(8, 0, 20)), 0);
    assert.equal(points(timeout.tick(8, 0, .01)), 5);
    // Dithering across the activation zone must not reset the timer or penalty latch.
    timeout.tick(12); assert.equal(points(timeout.tick(9)), 0);
    assert.equal(timeout.tick(8, 0, 10.1).disqualified, true);
    assert.equal(timeout.tick(8), undefined);

    // A straight crossing and either turn all finish at the exit crosswalks.
    for (const [exitZ, exitX] of [[-10.1, 0], [-4, -8.1], [-4, 8.1]]) {
        const turn = fixture(rotation);
        turn.tick(9); turn.light.goGreenNow(); turn.tick(-1);
        assert.equal(turn.tick(exitZ, exitX).completed, true);
        assert.equal(turn.tick(exitZ, exitX, 40), undefined);
        // Returning for a new pass re-arms the scoring.
        turn.tick(15); turn.light.reset(); turn.tick(9);
        assert.equal(points(turn.tick(1)), 10);
    }

    const backingOut = fixture(rotation);
    backingOut.tick(9); backingOut.light.goGreenNow(); backingOut.tick(-1);
    assert.equal(backingOut.tick(1).completed, false, 'Backing out is not completing the intersection');

    const stall = fixture(rotation);
    stall.tick(9);
    assert.equal(points(stall.tick(8, 0, .016, { engineRunning: false, stalled: true })), 5);
    assert.equal(points(stall.tick(8, 0, .016, { engineRunning: false, stalled: true })), 0);
}

// Integration: finish lesson 5, then keep scoring other intersections without double charging SOUTH.
const south = fixture(0, 0, 'SOUTH');
const east = fixture(Math.PI / 2, 100, 'EAST');
const southExit = fixture(Math.PI, 200, 'SOUTH_EXIT');
const west = fixture(-Math.PI / 2, 300, 'WEST', true);
const fixtures = [south, east, southExit, west];
const track = {
    trafficLights: fixtures.map(item => item.light),
    getTrafficLight: marker => fixtures.find(item => item.light.markerId === marker)?.light,
};
const exam = new ExamEngine('normal');
exam.wireTrafficLights(track);
exam.startExercise.instructionsEnded(); exam.startExercise.beginStartAnnouncement();
exam.completeStartAnnouncement(); exam.activeIndex = 4;
const engineTick = (f, z, x = 0, dt = .016) => {
    const snapshot = f.input(z, x, dt);
    f.light.update(0, snapshot.position);
    return exam.update(snapshot, 'idle', dt);
};
south.light.goGreenNow(); engineTick(south, 9); engineTick(south, -1); engineTick(south, -10.1);
assert.equal(exam.isFinished, false);
assert.equal(exam.activeIndex, 5);
engineTick(east, 9); engineTick(east, 1); engineTick(east, .9);
assert.equal(exam.score, 90, 'EAST must be scored once after SOUTH is done');
east.light.goGreenNow(); engineTick(east, -1); engineTick(east, -10.1);
engineTick(southExit, 9); engineTick(southExit, 1);
assert.equal(exam.score, 80);
southExit.light.goGreenNow(); engineTick(southExit, -1); engineTick(southExit, -4, 8.1);
engineTick(west, 9); engineTick(west, 9, 0, 60);
assert.equal(exam.score, 80); assert.equal(exam.disqualified, false);
exam.reset(); assert.equal(exam.score, 100); assert.equal(exam.penalties.length, 0);
assert.equal(south.scorer.update(south.input(15)), undefined);

console.log('PASS: shared red/stop/stall/20s/30s rules in every orientation; straight/turn exits; repeat passes; post-lesson-5 scoring; always-green exclusion; reset');
