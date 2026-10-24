export type GraphicsQuality = 'low' | 'medium' | 'high';
export const GRAPHICS_PRESETS = {
    low: { antialias: false, pixelRatio: 1, auxiliaryFps: 12, mirrorWidth: 192, mirrorHeight: 120, auxiliaryFarM: 50 },
    medium: { antialias: true, pixelRatio: 1.5, auxiliaryFps: 20, mirrorWidth: 384, mirrorHeight: 240, auxiliaryFarM: 50 },
    high: { antialias: true, pixelRatio: 2, auxiliaryFps: 30, mirrorWidth: 512, mirrorHeight: 320, auxiliaryFarM: 50 },
} as const;
export function loadGraphicsQuality(): GraphicsQuality {
    try {
        const value = localStorage.getItem('hpo-graphics-quality');
        if (value === 'low' || value === 'medium' || value === 'high') return value;
    } catch { /* Storage may be unavailable. */ }
    return 'medium';
}
export function saveGraphicsQuality(value: GraphicsQuality): void {
    try { localStorage.setItem('hpo-graphics-quality', value); } catch { /* Apply without persistence. */ }
}
