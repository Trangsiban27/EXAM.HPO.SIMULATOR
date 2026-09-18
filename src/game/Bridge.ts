import * as THREE from 'three';

/** A driveable hill-start bridge. Local +Z is the downhill direction; local -Z is the uphill approach. */
export class Bridge {
    readonly root = new THREE.Group();
    readonly width = 8;
    readonly length = 26;
    private readonly height = 1.5;
    private readonly rampLength = 10;
    private readonly probe = new THREE.Vector3();

    constructor(x: number, z: number, direction: 'vertical' | 'horizontal' = 'vertical') {
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
        const asphalt = new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 });
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
            // Solid center line, interrupted by the stop marking on the uphill ramp.
            // Center line gián đoạn tại vạch trắng (local Z = +5 → world X = 26).
            if (Math.abs(mid - 5) > .3) strip(0, .15, from, to, .012, .008, white);
            for (const side of [-1, 1]) {
                strip(side * (this.width / 2 - .1), .2, from, to, .025, .05,
                    Math.floor(i / 3) % 2 === 0 ? white : red);
                strip(side * (this.width / 2 + .1), .08, from, to, .9, .08, metal);
            }
        }
        for (let z = -12; z <= 12; z += 2) {
            for (const side of [-1, 1]) {
                box(.1, .95, .1, side * (this.width / 2 + .1), .06 + this.elevation(z) + .475, z, metal);
            }
        }

        // Yellow reference line — 4.0m uphill from the white stop line
        // (vạch vàng nằm phía trước vạch trắng về hướng xe đang lên dốc).
        // Vàng tại local Z ∈ [+9.6, +9.4] → world X = 21.5 (ramp lên TÂY).
        strip(0, this.width - .4, 9.6, 9.4, .02, .012, yellow);

        // Stop line across the two lanes on the uphill approach.
        // Xe đi +X; local Z dương = world X nhỏ hơn = phía trước đỉnh dốc (xe đang lên dốc).
        // Trắng tại local Z ∈ [+5.6, +5.4] → world X = 25.5 (ramp lên TÂY).
        strip(0, this.width - .4, 5.6, 5.4, .02, .012, white);

        const canvas = document.createElement('canvas');
        canvas.width = 1024; canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#1453a0'; ctx.fillRect(0, 0, 1024, 256);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 12; ctx.strokeRect(10, 10, 1004, 236);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 66px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('DỪNG XE NGANG DỐC CẦU', 512, 128, 960);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.05),
            new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide }));
        // Đặt sign ở local Z = +10 → world X = 21 (trước vạch trắng, trong ramp lên TÂY).
        sign.position.set(this.width / 2 + 2.5, 2.6, 10);
        this.root.add(sign);
        box(.12, 2.6, .12, this.width / 2 + 2.5, 1.3, 10, metal);
    }
}
