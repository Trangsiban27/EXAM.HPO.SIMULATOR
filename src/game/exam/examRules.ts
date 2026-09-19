/**
 * Exam scoring rules for the Vietnamese driving-licence practical test (B/C-class
 * simulator). Each rule block exposes the per-event and interval penalties used by the
 * individual exercises, plus the vehicle class that the current scenario simulates.
 *
 * Values come from:
 *  - spec/exam/exam_01_start.md
 *  - spec/threejs_exam_yard_specification_v2.md
 *  - spec/hiep_phat_exam_yard_standard_v2_corrected.md
 */

export type ExamVehicleClass =
    | 'A1'  // mô tô < 175 cc
    | 'A2'  // mô tô < 50 kW
    | 'B'   // ô tô ≤ 9 chỗ (default theo RULE_YARD_10)
    | 'C1'  // ô tô tải ≤ 3.5 t
    | 'C'   // ô tô tải > 3.5 t
    | 'D1'  // ô tô chở người ≤ 16 chỗ
    | 'D2'  // ô tô chở người 16–29 chỗ
    | 'D'   // ô tô chở người > 29 chỗ
    | 'E'   // ô tô chở hàng kéo rơ-moóc
    | 'Fc';  // đầu kéo + sơ mi rơ moóc 20 feet (per spec)

/** Default vehicle class per Hiep Phat RULE_YARD_10 (VIOS 1.5E 2017). */
export const DEFAULT_EXAM_VEHICLE_CLASS: ExamVehicleClass = 'B';
export const EXAM_VEHICLE_CLASS: ExamVehicleClass = DEFAULT_EXAM_VEHICLE_CLASS;

/**
 * Maximum cruise speed at the start (km/h). HARD_CONSTRAINT từ
 * spec/exam/exam_01_start.md §4.8 — B/D1/D2 = 24 km/h, C1/C/D = 20 km/h.
 */
const maxSpeedKmh: Record<ExamVehicleClass, number> = {
    A1: 40,
    A2: 50,
    B: 24,
    C1: 20,
    C: 20,
    D1: 24,
    D2: 24,
    D: 20,
    E: 20,
    Fc: 20,
};

/**
 * Engine RPM ceiling. HARD_CONSTRAINT từ spec §4.6: maxRPM = 4000.
 * Penalty per stall / RPM-exceedance: 5 points each (spec §5 Lỗi 09, 10).
 */
const stallPenalty: Record<ExamVehicleClass, number> = {
    A1: 5, A2: 5, B: 5, C1: 5, C: 5, D1: 5, D2: 5, D: 5, E: 5, Fc: 5,
};
const rpmExceededPenalty: Record<ExamVehicleClass, number> = {
    A1: 5, A2: 5, B: 5, C1: 5, C: 5, D1: 5, D2: 5, D: 5, E: 5, Fc: 5,
};

/**
 * Speeding cadence: 3 seconds sustained → -1 point (spec §5 Lỗi 11).
 * Counter resets when vehicle returns under the speed cap.
 */
const speedingIntervalSec: Record<ExamVehicleClass, number> = {
    A1: 3, A2: 3, B: 3, C1: 3, C: 3, D1: 3, D2: 3, D: 3, E: 3, Fc: 3,
};
const speedingPenaltyPerInterval: Record<ExamVehicleClass, number> = {
    A1: 1, A2: 1, B: 1, C1: 1, C: 1, D1: 1, D2: 1, D: 1, E: 1, Fc: 1,
};

export interface ExamStartRules {
    id: 'EXAM_01_START';
    /** Maximum cruise speed at the start, in km/h. */
    maxSpeedKmh: Record<ExamVehicleClass, number>;
    /** Engine RPM ceiling; sustained operation above triggers a penalty. */
    engine: {
        stallPenalty: Record<ExamVehicleClass, number>;
        rpmExceededPenalty: Record<ExamVehicleClass, number>;
        maxRPM: number;
    };
    /** Speed-limit penalty cadence. */
    speeding: {
        intervalSec: Record<ExamVehicleClass, number>;
        penaltyPerInterval: Record<ExamVehicleClass, number>;
    };
    /** Distance past the start line where the left signal must be off. HARD_CONSTRAINT §4.4. */
    signalOffDistanceM: number;
    /** Per-event penalty points (spec §5, Lỗi 01–04). */
    penalties: {
        noSeatbelt: number;
        noLeftSignalAtStart: number;
        leftSignalNotOffAt5m: number;
        leftSignalTiming: number;
    };
    /** Soft-fail window after the command is received. HARD_CONSTRAINT §5 Lỗi 05–06. */
    startTimeout: {
        penaltyAtSec: number;
        penaltyPoints: number;
        disqualifyAtSec: number;
    };
}

/**
 * Spec-aligned rule block for EXAM_01_START. All magic numbers come from
 * spec/exam/exam_01_start.md (HARD_CONSTRAINT), except for vehicle class entries
 * outside B/C1/D1/D2/C/D which fall back to the closest legal grade.
 */
export const EXAM_01_START_RULES: ExamStartRules = {
    id: 'EXAM_01_START',
    maxSpeedKmh,
    engine: {
        stallPenalty,
        rpmExceededPenalty,
        maxRPM: 4000,
    },
    speeding: {
        intervalSec: speedingIntervalSec,
        penaltyPerInterval: speedingPenaltyPerInterval,
    },
    signalOffDistanceM: 5,
    penalties: {
        noSeatbelt: 5,
        noLeftSignalAtStart: 5,
        leftSignalNotOffAt5m: 5,
        leftSignalTiming: 5,
    },
    startTimeout: {
        penaltyAtSec: 20,
        penaltyPoints: 5,
        disqualifyAtSec: 30,
    },
};

export interface ExamPedestrianRules {
    /** Distance (m) before the stop line at which the speed cap is enforced. */
    approachZoneM: number;
    /** Speed cap (km/h) when approaching the pedestrian crossing. */
    approachSpeedKmh: Record<ExamVehicleClass, number>;
    /** Penalty per stop-line overrun. */
    stopLinePenalty: number;
    /** Penalty for failing to stop on the line. */
    stopMissedPenalty: number;
    /** Penalty for not re-engaging the clutch / engine after stopping. */
    stallOnStopPenalty: number;
}

/**
 * Pedestrian (Bài 2A) rules. Source: spec/exam/exam_02_pedestrian.md (out-of-scope
 * for this refactor; existing values are preserved verbatim to avoid regressing
 * the Bài 2 logic already shipped).
 */
export const EXAM_02_PEDESTRIAN_RULES: ExamPedestrianRules = {
    approachZoneM: 12,
    approachSpeedKmh: {
        A1: 20,
        A2: 25,
        B: 30,
        C1: 25,
        C: 25,
        D1: 25,
        D2: 25,
        D: 25,
        E: 20,
        Fc: 20,
    },
    stopLinePenalty: 10,
    stopMissedPenalty: 5,
    stallOnStopPenalty: 5,
};

/**
 * Pedestrian rules v2 — full implementation aligned with
 * spec/exam/exam_02_pedestrian_stop.md (HARD_CONSTRAINT từ §12).
 *
 * Khoảng cách A: đo từ thanh cản trước xuống vạch dừng.
 *   A ∈ [0, 0.5 m]    → VALID_STOP
 *   A > 0.5 m         → STOP_TOO_EARLY  (-5)
 *   A < 0             → STOP_OVER_LINE  (-5)
 *   không dừng        → NO_REQUIRED_STOP (-5)
 */
export interface ExamPedestrianRulesV2 {
    id: 'EXAM_02_PEDESTRIAN';
    /** Khoảng cách tối đa từ thanh cản trước đến vạch dừng (HARD_CONSTRAINT: 0.5 m). */
    stopPosition: {
        maxDistanceBeforeLineM: number;
    };
    engine: {
        maxRPM: number;
        stallPenalty: Record<ExamVehicleClass, number>;
        rpmExceededPenalty: Record<ExamVehicleClass, number>;
    };
    /** Tốc độ giới hạn trong zone 2A (HARD_CONSTRAINT §4.5). */
    maxSpeedKmh: Record<ExamVehicleClass, number>;
    penalties: {
        noRequiredStop: number;
        stopTooEarly: number;
        stopOverLine: number;
    };
    speeding: {
        intervalSec: number;
        penaltyPerInterval: number;
    };
    /** Thời gian đến bài vượt quy định. allowedTimeSec = null (REQUIRED_INPUT). */
    arrivalOvertime: {
        intervalSec: number;
        penaltyPerInterval: number;
        allowedTimeSec: number | null;
    };
    disqualify: {
        driveOnCurb: boolean;
        accident: boolean;
    };
}

export const EXAM_02_PEDESTRIAN_RULES_V2: ExamPedestrianRulesV2 = {
    id: 'EXAM_02_PEDESTRIAN',
    stopPosition: {
        maxDistanceBeforeLineM: 0.5,
    },
    engine: {
        maxRPM: 4000,
        stallPenalty,
        rpmExceededPenalty,
    },
    maxSpeedKmh: {
        A1: 40,
        A2: 50,
        B: 24,
        D1: 24,
        D2: 24,
        C1: 20,
        C: 20,
        D: 20,
        E: 20,
        Fc: 20,
    },
    penalties: {
        noRequiredStop: 5,
        stopTooEarly: 5,
        stopOverLine: 5,
    },
    speeding: {
        intervalSec: 3,
        penaltyPerInterval: 1,
    },
    arrivalOvertime: {
        intervalSec: 3,
        penaltyPerInterval: 1,
        allowedTimeSec: null, // REQUIRED_INPUT — spec không cung cấp.
    },
    disqualify: {
        driveOnCurb: true,
        accident: true,
    },
};

/**
 * Hill stop and start (Bài 3A) rules — aligned with
 * spec/exam/exam_03_hill_stop_and_start.md (HARD_CONSTRAINT).
 *
 * Khoảng cách A: đo từ thanh cản trước đến vạch dừng.
 *   A ∈ [0, 0.5 m]    → VALID_STOP
 *   A > 0.5 m          → STOP_TOO_EARLY  (-5)
 *   A < 0              → STOP_OVER_LINE  (DQ)
 *   không dừng         → NO_REQUIRED_STOP (DQ)
 *
 * Rollback: tính từ vị trí dừng, vector ngược hướng lên dốc.
 *   rollback > 0.5 m   → DQ_ROLLBACK_OVER_500MM
 *
 * Timer 30s: bắt đầu từ thời điểm xe dừng.
 *   quá 30s chưa khởi hành qua vạch → DQ_START_TIMEOUT_30S
 */
export interface ExamHillRules {
    id: 'EXAM_03_HILL_STOP_AND_START';
    /** Khoảng cách tối đa từ thanh cản trước đến vạch dừng (HARD_CONSTRAINT: 0.5 m). */
    stopPosition: {
        maxDistanceBeforeLineM: number;
    };
    /** Quy tắc khởi hành ngang dốc. */
    hillStart: {
        maxRollbackM: number;
        mustCrossStopPositionWithinSec: number;
    };
    engine: {
        maxRPM: number;
        stallPenalty: Record<ExamVehicleClass, number>;
        rpmExceededPenalty: Record<ExamVehicleClass, number>;
    };
    /** Tốc độ giới hạn (HARD_CONSTRAINT §4.8). */
    maxSpeedKmh: Record<ExamVehicleClass, number>;
    penalties: {
        stopTooEarly: number;
    };
    speeding: {
        intervalSec: number;
        penaltyPerInterval: number;
    };
    /** Thời gian đến bài vượt quy định. allowedTimeSec = null (REQUIRED_INPUT). */
    arrivalOvertime: {
        intervalSec: number;
        penaltyPerInterval: number;
        allowedTimeSec: number | null;
    };
    disqualify: {
        noRequiredStop: boolean;
        stopOverLine: boolean;
        startTimeout30s: boolean;
        rollbackOver500mm: boolean;
        accident: boolean;
    };
}

export const EXAM_03_HILL_RULES: ExamHillRules = {
    id: 'EXAM_03_HILL_STOP_AND_START',
    stopPosition: {
        maxDistanceBeforeLineM: 0.5,
    },
    hillStart: {
        maxRollbackM: 0.5,
        mustCrossStopPositionWithinSec: 30,
    },
    engine: {
        maxRPM: 4000,
        stallPenalty,
        rpmExceededPenalty,
    },
    maxSpeedKmh: {
        A1: 40,
        A2: 50,
        B: 24,
        D1: 24,
        D2: 24,
        C1: 20,
        C: 20,
        D: 20,
        E: 20,
        Fc: 20,
    },
    penalties: {
        stopTooEarly: 5,
    },
    speeding: {
        intervalSec: 3,
        penaltyPerInterval: 1,
    },
    arrivalOvertime: {
        intervalSec: 3,
        penaltyPerInterval: 1,
        allowedTimeSec: null,
    },
    disqualify: {
        noRequiredStop: true,
        stopOverLine: true,
        startTimeout30s: true,
        rollbackOver500mm: true,
        accident: true,
    },
};

/**
 * Returns a defensive copy of EXAM_01_START_RULES keyed to the supplied vehicle
 * class. Callers should never mutate the returned object in-place.
 */
export function resolveStartRules(vehicleClass: ExamVehicleClass) {
    const r = EXAM_01_START_RULES;
    return {
        maxSpeedKmh: r.maxSpeedKmh[vehicleClass],
        engine: {
            stallPenalty: r.engine.stallPenalty[vehicleClass],
            rpmExceededPenalty: r.engine.rpmExceededPenalty[vehicleClass],
            maxRPM: r.engine.maxRPM,
        },
        speeding: {
            intervalSec: r.speeding.intervalSec[vehicleClass],
            penaltyPerInterval: r.speeding.penaltyPerInterval[vehicleClass],
        },
        signalOffDistanceM: r.signalOffDistanceM,
        penalties: { ...r.penalties },
        startTimeout: { ...r.startTimeout },
        vehicleClass,
    };
}

/** Returns a defensive copy of EXAM_03_HILL_RULES keyed to the supplied vehicle class. */
export function resolveHillRules(vehicleClass: ExamVehicleClass) {
    const r = EXAM_03_HILL_RULES;
    return {
        maxSpeedKmh: r.maxSpeedKmh[vehicleClass],
        maxRollbackM: r.hillStart.maxRollbackM,
        maxRollbackTimeSec: r.hillStart.mustCrossStopPositionWithinSec,
        engine: {
            stallPenalty: r.engine.stallPenalty[vehicleClass],
            rpmExceededPenalty: r.engine.rpmExceededPenalty[vehicleClass],
            maxRPM: r.engine.maxRPM,
        },
        speeding: {
            intervalSec: r.speeding.intervalSec,
            penaltyPerInterval: r.speeding.penaltyPerInterval,
        },
        penalties: { ...r.penalties },
        arrivalOvertime: { ...r.arrivalOvertime },
        disqualify: { ...r.disqualify },
        vehicleClass,
    };
}

/**
 * Wheel-track + right-angle (Bài 4A) rules — aligned with
 * spec/exam/exam_04_wheel_track_and_right_angle_v2.md.
 *
 * Hai vạch vàng (đầu/cuối) là START_GATE / END_GATE chính thức.
 * Logic chấm điểm áp dụng sau khi xe qua vạch vàng đầu bài.
 *
 * Lỗi đặc biệt:
 *   E04-02: không bánh nào qua wheel-track (FR + RR) → đình chỉ.
 *           Chỉ 1 trong 2 bánh qua → trừ 5 điểm / bánh còn lại (E04-02b).
 *   E04-03: đè vạch giới hạn → -5 mỗi lần (không cộng dồn mỗi frame).
 *   E04-04: đè vạch liên tục ≥ 5s → thêm -5 theo rule.
 *   E04-05: quá 02 phút → -5 theo rule.
 *   E04-08: chết máy → -5 mỗi lần.
 *   E04-09: RPM > 4000 → -5 mỗi lần.
 *   E04-10: quá tốc độ → -1 mỗi 3s.
 *   E04-11: arrival overtime → -1 mỗi 3s (allowedTimeSec = REQUIRED_INPUT → null).
 */
export interface Exam04Rules {
    id: 'EXAM_04_WHEEL_TRACK_AND_RIGHT_ANGLE';
    time: {
        limitSec: number;
        overtimeIntervalSec: number;
        overtimePenalty: number;
    };
    wheelTrack: {
        /** Phạt cho mỗi bánh còn lại (FR hoặc RR) chưa qua zone khi đã qualify. */
        missingWheelPenalty: number;
        /** Phạt khi bánh xe (bất kỳ trong 4) cán lên vệt bánh xe — latch lần đầu. */
        overlapContactPenalty: number;
        /** Cadence (giây) áp dụng sustained penalty khi vẫn còn cán. */
        overlapSustainedIntervalSec: number;
        /** Phạt sustained mỗi interval khi vẫn còn cán lên vệt. */
        overlapSustainedPenalty: number;
    };
    boundary: {
        contactPenalty: number;
        sustainedContactIntervalSec: number;
        sustainedContactPenalty: number;
    };
    engine: {
        maxRPM: number;
        stallPenalty: Record<ExamVehicleClass, number>;
        rpmExceededPenalty: Record<ExamVehicleClass, number>;
    };
    maxSpeedKmh: Record<ExamVehicleClass, number>;
    speeding: {
        intervalSec: number;
        penaltyPerInterval: number;
    };
    arrivalOvertime: {
        intervalSec: number;
        penaltyPerInterval: number;
        allowedTimeSec: number | null;
    };
    disqualify: {
        wrongLayout: boolean;
        wheelTrackNotCompleted: boolean;
        driveOnCurb: boolean;
        accident: boolean;
    };
}

export const EXAM_04_RULES: Exam04Rules = {
    id: 'EXAM_04_WHEEL_TRACK_AND_RIGHT_ANGLE',
    time: {
        limitSec: 120,
        overtimeIntervalSec: 120,
        overtimePenalty: 5,
    },
    wheelTrack: {
        missingWheelPenalty: 5, // -5 cho mỗi bánh (FR hoặc RR) còn lại chưa qua zone
        overlapContactPenalty: 5,            // -5 lần đầu khi bánh đè lên vệt (latch)
        overlapSustainedIntervalSec: 5,      // cadence (s) phạt sustained khi còn đè
        overlapSustainedPenalty: 5,          // -5 mỗi interval sustained
    },
    boundary: {
        contactPenalty: 5,
        sustainedContactIntervalSec: 5,
        sustainedContactPenalty: 5,
    },
    engine: {
        maxRPM: 4000,
        stallPenalty,
        rpmExceededPenalty,
    },
    maxSpeedKmh: {
        A1: 40,
        A2: 50,
        B: 24,
        D1: 24,
        D2: 24,
        C1: 20,
        C: 20,
        D: 20,
        E: 20,
        Fc: 20,
    },
    speeding: {
        intervalSec: 3,
        penaltyPerInterval: 1,
    },
    arrivalOvertime: {
        intervalSec: 3,
        penaltyPerInterval: 1,
        allowedTimeSec: null, // REQUIRED_INPUT — spec không cung cấp.
    },
    disqualify: {
        wrongLayout: true,
        wheelTrackNotCompleted: true,
        driveOnCurb: true,
        accident: true,
    },
};

/**
 * Returns a defensive copy of EXAM_04_RULES keyed to the supplied vehicle class.
 * Mirrors the pattern of resolveHillRules.
 */
export function resolveExam04Rules(vehicleClass: ExamVehicleClass) {
    const r = EXAM_04_RULES;
    return {
        limitSec: r.time.limitSec,
        overtimeIntervalSec: r.time.overtimeIntervalSec,
        overtimePenalty: r.time.overtimePenalty,
        wheelTrack: { ...r.wheelTrack },
        boundary: { ...r.boundary },
        maxSpeedKmh: r.maxSpeedKmh[vehicleClass],
        engine: {
            stallPenalty: r.engine.stallPenalty[vehicleClass],
            rpmExceededPenalty: r.engine.rpmExceededPenalty[vehicleClass],
            maxRPM: r.engine.maxRPM,
        },
        speeding: { ...r.speeding },
        arrivalOvertime: { ...r.arrivalOvertime },
        disqualify: { ...r.disqualify },
        vehicleClass,
    };
}
