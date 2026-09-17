import * as THREE from 'three';

export interface PedestrianSignOptions {
    x: number;
    z: number;
    roadWidth?: number;
}

/**
 * Biển "Đường người đi bộ cắt ngang" — tam giác vàng với hình người đi bộ.
 * Đặt bên trái đường (-X side) của corridor dọc trục X.
 */
export class PedestrianSign {
    readonly root = new THREE.Group();

    constructor({ x, z, roadWidth = 8 }: PedestrianSignOptions) {
        this.root.name = 'EX02_SIGN_PEDESTRIAN';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = Math.PI / 2; // tam giác hướng vào làn xe

        const postX = -(roadWidth / 2 + 1.5);

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;

        // Tam giác vàng nền.
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 20;
        ctx.strokeRect(20, 20, 472, 472);

        // Hình người đi bộ đơn giản.
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 180px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚶', 256, 256);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const signMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.2, 1.2),
            new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
        );
        signMesh.position.set(postX, 2.5, 0);
        signMesh.castShadow = true;
        this.root.add(signMesh);

        const post = new THREE.Mesh(
            new THREE.CylinderGeometry(.06, .06, 2.5, 12),
            new THREE.MeshStandardMaterial({ color: 0xc7d0d5, metalness: .6, roughness: .4 })
        );
        post.position.set(postX, 1.25, 0);
        post.castShadow = true;
        this.root.add(post);
    }
}
