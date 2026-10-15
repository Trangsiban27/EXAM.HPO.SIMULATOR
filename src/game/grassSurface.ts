import * as THREE from 'three';

const GRASS_TILE_SIZE_M = 8;
let grassCanvas: HTMLCanvasElement | undefined;

type GrassPlane = { widthM: number; heightM: number; centerX: number; centerZ: number };

/** Subtle, short grass blades for the ground near the course and its islands. */
export function createGrassSurfaceTexture(plane?: GrassPlane): THREE.CanvasTexture {
    if (!grassCanvas) {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const context = canvas.getContext('2d')!;
        const image = context.createImageData(size, size);
        let seed = 29041;
        const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0)
            / 4294967296);

        // Small colour changes keep the lawn soft rather than speckled.
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const wave = Math.sin(x * Math.PI * 4 / size
                    + Math.sin(y * Math.PI * 2 / size)) * 3
                    + Math.sin(y * Math.PI * 6 / size
                        + x * Math.PI * 2 / size) * 2;
                const offset = (y * size + x) * 4;
                image.data[offset] = 99 + wave;
                image.data[offset + 1] = 115 + wave * 1.3;
                image.data[offset + 2] = 90 + wave;
                image.data[offset + 3] = 255;
            }
        }
        context.putImageData(image, 0, 0);

        // Sparse line strokes suggest trimmed blades without visible round clusters.
        for (let i = 0; i < 1800; i++) {
            const x = random() * size;
            const y = random() * size;
            const length = 2 + random() * 2.5;
            context.strokeStyle = random() < .58
                ? 'rgba(143, 165, 122, 0.48)'
                : 'rgba(65, 91, 61, 0.37)';
            context.lineWidth = .65 + random() * .4;
            context.beginPath();
            context.moveTo(x, y + length / 2);
            context.lineTo(x + (random() - .5) * 1.5, y - length / 2);
            context.stroke();
        }
        grassCanvas = canvas;
    }

    const texture = new THREE.CanvasTexture(grassCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4;
    if (plane) {
        texture.repeat.set(plane.widthM / GRASS_TILE_SIZE_M,
            plane.heightM / GRASS_TILE_SIZE_M);
        // PlaneGeometry UVs start at its lower-left corner after the X rotation.
        texture.offset.set((plane.centerX - plane.widthM / 2) / GRASS_TILE_SIZE_M,
            (-plane.centerZ - plane.heightM / 2) / GRASS_TILE_SIZE_M);
    } else {
        // ShapeGeometry UVs already contain their world X and -Z coordinates.
        texture.repeat.set(1 / GRASS_TILE_SIZE_M, 1 / GRASS_TILE_SIZE_M);
    }
    return texture;
}
