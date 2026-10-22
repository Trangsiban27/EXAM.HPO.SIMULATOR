import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({ stdin: { contents: `export * as THREE from 'three';
export { AutoDriveController } from './src/game/autoDrive/AutoDriveController';
export { AUTO_DRIVE_LESSONS } from './src/game/autoDrive/autoDriveLessons';
export { FRONT_PROBE_OFFSET_M } from './src/game/startPosition';`, resolveDir: process.cwd() },
bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, AutoDriveController, AUTO_DRIVE_LESSONS, FRONT_PROBE_OFFSET_M } = module.exports;
const controller = new AutoDriveController(AUTO_DRIVE_LESSONS, () => {}, () => {}, () => {},
    'B', new THREE.Box3(new THREE.Vector3(99.9, -1, -1000), new THREE.Vector3(100, 1, 1000)),
    undefined, undefined, undefined, [70, 45, 20]);
controller.exam09ApproachStarted = true;
const route = [new THREE.Vector3(100, 0, 0), new THREE.Vector3(-100, 0, 0)];
for (const point of route) {
    controller.recordedHeadings.set(point, Math.PI / 2);
    controller.recordedSpeeds.set(point, 20 / 3.6);
}
const vehicle = {
    root: new THREE.Group(), transmission: { gear: 1 }, maxAllowedSpeedMps: Infinity, steering: 0,
    updateAutomatic(_dt, _steering, speed) { this.speed = speed; }
};
const drive = (frontX, kind = 'exam09', dt = 0) => {
    controller.waypointStopKind = kind;
    controller.waypointIndex = 1;
    vehicle.root.rotation.y = Math.PI / 2;
    vehicle.root.position.set(frontX + FRONT_PROBE_OFFSET_M, 0, 0);
    controller.followSavedRoute(dt, vehicle, route, undefined, undefined, 'routeEnd');
    return vehicle.transmission.gear;
};

assert.equal(drive(71), 1);
assert.equal(drive(70), 1, 'Marker 1 remains in first');
assert.equal(drive(57.501), 1, 'Before the midpoint');
assert.equal(drive(57.5), 2, 'Shift at midpoint of markers 1 and 2');
assert.equal(drive(45), 2, 'Marker 2 stays in second');
assert.equal(drive(25), 2, 'Hold second while slowing down');
assert.ok(vehicle.speed < 30 / 3.6);
assert.equal(drive(20.001), 2, 'Do not downshift before the front reaches marker 3');
assert.equal(drive(20), 1, 'Downshift exactly at marker 3');
assert.equal(drive(19), 1);
assert.equal(drive(20.001, 'exam09', .016), 1, 'Crossing marker 3 downshifts in the same frame');
assert.equal(drive(50, 'exam08'), 1, 'Lesson 8 replay keeps its existing gear');
assert.equal(drive(50, 'exam10'), 1, 'Lesson 10 replay keeps its existing gear');
console.log('PASS: lesson 9 upshift at midpoint, hold through braking, downshift at marker 3; lessons 8/10 unchanged');
