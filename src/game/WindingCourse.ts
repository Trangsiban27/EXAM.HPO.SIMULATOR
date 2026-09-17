import * as THREE from 'three';

/** Two tangent, oppositely turning half circles. Entry and exit face west. */
export class WindingCourse {
    readonly root = new THREE.Group();
    readonly penaltyZones: THREE.Box3[] = [];
    readonly width = 2.2 * 1.8;
    // Approximate outer front-wheel turning radius from the current vehicle model.
    readonly turningRadius = Math.hypot(2.65 / Math.tan(THREE.MathUtils.degToRad(31)) + .94, 1.3);
    // Scale the centre-line radius independently of lane width; 1 uses the base formula.
    readonly curveScale = 1;
    readonly outerRadius = (this.turningRadius + 1.2 - this.width / 2) * this.curveScale + this.width / 2;
    readonly innerRadius = this.outerRadius - this.width;
    readonly centreSpacing = this.outerRadius + this.innerRadius;
    readonly exit: THREE.Vector3;

    constructor(x: number, z: number) {
        this.root.name = 'winding-course';
        const radius = this.centreSpacing / 2;
        this.exit = new THREE.Vector3(x, .06, z + 4 * radius);
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
            [z + radius, -Math.PI / 2, -3 * Math.PI / 2],
            [z + 3 * radius, -Math.PI / 2, Math.PI / 2]
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
