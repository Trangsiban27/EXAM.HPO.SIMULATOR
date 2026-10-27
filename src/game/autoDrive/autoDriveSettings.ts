const CONTINUOUS_KEY = 'hpo-auto-drive-continuous';

export function loadContinuousAutoDrive(): boolean {
    try { return localStorage.getItem(CONTINUOUS_KEY) === 'true'; }
    catch { return false; }
}

export function saveContinuousAutoDrive(enabled: boolean): void {
    try { localStorage.setItem(CONTINUOUS_KEY, String(enabled)); }
    catch { /* The option still applies for this session. */ }
}
