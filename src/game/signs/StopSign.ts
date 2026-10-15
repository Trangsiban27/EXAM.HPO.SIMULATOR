import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

/** Cache for the stop sign GLB — loaded once, cloned for each placement. */
let _cache: THREE.Group | null = null;
let _loader = new GLTFLoader();

export interface StopSignOptions {
    x: number;
    z: number;
    roadWidth?: number;
    /** Distance from the road edge to the sign post. */
    shoulderOffsetM?: number;
    /** Extra height for the sign face; the striped post grows with it. */
    heightOffsetM?: number;
    /**
     * Scale applied to the GLB model. Ignored when the canvas fallback is used.
     * Default: 0.012
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

    constructor({ x, z, roadWidth = 8, shoulderOffsetM = 1.5, heightOffsetM = 0, scale = .012 }: StopSignOptions) {
        this.root.name = 'EX02_SIGN_STOP';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = -Math.PI / 2;

        const postX = roadWidth / 2 + shoulderOffsetM;

        if (_cache) {
            const signRoot = _cache.clone(true);
            signRoot.scale.setScalar(scale);
            signRoot.position.set(postX, heightOffsetM, 0);
            // Object_4 is the long metal pole in this GLB. Replace it with
            // coloured bands while keeping the sign face and its fittings.
            const embeddedPost = signRoot.getObjectByName('Object_4');
            if (embeddedPost) embeddedPost.visible = false;
            // Enable shadows on every mesh inside the cloned GLB scene.
            signRoot.traverse(obj => {
                if ((obj as THREE.Mesh).isMesh) {
                    const m = obj as THREE.Mesh;
                    m.castShadow = true;
                    m.receiveShadow = true;
                }
            });
            this.root.add(signRoot);
            // The STOP face is at local Z ≈ .247 and starts at Y ≈ 2.21.
            // End the pole just inside its lower edge and keep it behind the face.
            const post = createStripedSignPost(2.3 + heightOffsetM, .043);
            post.position.set(postX + .101, 0, .18);
            this.root.add(post);
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
            signMesh.position.set(postX, 2.5 + heightOffsetM, 0);
            signMesh.castShadow = true;
            this.root.add(signMesh);

            const post = createStripedSignPost(2 + heightOffsetM, .06);
            post.position.set(postX, 0, -.08);
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
