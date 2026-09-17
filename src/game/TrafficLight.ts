import * as THREE from 'three';

/** Vehicle-triggered signal. Local -Z points toward the intersection. */
export class TrafficLight {
    readonly root = new THREE.Group();
    private elapsed = 0;
    private active = false;
    // The signal is viewed from both camera modes, so its flat lenses must
    // render from either side of the plane.
    private readonly red = new THREE.MeshStandardMaterial({
        color: 0x431013,
        emissive: 0xff1824,
        side: THREE.DoubleSide
    });
    private readonly green = new THREE.MeshStandardMaterial({
        color: 0x103823,
        emissive: 0x16ff68,
        side: THREE.DoubleSide
    });
    private readonly canvas = document.createElement('canvas');
    private readonly texture: THREE.CanvasTexture;
    private display = '';
    private readonly probe = new THREE.Vector3();

    get phase(): 'idle' | 'red' | 'green' {
        return !this.active ? 'idle' : this.elapsed < 30 ? 'red' : 'green';
    }

    get remainingSeconds() {
        return this.active ? Math.ceil((this.phase === 'red' ? 30 : 40) - this.elapsed) : 0;
    }

    constructor(x: number, z: number, private readonly width = 8, direction: 'vertical' | 'horizontal' | number = 'vertical') {
        this.root.name = 'vehicle-triggered-traffic-light';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = typeof direction === 'number' ? direction : direction === 'horizontal' ? -Math.PI / 2 : 0;
        const dark = new THREE.MeshStandardMaterial({ color: 0x20272d, roughness: .6 });
        const metal = new THREE.MeshStandardMaterial({ color: 0x9da8b0, metalness: .6, roughness: .4 });
        const box = (w: number, h: number, d: number, px: number, y: number, pz: number, material: THREE.Material) => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
            mesh.position.set(px, y, pz);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.root.add(mesh);
        };
        // Road arrows place incoming traffic on local -X; keep the post outside that lane.
        const poleX = -width / 2 - .55;
        box(.16, 3.6, .16, poleX, 1.8, 0, metal);
        box(.8, 1.6, .4, poleX, 3.45, 0, dark);
        // The side panel faces inward from the roadside post toward the lane.
        const faces = [
            { offsetX: 0, offsetZ: .211, rotationY: 0, lensRadius: .25, timerSize: [.85, .425] },
            { offsetX: 0, offsetZ: -.211, rotationY: Math.PI, lensRadius: .25, timerSize: [.85, .425] },
            { offsetX: .411, offsetZ: 0, rotationY: Math.PI / 2, lensRadius: .18, timerSize: [.4, .2] }
        ] as const;
        for (const face of faces) {
            for (const [y, material] of [[3.8, this.red], [3.12, this.green]] as const) {
                const lens = new THREE.Mesh(new THREE.CircleGeometry(face.lensRadius, 32), material);
                lens.position.set(poleX + face.offsetX, y, face.offsetZ);
                lens.rotation.y = face.rotationY;
                this.root.add(lens);
            }
        }
        box(width / 2 - .4, .012, .2, -width / 4, .09, 0,
            new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: .8 }));

        this.canvas.width = 256; this.canvas.height = 128;
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        for (const face of faces) {
            const timer = new THREE.Mesh(new THREE.PlaneGeometry(face.timerSize[0], face.timerSize[1]),
                new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide }));
            timer.position.set(poleX + face.offsetX, 4.55, face.offsetZ * (face.offsetX === 0 ? 1.04 : 0));
            timer.rotation.y = face.rotationY;
            this.root.add(timer);
        }
        this.refresh();
    }

    update(dt: number, vehiclePosition: THREE.Vector3) {
        if (!this.active) {
            this.root.updateWorldMatrix(true, false);
            this.probe.copy(vehiclePosition);
            this.root.worldToLocal(this.probe);
            // Trigger while approaching the yellow line, before the front bumper reaches it.
            if (this.probe.x >= -this.width / 2 && this.probe.x < 0 && this.probe.z >= 0 && this.probe.z <= 4.5) {
                this.active = true;
                this.elapsed = 0;
            }
        } else {
            this.elapsed = (this.elapsed + Math.max(0, dt)) % 40;
        }
        this.refresh();
    }

    reset() {
        this.active = false;
        this.elapsed = 0;
        this.refresh();
    }

    /** Snap the signal directly to the green phase, skipping the red countdown. */
    goGreenNow() {
        this.active = true;
        // The `phase` getter treats elapsed < 30 as red, so jump past that threshold
        // to immediately expose the green lens. refresh() updates the canvas timer.
        this.elapsed = 30;
        this.refresh();
    }

    private refresh() {
        this.red.emissiveIntensity = this.phase === 'red' ? 2 : 0;
        this.green.emissiveIntensity = this.phase === 'green' ? 2 : 0;
        const display = this.phase === 'idle' ? '--' : String(this.remainingSeconds);
        const key = `${this.phase}:${display}`;
        if (key === this.display) return;
        this.display = key;
        const ctx = this.canvas.getContext('2d')!;
        ctx.fillStyle = '#111820'; ctx.fillRect(0, 0, 256, 128);
        ctx.fillStyle = this.phase === 'red' ? '#ff3542' : this.phase === 'green' ? '#24ff78' : '#85929e';
        ctx.font = 'bold 100px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(display, 128, 68);
        this.texture.needsUpdate = true;
    }
}
