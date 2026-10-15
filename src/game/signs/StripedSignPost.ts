import * as THREE from 'three';

const WHITE = new THREE.MeshStandardMaterial({ color: 0xf5f5ef, roughness: .72 });
const RED = new THREE.MeshStandardMaterial({ color: 0xd52d2d, roughness: .72 });
const STRIPE_HEIGHT_M = .4;

/** A roadside sign post with alternating white and red bands from ground level. */
export function createStripedSignPost(
    heightM: number,
    radiusM: number,
    shape: 'round' | 'square' = 'round',
): THREE.Group {
    const post = new THREE.Group();
    post.name = 'striped-sign-post';
    for (let bottom = 0, band = 0; bottom < heightM; bottom += STRIPE_HEIGHT_M, band++) {
        const height = Math.min(STRIPE_HEIGHT_M, heightM - bottom);
        const geometry = shape === 'square'
            ? new THREE.BoxGeometry(radiusM * 2, height, radiusM * 2)
            : new THREE.CylinderGeometry(radiusM, radiusM, height, 12);
        const segment = new THREE.Mesh(geometry, band % 2 === 0 ? WHITE : RED);
        segment.position.y = bottom + height / 2;
        segment.castShadow = true;
        segment.receiveShadow = true;
        post.add(segment);
    }
    return post;
}
