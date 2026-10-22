import * as THREE from 'three';
import type { WindingCourseEntry } from '../TrackObjects';
import { EXAM_VEHICLE_CLASS } from '../exam/examRules';
import type { PenaltyEvent } from '../types';

/** Detect the bumper crossing the full gate, including the gaps between dashes. */
export function touchesWindingGate(course: WindingCourseEntry['course'], name: string,
    frontWorld: THREE.Vector3, previousWorld: THREE.Vector3 | null): boolean {
    const gate = course.root.getObjectByName(name);
    if (!gate?.children.length) return false;
    course.root.updateWorldMatrix(true, false);
    const front = course.root.worldToLocal(frontWorld.clone());
    const x = gate.children[0].position.x;
    const z = (gate.children[0].position.z + gate.children[gate.children.length - 1].position.z) / 2;
    const bounds = new THREE.Box3(
        new THREE.Vector3(x - .075, -10, z - course.width / 2),
        new THREE.Vector3(x + .075, 10, z + course.width / 2));
    if (bounds.containsPoint(front)) return true;
    if (!previousWorld) return false;
    const start = course.root.worldToLocal(previousWorld.clone());
    const direction = front.clone().sub(start), length = direction.length();
    if (length < 1e-6) return false;
    const hit = new THREE.Ray(start, direction.normalize()).intersectBox(bounds, new THREE.Vector3());
    return hit !== null && start.distanceTo(hit) <= length;
}

/** Lesson 6 runs from the first yellow gate to the final yellow gate. */
export class Exam06SCurveTimer {
    private course: WindingCourseEntry | null = null;
    private previous: THREE.Vector3 | null = null;
    private startedAt = 0;
    private penaltyCount = 0;
    private completed = false;

    get isActive(): boolean { return this.course !== null && !this.completed; }
    get isCompleted(): boolean { return this.completed; }

    reset(): void {
        this.course = null;
        this.previous = null;
        this.startedAt = 0;
        this.penaltyCount = 0;
        this.completed = false;
    }

    update(front: THREE.Vector3, courses: readonly WindingCourseEntry[], now = performance.now()): PenaltyEvent[] {
        const previous = this.previous;
        this.previous = front.clone();
        if (this.completed) return [];
        if (!this.course) {
            this.course = courses.find(entry => entry.vehicleClass === EXAM_VEHICLE_CLASS
                && touchesWindingGate(entry.course, 's-curve-start-yellow-dashed-line', front, previous)) ?? null;
            if (!this.course) return [];
            this.startedAt = now;
        }
        const penalties: PenaltyEvent[] = [];
        // One deduction after each further 120 seconds, never every frame.
        while (now - this.startedAt > (this.penaltyCount + 1) * 120_000) {
            this.penaltyCount++;
            penalties.push({ at: now, points: 5, reason: 'Bài 6: Quá 02 phút thực hiện bài chữ S' });
        }
        if (touchesWindingGate(this.course.course, 's-curve-end-yellow-dashed-line', front, previous)) {
            this.completed = true;
        }
        return penalties;
    }
}
