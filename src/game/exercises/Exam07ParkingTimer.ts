import * as THREE from 'three';
import type { ExamVehicleClass } from '../exam/examRules';
import { EXAM_VEHICLE_CLASS } from '../exam/examRules';
import type { PenaltyEvent } from '../types';

export type ParkingTimerGate = { line: THREE.Line; vehicleClass: ExamVehicleClass };

/** Times the entrance/exit at the connector's actual WidthDimension line. */
export class Exam07ParkingTimer {
    private previous: THREE.Vector3 | null = null;
    private active: ParkingTimerGate | null = null;
    private startedAt = 0;
    private reachedInside = false;
    private penalized = false;
    private completed = false;
    get isActive(): boolean { return this.active !== null && !this.completed; }
    get isCompleted(): boolean { return this.completed; }

    reset(): void {
        this.previous = null;
        this.active = null;
        this.startedAt = 0;
        this.reachedInside = false;
        this.penalized = false;
        this.completed = false;
    }

    update(frontWorld: THREE.Vector3, gates: readonly ParkingTimerGate[], now = performance.now()): PenaltyEvent[] {
        const previous = this.previous;
        this.previous = frontWorld.clone();
        if (this.completed) return [];
        const sample = (gate: ParkingTimerGate) => {
            gate.line.updateWorldMatrix(true, false);
            const geometry = gate.line.geometry;
            if (!geometry.boundingBox) geometry.computeBoundingBox();
            const bounds = geometry.boundingBox!.clone();
            const gateX = bounds.min.x;
            bounds.min.x -= .05;
            bounds.max.x += .05;
            bounds.min.y = -10;
            bounds.max.y = 10;
            const front = gate.line.worldToLocal(frontWorld.clone());
            const start = previous ? gate.line.worldToLocal(previous.clone()) : null;
            let touches = bounds.containsPoint(front);
            if (!touches && start) {
                const direction = front.clone().sub(start), length = direction.length();
                if (length > 1e-6) {
                    const hit = new THREE.Ray(start, direction.normalize()).intersectBox(bounds, new THREE.Vector3());
                    touches = hit !== null && start.distanceTo(hit) <= length;
                }
            }
            return { front, start, gateX, touches };
        };

        if (!this.active) {
            for (const gate of gates) {
                if (gate.vehicleClass !== EXAM_VEHICLE_CLASS) continue;
                const s = sample(gate);
                // The bay is on local -X; local +X leads back to the main road.
                if (s.touches && (!s.start || (s.front.x < s.start.x && s.start.x >= s.gateX))) {
                    this.active = gate;
                    this.startedAt = now;
                    this.reachedInside = s.front.x < s.gateX - .05;
                    break;
                }
            }
            return [];
        }

        const s = sample(this.active);
        const penalties: PenaltyEvent[] = [];
        if (!this.penalized && now - this.startedAt > 120_000) {
            this.penalized = true;
            penalties.push({ at: now, points: 5, reason: 'Bài 7: Quá 02 phút ghép xe dọc vào nơi đỗ' });
        }
        if (this.reachedInside && s.touches && s.start
            && s.front.x > s.start.x && s.front.x >= s.gateX - .05) {
            this.completed = true;
        }
        if (s.front.x < s.gateX - .05) this.reachedInside = true;
        return penalties;
    }
}
