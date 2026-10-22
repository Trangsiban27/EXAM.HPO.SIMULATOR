import * as THREE from 'three';

/** Checks one traversal; a later return to the road belongs to another lesson. */
export class Exam06ApproachLane {
    private entered = false;
    private completed = false;
    reset(): void { this.entered = false; this.completed = false; }

    update(road: THREE.Group, widthM: number, lengthM: number,
        position: THREE.Vector3, frontPosition: THREE.Vector3): boolean {
        if (this.completed) return false;
        road.updateWorldMatrix(true, false);
        const local = road.worldToLocal(position.clone());
        const inside = Math.abs(local.x) <= widthM / 2 && Math.abs(local.z) <= lengthM / 2;
        if (this.entered && !inside) { this.completed = true; return false; }
        if (inside) this.entered = true;
        const forward = frontPosition.clone().sub(position).setY(0);
        const frontLength = forward.length();
        if (frontLength < .01) return false;
        forward.normalize();
        const right = new THREE.Vector3(forward.z, 0, -forward.x);
        const toCar = (z: number) => {
            // addRoad numbers lane 1 at local +X and lane 2 at local -X.
            const delta = road.localToWorld(new THREE.Vector3(-widthM / 4, 0, z)).sub(position);
            return new THREE.Vector3(delta.dot(right), 0, delta.dot(forward));
        };
        const start = toCar(-lengthM / 2), end = toCar(lengthM / 2);
        const direction = end.clone().sub(start), distance = direction.length();
        const footprint = new THREE.Box3(
            new THREE.Vector3(-.95, -1, -2.1), new THREE.Vector3(.95, 1, frontLength));
        if (footprint.containsPoint(start)) return true;
        const hit = new THREE.Ray(start, direction.normalize()).intersectBox(footprint, new THREE.Vector3());
        return hit !== null && start.distanceTo(hit) <= distance;
    }
}
