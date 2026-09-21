import * as THREE from 'three';

export interface StarShapeOptions {
    /** Outer radius of each star point (distance from centre to tip). */
    size?: number;
    /** Fill / diffuse colour for the star. Accepts hex number, hex string, or CSS colour string. */
    color?: THREE.ColorRepresentation;
    /** Rotation around the world Y axis in radians. */
    rotationY?: number;
    /** World X position of the star's centre. */
    x: number;
    /** World Z position of the star's centre. */
    z: number;
}

/** Flat 5-pointed star laid on the ground (lies in the XZ plane). */
export class StarShape {
    readonly root = new THREE.Group();

    constructor({ size = 1, color = 0xffd23f, rotationY = 0, x, z }: StarShapeOptions) {
        this.root.name = 'star-shape';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = rotationY;

        const outer = size;
        // Standard 5-point star uses an inner radius of outer * sin(18°)/sin(54°) ≈ outer * 0.381966.
        const inner = outer * Math.sin(THREE.MathUtils.degToRad(18)) / Math.sin(THREE.MathUtils.degToRad(54));
        const points = 5;

        const shape = new THREE.Shape();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outer : inner;
            const angle = -Math.PI / 2 + i * Math.PI / points;
            const px = r * Math.cos(angle);
            const pz = r * Math.sin(angle);
            if (i === 0) shape.moveTo(px, pz);
            else shape.lineTo(px, pz);
        }
        shape.closePath();

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: size * 0.08,
            bevelEnabled: true,
            bevelThickness: size * 0.02,
            bevelSize: size * 0.02,
            bevelSegments: 2,
        });
        // ExtrudeGeometry extrudes along +Z; rotate so the star lies flat in the XZ plane
        // with its front face pointing up.
        geometry.rotateX(-Math.PI / 2);
        geometry.translate(0, size * 0.08, 0);

        const material = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.6,
            metalness: 0.1,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.root.add(mesh);
    }
}
