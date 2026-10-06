/** Shared world positions for the visible markings and their scoring sensors. */
export const EXAM_02_ROAD_CENTER_X = 28;
export const EXAM_02_ROAD_LENGTH_M = 21.62;
export const EXAM_02_APPROACH_LENGTH_M = 14.79;
export const EXAM_02_STOP_LINE_X =
    EXAM_02_ROAD_CENTER_X - EXAM_02_ROAD_LENGTH_M / 2 + EXAM_02_APPROACH_LENGTH_M;

export const EXAM_03_BRIDGE_CENTER_X = 69.81;
export const EXAM_03_STOP_LINE_LOCAL_Z = 10;
export const EXAM_03_YELLOW_LINE_LOCAL_Z = 14;
export const EXAM_03_STOP_LINE_X = EXAM_03_BRIDGE_CENTER_X - EXAM_03_STOP_LINE_LOCAL_Z;
export const EXAM_03_YELLOW_LINE_X = EXAM_03_BRIDGE_CENTER_X - EXAM_03_YELLOW_LINE_LOCAL_Z;
