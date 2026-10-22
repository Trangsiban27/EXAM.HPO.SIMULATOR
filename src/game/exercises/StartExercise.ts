import * as THREE from 'three';
import { startPosition } from '../startPosition';
import type { PenaltyEvent } from '../types';
import {
    EXAM_01_START_RULES,
    EXAM_VEHICLE_CLASS,
    resolveStartRules,
    type ExamVehicleClass
} from '../exam/examRules';

/**
 * State machine for Bài sát hạch số 1 — Xuất phát (1A / EXAM_01_START).
 * Nomenclature follows spec/exam/exam_01_start.md §7:
 *
 *   PRE_START                     → xe đang chạy đến vạch, động cơ có thể đã nổ.
 *     ↓ voice hướng dẫn đọc xong
 *   COUNTDOWN_5S                  → hai voice đầu đã xong, chờ xi nhan trái bật đủ 5s.
 *     ↓ bắt đầu phát batdauthi.mp3
 *   START_ANNOUNCEMENT            → chờ voice hiệu lệnh đọc xong.
 *     ↓ voice đọc xong, đèn xanh
 *   COMMAND_RECEIVED              → bật startLamp, bắt đầu timer 20s/30s.
 *     ↓ xe đi qua START_LINE
 *   START_LINE_CROSSED            → đã vượt vạch, kiểm tra xi nhan trái.
 *     ↓ đến mốc 5 m
 *   SIGNAL_OFF_ZONE               → kiểm tra xi nhan trái tắt tại 5 m.
 *     ↓ đã tắt
 *   EXAM_01_COMPLETED             → kết thúc bài 1.
 *
 *   DISQUALIFIED                  → kết thúc bất thường (timeout, curb, accident).
 */
export type StartState =
    | 'PRE_START'
    | 'COUNTDOWN_5S'
    | 'START_ANNOUNCEMENT'
    | 'WAITING_FOR_START_COMMAND'
    | 'WAITING_FOR_GO'
    | 'COMMAND_RECEIVED'
    | 'STARTING'
    | 'START_LINE_CROSSED'
    | 'SIGNAL_OFF_ZONE'
    | 'EXAM_01_COMPLETED'
    | 'DISQUALIFIED';

export type StartSignalPhase = 'idle' | 'red' | 'green' | 'yellow';

export interface Exam01Input {
    position: THREE.Vector3;
    /** World position of the front bumper (local -Z). */
    frontPosition: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    leftSignal: boolean;
    /** Phase of the start signal (driven by the vehicle-mounted TrafficLight). */
    startSignal: StartSignalPhase;
    /** Time delta in seconds since the previous update call. */
    dt: number;
}

export interface Exam01Result {
    toast?: string;
    penalties: PenaltyEvent[];
    completed: boolean;
    disqualified: boolean;
    /** Lý do bị đình chỉ (chỉ có khi disqualified = true). */
    disqualifyReason?: string;
}

const roadWidth = 8;
const markingHalf = 1.3;

export interface StartExerciseOptions {
    vehicleClass?: ExamVehicleClass;
    /** Optional override cho lineX/lineZ (mặc định lấy từ startPosition). */
    lineX?: number;
    lineZ?: number;
}

/**
 * Bài sát hạch số 1 — Xuất phát (1A / EXAM_01_START).
 *
 * Left signal is scored when the front bumper crosses START_LINE and must be off
 * 5 m after the line. Spec source: spec/exam/exam_01_start.md.
 */
export class StartExercise {
    readonly id = 'EXAM_01_START';
    state: StartState = 'PRE_START';
    readonly waitZone: THREE.Box3;
    readonly startTrigger: THREE.Box3;
    readonly signalOffGate: THREE.Box3;
    readonly vehicleClass: ExamVehicleClass;
    startLampOn = false;

    private readonly lineX: number;
    private readonly signalOffX: number;
    private readonly rules = resolveStartRules(EXAM_VEHICLE_CLASS);
    private commandAt = 0;
    private penalty20sApplied = false;
    private crossedChecked = false;
    private timingPenaltyApplied = false;
    private stallLatched = false;
    private rpmLatched = false;
    private speedingSec = 0;
    private engineWasRunning = false;
    private prevFrontX = 0;
    private signalOffChecked = false;

    constructor(options: StartExerciseOptions = {}) {
        this.vehicleClass = options.vehicleClass ?? EXAM_VEHICLE_CLASS;
        this.lineX = options.lineX ?? startPosition.lineX;
        this.signalOffX = this.lineX + this.rules.signalOffDistanceM;
        const lineZ = options.lineZ ?? startPosition.lineZ;
        this.waitZone = new THREE.Box3(
            new THREE.Vector3(this.lineX - 4, -1, lineZ - roadWidth / 2),
            new THREE.Vector3(this.lineX - markingHalf, 3, lineZ + roadWidth / 2)
        );
        this.startTrigger = new THREE.Box3(
            new THREE.Vector3(this.lineX - markingHalf, -1, lineZ - roadWidth / 2),
            new THREE.Vector3(this.lineX + markingHalf, 3, lineZ + roadWidth / 2)
        );
        this.signalOffGate = new THREE.Box3(
            new THREE.Vector3(this.signalOffX - .4, -1, lineZ - roadWidth / 2),
            new THREE.Vector3(this.signalOffX + .4, 3, lineZ + roadWidth / 2)
        );
        this.prevFrontX = this.lineX - startPosition.distance;
    }

    get title(): string {
        switch (this.state) {
            case 'PRE_START': return 'Chuẩn bị';
            case 'COUNTDOWN_5S': return 'Xuất phát · Chuẩn bị xuất phát';
            case 'START_ANNOUNCEMENT': return 'Xuất phát · Đang phát hiệu lệnh';
            case 'WAITING_FOR_START_COMMAND': return 'Xuất phát · Chờ hiệu lệnh';
            case 'WAITING_FOR_GO': return 'Xuất phát · Chờ tín hiệu xanh';
            case 'COMMAND_RECEIVED': return 'Xuất phát · Được phép xuất phát';
            case 'STARTING': return 'Xuất phát · Đang khởi hành';
            case 'START_LINE_CROSSED': return 'Xuất phát · Tắt xi nhan trái sau 5 m';
            case 'SIGNAL_OFF_ZONE': return 'Xuất phát · Tắt xi nhan trái sau 5 m';
            case 'EXAM_01_COMPLETED': return 'Xuất phát';
            case 'DISQUALIFIED': return 'Xuất phát · Đình chỉ';
        }
    }

    reset(): void {
        this.state = 'PRE_START';
        this.startLampOn = false;
        this.commandAt = 0;
        this.penalty20sApplied = false;
        this.crossedChecked = false;
        this.timingPenaltyApplied = false;
        this.stallLatched = false;
        this.rpmLatched = false;
        this.speedingSec = 0;
        this.engineWasRunning = false;
        this.signalOffChecked = false;
        this.prevFrontX = this.lineX - startPosition.distance;
    }

    instructionsEnded(): void {
        if (this.state === 'PRE_START') this.state = 'COUNTDOWN_5S';
    }

    beginStartAnnouncement(): void {
        if (this.state === 'COUNTDOWN_5S') this.state = 'START_ANNOUNCEMENT';
    }

    /** Only the ended event of batdauthi.mp3 authorizes scoring and departure. */
    receiveStartCommand(): boolean {
        if (this.state !== 'START_ANNOUNCEMENT') return false;
        this.state = 'COMMAND_RECEIVED';
        this.commandAt = performance.now();
        this.startLampOn = true;
        return true;
    }

    update(input: Exam01Input): Exam01Result {
        const penalties: PenaltyEvent[] = [];
        const now = performance.now();
        const add = (points: number, reason: string) => {
            penalties.push({ at: now, points, reason });
        };
        const frontX = input.frontPosition.x;
        const crossedLine = this.prevFrontX < this.lineX && frontX >= this.lineX;
        const reached5m = this.prevFrontX < this.signalOffX && frontX >= this.signalOffX;
        this.prevFrontX = frontX;

        if (this.state === 'EXAM_01_COMPLETED' || this.state === 'DISQUALIFIED') {
            return {
                penalties,
                completed: this.state === 'EXAM_01_COMPLETED',
                disqualified: this.state === 'DISQUALIFIED',
            };
        }

        if (this.state === 'PRE_START' || this.state === 'COUNTDOWN_5S'
            || this.state === 'START_ANNOUNCEMENT') {
            if (crossedLine) return this.markEarlyCrossing();
            return this.state === 'PRE_START' ? this.updateApproach(input)
                : { penalties, completed: false, disqualified: false };
        }

        this.checkEngineAndSpeed(input, add);

        if (this.state === 'COMMAND_RECEIVED' || this.state === 'STARTING') {
            const elapsed = (now - this.commandAt) / 1000;
            if (crossedLine) {
                this.markCrossed(input, add);
                this.state = 'START_LINE_CROSSED';
                return {
                    toast: 'Lệnh xuất phát',
                    penalties,
                    completed: false,
                    disqualified: false,
                };
            }
            if (elapsed >= this.rules.startTimeout.disqualifyAtSec) {
                this.state = 'DISQUALIFIED';
                this.startLampOn = false;
                const reason = `Quá ${this.rules.startTimeout.disqualifyAtSec}s chưa qua vạch xuất phát`;
                return {
                    toast: `Đình chỉ sát hạch — ${reason}`,
                    penalties: [],
                    completed: false,
                    disqualified: true,
                    disqualifyReason: reason,
                };
            }
            if (!this.penalty20sApplied && elapsed >= this.rules.startTimeout.penaltyAtSec) {
                this.penalty20sApplied = true;
                add(this.rules.startTimeout.penaltyPoints,
                    `Quá ${this.rules.startTimeout.penaltyAtSec}s chưa qua vạch xuất phát`);
            }
            return { penalties, completed: false, disqualified: false };
        }

        if (this.state === 'START_LINE_CROSSED') {
            this.state = 'SIGNAL_OFF_ZONE';
            return { penalties, completed: false, disqualified: false };
        }

        if (this.state === 'SIGNAL_OFF_ZONE') {
            const toast = this.checkSignalOff(input, reached5m, add);
            const insideGate = this.signalOffGate.containsPoint(input.frontPosition);
            if (insideGate && !this.signalOffChecked) {
                this.signalOffChecked = true;
            }
            if (this.signalOffChecked && input.leftSignal === false) {
                this.state = 'EXAM_01_COMPLETED';
                this.startLampOn = false;
                return { toast: toast ?? 'Hoàn thành bài 1', penalties, completed: true, disqualified: false };
            }
            // Auto-complete after some distance past the gate even if driver forgets
            // to release the signal — completion is what the spec calls "lái xe đến
            // bài sát hạch tiếp theo", the gate is the scoring window.
            if (frontX >= this.signalOffX + 2) {
                this.state = 'EXAM_01_COMPLETED';
                this.startLampOn = false;
                return { toast: 'Hoàn thành bài 1', penalties, completed: true, disqualified: false };
            }
            return { toast, penalties, completed: false, disqualified: false };
        }

        return { penalties, completed: false, disqualified: false };
    }

    private updateApproach(input: Exam01Input): Exam01Result {
        const penalties: PenaltyEvent[] = [];
        const startedEngine = input.engineRunning && !this.engineWasRunning;
        this.engineWasRunning = input.engineRunning;
        if (startedEngine) {
            return {
                toast: 'Chào mừng bạn đến với bài thi sát hạch, đưa xe đến vạch xuất phát.',
                penalties: [], completed: false, disqualified: false
            };
        }
        return { penalties: [], completed: false, disqualified: false };
    }

    private markCrossed(
        input: Exam01Input,
        add: (points: number, reason: string) => void
    ): void {
        if (this.crossedChecked) return;
        this.crossedChecked = true;
        if (!input.leftSignal) {
            add(this.rules.penalties.noLeftSignalAtStart, 'Không bật xi nhan trái khi xuất phát');
        }
    }

    private markEarlyCrossing(): Exam01Result {
        this.state = 'DISQUALIFIED';
        this.startLampOn = false;
        const reason = 'Xuất phát khi chưa có hiệu lệnh';
        return {
            toast: `Đình chỉ sát hạch — ${reason}`,
            penalties: [],
            completed: false,
            disqualified: true,
            disqualifyReason: reason,
        };
    }

    private checkSignalOff(
        input: Exam01Input,
        reached5m: boolean,
        add: (points: number, reason: string) => void
    ): string | undefined {
        if (reached5m && input.leftSignal) {
            add(this.rules.penalties.leftSignalNotOffAt5m, 'Không tắt xi nhan trái tại mốc 5 m');
        }
        // Lỗi 04: nếu xi nhan trái vẫn BẬT sau khi đã qua mốc 5 m thì chấm thêm 1
        // lần "không tắt kịp thời" — gộp vào hằng leftSignalTiming đã có trong
        // examRules (5 điểm). Chỉ chấm 1 lần duy nhất.
        if (this.signalOffChecked && input.leftSignal && !this.timingPenaltyApplied) {
            this.timingPenaltyApplied = true;
            add(this.rules.penalties.leftSignalTiming, 'Xi nhan trái không tắt kịp thời sau mốc 5 m');
        }
        return undefined;
    }

    private checkEngineAndSpeed(
        input: Exam01Input,
        add: (points: number, reason: string) => void
    ): void {
        if (input.stalled && !this.stallLatched) {
            this.stallLatched = true;
            add(this.rules.engine.stallPenalty, 'Chết máy');
        }
        if (!input.stalled) this.stallLatched = false;

        if (input.rpm > this.rules.engine.maxRPM && !this.rpmLatched) {
            this.rpmLatched = true;
            add(this.rules.engine.rpmExceededPenalty, `Vượt ${this.rules.engine.maxRPM} vòng/phút`);
        }
        if (input.rpm <= this.rules.engine.maxRPM) this.rpmLatched = false;

        if (input.speedKmh > this.rules.maxSpeedKmh) {
            this.speedingSec += input.dt;
            while (this.speedingSec >= this.rules.speeding.intervalSec) {
                this.speedingSec -= this.rules.speeding.intervalSec;
                add(this.rules.speeding.penaltyPerInterval, 'Vượt tốc độ quy định');
            }
        } else {
            this.speedingSec = 0;
        }
    }
}

/**
 * Suppress unused-warning mà vẫn cho phép tree-shake toàn module.
 * EXAM_01_START_RULES được nhúng lại để IDE có thể auto-completion và doc lookup.
 */
export const _RULES_REFERENCE: typeof EXAM_01_START_RULES = EXAM_01_START_RULES;
