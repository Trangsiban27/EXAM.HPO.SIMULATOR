import type { ManualConfig } from './config';
export class VehiclePhysics {
    speed = 0;
    acceleration = 0;
    constructor(private c: ManualConfig) {}
    update(dt: number, force: number, brake: number, slope: number) {
        const previous = this.speed;
        const driven = this.speed + (force / this.c.mass - 9.81 * Math.sin(slope)) * dt;
        const resistance = (.16 + .006 * driven * driven + brake * 12) * dt;
        this.speed = Math.sign(driven) * Math.max(0, Math.abs(driven) - resistance);
        this.acceleration = (this.speed - previous) / dt;
    }
}
