import * as THREE from 'three';
import { createStripedSignPost } from './StripedSignPost';

/** Biển hướng dẫn "TĂNG SỐ / TĂNG TỐC" ở đầu đoạn tăng tốc 6A. */
export class AccelerationInstructionSign {
    readonly root = new THREE.Group();

    constructor(
        x: number,
        z: number,
        rotationY = Math.PI / 2,
        options: { lines?: readonly string[]; name?: string } = {},
    ) {
        this.root.name = options.name ?? 'SIX_A_ACCELERATION_INSTRUCTION_SIGN';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = rotationY;

        const post = createStripedSignPost(2.75, .045);
        post.name = 'acceleration-sign-post';
        this.root.add(post);

        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Cannot draw road instruction sign');
        ctx.fillStyle = '#0750a1';
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.strokeStyle = '#f4f5f0';
        ctx.lineWidth = 17;
        ctx.strokeRect(28, 28, 968, 968);
        ctx.fillStyle = '#f4f5f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 170px Arial, sans-serif';
        const lines = options.lines ?? ['TĂNG SỐ', 'TĂNG TỐC'];
        if (lines.length < 1 || lines.length > 2) {
            throw new Error('Road instruction sign requires one or two lines');
        }
        lines.forEach((line, index) => {
            ctx.fillText(line, 512, lines.length === 1 ? 512 : index === 0 ? 316 : 690, 820);
        });

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;

        const boardSizeM = .92;
        const boardCenterY = 2.235;
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(boardSizeM + .05, boardSizeM + .05, .05),
            new THREE.MeshStandardMaterial({ color: 0xcbd2d5, metalness: .35, roughness: .55 }),
        );
        frame.name = 'acceleration-sign-frame';
        frame.position.set(0, boardCenterY, .055);
        frame.castShadow = true;
        this.root.add(frame);

        const face = new THREE.Mesh(
            new THREE.PlaneGeometry(boardSizeM, boardSizeM),
            new THREE.MeshBasicMaterial({ map: texture }),
        );
        face.name = 'acceleration-sign-face';
        face.position.set(0, boardCenterY, .083);
        this.root.add(face);
    }
}
