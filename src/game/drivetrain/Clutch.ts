import { clamp, type ManualConfig } from './config';
export class Clutch {
    pedal = 0; engagement = 1; releaseSpeed = 0; slipRPM = 0; riding = false;
    private rideTime = 0;
    constructor(private c: ManualConfig) {}
    update(dt: number, target: number, fast: boolean) {
        // Đạp côn đạt ngay mức yêu cầu; chỉ nhả côn mới thay đổi theo thời gian.
        if (target > this.pedal) this.pedal = target;
        else {
            const rate = fast ? this.c.fastReleaseRate : this.c.releaseRate;
            this.pedal = Math.max(target, this.pedal - rate * dt);
        }
        const previous = this.engagement;
        this.engagement = this.pedal >= this.c.biteOptimal
            ? this.c.optimalEngagement * clamp((this.c.biteStart - this.pedal) / (this.c.biteStart - this.c.biteOptimal), 0, 1)
            : this.c.optimalEngagement + (1 - this.c.optimalEngagement) * clamp(
                (this.c.biteOptimal - this.pedal) / (this.c.biteOptimal - this.c.biteFull), 0, 1);
        this.releaseSpeed = (this.engagement - previous) / dt;
    }
    torque(dt: number, engineRPM: number, gearboxRPM: number, active: boolean, minimumEngagement = 0) {
        this.slipRPM = engineRPM - gearboxRPM;
        const slipping = active && this.engagement > .05 && this.engagement < .95 && Math.abs(this.slipRPM) > this.c.rideSlipRPM;
        this.rideTime = slipping ? this.rideTime + dt : 0;
        this.riding = this.rideTime >= this.c.rideDelay;
        const capacity = this.c.clutchCapacity * Math.max(this.engagement, minimumEngagement);
        return active ? clamp(this.slipRPM * this.c.slipGain, -capacity, capacity) : 0;
    }
}
