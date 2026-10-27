import assert from 'node:assert/strict';
import { build } from 'esbuild';
const output = await build({ stdin: { contents: `export * as THREE from 'three';
export { AutoDriveController } from './src/game/autoDrive/AutoDriveController';
export { AUTO_DRIVE_LESSONS } from './src/game/autoDrive/autoDriveLessons';`, resolveDir: process.cwd() },
bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', output.outputFiles[0].text)(module, module.exports);
const { THREE, AutoDriveController, AUTO_DRIVE_LESSONS } = module.exports;
const lessons = [], checkpoints = [];
let completed = 0;
const controller = new AutoDriveController(AUTO_DRIVE_LESSONS, lesson => lessons.push(lesson?.id ?? null),
    () => completed++, kind => checkpoints.push(kind), 'B',
    new THREE.Box3(new THREE.Vector3(99, -1, -1000), new THREE.Vector3(100, 1, 1000)));
const pauseVehicle = { root: new THREE.Group(), maxAllowedSpeedMps: Infinity,
    signals: { left: false, right: false, hazard: false },
    setSignal(signals) { this.signals = signals; },
    updateAutomatic(_dt, _steering, speed) { this.speed = speed; } };
function finishPause() {
    assert.equal(controller.continuousPauseRemaining, 2);
    controller.update(1, pauseVehicle, []);
    controller.update(.99, pauseVehicle, []);
    assert.ok(controller.continuousPauseRemaining > 0, 'Does not resume before two seconds');
    assert.equal(pauseVehicle.speed, 0, 'Stays stopped during the pause');
    controller.update(.01, pauseVehicle, []);
    assert.equal(controller.continuousPauseRemaining, 0);
}
controller.enabled = true;
controller.waitingForLesson = true;
controller.publishLesson(AUTO_DRIVE_LESSONS[0]);
assert.deepEqual(lessons, [1], 'Default mode still shows the lesson');
controller.setContinuous(true);
assert.equal(controller.waitingForLesson, true, 'Enabling closes the popup but keeps the car stopped');
finishPause();
assert.equal(controller.waitingForLesson, false, 'Enabling during a popup resumes after two seconds');
assert.equal(controller.stopIndex, 1);
assert.equal(lessons.at(-1), null, 'Existing popup is closed');
lessons.length = 0;
controller.trafficStopWaypointIndex = 2;
for (let index = 1; index <= 4; index++) {
    controller.stopIndex = index;
    controller.waitingForLesson = true;
    controller.publishLesson(AUTO_DRIVE_LESSONS[index]);
    finishPause();
    assert.equal(controller.waitingForLesson, false, `Lesson ${index + 1} resumes`);
}
assert.equal(controller.exam05LessonShown, true, 'Lesson 5 continues along the recorded route');
assert.equal(completed, 0);
assert.ok(lessons.every(id => id === null), 'Continuous mode never publishes a lesson dialog');
for (const kind of ['exam05', 'exam07', 'exam08', 'exam09', 'exam10']) {
    controller.waypointStopKind = kind;
    controller.waypointStopReady = true;
    controller.onWaypointStop(kind);
    finishPause();
    assert.equal(controller.waypointStopReady, false, `${kind} resumes automatically`);
}
assert.deepEqual(checkpoints, []);
controller.exam09ApproachStarted = true;
controller.finishRightSignalOn = true;
controller.waitingForLesson = true;
controller.publishLesson({ id: 11 });
finishPause();
assert.equal(controller.waitingForLesson, false, 'Lesson 11 resumes to the finish');
assert.equal(completed, 0);
controller.setContinuous(false);
controller.waitingForLesson = true;
controller.publishLesson(AUTO_DRIVE_LESSONS[2]);
assert.equal(controller.waitingForLesson, true, 'Turning off restores guidance pauses');
assert.equal(lessons.at(-1), 3);
controller.setContinuous(true);
finishPause();
controller.waypointStopKind = 'bridge';
controller.waypointStopReady = true;
controller.onWaypointStop('bridge');
assert.equal(checkpoints.at(-1), 'bridge', 'Missing routes still require intervention');
// Red-light stops must remain in place even while lesson dialogs are skipped.
controller.waypointStopReady = false;
controller.finishRightSignalOn = false;
controller.currentSpeed = 0;
controller.waypointIndex = 0;
const vehicle = { root: new THREE.Group(), steering: 0, transmission: { gear: 1 },
    maxAllowedSpeedMps: Infinity, updateAutomatic(_dt, _steering, speed) { this.speed = speed; } };
vehicle.root.position.set(0, 0, 5);
const route = [new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -5)];
controller.followSavedRoute(.016, vehicle, route, 0, undefined, undefined,
    { phase: 'red', remainingSeconds: 10 }, 0, 'z', -1);
assert.equal(vehicle.speed, 0, 'Continuous mode still waits at red lights');
assert.equal(controller.waitingForTrafficLight, true);
console.log('PASS: two-second stationary pauses at continuous lessons 1–11, enable during a popup, restore pauses, missing routes, red-light stop');
