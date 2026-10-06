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
    /** Exposed so DrivingGame can read wheel world positions for Exam04 sensors. */
    get wheelAssembly(): Vehicle3WheelAssembly { return this.wheelAssy; }
    private rearTurnLamps: { material: THREE.MeshStandardMaterial; left: boolean }[] = [];
    private rearBrakeLamps: THREE.MeshStandardMaterial[] = [];

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
        this.addRearLights(model);
        // Procedural tyres are placed at the four corners using Vehicle3WheelAssembly.
        // Forward is root-local -Z (same convention as the procedural Vehicle); the
        // GLB body is rotated 180° around Y so its visual +Z (the grille) ends up at
        // root-local -Z and points the way the car drives.
        //
        // Các tâm bánh đo từ vòng lốp trong GLB (sau khi xoay thân xe):
        // X trái/phải = -0.901 / +0.585, Z trước/sau = -1.1985 / +1.359.
        // Bán kính lốp nhìn thấy ≈ 0.297 m, bề ngang ≈ 0.20 m.
        this.wheelAssy = new Vehicle3WheelAssembly();
        this.wheelAssy.buildWheels(this.visual);
        // Expose front pivots to the base Vehicle.update() steering loop.
        this.frontPivots = this.wheelAssy.frontPivots;
    }

    private addRearLights(model: THREE.Group) {
        // The GLB's body is offset 0.158 m from the driving frame. These are the
        // left/right outer portions of its rear lamp clusters in vehicle-local X.
        // Raycast from behind so the small lenses sit on the actual body surface.
        this.visual.updateWorldMatrix(true, true);
        const raycaster = new THREE.Raycaster();
        const lensGeometry = new THREE.SphereGeometry(1, 20, 12);
        const addLens = (x: number, y: number, material: THREE.MeshStandardMaterial,
            name: string, width: number, height: number) => {
            const origin = this.visual.localToWorld(new THREE.Vector3(x, y, 2.8));
            const direction = new THREE.Vector3(0, 0, -1).transformDirection(this.visual.matrixWorld);
            raycaster.set(origin, direction);
            const rearSurface = raycaster.intersectObject(model, true)[0];
            const z = rearSurface
                ? this.visual.worldToLocal(rearSurface.point.clone()).z + 0.014
                : 2.20;
            const lens = new THREE.Mesh(lensGeometry, material);
            lens.name = name;
            lens.position.set(x, y, z);
            lens.scale.set(width, height, 0.018);
            this.visual.add(lens);
        };
        for (const { x, left } of [{ x: -0.80, left: true }, { x: 0.48, left: false }]) {
            const material = new THREE.MeshStandardMaterial({
                color: 0x744014,
                emissive: 0x000000,
                roughness: 0.32,
                metalness: 0.08,
            });
            addLens(x, 0.91, material,
                left ? 'RearTurnSignalLeft' : 'RearTurnSignalRight', 0.12, 0.055);
            this.rearTurnLamps.push({ material, left });
        }
        // A separate red lens sits toward the centre of each tail-light cluster,
        // so braking and an amber turn signal can be visible at the same time.
        for (const { x, left } of [{ x: -0.57, left: true }, { x: 0.25, left: false }]) {
            const material = new THREE.MeshStandardMaterial({
                color: 0x6a1018,
                emissive: 0x000000,
                roughness: 0.3,
            });
            addLens(x, 0.91, material,
                left ? 'RearBrakeLightLeft' : 'RearBrakeLightRight', 0.17, 0.07);
            this.rearBrakeLamps.push(material);
        }
    }

    private updateBrakeLights(braking: boolean) {
        for (const material of this.rearBrakeLamps) {
            material.color.setHex(braking ? 0xff2430 : 0x6a1018);
            material.emissive.setHex(braking ? 0xff1018 : 0x000000);
            material.emissiveIntensity = braking ? 2 : 0;
        }
    }

    protected override updateSignalBlink() {
        const on = performance.now() % 1100 < 550;
        for (const lamp of this.rearTurnLamps) {
            const active = this.signals.hazard || (lamp.left ? this.signals.left : this.signals.right);
            lamp.material.color.setHex(active && on ? 0xffc343 : 0x744014);
            lamp.material.emissive.setHex(active && on ? 0xffa000 : 0x000000);
            lamp.material.emissiveIntensity = active && on ? 1.8 : 0;
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
        this.updateBrakeLights(this.transmission.pedals.brake > 0.01);
    }

    override updateAutomatic(dt: number, steeringInput: number, speed: number) {
        const braking = speed < this.speed - 0.01;
        this.updateAutomaticMotion(dt, steeringInput, speed);
        this.wheelAssy.updateRolling(this.speed, dt);
        this.updateBrakeLights(braking);
    }

    override reset() {
        super.reset();
        this.wheelAssy.reset();
        this.updateSignalBlink();
        this.updateBrakeLights(false);
    }
}
