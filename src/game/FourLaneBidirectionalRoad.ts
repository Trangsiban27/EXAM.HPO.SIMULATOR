import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';
import {
    createRoadArrowTexture,
    STRAIGHT_ROAD_ARROW_LENGTH_M,
    STRAIGHT_ROAD_ARROW_WIDTH_M,
} from './straightRoadArrow';
import { ROAD_CORNER_CURVE_R8_R9 } from './RoadCornerCurveR8R9';
import { offsetPath, roundCorners, splitByPattern, type Point } from './roundedPath';

/**
 * FourLaneBidirectionalRoad
 *
 * Dựng một đoạn đường thẳng 4 làn HAI CHIỀU theo spec road_4lane_bidirectional_spec.md.
 *
 * Layout:
 * ```
 * LEFT EDGE
 * | L1 ↓ | - - - | L2 ↓ | ━━━━━ | L3 ↑ | - - - | L4 ↑ |
 *                     YELLOW SOLID
 * RIGHT EDGE
 * ```
 *
 * Hard constraints:
 * - laneCount = 4 (cố định, không thay đổi)
 * - LANE_01, LANE_02: đi xuống (-Z)
 * - LANE_03, LANE_04: đi lên (+Z)
 * - Giữa L1/L2: WHITE_DASHED (vạch trắng đứt)
 * - Giữa L2/L3: YELLOW_SOLID (vạch vàng liền - trung tâm hai chiều)
 * - Giữa L3/L4: WHITE_DASHED (vạch trắng đứt)
 *
 * Coordinate system:
 * - Road center X = 0
 * - +Z = lên phía trên bản vẽ
 * - -Z = xuống phía dưới bản vẽ
 */

export interface FourLaneBidirectionalRoadOptions {
    /** Tâm road theo trục X (world). */
    x: number;
    /** Tâm road theo trục Z (world). */
    z: number;
    /** Chiều dài đoạn đường theo trục Z (m). */
    lengthM: number;
    /** Chiều rộng mỗi làn (m). Mặc định 3.5. */
    laneWidthM?: number;
    /** Độ dài một nét đứt (m). Mặc định 1.5. */
    dashLengthM?: number;
    /** Khoảng cách giữa hai nét đứt (m). Mặc định 1.0. */
    dashGapM?: number;
    /** Có vẽ mũi tên chỉ hướng trên từng làn hay không. Mặc định true. */
    withArrows?: boolean;
    /** Hiển thị số 1–4 trên bốn làn của đoạn thẳng. Mặc định false. */
    withLaneNumbers?: boolean;
    /** Hiển thị số làn 2–4 trên nhánh cong local +X. Mặc định false. */
    withPositiveXCornerLaneNumbers?: boolean;
    /** Kiểu mũi tên ở làn 3 và 4 của nhánh local +X. Mặc định đi thẳng. */
    positiveXCornerInnerArrowType?: 'straight' | 'diagonal-right';
    /** Dịch mũi tên làn 3 và 4 trên nhánh theo local X (m). */
    positiveXCornerInnerArrowShiftXM?: number;
    /** Kiểu mũi tên riêng cho làn 2 của nhánh local +X. Mặc định đi thẳng. */
    positiveXCornerLane2ArrowType?: 'straight' | 'diagonal-left';
    /** Dịch mũi tên làn 2 của nhánh theo local X (m). */
    positiveXCornerLane2ArrowShiftXM?: number;
    /**
     * Bo 90° ở đầu local -Z. Bán kính đo từ mép trong road;
     * không truyền thì road vẫn là đoạn thẳng.
     */
    negativeZCurveRadiusM?: number;
    /** Hướng bo tại đầu local -Z. Mặc định local -X. */
    negativeZCurveSide?: 'negative-x' | 'positive-x';
    /**
     * Góc quét của khúc cong (độ), tính từ điểm nối với đoạn thẳng.
     * Mặc định 90 (bo vuông góc đầy đủ). Giảm số này để "cắt đuôi" khúc cong
     * ngắn lại mà KHÔNG đổi bán kính/độ gắt của cung — điểm nối với đoạn
     * thẳng luôn giữ nguyên, chỉ đầu xa (đuôi) bị cắt bớt.
     */
    negativeZCurveSweepDeg?: number;
    /**
     * Bán kính mép ngoài của khúc cong, độc lập với negativeZCurveRadiusM
     * (mép trong).
     * - 'negative-x': mặc định = negativeZCurveRadiusM + tổng bề rộng đường.
     *   Nếu khác giá trị này, mặt đường trong khúc cong sẽ có bậc tại điểm nối.
     * - 'positive-x': góc vuông 4 → 3 làn, mỗi mép/vạch bo riêng theo CAD.
     *   Mặc định = negativeZCurveRadiusM.
     */
    negativeZCurveOuterRadiusM?: number;
    /** 'positive-x': bán kính vạch vàng giữa. Mặc định = bán kính mép ngoài. */
    negativeZCurveCenterLineRadiusM?: number;
    /**
     * 'positive-x': chiều dài nhánh 3 làn, đo theo local +X từ mép trong
     * đoạn thẳng. Mặc định = negativeZCurveRadiusM + 15.
     */
    negativeZCurveLegLengthM?: number;
    /**
     * Xoay toàn bộ road quanh trục Y (radians). Mặc định 0 (trục đứng, song song world Z).
     * `Math.PI / 2` → trục ngang (song song world X).
     */
    rotationY?: number;
}

export class FourLaneBidirectionalRoad {
    readonly root: THREE.Group;
    readonly lengthM: number;
    readonly laneWidthM: number;
    readonly widthM: number;
    /** Xoay quanh trục Y (radians). */
    readonly rotationY: number;

    /** Tâm các lane theo local X. */
    readonly laneCentersX: number[];

    constructor(opts: FourLaneBidirectionalRoadOptions) {
        const lengthM = opts.lengthM;
        const laneWidthM = opts.laneWidthM ?? 3.5;
        const dashLengthM = opts.dashLengthM ?? 1.5;
        const dashGapM = opts.dashGapM ?? 1.0;
        const withArrows = opts.withArrows ?? true;
        const withLaneNumbers = opts.withLaneNumbers ?? false;
        const rotationY = opts.rotationY ?? 0;
        const negativeZCurveRadiusM = opts.negativeZCurveRadiusM;
        const negativeZCurveSide = opts.negativeZCurveSide ?? 'negative-x';
        const negativeZCurveSweepDeg = opts.negativeZCurveSweepDeg ?? 90;
        const negativeZCurveOuterRadiusM = opts.negativeZCurveOuterRadiusM;

        if (lengthM <= 0) throw new Error('FourLaneBidirectionalRoad: lengthM must be > 0');
        if (laneWidthM <= 0) throw new Error('FourLaneBidirectionalRoad: laneWidthM must be > 0');
        if (negativeZCurveRadiusM !== undefined && negativeZCurveRadiusM <= 0) {
            throw new Error('FourLaneBidirectionalRoad: negativeZCurveRadiusM must be > 0');
        }

        const widthM = 4 * laneWidthM;
        this.lengthM = lengthM;
        this.laneWidthM = laneWidthM;
        this.widthM = widthM;
        this.rotationY = rotationY;

        // Tâm các lane theo local X (road center = 0)
        // LANE_01 = -1.5W, LANE_02 = -0.5W, LANE_03 = +0.5W, LANE_04 = +1.5W
        this.laneCentersX = [
            -1.5 * laneWidthM,  // LANE_01 (đi xuống -Z)
            -0.5 * laneWidthM,  // LANE_02 (đi xuống -Z)
            +0.5 * laneWidthM,  // LANE_03 (đi lên +Z)
            +1.5 * laneWidthM,  // LANE_04 (đi lên +Z)
        ];

        const root = new THREE.Group();
        root.name = 'four-lane-bidirectional-road';
        root.position.set(opts.x, 0, opts.z);
        root.rotation.y = rotationY;
        this.root = root;

        // 1. Mặt đường (asphalt) - mộddt surface liên tục
        const surface = new THREE.Mesh(
            new THREE.BoxGeometry(widthM, 0.08, lengthM),
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: 0.95 }),
        );
        surface.position.set(0, 0.02, 0);
        surface.name = 'road-surface';
        surface.receiveShadow = true;
        root.add(surface);

        // 2. Curb đỏ-trắng ở 2 biên ngoài cùng
        const halfW = widthM / 2;
        this.addCurbPattern(+halfW, lengthM, root);
        this.addCurbPattern(-halfW, lengthM, root);

        // 3. Vạch trắng đứt giữa LANE_01 và LANE_02 (giữa 2 làn cùng chiều đi xuống)
        // Vị trí x = -laneWidthM
        this.addWhiteDashedLine(-laneWidthM, lengthM, dashLengthM, dashGapM, root);

        // 4. Vạch vàng liền trung tâm (phân chia hai chiều)
        // Vị trí x = 0
        this.addYellowSolidLine(0, lengthM, root);

        // 5. Vạch trắng đứt giữa LANE_03 và LANE_04 (giữa 2 làn cùng chiều đi lên)
        // Vị trí x = +laneWidthM
        this.addWhiteDashedLine(+laneWidthM, lengthM, dashLengthM, dashGapM, root);

        // 6. Mũi tên chỉ hướng
        if (withArrows) {
            // LANE_01 và LANE_02 đi xuống (-Z) → mũi tên xoay 180°
            this.addArrow(this.laneCentersX[0], true, root);
            this.addArrow(this.laneCentersX[1], true, root);
            // LANE_03 và LANE_04 đi lên (+Z) → mũi tên hướng lên (không xoay)
            this.addArrow(this.laneCentersX[2], false, root);
            this.addArrow(this.laneCentersX[3], false, root);
        }
        if (withLaneNumbers) {
            for (let laneIndex = 0; laneIndex < this.laneCentersX.length; laneIndex++) {
                this.addLaneNumber(this.laneCentersX[laneIndex], 5, laneIndex + 1, root);
            }
        }

        if (negativeZCurveRadiusM !== undefined && negativeZCurveSide === 'positive-x') {
            const outerRadiusM = negativeZCurveOuterRadiusM ?? negativeZCurveRadiusM;
            this.addPositiveXCorner(
                negativeZCurveRadiusM,
                outerRadiusM,
                opts.negativeZCurveCenterLineRadiusM ?? outerRadiusM,
                opts.negativeZCurveLegLengthM ?? negativeZCurveRadiusM + 15,
                laneWidthM,
                lengthM,
                dashLengthM,
                dashGapM,
                opts.withPositiveXCornerLaneNumbers ?? false,
                opts.positiveXCornerInnerArrowType ?? 'straight',
                opts.positiveXCornerInnerArrowShiftXM ?? 0,
                opts.positiveXCornerLane2ArrowType ?? 'straight',
                opts.positiveXCornerLane2ArrowShiftXM ?? 0,
                root,
            );
        } else if (negativeZCurveRadiusM !== undefined) {
            this.addNegativeZCurve(
                negativeZCurveRadiusM,
                widthM,
                laneWidthM,
                lengthM,
                dashLengthM,
                dashGapM,
                negativeZCurveSide,
                negativeZCurveSweepDeg,
                root,
                negativeZCurveOuterRadiusM,
            );
        }
    }

    /**
     * Góc vuông tại đầu local -Z, rẽ về local +X: 4 làn đoạn thẳng → nhánh 3 làn.
     * Theo CAD, mỗi đường bo riêng quanh góc vuông của nó (không đồng tâm):
     * mép trong `innerRadiusM`, mép ngoài `outerRadiusM`, vạch vàng
     * `centerLineRadiusM`; vạch đứt L3/L4 đồng tâm với vạch vàng.
     * Mép trong bắt đầu bo ngay tại điểm nối với đoạn thẳng. Làn L1 kết thúc
     * tại đầu nhánh; nhánh còn 1 làn phía ngoài và 2 làn phía trong.
     */
    private addPositiveXCorner(
        innerRadiusM: number,
        outerRadiusM: number,
        centerLineRadiusM: number,
        legLengthM: number,
        laneWidthM: number,
        lengthM: number,
        dashLengthM: number,
        dashGapM: number,
        withLaneNumbers: boolean,
        innerArrowType: 'straight' | 'diagonal-right',
        innerArrowShiftXM: number,
        lane2ArrowType: 'straight' | 'diagonal-left',
        lane2ArrowShiftXM: number,
        parent: THREE.Group,
    ): void {
        const halfW = 2 * laneWidthM;
        const legWidth = 3 * laneWidthM;
        const seamZ = -lengthM / 2;
        const innerZ = seamZ - innerRadiusM;
        const outerZ = innerZ - legWidth;
        const endX = halfW + legLengthM;
        const dashedRadiusM = centerLineRadiusM - laneWidthM;

        if (outerRadiusM <= 0 || outerRadiusM > innerRadiusM + legWidth) {
            throw new Error('FourLaneBidirectionalRoad: outer radius must be in (0, inner radius + 3 lanes]');
        }
        if (dashedRadiusM <= 0 || centerLineRadiusM > innerRadiusM + 2 * laneWidthM) {
            throw new Error('FourLaneBidirectionalRoad: center line radius must be in (1 lane, inner radius + 2 lanes]');
        }
        if (legLengthM < innerRadiusM) {
            throw new Error('FourLaneBidirectionalRoad: leg length must be >= inner radius');
        }

        const corner = (x: number, z: number, radius: number) =>
            roundCorners([[x, seamZ], [x, z], [endX, z]], radius);
        const inner = corner(halfW, innerZ, innerRadiusM);
        const outer = corner(-halfW, outerZ, outerRadiusM);

        const group = new THREE.Group();
        group.name = 'road-corner-positive-x';
        parent.add(group);

        const outline = outer.concat([...inner].reverse());
        const surfaceGeometry = new THREE.ExtrudeGeometry(
            new THREE.Shape(outline.map(([px, pz]) => new THREE.Vector2(px, -pz))),
            { depth: 0.08, bevelEnabled: false },
        );
        surfaceGeometry.rotateX(-Math.PI / 2);
        const surface = new THREE.Mesh(
            surfaceGeometry,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: 0.95 }),
        );
        surface.name = 'road-surface';
        surface.position.y = -0.02;
        surface.receiveShadow = true;
        group.add(surface);

        // Đoạn curb thẳng sát điểm nối có index 0 màu trắng → bên cung bắt đầu màu đỏ.
        const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });
        for (const [edge, width] of [
            [outer, CURB_VISUAL_WIDTH_M],
            [inner, -CURB_VISUAL_WIDTH_M],
        ] as const) {
            splitByPattern(edge, [0.8]).forEach((piece, index) => {
                const curb = this.addRibbon(piece, 0, width, 0.06, CURB_VISUAL_HEIGHT_M,
                    index % 2 === 0 ? red : white, 'red-white-curb', group);
                curb.castShadow = true;
            });
        }

        const lineHalf = 0.075;
        const yellow = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.85 });
        this.addRibbon(corner(0, outerZ + laneWidthM, centerLineRadiusM),
            -lineHalf, lineHalf, 0.063, 0.008, yellow, 'yellow-solid-center-curve', group);
        const dashedLines: Point[][] = [
            corner(laneWidthM, innerZ - laneWidthM, dashedRadiusM),
            [[-laneWidthM, seamZ], [-laneWidthM, innerZ]],
        ];
        for (const line of dashedLines) {
            splitByPattern(line, [dashLengthM, dashGapM]).forEach((piece, index) => {
                if (index % 2 === 0) {
                    this.addRibbon(piece, -lineHalf, lineHalf, 0.063, 0.008, white, 'white-dashed-curve', group);
                }
            });
        }

        // Làn ngoài nối tiếp L1/L2 đi ra +X; hai làn trong đi về phía góc (-X).
        const arrowX = (halfW + innerRadiusM + endX) / 2;
        const arrowLanes: [number, boolean][] = [
            [outerZ + laneWidthM / 2, false],
            [innerZ - laneWidthM * 1.5, true],
            [innerZ - laneWidthM / 2, true],
        ];
        for (const [index, [laneZ, isBackward]] of arrowLanes.entries()) {
            const arrowGroup = new THREE.Group();
            arrowGroup.position.set(arrowX + (index > 0 ? innerArrowShiftXM : lane2ArrowShiftXM), 0, laneZ);
            arrowGroup.rotation.y = Math.PI / 2;
            this.addArrow(0, isBackward, arrowGroup, index > 0 ? innerArrowType : lane2ArrowType);
            group.add(arrowGroup);
        }

        if (withLaneNumbers) {
            // L1 kết thúc ở đầu nhánh; ba làn còn lại nối tiếp theo thứ tự L2–L4.
            const numberX = endX - 3;
            arrowLanes.forEach(([laneZ, isBackward], index) => {
                const numberGroup = new THREE.Group();
                numberGroup.position.set(numberX, 0, laneZ);
                numberGroup.rotation.y = isBackward ? Math.PI / 2 : -Math.PI / 2;
                this.addLaneNumber(0, 0, index + 2, numberGroup);
                group.add(numberGroup);
            });
        }
    }

    private addRibbon(points: Point[], from: number, to: number, y: number, depth: number,
        material: THREE.Material, name: string, parent: THREE.Group): THREE.Mesh {
        const outline = offsetPath(points, from).concat(offsetPath(points, to).reverse());
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

    /**
     * Connector 90° tại đầu local -Z, nối đoạn thẳng theo hướng local ±X.
     * `radiusM` là bán kính mép trong.
     * `outerRadiusM` (tuỳ chọn): bán kính mép ngoài. Nếu không truyền,
     * mặc định = radiusM + total road width (hành vi cũ). Truyền riêng
     * để mép ngoài bo gắt/thoải độc lập với mép trong (giống CAD, nơi
     * mép trong và mép ngoài có thể mang 2 giá trị R khác nhau).
     * Tại điểm nối, mặt đường vẫn rộng bằng 4 làn đoạn thẳng.
     * Dọc cung, làn ngoài cùng nhập dần, còn 3 làn bằng nhau,
     * mỗi làn rộng bằng module của RoadCornerCurveR8R9 (3.70 m).
     */
    private addNegativeZCurve(
        radiusM: number,
        widthM: number,
        laneWidthM: number,
        lengthM: number,
        dashLengthM: number,
        dashGapM: number,
        side: 'negative-x' | 'positive-x',
        sweepDeg: number,
        parent: THREE.Group,
        outerRadiusM?: number,
    ): void {
        const halfWidth = widthM / 2;
        const centerX = side === 'negative-x'
            ? -halfWidth - radiusM
            : halfWidth + radiusM;
        const centerZ = -lengthM / 2;

        const mergedLaneWidthM = ROAD_CORNER_CURVE_R8_R9.laneModuleM;
        const mergedLaneCount = 3;
        const seamOuter = outerRadiusM ?? (radiusM + widthM);
        const tailOuter = radiusM + mergedLaneCount * mergedLaneWidthM;
        // Cung phải quét RA NGOÀI (z <= centerZ), không được quét ngược vào
        // vùng z > centerZ vì đó là nơi đoạn đường thẳng (curb/vạch kẻ full-length)
        // đã chiếm chỗ — quét sai hướng sẽ khiến cung chồng lấn lên đoạn thẳng
        // ngay tại điểm nối, tạo ra vệt gãy/nhọn như trong ảnh lỗi.
        // sin(angle) phải <= 0 trong suốt range để đảm bảo z = centerZ + r*sin(angle) <= centerZ.
        //
        // seamAngle: góc tại điểm nối với đoạn thẳng — LUÔN CỐ ĐỊNH, không phụ
        // thuộc sweepDeg, để cắt "đuôi" khúc cong mà không ảnh hưởng chỗ ghép nối.
        // Đầu còn lại (xa seam) mới là chỗ bị cắt ngắn theo sweepDeg.
        const sweepRad = THREE.MathUtils.degToRad(
            THREE.MathUtils.clamp(sweepDeg, 1, 90),
        );
        const seamAngle = side === 'negative-x' ? 0 : Math.PI;
        const tailAngle = side === 'negative-x'
            ? -sweepRad
            : Math.PI + sweepRad;
        const startAngle = side === 'negative-x' ? tailAngle : seamAngle;
        const endAngle = side === 'negative-x' ? seamAngle : tailAngle;
        // Làn ngoài cùng phải nhập ở đầu cung. Sau 18° đầu tiên, mặt đường
        // giữ đúng profile 3 × 3.70 m của RoadCornerCurveR8R9 trong phần còn lại.
        const mergeFractionOfCurve = 0.2;
        const mergeT = (angle: number) => THREE.MathUtils.clamp(
            ((angle - seamAngle) / (tailAngle - seamAngle)) / mergeFractionOfCurve,
            0,
            1,
        );
        const outerAt = (angle: number) => seamOuter + (tailOuter - seamOuter) * mergeT(angle);
        const radiusAt = (seamOffset: number, tailOffset: number) => (angle: number) =>
            radiusM + seamOffset + (tailOffset - seamOffset) * mergeT(angle);

        const shape = new THREE.Shape();
        const outlineSegments = 48;
        for (let index = 0; index <= outlineSegments; index++) {
            const angle = startAngle + (endAngle - startAngle) * index / outlineSegments;
            const radius = outerAt(angle);
            const x = centerX + radius * Math.cos(angle);
            const y = centerZ + radius * Math.sin(angle);
            if (index === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.lineTo(
            centerX + radiusM * Math.cos(endAngle),
            centerZ + radiusM * Math.sin(endAngle),
        );
        shape.absarc(centerX, centerZ, radiusM, endAngle, startAngle, true);
        shape.closePath();

        const surfaceGeometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.08,
            bevelEnabled: false,
            curveSegments: 48,
        });
        surfaceGeometry.rotateX(Math.PI / 2);
        const surface = new THREE.Mesh(
            surfaceGeometry,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: 0.95 }),
        );
        surface.name = 'road-surface-curve-negative-z';
        surface.position.y = 0.06;
        surface.receiveShadow = true;
        parent.add(surface);

        this.addCurvedCurbPattern(
            radiusM, radiusM + CURB_VISUAL_WIDTH_M,
            centerX, centerZ, startAngle, endAngle, parent);
        this.addVariableCurvedCurb(outerAt, centerX, centerZ, startAngle, endAngle, parent);
        // L4/L3 giữ vạch trắng, dịch từ bề rộng làn thẳng sang 3.70 m.
        this.addVariableCurvedDashedLine(
            radiusAt(laneWidthM, mergedLaneWidthM),
            centerX, centerZ, startAngle, endAngle, dashLengthM, dashGapM, parent,
        );
        // Vạch vàng giữa hai chiều dịch tới ranh làn 2 và 3 của khúc 3 làn.
        this.addVariableCurvedLine(
            radiusAt(laneWidthM * 2, mergedLaneWidthM * 2),
            centerX, centerZ, startAngle, endAngle, 0xffd700, 'yellow-solid-center-curve', parent,
        );
        // Làn ngoài cùng nhập vào mép ngoài. Vạch dừng trước khi chạm mép.
        const outerLaneOffset = laneWidthM * 3;
        this.addVariableCurvedDashedLine(
            angle => {
                const edge = outerAt(angle);
                const towardEdge = radiusM + outerLaneOffset + (edge - radiusM - outerLaneOffset) * mergeT(angle);
                return Math.min(towardEdge, edge - 0.35);
            },
            centerX, centerZ, startAngle, endAngle, dashLengthM, dashGapM, parent,
            angle => edgeGap(angle) > 0.5,
        );

        function edgeGap(angle: number): number {
            const edge = outerAt(angle);
            const towardEdge = radiusM + outerLaneOffset + (edge - radiusM - outerLaneOffset) * mergeT(angle);
            return edge - towardEdge;
        }
    }

    private addVariableCurvedCurb(
        radiusAt: (angle: number) => number,
        centerX: number,
        centerZ: number,
        startAngle: number,
        endAngle: number,
        parent: THREE.Group,
    ): void {
        const band = CURB_VISUAL_WIDTH_M;
        const count = Math.max(8, Math.ceil(Math.abs(endAngle - startAngle) * 12));
        for (let index = 0; index < count; index++) {
            const from = startAngle + (endAngle - startAngle) * index / count;
            const to = startAngle + (endAngle - startAngle) * (index + 1) / count;
            const shape = new THREE.Shape();
            shape.moveTo(
                centerX + radiusAt(from) * Math.cos(from),
                centerZ + radiusAt(from) * Math.sin(from),
            );
            shape.lineTo(
                centerX + radiusAt(to) * Math.cos(to),
                centerZ + radiusAt(to) * Math.sin(to),
            );
            shape.lineTo(
                centerX + (radiusAt(to) - band) * Math.cos(to),
                centerZ + (radiusAt(to) - band) * Math.sin(to),
            );
            shape.lineTo(
                centerX + (radiusAt(from) - band) * Math.cos(from),
                centerZ + (radiusAt(from) - band) * Math.sin(from),
            );
            shape.closePath();
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: CURB_VISUAL_HEIGHT_M,
                bevelEnabled: false,
                curveSegments: 1,
            });
            geometry.rotateX(Math.PI / 2);
            const curb = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({
                    color: index % 2 === 0 ? 0xffffff : 0xd83b3b,
                    roughness: 0.85,
                }),
            );
            curb.name = 'red-white-curb';
            curb.position.y = 0.085;
            curb.castShadow = true;
            curb.receiveShadow = true;
            parent.add(curb);
        }
    }

    private addVariableCurvedLine(
        radiusAt: (angle: number) => number,
        centerX: number,
        centerZ: number,
        startAngle: number,
        endAngle: number,
        color: number,
        name: string,
        parent: THREE.Group,
        includeAngle: (angle: number) => boolean = () => true,
    ): void {
        const points: THREE.Vector3[] = [];
        const segments = 64;
        for (let index = 0; index <= segments; index++) {
            const angle = startAngle + (endAngle - startAngle) * index / segments;
            if (!includeAngle(angle)) continue;
            const radius = radiusAt(angle);
            points.push(new THREE.Vector3(
                centerX + radius * Math.cos(angle),
                0.067,
                centerZ + radius * Math.sin(angle),
            ));
        }
        if (points.length < 2) return;
        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({ color }),
        );
        line.name = name;
        parent.add(line);
    }

    private addVariableCurvedDashedLine(
        radiusAt: (angle: number) => number,
        centerX: number,
        centerZ: number,
        startAngle: number,
        endAngle: number,
        dashLengthM: number,
        dashGapM: number,
        parent: THREE.Group,
        includeAngle: (angle: number) => boolean = () => true,
    ): void {
        const period = dashLengthM + dashGapM;
        const segments = 96;
        let traveled = 0;
        let dash: THREE.Vector3[] = [];
        const flush = () => {
            if (dash.length < 2) {
                dash = [];
                return;
            }
            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(dash),
                new THREE.LineBasicMaterial({ color: 0xffffff }),
            );
            line.name = 'white-dashed-curve';
            parent.add(line);
            dash = [];
        };
        let previous: THREE.Vector3 | null = null;
        for (let index = 0; index <= segments; index++) {
            const angle = startAngle + (endAngle - startAngle) * index / segments;
            const radius = radiusAt(angle);
            const point = new THREE.Vector3(
                centerX + radius * Math.cos(angle),
                0.067,
                centerZ + radius * Math.sin(angle),
            );
            if (previous) traveled += previous.distanceTo(point);
            const drawing = includeAngle(angle) && traveled % period < dashLengthM;
            if (drawing) dash.push(point);
            else flush();
            previous = point;
        }
        flush();
    }

    private addCurvedCurbPattern(
        innerRadius: number,
        outerRadius: number,
        centerX: number,
        centerZ: number,
        startAngle: number,
        endAngle: number,
        parent: THREE.Group,
    ): void {
        const averageRadius = (innerRadius + outerRadius) / 2;
        const segmentAngle = 0.8 / averageRadius;
        const count = Math.ceil((endAngle - startAngle) / segmentAngle);

        for (let index = 0; index < count; index++) {
            const from = startAngle + (endAngle - startAngle) * index / count;
            const to = startAngle + (endAngle - startAngle) * (index + 1) / count;
            const shape = new THREE.Shape();
            shape.absarc(centerX, centerZ, outerRadius, from, to, false);
            shape.lineTo(
                centerX + innerRadius * Math.cos(to),
                centerZ + innerRadius * Math.sin(to),
            );
            shape.absarc(centerX, centerZ, innerRadius, to, from, true);
            shape.closePath();
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: CURB_VISUAL_HEIGHT_M,
                bevelEnabled: false,
                curveSegments: 8,
            });
            geometry.rotateX(Math.PI / 2);
            const curb = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({
                    color: index % 2 === 0 ? 0xffffff : 0xd83b3b,
                    roughness: 0.85,
                }),
            );
            curb.name = 'red-white-curb';
            // Khớp Y với addCurbPattern (đoạn thẳng): 0.08/2 + curbHeight/2 + 0.02
            curb.position.y = 0.085;
            curb.castShadow = true;
            curb.receiveShadow = true;
            parent.add(curb);
        }
    }

    private addCurvedDashedLine(
        radius: number,
        centerX: number,
        centerZ: number,
        startAngle: number,
        endAngle: number,
        dashLengthM: number,
        dashGapM: number,
        parent: THREE.Group,
    ): void {
        const totalLength = radius * (endAngle - startAngle);
        for (let start = 0; start < totalLength; start += dashLengthM + dashGapM) {
            const end = Math.min(start + dashLengthM, totalLength);
            this.addCurvedLine(
                `white-dashed-curve`,
                radius,
                centerX,
                centerZ,
                startAngle + start / radius,
                startAngle + end / radius,
                0xffffff,
                parent,
            );
        }
    }

    private addCurvedSolidLine(
        radius: number,
        centerX: number,
        centerZ: number,
        startAngle: number,
        endAngle: number,
        color: number,
        parent: THREE.Group,
    ): void {
        this.addCurvedLine('yellow-solid-center-curve', radius, centerX, centerZ, startAngle, endAngle, color, parent);
    }

    private addCurvedLine(
        name: string,
        radius: number,
        centerX: number,
        centerZ: number,
        startAngle: number,
        endAngle: number,
        color: number,
        parent: THREE.Group,
    ): void {
        const points: THREE.Vector3[] = [];
        const segments = Math.max(2, Math.ceil((endAngle - startAngle) * radius / 0.25));
        for (let index = 0; index <= segments; index++) {
            const angle = startAngle + (endAngle - startAngle) * index / segments;
            points.push(new THREE.Vector3(
                centerX + radius * Math.cos(angle),
                // Khớp Y với addWhiteDashedLine / addYellowSolidLine (đoạn thẳng): 0.067
                0.067,
                centerZ + radius * Math.sin(angle),
            ));
        }
        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({ color }),
        );
        line.name = name;
        parent.add(line);
    }

    /**
     * Vẽ vạch trắng đứt tại vị trí x.
     */
    private addWhiteDashedLine(
        x: number,
        lengthM: number,
        dashLengthM: number,
        dashGapM: number,
        parent: THREE.Group
    ) {
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const lineWidth = 0.15;
        const lineHeight = 0.008;

        for (let start = 0; start < lengthM; start += dashLengthM + dashGapM) {
            const dashLen = Math.min(dashLengthM, lengthM - start);
            if (dashLen <= 0) break;
            const dash = new THREE.Mesh(
                new THREE.BoxGeometry(lineWidth, lineHeight, dashLen),
                whiteMaterial,
            );
            dash.position.set(x, 0.067, -lengthM / 2 + start + dashLen / 2);
            dash.name = `white-dashed-${x > 0 ? 'right' : x < 0 ? 'left' : 'center'}`;
            dash.receiveShadow = true;
            parent.add(dash);
        }
    }

    /**
     * Vẽ dải curb đỏ-trắng ở một biên. `edgeX` là local X của mép ngoài curb.
     * Curb dày 0.2 m, cao 0.05 m, mỗi đoạn 0.8 m xen kẽ trắng/đỏ.
     */
    private addCurbPattern(edgeX: number, lengthM: number, parent: THREE.Group) {
        const curbWidth = CURB_VISUAL_WIDTH_M;
        const curbHeight = CURB_VISUAL_HEIGHT_M;
        const segmentLen = 0.8;
        const curbCenterX = edgeX - Math.sign(edgeX) * (curbWidth / 2);
        const count = Math.ceil(lengthM / segmentLen);

        for (let i = 0; i < count; i++) {
            const segLen = Math.min(segmentLen, lengthM - i * segmentLen);
            if (segLen <= 0) break;
            const color = i % 2 === 0 ? 0xffffff : 0xd83b3b;
            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(curbWidth, curbHeight, segLen),
                new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
            );
            curb.name = 'red-white-curb';
            curb.position.set(
                curbCenterX,
                0.08 / 2 + curbHeight / 2 + 0.02,
                -lengthM / 2 + i * segmentLen + segLen / 2,
            );
            curb.castShadow = true;
            curb.receiveShadow = true;
            parent.add(curb);
        }
    }

    /**
     * Vẽ vạch vàng liền tại vị trí x.
     */
    private addYellowSolidLine(x: number, lengthM: number, parent: THREE.Group) {
        const yellowMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.85 });
        const lineWidth = 0.15;
        const lineHeight = 0.008;

        const solidLine = new THREE.Mesh(
            new THREE.BoxGeometry(lineWidth, lineHeight, lengthM),
            yellowMaterial,
        );
        solidLine.position.set(x, 0.067, 0);
        solidLine.name = 'yellow-solid-center';
        solidLine.receiveShadow = true;
        parent.add(solidLine);
    }

    /** Số làn tạm thời, đặt cạnh mũi tên trên mặt đường. */
    private addLaneNumber(x: number, z: number, laneNumber: number, parent: THREE.Group): void {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.fillStyle = '#ffffff';
        context.font = 'bold 88px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String(laneNumber), canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const number = new THREE.Mesh(
            new THREE.PlaneGeometry(1.1, 1.1),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
        );
        number.rotation.x = -Math.PI / 2;
        number.position.set(x, 0.08, z);
        number.name = `lane-number-${laneNumber}`;
        parent.add(number);
    }

    /**
     * Vẽ mũi tên chỉ hướng tại tâm lane.
     * @param isBackward true nếu đi xuống (-Z), cần xoay 180°
     */
    private addArrow(
        x: number,
        isBackward: boolean,
        parent: THREE.Group,
        type: 'straight' | 'diagonal-left' | 'diagonal-right' = 'straight',
    ) {
        const texture = createRoadArrowTexture(type);
        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(STRAIGHT_ROAD_ARROW_WIDTH_M, STRAIGHT_ROAD_ARROW_LENGTH_M),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
        );
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(x, 0.081, 0);
        if (isBackward) {
            // Xoay 180° quanh trục Y để chĩa về -Z
            arrow.rotation.z = Math.PI;
        }
        arrow.name = isBackward ? 'arrow-backward' : 'arrow-forward';
        parent.add(arrow);
    }

    /**
     * Lấy chiều hướng (đơn vị vector) của lane.
     * @param index 0 = LANE_01, 1 = LANE_02, 2 = LANE_03, 3 = LANE_04
     */
    getLaneDirection(index: number): THREE.Vector3 {
        if (index < 0 || index >= 4) {
            throw new Error(`FourLaneBidirectionalRoad: lane index ${index} out of range (0-3)`);
        }
        // LANE_01, LANE_02: đi xuống (-Z)
        // LANE_03, LANE_04: đi lên (+Z)
        return (index < 2)
            ? new THREE.Vector3(0, 0, -1)
            : new THREE.Vector3(0, 0, 1);
    }
}

/**
 * Validate FourLaneBidirectionalRoad theo spec.
 */
export function validateFourLaneBidirectionalRoad(road: FourLaneBidirectionalRoad): void {
    if (road.laneCentersX.length !== 4) {
        throw new Error('FourLaneBidirectionalRoad must have 4 lanes');
    }
    if (road.laneWidthM <= 0) {
        throw new Error('FourLaneBidirectionalRoad: laneWidthM must be > 0');
    }
    if (road.lengthM <= 0) {
        throw new Error('FourLaneBidirectionalRoad: lengthM must be > 0');
    }
    // Validate directions
    const dir01 = road.getLaneDirection(0);
    const dir02 = road.getLaneDirection(1);
    const dir03 = road.getLaneDirection(2);
    const dir04 = road.getLaneDirection(3);

    if (dir01.z !== -1 || dir02.z !== -1) {
        throw new Error('Lane 01/02 must travel downward (-Z)');
    }
    if (dir03.z !== 1 || dir04.z !== 1) {
        throw new Error('Lane 03/04 must travel upward (+Z)');
    }
}
