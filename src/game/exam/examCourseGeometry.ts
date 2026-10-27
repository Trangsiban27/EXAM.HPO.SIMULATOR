import { startPosition } from '../startPosition';

/** Shared world positions for the visible markings and their scoring sensors. */
export const EXAM_02_ROAD_CENTER_X = 28;
export const EXAM_02_ROAD_LENGTH_M = 21.62;
export const EXAM_02_APPROACH_LENGTH_M = 14.79;
export const EXAM_02_STOP_LINE_X =
    EXAM_02_ROAD_CENTER_X - EXAM_02_ROAD_LENGTH_M / 2 + EXAM_02_APPROACH_LENGTH_M;
export const EXAM_02_CROSSWALK = {
    x: (EXAM_02_STOP_LINE_X + EXAM_02_ROAD_CENTER_X + EXAM_02_ROAD_LENGTH_M / 2) / 2,
    z: startPosition.lineZ,
    widthM: 7.4,
    depthM: 5,
} as const;
/** Shared position of the lesson 2 introduction marking and voice trigger. */
export const EXAM_02_APPROACH_VOICE_LINE = {
    x: (startPosition.lineX + EXAM_02_STOP_LINE_X) / 2 +4,
    z: startPosition.lineZ,
    widthM: 7,
    thicknessM: .14,
} as const;

export const EXAM_03_BRIDGE_CENTER_X = 69.81;
export const EXAM_03_STOP_LINE_LOCAL_Z = 10;
export const EXAM_03_YELLOW_LINE_LOCAL_Z = 14;
export const EXAM_03_STOP_LINE_X = EXAM_03_BRIDGE_CENTER_X - EXAM_03_STOP_LINE_LOCAL_Z;
export const EXAM_03_YELLOW_LINE_X = EXAM_03_BRIDGE_CENTER_X - EXAM_03_YELLOW_LINE_LOCAL_Z;
export const EXAM_03_ENTRY_CHIME_LINE = {
    x: EXAM_03_YELLOW_LINE_X,
    z: startPosition.lineZ,
    widthM: EXAM_02_CROSSWALK.widthM - .4,
    thicknessM: .15,
} as const;

export const EXAM_05_FINISH_CROSSWALK_X = 21;
export const EXAM_05_FINISH_CROSSWALK_Z = -51;
export const EXAM_05_FINISH_CROSSWALK_WIDTH_M = 8;
export const EXAM_05_FINISH_CROSSWALK_DEPTH_M = 3;
