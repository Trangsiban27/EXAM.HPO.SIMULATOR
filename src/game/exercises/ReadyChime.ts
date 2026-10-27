/** Shared stop-confirmation recording for the pedestrian and hill exercises. */
export class ReadyChime {
    private audio?: HTMLAudioElement;

    play(): void {
        this.stop();
        try {
            const audio = new Audio('/voice/bai3/chuonghoanthanhbai.mp3');
            this.audio = audio;
            audio.onended = () => {
                if (this.audio === audio) this.audio = undefined;
            };
            audio.onerror = () => {
                if (this.audio === audio) this.stop();
            };
            void audio.play().catch(() => {
                if (this.audio === audio) this.stop();
            });
        } catch {
            // Audio may be unavailable in a non-browser environment.
        }
    }

    stop(): void {
        if (!this.audio) return;
        this.audio.onended = null;
        this.audio.onerror = null;
        this.audio.pause();
        this.audio = undefined;
    }
}
