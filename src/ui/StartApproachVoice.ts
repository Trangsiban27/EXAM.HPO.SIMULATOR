import { startWaitingLine } from '../game/startPosition';
import type { PenaltyEvent } from '../game/types';

const voiceClips = [
    '/voice/bai1/mungbandenvoibaithisathach.mp3',
    '/voice/bai1/choxevaovitrixuatphat.mp3',
] as const;
const startVoice = '/voice/bai1/batdauthi.mp3';
const penaltyVoices = [
    ['Xuất phát khi chưa có hiệu lệnh', 'xuatphatxekhichuacohieulenh_biloai.mp3'],
    ['Không bật xi nhan trái khi xuất phát', 'khongbatxinhan_tru5diem.mp3'],
    ['Không tắt xi nhan trái tại mốc 5 m', 'khongtatxinhansau5met_tru5diem.mp3'],
    ['Xi nhan trái không tắt kịp thời sau mốc 5 m', 'khongtatxinhansau5met_tru5diem.mp3'],
    ['Quá 20s chưa qua vạch xuất phát', 'qua20giaykhongxuatphat_tru5diem.mp3'],
    ['Quá 30s chưa qua vạch xuất phát', 'qua30giaykhongxuatphat_biloai.mp3'],
] as const;

interface StartVoiceCallbacks {
    onInstructionsEnded: () => void;
    onStartAnnouncement: () => void;
    onStartEnded: () => void;
}

interface VoiceClip {
    src: string;
    onEnded?: () => void;
}

/** Start instructions, command timing and penalty recordings for one attempt. */
export class StartApproachVoice {
    private previousDistanceM?: number;
    private triggered = false;
    private audio?: HTMLAudioElement;
    private queue: VoiceClip[] = [];
    private instructionsFinished = false;
    private leftSignalSince?: number;
    private startAnnounced = false;
    private announcedPenalties = new Set<string>();
    private finishedHandled = false;

    constructor(private readonly callbacks: StartVoiceCallbacks) {}

    update(frontPosition: { x: number; z: number }, leftSignal = false): void {
        if (this.finishedHandled) return;
        if (leftSignal) this.leftSignalSince ??= performance.now();
        else this.leftSignalSince = undefined;
        this.maybeAnnounceStart();
        // Trigger as the front bumper touches the near edge of the yellow paint.
        const distanceM = startWaitingLine.x - startWaitingLine.thicknessM / 2 - frontPosition.x;
        const previous = this.previousDistanceM;
        this.previousDistanceM = distanceM;
        if (this.triggered || previous === undefined || previous <= 1e-6 || distanceM > 1e-6
            || Math.abs(frontPosition.z - startWaitingLine.z) > startWaitingLine.widthM / 2) return;
        this.triggered = true;
        this.enqueue({ src: voiceClips[0] });
        this.enqueue({
            src: voiceClips[1],
            onEnded: () => {
                this.callbacks.onInstructionsEnded();
                this.instructionsFinished = true;
                this.maybeAnnounceStart();
            },
        });
    }

    reset(): void {
        this.stopPlayback();
        this.previousDistanceM = undefined;
        this.triggered = false;
        this.announcedPenalties.clear();
        this.finishedHandled = false;
        this.instructionsFinished = false;
        this.leftSignalSince = undefined;
        this.startAnnounced = false;
    }

    private maybeAnnounceStart(): void {
        if (this.startAnnounced || !this.instructionsFinished || this.leftSignalSince === undefined
            || performance.now() - this.leftSignalSince < 5000) return;
        this.startAnnounced = true;
        this.callbacks.onStartAnnouncement();
        this.enqueue({ src: startVoice, onEnded: this.callbacks.onStartEnded });
    }

    /** Read the actual scoring events; repeated frames never repeat a voice. */
    reportEvents(penalties: readonly PenaltyEvent[], disqualifyReason?: string, finished = false): void {
        if (finished && !this.finishedHandled) {
            this.finishedHandled = true;
            this.stopPlayback();
        }
        const reasons = [...penalties.map(event => event.reason), disqualifyReason ?? ''];
        for (const [reason, file] of penaltyVoices) {
            if (!reasons.some(value => value.includes(reason)) || this.announcedPenalties.has(file)) continue;
            this.announcedPenalties.add(file);
            this.enqueue({ src: `/voice/bai1/${file}` });
        }
    }

    private stopPlayback(): void {
        this.queue = [];
        this.clearRetry();
        if (this.audio) {
            this.audio.onended = null;
            this.audio.onerror = null;
            this.audio.pause();
            this.audio = undefined;
        }
    }

    private enqueue(clip: VoiceClip): void {
        this.queue.push(clip);
        if (!this.audio) this.playNext();
    }

    private playNext(): void {
        this.clearRetry();
        const clip = this.queue.shift();
        if (!clip) return;
        const audio = new Audio(clip.src);
        this.audio = audio;
        audio.onended = () => {
            if (this.audio !== audio) return;
            this.audio = undefined;
            clip.onEnded?.();
            if (!this.audio) this.playNext();
        };
        // Missing or blocked audio must not silently issue the start command.
        audio.onerror = () => {
            if (this.audio === audio) this.waitForGesture();
        };
        this.play(audio);
    }

    private play(audio: HTMLAudioElement): void {
        void audio.play().catch((error: unknown) => {
            if (this.audio !== audio) return;
            if (!(error instanceof DOMException && error.name === 'AbortError')) this.waitForGesture();
        });
    }

    private retryPlayback = (): void => {
        this.clearRetry();
        if (this.audio) this.play(this.audio);
    };

    private waitForGesture(): void {
        window.addEventListener('pointerdown', this.retryPlayback);
        window.addEventListener('keydown', this.retryPlayback);
    }

    private clearRetry(): void {
        window.removeEventListener('pointerdown', this.retryPlayback);
        window.removeEventListener('keydown', this.retryPlayback);
    }
}
