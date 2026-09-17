import * as THREE from 'three';

/**
 * Vehicle3WheelAssembly builds and manages the 4 procedural wheels for the Toyota Vios G GLB.
 *
 * Coordinate frame:
 *   - The base `Vehicle` convention is forward = root-local -Z.
 *   - The GLB body is added with `model.rotation.y = π` (180° around Y) so the
 *     visual +Z (grille / front of the Vios) ends up at root-local -Z. This matches
 *     the driving direction without us having to mirror anything else.
 *   - Therefore, on the unscaled `visual` parent we use the same convention as
 *     the procedural Vehicle: front wheels at root-local -Z, rear wheels at +Z.
 *
 * Steering pivots are exposed to the parent's update loop so the front pair
 * rotates around Y in the same way the procedural Vehicle does.
 */
export class Vehicle3WheelAssembly {
    private _rolling: THREE.Group[] = [];
    public readonly frontPivots: THREE.Group[] = [];

    private readonly tireRadius: number;
    /**
     * Track width measured independently on each side because the source GLB is
     * not centred on its own origin: the left wheel-arch sits ~1.0m to the left
     * of root and the right arch only ~0.7m to the right. We expose those two
     * offsets so the wheels can be dropped straight into the arches without
     * nudging the whole body off-centre.
     */
    private readonly leftX: number;
    private readonly rightX: number;
    private readonly axleDistance: number;

    constructor(tireRadius = .32, leftX = -1, rightX = .7, axleDistance = 2.5) {
        this.tireRadius = tireRadius;
        this.leftX = leftX;
        this.rightX = rightX;
        this.axleDistance = axleDistance;
    }

    /** Track width = rightX − leftX (positive). Used by Ackermann steering. */
    get trackWidth(): number { return this.rightX - this.leftX; }

    /** Rolling pivots (for animation). */
    get rolling(): THREE.Group[] { return this._rolling; }

    /**
     * Build 4 steering + rolling wheel pivots as children of `parent`.
     *
     * Forward (root-local) is -Z, matching the rest of `Vehicle`:
     *   - Front wheels (FL, FR) go at z = -axleDistance / 2.
     *   - Rear wheels  (RL, RR) go at z = +axleDistance / 2.
     *
     * Each side uses its own X offset (leftX / rightX) so the wheels end up
     * inside the actual wheel arches of the off-centre GLB bodywork. Pivot Y is
     * set to `tireRadius` so the bottom of the tyre touches the road plane.
     */
    buildWheels(parent: THREE.Object3D): void {
        for (const id of ['FL', 'FR', 'RL', 'RR'] as const) {
            const isFront = id.startsWith('F');
            const isLeft = id.endsWith('L');

            // Forward is -Z (root-local), so front wheels sit at -axleDistance/2.
            const z = isFront ? -this.axleDistance / 2 : this.axleDistance / 2;
            const x = isLeft ? this.leftX : this.rightX;

            // Pivot at Y = tireRadius so bottom of tyre touches road (Y=0).
            const pivot = new THREE.Group();
            pivot.name = `Vehicle3_${id}_SteeringPivot`;
            pivot.position.set(x, this.tireRadius, z);

            const roll = new THREE.Group();
            roll.name = `Vehicle3_${id}_RollingPivot`;
            pivot.add(roll);

            this.buildTyre(roll);
            parent.add(pivot);

            this._rolling.push(roll);
            if (isFront) this.frontPivots.push(pivot);
        }
    }

    private buildTyre(parent: THREE.Object3D): void {
        const rubber = new THREE.MeshStandardMaterial({ color: 0x151719, roughness: .9 });
        const trim  = new THREE.MeshStandardMaterial({ color: 0x101820, roughness: .4 });
        const chrome = new THREE.MeshStandardMaterial({ color: 0xbac5cc, roughness: .24, metalness: .8 });

        // Tyre: cylinder lying on its side (axis along X after rotateZ). Width
        // 0.24m matches a 195-section tyre (about 60% of the GLB-side rim width).
        const tyreWidth = .24;
        const tyreHalfWidth = tyreWidth / 2;
        const wheelGeo = new THREE.CylinderGeometry(this.tireRadius, this.tireRadius, tyreWidth, 32);
        wheelGeo.rotateZ(Math.PI / 2);
        const wheel = new THREE.Mesh(wheelGeo, rubber);
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        parent.add(wheel);

        // Rim disc on the outer face of the tyre. We pass `outerSign` so the rim
        // appears on the camera-facing side of the wheel regardless of which side
        // of the car this wheel sits on (+1 = right side of car, -1 = left side).
        const rimInset = tyreHalfWidth + .006;
        const rimGeo = new THREE.CylinderGeometry(.22, .22, .012, 24);
        rimGeo.rotateZ(Math.PI / 2);
        parent.add(new THREE.Mesh(rimGeo, trim));

        // Rim ring.
        const rim = new THREE.Mesh(new THREE.TorusGeometry(.205, .018, 8, 32), chrome);
        rim.rotation.y = Math.PI / 2;
        parent.add(rim);

        // 8 spokes.
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(.018, .035, .33), chrome);
            spoke.rotation.x = angle;
            parent.add(spoke);
        }

        // Hub.
        const hubGeo = new THREE.CylinderGeometry(.06, .06, .025, 16);
        hubGeo.rotateZ(Math.PI / 2);
        parent.add(new THREE.Mesh(hubGeo, chrome));
    }

    /**
     * Advance the rolling animation. Call every frame.
     * @param speed  m/s  (positive = forward)
     * @param dt     seconds
     */
    updateRolling(speed: number, dt: number): void {
        const rollAmount = -speed / this.tireRadius * dt;
        for (const roll of this._rolling) {
            roll.rotation.x += rollAmount;
        }
    }

    /** Reset rolling and steering angles. */
    reset(): void {
        for (const roll of this._rolling) roll.rotation.x = 0;
        for (const pivot of this.frontPivots) pivot.rotation.y = 0;
    }
}
