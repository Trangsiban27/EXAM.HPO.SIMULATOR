import * as THREE from 'three';

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
        const rotationY = opts.rotationY ?? 0;

        if (lengthM <= 0) throw new Error('FourLaneBidirectionalRoad: lengthM must be > 0');
        if (laneWidthM <= 0) throw new Error('FourLaneBidirectionalRoad: laneWidthM must be > 0');

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

        // 1. Mặt đường (asphalt) - một surface liên tục
        const surface = new THREE.Mesh(
            new THREE.BoxGeometry(widthM, 0.08, lengthM),
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 }),
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
            this.addArrow(this.laneCentersX[0], lengthM, laneWidthM, true, root);
            this.addArrow(this.laneCentersX[1], lengthM, laneWidthM, true, root);
            // LANE_03 và LANE_04 đi lên (+Z) → mũi tên hướng lên (không xoay)
            this.addArrow(this.laneCentersX[2], lengthM, laneWidthM, false, root);
            this.addArrow(this.laneCentersX[3], lengthM, laneWidthM, false, root);
        }
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
        const curbWidth = 0.2;
        const curbHeight = 0.05;
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

    /**
     * Vẽ mũi tên chỉ hướng tại tâm lane.
     * @param isBackward true nếu đi xuống (-Z), cần xoay 180°
     */
    private addArrow(
        x: number,
        lengthM: number,
        laneWidthM: number,
        isBackward: boolean,
        parent: THREE.Group
    ) {
        const texture = this.createStraightArrowTexture();

        const arrowWidth = Math.min(laneWidthM * 0.32, 1.2);
        const arrowLength = Math.min(lengthM * 0.35, 3.4);
        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(arrowWidth, arrowLength),
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
     * Tạo canvas texture vẽ mũi tên thẳng (đầu nhọn chĩa lên trong canvas).
     * Khi `rotation.x = -PI/2`, mũi tên chĩa về +Z trong world.
     */
    private createStraightArrowTexture(): THREE.CanvasTexture {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;

        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 28;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const cx = canvas.width / 2;

        // thân mũi tên
        ctx.beginPath();
        ctx.moveTo(cx, 420);
        ctx.lineTo(cx, 140);
        ctx.stroke();

        // đầu mũi tên
        ctx.beginPath();
        ctx.moveTo(cx, 90);
        ctx.lineTo(cx - 55, 165);
        ctx.lineTo(cx - 20, 165);
        ctx.lineTo(cx - 20, 250);
        ctx.lineTo(cx + 20, 250);
        ctx.lineTo(cx + 20, 165);
        ctx.lineTo(cx + 55, 165);
        ctx.closePath();
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
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
