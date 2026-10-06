import * as THREE from 'three';
import { offsetPath, roundCorners, splitByPattern, type Point } from './roundedPath';

/**
 * Bài sát hạch số 4 — Qua vệt bánh xe và đường vòng vuông góc.
 *
 * Spec nguồn: spec/threejs_exam_yard_specification_v2.md §9 và bản vẽ sân Hiệp Phát.
 *
 * Công thức (theo thông số xe a, b, B1 của từng chuồng):
 *   Bvb = B1 + 0.2   (khoảng trống giữa 2 vạch vệt bánh xe)
 *   Lvb = a          (chiều dài vệt bánh xe)
 *   Sv  = 1.5 * a    (chiều sâu đường vuông góc)
 *   Lv  = 2.0 * a    (khoảng cách tim lối vào → tim lối ra)
 *   Bv  = 2.2 * b    (khoảng cách giữa 2 vạch giới hạn)
 *
 * Bố cục theo bản vẽ (xe chạy -Z trên lối vào):
 *   - entry (z = 0) → đoạn tiếp cận `entryLength` → vệt bánh xe dài Lvb
 *     → 2 m → bắt đầu vạch giới hạn đỏ.
 *   - Vạch giới hạn lối vào dài entrySvM (mặc định Sv) tính tới mép ngoài đoạn ngang;
 *     vạch giới hạn lối ra dài Sv tính từ mép ngoài đoạn ngang phía lối ra,
 *     sau đó là đoạn `exitLength` tới exit.
 *   - Đoạn ngang rộng Bv, lệch tim Lv về phía -X.
 *   - Mọi góc vạch giới hạn bo R = cornerRadiusM; bó vỉa đồng tâm, cách vạch
 *     (roadWidthM - Bv) / 2 ra phía ngoài.
 *
 * Sau khi tạo, `root` có thể được gắn trực tiếp vào scene và transform
 * (translate + rotateY) để đặt vào world-space theo hướng mong muốn.
 */
export interface WheelTrackCourseOptions {
    /** Chiều dài cơ sở của xe (m). */
    a?: number;
    /** Chiều rộng xe (m). */
    b?: number;
    /** Chiều rộng lốp xe (m). */
    B1?: number;
    /** Sv riêng cho lối vào. Mặc định = Sv (1.5a). */
    entrySvM?: number;
    /** Đoạn nối tiếp từ cuối vạch giới hạn lối ra tới exit. Mặc định 0. */
    exitLength?: number;
    /** Khoảng cách từ vạch vàng lối vào tới đầu vệt bánh xe. Mặc định 3 m (tối đa entryLength). */
    startLineToWheelTrackM?: number;
    /** Khoảng cách giữa 2 mép bó vỉa. Mặc định Bv + 0.4 (bản vẽ: 3.74 → 4.14). */
    roadWidthM?: number;
    /** Bán kính bo góc của vạch giới hạn. Bản vẽ: R1. */
    cornerRadiusM?: number;
}

const CURB_GAP_M = 0.2;
const CURB_WIDTH_M = 0.2;
const CURB_HEIGHT_M = 0.05;
const CURB_SEGMENT_M = 0.8;
const LIMIT_LINE_WIDTH_M = 0.1;
const LIMIT_SENSOR_WIDTH_M = 0.25;
const WHEEL_TRACK_TO_LIMIT_LINE_M = 2;

export class WheelTrackCourse {
    readonly root = new THREE.Group();
    readonly penaltyZones: THREE.Box3[] = [];

    readonly a: number;
    readonly b: number;
    readonly B1: number;

    readonly Bvb: number;
    readonly Lvb: number;
    readonly Sv: number;
    readonly entrySv: number;
    readonly Lv: number;
    readonly Bv: number;
    readonly roadWidthM: number;
    readonly cornerRadiusM: number;

    /** Chiều dài đoạn tiếp cận từ entry tới đầu vệt bánh xe. */
    readonly entryLength: number;

    /** Chiều dài đoạn từ cuối vạch giới hạn lối ra tới exit. */
    readonly exitLength: number;

    /** Khoảng cách từ vạch vàng lối vào tới đầu vệt bánh xe. */
    readonly startLineToWheelTrackM: number;

    /** Vị trí entry trong local frame (giữa cạnh vào, mặt đường Y=0). */
    readonly entry: THREE.Vector3;

    /** Vị trí exit trong local frame (giữa cạnh ra, mặt đường Y=0). */
    readonly exit: THREE.Vector3;

    /** Vạch vàng đầu bài (START_GATE), cách đầu vệt bánh xe `startLineToWheelTrackM`. */
    startYellowLine!: THREE.Mesh;

    /** Vạch vàng cuối bài (END_GATE) tại cuối vạch giới hạn lối ra (hết Sv). */
    endYellowLine!: THREE.Mesh;

    /** Wheel-track zone Box3 (local) — vùng trống giữa 2 vạch vệt bánh xe. */
    wheelTrackZoneLocal!: THREE.Box3;

    /** Boundary sensors Box3[] (local) dọc theo vạch giới hạn đỏ. */
    readonly boundarySensorsLocal: THREE.Box3[] = [];

    /**
     * Footprint đoạn entryLength / exitLength (local), dư thêm một bề rộng bó vỉa
     * ở entry / exit để mở bó vỉa của đường mà lối vào / lối ra nối vào.
     */
    entryConnectorLocal!: THREE.Box3;
    exitConnectorLocal!: THREE.Box3;

    /** Sensor cho vạch vàng đầu bài (local Box3). */
    startYellowSensorLocal!: THREE.Box3;

    /** Sensor cho vạch vàng cuối bài (local Box3). */
    endYellowSensorLocal!: THREE.Box3;

    constructor(x: number, z: number, entryLength: number, options: WheelTrackCourseOptions = {}) {
        this.root.name = 'wheel-track-course';
        this.entryLength = entryLength;
        this.exitLength = options.exitLength ?? 0;
        this.startLineToWheelTrackM = options.startLineToWheelTrackM ?? 3;
        this.a = options.a ?? 4.410;
        this.b = options.b ?? 1.700;
        this.B1 = options.B1 ?? 0.185;
        this.Bvb = this.B1 + 0.2;
        this.Lvb = this.a;
        this.Sv = 1.5 * this.a;
        this.entrySv = options.entrySvM ?? this.Sv;
        this.Lv = 2.0 * this.a;
        this.Bv = 2.2 * this.b;
        this.roadWidthM = options.roadWidthM ?? this.Bv + 2 * CURB_GAP_M;
        this.cornerRadiusM = options.cornerRadiusM ?? 1;

        const curbGap = (this.roadWidthM - this.Bv) / 2;
        if (this.a <= 0 || this.b <= 0 || this.B1 <= 0) {
            throw new Error('WheelTrackCourse: a, b, B1 must be > 0');
        }
        if (entryLength < 0) throw new Error('WheelTrackCourse: entryLength must be >= 0');
        if (this.exitLength < 0) throw new Error('WheelTrackCourse: exitLength must be >= 0');
        if (curbGap <= 0) throw new Error('WheelTrackCourse: roadWidthM must be > Bv');
        if (this.cornerRadiusM <= curbGap) {
            throw new Error('WheelTrackCourse: cornerRadiusM must be > (roadWidthM - Bv) / 2');
        }
        if (Math.min(this.Sv, this.entrySv) - this.Bv < this.cornerRadiusM) {
            throw new Error('WheelTrackCourse: Sv - Bv must be >= cornerRadiusM');
        }

        const halfBv = this.Bv / 2;
        const trackStartZ = -entryLength;
        const limitStartZ = trackStartZ - this.Lvb - WHEEL_TRACK_TO_LIMIT_LINE_M;
        const crossZ = limitStartZ - this.entrySv + halfBv;
        const exitX = -this.Lv;
        const limitEndZ = crossZ + halfBv - this.Sv;
        const exitZ = limitEndZ - this.exitLength;

        this.entry = new THREE.Vector3(x, .06, z);
        this.exit = new THREE.Vector3(x + exitX, .06, z + exitZ);
        const connectorHalfW = this.roadWidthM / 2 + CURB_WIDTH_M;
        this.entryConnectorLocal = new THREE.Box3(
            new THREE.Vector3(-connectorHalfW, 0, trackStartZ),
            new THREE.Vector3(connectorHalfW, 0, CURB_WIDTH_M),
        );
        this.exitConnectorLocal = new THREE.Box3(
            new THREE.Vector3(exitX - connectorHalfW, 0, exitZ - CURB_WIDTH_M),
            new THREE.Vector3(exitX + connectorHalfW, 0, limitEndZ),
        );

        const rightPath = (startZ: number, endZ: number) => roundCorners([
            [halfBv, startZ], [halfBv, crossZ - halfBv],
            [exitX + halfBv, crossZ - halfBv], [exitX + halfBv, endZ],
        ], this.cornerRadiusM);
        const leftPath = (startZ: number, endZ: number) => roundCorners([
            [-halfBv, startZ], [-halfBv, crossZ + halfBv],
            [exitX - halfBv, crossZ + halfBv], [exitX - halfBv, endZ],
        ], this.cornerRadiusM);

        const rightCurb = offsetPath(rightPath(0, exitZ), curbGap);
        const leftCurb = offsetPath(leftPath(0, exitZ), -curbGap);
        const rightLimit = rightPath(limitStartZ, limitEndZ);
        const leftLimit = leftPath(limitStartZ, limitEndZ);

        this.buildSurface(rightCurb, leftCurb);
        this.buildCurb(rightCurb, CURB_WIDTH_M);
        this.buildCurb(leftCurb, -CURB_WIDTH_M);
        this.buildLimitLine(rightLimit);
        this.buildLimitLine(leftLimit);

        this.buildArrows(limitStartZ, crossZ, exitX, limitEndZ);
        this.buildWheelTracks(trackStartZ);
        this.buildYellowLines(
            trackStartZ + Math.min(this.startLineToWheelTrackM, entryLength),
            exitX, limitEndZ,
        );

        this.root.position.set(x, 0, z);
    }

    private addRibbon(points: Point[], from: number, to: number, depth: number,
        y: number, material: THREE.Material, name: string): THREE.Mesh {
        const outline = offsetPath(points, from).concat(offsetPath(points, to).reverse());
        const shape = new THREE.Shape(outline.map(([px, pz]) => new THREE.Vector2(px, -pz)));
        const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
        geometry.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = name;
        mesh.position.y = y;
        mesh.receiveShadow = true;
        this.root.add(mesh);
        return mesh;
    }

    private buildSurface(rightCurb: Point[], leftCurb: Point[]): void {
        const outline = rightCurb.concat([...leftCurb].reverse());
        const shape = new THREE.Shape(outline.map(([px, pz]) => new THREE.Vector2(px, -pz)));
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: .08, bevelEnabled: false });
        geometry.rotateX(-Math.PI / 2);
        const surface = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 }),
        );
        surface.position.y = -.02;
        surface.receiveShadow = true;
        surface.name = 'wheel-track-course-surface';
        this.root.add(surface);
    }

    /** Bó vỉa đỏ/trắng, mép trong nằm trên `curbLine`, bề rộng `width` (âm = sang trái). */
    private buildCurb(curbLine: Point[], width: number): void {
        const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 });
        const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: .85 });
        splitByPattern(curbLine, [CURB_SEGMENT_M]).forEach((piece, i) => {
            const curb = this.addRibbon(piece, 0, width, CURB_HEIGHT_M, .06,
                i % 2 === 0 ? white : red, 'red-white-curb');
            curb.castShadow = true;
        });
    }

    private buildLimitLine(path: Point[]): void {
        const material = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: .7 });
        this.addRibbon(path, -LIMIT_LINE_WIDTH_M / 2, LIMIT_LINE_WIDTH_M / 2,
            .01, .065, material, 'wheel-track-limit-line');

        const half = LIMIT_SENSOR_WIDTH_M / 2;
        for (let i = 1; i < path.length; i++) {
            const [x1, z1] = path[i - 1], [x2, z2] = path[i];
            this.boundarySensorsLocal.push(new THREE.Box3(
                new THREE.Vector3(Math.min(x1, x2) - half, -1, Math.min(z1, z2) - half),
                new THREE.Vector3(Math.max(x1, x2) + half, 1, Math.max(z1, z2) + half),
            ));
        }
    }

    private buildArrows(limitStartZ: number, crossZ: number, exitX: number, exitZ: number): void {
        const halfBv = this.Bv / 2;
        const entryLegLength = this.entrySv - this.Bv;
        const legLength = this.Sv - this.Bv;

        this.addRoadArrow(0, limitStartZ - entryLegLength / 2, this.Bv, entryLegLength, 'straight');

        const acrossArrow = new THREE.Group();
        acrossArrow.position.set(exitX / 2, 0, crossZ);
        acrossArrow.rotation.y = Math.PI / 2;
        this.addRoadArrowTo(0, 0, this.Bv, this.Lv - this.Bv, 'straight', acrossArrow);
        this.root.add(acrossArrow);

        this.addRoadArrow(exitX, (crossZ - halfBv + exitZ) / 2, this.Bv, legLength, 'straight');
    }

    private buildWheelTracks(trackStartZ: number): void {
        const markingWidth = .05;
        const trackZ = trackStartZ - this.Lvb / 2;
        const trackX = 1.3; // bản vẽ không ghi kích thước ngang của vệt bánh xe
        for (const side of [-1, 1]) {
            const x = trackX + side * (this.Bvb + markingWidth) / 2;
            this.addLine(x, trackZ, markingWidth, this.Lvb, 0xffffff);
            this.penaltyZones.push(new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(x, .5, trackZ),
                new THREE.Vector3(markingWidth + this.B1, 1, this.Lvb),
            ));
        }
        this.wheelTrackZoneLocal = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(trackX, 0, trackZ),
            new THREE.Vector3(this.Bvb, 0.4, this.Lvb),
        );
    }

    private buildYellowLines(startZ: number, exitX: number, exitZ: number): void {
        const d = 0.15;
        const y = 0.085;
        const thickness = .05;
        const halfBv = this.Bv / 2;
        const yellowMat = new THREE.MeshStandardMaterial({
            color: 0xFFD400,
            roughness: 0.7,
            emissive: 0x553300,
        });

        const startMesh = new THREE.Mesh(new THREE.BoxGeometry(this.Bv, thickness, d), yellowMat);
        startMesh.position.set(0, y, startZ);
        startMesh.name = 'EX04_START_YELLOW_LINE';
        this.root.add(startMesh);
        this.startYellowLine = startMesh;
        this.startYellowSensorLocal = new THREE.Box3(
            new THREE.Vector3(-halfBv, -1, startZ - d / 2),
            new THREE.Vector3(halfBv, 1, startZ + d / 2),
        );

        const endMesh = new THREE.Mesh(new THREE.BoxGeometry(this.Bv, thickness, d), yellowMat);
        endMesh.position.set(exitX, y, exitZ);
        endMesh.name = 'EX04_END_YELLOW_LINE';
        this.root.add(endMesh);
        this.endYellowLine = endMesh;
        this.endYellowSensorLocal = new THREE.Box3(
            new THREE.Vector3(exitX - halfBv, -1, exitZ - d / 2),
            new THREE.Vector3(exitX + halfBv, 1, exitZ + d / 2),
        );
    }

    /**
     * Vạch phẳng — đặt tại local (x, z) với kích thước (w, d) và màu color.
     * Box mỏng 0.03m nâng lên y=0.075 để tránh z-fighting, khớp với `TrackObjects.addLine`.
     */
    private addLine(x: number, z: number, w: number, d: number, color: number): void {
        const m = new THREE.Mesh(
            new THREE.BoxGeometry(w, .03, d),
            new THREE.MeshStandardMaterial({ color, roughness: .7 })
        );
        m.position.set(x, .075, z);
        this.root.add(m);
    }

    /**
     * Mũi tên chỉ hướng trên mặt đường — dùng texture procedurally.
     */
    private addRoadArrow(x: number, z: number, w: number, d: number,
        type: 'straight' | 'left' | 'right'): void {
        const texture = this.createArrowTexture(type);
        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(
                Math.min(w * 0.32, type === 'straight' ? 1.2 : 1.9),
                Math.min(d * 0.35, 3.4)
            ),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true })
        );
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(x, 0.081, z);
        this.root.add(arrow);
    }

    /** Đặt arrow vào group có sẵn (dùng cho acrossArrow). */
    private addRoadArrowTo(x: number, z: number, w: number, d: number,
        type: 'straight' | 'left' | 'right', parent: THREE.Group): void {
        const texture = this.createArrowTexture(type);
        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(
                Math.min(w * 0.32, type === 'straight' ? 1.2 : 1.9),
                Math.min(d * 0.35, 3.4)
            ),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true })
        );
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(x, 0.081, z);
        parent.add(arrow);
    }

    private createArrowTexture(type: 'straight' | 'left' | 'right' | 'none'): THREE.CanvasTexture {
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
        if (type === 'straight') {
            ctx.beginPath();
            ctx.moveTo(cx, 420);
            ctx.lineTo(cx, 140);
            ctx.stroke();
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
        } else if (type === 'left' || type === 'right') {
            ctx.save();
            if (type === 'left') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.beginPath();
            ctx.moveTo(55, 430);
            ctx.lineTo(115, 430);
            ctx.lineTo(115, 205);
            ctx.lineTo(165, 205);
            ctx.lineTo(165, 270);
            ctx.lineTo(240, 165);
            ctx.lineTo(165, 60);
            ctx.lineTo(165, 125);
            ctx.lineTo(55, 125);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }
}
