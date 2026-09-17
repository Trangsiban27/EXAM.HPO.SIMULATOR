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
