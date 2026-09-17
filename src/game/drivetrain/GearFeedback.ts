import { gearSpeedRanges } from './config';
export type GearWarning = 'LOW_GEAR_HIGH_SPEED' | 'HIGH_GEAR_LOW_SPEED' | 'RECOMMEND_SHIFT_UP' | 'RECOMMEND_SHIFT_DOWN';
export function gearFeedback(gear: number, speedKmh: number): GearWarning[] {
    if (!(gear in gearSpeedRanges)) return [];
    const range = gearSpeedRanges[gear as keyof typeof gearSpeedRanges];
    const result: GearWarning[] = [];
    if (speedKmh > range.max) result.push('LOW_GEAR_HIGH_SPEED');
    if (speedKmh < range.min) result.push('HIGH_GEAR_LOW_SPEED');
    if (gear < 5 && speedKmh >= range.recommendedMax) result.push('RECOMMEND_SHIFT_UP');
    if (gear > 1 && speedKmh < range.recommendedMin) result.push('RECOMMEND_SHIFT_DOWN');
    return result;
}
