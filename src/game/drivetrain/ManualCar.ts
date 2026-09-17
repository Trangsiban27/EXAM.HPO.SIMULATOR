import { Engine } from './Engine';
import { Clutch } from './Clutch';
import { Transmission } from './Transmission';
import { VehiclePhysics } from './VehiclePhysics';
import { manualConfig, type ManualConfig } from './config';
import { gearFeedback, type GearWarning } from './GearFeedback';
export class ManualCar {
    readonly engine: Engine;
    readonly clutch: Clutch;
    readonly gearbox: Transmission;
    readonly physics: VehiclePhysics;
    jolt = 0;
    private joltVelocity = 0;
    stalled = false;
    warnings: GearWarning[] = [];
    vibration = 0;
    private phase = 0;
    constructor(private config: ManualConfig = manualConfig) {
        this.engine = new Engine(config); this.clutch = new Clutch(config);
        this.gearbox = new Transmission(config); this.physics = new VehiclePhysics(config);
    }
    update(dt: number, gas: number, pedal: number, fast: boolean, brake: number, slope: number) {
        this.stalled = false;
        // Fixed-size substeps keep clutch loading stable across display frame rates.
        for (let remaining = Math.min(dt, .1); remaining > 1e-8;) {
            const h = Math.min(remaining, 1 / 240); remaining -= h;
            this.clutch.update(h, pedal, fast);
            const torque = this.clutch.torque(h, this.engine.rpm, this.gearbox.rpm(this.physics.speed), this.engine.running && this.gearbox.gear !== 0);
            this.engine.update(h, gas, torque);
            this.physics.update(h, this.gearbox.force(torque), brake, slope);
            if (this.engine.checkStall(h, this.clutch.engagement, this.gearbox.gear)) this.stalled = true;
            const kick = this.clutch.releaseSpeed > 6 && Math.abs(this.physics.speed) < 2 ? torque * .015 : 0;
            this.joltVelocity += (kick - 65 * this.jolt - 10 * this.joltVelocity) * h;
            this.jolt += this.joltVelocity * h;
            const lugging = this.engine.running && this.gearbox.gear !== 0
                ? Math.max(0, 1 - this.engine.rpm / this.config.lugRPM) * this.clutch.engagement * gas : 0;
            this.phase = (this.phase + this.engine.rpm / 60 * 2 * Math.PI * h) % (2 * Math.PI);
            this.vibration = Math.sin(this.phase) * lugging * .015;
        }
        this.warnings = this.engine.running && this.clutch.engagement > .65
            ? gearFeedback(this.gearbox.gear, Math.abs(this.physics.speed) * 3.6) : [];
    }
}
