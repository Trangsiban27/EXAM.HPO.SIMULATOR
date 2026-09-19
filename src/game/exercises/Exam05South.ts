import * as THREE from 'three';
import type { PenaltyEvent } from '../types';
import { TrafficLight } from '../TrafficLight';
import {
    EXAM_VEHICLE_CLASS,
    resolveExam05Rules,
} from '../exam/examRules';

/**
 * Bài sát hạch số 5 — Qua ngã tư có tín hiệu điều khiển giao thông
 * (EXAM_05_SIGNALIZED_INTERSECTION), áp dụng cho trafficLight South.
 *
 * Spec nguồn: spec/exam/exam_05_signalized_intersection.md
 *
 * Reuses the existing SOUTH traffic light (built in buildExamGround.ts).
 * No new ZONE_05_SOUTH or duplicate geometry is created. Sensors Box3
 * (stopLine / overLine / approachZone) được suy ra từ world transform của
 * `light.root.matrixWorld` + các field public readonly của TrafficLight
 * (`stopLineX`, `stopLineZ`, ...). Nếu sau này ai đó dịch chuyển South light
 * trong buildExamGround, sensors tự bám theo.
 *
 * Scope lần này (đã chốt với user):
 *   E05-01 Đèn đỏ -10
 *   E05-02 Dừng quá vạch -5
 *   E05-03 Dừng chưa đến vạch -5
 *   E05-10 Chết máy -5 mỗi lần
 *
 * RULE_EX05_20: chỉ chấm E05-01/02/03/10 cho trafficLight South.
 * Các lỗi khác (E05-04 xi nhan, E05-05/06 timer 20/30s, E05-07 lane marking,
 * E05-08 curb, E05-09 accident) chưa wire trong lần này.
 *
 * TODO: TrafficLight hiện không có phase 'yellow' (chỉ red/green). Khi có,
 * cập nhật logic E05-01 để phân biệt red vs yellow semantics theo spec §2.1.
 */

export type Exam05State =
    | 'INACTIVE'        // chưa trigger SOUTH
    | 'APPROACHING'     // xe vừa chạm trigger → chờ đánh giá dừng
    | 'STOP_EVALUATION' // đã dừng tại vạch → chấm điểm
    | 'COMPLETED'       // hoàn thành (chưa wire trong lần này)
    | 'DISQUALIFIED';

export interface Exam05Input {
    /** Tâm xe (root). */
    position: THREE.Vector3;
    /** Hình chiếu thanh cản phía trước — dùng cho vị trí dừng & quá vạch. */
    frontPosition: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    clutch: number;
    dt: number;
}

export interface Exam05Result {
    toast?: string;
    penalties: PenaltyEvent[];
    completed: boolean;
    disqualified: boolean;
    stopClassification?: 'VALID_STOP' | 'STOP_OVER_LINE' | 'STOP_TOO_EARLY' | 'NO_REQUIRED_STOP';
    /** Lý do bị đình chỉ (chỉ có khi disqualified = true). */
    disqualifyReason?: string;
}

export interface Exam05SouthOptions {
    /** TrafficLight South — lấy từ Track.getTrafficLight('SOUTH'). */
    light: TrafficLight;
    /** Chiều rộng làn đường (m). Mặc định 8. */
    roadWidth?: number;
    /** Tâm lane theo trục X (world). Lane dọc (NS) ở world X = 21 theo buildExamGround. */
    roadZ?: number;
    /** Ngưỡng tốc độ coi như đã dừng (km/h). */
    stopSpeedKmh?: number;
    /** Thời gian dừng tối thiểu để được tính là dừng (s). */
    minStopDwellSec?: number;
}

/** Subset của Exam05SouthOptions cần thiết cho attach() — cho phép attach lại sau khi wire. */
export interface Exam05SouthAttachOptions {
    light: TrafficLight;
    roadWidth?: number;
    roadZ?: number;
}

const DEFAULTS = {
    roadWidth: 8,
    stopSpeedKmh: .6,
    minStopDwellSec: .3,
};

export class Exam05South {
    readonly id = 'EXAM_05_SIGNALIZED_INTERSECTION';
    state: Exam05State = 'INACTIVE';

    /** Box3 vạch dừng (dải mỏng quanh vạch vàng) — world space. */
    readonly stopLine: THREE.Box3;
    /** Box3 vùng "đã quá vạch" — phát hiện xe chạy đèn đỏ. */
    readonly overLine: THREE.Box3;
    /** Box3 vùng tiếp cận — 15 m trước vạch. */
    readonly approachZone: THREE.Box3;

    /** Tọa độ world Z tâm vạch dừng (đã suy ra từ light). */
    readonly stopLineWorldZ: number;

    private light?: TrafficLight;
    private readonly roadWidth: number;
    private readonly stopSpeedKmh: number;
    private readonly minStopDwellSec: number;

    private readonly rules = resolveExam05Rules(EXAM_VEHICLE_CLASS);
    /** Per-class stall penalty, pre-resolved để tránh index vào Record trong update(). */
    private readonly stallPenaltyPoints: number;

    private stoppedSince = 0;
    private stopEvaluated = false;
    private redLightPenaltyApplied = false;
    private stallLatched = false;
    private engineWasRunning = false;
    private _stopClassification: Exam05Result['stopClassification'];
    /** Đánh dấu đã qua exitLine (chưa wire exit sensor trong lần này). */
    private completed = false;

    constructor(options?: Exam05SouthOptions) {
        this.roadWidth = options?.roadWidth ?? DEFAULTS.roadWidth;
        this.stopSpeedKmh = options?.stopSpeedKmh ?? DEFAULTS.stopSpeedKmh;
        this.minStopDwellSec = options?.minStopDwellSec ?? DEFAULTS.minStopDwellSec;
        this.stopLineWorldZ = 0;
        const initialRules = resolveExam05Rules(EXAM_VEHICLE_CLASS);
        this.stallPenaltyPoints = initialRules.engine.stallPenalty;
        // Khởi tạo Box3 rỗng; attach() sẽ tính lại khi có light.
        this.stopLine = new THREE.Box3();
        this.overLine = new THREE.Box3();
        this.approachZone = new THREE.Box3();
        if (options?.light && options?.roadZ !== undefined) {
            this.attach(options);
        }
    }

    /**
     * Gắn trafficLight South và tính sensors từ world transform của light.
     * Nếu light bị thay đổi (reset/swap), gọi lại attach().
     */
    attach(options: Exam05SouthAttachOptions): void {
        if (options.roadZ === undefined) {
            // Không đủ thông tin để dựng sensors — giữ nguyên giá trị hiện tại.
            this.light = options.light;
            return;
        }
        this.light = options.light;
        const roadZ = options.roadZ;
        const halfWidth = (options.roadWidth ?? DEFAULTS.roadWidth) / 2;
        const built = Exam05South.buildSensorsFromLight(
            options.light,
            options.roadWidth ?? DEFAULTS.roadWidth,
            roadZ,
        );
        (this as { stopLine: THREE.Box3 }).stopLine = built.stopLine;
        (this as { overLine: THREE.Box3 }).overLine = built.overLine;
        (this as { approachZone: THREE.Box3 }).approachZone = built.approachZone;
        (this as { stopLineWorldZ: number }).stopLineWorldZ = built.stopLineWorldZ;
    }

    /**
     * Helper tĩnh: biến đổi vạch dừng light-local → world rồi dựng 3 Box3
     * (stopLine / overLine / approachZone). Public để có thể test độc lập.
     *
     * Lưu ý: South light có `rotation = 0` nên local Z → world Z; local X → world X.
     * Xe từ South đi theo -Z (world Z giảm dần về phía giao lộ), nên:
     *   - Vạch vàng ở world Z = `zCenter` (≈ -30)
     *   - Vùng "tiếp cận" (approachZone) ở phía +Z so với vạch (xe chưa tới)
     *   - Vùng "đã qua vạch" (overLine) ở phía -Z so với vạch (xe đã đi qua)
     * Nếu sau này tái sử dụng cho light xoay (NORTH/WEST/EAST), cần xét lại
     * hướng dựa trên `light.root.matrixWorld` thay vì giả định -Z.
     */
    static buildSensorsFromLight(light: TrafficLight, roadWidth: number, roadZ: number): {
        stopLine: THREE.Box3;
        overLine: THREE.Box3;
        approachZone: THREE.Box3;
        stopLineWorldZ: number;
    } {
        light.root.updateWorldMatrix(true, false);
        // Vạch vàng ở light-local (stopLineX, stopLineZ) → world (X, Z).
        const localCenter = new THREE.Vector3(light.stopLineX, .1, light.stopLineZ);
        const worldCenter = localCenter.clone().applyMatrix4(light.root.matrixWorld);
        const zCenter = worldCenter.z;
        const halfWidth = roadWidth / 2;
        // Lane dọc (NS): xe chạy theo Z, vạch nằm ngang theo X.
        // Box3 theo world X (Box3.x = lane center) × world Z (Box3.z = vị trí dọc lane).
        const stopLine = new THREE.Box3(
            new THREE.Vector3(roadZ - halfWidth, -1, zCenter - .15),
            new THREE.Vector3(roadZ + halfWidth, 3, zCenter + .15),
        );
        // Over-line sensor: 1m phía -Z so với vạch (xe đã qua, đang trong ngã tư).
        const overLine = new THREE.Box3(
            new THREE.Vector3(roadZ - halfWidth, -1, zCenter - 1),
            new THREE.Vector3(roadZ + halfWidth, 3, zCenter - .15),
        );
        // Approach zone: 15m phía +Z so với vạch (xe đang tiếp cận từ phía nam).
        const approachZone = new THREE.Box3(
            new THREE.Vector3(roadZ - halfWidth, -1, zCenter + .15),
            new THREE.Vector3(roadZ + halfWidth, 3, zCenter + 15),
        );
        return { stopLine, overLine, approachZone, stopLineWorldZ: zCenter };
    }

    get title(): string {
        switch (this.state) {
            case 'INACTIVE': return 'Bài 5 · Ngã tư có tín hiệu';
            case 'APPROACHING': return 'Bài 5 · Chờ đèn xanh';
            case 'STOP_EVALUATION': return 'Bài 5 · Đánh giá vị trí dừng';
            case 'COMPLETED': return 'Bài 5';
            case 'DISQUALIFIED': return 'Bài 5 · Đình chỉ';
        }
    }

    /** Public: ExamEngine/DrivingGame đọc để hiển thị HUD widget nếu cần. */
    get stopClassification(): Exam05Result['stopClassification'] | undefined {
        return this._stopClassification;
    }

    reset(): void {
        this.state = 'INACTIVE';
        this.stoppedSince = 0;
        this.stopEvaluated = false;
        this.redLightPenaltyApplied = false;
        this.stallLatched = false;
        this.engineWasRunning = false;
        this._stopClassification = undefined;
        this.completed = false;
    }

    /** Được gọi từ ExamEngine khi `light.onMarkerTriggered('SOUTH')` bắn lần đầu. */
    activate(): void {
        if (this.state === 'INACTIVE') {
            this.state = 'APPROACHING';
        }
    }

    /**
     * Khoảng cách A (spec §5.3): hiệu số từ vạch dừng đến hình chiếu thanh cản
     * phía trước. South light: xe đi theo -Z (từ nam lên bắc — world Z giảm dần),
     * vạch tại `stopLineWorldZ` (≈ -30).
     *   A > 0  = thanh cản còn ở phía trước vạch (chưa đến, frontZ > stopLine)
     *   A = 0  = thanh cản trùng vạch
     *   A < 0  = thanh cản đã vượt qua vạch (frontZ < stopLine, đã đi qua)
     */
    signedDistanceToStopLine(frontPosition: THREE.Vector3): number {
        return frontPosition.z - this.stopLineWorldZ;
    }

    update(input: Exam05Input): Exam05Result {
        if (this.state === 'INACTIVE' || this.state === 'COMPLETED' || this.state === 'DISQUALIFIED') {
            return {
                penalties: [],
                completed: this.state === 'COMPLETED',
                disqualified: this.state === 'DISQUALIFIED',
            };
        }
        if (this.completed) {
            return {
                penalties: [],
                completed: true,
                disqualified: false,
                stopClassification: this._stopClassification,
            };
        }

        const penalties: PenaltyEvent[] = [];
        const now = performance.now();
        const add = (points: number, reason: string) => {
            penalties.push({ at: now, points, reason });
        };

        const stopped = Math.abs(input.speedKmh) < this.stopSpeedKmh;
        const overTheLine = this.overLine.containsPoint(input.frontPosition);
        const onTheLine = this.stopLine.containsPoint(input.frontPosition);

        // === E05-10: Chết máy (rising-edge) ===
        // Engine vừa nổ lại → reset stall latch.
        if (input.engineRunning && !this.engineWasRunning) {
            this.stallLatched = false;
        }
        this.engineWasRunning = input.engineRunning;
        if (
            !input.engineRunning
            && !this.stallLatched
            && input.clutch < .5
            && (this.state === 'APPROACHING' || this.state === 'STOP_EVALUATION')
        ) {
            this.stallLatched = true;
            add(this.stallPenaltyPoints, 'Chết máy');
        }

        // === E05-01: Đèn đỏ — xe vượt qua stop line khi light.phase === 'red' ===
        if (
            !this.redLightPenaltyApplied
            && overTheLine
            && this.light?.phase === 'red'
        ) {
            this.redLightPenaltyApplied = true;
            add(this.rules.penalties.redLight, 'Đi qua ngã tư khi đèn đỏ');
        }

        // === APPROACHING state ===
        if (this.state === 'APPROACHING') {
            // Xe đã vượt vạch → buộc phải chấm NO_REQUIRED_STOP, chuyển state.
            if (overTheLine && !onTheLine) {
                if (!this.stopEvaluated) {
                    this.stopEvaluated = true;
                    this._stopClassification = 'NO_REQUIRED_STOP';
                    // Không trừ thêm điểm NO_REQUIRED_STOP ở lần này (chưa có rule);
                    // nếu xe vượt khi đỏ → đã bị E05-01 ở trên.
                }
                this.state = 'STOP_EVALUATION';
                return {
                    toast: 'Đã qua vạch dừng',
                    penalties,
                    completed: false,
                    disqualified: false,
                    stopClassification: this._stopClassification,
                };
            }

            // Xe dừng hẳn tại vạch → chấm vị trí dừng (E05-02 / E05-03).
            const A = this.signedDistanceToStopLine(input.frontPosition);
            const frontNearStopLine = A > -.15 && A < 2;
            if (frontNearStopLine && stopped) {
                if (this.stoppedSince === 0) this.stoppedSince = now;
                const dwell = (now - this.stoppedSince) / 1000;
                if (dwell >= this.minStopDwellSec && !this.stopEvaluated) {
                    this.stopEvaluated = true;
                    this.evaluateStop(A, add);
                    this.state = 'STOP_EVALUATION';
                    return {
                        toast: this._stopClassification === 'VALID_STOP'
                            ? 'Dừng đúng vị trí'
                            : 'Đánh giá vị trí dừng',
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
            // Xe dừng tại vạch nhưng chưa chấm được (chưa đủ dwell) → tiếp tục chờ.
            if (!this.stopEvaluated) {
                const A = this.signedDistanceToStopLine(input.frontPosition);
                const frontNearStopLine = A > -.15 && A < 2;
                if (frontNearStopLine && stopped) {
                    if (this.stoppedSince === 0) this.stoppedSince = now;
                    const dwell = (now - this.stoppedSince) / 1000;
                    if (dwell >= this.minStopDwellSec) {
                        this.stopEvaluated = true;
                        this.evaluateStop(A, add);
                        return {
                            toast: this._stopClassification === 'VALID_STOP'
                                ? 'Dừng đúng vị trí'
                                : 'Đánh giá vị trí dừng',
                            penalties,
                            completed: false,
                            disqualified: false,
                            stopClassification: this._stopClassification,
                        };
                    }
                } else {
                    this.stoppedSince = 0;
                }
            }

            // Đã chấm xong vị trí. Hiện tại chưa wire endLine sensor nên
            // exercise giữ ở STOP_EVALUATION cho đến khi wire COMPLETED.
            return {
                penalties,
                completed: false,
                disqualified: false,
                stopClassification: this._stopClassification,
            };
        }

        return { penalties, completed: false, disqualified: false };
    }

    /**
     * Đánh giá vị trí dừng theo spec §5.3 + §11.
     * RULE_EX05_18/19: dùng effectiveMaxM (= procedureMaxM 0.5m) cho
     * STOP_TOO_EARLY. Khi verifiedMaxM được set, tự động override.
     */
    private evaluateStop(A: number, add: (points: number, reason: string) => void): void {
        const threshold = this.rules.stopPosition.effectiveMaxM;
        if (A < 0) {
            this._stopClassification = 'STOP_OVER_LINE';
            add(this.rules.penalties.stopOverLine, 'Dừng xe quá vạch dừng quy định');
        } else if (A > threshold) {
            this._stopClassification = 'STOP_TOO_EARLY';
            add(this.rules.penalties.stopTooEarly, 'Dừng xe chưa đến vạch dừng quy định');
        } else {
            this._stopClassification = 'VALID_STOP';
        }
    }
}
