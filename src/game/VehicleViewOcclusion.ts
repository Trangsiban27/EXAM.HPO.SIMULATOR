import * as THREE from 'three';

const OCCLUDED_OPACITY = .15;

/** Fade tagged decorations for the main view, preserving materials in mirrors. */
export class VehicleViewOcclusion {
    private scene?: THREE.Scene;
    private readonly occluders: THREE.Object3D[] = [];
    private readonly faded: { mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[] = [];
    private readonly fadedMaterials = new WeakMap<THREE.Material, THREE.Material>();
    private readonly raycaster = new THREE.Raycaster();
    private readonly eye = new THREE.Vector3();
    private readonly target = new THREE.Vector3();
    private readonly direction = new THREE.Vector3();
    private readonly bounds = new THREE.Box3();
    private readonly probes = [
        new THREE.Vector3(0, .9, 0),
        new THREE.Vector3(0, .9, -2.2),
        new THREE.Vector3(0, .9, 2.2),
        new THREE.Vector3(-.9, .9, 0),
        new THREE.Vector3(.9, .9, 0),
    ];

    fade(scene: THREE.Scene, camera: THREE.Camera, vehicle: THREE.Object3D): void {
        this.restore();
        if (this.scene !== scene) {
            this.scene = scene;
            this.occluders.length = 0;
            scene.traverse(object => {
                if (object.userData.fadeWhenOccludingVehicle === true) this.occluders.push(object);
            });
        }
        camera.updateWorldMatrix(true, false);
        vehicle.updateWorldMatrix(true, false);
        camera.getWorldPosition(this.eye);
        this.raycaster.layers.mask = camera.layers.mask;
        for (const object of this.occluders) {
            let visible = true;
            for (let parent: THREE.Object3D | null = object; parent; parent = parent.parent) {
                if (!parent.visible) { visible = false; break; }
            }
            if (!visible) continue;
            object.updateWorldMatrix(true, true);
            this.bounds.setFromObject(object);
            for (const probe of this.probes) {
                this.target.copy(probe).applyMatrix4(vehicle.matrixWorld);
                // Clear the roof as soon as the car passes underneath an
                // elevated camera, so the road ahead stays visible as well.
                if (this.eye.y > this.bounds.max.y && this.bounds.containsPoint(this.target)) {
                    this.fadeObject(object);
                    break;
                }
                this.direction.subVectors(this.target, this.eye);
                const distance = this.direction.length();
                if (distance <= .1) continue;
                this.raycaster.set(this.eye, this.direction.divideScalar(distance));
                this.raycaster.near = .05;
                this.raycaster.far = distance - .05;
                if (this.raycaster.intersectObject(object, true).length) {
                    this.fadeObject(object);
                    break;
                }
            }
        }
    }

    private fadeObject(object: THREE.Object3D): void {
        const fadedMaterial = (original: THREE.Material): THREE.Material => {
            let material = this.fadedMaterials.get(original);
            if (!material) {
                material = original.clone();
                material.opacity = original.opacity * OCCLUDED_OPACITY;
                material.transparent = true;
                // The faded roof must not prevent the road/car from drawing.
                material.depthWrite = false;
                material.forceSinglePass = true;
                this.fadedMaterials.set(original, material);
            }
            return material;
        };
        object.traverse(child => {
            if (!(child instanceof THREE.Mesh)) return;
            this.faded.push({ mesh: child, material: child.material });
            child.material = Array.isArray(child.material)
                ? child.material.map(fadedMaterial) : fadedMaterial(child.material);
        });
    }

    restore(): void {
        for (const { mesh, material } of this.faded) mesh.material = material;
        this.faded.length = 0;
    }
}
