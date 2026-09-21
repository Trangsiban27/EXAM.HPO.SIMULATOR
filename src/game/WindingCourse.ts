import * as THREE from 'three';
import type { WindingCourseSpec } from './WindingCourseSpec';

/**
 * Two tangent, oppositely turning half circles. Entry and exit face west.
 *
 * Geometry lấy trực tiếp từ `spec/road/s_curve_road_cad_spec.md` §3–§6:
 *   outerRadius = Rn  (Bqc = Rn - Rtr)
 *   innerRadius = Rtr
 *   centreSpacing = Sqc = Rn + Rtr
 * KHÔNG dùng công thức dẫn xuất turningRadius nữa.
 */
export interface WindingCourseOptions {
    /** Spec chính xác từ CAD (xem WindingCourseSpec). */
    spec: WindingCourseSpec;
}

export class WindingCourse {
    readonly root = new THREE.Group();
    readonly penaltyZones: THREE.Box3[] = [];
    /** CAD label, dùng cho debug metadata. */
    readonly cadLabel: string;
    /** Chiều rộng phần đường driveable Bqc = Rn - Rtr (m). */
    readonly width: number;
    /** Chiều rộng envelope vật lý (clear width + curb). */
    readonly envelopeWidth: number;
    /** Bán kính vòng ngoài Rn (m). */
    readonly outerRadius: number;
    /** Bán kính vòng trong Rtr (m). */
    readonly innerRadius: number;
    /** Khoảng cách tâm hai nửa vòng tròn Sqc = Rn + Rtr (m). */
    readonly centreSpacing: number;
    /** Bán kính trung tâm của 1 nửa vòng tròn (= Sqc/2). */
    readonly radius: number;
    readonly exit: THREE.Vector3;

    constructor(x: number, z: number, opts: WindingCourseOptions) {
        const { spec } = opts;
        this.cadLabel = spec.cadLabel;
        this.width = spec.clearRoadWidthM;
        this.envelopeWidth = spec.constructionEnvelopeWidthM;
        this.outerRadius = spec.outerRadiusM;
        this.innerRadius = spec.innerRadiusM;
        this.centreSpacing = spec.centerDistanceM;
        this.radius = this.centreSpacing / 2;

        this.root.name = `winding-course-${spec.cadLabel}`;

        this.exit = new THREE.Vector3(x, .06, z + 4 * this.radius);
        const asphalt = new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 });
        const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 });
        const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: .85 });
        const band = (cz: number, inner: number, outer: number, from: number, to: number,
            height: number, top: number, material: THREE.Material) => {
            const shape = new THREE.Shape();
            const steps = Math.max(2, Math.ceil(Math.abs(to - from) * 64));
            for (let i = 0; i <= steps; i++) {
                const angle = from + (to - from) * i / steps;
                const px = x + outer * Math.cos(angle), pz = cz + outer * Math.sin(angle);
                if (i === 0) shape.moveTo(px, -pz);
                else shape.lineTo(px, -pz);
            }
            for (let i = steps; i >= 0; i--) {
                const angle = from + (to - from) * i / steps;
                shape.lineTo(x + inner * Math.cos(angle), -(cz + inner * Math.sin(angle)));
            }
            shape.closePath();
            const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
            geometry.translate(0, 0, -height);
            geometry.rotateX(-Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = top;
            mesh.receiveShadow = true;
            this.root.add(mesh);
            return mesh;
        };
        for (const [cz, from, to] of [
            [z + this.radius, -Math.PI / 2, -3 * Math.PI / 2],
            [z + 3 * this.radius, -Math.PI / 2, Math.PI / 2]
        ]) {
            band(cz, this.innerRadius, this.outerRadius, from, to, .08, .06, asphalt);
            for (const [r, inner, outer] of [
                [this.innerRadius, this.innerRadius - .2, this.innerRadius],
                [this.outerRadius, this.outerRadius, this.outerRadius + .2]
            ]) {
                band(cz, r - .05, r + .05, from, to, .008, .075, white);
                const count = Math.ceil(Math.PI * r / .8);
                for (let i = 0; i < count; i++) {
                    const start = from + (to - from) * i / count;
                    const end = from + (to - from) * (i + 1) / count;
                    band(cz, inner, outer, start, end, .05, .11, i % 2 ? red : white).castShadow = true;
                }
                // Short bounds follow the arc without penalising the clear lane interior.
                const samples = Math.ceil(Math.PI * r / .15);
                for (let i = 0; i < samples; i++) {
                    const start = from + (to - from) * i / samples;
                    const end = from + (to - from) * (i + 1) / samples;
                    const zone = new THREE.Box3().setFromPoints([
                        new THREE.Vector3(x + r * Math.cos(start), .1, cz + r * Math.sin(start)),
                        new THREE.Vector3(x + r * Math.cos(end), .9, cz + r * Math.sin(end))
                    ]);
                    zone.expandByVector(new THREE.Vector3(.125, .1, .125));
                    this.penaltyZones.push(zone);
                }
            }
        }
    }
}
