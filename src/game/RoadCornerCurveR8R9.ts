import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';
import { offsetPath, roundCorners, splitByPattern, type Point } from './roundedPath';
import { createRoadArrowTexture, STRAIGHT_ROAD_ARROW_LENGTH_M, STRAIGHT_ROAD_ARROW_WIDTH_M } from './straightRoadArrow';

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

interface RoadCornerLaneArrow {
    type: 'straight-right' | 'diagonal-right' | 'diagonal-left';
    /** Đoạn tham chiếu: 0 = đầu -Z, 1 = đoạn chéo, 2 = đoạn +X. Mặc định đoạn dài nhất. */
    segmentIndex?: number;
    /** Khoảng cách từ đầu đoạn tham chiếu (m). */
    distanceM: number;
    /** Dịch riêng mũi tên theo trục X thế giới (m). Mặc định 0. */
    shiftWorldXM?: number;
    /** Dịch riêng mũi tên theo trục Z thế giới (m). Mặc định 0. */
    shiftWorldZM?: number;
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
    /** Hiển thị số 2–4 trên ba làn nối tiếp nhánh road-corner-positive-x. */
    withLaneNumbers?: boolean;
    /** Mũi tên trên làn 4, đo từ đầu đoạn thẳng dài nhất theo chiều dựng đường. */
    lane4Arrows?: ReadonlyArray<RoadCornerLaneArrow>;
    /** Mũi tên trên làn 3, cùng chiều +X với làn 4. */
    lane3Arrows?: ReadonlyArray<RoadCornerLaneArrow>;
    /** Mũi tên trên làn 2, quay về phía đầu đoạn thẳng (hướng -X). */
    lane2Arrows?: ReadonlyArray<RoadCornerLaneArrow>;
}

export class RoadCornerCurveR8R9 {
    readonly root: THREE.Group;
    /** Đường bao mặt đường theo local (x, z). */
    readonly surfaceOutline: Point[];
    /** Mép trong phía bắc của đoạn 8A, theo thứ tự từ tây sang đông. */
    readonly innerEdge: Point[];
    private readonly innerCurbMaterials: [THREE.Material, THREE.Material];
    private readonly innerCurbPieces: Point[][];
    private readonly innerCurbMeshes: THREE.Mesh[][];
    private innerCurbOpenings: Array<[number, number]> = [];

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
        this.innerEdge = inner;
        this.surfaceOutline = outer.concat([...inner].reverse());
        const surface = addFlatShape(this.surfaceOutline, -0.02, 0.08,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: 0.95 }), 'road-surface', root);
        surface.receiveShadow = true;

        const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });
        this.innerCurbMaterials = [red, white];
        splitByPattern(outer, [0.8]).forEach((piece, index) => {
            const curb = addRibbon(piece, 0, CURB_VISUAL_WIDTH_M, 0.06, CURB_VISUAL_HEIGHT_M,
                index % 2 === 0 ? red : white, 'red-white-curb', root);
            curb.castShadow = true;
        });
        this.innerCurbPieces = splitByPattern(inner, [0.8]);
        this.innerCurbMeshes = this.innerCurbPieces.map((piece, index) => {
            const curb = addRibbon(piece, -CURB_VISUAL_WIDTH_M, 0, 0.06,
                CURB_VISUAL_HEIGHT_M, this.innerCurbMaterials[index % 2], 'red-white-curb', root);
            curb.castShadow = true;
            return [curb];
        });

        const lineHalf = 0.075;
        addRibbon(line(2, bend => bend.centerLineRadiusM), -lineHalf, lineHalf, 0.063, 0.008,
            new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.85 }), 'yellow-solid-center-curve', root);
        splitByPattern(line(1, bend => bend.dashedLineRadiusM), [dashLengthM, dashGapM]).forEach((piece, index) => {
            if (index % 2 === 0) {
                addRibbon(piece, -lineHalf, lineHalf, 0.063, 0.008, white, 'white-dashed-curve', root);
            }
        });

        if (opts.withLaneNumbers || opts.lane4Arrows?.length || opts.lane3Arrows?.length || opts.lane2Arrows?.length) {
            const longestSegmentIndex = segmentLengthsM.indexOf(Math.max(...segmentLengthsM));
            const laneMarkingGroup = (laneIndex: number, distanceM: number, forward: boolean,
                segmentIndex = longestSegmentIndex) => {
                const [fromX, fromZ] = reference[segmentIndex];
                const [toX, toZ] = reference[segmentIndex + 1];
                const segmentHeading = Math.atan2(toX - fromX, fromZ - toZ);
                const normalX = Math.cos(segmentHeading);
                const normalZ = Math.sin(segmentHeading);
                const distanceFromInner = (laneIndex + 0.5) * LANE_MODULE_M;
                const markingGroup = new THREE.Group();
                markingGroup.position.set(
                    fromX + Math.sin(segmentHeading) * distanceM - normalX * distanceFromInner,
                    0,
                    fromZ - Math.cos(segmentHeading) * distanceM - normalZ * distanceFromInner,
                );
                markingGroup.rotation.y = -segmentHeading + (forward ? 0 : Math.PI);
                root.add(markingGroup);
                return markingGroup;
            };

            if (opts.withLaneNumbers) {
                // Số làn ở giữa đoạn dài nhất: mép trong nối L4, mép ngoài nối L2.
                for (let laneIndex = 0; laneIndex < LANE_COUNT; laneIndex++) {
                    const laneNumber = 4 - laneIndex;
                    addLaneNumber(laneNumber,
                        laneMarkingGroup(laneIndex, segmentLengthsM[longestSegmentIndex] / 2, laneNumber === 2));
                }
            }
            const addArrows = (laneNumber: 2 | 3 | 4, arrows: ReadonlyArray<RoadCornerLaneArrow> | undefined) => {
                arrows?.forEach(({ type, distanceM, segmentIndex = longestSegmentIndex,
                    shiftWorldXM = 0, shiftWorldZM = 0 }, index) => {
                    if (!Number.isInteger(segmentIndex) || segmentIndex < 0 || segmentIndex >= segmentLengthsM.length
                        || distanceM < 0 || distanceM > segmentLengthsM[segmentIndex]) {
                        throw new Error(`RoadCornerCurveR8R9: lane ${laneNumber} arrow ${index + 1} is outside segment ${segmentIndex}`);
                    }
                    const arrowGroup = laneMarkingGroup(4 - laneNumber, distanceM, laneNumber !== 2,
                        segmentIndex);
                    const cos = Math.cos(root.rotation.y);
                    const sin = Math.sin(root.rotation.y);
                    arrowGroup.position.x += cos * shiftWorldXM - sin * shiftWorldZM;
                    arrowGroup.position.z += sin * shiftWorldXM + cos * shiftWorldZM;
                    addLaneArrow(type, `lane-${laneNumber}-${type}-arrow-${index + 1}`, arrowGroup);
                });
            };
            addArrows(4, opts.lane4Arrows);
            addArrows(3, opts.lane3Arrows);
            addArrows(2, opts.lane2Arrows);
        }
    }

    /** Mở mép trong đúng từ điểm tiếp tuyến góc bo này tới điểm tiếp tuyến góc bo kia. */
    setInnerCurbOpenings(openings: Array<[number, number]>): void {
        this.innerCurbOpenings = openings.map(([fromX, toX]) =>
            [Math.min(fromX, toX), Math.max(fromX, toX)]);
    }

    /** Keep junction-cut fragments owned by the original stripe so restoring an
     * entrance also removes those fragments, rather than leaving a barrier. */
    replaceInnerCurbMesh(original: THREE.Mesh, pieces: THREE.Mesh[]): void {
        for (const meshes of this.innerCurbMeshes) {
            const index = meshes.indexOf(original);
            if (index >= 0) {
                meshes.splice(index, 1, ...pieces);
                return;
            }
        }
    }

    restoreInnerCurbAfterJunctions(): void {
        // Chỉ dựng lại các khúc gần hai cửa nối. Các khúc xa hơn đã được cắt
        // riêng cho chuồng đỗ và đầu đường, cần giữ nguyên kết quả đó.
        this.innerCurbPieces.forEach((piece, index) => {
            const minX = Math.min(...piece.map(point => point[0]));
            const maxX = Math.max(...piece.map(point => point[0]));
            if (!this.innerCurbOpenings.some(([fromX, toX]) =>
                maxX >= fromX - 1 && minX <= toX + 1)) return;
            for (const curb of this.innerCurbMeshes[index]) {
                curb.removeFromParent();
                curb.geometry.dispose();
            }
            this.innerCurbMeshes[index] = clipPolylineOutsideXOpenings(piece, this.innerCurbOpenings)
                .map(visible => {
                    const curb = addRibbon(visible, -CURB_VISUAL_WIDTH_M, 0, 0.06,
                        CURB_VISUAL_HEIGHT_M, this.innerCurbMaterials[index % 2], 'red-white-curb', this.root);
                    curb.castShadow = true;
                    return curb;
                });
        });
    }
}

function addLaneNumber(laneNumber: number, parent: THREE.Group): void {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#ffffff';
    context.font = 'bold 88px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(String(laneNumber), 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 1.1),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
    label.name = `lane-number-${laneNumber}`;
    label.rotation.x = -Math.PI / 2;
    label.position.y = 0.08;
    parent.add(label);
}

function addLaneArrow(type: RoadCornerLaneArrow['type'], name: string, parent: THREE.Group): void {
    const arrow = new THREE.Mesh(
        new THREE.PlaneGeometry(STRAIGHT_ROAD_ARROW_WIDTH_M, STRAIGHT_ROAD_ARROW_LENGTH_M),
        new THREE.MeshBasicMaterial({ map: createRoadArrowTexture(type), transparent: true, depthWrite: false }),
    );
    arrow.name = name;
    arrow.rotation.x = -Math.PI / 2;
    arrow.position.y = 0.081;
    parent.add(arrow);
}

function clipPolylineOutsideXOpenings(points: Point[], openings: Array<[number, number]>): Point[][] {
    if (!openings.length) return [points];
    const result: Point[][] = [];
    let current: Point[] = [];
    const push = (point: Point) => {
        const last = current[current.length - 1];
        if (!last || Math.hypot(point[0] - last[0], point[1] - last[1]) > 1e-6) current.push(point);
    };
    const finish = () => {
        if (current.length > 1) result.push(current);
        current = [];
    };
    for (let i = 1; i < points.length; i++) {
        const from = points[i - 1];
        const to = points[i];
        const dx = to[0] - from[0];
        const cuts = [0, 1];
        if (Math.abs(dx) > 1e-8) {
            for (const [startX, endX] of openings) {
                for (const x of [startX, endX]) {
                    const t = (x - from[0]) / dx;
                    if (t > 1e-8 && t < 1 - 1e-8) cuts.push(t);
                }
            }
        }
        cuts.sort((a, b) => a - b);
        for (let j = 1; j < cuts.length; j++) {
            const a = cuts[j - 1], b = cuts[j];
            if (b - a < 1e-8) continue;
            const middleX = from[0] + dx * (a + b) / 2;
            if (openings.some(([startX, endX]) => middleX > startX && middleX < endX)) {
                finish();
                continue;
            }
            push([from[0] + dx * a, from[1] + (to[1] - from[1]) * a]);
            push([from[0] + dx * b, from[1] + (to[1] - from[1]) * b]);
        }
    }
    finish();
    return result;
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
