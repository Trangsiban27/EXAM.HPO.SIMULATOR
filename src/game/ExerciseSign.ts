import * as THREE from 'three';

export interface ExerciseSignOptions {
    title: string;
    subtitle?: string;
    x: number;
    z: number;
    rotation?: number;
    width?: number;
}

/** Reusable exercise name board. Separate title lines with a newline. */
export class ExerciseSign {
    readonly root = new THREE.Group();

    constructor({ title, subtitle, x, z, rotation = 0, width = 5 }: ExerciseSignOptions) {
        this.root.name = 'exercise-sign';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = rotation;
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 384;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#1453a0';
        ctx.fillRect(0, 0, 1024, 384);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, 1004, 364);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = title.split('\n');
        const titleHeight = subtitle ? 220 : 300;
        ctx.font = `bold ${Math.min(66, titleHeight / lines.length * .75)}px Arial`;
        lines.forEach((line, i) => ctx.fillText(line, 512,
            40 + titleHeight * (i + .5) / lines.length, 960));
        if (subtitle) {
            ctx.font = '40px Arial';
            ctx.fillText(subtitle, 512, 310, 960);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const board = new THREE.Mesh(new THREE.PlaneGeometry(width, width * 384 / 1024),
            new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide }));
        board.position.y = 2.5;
        const post = new THREE.Mesh(new THREE.BoxGeometry(.12, 2.5, .12),
            new THREE.MeshStandardMaterial({ color: 0xc7d0d5, metalness: .6, roughness: .4 }));
        post.position.y = 1.25;
        post.castShadow = true;
        this.root.add(board, post);
    }
}
