import { clamp } from './config';

export const pedalConfig = { gasPressRate: .5, gasReleaseRate: 2, brakePressRate: 1.5, brakeReleaseRate: 3 };

/** Continuous pedal travel, independent of frame rate and rendering. */
export class Pedals {
    gas = 0;
    brake = 0;
    update(dt: number, gasTarget: number, brakeTarget: number) {
        const move = (value: number, target: number, press: number, release: number) =>
            value + clamp(clamp(target, 0, 1) - value, -release * Math.max(0, dt), press * Math.max(0, dt));
        this.gas = move(this.gas, gasTarget, pedalConfig.gasPressRate, pedalConfig.gasReleaseRate);
        this.brake = move(this.brake, brakeTarget, pedalConfig.brakePressRate, pedalConfig.brakeReleaseRate);
    }
}
