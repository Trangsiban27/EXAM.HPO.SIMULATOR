/** Start marking and vehicle placement share the same reference, in metres. */
export const startPosition = {
    lineX: -35,
    lineZ: -2,
    /** Vehicle starts 15m behind the start line (lineX - distance = -35 - 15 = -50). */
    distance: 15,
    laneOffset: -2,
    heading: -Math.PI / 2,
};
