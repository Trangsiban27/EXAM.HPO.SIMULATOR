import * as THREE from 'three';
import { offsetPath, roundCorners, splitByPattern, type Point } from './roundedPath';

/**
 * Đường 3 làn theo CAD, gồm các đoạn thẳng nối bằng các khúc cua cùng rẽ về phía mép trong.
 *
 * Local: đoạn đầu chạy theo -Z từ gốc, mép trong tại x = 0, lòng đường nằm phía -X.
 * Mỗi mép/vạch bo riêng quanh đỉnh góc của nó (không đồng tâm), bán kính theo từng khúc cua.
 * Từ trong ra: làn | vạch đứt | làn | vạch vàng | làn.
 */
export const ROAD_CORNER_CURVE_R8_R9 = {
    laneModuleM: 3.7,
} as const;

const LANE_MODULE_M = ROAD_CORNER_CURVE_R8_R9.laneModuleM;
const LANE_COUNT = 3;

export interface RoadCornerCurveBend {
    /** Góc rẽ về phía mép trong (độ). */
    sweepDeg: number;
    innerEdgeRadiusM: number;
    dashedLineRadiusM: number;
    centerLineRadiusM: number;
    outerEdgeRadiusM: number;
}

export interface RoadCornerCurveR8R9Options {
    /** World X của đầu mép trong đoạn đầu. */
    x: number;
    /** World Z của đầu mép trong đoạn đầu. */
    z: number;
    rotationY?: number;
    /** Chiều dài mép trong giữa các đỉnh góc: [đầu → góc 1, góc 1 → góc 2, …, góc cuối → cuối]. */
    segmentLengthsM: number[];
    bends: RoadCornerCurveBend[];
    /** VISUAL_CONFIG. Mặc định 1.5 m. */
    dashLengthM?: number;
    /** VISUAL_CONFIG. Mặc định 1.0 m. */
    dashGapM?: number;
}

export class RoadCornerCurveR8R9 {
    readonly root: THREE.Group;
    /** Đường bao mặt đường theo local (x, z). */
    readonly surfaceOutline: Point[];

    constructor(opts: RoadCornerCurveR8R9Options) {
        const { segmentLengthsM, bends } = opts;
        if (segmentLengthsM.length !== bends.length + 1) {
            throw new Error('RoadCornerCurveR8R9: segmentLengthsM must have one more entry than bends');
        }
        const sweeps = bends.map(bend => THREE.MathUtils.degToRad(bend.sweepDeg));
        if (sweeps.some(sweep => sweep <= 0 || sweep >= Math.PI)) {
            throw new Error('RoadCornerCurveR8R9: sweepDeg must be between 0 and 180 degrees');
        }
        const dashLengthM = opts.dashLengthM ?? 1.5;
        const dashGapM = opts.dashGapM ?? 1.0;

        const reference: Point[] = [[0, 0]];
        let heading = 0;
        segmentLengthsM.forEach((length, index) => {
            const [px, pz] = reference[reference.length - 1];
            reference.push([px + Math.sin(heading) * length, pz - Math.cos(heading) * length]);
            heading += sweeps[index] ?? 0;
        });
        const halfTans = sweeps.map(sweep => Math.tan(sweep / 2));
        const line = (lanes: number, radius: (bend: RoadCornerCurveBend) => number): Point[] => {
            const offset = lanes * LANE_MODULE_M;
            const radii = bends.map(radius);
            segmentLengthsM.forEach((length, index) => {
                const before = index > 0 ? halfTans[index - 1] : 0;
                const after = halfTans[index] ?? 0;
                const needed = (index > 0 ? radii[index - 1] * before : 0) + (radii[index] ?? 0) * after;
                if (needed > length + offset * (before + after)) {
                    throw new Error(`RoadCornerCurveR8R9: segment ${index} is too short for its bend radii`);
                }
            });
            return roundCorners(offsetPath(reference, -offset), radii);
        };

        const root = new THREE.Group();
        root.name = 'road-corner-curve-r8-r9';
        root.position.set(opts.x, 0, opts.z);
        root.rotation.y = opts.rotationY ?? 0;
        this.root = root;

        const inner = line(0, bend => bend.innerEdgeRadiusM);
        const outer = line(LANE_COUNT, bend => bend.outerEdgeRadiusM);
        this.surfaceOutline = outer.concat([...inner].reverse());
        const surface = addFlatShape(this.surfaceOutline, -0.02, 0.08,
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 }), 'road-surface', root);
        surface.receiveShadow = true;

        const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });
        for (const [edge, from, to] of [[outer, 0, 0.2], [inner, -0.2, 0]] as const) {
            splitByPattern(edge, [0.8]).forEach((piece, index) => {
                const curb = addRibbon(piece, from, to, 0.06, 0.05,
                    index % 2 === 0 ? red : white, 'red-white-curb', root);
                curb.castShadow = true;
            });
        }

        const lineHalf = 0.075;
        addRibbon(line(2, bend => bend.centerLineRadiusM), -lineHalf, lineHalf, 0.063, 0.008,
            new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.85 }), 'yellow-solid-center-curve', root);
        splitByPattern(line(1, bend => bend.dashedLineRadiusM), [dashLengthM, dashGapM]).forEach((piece, index) => {
            if (index % 2 === 0) {
                addRibbon(piece, -lineHalf, lineHalf, 0.063, 0.008, white, 'white-dashed-curve', root);
            }
        });
    }
}

function addRibbon(points: Point[], from: number, to: number, y: number, depth: number,
    material: THREE.Material, name: string, parent: THREE.Group): THREE.Mesh {
    return addFlatShape(offsetPath(points, from).concat(offsetPath(points, to).reverse()),
        y, depth, material, name, parent);
}

function addFlatShape(outline: Point[], y: number, depth: number,
    material: THREE.Material, name: string, parent: THREE.Group): THREE.Mesh {
    const geometry = new THREE.ExtrudeGeometry(
        new THREE.Shape(outline.map(([px, pz]) => new THREE.Vector2(px, -pz))),
        { depth, bevelEnabled: false },
    );
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.y = y;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
}
