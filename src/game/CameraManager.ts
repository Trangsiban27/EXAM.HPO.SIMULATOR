import * as THREE from 'three';
import {Vehicle} from './Vehicle';
import {notify} from '../ui/Notify';

const DEV_CAMERA_STORAGE_KEY = 'hpo-dev-camera';
const DIAGONAL_CAMERA_DISTANCE_M = 20;
const DIAGONAL_CAMERA_ELEVATION_DEG = 28;
const CABIN_FOV_DEG = 58;
const CABIN_EYE = new THREE.Vector3(-.48, 1.32, .08);
const CABIN_LOOK = new THREE.Vector3(-.48, 1.12, -25);

type SavedDevCamera = {
    position: [number, number, number];
    yaw: number;
    pitch: number;
};

export class CameraManager {
    mode = 0;
    readonly camera = new THREE.PerspectiveCamera(60, 1, .1, 200);
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
            this.restoreFreeCamera();
            document.addEventListener('mousedown', this.onMouseDown);
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('keydown', this.onKeyDown);
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

    private onKeyDown = (e: KeyboardEvent): void => {
        if (e.code !== 'KeyK') return;
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }

        e.preventDefault();
        if (e.shiftKey) {
            localStorage.removeItem(DEV_CAMERA_STORAGE_KEY);
            notify.show('Đã xoá vị trí camera đã lưu', {kind: 'info', durationMs: 1400});
            return;
        }

        const saved: SavedDevCamera = {
            position: [this.freePosition.x, this.freePosition.y, this.freePosition.z],
            yaw: this.freeYaw,
            pitch: this.freePitch,
        };
        localStorage.setItem(DEV_CAMERA_STORAGE_KEY, JSON.stringify(saved));
        notify.show(
            `Đã lưu camera: x ${saved.position[0].toFixed(2)} · y ${saved.position[1].toFixed(2)} · z ${saved.position[2].toFixed(2)}`,
            {kind: 'success', durationMs: 2200}
        );
    };

    private restoreFreeCamera(): void {
        const raw = localStorage.getItem(DEV_CAMERA_STORAGE_KEY);
        if (!raw) return;

        try {
            const saved = JSON.parse(raw) as Partial<SavedDevCamera>;
            if (!saved.position) return;
            const [x, y, z] = saved.position;
            if (![x, y, z, saved.yaw, saved.pitch].every(Number.isFinite)) return;
            this.freePosition.set(x, y, z);
            this.freeYaw = saved.yaw!;
            this.freePitch = saved.pitch!;
        } catch {
            localStorage.removeItem(DEV_CAMERA_STORAGE_KEY);
        }
    }

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
        const fov = this.mode === 0 ? 34 : this.mode === 2 ? CABIN_FOV_DEG : 60;
        if (this.camera.fov !== fov) {
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
        }
        if (this.mode === 0) {
            look.y += .7;
            if (modeChanged) this.followFocus.copy(look);
            else this.followFocus.lerp(look, 1 - Math.exp(-5 * dt));
            // Fixed world-space angle: turning the car does not rotate the view.
            // View the left side (-X at spawn), with a shallow downward angle.
            const portraitExtra = Math.max(0, (16 / 9) / this.camera.aspect - 1) * 5;
            this.followOffset.setFromSphericalCoords(
                DIAGONAL_CAMERA_DISTANCE_M + portraitExtra,
                THREE.MathUtils.degToRad(90 - DIAGONAL_CAMERA_ELEVATION_DEG),
                -Math.PI * .5,
            );
            look.copy(this.followFocus);
            target.copy(look).add(this.followOffset);
        } else if (this.mode === 2) {
            root.updateWorldMatrix(true, true);
            const visual = root.children.find(child => child.type === 'Group');
            const frame = visual ?? root;
            target.copy(frame.localToWorld(CABIN_EYE.clone()));
            look.copy(frame.localToWorld(CABIN_LOOK.clone()));
        } else {
            target.copy(root.position)
                .add(new THREE.Vector3(0, 16, 3));
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
            window.removeEventListener('keydown', this.onKeyDown);
        }
    }
}
