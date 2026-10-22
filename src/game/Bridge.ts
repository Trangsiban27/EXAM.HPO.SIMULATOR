import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';
import { EXAM_03_STOP_LINE_LOCAL_Z, EXAM_03_YELLOW_LINE_LOCAL_Z } from './exam/examCourseGeometry';
import {
    createStraightRoadArrowTexture,
    STRAIGHT_ROAD_ARROW_LENGTH_M,
    STRAIGHT_ROAD_ARROW_WIDTH_M,
} from './straightRoadArrow';

/** A driveable hill-start bridge. Local +Z is the downhill direction; local -Z is the uphill approach. */
export class Bridge {
    readonly root = new THREE.Group();
    readonly width: number;
    readonly length = 40;
    private readonly height = 1.5;
    private readonly rampLength = 15;
    private readonly probe = new THREE.Vector3();

    /** Distance from the bridge centre to the point where the descent begins. */
    get crestHalfLength(): number { return this.length / 2 - this.rampLength; }

    constructor(
        x: number,
        z: number,
        direction: 'vertical' | 'horizontal' = 'vertical',
        widthM = 8,
    ) {
        if (widthM <= 0) throw new Error('Bridge: widthM must be > 0');
        this.width = widthM;
        this.root.name = 'hill-start-bridge';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = direction === 'horizontal' ? -Math.PI / 2 : 0;
        this.build();
        this.root.updateMatrixWorld(true);
    }

    private elevation(z: number) {
        const t = THREE.MathUtils.clamp((this.length / 2 - Math.abs(z)) / this.rampLength, 0, 1);
        return this.height * t * t * (3 - 2 * t);
    }

    surfaceHeight(x: number, z: number): number | undefined {
        this.probe.set(x, 0, z);
        this.root.worldToLocal(this.probe);
        if (Math.abs(this.probe.x) > this.width / 2 || Math.abs(this.probe.z) > this.length / 2) return undefined;
        return this.root.position.y + .06 + this.elevation(this.probe.z);
    }

    private build() {
        const asphalt = new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95 });
        const concrete = new THREE.MeshStandardMaterial({ color: 0xa7adb0, roughness: .9 });
        const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .8 });
        const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: .8 });
        const yellow = new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: .8 });
        const metal = new THREE.MeshStandardMaterial({ color: 0xc7d0d5, metalness: .65, roughness: .35 });
        const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material) => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
            mesh.position.set(x, y, z);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            this.root.add(mesh);
            return mesh;
        };
        const strip = (x: number, width: number, from: number, to: number, lift: number,
            thickness: number, material: THREE.Material) => {
            const y1 = .06 + this.elevation(from);
            const y2 = .06 + this.elevation(to);
            const mesh = box(width, thickness, Math.hypot(to - from, y2 - y1),
                x, (y1 + y2) / 2 + lift, (from + to) / 2, material);
            mesh.rotation.x = -Math.atan2(y2 - y1, to - from);
        };

        // Closely sampled slopes soften the transition at the foot and crest.
        const step = .25;
        for (let i = 0; i < this.length / step; i++) {
            const from = -this.length / 2 + i * step;
            const to = from + step;
            const mid = (from + to) / 2;
            const elevation = this.elevation(mid);
            // box(this.width, elevation + .04, step, 0, (elevation + .04) / 2, mid, concrete);
            strip(0, this.width, from, to, -.01, .02, asphalt);
            // Vạch giữa nét đứt từ chân dốc lên qua đỉnh tới chân dốc xuống.
            const distanceFromEntry = this.length / 2 - mid;
            if (distanceFromEntry % 2.5 < 1.5 && Math.abs(mid - 10) > .2) {
                strip(0, .12, from, to, .012, .008, white);
            }
            for (const side of [-1, 1]) {
                strip(side * (this.width / 2 - CURB_VISUAL_WIDTH_M / 2),
                    CURB_VISUAL_WIDTH_M, from, to, .025, CURB_VISUAL_HEIGHT_M,
                    Math.floor(i / 3) % 2 === 0 ? white : red);
                strip(side * (this.width / 2 + .1), .08, from, to, .9, .08, metal);
            }
        }
        for (let z = -this.length / 2 + 1; z <= this.length / 2 - 1; z += 2) {
            for (const side of [-1, 1]) {
                box(.1, .95, .1, side * (this.width / 2 + .1), .06 + this.elevation(z) + .475, z, metal);
            }
        }

        // Yellow reference line — 4.0m uphill from the highlighted stop line.
        // Vàng cách chân dốc lên 6 m: chân dốc local Z = +20, vạch tâm tại Z = +14.
        const yellowLineWidth = this.width - .4;
        const yellowDashCount = 4;
        const yellowGap = .45;
        const yellowDashWidth = (yellowLineWidth - (yellowDashCount - 1) * yellowGap) / yellowDashCount;
        for (let i = 0; i < yellowDashCount; i++) {
            const dashX = -yellowLineWidth / 2 + yellowDashWidth / 2 + i * (yellowDashWidth + yellowGap);
            strip(dashX, yellowDashWidth, EXAM_03_YELLOW_LINE_LOCAL_Z + .075,
                EXAM_03_YELLOW_LINE_LOCAL_Z - .075, .02, .012, yellow);
        }
        // Stop line across the two lanes on the uphill approach.
        // Xe đi +X; local Z dương = world X nhỏ hơn = phía trước đỉnh dốc (xe đang lên dốc).
        // Vạch dừng màu trắng cách vạch vàng 4 m về phía đỉnh dốc.
        strip(0, this.width - .4, EXAM_03_STOP_LINE_LOCAL_Z + .075,
            EXAM_03_STOP_LINE_LOCAL_Z - .075, .02, .012, white);

        // Mũi tên ở chính giữa đỉnh cầu (local Z = 0) và trên dốc xuống,
        // cùng chiều xe chạy (local -Z).
        // Chia nhỏ mặt phẳng để từng đỉnh bám vào độ cao cong của mặt cầu.
        const arrowTexture = createStraightRoadArrowTexture();
        const arrowMaterial = new THREE.MeshBasicMaterial({
            map: arrowTexture,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        });
        for (const centerZ of [0, -12.5]) {
            for (const laneX of [-this.width / 4, this.width / 4]) {
                const geometry = new THREE.PlaneGeometry(
                    STRAIGHT_ROAD_ARROW_WIDTH_M, STRAIGHT_ROAD_ARROW_LENGTH_M, 1, 34,
                );
                const positions = geometry.getAttribute('position');
                for (let i = 0; i < positions.count; i++) {
                    const localZ = centerZ - positions.getY(i);
                    positions.setXYZ(i, laneX + positions.getX(i), .09 + this.elevation(localZ), localZ);
                }
                const arrow = new THREE.Mesh(geometry, arrowMaterial);
                arrow.name = 'bridge-direction-arrow';
                this.root.add(arrow);
            }
        }

    }
}
