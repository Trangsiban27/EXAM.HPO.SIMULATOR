import { GRAPHICS_PRESETS, loadGraphicsQuality, type GraphicsQuality } from './graphicsQuality';
import * as THREE from 'three';
import type { Vehicle } from './Vehicle';
import { CabinInterior } from '../ui/CabinInterior';

export const AUXILIARY_VIEW_FPS = 30;
const AUXILIARY_VIEW_INTERVAL_MS = 1000 / AUXILIARY_VIEW_FPS;

interface CabinViewConfig {
    camera: THREE.PerspectiveCamera;
    eye: THREE.Vector3;
    aim: THREE.Vector3;
    mirror: boolean;
}

/** Live rear views and a driver-side shoulder reference, using the main renderer. */
export class CabinView {
    private quality: GraphicsQuality = loadGraphicsQuality();
    setGraphicsQuality(quality: GraphicsQuality): void {
        this.quality = quality;
        this.lastViewUpdate.fill(-Infinity);
    }
    private interior = new CabinInterior();
    private readonly views: CabinViewConfig[] = [
        { camera: new THREE.PerspectiveCamera(70, 1.6, .05, 500), eye: new THREE.Vector3(-1.32, 1.25, -.45), aim: new THREE.Vector3(-1.45, .15, 1.4), mirror: true },
        { camera: new THREE.PerspectiveCamera(70, 1.6, .05, 500), eye: new THREE.Vector3(1.32, 1.25, -.45), aim: new THREE.Vector3(1.45, .15, 1.4), mirror: true },
        { camera: new THREE.PerspectiveCamera(65, 1.6, .05, 500), eye: new THREE.Vector3(-1.05, 1.45, .1), aim: new THREE.Vector3(-7, .25, .1), mirror: false },
        { camera: new THREE.PerspectiveCamera(65, 1.6, .05, 500), eye: new THREE.Vector3(1.05, 1.45, .1), aim: new THREE.Vector3(7, .25, .1), mirror: false }
    ];
    private overlay = document.createElement('div');
    private frames: HTMLElement[] = [];
    private interiorClip = '';
    private readonly viewTargets = this.views.map(() => new THREE.WebGLRenderTarget(512, 320));
    private readonly lastViewUpdate = this.views.map(() => -Infinity);
    private readonly mirrorScene = new THREE.Scene();
    private readonly mirrorCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    private readonly screenGeometry = new THREE.PlaneGeometry(2, 2);
    private readonly mirrorGeometry = this.screenGeometry.clone();
    private readonly viewScreen: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    private readonly host: HTMLElement;

    constructor(host: HTMLElement) {
        this.host = host;
        const uv = this.mirrorGeometry.getAttribute('uv');
        for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
        this.viewScreen = new THREE.Mesh(this.screenGeometry, new THREE.MeshBasicMaterial({
            map: this.viewTargets[0].texture, depthTest: false, depthWrite: false, toneMapped: false
        }));
        this.viewScreen.position.z = -1;
        this.mirrorScene.add(this.viewScreen);
        this.overlay.className = 'cabin-overlay';
        this.overlay.hidden = true;
        this.overlay.innerHTML = `<div class="mirror-frame mirror-left"><b>GƯƠNG TRÁI</b></div><div class="mirror-frame mirror-right"><b>GƯƠNG PHẢI</b></div><div class="mirror-frame shoulder-view"><b>CANH VAI · GHẾ LÁI</b></div><div class="mirror-frame passenger-view"><b>CỬA SỔ PHẢI · GHẾ PHỤ</b></div>`;
        host.appendChild(this.overlay);
        this.overlay.prepend(this.interior.root);
        this.frames = Array.from(this.overlay.querySelectorAll<HTMLElement>('.mirror-frame'));
    }

    render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera,
        vehicle: Vehicle, cabinActive: boolean, steeringWheelAngle: number) {
        this.overlay.hidden = false;
        this.interior.root.hidden = !cabinActive;
        this.frames[1].hidden = false;
        this.frames[3].hidden = false;
        if (cabinActive) this.interior.update(vehicle, steeringWheelAngle);
        const w = this.host.clientWidth, h = this.host.clientHeight;
        renderer.setViewport(0, 0, w, h);
        const visible = vehicle.root.visible;
        // The SVG supplies the cabin interior. Hide the exterior only for the
        // driver's main view, then restore it so all four auxiliary views see it.
        try {
            if (cabinActive) vehicle.root.visible = false;
            renderer.render(scene, camera);
        } finally {
            vehicle.root.visible = visible;
        }
        vehicle.root.updateWorldMatrix(true, true);
        const frame = vehicle.root.children.find(child => child.type === 'Group') ?? vehicle.root;
        const bounds = this.host.getBoundingClientRect();
        const rectangles = this.frames.map(element => element.getBoundingClientRect());
        if (cabinActive) {
            const overlayBounds = this.overlay.getBoundingClientRect();
            let clip = `M0 0H${overlayBounds.width}V${overlayBounds.height}H0Z`;
            for (const rect of rectangles) {
                const x = rect.left - overlayBounds.left, y = rect.top - overlayBounds.top;
                clip += `M${x} ${y}h${rect.width}v${rect.height}h${-rect.width}Z`;
            }
            if (clip !== this.interiorClip) {
                this.interiorClip = clip;
                this.interior.root.style.clipPath = `path(evenodd, "${clip}")`;
            }
        }
        const autoClear = renderer.autoClear;
        renderer.autoClear = false;
        renderer.setScissorTest(true);
        const now = performance.now();
        const preset = GRAPHICS_PRESETS[this.quality];
        const interval = 1000 / preset.auxiliaryFps;
        for (let i = 0; i < this.views.length; i++) {
            const view = this.views[i], rect = rectangles[i];
            if (this.frames[i].hidden || rect.width <= 0 || rect.height <= 0) {
                this.lastViewUpdate[i] = -Infinity;
                continue;
            }
            const target = this.viewTargets[i];
            // Preserve the existing mirror resolution and the shoulder view's pixel density.
            const targetWidth = view.mirror ? preset.mirrorWidth : Math.max(1, Math.round(rect.width * renderer.getPixelRatio()));
            const targetHeight = view.mirror ? preset.mirrorHeight : Math.max(1, Math.round(rect.height * renderer.getPixelRatio()));
            const resized = target.width !== targetWidth || target.height !== targetHeight;
            if (resized) target.setSize(targetWidth, targetHeight);
            const elapsed = now - this.lastViewUpdate[i];
            if (resized || elapsed >= interval) {
                view.camera.position.copy(frame.localToWorld(view.eye.clone()));
                view.camera.up.set(0, 1, 0).applyQuaternion(frame.getWorldQuaternion(new THREE.Quaternion()));
                view.camera.lookAt(frame.localToWorld(view.aim.clone()));
                view.camera.aspect = rect.width / rect.height;
                view.camera.far = preset.auxiliaryFarM;
                view.camera.updateProjectionMatrix();
                renderer.setScissorTest(false);
                renderer.setRenderTarget(target);
                renderer.clear(true, true, true);
                renderer.render(scene, view.camera);
                renderer.setRenderTarget(null);
                renderer.setScissorTest(true);
                // Retain the cadence when animation frames arrive slightly late; never catch up in a loop.
                this.lastViewUpdate[i] = resized || elapsed >= 2 * interval
                    ? now : now - (elapsed % interval);
            }
            const x = rect.left - bounds.left, y = h - (rect.bottom - bounds.top);
            renderer.setViewport(x, y, rect.width, rect.height);
            renderer.setScissor(x, y, rect.width, rect.height);
            renderer.clear(true, true, true);
            this.viewScreen.geometry = view.mirror ? this.mirrorGeometry : this.screenGeometry;
            this.viewScreen.material.map = target.texture;
            renderer.render(this.mirrorScene, this.mirrorCamera);
        }
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, w, h);
        renderer.autoClear = autoClear;
    }
}
