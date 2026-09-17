import * as THREE from 'three';
import type { Vehicle } from './Vehicle';
import { CabinInterior } from '../ui/CabinInterior';

interface CabinViewConfig {
    camera: THREE.PerspectiveCamera;
    eye: THREE.Vector3;
    aim: THREE.Vector3;
    mirror: boolean;
}

/** Live rear views and a driver-side shoulder reference, using the main renderer. */
export class CabinView {
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
    private readonly mirrorTarget = new THREE.WebGLRenderTarget(512, 320);
    private readonly mirrorScene = new THREE.Scene();
    private readonly mirrorCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    private readonly host: HTMLElement;

    constructor(host: HTMLElement) {
        this.host = host;
        const geometry = new THREE.PlaneGeometry(2, 2);
        const uv = geometry.getAttribute('uv');
        for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
        const screen = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            map: this.mirrorTarget.texture, depthTest: false, depthWrite: false, toneMapped: false
        }));
        screen.position.z = -1;
        this.mirrorScene.add(screen);
        this.overlay.className = 'cabin-overlay';
        this.overlay.hidden = true;
        this.overlay.innerHTML = `<div class="cabin-roof"></div><div class="cabin-pillar"></div><div class="cabin-dashboard"></div><div class="mirror-frame mirror-left"><b>GƯƠNG TRÁI</b></div><div class="mirror-frame mirror-right"><b>GƯƠNG PHẢI</b></div><div class="mirror-frame shoulder-view"><b>CANH VAI · GHẾ LÁI</b></div><div class="mirror-frame passenger-view"><b>CỬA SỔ PHẢI · GHẾ PHỤ</b></div>`;
        host.appendChild(this.overlay);
        this.overlay.querySelectorAll('.cabin-roof,.cabin-pillar,.cabin-dashboard').forEach(el => el.remove());
        this.overlay.prepend(this.interior.root);
        this.frames = Array.from(this.overlay.querySelectorAll<HTMLElement>('.mirror-frame'));
    }

    render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, vehicle: Vehicle, active: boolean) {
        this.overlay.hidden = !active;
        if (active) this.interior.update(vehicle);
        const w = this.host.clientWidth, h = this.host.clientHeight;
        renderer.setViewport(0, 0, w, h);
        if (!active) { renderer.render(scene, camera); return; }
        const visible = vehicle.root.visible;
        vehicle.root.visible = false;
        renderer.render(scene, camera);
        vehicle.root.visible = visible;
        vehicle.root.updateWorldMatrix(true, true);
        const frame = vehicle.root.children.find(child => child.type === 'Group') ?? vehicle.root;
        const bounds = this.host.getBoundingClientRect();
        const rectangles = this.frames.map(element => element.getBoundingClientRect());
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
        const autoClear = renderer.autoClear;
        renderer.autoClear = false;
        renderer.setScissorTest(true);
        for (let i = 0; i < this.views.length; i++) {
            const view = this.views[i], rect = rectangles[i];
            view.camera.position.copy(frame.localToWorld(view.eye.clone()));
            view.camera.up.set(0, 1, 0).applyQuaternion(frame.getWorldQuaternion(new THREE.Quaternion()));
            view.camera.lookAt(frame.localToWorld(view.aim.clone()));
            view.camera.aspect = rect.width / rect.height;
            view.camera.updateProjectionMatrix();
            if (view.mirror) {
                renderer.setScissorTest(false);
                renderer.setRenderTarget(this.mirrorTarget);
                renderer.clear(true, true, true);
                renderer.render(scene, view.camera);
                renderer.setRenderTarget(null);
                renderer.setScissorTest(true);
            }
            const x = rect.left - bounds.left, y = h - (rect.bottom - bounds.top);
            renderer.setViewport(x, y, rect.width, rect.height);
            renderer.setScissor(x, y, rect.width, rect.height);
            renderer.clear(true, true, true);
            renderer.render(view.mirror ? this.mirrorScene : scene, view.mirror ? this.mirrorCamera : view.camera);
        }
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, w, h);
        renderer.autoClear = autoClear;
    }
}
