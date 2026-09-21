import * as THREE from 'three';

/**
 * FourLaneRoad
 *
 * Dựng một đoạn đường thẳng gồm `laneCount` làn song song (mặc định 5 theo
 * spec 6A), mỗi làn rộng `laneWidthM` (mặc định 3.70 m), tổng rộng =
 * `laneCount * laneWidthM`. Trục đứng (song song world Z).
 *
 * Phân chia giao thông:
 * - Lane 01 (ngoài cùng phải, local +X): đi xuống (-Z).
 * - Lane 02..laneCount: đi lên (+Z).
 * - Giữa lane 01 và lane 02: vạch LIỀN nét (phân chia 2 chiều).
 * - Giữa các lane 02↔03, 03↔04, …: vạch ĐỨT trắng.
 * - 2 biên ngoài: curb đỏ-trắng.
 * - Mỗi lane có 1 mũi tên chỉ hướng (lane 01 xoay ngược).
 *
 * Chiều dài `lengthM` BẮT BUỘC từ caller — không tự suy ra từ thông số CAD.
 *
 * Tham khảo cấu trúc: spec/road/road_6A_object_spec.md.
 */
export interface FourLaneRoadOptions {
    /** Tâm road theo trục X (world). */
    x: number;
    /** Tâm road theo trục Z (world). */
    z: number;
    /** Chiều dài đoạn đường theo trục Z (m). */
    lengthM: number;
    /** Số làn. Mặc định 5 (theo spec 6A). */
    laneCount?: number;
    /** Chiều rộng mỗi làn (m). Mặc định 3.70 (theo spec 6A). */
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

export class FourLaneRoad {
    readonly root: THREE.Group;
    readonly lengthM: number;
    readonly laneCount: number;
    readonly laneWidthM: number;
    readonly widthM: number;
    /** Xoay quanh trục Y (radians). */
    readonly rotationY: number;
    /** Tâm các lane theo local X. Chỉ số 0..laneCount-1 tương ứng lane ngoài cùng trái..ngoài cùng phải. */
    readonly laneCentersX: number[];

    constructor(opts: FourLaneRoadOptions) {
        const lengthM = opts.lengthM;
        const laneCount = opts.laneCount ?? 5;
        const laneWidthM = opts.laneWidthM ?? 3.7;
        const dashLengthM = opts.dashLengthM ?? 1.5;
        const dashGapM = opts.dashGapM ?? 1.0;
        const withArrows = opts.withArrows ?? true;
        const rotationY = opts.rotationY ?? 0;

        if (lengthM <= 0) throw new Error('FourLaneRoad: lengthM must be > 0');
        if (laneCount < 2) throw new Error('FourLaneRoad: laneCount must be >= 2');
        if (laneWidthM <= 0) throw new Error('FourLaneRoad: laneWidthM must be > 0');

        const widthM = laneCount * laneWidthM;

        this.lengthM = lengthM;
        this.laneWidthM = laneWidthM;
        this.laneCount = laneCount;
        this.widthM = widthM;
        this.rotationY = rotationY;

        // Tính tâm các lane theo local X.
        // Công thức (theo spec 6A §3.2): centerX = -roadWidth/2 + laneWidth/2 + index*laneWidth,
        // với index = 0..laneCount-1 theo thứ tự trái → phải.
        // Lane 01 (ngoài cùng phải) = index (laneCount-1) → đi -Z.
        // Lane 02..laneCount (các lane còn lại, đi +Z).
        const halfW = widthM / 2;
        const laneCentersX: number[] = [];
        for (let i = 0; i < laneCount; i++) {
            laneCentersX.push(-halfW + laneWidthM / 2 + i * laneWidthM);
        }
        this.laneCentersX = laneCentersX;

        const root = new THREE.Group();
        root.name = 'four-lane-road';
        root.position.set(opts.x, 0, opts.z);
        root.rotation.y = rotationY;
        this.root = root;

        // 1. Mặt đường (asphalt).
        const surface = new THREE.Mesh(
            new THREE.BoxGeometry(widthM, 0.08, lengthM),
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 }),
        );
        surface.position.set(0, 0.02, 0);
        surface.name = 'road-surface';
        surface.receiveShadow = true;
        root.add(surface);

        // 2. Curb đỏ-trắng ở 2 biên ngoài cùng.
        this.addCurbPattern(+halfW, lengthM, root);
        this.addCurbPattern(-halfW, lengthM, root);

        // 3. Vạch liền phân chia 2 chiều giữa lane 01 (ngoài cùng phải) và lane 02 (kế tiếp).
        //    Vị trí = trung điểm cạnh phải của lane 02 ↔ cạnh trái của lane 01.
        const centerRight = laneCentersX[laneCount - 1]; // lane 01
        const centerNext  = laneCentersX[laneCount - 2]; // lane 02
        const dividerX = (centerRight + centerNext) / 2;
        const solidDivider = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.008, lengthM),
            new THREE.MeshStandardMaterial({ color: '#fcde59', roughness: 0.85 }),
        );
        solidDivider.position.set(dividerX, 0.067, 0);
        solidDivider.name = 'direction-divider';
        solidDivider.receiveShadow = true;
        root.add(solidDivider);

        // 4. Vạch đứt giữa các cặp lane cùng chiều (lane 02↔03, 03↔04, …, (N-1)↔N).
        //    Mapping index → lane: laneCentersX[laneCount - i - 1] = lane i.
        //    Cặp giữa lane i và lane i+1 có index = laneCount - i - 1 và laneCount - i - 2,
        //    với i chạy 2..laneCount-1.
        //    Tên lane-line theo quy ước: số nhỏ (phía phải) trước, số lớn (phía trái) sau.
        const separatorPositions: Array<{ x: number; lanePair: string }> = [];
        for (let i = 2; i <= laneCount - 1; i++) {
            const rightIdx = laneCount - i;         // lane i   — phía phải (X lớn hơn)
            const leftIdx  = laneCount - i - 1;     // lane i+1 — phía trái (X nhỏ hơn)
            const x = (laneCentersX[leftIdx] + laneCentersX[rightIdx]) / 2;
            const pair = `${String(i).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
            separatorPositions.push({ x, lanePair: pair });
        }
        const whiteDashed = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });

        for (const { x, lanePair } of separatorPositions) {
            for (let start = 0; start < lengthM; start += dashLengthM + dashGapM) {
                const dashLen = Math.min(dashLengthM, lengthM - start);
                if (dashLen <= 0) break;
                const dash = new THREE.Mesh(
                    new THREE.BoxGeometry(0.15, 0.008, dashLen),
                    whiteDashed,
                );
                dash.position.set(x, 0.067, -lengthM / 2 + start + dashLen / 2);
                dash.name = `lane-line-${lanePair}`;
                dash.receiveShadow = true;
                root.add(dash);
            }
        }

        // 5. Mũi tên chỉ hướng cho mỗi lane (giữa road theo trục Z).
        if (withArrows) {
            for (let i = 0; i < laneCount; i++) {
                const isLane01 = i === laneCount - 1; // lane 01 = index cuối cùng (ngoài cùng phải)
                // Đảo chiều: lane 01 giờ chĩa +Z (không xoay), các lane còn lại chĩa -Z (xoay π).
                const isBackward = !isLane01;
                this.addArrow(laneCentersX[i], 0, laneWidthM, lengthM, isBackward, root);
            }
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
            const length = Math.min(segmentLen, lengthM - i * segmentLen);
            if (length <= 0) break;
            const color = i % 2 === 0 ? 0xffffff : 0xd83b3b;
            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(curbWidth, curbHeight, length),
                new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
            );
            curb.position.set(
                curbCenterX,
                0.08 / 2 + curbHeight / 2 + 0.02,
                -lengthM / 2 + i * segmentLen + length / 2,
            );
            curb.castShadow = true;
            curb.receiveShadow = true;
            parent.add(curb);
        }
    }

    /**
     * Vẽ một mũi tên chỉ hướng tại (x, z) trong local space.
     * Lane 01 đi xuống (-Z) → mũi tên xoay 180° quanh trục Y.
     */
    private addArrow(
        x: number,
        z: number,
        laneWidthM: number,
        lengthM: number,
        isBackward: boolean,
        parent: THREE.Group,
    ) {
        const texture = this.createStraightArrowTexture();

        const arrowWidth = Math.min(laneWidthM * 0.32, 1.2);
        const arrowLength = Math.min(lengthM * 0.35, 3.4);
        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(arrowWidth, arrowLength),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
        );
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(x, 0.081, z);
        if (isBackward) {
            // Đảo chiều mũi tên: xoay quanh trục Y để chĩa về -Z.
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
     * Lấy chiều hướng (đơn vị vector) của lane `index`
     * (0..laneCount-1, ngoài cùng trái..ngoài cùng phải).
     * - Các lane trừ lane 01 (ngoài cùng phải): (0, 0, +1) (đi lên +Z)
     * - Lane 01 (ngoài cùng phải):               (0, 0, -1) (đi xuống -Z)
     */
    getLaneDirection(index: number): THREE.Vector3 {
        if (index < 0 || index >= this.laneCount) {
            throw new Error(`FourLaneRoad: lane index ${index} out of range`);
        }
        return index === this.laneCount - 1
            ? new THREE.Vector3(0, 0, -1)
            : new THREE.Vector3(0, 0, 1);
    }
}

/**
 * Validate FourLaneRoad theo spec §25 (tương tự road_6A).
 */
export function validateFourLaneRoad(road: FourLaneRoad): void {
    if (road.laneCount !== 5) {
        throw new Error('FourLaneRoad must have 5 lanes');
    }
    if (road.laneWidthM !== 3.7) {
        throw new Error('FourLaneRoad: each lane must be 3.70 m');
    }
    if (Math.abs(road.widthM - 18.5) > 1e-6) {
        throw new Error('FourLaneRoad: road width must be 18.50 m');
    }
    if (road.lengthM <= 0) {
        throw new Error('FourLaneRoad: lengthM must be > 0');
    }
}
