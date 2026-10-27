import * as THREE from 'three';
import type { PenaltyEvent } from '../types';
import { EXAM_03_HILL_RULES, EXAM_VEHICLE_CLASS } from '../exam/examRules';
import { ReadyChime } from './ReadyChime';

/**
 * Bài sát hạch số 3 — Dừng và khởi hành xe ngang dốc (EXAM_03_HILL_STOP_AND_START).
 *
 * Spec nguồn: spec/exam/exam_03_hill_stop_and_start.md
 *
 * Hệ tọa độ: xe di chuyển theo +X trong world (heading = -PI/2).
 * Trong scene, bridge có direction='horizontal', rotation.y = -PI/2.
 * Mapping: world_X = 31 - local_Z (root của bridge tại X=31).
 * Xe tiến về phía +X trong world:
 *   - Xe vào cầu tại world X = 18 (chân TÂY, local Z = +13).
 *   - Đỉnh tại world X = 31 (local Z = 0).
 *   - Vạch vàng (reference, bánh sau đến → trigger) tại world X = 21.5 (local Z = +9.5).
 *   - Vạch trắng (stop line, thanh cản đến → trigger) tại world X = 25.5 (local Z = +5.5).
 *   - Xe ra cầu tại world X = 44 (chân ĐÔNG, local Z = -13).
 *
 * State machine (spec §10):
 *   INACTIVE
 *     ↓ activate()
 *   APPROACHING_STOP_LINE
 *     ↓ bánh xe sau qua vạch vàng + dừng đủ lâu
 *   STOP_EVALUATION
 *     ↓ (chuyển ngay sang WAITING_TO_START)
 *   WAITING_TO_START (chờ 2s)
 *     ↓ (2s) + phát chuông báo khởi hành
 *   HILL_STARTING (timer 30s bắt đầu)
 *     ├── rollback > 0.5m → DISQUALIFIED
 *     ├── qua vạch → START_COMPLETED
 *     └── quá 30s → DISQUALIFIED
 *     ↓
 *   LEAVE_HILL
 *     ↓ exit sensor
 *   COMPLETED
 */

export type Exam03State =
    | 'INACTIVE'
    | 'APPROACHING_STOP_LINE'
    | 'STOP_EVALUATION'
    | 'WAITING_TO_START'
    | 'HILL_STARTING'
    | 'START_COMPLETED'
    | 'LEAVE_HILL'
    | 'COMPLETED'
    | 'DISQUALIFIED';

export interface Exam03Input {
    /** Tâm xe (root). */
    position: THREE.Vector3;
    /** Hình chiếu thanh cản phía trước — dùng cho khoảng cách A. */
    frontPosition: THREE.Vector3;
    /** Tọa độ X của bánh xe sau (world space). */
    rearWheelX: number;
    /** Vector hướng lên dốc (đơn vị, trong world space). */
    hillForwardAxis: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    clutch: number;
    dt: number;
}

export interface Exam03Result {
    toast?: string;
    penalties: PenaltyEvent[];
    completed: boolean;
    disqualified: boolean;
    /** Khoảng cách A từ thanh cản trước đến vạch dừng. */
    stopDistanceA?: number;
    /** Rollback hiện tại (m). */
    rollbackM?: number;
    /** Trạng thái dừng. */
    stopClassification?: 'VALID_STOP' | 'STOP_TOO_EARLY' | 'STOP_OVER_LINE' | 'NO_REQUIRED_STOP';
    /** Số giây còn lại để khởi hành. */
    timeRemainingSec?: number;
    /** Báo hiệu cần phát chuông khởi hành (chỉ true 1 lần duy nhất). */
    readyBeep?: boolean;
    /** Lý do bị đình chỉ (chỉ có khi disqualified = true). */
    disqualifyReason?: string;
}

export interface Exam03HillOptions {
    /** Tọa độ X của vạch dừng 3A (world space). */
    stopLineX: number;
    /** Tọa độ X của vạch vàng 3A (world space). */
    yellowLineX: number;
    /** Tọa độ Z tâm đường (dùng cho geometry visual). */
    roadZ: number;
    /** Chiều rộng làn đường. */
    roadWidth: number;
    /** Vector hướng lên dốc trong world space (đơn vị). Default: (1, 0, 0). */
    hillForwardAxis?: THREE.Vector3;
    /** Khoảng cách từ vạch dừng đến exit sensor (m). Default: 3. */
    exitDistanceM?: number;
    /** Ngưỡng tốc độ coi như đã dừng (km/h). Default: 0.6. */
    stopSpeedKmh?: number;
    /** Thời gian dừng tối thiểu để được tính là dừng (s). Default: 0.3. */
    minStopDwellSec?: number;
}

const DEFAULTS = {
    exitDistanceM: 3,
    stopSpeedKmh: .6,
    minStopDwellSec: .3,
};

/** Thời gian chờ sau khi dừng trước khi phát tín hiệu sẵn sàng (s). */
const READY_WAIT_SEC = 2;

export class Exam03Hill {
    readonly id = 'EXAM_03_HILL_STOP_AND_START';
    state: Exam03State = 'INACTIVE';

    /** Tọa độ X của vạch dừng (trục di chuyển của xe). */
    readonly stopLineX: number;
    /** Tọa độ X của vạch vàng (trục di chuyển của xe). */
    readonly yellowLineX: number;
    /** Tọa độ X tại đó exit sensor kích hoạt. */
    readonly exitX: number;

    private readonly maxDistanceBeforeLineM: number;
    private readonly maxRollbackM: number;
    private readonly maxStartTimeSec: number;
    private readonly maxRPM: number;
    private readonly stallPenalty: number;
    private readonly rpmExceededPenalty: number;
    private readonly stopTooEarlyPenalty: number;
    private readonly speedingIntervalSec: number;
    private readonly speedingPenaltyPerInterval: number;
    private readonly stopSpeedKmh: number;
    private readonly minStopDwellSec: number;

    /** Vector hướng lên dốc (đơn vị, world space). */
    readonly hillForwardAxis: THREE.Vector3;

    private stoppedSince = 0;
    private activatedAt = 0;
    private stopEvaluated = false;
    private vehicleStopped = false;
    private crossedStopLineAfterRestart = false;
    private rpmViolationLatched = false;
    private speedingSec = 0;
    private arrivalOvertimeSec = 0;
    private engineWasRunning = false;
    private stallLatched = false;
    private stallEventCount = 0;

    /** Đã phát chuông báo hiệu chưa. */
    private readyBeepFired = false;
    private readonly readyChime = new ReadyChime();
    private waitingToastFired = false;

    /** Thời điểm bắt đầu timer 30s (sau khi phát beep). */
    private startDeadlineAt = 0;

    /** Vị trí xe tại thời điểm dừng (dùng tính rollback). */
    private stoppedPosition: THREE.Vector3 | null = null;

    /** Rollback hiện tại (m). */
    private _rollbackM = 0;

    /** Thời gian còn lại để khởi hành (s). Được cập nhật trong update(). */
    timeRemainingSec: number | undefined;

    private _stopClassification: Exam03Result['stopClassification'];
    private _disqualifyReason = '';

    constructor(options: Exam03HillOptions) {
        const opts = { ...DEFAULTS, ...options };
        this.stopLineX = opts.stopLineX;
        this.yellowLineX = opts.yellowLineX;
        this.exitX = opts.stopLineX + opts.exitDistanceM;
        this.stopSpeedKmh = opts.stopSpeedKmh;
        this.minStopDwellSec = opts.minStopDwellSec;
        this.hillForwardAxis = opts.hillForwardAxis?.clone() ?? new THREE.Vector3(1, 0, 0);

        const rules = EXAM_03_HILL_RULES;
        this.maxDistanceBeforeLineM = rules.stopPosition.maxDistanceBeforeLineM;
        this.maxRollbackM = rules.hillStart.maxRollbackM;
        this.maxStartTimeSec = rules.hillStart.mustCrossStopPositionWithinSec;
        this.maxRPM = rules.engine.maxRPM;
        this.stallPenalty = rules.engine.stallPenalty[EXAM_VEHICLE_CLASS];
        this.rpmExceededPenalty = rules.engine.rpmExceededPenalty[EXAM_VEHICLE_CLASS];
        this.stopTooEarlyPenalty = rules.penalties.stopTooEarly;
        this.speedingIntervalSec = rules.speeding.intervalSec;
        this.speedingPenaltyPerInterval = rules.speeding.penaltyPerInterval;
    }

    get title(): string {
        switch (this.state) {
            case 'INACTIVE': return 'Bài 3 · Dừng và khởi hành ngang dốc';
            case 'APPROACHING_STOP_LINE': return 'Bài 3 · Lên dốc, chuẩn bị dừng';
            case 'STOP_EVALUATION': return 'Bài 3 · Đánh giá vị trí dừng';
            case 'WAITING_TO_START': return 'Bài 3 · Chuẩn bị khởi hành';
            case 'HILL_STARTING': return 'Bài 3 · Khởi hành lên dốc';
            case 'START_COMPLETED': return 'Bài 3 · Qua đỉnh dốc';
            case 'LEAVE_HILL': return 'Bài 3 · Rời khỏi dốc';
            case 'COMPLETED': return 'Bài 3';
            case 'DISQUALIFIED': return 'Bài 3 · Đình chỉ';
        }
    }

    /** Rollback hiện tại (m) — công khai để HUD có thể đọc. */
    get rollbackM(): number {
        return this._rollbackM;
    }

    /** Trạng thái đánh giá dừng. */
    get stopClassification(): Exam03Result['stopClassification'] | undefined {
        return this._stopClassification;
    }

    reset(): void {
        this.readyChime.stop();
        this.state = 'INACTIVE';
        this.stoppedSince = 0;
        this.activatedAt = 0;
        this.stopEvaluated = false;
        this.vehicleStopped = false;
        this.crossedStopLineAfterRestart = false;
        this.rpmViolationLatched = false;
        this.speedingSec = 0;
        this.arrivalOvertimeSec = 0;
        this.engineWasRunning = false;
        this.stallLatched = false;
        this.stallEventCount = 0;
        this.stoppedPosition = null;
        this._rollbackM = 0;
        this.timeRemainingSec = undefined;
        this._stopClassification = undefined;
        this._disqualifyReason = '';
        this.readyBeepFired = false;
        this.waitingToastFired = false;
        this.startDeadlineAt = 0;
    }

    activate(): void {
        this.state = 'APPROACHING_STOP_LINE';
        this.activatedAt = performance.now();
    }

    /**
     * Khoảng cách A (spec §5.3): hiệu số từ thanh cản trước đến vạch dừng.
     * Xe di chuyển theo +X, vạch dừng tại stopLineX.
     *   A > 0  = thanh cản còn ở phía trước vạch (chưa đến)
     *   A = 0  = thanh cản trùng vạch
     *   A < 0  = thanh cản đã vượt qua vạch
     */
    signedDistanceToStopLine(frontPosition: THREE.Vector3): number {
        return this.stopLineX - frontPosition.x;
    }

    /** Kiểm tra xe đã vượt qua vạch dừng chưa. */
    hasCrossedStopLine(frontPosition: THREE.Vector3): boolean {
        return frontPosition.x >= this.stopLineX; // Vạch dừng quy định (spec §5.3, §14)
    }

    /** Kiểm tra bánh xe sau đã vượt qua vạch vàng chưa. */
    hasCrossedYellowLine(rearWheelX: number): boolean {
        return rearWheelX >= this.yellowLineX;
    }

    /** Kiểm tra xe đã qua exit sensor chưa. */
    hasPassedExit(position: THREE.Vector3): boolean {
        return position.x >= this.exitX;
    }

    /** Tính rollback (m) từ vị trí dừng ban đầu. */
    calculateRollback(currentPosition: THREE.Vector3): number {
        if (!this.stoppedPosition) return 0;
        const displacement = currentPosition.clone().sub(this.stoppedPosition);
        // Rollback là chuyển động ngược hướng lên dốc (âm dot product)
        const forwardDelta = displacement.dot(this.hillForwardAxis);
        return Math.max(0, -forwardDelta);
    }

    update(input: Exam03Input): Exam03Result {
        if (this.state === 'INACTIVE' || this.state === 'COMPLETED' || this.state === 'DISQUALIFIED') {
            return {
                penalties: [],
                completed: this.state === 'COMPLETED',
                disqualified: this.state === 'DISQUALIFIED',
            };
        }

        const penalties: PenaltyEvent[] = [];
        const now = performance.now();
        const add = (points: number, reason: string) => {
            penalties.push({ at: now, points, reason });
        };

        const frontX = input.frontPosition.x;
        const stopped = Math.abs(input.speedKmh) < this.stopSpeedKmh;

        // === DQ: Gây tai nạn (E03-06) ===
        // Tai nạn được xử lý bởi game engine, exercise chỉ nhận flag riêng nếu cần.

        // === E03-10: Thời gian đến bài vượt quá (allowedTimeSec = null = REQUIRED_INPUT) ===
        if (this.state === 'APPROACHING_STOP_LINE' || this.state === 'STOP_EVALUATION') {
            this.arrivalOvertimeSec += input.dt;
        }

        // === APPROACHING_STOP_LINE state ===
        if (this.state === 'APPROACHING_STOP_LINE') {
            // Observe until the exit: a stop beyond the line is STOP_OVER_LINE;
            // reaching the exit without a recorded stop is NO_REQUIRED_STOP.
            if (this.hasPassedExit(input.position) && !this.stopEvaluated) {
                this.stopEvaluated = true;
                this._stopClassification = 'NO_REQUIRED_STOP';
                this.state = 'DISQUALIFIED';
                this._disqualifyReason = 'Không dừng xe ở vạch dừng quy định';
                return {
                    penalties,
                    completed: false,
                    disqualified: true,
                    stopClassification: this._stopClassification,
                    disqualifyReason: this._disqualifyReason,
                };
            }

            // Trigger: xe đã dừng trên dốc (đủ lâu)
            // Note: crossedYellow (rearWheelX >= yellowLineX) không còn là gate vì spec
            // chỉ yêu cầu front bumper cách stop line <= 0.5m. Nếu bánh sau chưa qua
            // vàng mà xe dừng → STOP_TOO_EARLY sẽ được phạt trong evaluateStop(A).
            if (stopped) {
                const A = this.signedDistanceToStopLine(input.frontPosition);
                if (this.stoppedSince === 0) this.stoppedSince = now;
                const dwell = (now - this.stoppedSince) / 1000;
                if (dwell >= this.minStopDwellSec && !this.stopEvaluated) {
                    this.stopEvaluated = true;
                    this.vehicleStopped = true;
                    this.evaluateStop(A, add);
                    if (this._stopClassification === 'STOP_OVER_LINE') {
                    this.state = 'DISQUALIFIED';
                    this._disqualifyReason = 'Dừng xe quá vạch dừng quy định';
                    return {
                        penalties,
                        completed: false,
                        disqualified: true,
                        stopClassification: this._stopClassification,
                        disqualifyReason: this._disqualifyReason,
                    };
                    }
                    // VALID_STOP hoặc STOP_TOO_EARLY → chờ 2s rồi phát beep
                    this.state = 'STOP_EVALUATION';
                    // Lưu vị trí dừng để tính rollback
                    this.stoppedPosition = input.position.clone();
                    return {
                        toast: this._stopClassification === 'VALID_STOP'
                            ? 'Dừng đúng vị trí'
                            : 'Dừng chưa đến vạch (-5 điểm)',
                        penalties,
                        completed: false,
                        disqualified: false,
                        stopClassification: this._stopClassification,
                    };
                }
            } else {
                this.stoppedSince = 0;
            }

            return { penalties, completed: false, disqualified: false };
        }

        // === STOP_EVALUATION state ===
        if (this.state === 'STOP_EVALUATION') {
            // Chuyển sang trạng thái chờ 2 giây trước khi phát tín hiệu
            this.state = 'WAITING_TO_START';
            return {
                toast: this._stopClassification === 'VALID_STOP'
                    ? 'Dừng đúng vị trí'
                    : 'Dừng chưa đến vạch (-5 điểm)',
                penalties,
                completed: false,
                disqualified: false,
                stopClassification: this._stopClassification,
                stopDistanceA: this._stopClassification === 'VALID_STOP' ? 0 : undefined,
            };
        }

        // === WAITING_TO_START state ===
        if (this.state === 'WAITING_TO_START') {
            const elapsedSec = (now - this.stoppedSince) / 1000;
            // #region agent log — H1 fix verify
            fetch('http://127.0.0.1:7243/ingest/41ea114a-de22-43e0-a2f5-b772e9ee7100',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a36477'},body:JSON.stringify({sessionId:'a36477',location:'Exam03Hill.ts:410',message:'WAITING_TO_START frame',data:{elapsedSec,waitingToastFired:this.waitingToastFired,readyBeepFired:this.readyBeepFired},runId:'dbg-waitingToast',hypothesisId:'H1fix',timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            // Sau 2 giây → phát chuông và bắt đầu timer 30s
            if (elapsedSec >= READY_WAIT_SEC && !this.readyBeepFired) {
                this.readyBeepFired = true;
                this.startDeadlineAt = now;
                this.state = 'HILL_STARTING';
                return {
                    toast: 'Khởi hành lên dốc — 30 giây',
                    penalties,
                    completed: false,
                    disqualified: false,
                    stopClassification: this._stopClassification,
                    timeRemainingSec: this.maxStartTimeSec,
                    readyBeep: true,
                };
            }

            // Chỉ trả toast lần đầu vào WAITING_TO_START
            if (!this.waitingToastFired) {
                this.waitingToastFired = true;
                return {
                    toast: 'Giữ chân phanh, chuẩn bị khởi hành',
                    penalties,
                    completed: false,
                    disqualified: false,
                    stopClassification: this._stopClassification,
                };
            }
        }

        // === HILL_STARTING state ===
        if (this.state === 'HILL_STARTING') {
            // Tính rollback
            this._rollbackM = this.calculateRollback(input.position);

            // E03-05: Rollback > 0.5m → DQ
            if (this._rollbackM > this.maxRollbackM) {
                this.state = 'DISQUALIFIED';
                this._disqualifyReason = `Tụt dốc quá ${this.maxRollbackM * 1000} mm`;
                this.timeRemainingSec = undefined;
                return {
                    penalties,
                    completed: false,
                    disqualified: true,
                    rollbackM: this._rollbackM,
                    disqualifyReason: this._disqualifyReason,
                };
            }

            // Kiểm tra timer 30s (tính từ lúc phát beep, không phải lúc dừng)
            const elapsedSec = (now - this.startDeadlineAt) / 1000;
            this.timeRemainingSec = Math.max(0, this.maxStartTimeSec - elapsedSec);

            // Xe đã vượt qua vạch dừng sau khi khởi hành
            if (!this.crossedStopLineAfterRestart && this.hasCrossedStopLine(input.frontPosition) && !stopped) {
                this.crossedStopLineAfterRestart = true;
                this.state = 'START_COMPLETED';
                return {
                    toast: 'Qua vị trí dừng thành công',
                    penalties,
                    completed: false,
                    disqualified: false,
                    rollbackM: this._rollbackM,
                    timeRemainingSec: this.timeRemainingSec,
                };
            }

            // E03-04: Quá 30 giây → DQ
            if (elapsedSec > this.maxStartTimeSec) {
                this.state = 'DISQUALIFIED';
                this._disqualifyReason = 'Quá 30 giây từ khi dừng mà chưa khởi hành qua vạch';
                this.timeRemainingSec = 0;
                return {
                    penalties,
                    completed: false,
                    disqualified: true,
                    rollbackM: this._rollbackM,
                    timeRemainingSec: 0,
                    disqualifyReason: this._disqualifyReason,
                };
            }

            return {
                penalties,
                completed: false,
                disqualified: false,
                rollbackM: this._rollbackM,
                timeRemainingSec: this.timeRemainingSec,
            };
        }

        // === START_COMPLETED state ===
        if (this.state === 'START_COMPLETED') {
            this._rollbackM = this.calculateRollback(input.position);
            const elapsedSec = (now - this.stoppedSince) / 1000;
            this.timeRemainingSec = Math.max(0, this.maxStartTimeSec - elapsedSec);

            // Tiếp tục kiểm tra rollback (phòng trường hợp xe tụt sau khi qua vạch)
            if (this._rollbackM > this.maxRollbackM) {
                this.state = 'DISQUALIFIED';
                this._disqualifyReason = `Tụt dốc quá ${this.maxRollbackM * 1000} mm`;
                this.timeRemainingSec = undefined;
                return {
                    penalties,
                    completed: false,
                    disqualified: true,
                    rollbackM: this._rollbackM,
                    disqualifyReason: this._disqualifyReason,
                };
            }

            // Chờ exit sensor để kết thúc bài
            if (this.hasPassedExit(input.position)) {
                this.state = 'COMPLETED';
                this.timeRemainingSec = undefined;
                return {
                    toast: 'Hoàn thành bài 3 — Dừng và khởi hành ngang dốc',
                    penalties,
                    completed: true,
                    disqualified: false,
                    rollbackM: this._rollbackM,
                };
            }

            this.state = 'LEAVE_HILL';
            return {
                penalties,
                completed: false,
                disqualified: false,
                rollbackM: this._rollbackM,
                timeRemainingSec: this.timeRemainingSec,
            };
        }

        // === LEAVE_HILL state ===
        if (this.state === 'LEAVE_HILL') {
            this._rollbackM = this.calculateRollback(input.position);
            const elapsedSec = (now - this.stoppedSince) / 1000;
            this.timeRemainingSec = Math.max(0, this.maxStartTimeSec - elapsedSec);

            if (this.hasPassedExit(input.position)) {
                this.state = 'COMPLETED';
                this.timeRemainingSec = undefined;
                return {
                    toast: 'Hoàn thành bài 3 — Dừng và khởi hành ngang dốc',
                    penalties,
                    completed: true,
                    disqualified: false,
                    rollbackM: this._rollbackM,
                };
            }

            return {
                penalties,
                completed: false,
                disqualified: false,
                rollbackM: this._rollbackM,
                timeRemainingSec: this.timeRemainingSec,
            };
        }

        return { penalties, completed: false, disqualified: false };
    }

    /** Đánh giá vị trí dừng theo spec §7. */
    private evaluateStop(
        A: number,
        add: (points: number, reason: string) => void
    ): void {
        if (A < 0) {
            this._stopClassification = 'STOP_OVER_LINE';
            // STOP_OVER_LINE là DQ, không trừ điểm
        } else if (A > this.maxDistanceBeforeLineM) {
            this._stopClassification = 'STOP_TOO_EARLY';
            add(this.stopTooEarlyPenalty, 'Dừng xe chưa đến vạch dừng quy định');
        } else {
            this._stopClassification = 'VALID_STOP';
        }
    }

    /** Phát bản ghi chuông báo hiệu sẵn sàng khởi hành. */
    playReadyBeep(): void {
        this.readyChime.play();
    }
}
