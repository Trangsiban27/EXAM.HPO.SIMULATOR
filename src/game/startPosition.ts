/** Distance from vehicle origin to the front probe used for scoring, in metres. */
export const FRONT_PROBE_OFFSET_M = 2.1;

/** Start marking and vehicle placement share the same reference, in metres. */
export const startPosition = {
    lineX: 17.2,
    lineZ: 18.2,
    /** Front probe starts 0.5 m before the start line. */
    distance: FRONT_PROBE_OFFSET_M + 0.5,
    /** Vị trí trong làn bên phải theo hướng xe chạy (+X, phía +Z). */
    laneOffset: 2,
    heading: -Math.PI / 2,
};
