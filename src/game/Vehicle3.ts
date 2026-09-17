import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Vehicle } from './Vehicle';
import { Vehicle3WheelAssembly } from './Vehicle3Wheels';
import { SteeringSystem, steeringConfig, advanceVehicle } from './drivetrain/SteeringSystem';
import type { InputManager } from './InputManager';

/**
 * Vehicle3 renders the Toyota Vios G GLB bodywork.
 * The source asset is a Sketchfab-cleaned, material-merged mesh: wheels and turn
 * signals are not separated, so we overlay procedural wheels and inherit all
 * physics/input/steering from Vehicle.
 */
export class Vehicle3 extends Vehicle {
    private wheelAssy!: Vehicle3WheelAssembly;
    // Tyre radius 0.32m matches a 195/55 R15 wheel, consistent with the Vios.
    private readonly tireRadius = .32;
    private lamps: { material: THREE.MeshStandardMaterial; base: THREE.Color; emissive: THREE.Color; left: boolean }[] = [];

    protected override build() {
        // The base constructor creates the common visual/slope frame only.
        this.root.name = 'vehicle3-glb';
    }

    static async create(url = new URL('models/toyota_vios_g.glb', document.baseURI).href) {
        const gltf = await new GLTFLoader().loadAsync(url);
        const vehicle = new Vehicle3();
        vehicle.attachModel(gltf.scene);
        return vehicle;
    }

    /** Public for asset validation and alternative GLTF loading pipelines. */
    attachModel(model: THREE.Group) {
        if (this.wheelAssy) throw new Error('Vehicle3 already has a model');
        // GLB already contains a Sketchfab_model group with rotation X = -π/2
        // baked into the asset, so the bodywork is correctly oriented without
        // any extra rotation here. Verify this assumption by detecting the inner
        // rotation, then leave the top-level rotation at zero when present.
        const inner = model.children.find(c => c.type === 'Object3D' || c.type === 'Group');
        const innerHasXRotation = inner && Math.abs(inner.rotation.x - (-Math.PI / 2)) < 0.01;
        if (!innerHasXRotation) {
            // Fallback for an unbaked asset: apply the same -π/2 X rotation here.
            model.rotation.set(-Math.PI / 2, 0, 0);
        }
        // After the GLB is upright in the visual frame, its longest axis (the
        // length of the Vios) sits along root-local +Z, while the base Vehicle
        // defines -Z_local as "forward". Flip 180° around Y so the grille faces
        // the same direction the car drives (towards the start line).
        model.rotation.y = Math.PI;
        this.visual.add(model);
        // Compute the world-space bounding box of every inner mesh (the GLB has
        // nested group rotations, so the top-level box is not enough) and lift
        // the whole body so the lowest vertex sits on the road plane (Y=0).
        model.updateMatrixWorld(true);
        const bodyBox = new THREE.Box3();
        model.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            object.geometry.computeBoundingBox();
            const localBox = object.geometry.boundingBox!.clone();
            localBox.applyMatrix4(object.matrixWorld);
            bodyBox.union(localBox);
        });
        const rideLift = -bodyBox.min.y;
        model.position.set(0, rideLift, 0);
        this.root.updateWorldMatrix(true, true);

        // Iterate for shadows/casts on every mesh in the bodywork.
        model.traverse(object => {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        // Procedural tyres are placed at the four corners using Vehicle3WheelAssembly.
        // Forward is root-local -Z (same convention as the procedural Vehicle); the
        // GLB body is rotated 180° around Y so its visual +Z (the grille) ends up at
        // root-local -Z and points the way the car drives.
        //
        // The Toyota Vios GLB is not centred on its own root: the left wheel-arch
        // sits ~1.0m to the left and the right arch only ~0.7m to the right, so we
        // pass independent X offsets for each side rather than a centred ±axleWidth/2.
        // Front axle Z = -1.25, rear axle Z = +1.25 (axleDistance = 2.5) match the
        // wheel-arch clusters measured in the GLB. tireRadius = 0.32m matches a
        // 195/55 R15 tyre. The track width (1.7m) keeps the Ackermann steering
        // geometry consistent with the visual wheelbase.
        this.wheelAssy = new Vehicle3WheelAssembly(.32, -1, .7, 2.5);
        this.wheelAssy.buildWheels(this.visual);
        // Expose front pivots to the base Vehicle.update() steering loop.
        this.frontPivots = this.wheelAssy.frontPivots;
        // Light detection: the source GLB has no HeadLight/TailLight separation, so
        // the base class's updateSignalBlink() is a no-op for this variant and we
        // override to keep the same empty behaviour here.
    }

    protected override updateSignalBlink() {
        // Source GLB has no turn-signal meshes; run the parent's logic so the API
        // stays consistent even though no lamps change state.
        const on = performance.now() % 1100 < 550;
        for (const lamp of this.lamps) {
            const active = this.signals.hazard || (lamp.left ? this.signals.left : this.signals.right);
            lamp.material.color.copy(lamp.base);
            lamp.material.emissive.copy(lamp.emissive);
            if (active && on) { lamp.material.color.setHex(0xffc343); lamp.material.emissive.setHex(0x996000); }
        }
    }

    override update(dt: number, input: InputManager) {
        // Skip the base Vehicle.update() wheel rotation loop — Vehicle3 wheels are
        // managed by Vehicle3WheelAssembly and rotated in the line below.
        const left = input.isDown('KeyA') || input.isDown('ArrowLeft');
        const right = input.isDown('KeyD') || input.isDown('ArrowRight');
        const dragging = input.getAnalog('steeringActive') === 1;
        this.steeringSystem.update(dt, Number(right) - Number(left), this.speed,
            dragging ? ((input.getAnalog('steering') ?? .5) * 2 - 1) * steeringConfig.maxSteeringWheelAngle : undefined);
        this.steering = this.steeringSystem.centerSteerAngle;
        this.speed = this.transmission.update(dt, input, this.speed, this.slopeAngle);
        const pose = advanceVehicle(this.root.position.x, this.root.position.z, this.root.rotation.y, this.speed, this.steering, dt);
        this.root.position.x = pose.x; this.root.position.z = pose.z; this.root.rotation.y = pose.heading;
        // Steering: positive centerSteerAngle turns right (per SteeringSystem). The
        // procedural Vehicle applies -(angle) so the visual pivot matches the
        // Ackermann-computed frontLeft/frontRight angles. We do the same here so
        // the GLB-bodied car steers the right way around (not backwards).
        for (const pivot of this.frontPivots) pivot.rotation.y = -(pivot.position.x < 0 ? this.steeringSystem.frontLeftAngle : this.steeringSystem.frontRightAngle);
        this.wheelAssy.updateRolling(this.speed, dt);
        this.updateSignalBlink();
    }

    override reset() {
        super.reset();
        this.wheelAssy.reset();
        this.updateSignalBlink();
    }
}
