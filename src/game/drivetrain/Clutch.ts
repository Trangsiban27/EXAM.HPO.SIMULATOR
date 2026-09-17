import { clamp, type ManualConfig } from './config';
export class Clutch {
    pedal = 0; engagement = 1; releaseSpeed = 0; slipRPM = 0; riding = false;
    private rideTime = 0;
    constructor(private c: ManualConfig) {}
    update(dt: number, target: number, fast: boolean) {
        const rate = target > this.pedal ? this.c.pressRate : fast ? this.c.fastReleaseRate : this.c.releaseRate;
        this.pedal += clamp(target - this.pedal, -rate * dt, rate * dt);
        const previous = this.engagement;
        this.engagement = this.pedal >= this.c.biteOptimal
            ? this.c.optimalEngagement * clamp((this.c.biteStart - this.pedal) / (this.c.biteStart - this.c.biteOptimal), 0, 1)
            : this.c.optimalEngagement + (1 - this.c.optimalEngagement) * clamp(
                (this.c.biteOptimal - this.pedal) / (this.c.biteOptimal - this.c.biteFull), 0, 1);
        this.releaseSpeed = (this.engagement - previous) / dt;
    }
    torque(dt: number, engineRPM: number, gearboxRPM: number, active: boolean) {
        this.slipRPM = engineRPM - gearboxRPM;
        const slipping = active && this.engagement > .05 && this.engagement < .95 && Math.abs(this.slipRPM) > this.c.rideSlipRPM;
        this.rideTime = slipping ? this.rideTime + dt : 0;
        this.riding = this.rideTime >= this.c.rideDelay;
        return active ? clamp(this.slipRPM * this.c.slipGain,
            -this.c.clutchCapacity * this.engagement, this.c.clutchCapacity * this.engagement) : 0;
    }
}
