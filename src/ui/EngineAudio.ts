/** Quiet synthesized engine sound, enabled only after a user gesture. */
export class EngineAudio {
    private context?: AudioContext;
    private oscillator?: OscillatorNode;
    private gain?: GainNode;
    constructor(host: HTMLElement) {
        const unlock = () => {
            if (!this.context) {
                this.context = new AudioContext();
                this.oscillator = this.context.createOscillator();
                this.oscillator.type = 'triangle';
                this.gain = this.context.createGain();
                this.gain.gain.value = 0;
                this.oscillator.connect(this.gain).connect(this.context.destination);
                this.oscillator.start();
            }
            void this.context.resume().catch(() => {});
        };
        host.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
        window.addEventListener('blur', () => { if (this.context) void this.context.suspend(); });
    }
    update(rpm: number) {
        if (!this.context || !this.oscillator || !this.gain) return;
        const now = this.context.currentTime;
        this.oscillator.frequency.setTargetAtTime(Math.max(25, rpm / 30), now, .08);
        this.gain.gain.setTargetAtTime(rpm > 0 ? .015 + Math.min(1, rpm / 5500) * .045 : 0, now, .08);
    }
}
