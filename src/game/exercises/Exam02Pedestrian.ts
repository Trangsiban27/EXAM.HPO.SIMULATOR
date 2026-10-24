import * as THREE from 'three';
import type { PenaltyEvent } from '../types';
import { EXAM_02_PEDESTRIAN_RULES_V2, EXAM_VEHICLE_CLASS } from '../exam/examRules';

/**
 * Bài sát hạch số 2 — Dừng xe nhường đường cho người đi bộ (EXAM_02_PEDESTRIAN).
 *
 * Spec nguồn: spec/exam/exam_02_pedestrian_stop.md
 *
 * Hệ tọa độ: xe di chuyển dọc theo trục X (heading -PI/2 = hướng +X).
 * Vạch dừng nằm tại stopLineX, xe tiến về phía +X.
 *
 * State machine (spec §10):
 *   INACTIVE
 *     ↓ activate()
 *   APPROACHING
 *     ↓ xe dừng tại vạch
 *   STOP_EVALUATION  → VALID_STOP / STOP_TOO_EARLY / STOP_OVER_LINE
 *     ↓ xe qua exit sensor
 *   COMPLETED
 *
 * Đình chỉ (DISQUALIFIED) khi: lên vỉa hè, gây tai nạn.
 */

export type Exam02State =
    | 'INACTIVE'
    | 'APPROACHING'
    | 'STOP_EVALUATION'
    | 'COMPLETED'
    | 'DISQUALIFIED';

export interface Exam02Input {
    /** Tâm xe (root) — dùng .x cho khoảng cách dừng. */
    position: THREE.Vector3;
    /** Hình chiếu thanh cản phía trước — dùng .x cho logic. */
    frontPosition: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    seatBeltFastened?: boolean;
    leftSignal?: boolean;
    clutch: number;
    dt: number;
}

export interface Exam02Result {
    toast?: string;
    penalties: PenaltyEvent[];
    completed: boolean;
    disqualified: boolean;
    stopClassification?: 'VALID_STOP' | 'STOP_TOO_EARLY' | 'STOP_OVER_LINE' | 'NO_REQUIRED_STOP';
    /** Lý do bị đình chỉ (chỉ có khi disqualified = true). */
    disqualifyReason?: string;
}

export interface Exam02PedestrianOptions {
    /** Tọa độ X của vạch dừng (mặt phẳng vuông góc trục X). */
    stopLineX: number;
    /** Tọa độ Z tâm đường (dùng cho geometry visual). */
    roadZ: number;
    /** Chiều rộng làn đường. */
    roadWidth: number;
    /** Bán kính vùng tiếp cận (m) — tính từ vạch dừng về phía xe đến. */
    approachZoneM?: number;
    /** Khoảng cách sau vạch dừng để kích hoạt exit sensor (m). */
    exitDistanceM?: number;
    /** Ngưỡng tốc độ coi như đã dừng (km/h). */
    stopSpeedKmh?: number;
    /** Thời gian dừng tối thiểu để được tính là dừng (s). */
    minStopDwellSec?: number;
}

const DEFAULTS = {
    approachZoneM: 15,
    exitDistanceM: 3,
    stopSpeedKmh: .6,
    minStopDwellSec: .3,
};

export class Exam02Pedestrian {
    readonly id = 'EXAM_02_PEDESTRIAN';
    state: Exam02State = 'INACTIVE';
    startLampOn = false;

    /** Tọa độ X của vạch dừng (trục di chuyển của xe). */
    readonly stopLineX: number;
    /** Tọa độ X tại đó exit sensor kích hoạt. */
    readonly exitX: number;
    /** Tọa độ X bắt đầu vùng tiếp cận (xe tiến về phía +X). */
    readonly approachEntryX: number;

    /** Visual geometry: Box3 theo trục X (dùng Z-coordinate của Box3 cho X-axis).
     *  Với rotation.y = -PI/2, Box3.min.z = world X min, Box3.max.z = world X max. */
    readonly stopLine: THREE.Box3;
    readonly approachZone: THREE.Box3;

    private readonly maxDistanceBeforeLineM: number;
    private readonly maxSpeedKmh: number;
    private readonly maxRPM: number;
    private readonly stallPenalty: number;
    private readonly rpmExceededPenalty: number;
    private readonly noRequiredStopPenalty: number;
    private readonly stopTooEarlyPenalty: number;
    private readonly stopOverLinePenalty: number;
    private readonly speedingIntervalSec: number;
    private readonly speedingPenaltyPerInterval: number;
    private readonly stopSpeedKmh: number;
    private readonly minStopDwellSec: number;

    private stoppedSince = 0;
    private activatedAt = 0;
    private stopEvaluated = false;
    private rpmViolationLatched = false;
    private speedingSec = 0;
    private arrivalOvertimeSec = 0;
    private engineWasRunning = false;
    private stallLatched = false;
    private stallEventCount = 0;
    private _stopClassification: Exam02Result['stopClassification'];

    constructor(options: Exam02PedestrianOptions) {
        const opts = { ...DEFAULTS, ...options };
        this.stopLineX = opts.stopLineX;
        this.stopSpeedKmh = opts.stopSpeedKmh;
        this.minStopDwellSec = opts.minStopDwellSec;
        this.exitX = opts.stopLineX + opts.exitDistanceM;
        this.approachEntryX = opts.stopLineX - opts.approachZoneM;

        const rules = EXAM_02_PEDESTRIAN_RULES_V2;
        this.maxDistanceBeforeLineM = rules.stopPosition.maxDistanceBeforeLineM;
        this.maxRPM = rules.engine.maxRPM;
        this.stallPenalty = rules.engine.stallPenalty[EXAM_VEHICLE_CLASS];
        this.rpmExceededPenalty = rules.engine.rpmExceededPenalty[EXAM_VEHICLE_CLASS];
        this.noRequiredStopPenalty = rules.penalties.noRequiredStop;
        this.stopTooEarlyPenalty = rules.penalties.stopTooEarly;
        this.stopOverLinePenalty = rules.penalties.stopOverLine;
        this.speedingIntervalSec = rules.speeding.intervalSec;
        this.speedingPenaltyPerInterval = rules.speeding.penaltyPerInterval;
        this.maxSpeedKmh = rules.maxSpeedKmh[EXAM_VEHICLE_CLASS];

        // Visual geometry: Box3 với rotation.y = -PI/2 trong scene.
        // Với rotation này, Box3.min.z = world X min, Box3.max.z = world X max.
        const halfWidth = opts.roadWidth / 2;
        const z = opts.roadZ;
        const lineMinX = opts.stopLineX - .15;
        const lineMaxX = opts.stopLineX + .15;
        this.stopLine = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, lineMinX),
            new THREE.Vector3(z + halfWidth, 3, lineMaxX)
        );
        const entryMinX = opts.stopLineX - opts.approachZoneM;
        this.approachZone = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, entryMinX),
            new THREE.Vector3(z + halfWidth, 3, lineMaxX)
        );
    }

    get title(): string {
        switch (this.state) {
            case 'INACTIVE': return 'Bài 2 · Nhường đường người đi bộ';
            case 'APPROACHING': return 'Bài 2 · Giảm tốc trước vạch';
            case 'STOP_EVALUATION': return 'Bài 2 · Dừng chờ';
            case 'COMPLETED': return 'Bài 2';
            case 'DISQUALIFIED': return 'Bài 2 · Đình chỉ';
        }
    }

    /**
     * Kết quả đánh giá vị trí dừng (nếu đã có). Công khai để HUD widget có thể
     * đọc mà không cần phải nhảy vào package-private state.
     * - VALID_STOP:  0 ≤ A ≤ 0.5 m
     * - STOP_TOO_EARLY: A > 0.5 m
     * - STOP_OVER_LINE: A < 0
     * - NO_REQUIRED_STOP: xe qua vạch mà không dừng
     */
    get stopClassification(): Exam02Result['stopClassification'] | undefined {
        return this._stopClassification;
    }

    reset(): void {
        this.state = 'INACTIVE';
        this.startLampOn = false;
        this.stoppedSince = 0;
        this.activatedAt = 0;
        this.stopEvaluated = false;
        this.rpmViolationLatched = false;
        this.speedingSec = 0;
        this.arrivalOvertimeSec = 0;
        this.engineWasRunning = false;
        this.stallLatched = false;
        this.stallEventCount = 0;
        this._stopClassification = undefined;
    }

    activate(): void {
        this.state = 'APPROACHING';
        this.startLampOn = false;
        this.activatedAt = performance.now();
    }

    /**
     * Khoảng cách A (spec §5.3): hiệu số từ vạch dừng đến hình chiếu thanh cản
     * phía trước. Xe di chuyển theo +X, vạch dừng tại stopLineX.
     *   A > 0  = thanh cản còn ở phía trước vạch (chưa đến)
     *   A = 0  = thanh cản trùng vạch
     *   A < 0  = thanh cản đã vượt qua vạch
     */
    signedDistanceToStopLine(frontPosition: THREE.Vector3): number {
        return this.stopLineX - frontPosition.x;
    }

    /** Kiểm tra xe có đang trong vùng tiếp cận hay không. */
    isInApproachZone(position: THREE.Vector3): boolean {
        const x = position.x;
        return x >= this.approachEntryX && x <= this.stopLineX;
    }

    /** Kiểm tra xe đã vượt qua vạch dừng chưa. */
    hasCrossedStopLine(frontPosition: THREE.Vector3): boolean {
        return frontPosition.x >= this.stopLineX;
    }

    /** Kiểm tra xe đã qua exit sensor chưa. */
    hasPassedExit(position: THREE.Vector3): boolean {
        return position.x >= this.exitX;
    }

    update(input: Exam02Input): Exam02Result {
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

        // === DQ: Lên vỉa hè (E02-04) ===
        if (input.position.y > 0.25) {
            this.state = 'DISQUALIFIED';
            this.startLampOn = false;
            return {
                toast: 'Đình chỉ sát hạch — Lái xe lên vỉa hè',
                penalties: [],
                completed: false,
                disqualified: true,
                disqualifyReason: 'Lái xe lên vỉa hè',
            };
        }

        // === E02-09: Thời gian đến bài vượt quá (allowedTimeSec = null = REQUIRED_INPUT) ===
        if (this.state === 'APPROACHING') {
            this.arrivalOvertimeSec += input.dt;
        }

        // === APPROACHING state ===
        if (this.state === 'APPROACHING') {
            if (this.hasPassedExit(input.position)) {
                // Wait until the exit to distinguish stopping over the line from not stopping.
                if (!this.stopEvaluated) {
                    this.stopEvaluated = true;
                    this._stopClassification = 'NO_REQUIRED_STOP';
                    add(this.noRequiredStopPenalty, 'Không dừng xe ở vạch dừng quy định');
                }
                this.state = 'COMPLETED';
                this.startLampOn = false;
                return {
                    toast: 'Hoàn thành bài 2 — không dừng xe',
                    penalties,
                    completed: true,
                    disqualified: false,
                    stopClassification: this.stopClassification,
                };
            }

            // Evaluate stops before or beyond the line, up to the exit sensor.
            const A = this.signedDistanceToStopLine(input.frontPosition);
            const frontNearStopLine = A < 2;
            if (frontNearStopLine && stopped) {
                if (this.stoppedSince === 0) this.stoppedSince = now;
                const dwell = (now - this.stoppedSince) / 1000;
                if (dwell >= this.minStopDwellSec && !this.stopEvaluated) {
                    this.stopEvaluated = true;
                    this.evaluateStop(A, add);
                    this.state = 'STOP_EVALUATION';
                    return {
                        toast: this.stopClassification === 'VALID_STOP'
                            ? 'Dừng đúng vị trí'
                            : 'Đánh giá vị trí dừng',
                        penalties,
                        completed: false,
                        disqualified: false,
                        stopClassification: this.stopClassification,
                    };
                }
            } else {
                this.stoppedSince = 0;
            }

            return { penalties, completed: false, disqualified: false };
        }

        // === STOP_EVALUATION state ===
        if (this.state === 'STOP_EVALUATION') {
            if (this.hasPassedExit(input.position)) {
                this.state = 'COMPLETED';
                this.startLampOn = false;
                return {
                    toast: this.stopClassification === 'VALID_STOP'
                        ? 'Hoàn thành bài 2 — dừng đúng vạch'
                        : 'Hoàn thành bài 2',
                    penalties,
                    completed: true,
                    disqualified: false,
                    stopClassification: this.stopClassification,
                };
            }
            // Xe bắt đầu nhích lại sau khi dừng → bật đèn start lamp.
            if (!stopped && input.engineRunning) {
                this.startLampOn = true;
            }
            return { penalties, completed: false, disqualified: false, stopClassification: this.stopClassification };
        }

        return { penalties, completed: false, disqualified: false };
    }

    /** Đánh giá vị trí dừng theo spec §5.3 + §6. */
    private evaluateStop(
        A: number,
        add: (points: number, reason: string) => void
    ): void {
        if (A < 0) {
            this._stopClassification = 'STOP_OVER_LINE';
            add(this.stopOverLinePenalty, 'Dừng xe quá vạch dừng quy định');
        } else if (A > this.maxDistanceBeforeLineM) {
            this._stopClassification = 'STOP_TOO_EARLY';
            add(this.stopTooEarlyPenalty, 'Dừng xe chưa đến vạch dừng quy định');
        } else {
            this._stopClassification = 'VALID_STOP';
        }
    }
}
