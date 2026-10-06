import { clamp, type ManualConfig } from './config';
export class Engine {
    running = false;
    rpm = 0;
    private lowTime = 0;
    constructor(private c: ManualConfig) {}
    start() { this.running = true; this.rpm = this.c.idleRPM; this.lowTime = 0; }
    stop() { this.running = false; this.rpm = 0; this.lowTime = 0; }
    update(dt: number, throttle: number, load: number, idleTorqueLimit = this.c.idleTorqueLimit) {
        if (!this.running) return;
        const idle = clamp((this.c.idleRPM - this.rpm) * .4, 0, idleTorqueLimit);
        const lowRPM = clamp(this.rpm / this.c.lugRPM, .15, 1);
        const highRPM = clamp((this.c.redlineRPM - this.rpm) / (this.c.redlineRPM - this.c.torqueFadeRPM), 0, 1);
        const torque = idle + throttle * this.c.peakTorque * lowRPM * highRPM - this.rpm * .004;
        this.rpm = clamp(this.rpm + (torque - load) / this.c.inertia * 60 / (2 * Math.PI) * dt, 0, this.c.redlineRPM);
    }
    checkStall(dt: number, engagement: number, gear: number) {
        this.lowTime = this.running && this.rpm < this.c.stallRPM && engagement > .65 && gear !== 0 ? this.lowTime + dt : 0;
        if (this.lowTime >= this.c.stallDelay) { this.stop(); return true; }
        return false;
    }
}
