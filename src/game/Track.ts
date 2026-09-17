import { TrackObjects } from './TrackObjects';
import { buildExamGround } from './buildExamGround';

/** Builds the ground and exposes its scene, surface and update lifecycle. */
export class Track extends TrackObjects {
    constructor() {
        super();
        buildExamGround(this);
        this.connectRoadIntersections();
    }
}
