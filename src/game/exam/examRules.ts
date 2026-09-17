/**
 * Exam scoring rules for the Vietnamese driving-licence practical test (A1/A2/B-style
 * simulator). Each rule block exposes the per-event and interval penalties used by the
 * individual exercises, plus the vehicle class that the current scenario simulates.
 */

export type ExamVehicleClass = 'A1' | 'A2' | 'B';

export const EXAM_VEHICLE_CLASS: ExamVehicleClass = 'A2';

const baseSpeedKmh: Record<ExamVehicleClass, number> = {
    A1: 40,
    A2: 50,
    B: 60,
};

const stallPenalty: Record<ExamVehicleClass, number> = {
    A1: 5,
    A2: 5,
    B: 5,
};

const rpmExceededPenalty: Record<ExamVehicleClass, number> = {
    A1: 5,
    A2: 5,
    B: 5,
};

const speedingIntervalSec: Record<ExamVehicleClass, number> = {
    A1: 5,
    A2: 5,
    B: 5,
};

const speedingPenalty: Record<ExamVehicleClass, number> = {
    A1: 5,
    A2: 5,
    B: 5,
};

export interface ExamStartRules {
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
    /** Distance past the start line where the left signal must be off. */
    signalOffDistanceM: number;
    /** Soft-fail window after the command is received: 20 s penalty, 30 s disqualify. */
    commandWindowSec: number;
}

export const EXAM_01_START_RULES: ExamStartRules = {
    maxSpeedKmh: baseSpeedKmh,
    engine: {
        stallPenalty,
        rpmExceededPenalty,
        maxRPM: 4000,
    },
    speeding: {
        intervalSec: speedingIntervalSec,
        penaltyPerInterval: speedingPenalty,
    },
    signalOffDistanceM: 5,
    commandWindowSec: 30,
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

export const EXAM_02_PEDESTRIAN_RULES: ExamPedestrianRules = {
    approachZoneM: 12,
    approachSpeedKmh: {
        A1: 20,
        A2: 25,
        B: 30,
    },
    stopLinePenalty: 10,
    stopMissedPenalty: 5,
    stallOnStopPenalty: 5,
};
