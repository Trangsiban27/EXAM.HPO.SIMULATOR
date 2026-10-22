import type { DirectionalLight } from 'three';

/** Keep shadow rendering off to reduce the cost of the main view and mirrors. */
export const ENABLE_SHADOWS = false;

/** Calibrated against the Vios with the yard's 120 m / 2048 px shadow map. */
export const SUN_SHADOW_BIAS = -.0003;
export const SUN_SHADOW_NORMAL_BIAS_M = .04;

export function configureSunShadows(sun: DirectionalLight): void {
    // Zero bias causes the car to repeatedly shadow its own bonnet, roof and glass.
    sun.shadow.bias = SUN_SHADOW_BIAS;
    sun.shadow.normalBias = SUN_SHADOW_NORMAL_BIAS_M;
}
