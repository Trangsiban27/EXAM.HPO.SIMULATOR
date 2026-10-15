import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';

/**
 * PARALLEL PARKING BAY SPEC — CHUỒNG GHÉP XE NGANG HẠNG B
 *
 * Dựng chuồng ghép xe ngang hạng B theo bản vẽ CAD sân sát hạch Hiệp Phát.
 * Tham khảo: spec/road/parallel_parking_bay_B_spec.md
 *
 * KÍCH THƯỚC CHUẨN (Spec §2, §26, §28):
 *   Lg = 6.615 m (chiều dài nơi đỗ, dọc road)
 *   Rg = 2.125 m (chiều sâu, từ road đi vào chuồng)
 *
 * TOPOLOGY (Spec §5, §8):
 *   - Chữ U mở về phía road (open side tại X=0; +X đi sâu vào chuồng).
 *   - Đầu trong bo cong tròn circular arc (cornerRadiusM).
 *   - Phía road mở: KHÔNG CÓ line hay curb đóng ngang cửa (Spec §5, §15).
 *   - Xe đỗ song song với road.
 *
 * HỆ LOCAL (Spec §3):
 *   +Z = dọc road / chiều dài chuồng (Z = -L/2 .. +L/2, tâm tại Z = 0)
 *   +X = từ road đi vào chuồng (X = 0 .. Rg)
 *   +Y = lên trên (mặt đường asphalt tại Y = 0.02..0.06)
 *
 * SCENE GRAPH (Spec §21):
 *   ParallelParkingBay_B
 *   ├── Surface
 *   │   └── ParkingSurface
 *   ├── ExamBoundary
 *   │   ├── TopRedLine
 *   │   ├── FarEndRedLine
 *   │   └── BottomRedLine
 *   ├── PhysicalEdge
 *   │   ├── TopCurb
 *   │   ├── FarEndCurb
 *   │   └── BottomCurb
 *   ├── Logic
 *   │   ├── ParkingInteriorZone
 *   │   ├── EntryGate
 *   │   └── ExitGate
 *   └── Debug
 *       ├── LengthDimension
 *       ├── DepthDimension
 *       ├── CornerRadius
 *       ├── OpenSide
 *       └── VehicleReference
 */

export interface ParallelParkingBaySpec {
    id: string;
    parkingLengthM: number;
    parkingDepthM: number;
    cornerRadiusM: number;
    examBoundaryWidthM: number;
    physicalEdgeOffsetM?: number;
    placement: {
        x: number;
        y: number;
        z: number;
        rotationY: number;
    };
}

export const PARALLEL_PARKING_B = {
    id: 'PARKING_BAY_PARALLEL_B',
    parkingLengthM: 6.615,
    parkingDepthM: 2.125,
    cornerRadiusM: 0.3,
    asphaltCornerRadiusM: 1,
    examBoundaryWidthM: 0.10,
    physicalEdgeOffsetM: 0.25,
} as const;

/**
 * Vehicle class types supported for parallel parking bay.
 */
export type VehicleClass = 'B' | 'D' | 'E';

/**
 * Thông số kỹ thuật xe theo từng hạng.
 * Theo spec hiep_phat_exam_yard_standard_v2_corrected.md §14
 */
export const VEHICLE_SPECS = {
    B: {
        model: 'VIOS 1.5E (2017)',
        a: 4.410,  // chiều dài xe
        b: 1.700,  // chiều rộng xe
        B1: 0.185,
        Rqv: 5.100,
        L: 2.550,
    },
    D: {
        model: 'COUTY HD29 E3',
        a: 7.060,
        b: 2.080,
        B1: 0.440,
        Rqv: 7.400,
        L: 4.085,
    },
    E: {
        model: 'TRANSINCO K52 E2',
        a: 10.500,
        b: 2.500,
        B1: 0.590,
        Rqv: 10.000,
        L: 5.170,
    },
} as const;

/**
 * Kích thước chuồng đỗ theo từng hạng.
 * Công thức: Lg = 1.5 * a, Rg = 1.25 * b
 * Theo spec threejs_exam_yard_specification_v2.md §19
 * Lưu ý: Hạng D có Lg = 11.76667m và hạng E có Lg = 17.5m
 */
export const PARKING_BAY_SIZES: Record<VehicleClass, {
    parkingLengthM: number;
    parkingDepthM: number;
    cornerRadiusM: number;
}> = {
    B: { parkingLengthM: 6.615, parkingDepthM: 2.125, cornerRadiusM: 0.3 },   // Lg=1.5*4.41, Rg=1.25*1.7
    D: { parkingLengthM: 11.76667, parkingDepthM: 2.60, cornerRadiusM: 0.3 },   // Lg theo bảng kích thước trên bản vẽ
    E: { parkingLengthM: 17.5, parkingDepthM: 3.125, cornerRadiusM: 0.3 },    // Lg=17.5, Rg=1.25*2.5
} as const;

export interface ParallelParkingBayBOptions {
    /** Tâm chuồng / điểm đặt theo trục X (world). */
    x: number;
    /** Tâm chuồng / điểm đặt theo trục Z (world). */
    z: number;
    /**
     * Xoay toàn bộ bay quanh trục Y (radians). Mặc định 0 (open side tại X=0 quay về -X world).
     */
    rotationY?: number;
    /** Bán kính bo góc đầu xa (m). Mặc định theo vehicleClass. Phải 0 < R ≤ depth. */
    cornerRadiusM?: number;
    /** Bán kính hai góc ngoài của mặt nhựa ở đầu sâu trong chuồng. Mặc định 1 m. */
    asphaltCornerRadiusM?: number;
    /** Độ dày vạch đỏ sát hạch (m). Mặc định 0.10. */
    examBoundaryWidthM?: number;
    /** Điểm bắt đầu hai nhánh vạch đỏ tính từ cửa chuồng (m). Mặc định bằng physicalEdgeOffsetM. */
    examBoundaryStartM?: number;
    /** Vẽ vạch vàng đứt dọc cửa chuồng. Mặc định false. */
    yellowDashedEntrance?: boolean;
    /** Kéo hai đầu curb đỏ-trắng của chuồng tới curb đường chính. Mặc định false. */
    joinRoadCurb?: boolean;
    /** Khoảng cách từ mép ngoài vạch đỏ sát hạch đến mép trong curb đen (m). Mặc định 0.25. */
    physicalEdgeOffsetM?: number;
    /** Bề dày dải curb đen (m). Mặc định 0.15. */
    curbWidthM?: number;
    /** Chiều cao curb đen (m). Mặc định 0.05. */
    curbHeightM?: number;
    /** Kiểu viền curb: 'red-white' (xen kẽ đỏ-trắng như Road, mặc định) hoặc 'solid' (màu đơn). */
    curbPattern?: 'red-white' | 'solid';
    /** Chiều dài mỗi đoạn curb xen kẽ (m). Mặc định 0.8 như đường viền của Road. */
    curbSegmentLengthM?: number;
    /** Màu curb khi curbPattern là 'solid' (mặc định '#2c2c2e'). */
    curbColor?: string;
    /** Màu mặt đường asphalt (mặc định '#2a2a2a'). */
    surfaceColor?: string;
    /** Phía đặt chuồng so với đường: 'RIGHT' (mặc định, +X vào chuồng) hoặc 'LEFT' (-X vào chuồng). */
    side?: 'LEFT' | 'RIGHT';
    /** Bật debug dimensions, reference vehicle, labels. Mặc định false. */
    showDebug?: boolean;
    /**
     * Hạng xe: 'B', 'D', hoặc 'E'.
     * Mặc định 'B'.
     * Kích thước chuồng sẽ được tự động set theo vehicleClass.
     */
    vehicleClass?: VehicleClass;
    /** Override chiều dài nơi đỗ (m). Mặc định theo vehicleClass. */
    parkingLengthM?: number;
    /** Override chiều sâu nơi đỗ (m). Mặc định theo vehicleClass. */
    parkingDepthM?: number;
}

export class ParallelParkingBayB {
    readonly root: THREE.Group;
    readonly surfaceGroup: THREE.Group;
    readonly examBoundaryGroup: THREE.Group;
    readonly physicalEdgeGroup: THREE.Group;
    readonly logicGroup: THREE.Group;
    readonly debugGroup: THREE.Group;

    /** Vehicle class: 'B', 'D', or 'E' */
    readonly vehicleClass: VehicleClass;
    /** Vehicle spec for the current class */
    readonly vehicleSpec: typeof VEHICLE_SPECS[VehicleClass];

    readonly lengthM: number;
    readonly depthM: number;
    readonly cornerRadiusM: number;
    readonly asphaltCornerRadiusM: number;
    readonly examBoundaryWidthM: number;
    readonly examBoundaryStartM: number;
    readonly joinRoadCurb: boolean;
    readonly physicalEdgeOffsetM: number;
    readonly curbWidthM: number;
    readonly curbHeightM: number;
    readonly curbPattern: 'red-white' | 'solid';
    readonly curbSegmentLengthM: number;
    readonly curbColor: string;
    readonly surfaceColor: string;
    readonly side: 'LEFT' | 'RIGHT';
    readonly rotationY: number;

    private _showDebug: boolean;

    constructor(opts: ParallelParkingBayBOptions) {
        // Lấy vehicle class, mặc định 'B'
        const vehicleClass = opts.vehicleClass ?? 'B';

        // Lấy kích thước chuẩn theo class
        const sizeConfig = PARKING_BAY_SIZES[vehicleClass];
        const vehicleSpec = VEHICLE_SPECS[vehicleClass];

        // Override với giá trị từ options nếu có, không thì dùng class spec
        const lengthM = opts.parkingLengthM ?? sizeConfig.parkingLengthM;
        const depthM = opts.parkingDepthM ?? sizeConfig.parkingDepthM;
        const cornerRadiusM = opts.cornerRadiusM ?? sizeConfig.cornerRadiusM;
        const asphaltCornerRadiusM = opts.asphaltCornerRadiusM ?? PARALLEL_PARKING_B.asphaltCornerRadiusM;
        const examBoundaryWidthM = opts.examBoundaryWidthM ?? PARALLEL_PARKING_B.examBoundaryWidthM;
        const physicalEdgeOffsetM = opts.physicalEdgeOffsetM ?? PARALLEL_PARKING_B.physicalEdgeOffsetM;
        const examBoundaryStartM = opts.examBoundaryStartM ?? physicalEdgeOffsetM;
        const curbWidthM = opts.curbWidthM ?? 0.15;
        const curbHeightM = opts.curbHeightM ?? CURB_VISUAL_HEIGHT_M;
        const curbPattern = opts.curbPattern ?? 'red-white';
        const curbSegmentLengthM = opts.curbSegmentLengthM ?? 0.8;
        const curbColor = opts.curbColor ?? '#2c2c2e';
        const surfaceColor = opts.surfaceColor ?? '#2a2a2a';
        const side = opts.side ?? 'RIGHT';
        const rotationY = opts.rotationY ?? 0;
        const showDebug = opts.showDebug ?? false;

        // Validation theo Spec §26 - dựa trên vehicle class
        const tolerance = 0.01;
        if (Math.abs(lengthM - sizeConfig.parkingLengthM) > tolerance) {
            throw new Error(`${vehicleClass}-class parking length must be ${sizeConfig.parkingLengthM} m (got ${lengthM})`);
        }
        if (Math.abs(depthM - sizeConfig.parkingDepthM) > tolerance) {
            throw new Error(`${vehicleClass}-class parking depth must be ${sizeConfig.parkingDepthM} m (got ${depthM})`);
        }
        if (cornerRadiusM <= 0 || cornerRadiusM > depthM) {
            throw new Error('ParallelParkingBayB: invalid corner radius (must be 0 < R ≤ depth)');
        }
        const asphaltDepthM = depthM + physicalEdgeOffsetM + curbWidthM + 0.10;
        const asphaltLengthM = lengthM + 2 * (physicalEdgeOffsetM + curbWidthM + 0.10);
        if (asphaltCornerRadiusM <= 0
            || asphaltCornerRadiusM > Math.min(asphaltDepthM, asphaltLengthM / 2)) {
            throw new Error('ParallelParkingBayB: asphalt corner radius must fit the surface');
        }
        if (examBoundaryWidthM <= 0) {
            throw new Error('ParallelParkingBayB: examBoundaryWidthM must be > 0');
        }
        if (examBoundaryStartM < 0 || examBoundaryStartM >= depthM - cornerRadiusM) {
            throw new Error('ParallelParkingBayB: examBoundaryStartM must be between 0 and depthM - cornerRadiusM');
        }
        if (physicalEdgeOffsetM < 0) {
            throw new Error('ParallelParkingBayB: physicalEdgeOffsetM must be ≥ 0');
        }

        // Lưu vehicle class và spec
        this.vehicleClass = vehicleClass;
        this.vehicleSpec = vehicleSpec;

        this.lengthM = lengthM;
        this.depthM = depthM;
        this.cornerRadiusM = cornerRadiusM;
        this.asphaltCornerRadiusM = asphaltCornerRadiusM;
        this.examBoundaryWidthM = examBoundaryWidthM;
        this.examBoundaryStartM = examBoundaryStartM;
        this.joinRoadCurb = opts.joinRoadCurb ?? false;
        this.physicalEdgeOffsetM = physicalEdgeOffsetM;
        this.curbWidthM = curbWidthM;
        this.curbHeightM = curbHeightM;
        this.curbPattern = curbPattern;
        this.curbSegmentLengthM = curbSegmentLengthM;
        this.curbColor = curbColor;
        this.surfaceColor = surfaceColor;
        this.side = side;
        this.rotationY = rotationY;
        this._showDebug = showDebug;

        // Root group — placement theo Spec §17:
        const root = new THREE.Group();
        root.name = `parallel-parking-bay-${vehicleClass.toLowerCase()}`;
        root.position.set(opts.x, 0, opts.z);
        root.rotation.y = rotationY;
        this.root = root;

        // Groups theo Scene Graph chuẩn Spec §21:
        this.surfaceGroup = new THREE.Group();
        this.surfaceGroup.name = 'Surface';
        root.add(this.surfaceGroup);

        this.examBoundaryGroup = new THREE.Group();
        this.examBoundaryGroup.name = 'ExamBoundary';
        root.add(this.examBoundaryGroup);

        this.physicalEdgeGroup = new THREE.Group();
        this.physicalEdgeGroup.name = 'PhysicalEdge';
        root.add(this.physicalEdgeGroup);

        this.logicGroup = new THREE.Group();
        this.logicGroup.name = 'Logic';
        root.add(this.logicGroup);

        this.debugGroup = new THREE.Group();
        this.debugGroup.name = 'Debug';
        this.debugGroup.visible = showDebug;
        root.add(this.debugGroup);

        // Xây dựng các lớp hình học
        this.buildSurface();
        this.buildExamBoundary();
        if (opts.yellowDashedEntrance) this.buildYellowDashedEntrance();
        this.buildPhysicalCurb();
        this.buildLogic();
        this.buildDebug();
    }

    public setDebug(visible: boolean): void {
        this._showDebug = visible;
        this.debugGroup.visible = visible;
    }

    public get showDebug(): boolean {
        return this._showDebug;
    }

    /**
     * Mặt đường asphalt (Spec §14).
     * Phẳng cùng Y với road (surface top = 0.06), cùng material, bao phủ toàn bộ chuồng và curb.
     */
    private buildSurface(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const totalDepth = this.depthM + this.physicalEdgeOffsetM + this.curbWidthM + 0.10;
        const totalLength = this.lengthM + 2 * (this.physicalEdgeOffsetM + this.curbWidthM + 0.10);
        const halfLength = totalLength / 2;
        const radius = this.asphaltCornerRadiusM;
        const surfaceShape = new THREE.Shape();
        surfaceShape.moveTo(0, -halfLength);
        surfaceShape.lineTo(totalDepth - radius, -halfLength);
        const appendArc = (centerZ: number, startAngle: number, endAngle: number) => {
            for (let i = 1; i <= 16; i++) {
                const angle = startAngle + (endAngle - startAngle) * i / 16;
                surfaceShape.lineTo(
                    totalDepth - radius + radius * Math.cos(angle),
                    -(centerZ + radius * Math.sin(angle)),
                );
            }
        };
        appendArc(halfLength - radius, Math.PI / 2, 0);
        surfaceShape.lineTo(totalDepth, halfLength - radius);
        appendArc(-halfLength + radius, 0, -Math.PI / 2);
        surfaceShape.lineTo(0, halfLength);
        surfaceShape.closePath();
        const surfaceGeometry = new THREE.ExtrudeGeometry(surfaceShape, {
            depth: 0.08, bevelEnabled: false,
        });
        surfaceGeometry.rotateX(-Math.PI / 2);

        const surfaceMesh = new THREE.Mesh(
            surfaceGeometry,
            new THREE.MeshStandardMaterial({
                color: this.surfaceColor,
                roughness: 0.95,
            })
        );
        surfaceMesh.scale.x = sideSign;
        surfaceMesh.position.y = -0.02;
        surfaceMesh.name = 'parking-surface';
        surfaceMesh.receiveShadow = true;
        this.surfaceGroup.add(surfaceMesh);
    }

    /**
     * Vạch đỏ sát hạch (Spec §5, §6, §11, §12).
     * Gồm 3 thành phần con theo Spec §6 và §21:
     *   - TopRedLine: đoạn thẳng song song trục X tại Z = +L/2, từ X = start đến X = D - R
     *   - FarEndRedLine: nối top và bottom gồm 2 cung tròn chuẩn R và đoạn thẳng đáy X = D
     *   - BottomRedLine: đoạn thẳng song song trục X tại Z = -L/2, từ X = start đến X = D - R
     * Cửa chuồng vẫn mở; examBoundaryStartM quyết định chỗ hai nhánh đỏ gặp mép đường.
     */
    private buildExamBoundary(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const L = this.lengthM;
        const D = this.depthM;
        const R = this.cornerRadiusM;
        const start = this.examBoundaryStartM;
        const W = this.examBoundaryWidthM;
        const H = 0.008;
        const Y = 0.06 + H / 2; // Nằm ngay trên mặt đường asphalt (Y=0.06)

        const redMat = new THREE.MeshStandardMaterial({
            color: '#f6d34c',
            roughness: 0.6,
            side: THREE.DoubleSide,
        });

        // Hai nhánh đỏ chạm mép đường khi start = 0; D/E giữ khoảng lùi mặc định.
        const straightLen = (D - R) - start;
        const topRedLine = new THREE.Mesh(
            new THREE.BoxGeometry(straightLen, H, W),
            redMat
        );
        topRedLine.position.set(sideSign * (start + straightLen / 2), Y, +L / 2);
        topRedLine.name = 'TopRedLine';
        topRedLine.receiveShadow = true;
        this.examBoundaryGroup.add(topRedLine);

        // 2. BottomRedLine: cùng điểm bắt đầu, ở đầu còn lại của chuồng.
        const bottomRedLine = new THREE.Mesh(
            new THREE.BoxGeometry(straightLen, H, W),
            redMat
        );
        bottomRedLine.position.set(sideSign * (start + straightLen / 2), Y, -L / 2);
        bottomRedLine.name = 'BottomRedLine';
        bottomRedLine.receiveShadow = true;
        this.examBoundaryGroup.add(bottomRedLine);

        // 3. FarEndRedLine: Group chứa cung trên, cạnh xa X=D, và cung dưới
        const farEndGroup = new THREE.Group();
        farEndGroup.name = 'FarEndRedLine';

        // Đoạn thẳng cạnh xa dọc Z: từ Z = -(L/2 - R) đến +(L/2 - R) tại X = D
        const farStraightLen = L - 2 * R;
        const farStraightMesh = new THREE.Mesh(
            new THREE.BoxGeometry(W, H, farStraightLen),
            redMat
        );
        farStraightMesh.position.set(sideSign * D, Y, 0);
        farStraightMesh.name = 'FarEndStraight';
        farStraightMesh.receiveShadow = true;
        farEndGroup.add(farStraightMesh);

        // Cung tròn góc trên phải: tâm (D-R, L/2-R), bán kính R, góc từ PI/2 xuống 0
        const topArcGeom = this.createCurvedStripGeometry(
            D - R,
            +L / 2 - R,
            R,
            W,
            Math.PI / 2,
            0,
            16,
            sideSign,
            Y
        );
        const topArcMesh = new THREE.Mesh(topArcGeom, redMat);
        topArcMesh.name = 'TopRightArc';
        topArcMesh.receiveShadow = true;
        farEndGroup.add(topArcMesh);

        // Cung tròn góc dưới phải: tâm (D-R, -L/2+R), bán kính R, góc từ 0 xuống -PI/2
        const bottomArcGeom = this.createCurvedStripGeometry(
            D - R,
            -L / 2 + R,
            R,
            W,
            0,
            -Math.PI / 2,
            16,
            sideSign,
            Y
        );
        const bottomArcMesh = new THREE.Mesh(bottomArcGeom, redMat);
        bottomArcMesh.name = 'BottomRightArc';
        bottomArcMesh.receiveShadow = true;
        farEndGroup.add(bottomArcMesh);

        this.examBoundaryGroup.add(farEndGroup);
    }

    /** Vạch vàng đứt dọc miệng chuồng, nằm giữa hai đầu vạch đỏ. */
    private buildYellowDashedEntrance(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const dashLengthM = Math.min(.48, this.lengthM);
        const dashGapM = .25;
        const dashCount = Math.max(1, Math.floor((this.lengthM + dashGapM) / (dashLengthM + dashGapM)));
        const paintedLengthM = dashCount * dashLengthM + (dashCount - 1) * dashGapM;
        const startZ = -paintedLengthM / 2 + dashLengthM / 2;
        const material = new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: .8 });
        const line = new THREE.Group();
        line.name = 'EntranceYellowDashedLine';
        for (let i = 0; i < dashCount; i++) {
            const dash = new THREE.Mesh(new THREE.BoxGeometry(.1, .008, dashLengthM), material);
            dash.name = `EntranceYellowDash_${i}`;
            dash.position.set(sideSign * this.examBoundaryStartM, .071,
                startZ + i * (dashLengthM + dashGapM));
            dash.receiveShadow = true;
            line.add(dash);
        }
        this.examBoundaryGroup.add(line);
    }

    /**
     * Dải mép vật lý / Curb viền phía ngoài.
     * Mặc định là dải viền xen kẽ đỏ-trắng (0xffffff và 0xd83b3b) như đường viền của Road.
     * Cửa vào phía road (X=0) hoàn toàn mở, không có curb (Spec §15).
     * Khi joinRoadCurb bật, hai đầu curb kéo tới mép đường chính.
     * Gồm:
     *   - TopCurb: các phân đoạn xen kẽ dọc trục X từ X=offset đến X=D-R, tại Z = +(L/2 + offset + W/2)
     *   - FarEndCurb: cung trên bo cong + cạnh xa dọc Z tại X = D+offset+W/2 + cung dưới bo cong
     *   - BottomCurb: các phân đoạn xen kẽ dọc trục X từ X=D-R về X=offset, tại Z = -(L/2 + offset + W/2)
     */
    private buildPhysicalCurb(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const L = this.lengthM;
        const D = this.depthM;
        const R = this.cornerRadiusM;
        const W = this.curbPattern === 'red-white'
            ? Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M)
            : this.curbWidthM;
        // Keep the physical envelope; paint only the outermost visible strip.
        const offset = this.physicalEdgeOffsetM + this.curbWidthM - W;
        const H = this.curbHeightM;
        const Y = 0.06 + H / 2; // Đặt trên mặt đường (surface top = 0.06)

        const whiteMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.85,
            side: THREE.DoubleSide,
        });
        const redMat = new THREE.MeshStandardMaterial({
            color: 0xd83b3b,
            roughness: 0.85,
            side: THREE.DoubleSide,
        });
        const solidMat = new THREE.MeshStandardMaterial({
            color: this.curbColor,
            roughness: 0.85,
            side: THREE.DoubleSide,
        });

        const getMat = (index: number) => {
            if (this.curbPattern === 'solid') return solidMat;
            return index % 2 === 0 ? whiteMat : redMat;
        };

        let runningIndex = 0;

        // 1. TopCurb: chạy dọc X từ mép đường (hoặc offset mặc định)
        // đến D-R tại Z = +L/2 + offset + W/2.
        const topStraightStart = this.joinRoadCurb ? -W / 2 : offset;
        const topStraightEnd = D - R;
        const straightLen = topStraightEnd - topStraightStart;
        const topCurbZ = +L / 2 + offset + W / 2;
        const topCurbGroup = new THREE.Group();
        topCurbGroup.name = 'TopCurb';
        topCurbGroup.position.set(0, Y, topCurbZ);

        // Chia đoạn thẳng trên thành các phân đoạn ~0.8m xen kẽ trắng/đỏ
        const topSegCount = Math.max(1, Math.round(straightLen / this.curbSegmentLengthM));
        const topSegLen = straightLen / topSegCount;
        for (let i = 0; i < topSegCount; i++) {
            const segMesh = new THREE.Mesh(
                new THREE.BoxGeometry(topSegLen, H, W),
                getMat(runningIndex++)
            );
            const xMid = topStraightStart + (i + 0.5) * topSegLen;
            segMesh.position.set(sideSign * xMid, 0, 0);
            segMesh.name = `TopCurbSeg_${i}`;
            segMesh.castShadow = true;
            segMesh.receiveShadow = true;
            topCurbGroup.add(segMesh);
        }
        this.physicalEdgeGroup.add(topCurbGroup);

        // 2. FarEndCurb: Group chứa cung trên, dải thẳng cạnh xa và cung dưới
        const farEndCurbGroup = new THREE.Group();
        farEndCurbGroup.name = 'FarEndCurb';

        // Cung tròn trên: tâm (D-R, L/2-R), rInner = R + offset, rOuter = R + offset + W
        // Góc từ PI/2 xuống 0, chia 2 đoạn xen kẽ
        const topArcGroup = new THREE.Group();
        topArcGroup.name = 'TopRightArcCurb';
        const topArcSubCount = 2;
        for (let i = 0; i < topArcSubCount; i++) {
            const aStart = Math.PI / 2 - (i / topArcSubCount) * (Math.PI / 2);
            const aEnd = Math.PI / 2 - ((i + 1) / topArcSubCount) * (Math.PI / 2);
            const arcGeom = this.createCurvedCurbGeometry(
                D - R,
                +L / 2 - R,
                R + offset,
                R + offset + W,
                H,
                aStart,
                aEnd,
                8,
                sideSign
            );
            const arcMesh = new THREE.Mesh(arcGeom, getMat(runningIndex++));
            arcMesh.name = `TopRightArcCurbSeg_${i}`;
            arcMesh.castShadow = true;
            arcMesh.receiveShadow = true;
            topArcGroup.add(arcMesh);
        }
        farEndCurbGroup.add(topArcGroup);

        // Đoạn thẳng cạnh xa dọc Z tại X = D + offset + W/2
        // Từ Z = +(L/2 - R) xuống -(L/2 - R), chiều dài = L - 2*R = 6.015m
        const farCurbX = D + offset + W / 2;
        const farStraightLen = L - 2 * R;
        const farSegCount = Math.max(1, Math.round(farStraightLen / this.curbSegmentLengthM));
        const farSegLen = farStraightLen / farSegCount;
        const farCurbGroup = new THREE.Group();
        farCurbGroup.name = 'FarCurbStraight';

        for (let i = 0; i < farSegCount; i++) {
            const segMesh = new THREE.Mesh(
                new THREE.BoxGeometry(W, H, farSegLen),
                getMat(runningIndex++)
            );
            const zMid = (+L / 2 - R) - (i + 0.5) * farSegLen;
            segMesh.position.set(sideSign * farCurbX, Y, zMid);
            segMesh.name = `FarCurbSeg_${i}`;
            segMesh.castShadow = true;
            segMesh.receiveShadow = true;
            farCurbGroup.add(segMesh);
        }
        farEndCurbGroup.add(farCurbGroup);

        // Cung tròn dưới: tâm (D-R, -L/2+R), rInner = R + offset, rOuter = R + offset + W
        // Góc từ 0 xuống -PI/2, chia 2 đoạn xen kẽ
        const bottomArcGroup = new THREE.Group();
        bottomArcGroup.name = 'BottomRightArcCurb';
        const botArcSubCount = 2;
        for (let i = 0; i < botArcSubCount; i++) {
            const aStart = - (i / botArcSubCount) * (Math.PI / 2);
            const aEnd = - ((i + 1) / botArcSubCount) * (Math.PI / 2);
            const arcGeom = this.createCurvedCurbGeometry(
                D - R,
                -L / 2 + R,
                R + offset,
                R + offset + W,
                H,
                aStart,
                aEnd,
                8,
                sideSign
            );
            const arcMesh = new THREE.Mesh(arcGeom, getMat(runningIndex++));
            arcMesh.name = `BottomRightArcCurbSeg_${i}`;
            arcMesh.castShadow = true;
            arcMesh.receiveShadow = true;
            bottomArcGroup.add(arcMesh);
        }
        farEndCurbGroup.add(bottomArcGroup);

        this.physicalEdgeGroup.add(farEndCurbGroup);

        // 3. BottomCurb: chạy dọc X từ D-R về điểm bắt đầu của TopCurb.
        const bottomCurbZ = -L / 2 - offset - W / 2;
        const bottomCurbGroup = new THREE.Group();
        bottomCurbGroup.name = 'BottomCurb';
        bottomCurbGroup.position.set(0, Y, bottomCurbZ);

        const botSegCount = topSegCount;
        const botSegLen = straightLen / botSegCount;
        for (let i = 0; i < botSegCount; i++) {
            const segMesh = new THREE.Mesh(
                new THREE.BoxGeometry(botSegLen, H, W),
                getMat(runningIndex++)
            );
            // Đi từ góc bo D-R về phía cửa vào, dừng tại topStraightStart.
            const xMid = topStraightEnd - (i + 0.5) * botSegLen;
            segMesh.position.set(sideSign * xMid, 0, 0);
            segMesh.name = `BottomCurbSeg_${i}`;
            segMesh.castShadow = true;
            segMesh.receiveShadow = true;
            bottomCurbGroup.add(segMesh);
        }
        this.physicalEdgeGroup.add(bottomCurbGroup);
    }

    /**
     * Logic components theo Spec §21, §22, §23, §24.
     * Mặc định ẩn trong production (`visible = false`).
     */
    private buildLogic(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const L = this.lengthM;
        const D = this.depthM;

        // Vùng interior zone để kiểm tra xe vào chuồng
        const interiorZone = new THREE.Mesh(
            new THREE.BoxGeometry(D, 0.6, L),
            new THREE.MeshBasicMaterial({ visible: false, wireframe: true, color: 0x00ff88 })
        );
        interiorZone.position.set(sideSign * (D / 2), 0.36, 0);
        interiorZone.name = 'parking-interior-zone';
        this.logicGroup.add(interiorZone);

        // Entry gate tại X = 0
        const entryGate = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 1.0, L),
            new THREE.MeshBasicMaterial({ visible: false, wireframe: true, color: 0x0088ff })
        );
        entryGate.position.set(0, 0.56, 0);
        entryGate.name = 'entry-gate';
        this.logicGroup.add(entryGate);

        // Exit gate tại X = 0
        const exitGate = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 1.0, L),
            new THREE.MeshBasicMaterial({ visible: false, wireframe: true, color: 0xffaa00 })
        );
        exitGate.position.set(0, 0.56, 0);
        exitGate.name = 'exit-gate';
        this.logicGroup.add(exitGate);
    }

    /**
     * Debug elements theo Spec §18, §19, §21, §31.
     * Bật khi `showDebug === true`.
     */
    private buildDebug(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const L = this.lengthM;
        const D = this.depthM;
        const R = this.cornerRadiusM;

        // 1. VehicleReference: Xe vàng tham chiếu CAD (Spec §18)
        const vehicleGroup = new THREE.Group();
        vehicleGroup.name = 'vehicle-reference';

        const carBodyMat = new THREE.MeshStandardMaterial({
            color: '#ffd000',
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.75,
        });
        const carBody = new THREE.Mesh(
            new THREE.BoxGeometry(1.70, 0.65, 4.30),
            carBodyMat
        );
        carBody.position.set(0, 0.45, 0);
        vehicleGroup.add(carBody);

        const carCabin = new THREE.Mesh(
            new THREE.BoxGeometry(1.45, 0.50, 2.20),
            new THREE.MeshStandardMaterial({
                color: '#ffe240',
                roughness: 0.2,
                transparent: true,
                opacity: 0.75,
            })
        );
        carCabin.position.set(0, 0.90, -0.20);
        vehicleGroup.add(carCabin);

        // 4 bánh xe mô phỏng
        const wheelGeom = new THREE.CylinderGeometry(0.30, 0.30, 0.20, 16);
        const wheelMat = new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.8 });
        wheelGeom.rotateZ(Math.PI / 2);

        const wheelOffsets = [
            [-0.80, 0.30, +1.30],
            [+0.80, 0.30, +1.30],
            [-0.80, 0.30, -1.30],
            [+0.80, 0.30, -1.30],
        ];
        wheelOffsets.forEach(([wx, wy, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, wheelMat);
            wheel.position.set(wx, wy, wz);
            vehicleGroup.add(wheel);
        });

        vehicleGroup.position.set(sideSign * (D / 2), 0.06, 0);
        this.debugGroup.add(vehicleGroup);

        // 2. LengthDimension: Thước đo chiều dài L = 6.615 m
        const lengthDimLine = this.createDebugDimensionLine(
            new THREE.Vector3(sideSign * -0.3, 0.08, -L / 2),
            new THREE.Vector3(sideSign * -0.3, 0.08, +L / 2),
            0x00e5ff
        );
        lengthDimLine.name = 'length-dimension';
        this.debugGroup.add(lengthDimLine);

        // 3. DepthDimension: Thước đo chiều sâu D = 2.125 m
        const depthDimLine = this.createDebugDimensionLine(
            new THREE.Vector3(0, 0.08, -L / 2 - 0.3),
            new THREE.Vector3(sideSign * D, 0.08, -L / 2 - 0.3),
            0x00e5ff
        );
        depthDimLine.name = 'depth-dimension';
        this.debugGroup.add(depthDimLine);

        // 4. CornerRadius: Đánh dấu bán kính bo góc R
        const cornerMarker = new THREE.Mesh(
            new THREE.RingGeometry(R - 0.02, R + 0.02, 16),
            new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide })
        );
        cornerMarker.rotation.x = -Math.PI / 2;
        cornerMarker.position.set(sideSign * (D - R), 0.075, +L / 2 - R);
        cornerMarker.name = 'corner-radius';
        this.debugGroup.add(cornerMarker);

        // 5. OpenSide: Đường mở đánh dấu phía road
        const openSideGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0.08, -L / 2),
            new THREE.Vector3(0, 0.08, +L / 2),
        ]);
        const openSideLine = new THREE.Line(
            openSideGeom,
            new THREE.LineDashedMaterial({ color: 0x00ff00, dashSize: 0.3, gapSize: 0.15 })
        );
        openSideLine.computeLineDistances();
        openSideLine.name = 'open-side';
        this.debugGroup.add(openSideLine);
    }

    /**
     * Tạo đường kích thước 2 đầu có vạch tick vuông góc.
     */
    private createDebugDimensionLine(start: THREE.Vector3, end: THREE.Vector3, color: number): THREE.Group {
        const group = new THREE.Group();
        const lineGeom = new THREE.BufferGeometry().setFromPoints([start, end]);
        group.add(new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color })));

        const dir = new THREE.Vector3().subVectors(end, start).normalize();
        const perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(0.12);

        const tick1Geom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3().addVectors(start, perp),
            new THREE.Vector3().subVectors(start, perp),
        ]);
        group.add(new THREE.Line(tick1Geom, new THREE.LineBasicMaterial({ color })));

        const tick2Geom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3().addVectors(end, perp),
            new THREE.Vector3().subVectors(end, perp),
        ]);
        group.add(new THREE.Line(tick2Geom, new THREE.LineBasicMaterial({ color })));

        return group;
    }

    /**
     * Dựng dải băng phẳng (planar ribbon) cho vạch kẻ đỏ bo góc tròn.
     */
    private createCurvedStripGeometry(
        cx: number,
        cz: number,
        radius: number,
        width: number,
        angleStart: number,
        angleEnd: number,
        segments: number = 16,
        sideSign: number = 1,
        y: number = 0.064
    ): THREE.BufferGeometry {
        const rIn = radius - width / 2;
        const rOut = radius + width / 2;
        const positions: number[] = [];
        const indices: number[] = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const theta = angleStart + t * (angleEnd - angleStart);
            const cosT = Math.cos(theta);
            const sinT = Math.sin(theta);

            const xIn = sideSign * (cx + rIn * cosT);
            const zIn = cz + rIn * sinT;
            const xOut = sideSign * (cx + rOut * cosT);
            const zOut = cz + rOut * sinT;

            positions.push(xIn, y, zIn);
            positions.push(xOut, y, zOut);

            if (i < segments) {
                const base = i * 2;
                indices.push(base, base + 2, base + 1);
                indices.push(base + 1, base + 2, base + 3);
            }
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();
        return geom;
    }

    /**
     * Dựng khối 3D curb prism đặc (có mặt trên, vách trong, vách ngoài) bo cong mượt mà.
     */
    private createCurvedCurbGeometry(
        cx: number,
        cz: number,
        radiusInner: number,
        radiusOuter: number,
        height: number,
        angleStart: number,
        angleEnd: number,
        segments: number = 16,
        sideSign: number = 1
    ): THREE.BufferGeometry {
        const yBot = 0.06;
        const yTop = 0.06 + height;
        const positions: number[] = [];
        const indices: number[] = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const theta = angleStart + t * (angleEnd - angleStart);
            const cosT = Math.cos(theta);
            const sinT = Math.sin(theta);

            const xIn = sideSign * (cx + radiusInner * cosT);
            const zIn = cz + radiusInner * sinT;
            const xOut = sideSign * (cx + radiusOuter * cosT);
            const zOut = cz + radiusOuter * sinT;

            // 4 đỉnh tại mỗi lát cắt i:
            positions.push(xIn, yTop, zIn);   // 4*i + 0 (top inner)
            positions.push(xOut, yTop, zOut);  // 4*i + 1 (top outer)
            positions.push(xIn, yBot, zIn);   // 4*i + 2 (bot inner)
            positions.push(xOut, yBot, zOut);  // 4*i + 3 (bot outer)

            if (i < segments) {
                const b = 4 * i;
                const nb = 4 * (i + 1);

                // Mặt trên (Top face):
                indices.push(b, nb, b + 1);
                indices.push(b + 1, nb, nb + 1);

                // Vách ngoài (Outer wall):
                indices.push(b + 1, nb + 1, b + 3);
                indices.push(b + 3, nb + 1, nb + 3);

                // Vách trong (Inner wall):
                indices.push(b, b + 2, nb);
                indices.push(nb, b + 2, nb + 2);
            }
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();
        return geom;
    }

    /**
     * Bounding box cục bộ của chuồng đỗ xe.
     */
    public getBounds(): { minX: number; maxX: number; minZ: number; maxZ: number; lengthM: number; depthM: number } {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const xMin = sideSign > 0 ? 0 : -this.depthM;
        const xMax = sideSign > 0 ? this.depthM : 0;
        return {
            minX: xMin,
            maxX: xMax,
            minZ: -this.lengthM / 2,
            maxZ: +this.lengthM / 2,
            lengthM: this.lengthM,
            depthM: this.depthM,
        };
    }

    /**
     * Kiểm tra điểm (local X, Z) có nằm trong lòng chuồng hay không.
     */
    public isPointInside(x: number, z: number): boolean {
        const b = this.getBounds();
        return x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ;
    }

    /**
     * Lấy thông số kích thước chuẩn theo vehicle class.
     */
    public static getParkingSize(vehicleClass: VehicleClass): {
        parkingLengthM: number;
        parkingDepthM: number;
        cornerRadiusM: number;
    } {
        return { ...PARKING_BAY_SIZES[vehicleClass] };
    }

    /**
     * Lấy thông số xe theo vehicle class.
     */
    public static getVehicleSpec(vehicleClass: VehicleClass): typeof VEHICLE_SPECS['B'] {
        return { ...VEHICLE_SPECS[vehicleClass] } as typeof VEHICLE_SPECS['B'];
    }
}

/**
 * Factory helper theo Spec §31:
 */
export function createParallelParkingBay(
    options: ParallelParkingBayBOptions
): THREE.Group {
    const bay = new ParallelParkingBayB(options);
    return bay.root;
}

/**
 * Validate ParallelParkingBayB theo Spec §26 (chạy lại các check dims).
 * Hỗ trợ tất cả các vehicle class B, D, E.
 */
export function validateParallelParkingBay(
    bay: ParallelParkingBayB | ParallelParkingBaySpec,
    expectedClass?: VehicleClass
): void {
    const length = 'lengthM' in bay ? bay.lengthM : bay.parkingLengthM;
    const depth = 'depthM' in bay ? bay.depthM : bay.parkingDepthM;
    const radius = bay.cornerRadiusM;

    // Xác định class cần validate
    const classToValidate = expectedClass ??
        (bay instanceof ParallelParkingBayB ? bay.vehicleClass : 'B');

    const expected = PARKING_BAY_SIZES[classToValidate];
    const tolerance = 0.01;

    if (Math.abs(length - expected.parkingLengthM) > tolerance) {
        throw new Error(`${classToValidate}-class parking length must be ${expected.parkingLengthM} m (got ${length})`);
    }
    if (Math.abs(depth - expected.parkingDepthM) > tolerance) {
        throw new Error(`${classToValidate}-class parking depth must be ${expected.parkingDepthM} m (got ${depth})`);
    }
    if (radius <= 0 || radius > depth) {
        throw new Error('Invalid corner radius');
    }
}

/**
 * @deprecated Use validateParallelParkingBay instead.
 */
export function validateParallelParkingBayB(
    bay: ParallelParkingBayB | ParallelParkingBaySpec
): void {
    validateParallelParkingBay(bay, 'B');
}
