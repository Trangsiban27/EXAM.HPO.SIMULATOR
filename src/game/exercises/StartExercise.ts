import * as THREE from 'three';
import { startPosition } from '../startPosition';
import type { PenaltyEvent } from '../types';
import { EXAM_01_START_RULES, EXAM_VEHICLE_CLASS } from '../exam/examRules';

export type StartState =
    | 'APPROACHING'
    | 'COUNTDOWN_5S'
    | 'WAITING_COMMAND'
    | 'COMMAND_RECEIVED'
    | 'START_LINE_CROSSED'
    | 'COMPLETED'
    | 'DISQUALIFIED';

export type StartSignalPhase = 'idle' | 'red' | 'green';

export interface Exam01Input {
    position: THREE.Vector3;
    /** World position of the front bumper (local -Z). */
    frontPosition: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    leftSignal: boolean;
    seatBeltFastened: boolean;
    startSignal: StartSignalPhase;
    dt: number;
}

export interface Exam01Result {
    toast?: string;
    penalties: PenaltyEvent[];
    completed: boolean;
    disqualified: boolean;
}

const roadWidth = 8;
const markingHalf = 1.3;
const rules = EXAM_01_START_RULES;
const maxSpeed = rules.maxSpeedKmh[EXAM_VEHICLE_CLASS];
const lineX = startPosition.lineX;
const signalOffX = lineX + rules.signalOffDistanceM;
const movingKmh = .8;
/** Silent 5-second countdown before announcing the exam start. */
const startCountdownSec = 5;

/**
 * Bài sát hạch số 1 — Xuất phát (1A / EXAM_01_START).
 * Seatbelt and left-signal-at-start are scored at khởi hành (first motion after GO,
 * or front bumper crossing START_LINE). Left signal must be off 5 m after the line.
 */
export class StartExercise {
    readonly id = 'EXAM_01_START';
    state: StartState = 'APPROACHING';
    readonly waitZone: THREE.Box3;
    readonly startTrigger: THREE.Box3;
    readonly signalOffGate: THREE.Box3;
    startLampOn = false;

    private commandAt = 0;
    private countdownAt = 0;
    private penalty20sApplied = false;
    private seatbeltChecked = false;
    private leftOnAtStartChecked = false;
    private departed = false;
    private stallLatched = false;
    private rpmLatched = false;
    private speedingSec = 0;
    private engineWasRunning = false;
    private stopDwell = 0;
    private waitToastAt = -Infinity;
    private prevFrontX = lineX - startPosition.distance;

    constructor() {
        const { lineZ } = startPosition;
        this.waitZone = new THREE.Box3(
            new THREE.Vector3(lineX - 4, -1, lineZ - roadWidth / 2),
            new THREE.Vector3(lineX - markingHalf, 3, lineZ + roadWidth / 2)
        );
        this.startTrigger = new THREE.Box3(
            new THREE.Vector3(lineX - markingHalf, -1, lineZ - roadWidth / 2),
            new THREE.Vector3(lineX + markingHalf, 3, lineZ + roadWidth / 2)
        );
        this.signalOffGate = new THREE.Box3(
            new THREE.Vector3(signalOffX - .4, -1, lineZ - roadWidth / 2),
            new THREE.Vector3(signalOffX + .4, 3, lineZ + roadWidth / 2)
        );
    }

    get title() {
        if (this.state === 'DISQUALIFIED') return 'Xuất phát · Đình chỉ';
        if (this.state === 'APPROACHING') return 'Chuẩn bị';
        if (this.state === 'COUNTDOWN_5S') return 'Xuất phát · Chuẩn bị xuất phát';
        if (this.state === 'WAITING_COMMAND') return 'Xuất phát · Chờ hiệu lệnh';
        if (this.state === 'COMMAND_RECEIVED') return 'Xuất phát · Được phép xuất phát';
        if (this.state === 'START_LINE_CROSSED') return 'Xuất phát · Tắt xi nhan trái sau 5 m';
        if (this.state === 'COMPLETED') return 'Xuất phát';
        return 'Xuất phát';
    }

    reset() {
        this.state = 'APPROACHING';
        this.startLampOn = false;
        this.commandAt = 0;
        this.countdownAt = 0;
        this.penalty20sApplied = false;
        this.seatbeltChecked = false;
        this.leftOnAtStartChecked = false;
        this.departed = false;
        this.stallLatched = false;
        this.rpmLatched = false;
        this.speedingSec = 0;
        this.engineWasRunning = false;
        this.stopDwell = 0;
        this.waitToastAt = -Infinity;
        this.prevFrontX = lineX - startPosition.distance;
    }

    update(input: Exam01Input): Exam01Result {
        const penalties: PenaltyEvent[] = [];
        const now = performance.now();
        const add = (points: number, reason: string) => {
            penalties.push({ at: now, points, reason });
        };
        const frontX = input.frontPosition.x;
        const crossedLine = this.prevFrontX < lineX && frontX >= lineX;
        const reached5m = this.prevFrontX < signalOffX && frontX >= signalOffX;
        this.prevFrontX = frontX;

        if (this.state === 'COMPLETED' || this.state === 'DISQUALIFIED') {
            return { penalties, completed: this.state === 'COMPLETED', disqualified: this.state === 'DISQUALIFIED' };
        }

        if (this.state === 'APPROACHING') {
            return this.updateApproach(input);
        }

        // Silent countdown window: the exam does not officially begin until
        // startCountdownSec have elapsed with the vehicle stopped at the line.
        // BUGFIX: use input.position (root) instead of input.frontPosition.
        // At the start line, rootPosition.x ∈ [-24, -21.3] (inside waitZone), but
        // frontPosition.x = rootPosition.x + 2.2 > -21.3 (already past the zone).
        if (this.state === 'COUNTDOWN_5S') {
            const atLine = this.waitZone.containsPoint(input.position)
                && input.position.x < lineX - .15;
            const stopped = Math.abs(input.speedKmh) < .6;
            if (!input.engineRunning || !atLine || !stopped) {
                this.state = 'APPROACHING';
                this.stopDwell = 0;
                this.countdownAt = 0;
                return { penalties, completed: false, disqualified: false };
            }
            if (this.countdownAt === 0) this.countdownAt = now;
            const elapsedSec = (now - this.countdownAt) / 1000;
            if (elapsedSec >= startCountdownSec) {
                this.state = 'WAITING_COMMAND';
                this.startLampOn = true;
                return { toast: 'Bắt đầu thi', penalties: [], completed: false, disqualified: false };
            }
            return { penalties, completed: false, disqualified: false };
        }

        this.checkEngineAndSpeed(input, add);

        if (this.state === 'WAITING_COMMAND') {
            if (input.startSignal === 'green') {
                this.state = 'COMMAND_RECEIVED';
                this.commandAt = now;
                this.startLampOn = true;
                const moving = Math.abs(input.speedKmh) >= movingKmh;
                if (moving || crossedLine || frontX >= lineX) {
                    this.markDeparted(input, add);
                }
                if (crossedLine || frontX >= lineX) {
                    return this.onStartLineCrossed(input, penalties, add, 'Lệnh xuất phát');
                }
                return { toast: 'Lệnh xuất phát', penalties, completed: false, disqualified: false };
            }
            if (frontX >= lineX || this.startTrigger.containsPoint(input.frontPosition)) {
                if (now - this.waitToastAt < 2500) return { penalties, completed: false, disqualified: false };
                this.waitToastAt = now;
                return { toast: 'Chờ hiệu lệnh xuất phát', penalties, completed: false, disqualified: false };
            }
            return { penalties, completed: false, disqualified: false };
        }

        const elapsed = (now - this.commandAt) / 1000;

        if (this.state === 'COMMAND_RECEIVED') {
            if (!this.departed && (Math.abs(input.speedKmh) >= movingKmh || crossedLine || frontX >= lineX)) {
                this.markDeparted(input, add);
                if (crossedLine || frontX >= lineX) {
                    return this.onStartLineCrossed(input, penalties, add, 'Lệnh xuất phát');
                }
                return { toast: 'Lệnh xuất phát', penalties, completed: false, disqualified: false };
            }
            if (elapsed >= rules.commandWindowSec) {
                this.state = 'DISQUALIFIED';
                this.startLampOn = false;
                return {
                    toast: 'Đình chỉ sát hạch — Quá thời gian xuất phát',
                    penalties: [],
                    completed: false,
                    disqualified: true,
                };
            }
            if (!this.penalty20sApplied && elapsed >= 20) {
                this.penalty20sApplied = true;
                add(5, 'Quá 20 giây chưa qua vạch xuất phát');
            }
            return { penalties, completed: false, disqualified: false };
        }

        if (this.state === 'START_LINE_CROSSED') {
            const toast = this.checkSignalOff(input, reached5m, add);
            if (this.signalOffGate.containsPoint(input.frontPosition)) {
                this.state = 'COMPLETED';
                this.startLampOn = false;
                return { toast: toast ?? 'Hoàn thành bài 1', penalties, completed: true, disqualified: false };
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
        // BUGFIX: use input.position (root) instead of input.frontPosition.
        const atLine = this.waitZone.containsPoint(input.position)
            && input.position.x < lineX - .15;
        const stopped = Math.abs(input.speedKmh) < .6;
        if (input.engineRunning && atLine && stopped) {
            this.stopDwell += input.dt;
            if (this.stopDwell >= .4) {
                this.state = 'COUNTDOWN_5S';
                this.countdownAt = 0;
                return { penalties: [], completed: false, disqualified: false };
            }
        } else {
            this.stopDwell = 0;
        }
        return { penalties: [], completed: false, disqualified: false };
    }

    private markDeparted(input: Exam01Input, add: (points: number, reason: string) => void) {
        this.departed = true;
        if (!this.seatbeltChecked) {
            this.seatbeltChecked = true;
            if (!input.seatBeltFastened) add(5, 'Không thắt dây an toàn khi xuất phát');
        }
        if (!this.leftOnAtStartChecked) {
            this.leftOnAtStartChecked = true;
            if (!input.leftSignal) add(5, 'Không bật xi nhan trái khi xuất phát');
        }
    }

    private checkSignalOff(
        input: Exam01Input,
        reached5m: boolean,
        add: (points: number, reason: string) => void
    ): string | undefined {
        if (reached5m) {
            if (input.leftSignal) add(5, 'Không tắt xi nhan trái sau 5 m');
            return undefined;
        }
        return undefined;
    }

    private onStartLineCrossed(
        input: Exam01Input,
        penalties: PenaltyEvent[],
        add: (points: number, reason: string) => void,
        toast: string
    ): Exam01Result {
        this.markDeparted(input, add);
        this.state = 'START_LINE_CROSSED';
        this.startLampOn = false;
        return { toast, penalties, completed: false, disqualified: false };
    }

    private checkEngineAndSpeed(input: Exam01Input, add: (points: number, reason: string) => void) {
        if (input.stalled && !this.stallLatched) {
            this.stallLatched = true;
            add(rules.engine.stallPenalty[EXAM_VEHICLE_CLASS], 'Chết máy');
        }
        if (!input.stalled) this.stallLatched = false;

        if (input.rpm > rules.engine.maxRPM && !this.rpmLatched) {
            this.rpmLatched = true;
            add(rules.engine.rpmExceededPenalty[EXAM_VEHICLE_CLASS], 'Vượt 4000 vòng/phút');
        }
        if (input.rpm <= rules.engine.maxRPM) this.rpmLatched = false;

        if (input.speedKmh > maxSpeed) {
            this.speedingSec += input.dt;
            while (this.speedingSec >= rules.speeding.intervalSec[EXAM_VEHICLE_CLASS]) {
                this.speedingSec -= rules.speeding.intervalSec[EXAM_VEHICLE_CLASS];
                add(rules.speeding.penaltyPerInterval[EXAM_VEHICLE_CLASS], 'Vượt tốc độ quy định');
            }
        } else {
            this.speedingSec = 0;
        }
    }
}
