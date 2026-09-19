import * as THREE from 'three';

/**
 * Bài sát hạch số 4 — Qua vệt bánh xe và đường vòng vuông góc.
 *
 * Spec nguồn: spec/threejs_exam_yard_specification_v2.md §9
 *
 * Công thức bắt buộc (hard constraint) với thông số xe hạng B (VIOS):
 *   Bvb = B1 + 0.2   (chiều rộng vệt bánh xe)
 *   Lvb = a          (chiều dài vệt bánh xe)
 *   Sv  = 1.5 * a    (chiều sâu đường vuông góc)
 *   Lv  = 2.0 * a    (chiều dài đường vuông góc)
 *   Bv  = 2.2 * b    (chiều rộng làn đường vuông góc)
 *
 * Topology: hai khối vuông góc nối tiếp ngược chiều, nằm bên phải theo chiều xe
 * chạy. Vệt bánh xe nằm ở đoạn đầu (entry) trên làn phải.
 *
 * Hệ tọa độ nội bộ:
 *   - entry nằm tại (0, 0, 0), hướng vào là -Z (xe chạy từ +Z xuống -Z).
 *   - turn (khúc cua) tại z = -entryLength.
 *   - exit nằm tại (exitX, 0, exitZ); cạnh exit là cạnh outline ở Z = exitZ, song song trục X.
 *     Xe đi từ turn (Z = turnZ) ra exit (Z = exitZ) → hướng -Z (trong local), tức từ +X sang -X trên đường across.
 *
 * Sau khi tạo, `root` có thể được gắn trực tiếp vào scene và transform
 * (translate + rotateY) để đặt vào world-space theo hướng mong muốn.
 */
export class WheelTrackCourse {
    readonly root = new THREE.Group();
    readonly penaltyZones: THREE.Box3[] = [];

    // Thông số xe VIOS (hạng B) — hard-coded theo exam-yard-standard §14.1
    readonly a = 4.4;
    readonly b = 1.8;
    readonly B1 = 0.22;

    // Công thức spec §9.2 (HARD_CONSTRAINT)
    readonly Bvb = this.B1 + 0.2;       // = 0.42  chiều rộng vệt bánh xe
    readonly Lvb = this.a;              // = 4.4   chiều dài vệt bánh xe
    readonly Sv = 1.5 * this.a;         // = 6.6   chiều sâu đường vuông góc
    readonly Lv = 2.0 * this.a;         // = 8.8   chiều dài đường vuông góc
    readonly Bv = 2.2 * this.b;         // = 3.96  chiều rộng làn đường vuông góc

    /** entryLength = chiều dài đoạn đầu (từ entry đến khúc cua đầu tiên). */
    readonly entryLength: number;

    /** Vị trí entry trong local frame (giữa cạnh vào, mặt đường Y=0). */
    readonly entry: THREE.Vector3;

    /** Vị trí exit trong local frame (giữa cạnh ra, mặt đường Y=0). */
    readonly exit: THREE.Vector3;

    /**
     * Vạch vàng đầu bài (START_GATE) — mesh visual, nâng 0.01m để tránh z-fighting.
     * Đặt cách entry 0.5m về phía +Z (giữa entry road và course entry).
     */
    startYellowLine!: THREE.Mesh;

    /**
     * Vạch vàng cuối bài (END_GATE) — mesh visual, nâng 0.01m.
     * Đặt cách exit 0.5m về phía -X (exit leg, hướng xe chạy ra).
     */
    endYellowLine!: THREE.Mesh;

    /**
     * Wheel-track zone Box3 (local) — vùng giữa 2 vạch song song.
     * Centered at (0, 0, -Lvb/2) = (0, 0, -2.2), kích thước (Bvb × Lvb × 0.4).
     */
    wheelTrackZoneLocal!: THREE.Box3;

    /**
     * Boundary sensors Box3[] (local) — 6 đoạn biên (bỏ cạnh exit index 3).
     * Mỗi sensor là Box3 đã được tính sẵn vị trí và kích thước.
     */
    readonly boundarySensorsLocal: THREE.Box3[] = [];

    /** Sensor cho vạch vàng đầu bài (local Box3). */
    startYellowSensorLocal!: THREE.Box3;

    /** Sensor cho vạch vàng cuối bài (local Box3). */
    endYellowSensorLocal!: THREE.Box3;

    constructor(x: number, z: number, entryLength: number) {
        this.root.name = 'wheel-track-course';
        this.entryLength = entryLength;

        const half = this.Bv / 2;
        const entryX = 0;
        const entryZ = 0;
        const turnZ = entryZ - entryLength;
        const exitX = entryX - this.Lv;
        // Sv is measured from the outside of the cross leg to the open exit.
        const exitZ = turnZ + half - this.Sv;

        this.entry = new THREE.Vector3(x + entryX, .06, z + entryZ);
        this.exit = new THREE.Vector3(x + exitX, .06, z + exitZ);

        const outline: [number, number][] = [
            [entryX + half, entryZ], [entryX + half, turnZ - half],
            [exitX + half, turnZ - half], [exitX + half, exitZ],
            [exitX - half, exitZ], [exitX - half, turnZ + half],
            [entryX - half, turnZ + half], [entryX - half, entryZ]
        ];

        // Mặt đường asphalt liền mạch (ExtrudeGeometry theo outline 8 điểm)
        this.buildSurface(outline);

        // Vạch biên trắng + curb đỏ/trắng dọc 6 đoạn liên tục (trừ cạnh exit)
        this.buildBoundaries(outline);

        // Mũi tên chỉ hướng ở entry, across (vuông góc), exit
        this.buildArrows(entryX, entryZ, turnZ, exitX, exitZ, half);

        // Vạch vệt bánh xe (2 vạch song song cách nhau Bvb) + penalty zones
        this.buildWheelTracks(entryX, entryZ);

        // Vạch vàng đầu bài (START_GATE) + sensor
        this.buildYellowLines(entryX, entryZ, turnZ, exitX, exitZ, half);

        // Wheel-track zone Box3 (local)
        this.wheelTrackZoneLocal = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(0, 0, -this.Lvb / 2),
            new THREE.Vector3(this.Bvb, 0.4, this.Lvb)
        );

        // Boundary sensors (local): 6 đoạn biên (outline bỏ cạnh exit index 3)
        this.buildBoundarySensors(outline);

        // Translate toàn bộ về vị trí (x, z) đã yêu cầu
        this.root.position.set(x, 0, z);
    }

    private buildSurface(outline: [number, number][]): void {
        const shape = new THREE.Shape();
        outline.forEach(([px, pz], i) => {
            if (i === 0) shape.moveTo(px, -pz);
            else shape.lineTo(px, -pz);
        });
        shape.closePath();

        const surface = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape, { depth: .08, bevelEnabled: false }),
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 })
        );
        surface.rotation.x = -Math.PI / 2;
        surface.geometry.translate(0, 0, -.08);
        surface.position.y = .06;
        surface.receiveShadow = true;
        surface.name = 'wheel-track-course-surface';
        this.root.add(surface);
    }

    private buildBoundaries(outline: [number, number][]): void {
        for (let i = 0; i < outline.length - 1; i++) {
            if (i === 3) continue; // bỏ cạnh exit (mở)
            const [x1, z1] = outline[i], [x2, z2] = outline[i + 1];
            const w = Math.abs(x2 - x1), d = Math.abs(z2 - z1);

            // Vạch trắng liên tục
            this.addLine((x1 + x2) / 2, (z1 + z2) / 2,
                w || .1, d || .1, 0xffffff, true);

            // Curb đỏ/trắng phía ngoài
            const length = Math.hypot(x2 - x1, z2 - z1);
            const edge = new THREE.Group();
            edge.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
            edge.rotation.y = Math.atan2(x2 - x1, z2 - z1);
            this.buildRoadEdgePattern(edge, 0, 0, .4, length, 'left');
            this.root.add(edge);
        }
    }

    private buildArrows(
        entryX: number, entryZ: number, turnZ: number,
        exitX: number, exitZ: number, half: number
    ): void {
        // Mũi tên entry (đi thẳng)
        this.addRoadArrow(entryX, entryZ - 1, this.Bv, 3, 'straight');

        // Mũi tên across (rẽ trái vuông góc) — xoay 90°
        const acrossArrow = new THREE.Group();
        acrossArrow.position.set((entryX + exitX) / 2, 0, turnZ);
        acrossArrow.rotation.y = Math.PI / 2;
        this.addRoadArrowTo(0, 0, this.Bv, this.Lv - this.Bv, 'straight', acrossArrow);
        this.root.add(acrossArrow);

        // Mũi tên exit (đi thẳng về +X)
        this.addRoadArrow(exitX, (turnZ - half + exitZ) / 2, this.Bv,
            this.Sv - this.Bv, 'straight');
    }

    private buildWheelTracks(entryX: number, entryZ: number): void {
        // Bvb là khoảng cách trống giữa 2 vạch, nằm ở làn phải
        const markingWidth = .05;
        const trackZ = entryZ - this.a;
        const trackX = entryX + .94; // offset vạch về phía +X của entry
        for (const side of [-1, 1]) {
            const x = trackX + side * (this.Bvb + markingWidth) / 2;
            this.addLine(x, trackZ, markingWidth, this.Lvb, 0xffffff);
            // Wheel probes mở rộng theo chiều rộng thực của bánh xe
            this.penaltyZones.push(new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(x, .5, trackZ),
                new THREE.Vector3(markingWidth + this.B1, 1, this.Lvb)
            ));
        }
    }

    private buildBoundarySensors(outline: [number, number][]): void {
        const lineWidth = 0.25;  // chiều rộng vạch biên
        const sensorDepth = 0.05; // chiều cao sensor Box3 (chỉ để phát hiện xe)

        for (let i = 0; i < outline.length - 1; i++) {
            if (i === 3) continue; // bỏ cạnh exit (mở)
            const [x1, z1] = outline[i], [x2, z2] = outline[i + 1];
            const segLen = Math.hypot(x2 - x1, z2 - z1);
            const cx = (x1 + x2) / 2;
            const cz = (z1 + z2) / 2;

            if (Math.abs(x2 - x1) > Math.abs(z2 - z1)) {
                // segment nằm ngang → Box3 dọc theo X
                this.boundarySensorsLocal.push(new THREE.Box3(
                    new THREE.Vector3(cx - segLen / 2, -1, cz - lineWidth / 2),
                    new THREE.Vector3(cx + segLen / 2, 1, cz + lineWidth / 2)
                ));
            } else {
                // segment thẳng đứng → Box3 dọc theo Z
                this.boundarySensorsLocal.push(new THREE.Box3(
                    new THREE.Vector3(cx - lineWidth / 2, -1, cz - segLen / 2),
                    new THREE.Vector3(cx + lineWidth / 2, 1, cz + segLen / 2)
                ));
            }
        }
    }

    /**
     * Tạo vạch vàng đầu/cuối bài (START_GATE / END_GATE) dưới dạng mesh visual
     * và sensor Box3 nội bộ.
     *
     * StartYellowLine: local (0, 0.01, +Sv/2 + 0.5) — cách entry 0.5m về phía +Z.
     *   Direction: nằm ngang, vuông góc hướng xe vào (xe đi từ +Z xuống -Z).
     *   Vì xe vào theo -Z nên forward là -Z, nên dải sensor đặt ở Z này và check
     *   "xe đi từ +Z qua -Z" bằng dot((frontPosition - center), (0,0,-1)) > 0.
     *
     * EndYellowLine: local (0, 0.085, exitZ) — đặt tại cạnh exit (Z = exitZ), dọc theo trục X.
     *   Direction: nằm dọc, song song với cạnh exit (song song trục X).
     */
    private buildYellowLines(
        entryX: number, entryZ: number, turnZ: number,
        exitX: number, exitZ: number, half: number
    ): void {
        const w = this.Bv;       // = 3.96
        const d = 0.15;          // chiều dày vạch (giữ nguyên)
        const y = 0.085;         // NÂNG từ 0.01 → 0.085 (cao hơn surface 0.06)
        const thickness = .05;    // TĂNG từ .03 lên .05 để dễ thấy

        const yellowMat = new THREE.MeshStandardMaterial({
            color: 0xFFD400,
            roughness: 0.7,
            emissive: 0x553300,   // thêm emissive để nổi bật
        });

        // ── START YELLOW LINE (entry side) ──────────────────────────────────────
        // Entry is at local (0, 0, 0), road enters from +Z (so the car drives -Z).
        // We place the yellow line 0.5m past entry toward +Z so the car crosses it
        // as it drives *into* the course from the approach road.
        // NOTE: The course's entry road in buildExamGround connects at world Z=entryZ
        // and the car approaches from +Z, so the yellow line sits at local Z = Sv/2 + 0.5.
        const startZ = this.Sv - 5;
        const startMesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, thickness, d),
            yellowMat
        );
        startMesh.position.set(0, y, startZ);
        startMesh.name = 'EX04_START_YELLOW_LINE';
        this.root.add(startMesh);
        this.startYellowLine = startMesh;

        // Start yellow sensor: thin slab at the same Z
        this.startYellowSensorLocal = new THREE.Box3(
            new THREE.Vector3(-w / 2, -1, startZ - d / 2),
            new THREE.Vector3(w / 2, 1, startZ + d / 2)
        );

        // ── END YELLOW LINE (exit side) ────────────────────────────────────────
        // Exit edge là cạnh outline index 3: từ (exitX+half, exitZ) đến (exitX-half, exitZ),
        // nằm dọc theo trục X. End line nằm dọc song song với cạnh exit (full Bv theo X,
        // đặt tại exitZ — sát mép exit), hoạt động như "lane line" cuối làn.
        const endX = exitX;                   // center X của exit leg
        const endCz = exitZ;                  // đặt tại cạnh exit (sát mép)
        const endMesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.Bv, thickness, d),  // dài theo X, mỏng theo Z
            yellowMat
        );
        endMesh.position.set(endX, y, endCz);
        endMesh.name = 'EX04_END_YELLOW_LINE';
        this.root.add(endMesh);
        this.endYellowLine = endMesh;

        // End yellow sensor: thin slab dọc theo X tại cạnh exit, full Bv theo X, mỏng theo Z
        // Tọa độ local phải khớp với mesh visual (đặt tại endX = exitX, Z = endCz).
        const endHalf = this.Bv / 2;
        this.endYellowSensorLocal = new THREE.Box3(
            new THREE.Vector3(endX - endHalf, -1, endCz - d / 2),
            new THREE.Vector3(endX + endHalf, 1, endCz + d / 2)
        );
    }

    /**
     * Vạch phẳng — đặt tại local (x, z) với kích thước (w, d) và màu color.
     * Box mỏng 0.03m nâng lên y=0.075 để tránh z-fighting, khớp với `TrackObjects.addLine`.
     */
    private addLine(x: number, z: number, w: number, d: number,
        color: number, _raised = false): void {
        const m = new THREE.Mesh(
            new THREE.BoxGeometry(w, .03, d),
            new THREE.MeshStandardMaterial({ color, roughness: .7 })
        );
        m.position.set(x, .075, z);
        this.root.add(m);
    }

    /**
     * Curb đỏ/trắng dọc cạnh đường (segment 0.8m đỏ/trắng xen kẽ).
     */
    private buildRoadEdgePattern(
        parent: THREE.Group, x: number, z: number,
        w: number, d: number, side: 'left' | 'right'
    ): void {
        const curbWidth = 0.20;
        const curbHeight = 0.05;
        const segmentLen = 0.8;
        const count = Math.ceil(d / segmentLen);

        for (let i = 0; i < count; i++) {
            const length = Math.min(segmentLen, d - i * segmentLen);
            const color = i % 2 === 0 ? 0xffffff : 0xd83b3b;
            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(curbWidth, curbHeight, length),
                new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
            );
            const offsetX = side === 'left'
                ? x - w / 2 + curbWidth / 2
                : x + w / 2 - curbWidth / 2;
            curb.position.set(
                offsetX,
                0.08 / 2 + curbHeight / 2 + 0.02,
                z - d / 2 + i * segmentLen + length / 2
            );
            curb.castShadow = true;
            curb.receiveShadow = true;
            parent.add(curb);
        }
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
