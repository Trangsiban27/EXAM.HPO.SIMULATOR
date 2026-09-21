import * as THREE from 'three';

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
    examBoundaryWidthM: 0.10,
    physicalEdgeOffsetM: 0.25,
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
    /** Bán kính bo góc đầu xa (m). Mặc định 0.3. Phải 0 < R ≤ depth. */
    cornerRadiusM?: number;
    /** Độ dày vạch đỏ sát hạch (m). Mặc định 0.10. */
    examBoundaryWidthM?: number;
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
}

export class ParallelParkingBayB {
    readonly root: THREE.Group;
    readonly surfaceGroup: THREE.Group;
    readonly examBoundaryGroup: THREE.Group;
    readonly physicalEdgeGroup: THREE.Group;
    readonly logicGroup: THREE.Group;
    readonly debugGroup: THREE.Group;

    readonly lengthM: number;
    readonly depthM: number;
    readonly cornerRadiusM: number;
    readonly examBoundaryWidthM: number;
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
        const lengthM = PARALLEL_PARKING_B.parkingLengthM;
        const depthM = PARALLEL_PARKING_B.parkingDepthM;
        const cornerRadiusM = opts.cornerRadiusM ?? PARALLEL_PARKING_B.cornerRadiusM;
        const examBoundaryWidthM = opts.examBoundaryWidthM ?? PARALLEL_PARKING_B.examBoundaryWidthM;
        const physicalEdgeOffsetM = opts.physicalEdgeOffsetM ?? PARALLEL_PARKING_B.physicalEdgeOffsetM;
        const curbWidthM = opts.curbWidthM ?? 0.15;
        const curbHeightM = opts.curbHeightM ?? 0.05;
        const curbPattern = opts.curbPattern ?? 'red-white';
        const curbSegmentLengthM = opts.curbSegmentLengthM ?? 0.8;
        const curbColor = opts.curbColor ?? '#2c2c2e';
        const surfaceColor = opts.surfaceColor ?? '#2a2a2a';
        const side = opts.side ?? 'RIGHT';
        const rotationY = opts.rotationY ?? 0;
        const showDebug = opts.showDebug ?? false;

        // Validation theo Spec §26:
        if (Math.abs(lengthM - 6.615) > 0.001) {
            throw new Error('B-class parking length must be 6.615 m');
        }
        if (Math.abs(depthM - 2.125) > 0.001) {
            throw new Error('B-class parking depth must be 2.125 m');
        }
        if (cornerRadiusM <= 0 || cornerRadiusM > depthM) {
            throw new Error('ParallelParkingBayB: invalid corner radius (must be 0 < R ≤ depth)');
        }
        if (examBoundaryWidthM <= 0) {
            throw new Error('ParallelParkingBayB: examBoundaryWidthM must be > 0');
        }
        if (physicalEdgeOffsetM < 0) {
            throw new Error('ParallelParkingBayB: physicalEdgeOffsetM must be ≥ 0');
        }

        this.lengthM = lengthM;
        this.depthM = depthM;
        this.cornerRadiusM = cornerRadiusM;
        this.examBoundaryWidthM = examBoundaryWidthM;
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
        root.name = 'parallel-parking-bay-b';
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

        const surfaceMesh = new THREE.Mesh(
            new THREE.BoxGeometry(totalDepth, 0.08, totalLength),
            new THREE.MeshStandardMaterial({
                color: this.surfaceColor,
                roughness: 0.95,
            })
        );
        surfaceMesh.position.set(sideSign * (totalDepth / 2), 0.02, 0);
        surfaceMesh.name = 'parking-surface';
        surfaceMesh.receiveShadow = true;
        this.surfaceGroup.add(surfaceMesh);
    }

    /**
     * Vạch đỏ sát hạch (Spec §5, §6, §11, §12).
     * Gồm 3 thành phần con theo Spec §6 và §21:
     *   - TopRedLine: đoạn thẳng song song trục X tại Z = +L/2
     *   - FarEndRedLine: nối top và bottom gồm 2 cung tròn chuẩn R và đoạn thẳng đáy X = D
     *   - BottomRedLine: đoạn thẳng song song trục X tại Z = -L/2
     * Hard constraint: KHÔNG CÓ vạch nào ở open side (X=0).
     */
    private buildExamBoundary(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const L = this.lengthM;
        const D = this.depthM;
        const R = this.cornerRadiusM;
        const W = this.examBoundaryWidthM;
        const H = 0.008;
        const Y = 0.06 + H / 2; // Nằm ngay trên mặt đường asphalt (Y=0.06)

        const redMat = new THREE.MeshStandardMaterial({
            color: '#e52521',
            roughness: 0.6,
            side: THREE.DoubleSide,
        });

        // 1. TopRedLine: thẳng từ X=0 đến X=D-R tại Z=+L/2
        const straightLen = D - R;
        const topRedLine = new THREE.Mesh(
            new THREE.BoxGeometry(straightLen, H, W),
            redMat
        );
        topRedLine.position.set(sideSign * (straightLen / 2), Y, +L / 2);
        topRedLine.name = 'TopRedLine';
        topRedLine.receiveShadow = true;
        this.examBoundaryGroup.add(topRedLine);

        // 2. BottomRedLine: thẳng từ X=0 đến X=D-R tại Z=-L/2
        const bottomRedLine = new THREE.Mesh(
            new THREE.BoxGeometry(straightLen, H, W),
            redMat
        );
        bottomRedLine.position.set(sideSign * (straightLen / 2), Y, -L / 2);
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

    /**
     * Dải mép vật lý / Curb viền phía ngoài.
     * Mặc định là dải viền xen kẽ đỏ-trắng (0xffffff và 0xd83b3b) như đường viền của Road.
     * Cửa vào phía road (X=0) hoàn toàn mở, không có curb (Spec §15).
     * Gồm:
     *   - TopCurb: các phân đoạn xen kẽ dọc trục X tại Z = +(L/2 + offset + W/2)
     *   - FarEndCurb: cung trên bo cong + cạnh xa dọc Z tại X = D+offset+W/2 + cung dưới bo cong
     *   - BottomCurb: các phân đoạn xen kẽ dọc trục X tại Z = -(L/2 + offset + W/2)
     */
    private buildPhysicalCurb(): void {
        const sideSign = this.side === 'LEFT' ? -1 : 1;
        const L = this.lengthM;
        const D = this.depthM;
        const R = this.cornerRadiusM;
        const offset = this.physicalEdgeOffsetM;
        const W = this.curbWidthM;
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

        // 1. TopCurb: chạy dọc X từ 0 đến D-R tại Z = +L/2 + offset + W/2
        const straightLen = D - R;
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
            const xMid = (i + 0.5) * topSegLen;
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

        // 3. BottomCurb: chạy dọc X từ D-R về 0 tại Z = -L/2 - offset - W/2
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
            // Đi từ góc bo D-R về phía cửa vào X=0
            const xMid = straightLen - (i + 0.5) * botSegLen;
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
}

/**
 * Factory helper theo Spec §31:
 */
export function createParallelParkingBayB(
    options: ParallelParkingBayBOptions
): THREE.Group {
    const bay = new ParallelParkingBayB(options);
    return bay.root;
}

/**
 * Validate ParallelParkingBayB theo Spec §26 (chạy lại các check dims).
 */
export function validateParallelParkingBayB(
    bay: ParallelParkingBayB | ParallelParkingBaySpec
): void {
    const length = 'lengthM' in bay ? bay.lengthM : bay.parkingLengthM;
    const depth = 'depthM' in bay ? bay.depthM : bay.parkingDepthM;
    const radius = bay.cornerRadiusM;

    if (Math.abs(length - 6.615) > 0.001) {
        throw new Error('B-class parking length must be 6.615 m');
    }
    if (Math.abs(depth - 2.125) > 0.001) {
        throw new Error('B-class parking depth must be 2.125 m');
    }
    if (radius <= 0 || radius > depth) {
        throw new Error('Invalid corner radius');
    }
}
