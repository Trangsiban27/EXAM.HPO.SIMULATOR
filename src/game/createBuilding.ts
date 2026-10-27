import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type VectorOption = THREE.Vector3 | readonly [number, number, number];

export interface BuildingOptions {
    position?: VectorOption;
    /** Yaw in radians, an XYZ Euler tuple, or a THREE.Euler. Front faces local +Z. */
    rotation?: number | THREE.Euler | readonly [number, number, number];
    scale?: number | VectorOption;
    castShadow?: boolean;
    receiveShadow?: boolean;
    name?: string;
}

interface BuildingResources {
    solid: THREE.BufferGeometry;
    glass: THREE.BufferGeometry;
    paint: THREE.MeshStandardMaterial;
    glazing: THREE.MeshStandardMaterial;
}

let resources: BuildingResources | undefined;

function buildResources(): BuildingResources {
    const solid: THREE.BufferGeometry[] = [];
    const glass: THREE.BufferGeometry[] = [];
    const unitBox = new THREE.BoxGeometry(1, 1, 1);
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const color = new THREE.Color();
    const palette = {
        wall: 0x53bfae, front: 0x8dded0, pillar: 0x199f94,
        trim: 0xb5e9d8, frame: 0xe1e9dc, base: 0x8a9691,
        roof: 0xb84e45, ridge: 0xcd6352, steps: 0xaeb7b2,
    };
    const paint = (geometry: THREE.BufferGeometry, hex: number) => {
        color.setHex(hex);
        const colors = new Float32Array(geometry.getAttribute('position').count * 3);
        for (let i = 0; i < colors.length; i += 3) {
            colors[i] = color.r; colors[i + 1] = color.g; colors[i + 2] = color.b;
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        solid.push(geometry);
    };
    const box = (width: number, height: number, depth: number,
        x: number, y: number, z: number, hex: number, rotationZ = 0, glazing = false) => {
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rotationZ);
        matrix.compose(new THREE.Vector3(x, y, z), quaternion, new THREE.Vector3(width, height, depth));
        const geometry = unitBox.clone().applyMatrix4(matrix);
        if (glazing) glass.push(geometry);
        else paint(geometry, hex);
    };

    // Metres. Origin is ground level at the centre of the main block.
    const width = 24, depth = 12, height = 10.6;
    box(24.8, .28, 12.8, 0, .14, 0, palette.base);
    box(width, height, depth, 0, height / 2 + .28, 0, palette.wall);
    box(24.3, .32, 12.3, 0, .50, 0, palette.pillar);

    // Front panels and floor bands echo the pale facade and darker pilasters.
    const bays = [-9.4, -4.7, 0, 4.7, 9.4];
    for (let floor = 0; floor < 3; floor++) {
        const y = 2.05 + floor * 3.4;
        for (const x of bays) box(4.18, 2.96, .08, x, y, 6.04, palette.front);
    }
    for (const y of [3.72, 7.12, 10.68]) {
        box(24.36, .17, 12.30, 0, y, 0, palette.trim);
    }
    for (let column = 0; column <= 5; column++) {
        box(.24, 10.22, .22, -11.75 + column * 4.7, 5.48, 6.12, palette.pillar);
    }

    // Opaque glazing needs no transparency sorting or extra render passes.
    const facadeWindow = (x: number, y: number, side: number) => {
        box(1.82, 1.82, .12, x, y, side * 6.12, palette.frame);
        box(1.54, 1.58, .04, x, y, side * 6.20, 0, 0, true);
        box(.07, 1.58, .055, x, y, side * 6.24, palette.frame);
        box(1.92, .10, .24, x, y - .92, side * 6.16, palette.trim);
    };
    for (let floor = 0; floor < 3; floor++) {
        const y = 2.12 + floor * 3.4;
        for (const x of bays) {
            if (floor > 0 || Math.abs(x) > 5) facadeWindow(x, y, 1);
            facadeWindow(x, y, -1);
        }
        // Narrow horizontal windows on the plain end walls, as in the reference.
        for (const side of [-1, 1]) {
            for (const z of [-3.3, 2.5]) {
                box(.12, .62, 2.5, side * 12.06, y + .24, z, palette.pillar);
                box(.045, .40, 2.20, side * 12.14, y + .24, z, 0, 0, true);
            }
        }
    }

    // Three entrance door bays with pale jambs.
    for (const x of [-2.1, 0, 2.1]) {
        box(1.96, 2.62, .15, x, 1.76, 6.14, palette.frame);
        box(1.68, 2.34, .05, x, 1.76, 6.25, 0, 0, true);
        box(.07, 2.34, .06, x, 1.76, 6.30, palette.frame);
        box(1.68, .08, .06, x, 1.20, 6.30, palette.frame);
    }
    box(width + .8, .16, 1.55, 0, .08, 7.30, palette.steps);
    box(width + .4, .28, 1.10, 0, .14, 7.10, palette.steps);
    box(width, .40, .65, 0, .20, 6.90, palette.steps);

    // Six triangles form a hipped red roof: four sloping faces and a short ridge.
    const roof = new THREE.BufferGeometry();
    roof.setAttribute('position', new THREE.Float32BufferAttribute([
        -12.7, 10.98, -6.6, 12.7, 10.98, -6.6,
        12.7, 10.98, 6.6, -12.7, 10.98, 6.6,
        -6.1, 13.25, 0, 6.1, 13.25, 0,
    ], 3));
    roof.setIndex([0, 5, 1, 0, 4, 5, 1, 5, 2, 2, 4, 3, 2, 5, 4, 3, 4, 0]);
    const roofFaces = roof.toNonIndexed();
    roof.dispose();
    roofFaces.computeVertexNormals();
    // Match indexed boxes for the merge while retaining separate face normals.
    roofFaces.setIndex(Array.from({ length: roofFaces.getAttribute('position').count }, (_, i) => i));
    roofFaces.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(18 * 2), 2));
    paint(roofFaces, palette.roof);
    box(25.5, .24, 13.3, 0, 10.85, 0, palette.trim);
    box(12.3, .09, .12, 0, 13.26, 0, palette.ridge);

    const merge = (parts: THREE.BufferGeometry[]) => {
        const geometry = mergeGeometries(parts, false);
        for (const part of parts) part.dispose();
        if (!geometry) throw new Error('Unable to merge building geometry');
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        return geometry;
    };
    unitBox.dispose();
    return {
        solid: merge(solid), glass: merge(glass),
        paint: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .88 }),
        glazing: new THREE.MeshStandardMaterial({ color: 0x173e4b, roughness: .32, metalness: .12 }),
    };
}

/**
 * Three-storey reference building, two draw calls, no external assets.
 * Approximately 25.5 m wide × 14.75 m deep including steps, 13.3 m tall.
 * Geometry/materials are shared across calls; do not dispose them per instance.
 * The returned group's transform stays editable. Child meshes are static.
 */
export function createBuilding(options: BuildingOptions = {}): THREE.Group {
    resources ??= buildResources();
    const group = new THREE.Group();
    group.name = options.name ?? 'exam-administration-building';
    group.userData.displayOnly = true;
    const solid = new THREE.Mesh(resources.solid, resources.paint);
    solid.name = 'building-walls-roof-and-trim';
    solid.castShadow = options.castShadow ?? false;
    const glass = new THREE.Mesh(resources.glass, resources.glazing);
    glass.name = 'building-windows-and-doors';
    for (const mesh of [solid, glass]) {
        mesh.receiveShadow = options.receiveShadow ?? false;
        mesh.matrixAutoUpdate = false;
        group.add(mesh);
    }
    const setVector = (target: THREE.Vector3, value: VectorOption) => {
        if (value instanceof THREE.Vector3) target.copy(value);
        else target.set(...value);
    };
    if (options.position) setVector(group.position, options.position);
    if (typeof options.rotation === 'number') group.rotation.y = options.rotation;
    else if (options.rotation instanceof THREE.Euler) group.rotation.copy(options.rotation);
    else if (options.rotation) group.rotation.set(...options.rotation);
    if (typeof options.scale === 'number') group.scale.setScalar(options.scale);
    else if (options.scale) setVector(group.scale, options.scale);
    return group;
}
