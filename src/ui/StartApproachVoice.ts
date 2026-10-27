import { startPosition, startWaitingLine } from '../game/startPosition';
import { EXAM_02_APPROACH_VOICE_LINE, EXAM_02_CROSSWALK, EXAM_03_ENTRY_CHIME_LINE } from '../game/exam/examCourseGeometry';
import type { PenaltyEvent } from '../game/types';

const voiceClips = [
    '/voice/bai1/mungbandenvoibaithisathach.mp3',
    '/voice/bai1/choxevaovitrixuatphat.mp3',
] as const;
const startVoice = '/voice/bai1/batdauthi.mp3';
const postStartChime = '/voice/bai1/chuongbingbong.mp3';
const pedestrianApproachVoice = '/voice/bai2/baithitieptheo_dungxenhuongduongchonguoidibo.mp3';
const hillApproachVoice = '/voice/bai3/baithitieptheo_dungvakhoihanhxengangdoc.mp3';
const POST_START_CHIME_DISTANCE_M = 3;
const recurringPenaltyVoices = [
    ['Vòng tua máy vượt', 'vongtuadongcoquamucchophep_tru5diem.mp3'],
    ['Chết máy', 'xebichetmay_tru5diem.mp3'],
    ['Vượt tốc độ quy định', 'xechayquatocdoquydinh.mp3'],
] as const;
const lesson2PenaltyVoices = [
    ['Không dừng xe ở vạch dừng quy định', 'khongdungxeovachdungquydinh_tru5diem.mp3'],
    ['Dừng xe quá vạch dừng quy định', 'dungxequavachdungquydinh_tru5diem.mp3'],
    ['Dừng xe chưa đến vạch dừng quy định', 'dungxechuadenvachdungquydinh_tru5diem.mp3'],
] as const;
const lesson3PenaltyVoices = [
    ['Không dừng xe ở vạch dừng quy định', 'khongdungxeovachdungquydinhtrendoc_biloai.mp3'],
    ['Dừng xe chưa đến vạch dừng quy định', 'dungxechuadenvachdungquydinh_tru5diem.mp3'],
    ['Dừng xe quá vạch dừng quy định', 'dungxequavachdungquydinh_biloai.mp3'],
    ['Tụt dốc quá', 'xebitutdoc_biloai.mp3'],
    ['Quá 30 giây từ khi dừng mà chưa khởi hành qua vạch', 'qua30giaykhongkhoihanhxequadoc_biloai.mp3'],
] as const;
const lesson4PenaltyVoices = [
    ['Bánh xe trước và bánh xe sau bên lái phụ không qua vùng giới hạn của hình vệt bánh xe', 'disaihinhsathach_biloai.mp3'],
    ['đi không đúng hình của hạng xe', 'disaihinhsathach_biloai.mp3'],
    ['Bánh xe đè lên vệt bánh xe kéo dài quá 5 giây', 'banhxedevachgioihanqua5giay_tru5diem.mp3'],
    ['Bánh xe đè vạch kéo dài quá 5 giây', 'banhxedevachgioihanqua5giay_tru5diem.mp3'],
    ['Bánh trước bên lái phụ chưa qua vệt bánh xe', 'banhxedevach_tru5diem copy.mp3'],
    ['Bánh sau bên lái phụ chưa qua vệt bánh xe', 'banhxedevach_tru5diem copy.mp3'],
    ['Bánh xe đè lên vệt bánh xe', 'banhxedevach_tru5diem copy.mp3'],
    ['Bánh xe đè vạch giới hạn', 'banhxedevach_tru5diem copy.mp3'],
    ['Quá thời gian 02 phút thực hiện bài số 4', 'quathoigianthuchienbaithi-tru5diem.mp3'],
] as const;
const penaltyVoices = [
    ['Lái xe lên vỉa hè', 'laixelenviahe_biloai.mp3'],
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
    withChime?: boolean;
}

/** Start instructions, command timing and penalty recordings for one attempt. */
export class StartApproachVoice {
    private previousDistanceM?: number;
    private triggered = false;
    private audio?: HTMLAudioElement;
    private accompanyingChime?: HTMLAudioElement;
    private queue: VoiceClip[] = [];
    private instructionsFinished = false;
    private leftSignalSince?: number;
    private startAnnounced = false;
    private previousChimeFrontX?: number;
    private postStartChimePlayed = false;
    private previousPedestrianFrontX?: number;
    private pedestrianApproachAnnounced = false;
    private previousHillRearX?: number;
    private previousHillFrontX?: number;
    private hillApproachAnnounced = false;
    private hillEntryChimePlayed = false;
    private announcedPenalties = new Set<string>();
    private announcedEvents = new WeakSet<PenaltyEvent>();
    private finishedHandled = false;

    constructor(private readonly callbacks: StartVoiceCallbacks) {}

    update(frontPosition: { x: number; z: number }, leftSignal = false): void {
        if (this.finishedHandled) return;
        this.maybePlayPostStartChime(frontPosition);
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
        this.announcedEvents = new WeakSet<PenaltyEvent>();
        this.finishedHandled = false;
        this.instructionsFinished = false;
        this.leftSignalSince = undefined;
        this.startAnnounced = false;
        this.previousChimeFrontX = undefined;
        this.postStartChimePlayed = false;
        this.previousPedestrianFrontX = undefined;
        this.pedestrianApproachAnnounced = false;
        this.previousHillRearX = undefined;
        this.previousHillFrontX = undefined;
        this.hillApproachAnnounced = false;
        this.hillEntryChimePlayed = false;
    }

    updatePedestrianApproach(frontPosition: { x: number; z: number }): void {
        if (this.finishedHandled) return;
        const previous = this.previousPedestrianFrontX;
        this.previousPedestrianFrontX = frontPosition.x;
        const line = EXAM_02_APPROACH_VOICE_LINE;
        const nearEdgeX = line.x - line.thicknessM / 2;
        if (this.pedestrianApproachAnnounced || previous === undefined || previous >= nearEdgeX
            || frontPosition.x < nearEdgeX || Math.abs(frontPosition.z - line.z) > line.widthM / 2) return;
        this.pedestrianApproachAnnounced = true;
        this.enqueue({ src: pedestrianApproachVoice, withChime: true });
    }

    updateHillApproach(frontPosition: { x: number; z: number }, rearPosition: { x: number; z: number }): void {
        if (this.finishedHandled) return;
        const previousRear = this.previousHillRearX;
        const previousFront = this.previousHillFrontX;
        this.previousHillRearX = rearPosition.x;
        this.previousHillFrontX = frontPosition.x;
        // Wait until the rear bumper clears the actual far edge of the crossing.
        const crossing = EXAM_02_CROSSWALK;
        const exitX = crossing.x + crossing.depthM / 2;
        if (!this.hillApproachAnnounced && previousRear !== undefined
            && previousRear < exitX && rearPosition.x >= exitX
            && Math.abs(rearPosition.z - crossing.z) <= (crossing.widthM - .4) / 2) {
            this.hillApproachAnnounced = true;
            this.enqueue({ src: hillApproachVoice });
        }
        const line = EXAM_03_ENTRY_CHIME_LINE;
        const nearEdgeX = line.x - line.thicknessM / 2;
        if (!this.hillEntryChimePlayed && previousFront !== undefined
            && previousFront < nearEdgeX && frontPosition.x >= nearEdgeX
            && Math.abs(frontPosition.z - line.z) <= line.widthM / 2) {
            this.hillEntryChimePlayed = true;
            // The entry bell must sound at the line, even during the introduction.
            this.playAccompanyingChime();
        }
    }

    private maybePlayPostStartChime(frontPosition: { x: number; z: number }): void {
        const previous = this.previousChimeFrontX;
        this.previousChimeFrontX = frontPosition.x;
        const thresholdX = startPosition.lineX + POST_START_CHIME_DISTANCE_M;
        // Use the same front-bumper reference as the 5 m indicator-off rule.
        if (this.postStartChimePlayed || previous === undefined || previous >= thresholdX
            || frontPosition.x < thresholdX
            || Math.abs(frontPosition.z - startPosition.lineZ) > startWaitingLine.widthM / 2) return;
        this.postStartChimePlayed = true;
        this.enqueue({ src: postStartChime });
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
        for (const event of penalties) {
            if (this.announcedEvents.has(event)) continue;
            const lesson4Match = event.lessonId === 4
                ? lesson4PenaltyVoices.find(([reason]) => event.reason.includes(reason)) : undefined;
            if (lesson4Match) {
                this.announcedEvents.add(event);
                this.enqueue({ src: `/voice/bai4/${lesson4Match[1]}` });
                continue;
            }
            const lesson3Match = event.lessonId === 3
                ? lesson3PenaltyVoices.find(([reason]) => event.reason.includes(reason)) : undefined;
            if (lesson3Match) {
                this.announcedEvents.add(event);
                this.enqueue({ src: `/voice/bai3/${lesson3Match[1]}` });
                continue;
            }
            if (event.points <= 0) continue;
            const lesson2Match = event.lessonId === 2
                ? lesson2PenaltyVoices.find(([reason]) => event.reason === reason) : undefined;
            if (lesson2Match) {
                this.announcedEvents.add(event);
                this.enqueue({ src: `/voice/bai2/${lesson2Match[1]}` });
                continue;
            }
            const match = recurringPenaltyVoices.find(([reason]) => event.reason.includes(reason));
            if (!match) continue;
            this.announcedEvents.add(event);
            this.enqueue({ src: `/voice/bai1/${match[1]}` });
        }
    }

    private stopPlayback(): void {
        this.queue = [];
        this.clearRetry();
        this.stopAccompanyingChime();
        if (this.audio) {
            this.audio.onended = null;
            this.audio.onerror = null;
            this.audio.onplaying = null;
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
        if (clip.withChime) {
            let chimeStarted = false;
            audio.onplaying = () => {
                if (this.audio !== audio || chimeStarted) return;
                chimeStarted = true;
                this.playAccompanyingChime();
            };
        }
        audio.onended = () => {
            if (this.audio !== audio) return;
            audio.onplaying = null;
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

    private playAccompanyingChime(): void {
        this.stopAccompanyingChime();
        const audio = new Audio(postStartChime);
        this.accompanyingChime = audio;
        audio.onended = () => {
            if (this.accompanyingChime === audio) this.accompanyingChime = undefined;
        };
        audio.onerror = () => {
            if (this.accompanyingChime === audio) this.stopAccompanyingChime();
        };
        void audio.play().catch(() => {
            if (this.accompanyingChime === audio) this.stopAccompanyingChime();
        });
    }

    private stopAccompanyingChime(): void {
        if (!this.accompanyingChime) return;
        this.accompanyingChime.onended = null;
        this.accompanyingChime.onerror = null;
        this.accompanyingChime.pause();
        this.accompanyingChime = undefined;
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
