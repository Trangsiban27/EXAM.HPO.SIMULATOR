import * as THREE from 'three';
import { Track } from './Track';
import { DevProbePanel } from '../ui/DevProbePanel';
import { notify } from '../ui/Notify';

/**
 * Dev-only world-space probe.
 *
 * - Only active when `develop === true`.
 * - Press `P` to toggle. While enabled, left-clicking the renderer canvas
 *   raycasts against the track/ground meshes and writes the resulting (x, y, z)
 *   into a corner HUD overlay. A toast confirms each sample.
 *
 * Cursor swaps to `crosshair` while enabled so the user can tell the mode is
 * active. Right-mouse drag remains owned by `CameraManager` — this controller
 * only listens to left-button mousedown (button === 0).
 */
export class ProbeController {
    private readonly raycaster = new THREE.Raycaster();
    private readonly ndc = new THREE.Vector2();
    private enabled = false;
    private readonly cursorDefault: string;

    constructor(
        private readonly camera: THREE.PerspectiveCamera,
        private readonly track: Track,
        private readonly dom: HTMLElement,
        private readonly panel: DevProbePanel,
        private readonly develop: boolean
    ) {
        this.cursorDefault = this.dom.style.cursor || 'default';
        if (!this.develop) return;
        this.dom.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('keydown', this.onKeyDown);
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        if (e.code !== 'KeyP') return;
        // Avoid stealing the key while the user is typing in an input.
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        e.preventDefault();
        this.enabled = !this.enabled;
        this.dom.style.cursor = this.enabled ? 'crosshair' : this.cursorDefault;
        if (!this.enabled) {
            this.panel.hide();
            notify.show('Probe: tắt', { kind: 'info', durationMs: 900 });
        } else {
            notify.show('Probe: bật · click chuột để lấy toạ độ', { kind: 'info', durationMs: 1400 });
        }
    };

    private onMouseDown = (e: MouseEvent): void => {
        if (!this.enabled) return;
        if (e.button !== 0) return; // only left-click
        e.preventDefault();
        this.sampleAt(e.clientX, e.clientY);
    };

    private sampleAt(clientX: number, clientY: number): void {
        const rect = this.dom.getBoundingClientRect();
        this.ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.ndc, this.camera);

        const hits = this.raycaster.intersectObjects(this.track.root.children, true);
        const hit = hits[0];
        if (!hit) {
            notify.show('Probe: không có mặt phẳng', { kind: 'info', durationMs: 1200 });
            return;
        }

        const x = hit.point.x;
        const z = hit.point.z;
        // Y: prefer the surface height used by vehicle.followSurface so the
        // reading is consistent with what the car actually drives on. Bridge
        // ramps return a non-flat y here even though raycast hits the asphalt.
        const y = this.track.getSurfaceHeight(x, z);

        this.panel.show(x, y, z);
        notify.show(`x: ${format(x)} · y: ${format(y)} · z: ${format(z)}`, {
            kind: 'info',
            durationMs: 1500,
        });
    }

    dispose(): void {
        if (!this.develop) return;
        this.dom.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('keydown', this.onKeyDown);
        this.dom.style.cursor = this.cursorDefault;
    }
}

function format(n: number): string {
    return n.toFixed(2);
}
