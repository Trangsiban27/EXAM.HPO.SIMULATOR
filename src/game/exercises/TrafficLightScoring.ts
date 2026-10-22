import * as THREE from 'three';
import { TrafficLight } from '../TrafficLight';
import { Exam05South, type Exam05Input, type Exam05Result } from './Exam05South';

/** Reuse the lesson 5 rules in each light's local incoming direction (-Z). */
export class TrafficLightScoring {
    private wasInTrigger = false;
    private enteredIntersection = false;
    private crossedExit = false;
    private readonly inverse = new THREE.Matrix4();
    private readonly travel = new THREE.Vector3();

    constructor(readonly light: TrafficLight, readonly exercise = new Exam05South()) {
        const geometry = light.scoring;
        if (!geometry) throw new Error(`Missing scoring geometry for ${light.markerId}`);
        light.root.updateWorldMatrix(true, false);
        this.inverse.copy(light.root.matrixWorld).invert();
        geometry.stopBar.updateWorldMatrix(true, true);
        const bounds = new THREE.Box3().setFromObject(geometry.stopBar)
            .applyMatrix4(this.inverse);
        this.travel.set(0, 0, -1).transformDirection(light.root.matrixWorld);
        const localLight = {
            root: new THREE.Group(), stopLineX: light.stopLineX, stopLineZ: light.stopLineZ,
            get phase() { return light.phase; },
        };
        exercise.attach({
            light: localLight,
            roadZ: light.stopLineX,
            roadWidth: light.stopLineLength,
            stopBar: { minX: bounds.min.x, maxX: bounds.max.x, nearZ: bounds.max.z },
            completionCheck: () => this.crossedExit,
        });
    }

    reset(): void {
        this.wasInTrigger = false;
        this.enteredIntersection = false;
        this.crossedExit = false;
        this.exercise.reset();
    }

    update(input: Exam05Input): Exam05Result | undefined {
        if (this.light.alwaysGreen) return;
        this.light.root.updateWorldMatrix(true, false);
        this.inverse.copy(this.light.root.matrixWorld).invert();
        const position = input.position.clone().applyMatrix4(this.inverse);
        const frontPosition = input.frontPosition.clone().applyMatrix4(this.inverse);
        const inTrigger = this.light.isVehicleInTriggerZone(input.position)
            && frontPosition.z < position.z;
        if (inTrigger && !this.wasInTrigger
            && (this.exercise.state === 'INACTIVE' || this.exercise.state === 'COMPLETED')) {
            this.exercise.reset();
            this.exercise.activate();
            this.enteredIntersection = false;
            this.crossedExit = false;
        }
        this.wasInTrigger = inTrigger;
        if (this.exercise.state === 'INACTIVE' || this.exercise.state === 'COMPLETED'
            || this.exercise.state === 'DISQUALIFIED') return;

        const p = input.frontPosition;
        const b = this.light.scoring!.exitBounds;
        if (p.x >= b.minX && p.x <= b.maxX && p.z >= b.minZ && p.z <= b.maxZ) {
            this.enteredIntersection = true;
        }
        if (this.enteredIntersection) {
            // Crossing either side also completes a turn; backing out through the entry does not.
            this.crossedExit = Math.abs(this.travel.x) > Math.abs(this.travel.z)
                ? p.z < b.minZ || p.z > b.maxZ || (this.travel.x < 0 ? p.x <= b.minX : p.x >= b.maxX)
                : p.x < b.minX || p.x > b.maxX || (this.travel.z < 0 ? p.z <= b.minZ : p.z >= b.maxZ);
        }
        return this.exercise.update({ ...input, position, frontPosition });
    }
}
