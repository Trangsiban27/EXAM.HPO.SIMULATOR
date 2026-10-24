import * as THREE from 'three';
import type { PenaltyEvent } from '../types';
import { EXAM_04_RULES, EXAM_VEHICLE_CLASS, type ExamVehicleClass } from '../exam/examRules';

export const EXAM_04_WRONG_LAYOUT_REASON = 'đi không đúng hình của hạng xe';

/**
 * Bài sát hạch số 4 — Qua vệt bánh xe và đường vòng vuông góc
 * (EXAM_04_WHEEL_TRACK_AND_RIGHT_ANGLE).
 *
 * Spec nguồn: spec/exam/exam_04_wheel_track_and_right_angle_v2.md
 *
 * Hệ tọa độ: xe di chuyển theo world space tự do.
 * Course có thể nằm ở bất kỳ hướng nào; sensors được transform
 * sang world space trước khi truyền vào.
 *
 * State machine (spec §10):
 *   INACTIVE
 *     ↓ swapToCourse() (xe chạm startYellowSensor)
 *   WHEEL_TRACK_ACTIVE
 *     ├── theo dõi FR/RR qua vùng giữa hai vạch, đánh giá sau khi cả hai đi hết đoạn
 *     ├── cả FR và RR đều bỏ qua vùng vệt → DQ
 *     ├── boundary contact → -5/event + -5/5s sustained
 *     ├── stall / RPM / speed → shared checks in ExamEngine
 *     └── quá 120s → -5 (overtime)
 *         ↓
 *   RIGHT_ANGLE_ACTIVE   (wheel track done, đang làm đường vuông góc)
 *     ├── boundary contact / curb / accident → penalties / DQ
 *     └── qua endYellowSensor → COMPLETED
 *
 *   COMPLETED / DISQUALIFIED — exercise ends; ExamEngine resets it to INACTIVE
 *   so the player can try another course or move on.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type Exam04State =
    | 'INACTIVE'
    | 'WHEEL_TRACK_ACTIVE'
    | 'WHEEL_TRACK_COMPLETED'
    | 'RIGHT_ANGLE_ACTIVE'
    | 'COMPLETED'
    | 'DISQUALIFIED';

export interface Exam04Input {
    /** Chế độ chỉ báo lỗi: giữ bài 4 hoạt động sau lỗi đình chỉ. */
    continueAfterDisqualification?: boolean;
    /** Tâm xe (root). */
    position: THREE.Vector3;
    /** Hình chiếu thanh cản phía trước — dùng cho vị trí xe. */
    frontPosition: THREE.Vector3;
    /**
     * World-space position của 4 bánh xe. Lấy từ
     * Vehicle3.wheelAssy.getWheel(...).getWorldPosition(tmp).clone().
     */
    wheelPositions: { FL: THREE.Vector3; FR: THREE.Vector3; RL: THREE.Vector3; RR: THREE.Vector3 };
    /** Vector hướng tiến (đơn vị, world space). Default: (1, 0, 0). */
    forwardAxis?: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    clutch: number;
    dt: number;
    /** Phát hiện tai nạn (collision sensor) — E04-07. Optional. */
    accident?: boolean;
    /** Phát hiện đi sai hình hạng xe — E04-01. Optional. */
    wrongLayout?: boolean;
}

export interface Exam04Result {
    penalties: PenaltyEvent[];
    completed: boolean;
    disqualified: boolean;
    toast?: string;
    timeRemainingSec?: number;
    wheelTrackCompleted?: boolean;
    disqualifyReason?: string;
}

/** Một bộ sensor cho một course bài 04 (đã transform sang world space). */
export interface Exam04CourseSensors {
    vehicleClass: ExamVehicleClass;
    /** Index của course (0..3). */
    index: number;
    /** Sensor vạch vàng đầu bài (START_GATE). */
    startYellowSensor: THREE.Box3;
    /** Vạch đen bắt đầu đồng hồ 120 giây. */
    timerStartSensor: THREE.Box3;
    /** Sensor vạch vàng cuối bài (END_GATE). */
    endYellowSensor: THREE.Box3;
    /** Vùng wheel-track Box3 (world space). */
    wheelTrackZone: THREE.Box3;
    /** White paint contact zones expanded by tyre width. */
    wheelTrackBoundarySensors?: THREE.Box3[];
    /** Mảng boundary sensor Box3[] (world space). */
    boundarySensors: THREE.Box3[];
    /** Vị trí world-space của điểm entry course. */
    entryWorld: THREE.Vector3;
    /** World-space unit vector — hướng xe chạy khi ra khỏi exit leg.
     *  'vertical' courses → (0, 0, -1); 'horizontal' → (-1, 0, 0). */
    exitForwardAxis: THREE.Vector3;
    /** Ngưỡng Y trên vỉa hè (m). Default: 0.15. */
    curbTopY?: number;
}

// ─── Class ────────────────────────────────────────────────────────────────────

export class Exam04WheelTrack {
    readonly id = 'EXAM_04_WHEEL_TRACK_AND_RIGHT_ANGLE';
    state: Exam04State = 'INACTIVE';

    /** Bộ sensors của course đang active. Null khi chưa vào course nào. */
    private sensors: Exam04CourseSensors | null = null;

    // ── Resolved rules (loaded once in constructor) ──────────────────────────
    private readonly limitSec: number;
    private readonly overtimePenalty: number;
    private readonly boundaryContactPenalty: number;
    private readonly sustainedContactIntervalSec: number;
    private readonly sustainedContactPenalty: number;
    private readonly curbTopY: number;
    private readonly maxRPM: number;
    private readonly stallPenalty: number;
    private readonly rpmExceededPenalty: number;
    private readonly maxSpeedKmh: number;
    private readonly speedingIntervalSec: number;
    private readonly speedingPenalty: number;
    /** Phạt cho mỗi bánh (FR hoặc RR) còn lại chưa qua zone khi đã qualify. */
    private readonly wheelTrackMissingPenalty: number;
    /** E04-WT-Overlap: -5 khi bất kỳ bánh nào cán lên vệt bánh xe (latch đầu tiên). */
    private readonly wheelTrackOverlapPenalty: number;
    /** E04-WT-Overlap: cadence (giây) phạt sustained khi bánh còn cán lên vệt. */
    private readonly wheelTrackOverlapIntervalSec: number;
    /** E04-WT-Overlap: -5 mỗi interval nếu còn cán. */
    private readonly wheelTrackOverlapSustainedPenalty: number;

    // ── Runtime state ────────────────────────────────────────────────────────
    private startedAt: number | null = null;
    private previousFrontPosition: THREE.Vector3 | null = null;
    private wheelTrackCompleted = false;
    /** Bánh trước bên lái phụ (FR) đã vào wheelTrackZone chưa. */
    private frontPassengerPassed = false;
    private previousPassengerWheels: { FR: THREE.Vector3; RR: THREE.Vector3 } | null = null;
    /** Bánh sau bên lái phụ (RR) đã vào wheelTrackZone chưa. */
    private rearPassengerPassed = false;
    /** Both right wheels have cleared the track; result evaluated once per course. */
    private wheelTrackPenaltyLatched = false;
    /** E04-WT-Overlap: đang có ít nhất 1 bánh cán lên vệt (latch đầu tiên). */
    private wheelTrackOverlapActive = false;
    /** E04-WT-Overlap: thời điểm bắt đầu cán (để tính sustained 5s). */
    private wheelTrackOverlapStartedAt: number | null = null;
    /** E04-WT-Overlap: số interval 5s đã phạt sustained. */
    private wheelTrackOverlapIntervalCount = 0;
    private boundaryContactActive = false;
    private boundaryContactStartedAt: number | null = null;
    private boundaryIntervalCount = 0;
    private startYellowLineCrossed = false;
    private endYellowLineCrossed = false;
    /** Sensor state cho edge detection của END_GATE (sensor vạch vàng cuối). */
    private prevEndInside = false;
    private endGatePending = false;
    private rpmViolationLatched = false;
    private stallLatched = false;
    private stallEventCount = 0;
    private speedingSec = 0;
    private overtimePenaltyApplied = false;
    private _disqualifyReason = '';
    /** Đã phát toast "Bắt đầu bài 4" cho course hiện tại chưa (one-shot). */
    private startToastEmitted = false;
    /**
     * Baseline trung bình Y của 4 bánh xe lúc đầu course, dùng để phát hiện
     * "lên vỉa hè" (xe leo lên cao > baseline + curbHeight). Được lấy trung
     * bình qua vài frame đầu để tránh nhiễu khi xe vừa chạm sensor. Khi chưa
     * sẵn sàng (-1), curb check bị bỏ qua để tránh DQ sai khi xe ở trên cầu
     * / dốc / surface không bằng phẳng.
     */
    private wheelYBaseline = -1;
    private wheelYBaselineSamples = 0;

    // ── Temporary helpers ────────────────────────────────────────────────────
    private readonly _tmp = new THREE.Vector3();

    constructor() {
        const r = EXAM_04_RULES;
        this.limitSec = r.time.limitSec;
        this.overtimePenalty = r.time.overtimePenalty;
        this.boundaryContactPenalty = r.boundary.contactPenalty;
        this.sustainedContactIntervalSec = r.boundary.sustainedContactIntervalSec;
        this.sustainedContactPenalty = r.boundary.sustainedContactPenalty;
        this.maxRPM = r.engine.maxRPM;
        this.stallPenalty = r.engine.stallPenalty[EXAM_VEHICLE_CLASS];
        this.rpmExceededPenalty = r.engine.rpmExceededPenalty[EXAM_VEHICLE_CLASS];
        this.maxSpeedKmh = r.maxSpeedKmh[EXAM_VEHICLE_CLASS];
        this.speedingIntervalSec = r.speeding.intervalSec;
        this.speedingPenalty = r.speeding.penaltyPerInterval;
        this.wheelTrackMissingPenalty = r.wheelTrack.missingWheelPenalty;
        this.wheelTrackOverlapPenalty = r.wheelTrack.overlapContactPenalty;
        this.wheelTrackOverlapIntervalSec = r.wheelTrack.overlapSustainedIntervalSec;
        this.wheelTrackOverlapSustainedPenalty = r.wheelTrack.overlapSustainedPenalty;
        this.curbTopY = 0.15;
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /** Swap sang bộ sensors của course mới. Reset toàn bộ state. */
    swapToCourse(sensors: Exam04CourseSensors): void {
        this.sensors = sensors;
        this.reset();
        this.state = 'WHEEL_TRACK_ACTIVE';
    }

    /** Tìm course mà xe vừa chạm startYellowSensor (entry từ hướng entry road). Trả về index 0..3 hoặc -1. */
    findEnteredCourse(frontPosition: THREE.Vector3, allSensors: Exam04CourseSensors[]): number {
        for (let i = 0; i < allSensors.length; i++) {
            if (allSensors[i].startYellowSensor.containsPoint(frontPosition)) {
                return i;
            }
        }
        return -1;
    }

    /** Tiêu đề hiển thị trên HUD tùy state. */
    get title(): string {
        switch (this.state) {
            case 'INACTIVE': return 'Bài 4 · Vệt bánh xe & đường vuông góc';
            case 'WHEEL_TRACK_ACTIVE': return 'Bài 4 · Qua vệt bánh xe';
            case 'WHEEL_TRACK_COMPLETED': return 'Bài 4 · Đang qua đường vuông góc';
            case 'RIGHT_ANGLE_ACTIVE': return 'Bài 4 · Đường vuông góc';
            case 'COMPLETED': return 'Bài 4';
            case 'DISQUALIFIED': return 'Bài 4 · Đình chỉ';
        }
    }

    reset(): void {
        this.startedAt = null;
        this.previousFrontPosition = null;
        this.wheelTrackCompleted = false;
        this.frontPassengerPassed = false;
        this.previousPassengerWheels = null;
        this.rearPassengerPassed = false;
        this.wheelTrackPenaltyLatched = false;
        this.wheelTrackOverlapActive = false;
        this.wheelTrackOverlapStartedAt = null;
        this.wheelTrackOverlapIntervalCount = 0;
        this.boundaryContactActive = false;
        this.boundaryContactStartedAt = null;
        this.boundaryIntervalCount = 0;
        this.startYellowLineCrossed = false;
        this.endYellowLineCrossed = false;
        this.rpmViolationLatched = false;
        this.stallLatched = false;
        this.stallEventCount = 0;
        this.speedingSec = 0;
        this.overtimePenaltyApplied = false;
        this._disqualifyReason = '';
        this.startToastEmitted = false;
        this.prevEndInside = false;
        this.endGatePending = false;
        this.wheelYBaseline = -1;
        this.wheelYBaselineSamples = 0;
    }

    update(input: Exam04Input): Exam04Result {
        if (this.state === 'INACTIVE' || this.state === 'COMPLETED' || this.state === 'DISQUALIFIED') {
            return { penalties: [], completed: this.state === 'COMPLETED', disqualified: this.state === 'DISQUALIFIED' };
        }

        const now = performance.now();
        const s = this.sensors!;
        if (this.hasCrossedEndYellow(input)) this.endGatePending = true;
        const penalties: PenaltyEvent[] = [];
        let toast: string | undefined;
        const add = (points: number, reason: string) => {
            penalties.push({ at: now, points, reason });
        };

        // ── Emit "Bắt đầu bài 4" toast (one-shot per course entry) ─────────
        if (this.state === 'WHEEL_TRACK_ACTIVE' && !this.startToastEmitted) {
            this.startToastEmitted = true;
            toast = 'Bắt đầu bài 4 — Vệt bánh xe & đường vuông góc';
        }

        // ── Timer 120s ──────────────────────────────────────────────────────
        if (this.startedAt === null && this.touchesTimerStart(input.frontPosition)) {
            this.startedAt = now;
            toast = 'Bắt đầu tính giờ bài 4 (02:00)';
        }
        this.previousFrontPosition = input.frontPosition.clone();
        const elapsedSec = this.startedAt === null ? 0 : (now - this.startedAt) / 1000;
        const timeRemainingSec = Math.max(0, this.limitSec - elapsedSec);

        // E04-05: phạt quá thời gian một lần duy nhất trong mỗi lượt làm bài.
        if (this.startedAt !== null && !this.overtimePenaltyApplied && elapsedSec >= this.limitSec) {
            this.overtimePenaltyApplied = true;
            add(this.overtimePenalty, 'Quá thời gian 02 phút thực hiện bài số 4');
        }

        // E04-11: arrival overtime đã được bỏ theo yêu cầu.

        // Check each right wheel independently, using swept horizontal positions
        // so wheel-centre height and a skipped render frame cannot hide a crossing.
        const zone = s.wheelTrackZone;
        const project = (point: THREE.Vector3) => new THREE.Vector3(point.x, zone.min.y, point.z);
        const crossedZone = (point: THREE.Vector3, previous?: THREE.Vector3): boolean => {
            const end = project(point);
            if (zone.containsPoint(end)) return true;
            if (!previous) return false;
            const start = project(previous), delta = end.clone().sub(start);
            const length = delta.length();
            if (length < 1e-8) return false;
            const hit = new THREE.Ray(start, delta.divideScalar(length)).intersectBox(zone, new THREE.Vector3());
            return hit !== null && hit.distanceTo(start) <= length + 1e-6;
        };
        if (!this.wheelTrackPenaltyLatched) {
            this.frontPassengerPassed ||= crossedZone(input.wheelPositions.FR, this.previousPassengerWheels?.FR);
            this.rearPassengerPassed ||= crossedZone(input.wheelPositions.RR, this.previousPassengerWheels?.RR);
            this.previousPassengerWheels = { FR: input.wheelPositions.FR.clone(), RR: input.wheelPositions.RR.clone() };
            const forward = s.exitForwardAxis.clone().setY(0).normalize();
            const farEdge = zone.getCenter(new THREE.Vector3()).dot(forward)
                + zone.getSize(new THREE.Vector3()).multiplyScalar(.5).dot(
                    new THREE.Vector3(Math.abs(forward.x), 0, Math.abs(forward.z)));
            const bothPast = input.wheelPositions.FR.dot(forward) > farEdge
                && input.wheelPositions.RR.dot(forward) > farEdge;
            if (bothPast || this.endGatePending) {
                this.wheelTrackPenaltyLatched = true;
                this.wheelTrackCompleted = this.frontPassengerPassed && this.rearPassengerPassed;
                this.state = 'RIGHT_ANGLE_ACTIVE';
                if (!this.frontPassengerPassed && !this.rearPassengerPassed) {
                    this._disqualifyReason = 'Bánh xe trước và bánh xe sau bên lái phụ không qua vùng giới hạn của hình vệt bánh xe';
                    if (!input.continueAfterDisqualification) this.state = 'DISQUALIFIED';
                    return { penalties, completed: false, disqualified: true, disqualifyReason: this._disqualifyReason };
                }
                if (!this.frontPassengerPassed) add(this.wheelTrackMissingPenalty, 'Bánh trước bên lái phụ chưa qua vệt bánh xe');
                if (!this.rearPassengerPassed) add(this.wheelTrackMissingPenalty, 'Bánh sau bên lái phụ chưa qua vệt bánh xe');
            }
        }

        // The corridor is valid driving space. Only contact with its white
        // boundary paint is penalised, once on contact and again every 5 s.
        const overlappingWheel = (s.wheelTrackBoundarySensors ?? []).some(boundary =>
            Object.values(input.wheelPositions).some(point => boundary.containsPoint(
                new THREE.Vector3(point.x, boundary.min.y, point.z))));
        if (overlappingWheel) {
            if (!this.wheelTrackOverlapActive) {
                this.wheelTrackOverlapActive = true;
                this.wheelTrackOverlapStartedAt = now;
                add(this.wheelTrackOverlapPenalty, 'Bánh xe đè lên vệt bánh xe');
            }
            // Sustained: cứ mỗi interval giây cán tiếp → -5.
            const overlapElapsedSec = (now - this.wheelTrackOverlapStartedAt!) / 1000;
            const overlapIntervals = Math.floor(overlapElapsedSec / this.wheelTrackOverlapIntervalSec);
            while (this.wheelTrackOverlapIntervalCount < overlapIntervals) {
                this.wheelTrackOverlapIntervalCount++;
                add(this.wheelTrackOverlapSustainedPenalty, 'Bánh xe đè lên vệt bánh xe kéo dài quá 5 giây');
            }
        } else {
            // Reset khi tất cả bánh rời khỏi vệt
            this.wheelTrackOverlapActive = false;
            this.wheelTrackOverlapStartedAt = null;
            this.wheelTrackOverlapIntervalCount = 0;
        }

        // ── Boundary contact (E04-03, E04-04) ────────────────────────────────
        let touchingBoundary = false;
        for (const boundary of s.boundarySensors) {
            if (
                boundary.containsPoint(input.wheelPositions.FL) ||
                boundary.containsPoint(input.wheelPositions.FR) ||
                boundary.containsPoint(input.wheelPositions.RL) ||
                boundary.containsPoint(input.wheelPositions.RR)
            ) {
                touchingBoundary = true;
                break;
            }
        }

        if (touchingBoundary) {
            if (!this.boundaryContactActive) {
                // First contact — E04-03: -5 per event (latch)
                this.boundaryContactActive = true;
                this.boundaryContactStartedAt = now;
                add(this.boundaryContactPenalty, 'Bánh xe đè vạch giới hạn');
            }
            // E04-04: sustained contact — -5 per 5s interval
            const elapsedContactSec = (now - this.boundaryContactStartedAt!) / 1000;
            const intervals = Math.floor(elapsedContactSec / this.sustainedContactIntervalSec);
            while (this.boundaryIntervalCount < intervals) {
                this.boundaryIntervalCount++;
                add(this.sustainedContactPenalty, 'Bánh xe đè vạch kéo dài quá 5 giây');
            }
        } else {
            // Reset boundary contact state when all wheels leave
            this.boundaryContactActive = false;
            this.boundaryContactStartedAt = null;
            this.boundaryIntervalCount = 0;
        }

        // ── E04-06: curb (drive on sidewalk) — DQ ───────────────────────────
        // Check regardless of specific state (as long as we're in an active exercise)
        const isActiveExercise = this.state === 'WHEEL_TRACK_ACTIVE'
            || this.state === 'WHEEL_TRACK_COMPLETED'
            || this.state === 'RIGHT_ANGLE_ACTIVE';
        if (isActiveExercise) {
            // E04-07: accident — DQ
            if (input.accident === true) {
                if (!input.continueAfterDisqualification) this.state = 'DISQUALIFIED';
                this._disqualifyReason = 'Xử lý tình huống không hợp lý gây tai nạn';
                return { toast, penalties, completed: false, disqualified: true, disqualifyReason: this._disqualifyReason };
            }
            // E04-01: wrong exam layout — DQ
            if (input.wrongLayout === true) {
                if (!input.continueAfterDisqualification) this.state = 'DISQUALIFIED';
                this._disqualifyReason = EXAM_04_WRONG_LAYOUT_REASON;
                return { toast, penalties, completed: false, disqualified: true, disqualifyReason: this._disqualifyReason };
            }
            if (
                // Lưu ý: wheel world Y luôn ≈ tireRadius (≈ 0.38) vì pivot đặt
                // ở tâm bánh và đáy bánh chạm đất Y=0. So sánh trực tiếp
                // `wheel.y > curbTopY` (0.15) sẽ DQ sai ngay frame đầu. Cách
                // đúng: lấy baseline Y trung bình của 4 bánh trong vài frame
                // đầu (xe ở mặt đường bằng phẳng), rồi so sánh với
                // baseline + ngưỡng curb (≈ 0.15).
                (() => {
                    const curbHeightThreshold = 0.15;
                    if (this.wheelYBaseline < 0 && this.wheelYBaselineSamples < 10) {
                        // Đang lấy baseline: cộng dồn trung bình.
                        const avgY = (input.wheelPositions.FL.y + input.wheelPositions.FR.y
                            + input.wheelPositions.RL.y + input.wheelPositions.RR.y) / 4;
                        if (this.wheelYBaselineSamples === 0) {
                            this.wheelYBaseline = avgY;
                        } else {
                            // EMA để baseline phản ứng nhanh với surface.
                            this.wheelYBaseline = this.wheelYBaseline * 0.7 + avgY * 0.3;
                        }
                        this.wheelYBaselineSamples++;
                        return false; // Chưa đủ baseline → không DQ.
                    }
                    const curbTriggerY = this.wheelYBaseline + curbHeightThreshold;
                    return (
                        input.wheelPositions.FL.y > curbTriggerY ||
                        input.wheelPositions.FR.y > curbTriggerY ||
                        input.wheelPositions.RL.y > curbTriggerY ||
                        input.wheelPositions.RR.y > curbTriggerY
                    );
                })()
            ) {
                if (!input.continueAfterDisqualification) this.state = 'DISQUALIFIED';
                this._disqualifyReason = 'Lái xe lên vỉa hè';
                return { toast, penalties, completed: false, disqualified: true, disqualifyReason: this._disqualifyReason };
            }
        }

        // ── Check end gate ───────────────────────────────────────────────────
        if (!this.endYellowLineCrossed && this.endGatePending) {
            this.endYellowLineCrossed = true;
            this.state = 'COMPLETED';
            const completedReason = this.wheelTrackCompleted
                ? (toast ?? 'Hoàn thành bài 4 — Vệt bánh xe & đường vuông góc')
                : 'Hoàn thành bài 4 (chưa qua hết vệt bánh xe — bị trừ điểm)';
            return {
                toast: completedReason,
                penalties,
                completed: true,
                disqualified: false,
                wheelTrackCompleted: this.wheelTrackCompleted,
                timeRemainingSec,
            };
        }

        // Quá giờ chỉ trừ điểm một lần ở trên; xe tiếp tục làm bài, không DQ vì hết giờ.
        // Nếu wheelTrackCompleted=false thì vẫn còn lặp bình thường cho đến
        // khi qua endYellowLine (sẽ vào nhánh COMPLETED ở trên).

        return {
            toast: toast ?? undefined,
            penalties,
            completed: false,
            disqualified: false,
            wheelTrackCompleted: this.wheelTrackCompleted,
            timeRemainingSec,
        };
    }

    // ── Sensor helpers ────────────────────────────────────────────────────────

    private touchesTimerStart(front: THREE.Vector3): boolean {
        const sensor = this.sensors!.timerStartSensor;
        if (sensor.containsPoint(front)) return true;
        const previous = this.previousFrontPosition;
        if (!previous) return false;
        const direction = front.clone().sub(previous);
        const distance = direction.length();
        if (distance < 1e-6) return false;
        const hit = new THREE.Ray(previous, direction.divideScalar(distance))
            .intersectBox(sensor, new THREE.Vector3());
        return hit !== null && hit.distanceToSquared(previous) <= distance * distance + 1e-6;
    }

    /**
     * Edge-detection: xe vừa bước vào END_GATE (vạch vàng cuối bài).
     *
     * Sensor đã được transform sang world space khi `wireExam04()` (Box3).
     * Hàm này trả về `true` đúng 1 frame khi xe đi từ ngoài sensor vào trong,
     * dùng `prevEndInside` làm memory. Tránh trigger lặp nhiều frame khi xe
     * đứng giữa sensor.
     */
    private hasCrossedEndYellow(input: Exam04Input): boolean {
        if (!this.sensors) return false;
        const sensor = this.sensors.endYellowSensor;
        const inside = sensor.containsPoint(input.frontPosition);

        // Edge detection: chỉ trigger khi xe vừa bước vào sensor (frame trước ngoài,
        // frame này trong). Đảm bảo 1-shot, không lặp nhiều frame.
        const justEntered = inside && !this.prevEndInside;

        // Cập nhật memory cho frame sau
        this.prevEndInside = inside;

        return justEntered;
    }

    /** Check if any wheel (any of 4) is currently above curb height. */
    private anyWheelOnCurb(input: Exam04Input): boolean {
        if (!this.sensors) return false;
        return (
            input.wheelPositions.FL.y > this.curbTopY ||
            input.wheelPositions.FR.y > this.curbTopY ||
            input.wheelPositions.RL.y > this.curbTopY ||
            input.wheelPositions.RR.y > this.curbTopY
        );
    }
}
