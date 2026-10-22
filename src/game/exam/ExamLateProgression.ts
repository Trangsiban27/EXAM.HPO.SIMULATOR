import * as THREE from 'three';
import { AUTO_DRIVE_WAYPOINTS_BY_CLASS, type AutoDriveWaypoint } from '../autoDrive/autoDriveRoutes';
import { EXAM_VEHICLE_CLASS } from './examRules';
import type { TrafficLight } from '../TrafficLight';

/** Shared saved lesson anchors and visible ground markings for manual progression. */
export class ExamLateProgression {
    private previousPosition: THREE.Vector3 | null = null;
    private previousFront: THREE.Vector3 | null = null;
    private readonly anchors: readonly AutoDriveWaypoint[];

    constructor(private readonly root?: THREE.Object3D, private readonly finishLight?: TrafficLight) {
        this.anchors = AUTO_DRIVE_WAYPOINTS_BY_CLASS[EXAM_VEHICLE_CLASS]?.exam08ToExam09 ?? [];
    }

    reset(): void { this.previousPosition = null; this.previousFront = null; }

    private touches(bounds: THREE.Box3, point: THREE.Vector3, previous: THREE.Vector3 | null): boolean {
        if (bounds.containsPoint(point)) return true;
        if (!previous) return false;
        const delta = point.clone().sub(previous), length = delta.length();
        if (length < 1e-6) return false;
        const hit = new THREE.Ray(previous, delta.normalize()).intersectBox(bounds, new THREE.Vector3());
        return hit !== null && previous.distanceTo(hit) <= length;
    }

    private atAnchor(lesson: number, position: THREE.Vector3, previous: THREE.Vector3 | null): boolean {
        const anchor = this.anchors.find(point => point.popupLessonId === lesson);
        if (!anchor) return false;
        const forward = new THREE.Vector3(-Math.sin(anchor.heading), 0, -Math.cos(anchor.heading));
        const right = new THREE.Vector3(forward.z, 0, -forward.x);
        const local = (point: THREE.Vector3) => {
            const offset = point.clone().sub(new THREE.Vector3(anchor.x, point.y, anchor.z));
            return new THREE.Vector3(offset.dot(right), 0, offset.dot(forward));
        };
        const current = local(position), before = previous ? local(previous) : null;
        if (before && current.z < before.z) return false;
        return this.touches(new THREE.Box3(new THREE.Vector3(-3.7, -1, -.5),
            new THREE.Vector3(3.7, 1, .5)), current, before);
    }

    update(lesson: number, approaching: boolean, position: THREE.Vector3, front: THREE.Vector3): {
        entered?: number; finished?: boolean;
    } {
        const previous = this.previousPosition, previousFront = this.previousFront;
        this.previousPosition = position.clone();
        this.previousFront = front.clone();
        if (lesson === 7 || (lesson === 8 && approaching)) {
            const line = this.root?.getObjectByName('road-11a-railway-white-line');
            if (line instanceof THREE.Mesh && line.parent) {
                line.parent.updateWorldMatrix(true, false);
                // Approach zone extends 10 m before the visible railway stop line.
                line.updateMatrix();
                if (!line.geometry.boundingBox) line.geometry.computeBoundingBox();
                const bounds = line.geometry.boundingBox!.clone().applyMatrix4(line.matrix);
                bounds.min.y = -10; bounds.max.y = 10;
                bounds.min.z -= 10; bounds.max.z += .5;
                const local = line.parent.worldToLocal(front.clone());
                const before = previousFront ? line.parent.worldToLocal(previousFront.clone()) : null;
                if ((!before || local.z >= before.z) && this.touches(bounds, local, before)) return { entered: 8 };
            }
        }
        if ((lesson === 8 || (lesson === 9 && approaching)) && this.atAnchor(9, position, previous)) {
            return { entered: 9 };
        }
        if ((lesson === 9 || (lesson === 10 && approaching)) && this.atAnchor(10, position, previous)) {
            return { entered: 10 };
        }
        if ((lesson === 10 || (lesson === 11 && approaching))
            && this.finishLight?.isVehicleInTriggerZone(position)) return { entered: 11 };
        if (lesson === 11 && !approaching) {
            const line = this.root?.getObjectByName('EX11_FINISH_LINE');
            if (line) {
                const bounds = new THREE.Box3().setFromObject(line);
                bounds.min.y = -10; bounds.max.y = 10;
                if ((!previousFront || front.x < previousFront.x)
                    && this.touches(bounds, front, previousFront)) return { finished: true };
            }
        }
        return {};
    }
}
