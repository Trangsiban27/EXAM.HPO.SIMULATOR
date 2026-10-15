import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';
import {
    createStraightRoadArrowTexture,
    STRAIGHT_ROAD_ARROW_LENGTH_M,
    STRAIGHT_ROAD_ARROW_WIDTH_M,
} from './straightRoadArrow';

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
    /** Khoảng trống từ đầu local -Z đến nét đứt đầu tiên (m). Mặc định 0. */
    dashStartInsetM?: number;
    /** Số làn thấp hơn của cặp không vẽ vạch đứt: 1 là giữa làn 1 và 2. */
    hiddenLaneSeparators?: readonly number[];
    /** Có vẽ mũi tên chỉ hướng trên từng làn hay không. Mặc định true. */
    withArrows?: boolean;
    /** Có vẽ vạch chia làn trên mặt đường hay không. Mặc định true. */
    withLaneMarkings?: boolean;
    /** Tô nổi bật mặt đường. Mặc định false. */
    highlight?: boolean;
    /** Chỉ hiển thị vạch chia làn và đường biên ngoài. Mặc định false. */
    outlineOnly?: boolean;
    /** Hiển thị số thứ tự trên từng làn. Mặc định false. */
    withLaneNumbers?: boolean;
    /** Dịch hàng số làn dọc theo đường, theo local Z (m). */
    laneNumberOffsetM?: number;
    /** Các section nối tiếp theo local Z, từ -Z đến +Z. */
    sections?: Array<{
        lengthM: number;
        laneCount: number;
        dashStartInsetM?: number;
        hiddenLaneSeparators?: readonly number[];
        laneNumberOffsetM?: number;
    }>;
    /** Căn section hẹp về trái, giữa hoặc phải trong bề rộng lớn nhất. */
    sectionAlignment?: 'left' | 'center' | 'right';
    /**
     * Phía của làn đi ngược chiều, ngăn bằng vạch liền. Mặc định 'right'
     * (lane 01 ngoài cùng local +X); 'left' = làn ngoài cùng local -X.
     */
    dividerSide?: 'left' | 'right';
    /** Màu vạch liền chia hai chiều. Mặc định vàng. */
    dividerColor?: THREE.ColorRepresentation;
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
    /** Index của làn đi ngược chiều (-Z). */
    readonly oppositeLaneIndex: number;
    /** Phần mặt đường thực (local), mỗi section một hình chữ nhật. */
    readonly footprints: Array<{ minX: number; maxX: number; minZ: number; maxZ: number }> = [];

    constructor(opts: FourLaneRoadOptions) {
        const sections = opts.sections;
        const lengthM = sections
            ? sections.reduce((total, section) => total + section.lengthM, 0)
            : opts.lengthM;
        const laneCount = sections
            ? Math.max(...sections.map(section => section.laneCount))
            : opts.laneCount ?? 5;
        const laneWidthM = opts.laneWidthM ?? 3.7;
        const dashLengthM = opts.dashLengthM ?? 1.5;
        const dashGapM = opts.dashGapM ?? 1.0;
        const dashStartInsetM = opts.dashStartInsetM ?? 0;
        const hiddenLaneSeparators = opts.hiddenLaneSeparators ?? [];
        const withArrows = opts.withArrows ?? true;
        const withLaneMarkings = opts.withLaneMarkings ?? true;
        const highlight = opts.highlight ?? false;
        const outlineOnly = opts.outlineOnly ?? false;
        const withLaneNumbers = opts.withLaneNumbers ?? false;
        const laneNumberOffsetM = opts.laneNumberOffsetM ?? 0;
        const sectionAlignment = opts.sectionAlignment ?? 'left';
        const dividerSide = opts.dividerSide ?? 'right';
        const dividerColor = opts.dividerColor ?? '#fcde59';
        const rotationY = opts.rotationY ?? 0;

        if (lengthM <= 0) throw new Error('FourLaneRoad: lengthM must be > 0');
        if (laneCount < 1) throw new Error('FourLaneRoad: laneCount must be >= 1');
        if (laneWidthM <= 0) throw new Error('FourLaneRoad: laneWidthM must be > 0');
        if (!Number.isFinite(dashStartInsetM) || dashStartInsetM < 0) {
            throw new Error('FourLaneRoad: dashStartInsetM must be >= 0');
        }
        if (sections?.some(section => section.lengthM <= 0 || section.laneCount < 1)) {
            throw new Error('FourLaneRoad: sections must have positive length and at least 1 lane');
        }
        if (hiddenLaneSeparators.some(lane => !Number.isInteger(lane) || lane < 1 || lane >= laneCount)) {
            throw new Error('FourLaneRoad: hidden lane separator is out of range');
        }

        const widthM = laneCount * laneWidthM;

        this.lengthM = lengthM;
        this.laneWidthM = laneWidthM;
        this.laneCount = laneCount;
        this.widthM = widthM;
        this.rotationY = rotationY;
        this.oppositeLaneIndex = dividerSide === 'left' ? 0 : laneCount - 1;

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

        if (sections) {
            let sectionStartZ = -lengthM / 2;
            let previous: { minX: number; maxX: number } | null = null;
            for (const section of sections) {
                const sectionOffsetX = sectionAlignment === 'right'
                    ? (laneCount - section.laneCount) * laneWidthM / 2
                    : sectionAlignment === 'center'
                        ? 0
                        : -(laneCount - section.laneCount) * laneWidthM / 2;
                const current = {
                    minX: sectionOffsetX - section.laneCount * laneWidthM / 2,
                    maxX: sectionOffsetX + section.laneCount * laneWidthM / 2,
                };
                // Bậc đổi bề rộng: curb ngang trên phần mép của section rộng hơn bị lộ ra.
                if (previous && !outlineOnly) {
                    const wider = previous.maxX - previous.minX > current.maxX - current.minX ? previous : current;
                    const narrower = wider === previous ? current : previous;
                    const curbZ = sectionStartZ + (wider === previous ? -0.1 : 0.1);
                    this.addStepCurb(wider.minX, narrower.minX, curbZ, root);
                    this.addStepCurb(narrower.maxX, wider.maxX, curbZ, root);
                }
                previous = current;
                this.footprints.push({ ...current, minZ: sectionStartZ, maxZ: sectionStartZ + section.lengthM });
                const sectionRoad = new FourLaneRoad({
                    x: sectionOffsetX,
                    z: sectionStartZ + section.lengthM / 2,
                    lengthM: section.lengthM,
                    laneCount: section.laneCount,
                    laneWidthM,
                    dashLengthM,
                    dashGapM,
                    dashStartInsetM: section.dashStartInsetM ?? dashStartInsetM,
                    hiddenLaneSeparators: section.hiddenLaneSeparators ?? hiddenLaneSeparators,
                    withArrows,
                    withLaneMarkings,
                    highlight,
                    outlineOnly,
                    withLaneNumbers,
                    laneNumberOffsetM: section.laneNumberOffsetM ?? laneNumberOffsetM,
                    sectionAlignment,
                    dividerSide,
                    dividerColor,
                    rotationY: 0,
                });
                root.add(sectionRoad.root);
                sectionStartZ += section.lengthM;
            }
            return;
        }

        this.footprints.push({ minX: -halfW, maxX: halfW, minZ: -lengthM / 2, maxZ: lengthM / 2 });

        if (outlineOnly) {
            this.addOutlineLine(+halfW, lengthM, root);
            this.addOutlineLine(-halfW, lengthM, root);
        } else {
            // 1. Mặt đường (asphalt).
            const surface = new THREE.Mesh(
                new THREE.BoxGeometry(widthM, 0.08, lengthM),
                new THREE.MeshStandardMaterial({ color: highlight ? '#f2b84b' : '#2a2a2a', roughness: 0.95 }),
            );
            surface.position.set(0, 0.02, 0);
            surface.name = 'road-surface';
            surface.receiveShadow = true;
            root.add(surface);

            // 2. Curb đỏ-trắng ở 2 biên ngoài cùng.
            this.addCurbPattern(+halfW, lengthM, root);
            this.addCurbPattern(-halfW, lengthM, root);
        }

        if (withLaneMarkings) {
            // 3. Vạch liền phân chia 2 chiều giữa làn ngược chiều và làn kề nó.
            const dividerPairIndex = dividerSide === 'left' ? 0 : laneCount - 2;
            if (laneCount >= 2) {
                const dividerX = (laneCentersX[dividerPairIndex] + laneCentersX[dividerPairIndex + 1]) / 2;
                const solidDivider = new THREE.Mesh(
                    new THREE.BoxGeometry(0.15, 0.008, lengthM),
                    new THREE.MeshStandardMaterial({ color: dividerColor, roughness: 0.85 }),
                );
                solidDivider.position.set(dividerX, 0.067, 0);
                solidDivider.name = 'direction-divider';
                solidDivider.receiveShadow = true;
                root.add(solidDivider);
            }

            // 4. Vạch đứt giữa các cặp lane cùng chiều.
            //    Mapping index → lane: laneCentersX[i] = lane (laneCount - i).
            //    Tên lane-line theo quy ước: số nhỏ (phía phải) trước, số lớn (phía trái) sau.
            const separatorPositions: Array<{ x: number; lanePair: string }> = [];
            for (let leftIdx = 0; leftIdx < laneCount - 1; leftIdx++) {
                if (leftIdx === dividerPairIndex) continue;
                const x = (laneCentersX[leftIdx] + laneCentersX[leftIdx + 1]) / 2;
                const rightLane = laneCount - leftIdx - 1;
                if (hiddenLaneSeparators.includes(rightLane)) continue;
                const pair = `${String(rightLane).padStart(2, '0')}-${String(rightLane + 1).padStart(2, '0')}`;
                separatorPositions.push({ x, lanePair: pair });
            }
            const whiteDashed = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });

            for (const { x, lanePair } of separatorPositions) {
                for (let start = dashStartInsetM; start < lengthM; start += dashLengthM + dashGapM) {
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
        }

        if (withLaneNumbers) {
            for (let i = 0; i < laneCount; i++) {
                this.addLaneNumber(laneCentersX[i], laneNumberOffsetM, laneCount - i, root);
            }
        }

        // 5. Mũi tên chỉ hướng cho mỗi lane (giữa road theo trục Z).
        if (withArrows && !outlineOnly) {
            for (let i = 0; i < laneCount; i++) {
                // Đảo chiều: làn ngược chiều chĩa +Z (không xoay), các lane còn lại chĩa -Z (xoay π).
                const isBackward = i !== this.oppositeLaneIndex;
                this.addArrow(laneCentersX[i], 0, isBackward, root);
            }
        }
    }

    private addOutlineLine(edgeX: number, lengthM: number, parent: THREE.Group): void {
        const line = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.008, lengthM),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }),
        );
        line.position.set(edgeX, 0.067, 0);
        line.name = 'road-outline';
        line.receiveShadow = true;
        parent.add(line);
    }

    private addLaneNumber(x: number, z: number, laneNumber: number, parent: THREE.Group): void {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.font = 'bold 88px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String(laneNumber), canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const number = new THREE.Mesh(
            new THREE.PlaneGeometry(1.1, 1.1),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
            }),
        );
        number.rotation.x = -Math.PI / 2;
        number.position.set(x, 0.08, z);
        number.name = `lane-number-${laneNumber}`;
        parent.add(number);
    }

    /**
     * Vẽ dải curb đỏ-trắng ở một biên. `edgeX` là local X của mép ngoài curb.
     * Curb hiển thị rộng 0.10 m, cao 0.05 m, mỗi đoạn 0.8 m xen kẽ trắng/đỏ.
     */
    private addCurbPattern(edgeX: number, lengthM: number, parent: THREE.Group) {
        const curbWidth = CURB_VISUAL_WIDTH_M;
        const curbHeight = CURB_VISUAL_HEIGHT_M;
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
            curb.name = 'red-white-curb';
            curb.castShadow = true;
            curb.receiveShadow = true;
            parent.add(curb);
        }
    }

    /** Curb đỏ-trắng chạy theo local X, từ `fromX` tới `toX`, tâm curb tại `z`. */
    private addStepCurb(fromX: number, toX: number, z: number, parent: THREE.Group) {
        const curbWidth = CURB_VISUAL_WIDTH_M;
        const curbHeight = CURB_VISUAL_HEIGHT_M;
        const segmentLen = 0.8;
        const length = toX - fromX;
        const count = Math.ceil(length / segmentLen - 1e-6);
        for (let i = 0; i < count; i++) {
            const pieceLength = Math.min(segmentLen, length - i * segmentLen);
            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(pieceLength, curbHeight, curbWidth),
                new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xffffff : 0xd83b3b, roughness: 0.85 }),
            );
            curb.position.set(fromX + i * segmentLen + pieceLength / 2, 0.08 / 2 + curbHeight / 2 + 0.02, z);
            curb.name = 'red-white-curb';
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
        isBackward: boolean,
        parent: THREE.Group,
    ) {
        const texture = createStraightRoadArrowTexture();
        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(STRAIGHT_ROAD_ARROW_WIDTH_M, STRAIGHT_ROAD_ARROW_LENGTH_M),
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
     * Lấy chiều hướng (đơn vị vector) của lane `index`
     * (0..laneCount-1, ngoài cùng trái..ngoài cùng phải).
     * - Các lane trừ lane 01 (ngoài cùng phải): (0, 0, +1) (đi lên +Z)
     * - Lane 01 (ngoài cùng phải):               (0, 0, -1) (đi xuống -Z)
     */
    getLaneDirection(index: number): THREE.Vector3 {
        if (index < 0 || index >= this.laneCount) {
            throw new Error(`FourLaneRoad: lane index ${index} out of range`);
        }
        return index === this.oppositeLaneIndex
            ? new THREE.Vector3(0, 0, -1)
            : new THREE.Vector3(0, 0, 1);
    }
}

/**
 * Validate FourLaneRoad theo spec §25 (tương tự road_6A).
 */
export function validateFourLaneRoad(road: FourLaneRoad): void {
    if (road.laneCount < 1) {
        throw new Error('FourLaneRoad must have at least 1 lane');
    }
    if (road.laneWidthM !== 3.7) {
        throw new Error('FourLaneRoad: each lane must be 3.70 m');
    }
    if (Math.abs(road.widthM - road.laneCount * road.laneWidthM) > 1e-6) {
        throw new Error('FourLaneRoad: width must equal laneCount × laneWidthM');
    }
    if (road.lengthM <= 0) {
        throw new Error('FourLaneRoad: lengthM must be > 0');
    }
}
