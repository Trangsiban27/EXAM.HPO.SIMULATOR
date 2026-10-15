import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

const modelFile = 'P.127_Tốc độ tối đa cho phép - 20.glb';
let speedLimit20Model: THREE.Group | undefined;

/** Biển P.127 tốc độ 20 cùng bảng kết thúc giảm số, tốc độ. */
export class SpeedLimit20EndAccelerationSign {
    readonly root = new THREE.Group();

    static async preload(): Promise<void> {
        const url = new URL(`bienbao/${encodeURIComponent(modelFile)}`, document.baseURI);
        speedLimit20Model = (await new GLTFLoader().loadAsync(url.href)).scene;
    }

    constructor(x: number, z: number, rotationY = Math.PI / 2) {
        if (!speedLimit20Model) throw new Error('Preload the P.127 speed limit 20 sign first.');

        this.root.name = 'EIGHT_A_POSITION_3_SPEED_LIMIT_20_SIGN';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = rotationY;

        const post = createStripedSignPost(3.12, .043);
        post.name = 'position-3-speed-limit-post';
        this.root.add(post);

        const circle = speedLimit20Model.clone(true);
        circle.name = 'P127_SPEED_LIMIT_20';
        circle.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(circle);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const circleWidthM = .94;
        const scale = circleWidthM / size.x;
        circle.scale.setScalar(scale);
        circle.position.set(-center.x * scale, 2.6 - center.y * scale, .075 - center.z * scale);
        circle.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        this.root.add(circle);

        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Cannot draw the end-of-acceleration sign');
        ctx.fillStyle = '#0750a1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#f4f5f0';
        ctx.lineWidth = 15;
        ctx.strokeRect(22, 22, 980, 468);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 158px Arial, sans-serif';
        ctx.fillText('KẾT THÚC', 512, 152, 920);
        ctx.font = 'bold 137px Arial, sans-serif';
        ctx.fillText('GIẢM SỐ, TỐC ĐỘ', 512, 350, 950);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;

        const panelWidthM = .92;
        const panelHeightM = .416;
        const panelCenterY = 1.852;
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(panelWidthM + .04, panelHeightM + .04, .05),
            new THREE.MeshStandardMaterial({ color: 0xcbd2d5, metalness: .35, roughness: .55 }),
        );
        frame.name = 'position-3-end-acceleration-frame';
        frame.position.set(0, panelCenterY, .055);
        frame.castShadow = true;
        this.root.add(frame);

        const face = new THREE.Mesh(
            new THREE.PlaneGeometry(panelWidthM, panelHeightM),
            new THREE.MeshBasicMaterial({ map: texture }),
        );
        face.name = 'position-3-end-acceleration-face';
        face.position.set(0, panelCenterY, .083);
        this.root.add(face);
    }
}
