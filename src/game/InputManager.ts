export class InputManager {
    private analog = new Map<string, number>();
    private keys = new Set<string>();
    private virtual = new Set<string>();
    private automatedKeys = new Set<string>();
    private automatedAnalog = new Map<string, number>();
    private automationEnabled = false;

    constructor() {
        window.addEventListener('blur', () => {
            this.keys.clear();
            this.virtual.clear();
            this.analog.clear();
        });
        window.addEventListener('keydown', e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'ShiftLeft', 'ShiftRight'].includes(e.code)) e.preventDefault();
            this.keys.add(e.code);
        }, { passive: false });
        window.addEventListener('keyup', e => this.keys.delete(e.code));
    }

    getAnalog(name: string) {
        return this.automationEnabled ? this.automatedAnalog.get(name) : this.analog.get(name);
    }
    setAnalog(name: string, value: number) { this.analog.set(name, Math.max(0, Math.min(1, value))); }
    isDown(code: string) {
        return this.automationEnabled
            ? this.automatedKeys.has(code)
            : this.keys.has(code) || this.virtual.has(code);
    }
    setVirtual(code: string, active: boolean) { active ? this.virtual.add(code) : this.virtual.delete(code); }
    clearVirtual() { this.virtual.clear(); this.analog.clear(); }

    setAutomationEnabled(enabled: boolean) {
        this.automationEnabled = enabled;
        this.clearAutomationInput();
    }
    setAutomationKey(code: string, active: boolean) {
        active ? this.automatedKeys.add(code) : this.automatedKeys.delete(code);
    }
    setAutomationAnalog(name: string, value: number) {
        this.automatedAnalog.set(name, Math.max(0, Math.min(1, value)));
    }
    clearAutomationInput() {
        this.automatedKeys.clear();
        this.automatedAnalog.clear();
    }
}
