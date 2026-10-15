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
 * Scope chấm điểm hiện tại:
 *   E05-01 Qua stopbar trắng khi đèn đỏ -10
 *   E05-02 Dừng quá vạch -5
 *   E05-03 Dừng chưa đến vạch -5
 *   E05-05 Quá 20 giây từ đèn xanh đến vạch kết thúc -5
 *   E05-06 Quá 30 giây từ đèn xanh đến vạch kết thúc: đình chỉ
 *   E05-10 Chết máy -5 mỗi lần
 *
 * Các lỗi khác (xi nhan, vạch đường, vỉa hè, tai nạn) chưa wire.
 *
 * TODO: TrafficLight hiện không có phase 'yellow' (chỉ red/green). Khi có,
 * cập nhật logic E05-01 để phân biệt red vs yellow semantics theo spec §2.1.
 */

export type Exam05State =
    | 'INACTIVE'        // chưa trigger SOUTH
    | 'APPROACHING'     // xe vừa chạm trigger → chờ đánh giá dừng
    | 'STOP_EVALUATION' // đã dừng tại vạch → chấm điểm
    | 'COMPLETED'       // đã vượt vạch kết thúc ngã tư
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
    /** Mép stopbar trắng gần xe đi tới, lấy từ mesh 'exam-05-stop-bar'. */
    stopBar?: { minX: number; maxX: number; nearZ: number };
    /** Tâm vạch qua đường dùng làm vạch kết thúc ngã tư. */
    finishLine?: { x: number; z: number; widthM: number; depthM: number };
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
    /** Box3 vùng ngay sau vạch đèn vàng, giữ cho cảm biến vị trí dừng. */
    readonly overLine: THREE.Box3;
    /** Box3 vùng "đã quá vạch ≥ 1m" — phát hiện dừng sâu quá vạch (E05-02 STOP_OVER_LINE). */
    readonly overLineDeep: THREE.Box3;
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
    private stopBarCrossed = false;
    private stopBar?: Exam05SouthAttachOptions['stopBar'];
    private finishLineZ?: number;
    private greenStarted = false;
    private greenElapsedSec = 0;
    private green20PenaltyApplied = false;
    private stallLatched = false;
    private engineWasRunning = false;
    private _stopClassification: Exam05Result['stopClassification'];
    /** Đánh dấu đã qua vạch kết thúc. */
    private completed = false;
    /** Footprint của vạch qua đường dùng làm mốc kết thúc bài. */
    readonly completionZone: THREE.Box3 = new THREE.Box3();
    private hasCompletionZone = false;

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
        this.overLineDeep = new THREE.Box3();
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
        (this as { overLineDeep: THREE.Box3 }).overLineDeep = built.overLineDeep;
        (this as { approachZone: THREE.Box3 }).approachZone = built.approachZone;
        (this as { stopLineWorldZ: number }).stopLineWorldZ = built.stopLineWorldZ;
        this.stopBar = options.stopBar ?? {
            minX: built.stopLine.min.x,
            maxX: built.stopLine.max.x,
            nearZ: built.stopLine.max.z,
        };

        if (options.finishLine) {
            const { x, z, widthM, depthM } = options.finishLine;
            this.completionZone.setFromCenterAndSize(
                new THREE.Vector3(x, 0, z),
                new THREE.Vector3(widthM, 4, depthM),
            );
            this.finishLineZ = z;
            this.hasCompletionZone = true;
        } else {
            this.completionZone.makeEmpty();
            this.finishLineZ = undefined;
            this.hasCompletionZone = false;
        }
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
        overLineDeep: THREE.Box3;
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
        // Giữ dải ngay sau vạch đèn vàng để mô tả vị trí dừng. Lỗi vượt đèn đỏ
        // được chấm tại mesh stopbar trắng, không dùng dải này.
        const overLine = new THREE.Box3(
            new THREE.Vector3(roadZ - halfWidth, -1, zCenter - 1),
            new THREE.Vector3(roadZ + halfWidth, 3, zCenter - .15),
        );
        // STOP_OVER_LINE sensor: chỉ trigger "dừng quá vạch sâu ≥ 1m" khi front đã
        // cách vạch 1m+ về phía -Z. Box3 trải z ∈ [zCenter - 1.15, zCenter - 1] — đúng
        // vùng 0.15m ngay sau mốc 1m quá vạch (theo threshold dải đối xứng 1m yêu cầu
        // mới: A < -1 → STOP_OVER_LINE).
        const overLineDeep = new THREE.Box3(
            new THREE.Vector3(roadZ - halfWidth, -1, zCenter - 1.15),
            new THREE.Vector3(roadZ + halfWidth, 3, zCenter - 1),
        );
        // Approach zone: 15m phía +Z so với vạch (xe đang tiếp cận từ phía nam).
        const approachZone = new THREE.Box3(
            new THREE.Vector3(roadZ - halfWidth, -1, zCenter + .15),
            new THREE.Vector3(roadZ + halfWidth, 3, zCenter + 15),
        );
        return { stopLine, overLine, overLineDeep, approachZone, stopLineWorldZ: zCenter };
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
        this.stopBarCrossed = false;
        this.greenStarted = false;
        this.greenElapsedSec = 0;
        this.green20PenaltyApplied = false;
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

        // Chốt thời điểm đèn xanh đầu tiên; không đặt lại đồng hồ khi đèn lặp chu kỳ.
        const phase = this.light?.phase;
        if (!this.greenStarted && phase === 'green') {
            this.greenStarted = true;
        } else if (this.greenStarted) {
            this.greenElapsedSec += Math.max(0, input.dt);
        }

        // Đầu xe chạm mép stopbar trắng khi đèn đỏ: trừ một lần tại thời điểm vượt.
        const stopBar = this.stopBar;
        if (!this.stopBarCrossed && stopBar
            && input.frontPosition.x >= stopBar.minX
            && input.frontPosition.x <= stopBar.maxX
            && input.frontPosition.z <= stopBar.nearZ) {
            this.stopBarCrossed = true;
            if (phase === 'red') add(this.rules.penalties.redLight, 'Đi qua stopbar khi đèn đỏ');
        }

        if (this.greenStarted && !this.green20PenaltyApplied
            && this.greenElapsedSec > this.rules.timer.penaltyAtSec) {
            this.green20PenaltyApplied = true;
            add(this.rules.timer.penaltyPoints,
                'Quá 20 giây từ khi đèn xanh bật sáng chưa qua vạch kết thúc ngã tư');
        }
        if (this.greenStarted && this.greenElapsedSec > this.rules.timer.disqualifyAtSec) {
            const reason = 'Quá 30 giây từ khi đèn xanh bật sáng chưa qua vạch kết thúc ngã tư';
            this.state = 'DISQUALIFIED';
            return {
                toast: `Đình chỉ sát hạch — ${reason}`,
                penalties,
                completed: false,
                disqualified: true,
                disqualifyReason: reason,
                stopClassification: this._stopClassification,
            };
        }

        // Đầu xe đi qua tâm vạch qua đường tại Z=-51: kết thúc bài.
        if (this.hasCompletionZone && this.finishLineZ !== undefined
            && input.frontPosition.x >= this.completionZone.min.x
            && input.frontPosition.x <= this.completionZone.max.x
            && input.frontPosition.z <= this.finishLineZ) {
            this.completed = true;
            this.state = 'COMPLETED';
            return {
                toast: 'Hoàn thành bài 5',
                penalties,
                completed: true,
                disqualified: false,
                stopClassification: this._stopClassification,
            };
        }

        const stopped = Math.abs(input.speedKmh) < this.stopSpeedKmh;
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

        // === APPROACHING state ===
        if (this.state === 'APPROACHING') {
            // Xe đã vượt sâu ≥ 1m quá vạch → buộc phải chấm NO_REQUIRED_STOP, chuyển state.
            // Dùng overLineDeep (chỉ trigger khi front cách vạch ≥ 1m về phía -Z) thay vì
            // overLine (trigger ngay khi qua vạch, dành riêng cho E05-01 đèn đỏ).
            const overLineDeepHit = this.overLineDeep.containsPoint(input.frontPosition);
            if (overLineDeepHit && !onTheLine) {
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
            // Buffer 0.15m hai phía để chuyển state mượt khi xe dừng đúng rìa 1m.
            const frontNearStopLine = A > -1.15 && A < 1.15;
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
                // Buffer 0.15m hai phía để chuyển state mượt khi xe dừng đúng rìa 1m.
            const frontNearStopLine = A > -1.15 && A < 1.15;
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
     * Đánh giá vị trí dừng theo threshold cứng 1m (đối xứng 2 phía) — yêu cầu mới:
     *   A < -1 → STOP_OVER_LINE  (vượt sâu ≥ 1m)       → -5 điểm (E05-02)
     *   A > 1  → STOP_TOO_EARLY  (còn cách > 1m)       → -5 điểm (E05-03)
     *   -1 ≤ A ≤ 1 → VALID_STOP                         → 0 điểm
     * Lưu ý: không dùng `this.rules.stopPosition.effectiveMaxM` (động 0.5m/1.0m) — giữ
     * hard-code 1m cho khớp yêu cầu.
     */
    private evaluateStop(A: number, add: (points: number, reason: string) => void): void {
        if (A < -1) {
            this._stopClassification = 'STOP_OVER_LINE';
            add(this.rules.penalties.stopOverLine, 'Dừng xe quá vạch dừng quy định');
        } else if (A > 1) {
            this._stopClassification = 'STOP_TOO_EARLY';
            add(this.rules.penalties.stopTooEarly, 'Dừng xe chưa đến vạch dừng quy định');
        } else {
            this._stopClassification = 'VALID_STOP';
        }
    }
}
