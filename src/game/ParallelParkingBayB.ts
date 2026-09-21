import * as THREE from 'three';

/**
 * ParallelParkingBayB
 *
 * Dựng chuồng ghép xe ngang hạng B theo bản vẽ CAD sân sát hạch Hiệp Phát.
 * Kích thước chuẩn:
 *   Lg = 6.615 m (chiều dài nơi đỗ, dọc road)
 *   Rg = 2.125 m (chiều sâu, từ road đi vào chuồng)
 *
 * Topology: chữ U mở về phía road. Open side tại X=0; +X đi sâu vào chuồng.
 * Đầu trong bo cong tròn (cornerRadiusM). Cạnh mở KHÔNG CÓ vạch.
 *
 * Hệ local:
 *   +Z = dọc road / chiều dài chuồng
 *   +X = từ road đi vào chuồng
 *   +Y = lên trên
 *
 * Layers (spec §21):
 *   - ParkingSurface   (asphalt, optional visual; surface ở đây giữ cùng Y với road)
 *   - ExamBoundaryRed  (sát hạch — đường đỏ U-shape)
 *   - PhysicalCurbEdge (mép vật lý, dải xám/đen U-shape phía ngoài ExamBoundary)
 *
 * Tham khảo: spec/road/parallel_parking_bay_B_spec.md (chương 11, 12, 26, 28-30).
 */
export interface ParallelParkingBayBOptions {
    /** Tâm road theo trục X (world). */
    x: number;
    /** Tâm road theo trục Z (world). */
    z: number;
    /**
     * Xoay toàn bộ bay quanh trục Y (radians). Mặc định 0 (open side quay về -X world).
     * `Math.PI / 2`  → open side quay về -Z world.
     * `-Math.PI / 2` → open side quay về +Z world.
     * `Math.PI`      → open side quay về +X world.
     */
    rotationY?: number;
    /** Bán kính bo góc đầu xa (m). Mặc định 0.3. Phải 0 < R ≤ depth. */
    cornerRadiusM?: number;
    /** Độ dày vạch đỏ sát hạch (m). Mặc định 0.10. */
    examBoundaryWidthM?: number;
    /** Khoảng cách từ vạch đỏ sát hạch đến mép đen vật lý (m). Mặc định 0.25. */
    physicalEdgeOffsetM?: number;
    /** Bề dày dải curb đen (m). Mặc định 0.05. */
    curbWidthM?: number;
    /** Chiều cao curb đen (m). Mặc định 0.05. */
    curbHeightM?: number;
    /** Bật debug dimensions / labels. Mặc định false. */
    showDebug?: boolean;
}

export class ParallelParkingBayB {
    readonly root: THREE.Group;
    readonly lengthM: number;
    readonly depthM: number;
    readonly cornerRadiusM: number;
    readonly examBoundaryWidthM: number;
    readonly physicalEdgeOffsetM: number;
    readonly curbWidthM: number;
    readonly curbHeightM: number;
    /** Xoay quanh trục Y (radians). */
    readonly rotationY: number;

    constructor(opts: ParallelParkingBayBOptions) {
        const lengthM = 6.615;
        const depthM = 2.125;
        const cornerRadiusM = opts.cornerRadiusM ?? 0.3;
        const examBoundaryWidthM = opts.examBoundaryWidthM ?? 0.10;
        const physicalEdgeOffsetM = opts.physicalEdgeOffsetM ?? 0.25;
        const curbWidthM = opts.curbWidthM ?? 0.15; // Match other curbs in project (0.15-0.20m)
        const curbHeightM = opts.curbHeightM ?? 0.05;
        const rotationY = opts.rotationY ?? 0;

        // Validate cứng theo spec §26 + §28:
        if (Math.abs(lengthM - 6.615) > 0.001) throw new Error('B-class parking length must be 6.615 m');
        if (Math.abs(depthM - 2.125) > 0.001) throw new Error('B-class parking depth must be 2.125 m');
        if (cornerRadiusM <= 0 || cornerRadiusM > depthM) {
            throw new Error('ParallelParkingBayB: invalid corner radius (must be 0 < R ≤ depth)');
        }
        if (examBoundaryWidthM <= 0) throw new Error('ParallelParkingBayB: examBoundaryWidthM must be > 0');
        if (physicalEdgeOffsetM < 0) throw new Error('ParallelParkingBayB: physicalEdgeOffsetM must be ≥ 0');

        this.lengthM = lengthM;
        this.depthM = depthM;
        this.cornerRadiusM = cornerRadiusM;
        this.examBoundaryWidthM = examBoundaryWidthM;
        this.physicalEdgeOffsetM = physicalEdgeOffsetM;
        this.curbWidthM = curbWidthM;
        this.curbHeightM = curbHeightM;
        this.rotationY = rotationY;

        // Root group — placement spec §17: position + rotation, NO scale.
        const root = new THREE.Group();
        root.name = 'parallel-parking-bay-b';
        root.position.set(opts.x, 0, opts.z);
        root.rotation.y = rotationY;
        this.root = root;

        // 1. Surface — cùng Y với road, cùng material asphalt.
        this.addSurface(root);

        // 2. ExamBoundary — vạch đỏ U-shape (chỉ 3 cạnh, không cạnh open side).
        this.addExamBoundary(root);

        // 3. PhysicalCurb — dải curb xám đen phía ngoài ExamBoundary.
        this.addPhysicalCurb(root);
    }

    /**
     * Mặt asphalt. Spec §14: cùng Y với road, cùng material, không seam.
     * Box dày 0.08 m đặt ở Y = 0.02..0.10 (cùng độ cao với FourLaneRoad).
     */
    private addSurface(parent: THREE.Group) {
        const surface = new THREE.Mesh(
            new THREE.BoxGeometry(this.depthM, 0.08, this.lengthM),
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 }),
        );
        surface.position.set(this.depthM / 2, 0.02, 0);
        surface.name = 'parking-surface';
        surface.receiveShadow = true;
        parent.add(surface);
    }

    /**
     * Vạch đỏ sát hạch. Spec §6, §11:
     *
     *   TOP_OPEN         = (0,                +L/2)
     *   TOP_ARC_START    = (D - R,            +L/2)
     *   TOP_ARC_END      = (D,                +L/2 - R)
     *   FAR_SIDE_END_TOP = (D,                -L/2 + R)
     *   BOTTOM_ARC_START = (D,                -L/2 + R)
     *   BOTTOM_ARC_END   = (D - R,            -L/2)
     *   BOTTOM_OPEN      = (0,                -L/2)
     *
     * Path KHÔNG đóng — spec §5: open side không có vạch nào.
     * Mỗi đoạn (top-straight, top-arc, far-straight, bottom-arc, bottom-straight) được dựng
     * dưới dạng BoxGeometry flat dày `examBoundaryWidthM`, cao 0.01, Y = 0.085 (nằm trên
     * surface) để hiện rõ khi debug.
     */
    private addExamBoundary(parent: THREE.Group) {
        const L = this.lengthM;
        const D = this.depthM;
        const R = this.cornerRadiusM;
        const W = this.examBoundaryWidthM;
        const Z_OFFSET = 0.085 - (-0.005); // tâm box tại Y = surface_top + 0.005 ≈ 0.085

        // Dùng Path để sinh ra nhiều segment theo spec §12.
        const path = new THREE.Path();
        path.moveTo(0, +L / 2);
        // top straight
        path.lineTo(D - R, +L / 2);
        // top-right circular arc (cornerRadiusM, sweep 90° xuống dưới)
        path.absarc(D - R, +L / 2 - R, R, Math.PI / 2, 0, true);
        // far side
        path.lineTo(D, -L / 2 + R);
        // bottom-right circular arc
        path.absarc(D - R, -L / 2 + R, R, 0, -Math.PI / 2, true);
        // bottom straight
        path.lineTo(0, -L / 2);
        // IMPORTANT: do NOT close path across open side.

        // Lấy từng segment để build mesh Box trên local-XZ (rotation.x = -PI/2 cho mặt plan).
        const segments = (path as THREE.Path).getPoints(64);

        const matRed = new THREE.MeshStandardMaterial({ color: '#ff0000', roughness: 0.6 });
        for (let i = 0; i < segments.length - 1; i++) {
            const a = segments[i];
            const b = segments[i + 1];
            const cx = (a.x + b.x) / 2;
            const cz = (a.y + b.y) / 2; // Path dùng y cho trục thứ 2 trong mặt phẳng
            const dx = b.x - a.x;
            const dz = b.y - a.y;
            const segLen = Math.sqrt(dx * dx + dz * dz);
            if (segLen < 1e-4) continue;
            const angle = Math.atan2(dz, dx);

            const strip = new THREE.Mesh(
                new THREE.BoxGeometry(segLen + 0.001, 0.012, W),
                matRed,
            );
            strip.position.set(cx, 0.085 + Z_OFFSET - 0.043 - 0.043 / 2, cz);
            // Surface đặt ở Y=0.02, dày 0.08 → top = 0.06. Đặt vạch ngay trên đó: Y=0.061+0.006 = 0.067.
            strip.position.y = 0.067;
            strip.rotation.y = -angle; // (x,z) trong Path tương ứng (x,z) local, quay quanh trục Y để cộng hướng.
            strip.name = 'exam-boundary-red';
            strip.receiveShadow = true;
            parent.add(strip);
        }
    }

    /**
     * Dải curb đỏ-trắng phía ngoài ExamBoundary. Spec §7, §8:
     * - Không merge với ExamBoundary.
     * - Offset ra phía ngoài `physicalEdgeOffsetM`.
     * - Phía open side KHÔNG CÓ curb (spec §15).
     *
     * Pattern đỏ-trắng: alternating segments theo spec road edge pattern.
     * White = 0xffffff, Red = 0xd83b3b.
     */
    private addPhysicalCurb(parent: THREE.Group) {
        const L = this.lengthM;
        const D = this.depthM;
        const R = this.cornerRadiusM;
        const offset = this.physicalEdgeOffsetM;
        const W = this.curbWidthM;
        const H = this.curbHeightM;

        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });

        // Top strip: song song với top red line (chạy dọc Z), lệch ra phía +X thêm offset.
        // Arc inner edge bắt đầu từ Z = L/2 + offset + R để kết nối với far strip.
        // Top strip inner edge = L/2 + offset + R để kết nối với arc.
        const topStripInnerZ = L / 2 + offset + R;
        const topLen = D - R;
        const segmentLen = 0.8;
        const topCount = Math.ceil(topLen / segmentLen);
        for (let i = 0; i < topCount; i++) {
            const segLen = Math.min(segmentLen, topLen - i * segmentLen);
            const mat = i % 2 === 0 ? whiteMat : redMat;
            const topStrip = new THREE.Mesh(
                new THREE.BoxGeometry(segLen, H, W),
                mat,
            );
            topStrip.position.set(offset + W / 2 + i * segmentLen + segLen / 2, 0.06 + H / 2, topStripInnerZ + W / 2);
            topStrip.name = 'physical-curb-top';
            topStrip.receiveShadow = true;
            topStrip.castShadow = true;
            parent.add(topStrip);
        }

        // Top-right corner arc: bo tròn góc trên phải
        // Arc center = (D - R + offset, L/2 + offset), radius = R
        // Inner edge (radius R) tại: angle=PI/2 -> Z = L/2 + offset + R (kết nối với top strip)
        //                           angle=0 -> X = D + offset (kết nối với far strip)
        // BoxGeometry: (tangentLen, H, radialWidth). Tại θ trên arc:
        //   - Position: (cx + R*cos(θ), cy + R*sin(θ))
        //   - Tangent direction: (-sin(θ), cos(θ)) trong (X, Z)
        //   - Radial direction: (cos(θ), sin(θ)) trong (X, Z)
        // Đặt box X-axis dọc theo tangent, Z-axis dọc theo radial
        // rotation.y để X-axis trỏ theo (-sin(θ), cos(θ))
        const arcSegments = 8;
        const arcRadius = R;
        const arcCenterX = D - R + offset;
        const arcCenterZ = L / 2 + offset;
        for (let i = 0; i < arcSegments; i++) {
            // Arc từ angle = PI/2 (top) đến angle = 0 (right)
            const t1 = Math.PI / 2 - (Math.PI / 2 / arcSegments) * i;
            const t2 = Math.PI / 2 - (Math.PI / 2 / arcSegments) * (i + 1);
            const midAngle = (t1 + t2) / 2;
            const arcLen = (Math.PI / 2 / arcSegments) * arcRadius;
            const mat = i % 2 === 0 ? whiteMat : redMat;
            // Box dimensions: X = tangent length, Y = H, Z = radial width
            const arcStrip = new THREE.Mesh(
                new THREE.BoxGeometry(arcLen, H, W),
                mat,
            );
            arcStrip.position.set(
                arcCenterX + arcRadius * Math.cos(midAngle),
                0.06 + H / 2,
                arcCenterZ + arcRadius * Math.sin(midAngle)
            );
            // Tangent vector at angle θ: (-sin θ, cos θ) trong (X, Z)
            // rotation.y để X-axis trỏ về tangent:
            // atan2(tangentZ, tangentX) = atan2(cos(θ), -sin(θ)) = π/2 + θ
            // Khi θ=PI/2 (top): tangent = (-1, 0), atan2(0, -1) = π → rotation = π
            // Khi θ=0 (right): tangent = (0, 1), atan2(1, 0) = π/2 → rotation = π/2
            // Formula: rotation.y = π/2 + θ
            arcStrip.rotation.y = Math.PI / 2 + midAngle;
            arcStrip.name = 'physical-curb-top-arc';
            arcStrip.receiveShadow = true;
            arcStrip.castShadow = true;
            parent.add(arcStrip);
        }

        // Far strip: chạy dọc X, đặt tại far side X = D + offset.
        const farLen = L - 2 * R;
        const farCount = Math.ceil(farLen / segmentLen);
        for (let i = 0; i < farCount; i++) {
            const segLen = Math.min(segmentLen, farLen - i * segmentLen);
            const mat = i % 2 === 0 ? whiteMat : redMat;
            const farStrip = new THREE.Mesh(
                new THREE.BoxGeometry(W, H, segLen),
                mat,
            );
            farStrip.position.set(D + offset + W / 2, 0.06 + H / 2, -L / 2 + R + i * segmentLen + segLen / 2);
            farStrip.name = 'physical-curb-far';
            farStrip.receiveShadow = true;
            farStrip.castShadow = true;
            parent.add(farStrip);
        }

        // Bottom-right corner arc: bo tròn góc dưới phải
        // Same logic as top arc but mirrored for bottom (tangent direction đảo)
        const bottomArcCenterX = D - R + offset;
        const bottomArcCenterZ = -(L / 2) - offset; // Mirror of top arc center
        for (let i = 0; i < arcSegments; i++) {
            // Arc từ angle = 0 (right) đến angle = -PI/2 (bottom)
            const t1 = -(Math.PI / 2 / arcSegments) * i;
            const t2 = -(Math.PI / 2 / arcSegments) * (i + 1);
            const midAngle = (t1 + t2) / 2;
            const arcLen = (Math.PI / 2 / arcSegments) * arcRadius;
            const mat = i % 2 === 0 ? whiteMat : redMat;
            const arcStrip = new THREE.Mesh(
                new THREE.BoxGeometry(arcLen, H, W),
                mat,
            );
            arcStrip.position.set(
                bottomArcCenterX + arcRadius * Math.cos(midAngle),
                0.06 + H / 2,
                bottomArcCenterZ + arcRadius * Math.sin(midAngle)
            );
            // Tangent at angle θ (going from 0 to -PI/2): (-sin θ, cos θ)
            // Same formula: rotation.y = π/2 + θ
            arcStrip.rotation.y = Math.PI / 2 + midAngle;
            arcStrip.name = 'physical-curb-bottom-arc';
            arcStrip.receiveShadow = true;
            arcStrip.castShadow = true;
            parent.add(arcStrip);
        }

        // Bottom strip: song song với bottom red line (chạy dọc Z), lệch ra phía -Z thêm offset.
        // Arc inner edge tại Z = -L/2 - offset - R, strip inner edge phải cùng vị trí.
        const bottomStripInnerZ = -(L / 2) - offset - R;
        const bottomCount = Math.ceil(topLen / segmentLen);
        for (let i = 0; i < bottomCount; i++) {
            const segLen = Math.min(segmentLen, topLen - i * segmentLen);
            const mat = i % 2 === 0 ? whiteMat : redMat;
            const bottomStrip = new THREE.Mesh(
                new THREE.BoxGeometry(segLen, H, W),
                mat,
            );
            bottomStrip.position.set(offset + W / 2 + i * segmentLen + segLen / 2, 0.06 + H / 2, bottomStripInnerZ - W / 2);
            bottomStrip.name = 'physical-curb-bottom';
            bottomStrip.receiveShadow = true;
            bottomStrip.castShadow = true;
            parent.add(bottomStrip);
        }
    }
}

/**
 * Validate ParallelParkingBayB theo spec §26 (chạy lại các check dims).
 */
export function validateParallelParkingBayB(bay: ParallelParkingBayB): void {
    if (Math.abs(bay.lengthM - 6.615) > 0.001) {
        throw new Error('B-class parking length must be 6.615 m');
    }
    if (Math.abs(bay.depthM - 2.125) > 0.001) {
        throw new Error('B-class parking depth must be 2.125 m');
    }
    if (bay.cornerRadiusM <= 0 || bay.cornerRadiusM > bay.depthM) {
        throw new Error('Invalid corner radius');
    }
}
