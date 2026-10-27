import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** Calibrated body placement; independent of the wheel-less body's bounding box. */
export const VIOS_BODY_RIDE_LIFT_M = .07782500237226532;

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
    private parts?: ReturnType<Vehicle3WheelAssembly['createWheelParts']>;
    public readonly frontPivots: THREE.Group[] = [];
    /**
     * Mapping from wheel id to its steering-pivot Object3D, so callers can read
     * world-space wheel positions via `pivot.getWorldPosition(tmp)`. Keys are
     * 'FL', 'FR', 'RL', 'RR' (front/rear × left/right from the driver's
     * perspective). For Vietnamese VIOS cars (left-hand drive), the passenger
     * side is on the RIGHT (+X in root-local frame after the body Y-flip).
     */
    private readonly _pivots: { FL: THREE.Object3D; FR: THREE.Object3D; RL: THREE.Object3D; RR: THREE.Object3D } = {
        FL: undefined as unknown as THREE.Object3D,
        FR: undefined as unknown as THREE.Object3D,
        RL: undefined as unknown as THREE.Object3D,
        RR: undefined as unknown as THREE.Object3D,
    };

    private readonly tireRadius: number;
    /**
     * Track width measured independently on each side because the source GLB is
     * not centred on its own origin. The visible tyre centres in root-local
     * coordinates are X = -0.901 and +0.585 m.
     */
    private readonly leftX: number;
    private readonly rightX: number;
    private readonly frontAxleZ: number;
    private readonly rearAxleZ: number;

    constructor(tireRadius = .297, leftX = -.901, rightX = .585,
        frontAxleZ = -1.1985, rearAxleZ = 1.359) {
        this.tireRadius = tireRadius;
        this.leftX = leftX;
        this.rightX = rightX;
        this.frontAxleZ = frontAxleZ;
        this.rearAxleZ = rearAxleZ;
    }

    /** Track width = rightX − leftX (positive). Used by Ackermann steering. */
    get trackWidth(): number { return this.rightX - this.leftX; }

    /** Rolling pivots (for animation). */
    get rolling(): THREE.Group[] { return this._rolling; }

    /**
     * Build 4 steering + rolling wheel pivots as children of `parent`.
     *
     * Forward (root-local) is -Z, matching the rest of `Vehicle`:
     *   - Front/rear pivots follow the visible GLB wheel centres. The asset's
     *     origin is offset from the midpoint between the two axles.
     *
     * Each side uses its own X offset (leftX / rightX) so the wheels end up
     * inside the actual wheel arches of the off-centre GLB bodywork. Pivot Y is
     * set to `tireRadius` so the bottom of the tyre touches the road plane.
     */
    buildWheels(parent: THREE.Object3D): void {
        for (const id of ['FL', 'FR', 'RL', 'RR'] as const) {
            const isFront = id.startsWith('F');
            const isLeft = id.endsWith('L');

            const z = isFront ? this.frontAxleZ : this.rearAxleZ;
            const x = isLeft ? this.leftX : this.rightX;

            // Pivot at Y = tireRadius so bottom of tyre touches road (Y=0).
            const pivot = new THREE.Group();
            pivot.name = `Vehicle3_${id}_SteeringPivot`;
            pivot.position.set(x, this.tireRadius, z);

            const roll = new THREE.Group();
            roll.name = `Vehicle3_${id}_RollingPivot`;
            pivot.add(roll);

            this.buildTyre(roll, pivot, isLeft ? -1 : 1);
            parent.add(pivot);

            this._rolling.push(roll);
            this._pivots[id] = pivot;
            if (isFront) this.frontPivots.push(pivot);
        }
    }

    /**
     * Return the steering-pivot Object3D for one of the four wheels so callers
     * can read its world-space position with `pivot.getWorldPosition(tmp)`.
     */
    getWheel(id: 'FL' | 'FR' | 'RL' | 'RR'): THREE.Object3D {
        const pivot = this._pivots[id];
        if (!pivot) throw new Error(`Vehicle3WheelAssembly: wheel ${id} not built yet`);
        return pivot;
    }

    private buildTyre(roll: THREE.Group, pivot: THREE.Group, outerSign: number): void {
        this.parts ??= this.createWheelParts();
        const parts = this.parts;
        const add = (parent: THREE.Object3D, name: string, geometry: THREE.BufferGeometry, material: THREE.Material) => {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = name;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        };
        add(roll, 'ProceduralTyre', parts.tyre, parts.rubber);
        // Build the face in XY with +Z pointing outward, then orient it for
        // each side. The rim sits at the outer sidewall, not inside the tyre.
        const face = new THREE.Group();
        face.name = 'ProceduralAlloyFace';
        face.rotation.y = outerSign * Math.PI / 2;
        face.position.x = outerSign * .088 * this.tireRadius / .297;
        roll.add(face);
        add(face, 'SplitFiveSpokeAlloy', parts.alloy, parts.silver);
        add(face, 'RimBarrelAndHubRecesses', parts.darkFace, parts.graphite);
        add(face, 'BrakeRotor', parts.rotor, parts.steel);
        // Caliper follows steering but does not spin with the tyre.
        const caliperFrame = new THREE.Group();
        caliperFrame.rotation.copy(face.rotation);
        caliperFrame.position.copy(face.position);
        pivot.add(caliperFrame);
        add(caliperFrame, 'BrakeCaliper', parts.caliper, parts.steel);
    }

    /** Shared geometry/materials for all four wheels; no wheel GLB is loaded. */
    private createWheelParts() {
        const scale = this.tireRadius / .297;
        const rubber = new THREE.MeshStandardMaterial({ color: 0x232527, roughness: .94 });
        const silver = new THREE.MeshStandardMaterial({ color: 0xc4c9ce, roughness: .3, metalness: .5 });
        const graphite = new THREE.MeshStandardMaterial({ color: 0x20252a, roughness: .5, metalness: .35 });
        const steel = new THREE.MeshStandardMaterial({ color: 0x62676a, roughness: .65, metalness: .5 });
        const join = (geometries: THREE.BufferGeometry[]) => {
            const nonIndexed = geometries.map(g => g.index ? g.toNonIndexed() : g);
            const result = mergeGeometries(nonIndexed)!;
            for (const geometry of new Set([...geometries, ...nonIndexed])) geometry.dispose();
            result.scale(scale, scale, scale);
            result.computeBoundingBox(); result.computeBoundingSphere();
            return result;
        };
        const cylinder = (radius: number, depth: number, z: number, segments = 48) => {
            const geometry = new THREE.CylinderGeometry(radius, radius, depth, segments);
            geometry.rotateX(Math.PI / 2); geometry.translate(0, 0, z);
            return geometry;
        };
        const ring = (radius: number, tube: number, z: number) => {
            const geometry = new THREE.TorusGeometry(radius, tube, 6, 48);
            geometry.translate(0, 0, z); return geometry;
        };
        // Closed annular tyre profile: rounded shoulders, an open rim centre
        // and four real circumferential grooves across the tread.
        const profile = [
            [.19, -.078], [.212, -.098], [.254, -.102], [.278, -.094],
            [.291, -.076], [.297, -.06], [.297, -.044], [.292, -.041],
            [.292, -.035], [.297, -.032], [.297, -.014], [.292, -.011],
            [.292, -.005], [.297, -.002], [.297, .014], [.292, .017],
            [.292, .023], [.297, .026], [.297, .044], [.292, .047],
            [.292, .053], [.297, .056], [.297, .06], [.291, .076],
            [.278, .094], [.254, .102], [.212, .098], [.19, .078],
            [.185, .078], [.185, -.078], [.19, -.078],
        ].map(([r, x]) => new THREE.Vector2(r, x));
        const tyreSurface = new THREE.LatheGeometry(profile, 64);
        tyreSurface.rotateZ(Math.PI / 2);
        const tyreParts: THREE.BufferGeometry[] = [tyreSurface];
        for (const side of [-1, 1]) {
            const bead = new THREE.TorusGeometry(.254, .0018, 4, 48);
            bead.rotateY(Math.PI / 2); bead.translate(side * .102, 0, 0);
            tyreParts.push(bead);
        }
        const alloyParts: THREE.BufferGeometry[] = [ring(.187, .0055, .003), ring(.177, .002, -.004), cylinder(.052, .018, -.003)];
        // Ten tapered, bevelled spokes arranged as five split pairs.
        for (let spoke = 0; spoke < 5; spoke++) {
            const angle = spoke * Math.PI * 2 / 5;
            for (const branch of [-1, 1]) {
                const shape = new THREE.Shape();
                const vertices = [[.047, angle - .14], [.10, angle + branch * .04 - .075],
                    [.183, angle + branch * .11 - .06], [.183, angle + branch * .11 + .06],
                    [.10, angle + branch * .04 + .075], [.047, angle + .14]];
                vertices.forEach(([r, a], i) => {
                    const x = Math.cos(a) * r, y = Math.sin(a) * r;
                    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
                });
                shape.closePath();
                const geometry = new THREE.ExtrudeGeometry(shape, { depth: .012, steps: 1,
                    bevelEnabled: true, bevelSize: .0015, bevelThickness: .0015, bevelSegments: 1, curveSegments: 1 });
                geometry.translate(0, 0, -.012);
                alloyParts.push(geometry);
            }
        }
        const barrel = new THREE.CylinderGeometry(.181, .181, .13, 64, 1, true);
        barrel.rotateX(Math.PI / 2); barrel.translate(0, 0, -.064);
        const darkParts: THREE.BufferGeometry[] = [barrel, cylinder(.026, .004, .009)];
        for (let lug = 0; lug < 4; lug++) {
            const angle = Math.PI / 4 + lug * Math.PI / 2;
            const x = Math.cos(angle) * .038, y = Math.sin(angle) * .038;
            const hole = cylinder(.008, .004, .008, 16); hole.translate(x, y, 0); darkParts.push(hole);
            const bolt = cylinder(.005, .008, .012, 6); bolt.translate(x, y, 0); alloyParts.push(bolt);
        }
        // Small three-ellipse badge on the centre cap, drawn from geometry.
        for (const [xScale, yScale, y] of [[1, .65, 0], [.35, .65, 0], [.85, .24, .004]]) {
            const badge = new THREE.TorusGeometry(.016, .0011, 5, 32);
            badge.scale(xScale, yScale, 1); badge.translate(0, y, .013); alloyParts.push(badge);
        }
        const rotorParts = [cylinder(.147, .009, -.045), ring(.139, .001, -.039), ring(.109, .001, -.039)];
        const caliperGeometry = new THREE.BoxGeometry(.037, .082, .032);
        caliperGeometry.translate(-.126, .008, -.032);
        return { tyre: join(tyreParts), alloy: join(alloyParts), darkFace: join(darkParts),
            rotor: join(rotorParts), caliper: join([caliperGeometry]), rubber, silver, graphite, steel };
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
