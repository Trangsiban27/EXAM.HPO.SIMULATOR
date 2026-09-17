import type { ManualConfig } from './config';
export class Transmission {
    gear = 0;
    constructor(private c: ManualConfig) {}
    get ratio() { return (this.gear < 0 ? this.c.reverseRatio : this.c.ratios[this.gear]) * this.c.finalDrive; }
    rpm(speed: number) { return speed / this.c.wheelRadius * this.ratio * 60 / (2 * Math.PI); }
    force(torque: number) { return torque * this.ratio * this.c.efficiency / this.c.wheelRadius; }
}
