import * as THREE from 'three';

const LINE_NAME = 'ParkingBayBConnectorDashedLine_2';
const TIRE_RADIUS_M = .30;

type Gate = {
    sensor: THREE.Box3;
    center: THREE.Vector3;
    outwardAxis: THREE.Vector3;
    outwardHalfDepthM: number;
};

/** Keeps the parking speed limit from the second entrance line until all wheels leave it. */
export class ParkingBayBSpeedZone {
    private readonly gates: Gate[];
    private activeGate?: Gate;
    private previousWheels?: THREE.Vector3[];

    constructor(root: THREE.Object3D) {
        root.updateWorldMatrix(true, true);
        const gates: Gate[] = [];
        root.traverse(object => {
            if (object.name !== LINE_NAME) return;
            const bounds = new THREE.Box3().setFromObject(object);
            if (bounds.isEmpty()) return;
            const outwardAxis = new THREE.Vector3(1, 0, 0)
                .applyQuaternion(object.getWorldQuaternion(new THREE.Quaternion())).normalize();
            const size = bounds.getSize(new THREE.Vector3());
            gates.push({
                sensor: bounds.clone().expandByVector(new THREE.Vector3(TIRE_RADIUS_M, 2, TIRE_RADIUS_M)),
                center: bounds.getCenter(new THREE.Vector3()),
                outwardAxis,
                outwardHalfDepthM: (Math.abs(outwardAxis.x) * size.x
                    + Math.abs(outwardAxis.z) * size.z) / 2 + TIRE_RADIUS_M,
            });
        });
        this.gates = gates;
    }

    reset(): void {
        this.activeGate = undefined;
        this.previousWheels = undefined;
    }

    update(wheels: readonly THREE.Vector3[]): boolean {
        if (!this.activeGate) {
            this.activeGate = this.gates.find(gate => wheels.some((wheel, index) =>
                this.touchesLine(gate.sensor, wheel, this.previousWheels?.[index])));
        }

        const gate = this.activeGate;
        if (gate && wheels.every(wheel =>
            wheel.clone().sub(gate.center).dot(gate.outwardAxis) > gate.outwardHalfDepthM)) {
            this.activeGate = undefined;
        }

        this.previousWheels = wheels.map(wheel => wheel.clone());
        return this.activeGate !== undefined;
    }

    private touchesLine(sensor: THREE.Box3, wheel: THREE.Vector3,
        previous?: THREE.Vector3): boolean {
        if (sensor.containsPoint(wheel)) return true;
        if (!previous) return false;
        const movement = wheel.clone().sub(previous);
        const distance = movement.length();
        if (distance < 1e-6) return false;
        const hit = new THREE.Ray(previous, movement.divideScalar(distance))
            .intersectBox(sensor, new THREE.Vector3());
        return hit !== null && hit.distanceToSquared(previous) <= distance * distance + 1e-6;
    }
}
