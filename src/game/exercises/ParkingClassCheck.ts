import * as THREE from 'three';
import type { ParkingClassZone } from '../TrackObjects';
import { EXAM_VEHICLE_CLASS } from '../exam/examRules';

/** Check actual parking spaces, leaving adjacent control/through roads usable. */
export class ParkingClassCheck {
    private previous: THREE.Vector3[] = [];
    private reported = false;
    reset(): void { this.previous = []; this.reported = false; }

    update(zones: readonly ParkingClassZone[], probes: readonly THREE.Vector3[]): boolean {
        if (this.reported) return false;
        const wrong = zones.some(zone => {
            if (zone.vehicleClass === EXAM_VEHICLE_CLASS) return false;
            zone.root.updateWorldMatrix(true, false);
            return probes.some((probe, index) => {
                const point = zone.root.worldToLocal(probe.clone());
                if (zone.bounds.containsPoint(point)) return true;
                const previous = this.previous[index];
                if (!previous) return false;
                const start = zone.root.worldToLocal(previous.clone());
                const delta = point.clone().sub(start), length = delta.length();
                if (length < 1e-6) return false;
                const hit = new THREE.Ray(start, delta.normalize()).intersectBox(zone.bounds, new THREE.Vector3());
                return hit !== null && start.distanceTo(hit) <= length;
            });
        });
        this.previous = probes.map(point => point.clone());
        if (wrong) this.reported = true;
        return wrong;
    }
}
