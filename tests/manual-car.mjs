import { build } from 'esbuild';
import assert from 'node:assert/strict';
const bundle = await build({ entryPoints: ['src/game/drivetrain/ManualCar.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { ManualCar } = module.exports;
function simulate({ gas = 0, pedal = 0, fast = false, gear = 1, brake = 0, fps = 60, seconds = 5 } = {}) {
    const car = new ManualCar();
    car.engine.start(); car.gearbox.gear = gear;
    car.clutch.pedal = 1; car.clutch.engagement = 0;
    let jolt = 0, riding = false;
    for (let i = 0; i < fps * seconds; i++) {
        car.update(1 / fps, gas, pedal, fast, brake, 0);
        jolt = Math.max(jolt, Math.abs(car.jolt)); riding ||= car.clutch.riding;
    }
    return { car, jolt, riding };
}
const slow = simulate({ gas: .15 });
assert(slow.car.engine.running && slow.car.physics.speed > 1);
assert(simulate().car.physics.speed > .5, 'Idle torque should allow a slow clutch launch');
const fast = simulate({ fast: true });
assert(!fast.car.engine.running && fast.jolt > slow.jolt, 'Quick release should load and stall the engine');
for (const options of [{ pedal: 1 }, { gear: 0 }]) {
    const { car } = simulate({ ...options, gas: .5 });
    assert(car.engine.rpm > 2000 && car.physics.speed === 0);
}
assert(simulate({ gas: .8, pedal: .4, brake: 1, seconds: 8 }).riding, 'Sustained slipping should warn after the slower release');
assert(simulate({ gas: .15, gear: -1 }).car.physics.speed < 0);
const at30 = simulate({ gas: .15, fps: 30 }).car;
const at120 = simulate({ gas: .15, fps: 120 }).car;
assert(Math.abs(at30.physics.speed - at120.physics.speed) < .01);
assert(Math.abs(at30.engine.rpm - at120.engine.rpm) < 1);
const stalled = fast.car;
stalled.clutch.pedal = 1; stalled.clutch.engagement = 0; stalled.engine.start();
stalled.update(.1, 0, 1, false, 1, 0);
assert(stalled.engine.running);
console.log('Manual drivetrain scenarios passed.');
const highSpeed = new ManualCar();
highSpeed.engine.start(); highSpeed.gearbox.gear = 1;
highSpeed.physics.speed = 30 / 3.6;
highSpeed.engine.rpm = highSpeed.gearbox.rpm(highSpeed.physics.speed);
highSpeed.update(1 / 60, .5, 0, false, 0, 0);
assert(highSpeed.physics.speed * 3.6 > 20, 'Training range must not clamp speed');
assert(highSpeed.warnings.includes('LOW_GEAR_HIGH_SPEED'));
assert(highSpeed.warnings.includes('RECOMMEND_SHIFT_UP'));
const highGear = new ManualCar();
highGear.engine.start(); highGear.gearbox.gear = 4; highGear.physics.speed = 15 / 3.6;
highGear.engine.rpm = highGear.gearbox.rpm(highGear.physics.speed);
highGear.update(1 / 60, .2, 0, false, 0, 0);
assert(highGear.warnings.includes('HIGH_GEAR_LOW_SPEED'));
assert(highGear.warnings.includes('RECOMMEND_SHIFT_DOWN'));
assert(highGear.engine.running, 'Wrong speed range alone must not stop the engine');
let previousForce = Infinity;
for (let gear = 1; gear <= 5; gear++) {
    highGear.gearbox.gear = gear;
    const force = highGear.gearbox.force(100);
    assert(force < previousForce); previousForce = force;
}
const freeRev = simulate({ gas: 1, pedal: 1, seconds: 20 }).car;
assert(freeRev.engine.rpm <= 5500);
assert(freeRev.physics.speed === 0);
console.log('Gear speed feedback, force ratios, neutral/clutch isolation and redline passed.');
