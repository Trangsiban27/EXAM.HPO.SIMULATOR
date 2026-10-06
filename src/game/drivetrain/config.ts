export const manualConfig = {
    biteStart: .5, biteOptimal: .3, biteFull: .2, optimalEngagement: .35,
    releaseRate: .26, fastReleaseRate: 2,
    idleRPM: 800, idleTorqueLimit: 65, stallRPM: 500, stallDelay: .25, inertia: .28,
    hillStartIdleTorqueLimit: 100, hillStartBiteEngagement: .55,
    clutchCapacity: 240, slipGain: .3, rideDelay: 3, rideSlipRPM: 350,
    mass: 1200, wheelRadius: .36, finalDrive: 4.1, efficiency: .9,
    ratios: [0, 3.5, 2, 1.3, 1, .8], reverseRatio: -3.4,
    redlineRPM: 5500, torqueFadeRPM: 4200, peakTorque: 160, lugRPM: 1200,
};
export const gearSpeedRanges = {
    1: { min: 0, max: 20, recommendedMin: 0, recommendedMax: 15 },
    2: { min: 10, max: 40, recommendedMin: 15, recommendedMax: 30 },
    3: { min: 25, max: 60, recommendedMin: 30, recommendedMax: 45 },
    4: { min: 40, max: 80, recommendedMin: 45, recommendedMax: 65 },
    5: { min: 60, max: 140, recommendedMin: 60, recommendedMax: 120 },
};
export type ManualConfig = typeof manualConfig;
export const clamp = (v: number, low: number, high: number) => Math.max(low, Math.min(high, v));
