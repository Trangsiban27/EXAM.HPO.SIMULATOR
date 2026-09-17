import * as THREE from 'three';
import {Vehicle} from './Vehicle';

export class CameraManager {
    mode = 0;
    readonly camera = new THREE.PerspectiveCamera(60, 1, .1, 500);
    private readonly followFocus = new THREE.Vector3();
    private readonly followOffset = new THREE.Vector3();
    private previousMode = -1;

    // Free camera state (develop mode)
    private readonly developMode: boolean;
    private freeYaw = 0;
    private freePitch = Math.PI * .15; // slight downward angle initially
    private freePosition = new THREE.Vector3(0, 10, 20);
    private dragging = false;
    private lastMouseX = 0;
    private lastMouseY = 0;

    constructor(_develop?: boolean) {
        this.developMode = _develop ?? false;

        // Bind mouse event handlers for free camera
        if (this.developMode) {
            document.addEventListener('mousedown', this.onMouseDown);
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
            document.addEventListener('contextmenu', (e) => e.preventDefault());
        }
    }

    private onMouseDown = (e: MouseEvent): void => {
        if (e.button === 2) { // Right mouse button
            this.dragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }
    };

    private onMouseMove = (e: MouseEvent): void => {
        if (!this.dragging) return;
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.freeYaw -= dx * .003;
        this.freePitch -= dy * .003;
        // Clamp pitch to avoid flipping
        this.freePitch = Math.max(-Math.PI * .45, Math.min(Math.PI * .45, this.freePitch));
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    };

    private onMouseUp = (e: MouseEvent): void => {
        if (e.button === 2) {
            this.dragging = false;
        }
    };

    next() {
        // Develop mode dùng free camera, không cycle theo preset.
        if (this.developMode) return;
        // User mode: chuyển 0 (chéo) → 1 (trên cao) → 2 (cabin) → 0.
        this.mode = (this.mode + 1) % 3;
    }

    attach(domElement: HTMLElement) {
        this.resize(domElement.clientWidth, domElement.clientHeight);
    }

    update(vehicle: Vehicle, dt: number, input?: unknown): void {
        const inputMan = input as { isDown: (code: string) => boolean; getAnalog: (name: string) => number };

        // In develop mode, use free camera controls
        if (this.developMode) {
            this.updateFreeCamera(dt, inputMan);
            return;
        }

        // Original vehicle-following camera logic
        const root = vehicle.root;
        let target = new THREE.Vector3(), look = root.position.clone();
        const modeChanged = this.previousMode !== this.mode;
        const fov = this.mode === 0 ? 35 : 60;
        if (this.camera.fov !== fov) {
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
        }
        if (this.mode === 0) {
            look.y += .7;
            if (modeChanged) this.followFocus.copy(look);
            else this.followFocus.lerp(look, 1 - Math.exp(-5 * dt));
            // Fixed world-space angle: turning the car does not rotate the view.
            // View the left side (-X at spawn), 36 degrees above the ground.
            const portraitExtra = Math.max(0, (16 / 9) / this.camera.aspect - 1) * 9;
            this.followOffset.setFromSphericalCoords(42 + portraitExtra, Math.PI * .3, -Math.PI * .5);
            look.copy(this.followFocus);
            target.copy(look).add(this.followOffset);
        } else if (this.mode === 2) {
            root.updateWorldMatrix(true, true);
            const visual = root.children.find(child => child.type === 'Group');
            const frame = visual ?? root;
            target.copy(frame.localToWorld(new THREE.Vector3(-.43, 1.45, -.1)));
            look.copy(frame.localToWorld(new THREE.Vector3(-.43, 1.4, -20)));
        } else {
            target.copy(root.position)
                .add(new THREE.Vector3(0, 18, 2));
            look.copy(root.position);
        }
        if (this.mode === 0 || this.mode === 2 || modeChanged) this.camera.position.copy(target);
        else this.camera.position.lerp(target, 1 - Math.exp(-5 * dt));
        this.camera.position.y += vehicle.transmission.car.jolt * .06;
        this.camera.lookAt(look);
        this.previousMode = this.mode;
    }

    private updateFreeCamera(dt: number, input: { isDown: (code: string) => boolean; getAnalog: (name: string) => number }): void {
        const SPEED = 20;       // m/s
        const VERTICAL_SPEED = 10; // m/s
        const FAST_MULTIPLIER = 3;

        // Get speed multiplier from Shift key
        const shift = input?.isDown?.('ShiftLeft') || input?.isDown?.('ShiftRight');
        const speed = shift ? SPEED * FAST_MULTIPLIER : SPEED;
        const vSpeed = shift ? VERTICAL_SPEED * FAST_MULTIPLIER : VERTICAL_SPEED;

        // Compute camera basis vectors from yaw/pitch
        const cosPitch = Math.cos(this.freePitch);
        const forward = new THREE.Vector3(
            Math.sin(this.freeYaw) * cosPitch,
            -Math.sin(this.freePitch),
            -Math.cos(this.freeYaw) * cosPitch
        ).normalize();
        const right = new THREE.Vector3(Math.cos(this.freeYaw), 0, -Math.sin(this.freeYaw));
        const up = new THREE.Vector3(0, 1, 0);

        // Movement inputs
        if (input?.isDown?.('KeyW') || input?.isDown?.('ArrowUp')) {
            this.freePosition.addScaledVector(forward, speed * dt);
        }
        if (input?.isDown?.('KeyS') || input?.isDown?.('ArrowDown')) {
            this.freePosition.addScaledVector(forward, -speed * dt);
        }
        if (input?.isDown?.('KeyA') || input?.isDown?.('ArrowLeft')) {
            this.freePosition.addScaledVector(right, -speed * dt);
        }
        if (input?.isDown?.('KeyD') || input?.isDown?.('ArrowRight')) {
            this.freePosition.addScaledVector(right, speed * dt);
        }
        if (input?.isDown?.('KeyQ')) {
            this.freePosition.addScaledVector(up, -vSpeed * dt);
        }
        if (input?.isDown?.('KeyE')) {
            this.freePosition.addScaledVector(up, vSpeed * dt);
        }

        // Update camera
        this.camera.position.copy(this.freePosition);

        // Look target: forward from position
        const lookTarget = this.freePosition.clone().add(forward);
        this.camera.lookAt(lookTarget);

        // Maintain fixed FOV in develop mode
        if (this.camera.fov !== 60) {
            this.camera.fov = 60;
            this.camera.updateProjectionMatrix();
        }
    }

    resize(w: number, h: number) {
        this.camera.aspect = w / Math.max(1, h);
        this.camera.updateProjectionMatrix();
    }

    dispose(): void {
        if (this.developMode) {
            document.removeEventListener('mousedown', this.onMouseDown);
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
    }
}
