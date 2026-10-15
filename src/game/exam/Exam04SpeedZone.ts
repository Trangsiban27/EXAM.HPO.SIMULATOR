import * as THREE from 'three';

type CourseGates = {
    startYellowSensor: THREE.Box3;
    endYellowSensor: THREE.Box3;
    exitForwardAxis: THREE.Vector3;
};

/** Tracks the physical start/end yellow lines independently of scoring mode. */
export class Exam04SpeedZone {
    private activeCourse: CourseGates | null = null;
    private reachedEndLine = false;
    private previousFront?: THREE.Vector3;

    constructor(private readonly courses: readonly CourseGates[]) {}

    reset(): void {
        this.activeCourse = null;
        this.reachedEndLine = false;
        this.previousFront = undefined;
    }

    update(front: THREE.Vector3, rear: THREE.Vector3): boolean {
        if (!this.activeCourse) {
            this.activeCourse = this.courses.find(course =>
                this.touchesLine(course.startYellowSensor, front)) ?? null;
        }

        if (this.activeCourse) {
            const end = this.activeCourse.endYellowSensor;
            if (this.touchesLine(end, front)) this.reachedEndLine = true;
            if (this.reachedEndLine && this.hasLeftEndLine(rear, this.activeCourse)) {
                this.activeCourse = null;
                this.reachedEndLine = false;
            }
        }

        this.previousFront = front.clone();
        return this.activeCourse !== null;
    }

    private touchesLine(sensor: THREE.Box3, front: THREE.Vector3): boolean {
        if (sensor.containsPoint(front)) return true;
        const previous = this.previousFront;
        if (!previous) return false;
        if (sensor.containsPoint(previous)) return true;
        const direction = front.clone().sub(previous);
        const distance = direction.length();
        if (distance < 1e-6) return false;
        const hit = new THREE.Ray(previous, direction.divideScalar(distance))
            .intersectBox(sensor, new THREE.Vector3());
        return hit !== null && hit.distanceToSquared(previous) <= distance * distance + 1e-6;
    }

    private hasLeftEndLine(rear: THREE.Vector3, course: CourseGates): boolean {
        const center = course.endYellowSensor.getCenter(new THREE.Vector3());
        const halfSize = course.endYellowSensor.getSize(new THREE.Vector3()).multiplyScalar(.5);
        const axis = course.exitForwardAxis;
        const halfDepth = Math.abs(axis.x) * halfSize.x + Math.abs(axis.z) * halfSize.z;
        const distancePastCenter = (rear.x - center.x) * axis.x + (rear.z - center.z) * axis.z;
        return distancePastCenter > halfDepth && !course.endYellowSensor.containsPoint(rear);
    }
}
