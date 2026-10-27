import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export interface StartCanopyOptions {
    width: number;
    depth: number;
    /** Local Z=0 joins the building; local +Z extends towards the island. */
    position: THREE.Vector3;
    rotationY: number;
}

/** Curved blue metal canopy with pale ribs. Decoration only, two draw calls. */
export function createStartCanopy(options: StartCanopyOptions): THREE.Group {
    const { width, depth } = options;
    const segments = 14;
    const frontHeight = 4.2, backHeight = 4.9, rise = .65, thickness = .065;
    const heightAt = (t: number) => THREE.MathUtils.lerp(backHeight, frontHeight, t)
        + rise * Math.sin(Math.PI * t);

    const profile = new THREE.Shape();
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        if (i === 0) profile.moveTo(depth * t, heightAt(t));
        else profile.lineTo(depth * t, heightAt(t));
    }
    for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        profile.lineTo(depth * t, heightAt(t) - thickness);
    }
    profile.closePath();
    const roofGeometry = new THREE.ExtrudeGeometry(profile, {
        depth: width, bevelEnabled: false, steps: 1, curveSegments: 1,
    });
    roofGeometry.rotateY(-Math.PI / 2);
    roofGeometry.translate(width / 2, 0, 0);
    const roof = new THREE.Mesh(roofGeometry,
        new THREE.MeshStandardMaterial({ color: 0x216c88, roughness: .66, metalness: .18 }));
    roof.name = 'start-canopy-curved-blue-roof';

    const frameParts: THREE.BufferGeometry[] = [];
    const box = (w: number, h: number, d: number, x: number, y: number, z: number) => {
        const part = new THREE.BoxGeometry(w, h, d);
        part.translate(x, y, z);
        frameParts.push(part);
    };
    for (const x of [-width / 2 + .28, width / 2 - .28]) {
        for (const [z, height] of [[.18, backHeight], [depth - .20, heightAt((depth - .20) / depth)]]) {
            box(.14, height - .1, .14, x, (height + .1) / 2, z);
            box(.32, .12, .32, x, .06, z);
        }
    }
    box(width, .14, .14, 0, backHeight - .10, .08);
    box(width, .14, .14, 0, frontHeight - .10, depth - .06);

    // All ribs use the exact same arc as the roof, with a small outward offset.
    const ribCount = Math.max(4, Math.ceil(width / 1.1));
    for (let rib = 0; rib <= ribCount; rib++) {
        const x = THREE.MathUtils.lerp(-width / 2 + .04, width / 2 - .04, rib / ribCount);
        class RibCurve extends THREE.Curve<THREE.Vector3> {
            constructor() { super(); }
            getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
                return target.set(x, heightAt(t) + .035, depth * t);
            }
        }
        frameParts.push(new THREE.TubeGeometry(new RibCurve(), segments, .025, 4, false));
    }
    // Normalise indexing before merging the box and tube geometries.
    const mergedParts = frameParts.map(part => part.index ? part.toNonIndexed() : part);
    const frameGeometry = mergeGeometries(mergedParts, false);
    for (const part of new Set([...frameParts, ...mergedParts])) part.dispose();
    if (!frameGeometry) throw new Error('Unable to merge start canopy frame');
    const frame = new THREE.Mesh(frameGeometry,
        new THREE.MeshStandardMaterial({ color: 0xb9cccd, roughness: .64, metalness: .28 }));
    frame.name = 'start-canopy-posts-and-ribs';

    const group = new THREE.Group();
    group.name = 'start-island-building-canopy';
    group.userData.displayOnly = true;
    group.userData.fadeWhenOccludingVehicle = true;
    group.position.copy(options.position);
    group.rotation.y = options.rotationY;
    for (const mesh of [roof, frame]) {
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.matrixAutoUpdate = false;
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
        group.add(mesh);
    }
    return group;
}
