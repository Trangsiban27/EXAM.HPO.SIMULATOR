import { TrackObjects } from './TrackObjects';
import { buildExamGround } from './buildExamGround';
import { buildSidewalks } from './buildSidewalks';

/** Builds the ground and exposes its scene, surface and update lifecycle. */
export class Track extends TrackObjects {
    constructor() {
        super();
        buildExamGround(this);
        this.connectRoadIntersections();
        this.rebuildStraightRoadEdges();
        buildSidewalks(this.root);
    }
}
