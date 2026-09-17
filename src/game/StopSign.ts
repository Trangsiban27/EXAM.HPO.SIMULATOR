import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** Cache for the stop sign GLB — loaded once, cloned for each placement. */
let _cache: THREE.Group | null = null;
let _loader = new GLTFLoader();

export interface StopSignOptions {
    x: number;
    z: number;
    roadWidth?: number;
    /**
     * Scale applied to the GLB model. Ignored when the canvas fallback is used.
     * Default: 0.8
     */
    scale?: number;
}

/**
 * Biển "Dừng lại" (STOP sign) — sử dụng model GLB
 * /models/stop_sign_road_sign.glb trong thư mục public/.
 * Load sync bằng cache, clone cho mỗi placement.
 * Fallback canvas nếu GLB chưa load hoặc load thất bại.
 */
export class StopSign {
    readonly root = new THREE.Group();

    constructor({ x, z, roadWidth = 8, scale = .012 }: StopSignOptions) {
        this.root.name = 'EX02_SIGN_STOP';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = -Math.PI / 2;

        const postX = roadWidth / 2 + 1.5;

        if (_cache) {
            // Clone cached GLB mesh. GLB already contains post + sign + base, so we
            // do NOT add an extra procedural post here (would cause double post).
            const signRoot = _cache.clone(true);
            signRoot.scale.setScalar(scale);
            signRoot.position.set(postX, 0, 0);
            // Enable shadows on every mesh inside the cloned GLB scene.
            signRoot.traverse(obj => {
                if ((obj as THREE.Mesh).isMesh) {
                    const m = obj as THREE.Mesh;
                    m.castShadow = true;
                    m.receiveShadow = true;
                }
            });
            this.root.add(signRoot);
        } else {
            // Fallback canvas sign (sync) — GLB sẽ được cache sau khi load xong.
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#cc0000';
            ctx.fillRect(0, 0, 512, 512);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 28;
            ctx.strokeRect(20, 20, 472, 472);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 220px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('STOP', 256, 256);
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            const signMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(1.2, 1.2),
                new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
            );
            signMesh.scale.setScalar(scale);
            signMesh.position.set(postX, 2.5 * scale, 0);
            signMesh.castShadow = true;
            this.root.add(signMesh);

            // Procedural post only for canvas fallback — height proportional to scale.
            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(.06, .06, 2.5 * scale, 12),
                new THREE.MeshStandardMaterial({ color: 0xc7d0d5, metalness: .6, roughness: .4 })
            );
            post.position.set(postX, (2.5 * scale) / 2, 0);
            post.castShadow = true;
            this.root.add(post);
        }
    }

    /**
     * Pre-load the stop sign GLB into cache (call once at scene init).
     * Returns a promise that resolves when the model is ready.
     */
    static async preload(): Promise<void> {
        if (_cache) return;
        try {
            const gltf = await _loader.loadAsync('/models/stop_sign_road_sign.glb');
            _cache = gltf.scene;
        } catch {
            // Silently fail — constructor will use canvas fallback.
        }
    }
}

