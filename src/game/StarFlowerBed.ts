import * as THREE from 'three';

/** A softly raised, five-point planted star for the grass island. */
export class StarFlowerBed {
    readonly root = new THREE.Group();

    constructor(x: number, z: number, radiusM: number) {
        this.root.name = 'star-flower-bed';
        this.root.position.set(x, 0, z);

        const innerRatio = Math.sin(Math.PI / 10) / Math.sin(3 * Math.PI / 10);
        const star = (radius: number) => {
            const shape = new THREE.Shape();
            const points: THREE.Vector2[] = [];
            for (let i = 0; i < 10; i++) {
                const distance = i % 2 === 0 ? radius : radius * innerRatio;
                const angle = -Math.PI / 2 + i * Math.PI / 5;
                const point = new THREE.Vector2(
                    distance * Math.cos(angle), distance * Math.sin(angle));
                points.push(point);
                if (i === 0) shape.moveTo(point.x, point.y);
                else shape.lineTo(point.x, point.y);
            }
            shape.closePath();
            return { shape, points };
        };

        // Broad, blended colour patches resemble planted foliage without rows of round clumps.
        const textureSize = 512;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = textureSize;
        const context = canvas.getContext('2d')!;
        const image = context.createImageData(textureSize, textureSize);
        const hash = (x: number, y: number, seed: number) => {
            let value = Math.imul(x, 374761393) + Math.imul(y, 668265263) + seed;
            value = Math.imul(value ^ (value >>> 13), 1274126177);
            return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
        };
        const noise = (u: number, v: number, frequency: number, seed: number) => {
            const px = u * frequency;
            const py = v * frequency;
            const ix = Math.floor(px);
            const iy = Math.floor(py);
            const fx = (px - ix) ** 2 * (3 - 2 * (px - ix));
            const fy = (py - iy) ** 2 * (3 - 2 * (py - iy));
            const a = THREE.MathUtils.lerp(hash(ix, iy, seed), hash(ix + 1, iy, seed), fx);
            const b = THREE.MathUtils.lerp(hash(ix, iy + 1, seed), hash(ix + 1, iy + 1, seed), fx);
            return THREE.MathUtils.lerp(a, b, fy);
        };
        for (let py = 0; py < textureSize; py++) {
            for (let px = 0; px < textureSize; px++) {
                const u = px / textureSize;
                const v = py / textureSize;
                const broad = noise(u, v, 4, 17);
                const medium = noise(u, v, 10, 31);
                const grain = noise(u, v, 36, 47);
                const rust = THREE.MathUtils.clamp((broad * .72 + medium * .28 - .28) / .36, 0, 1);
                const warm = Math.max(0, medium - .55) * .35;
                const shade = (grain - .5) * 14;
                const offset = (py * textureSize + px) * 4;
                image.data[offset] = 64 + rust * 67 + warm * 35 + shade;
                image.data[offset + 1] = 80 - rust * 17 + warm * 19 + shade;
                image.data[offset + 2] = 39 - rust * 7 + warm * 6 + shade * .5;
                image.data[offset + 3] = 255;
            }
        }
        context.putImageData(image, 0, 0);
        const plantingTexture = new THREE.CanvasTexture(canvas);
        plantingTexture.colorSpace = THREE.SRGBColorSpace;
        plantingTexture.anisotropy = 4;

        const addRaisedStar = (radius: number, y: number, height: number,
            color: number, name: string, texture?: THREE.Texture) => {
            const geometry = new THREE.ExtrudeGeometry(star(radius).shape, {
                depth: height,
                bevelEnabled: true,
                bevelSize: .04,
                bevelThickness: .035,
                bevelSegments: 3,
                steps: 1,
            });
            // ExtrudeGeometry's cap UVs use metre coordinates; map the full star to the canvas.
            const positions = geometry.getAttribute('position');
            const uvs = geometry.getAttribute('uv');
            for (let i = 0; i < positions.count; i++) {
                uvs.setXY(i,
                    (positions.getX(i) + radius) / (2 * radius),
                    (positions.getY(i) + radius) / (2 * radius));
            }
            geometry.rotateX(-Math.PI / 2);
            const side = new THREE.MeshStandardMaterial({ color, roughness: 1 });
            const top = texture
                ? new THREE.MeshStandardMaterial({ map: texture, roughness: 1 })
                : side;
            const mesh = new THREE.Mesh(geometry, [top, side]);
            mesh.name = name;
            mesh.position.y = y;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.root.add(mesh);
        };

        addRaisedStar(radiusM, .03, .19, 0x3d5b30, 'star-flower-bed-foliage');
        const plantingRadiusM = radiusM - .25;
        addRaisedStar(plantingRadiusM, .20, .10, 0x704628,
            'star-flower-bed-soil', plantingTexture);

        // A single gently domed surface adds height while keeping the planting continuous.
        const outline = star(plantingRadiusM - .04).points;
        const edgePoints: THREE.Vector2[] = [];
        for (let i = 0; i < outline.length; i++) {
            const next = outline[(i + 1) % outline.length];
            for (let step = 0; step < 8; step++) {
                edgePoints.push(outline[i].clone().lerp(next, step / 8));
            }
        }
        const vertices: number[] = [0, .425, 0];
        const uv: number[] = [.5, .5];
        const rings = [.25, .5, .75, 1];
        for (const ring of rings) {
            for (const point of edgePoints) {
                const px = point.x * ring;
                const py = point.y * ring;
                vertices.push(px, .35 + .075 * (1 - ring * ring), -py);
                uv.push((px + plantingRadiusM) / (2 * plantingRadiusM),
                    (py + plantingRadiusM) / (2 * plantingRadiusM));
            }
        }
        const triangles: number[] = [];
        const count = edgePoints.length;
        for (let i = 0; i < count; i++) triangles.push(0, i + 1, (i + 1) % count + 1);
        for (let ring = 0; ring < rings.length - 1; ring++) {
            const inner = 1 + ring * count;
            const outer = inner + count;
            for (let i = 0; i < count; i++) {
                const next = (i + 1) % count;
                triangles.push(inner + i, outer + i, outer + next,
                    inner + i, outer + next, inner + next);
            }
        }
        const surfaceGeometry = new THREE.BufferGeometry();
        surfaceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        surfaceGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        surfaceGeometry.setIndex(triangles);
        surfaceGeometry.computeVertexNormals();
        const surface = new THREE.Mesh(surfaceGeometry,
            new THREE.MeshStandardMaterial({ map: plantingTexture, roughness: 1 }));
        surface.name = 'star-flower-bed-planted-surface';
        surface.castShadow = true;
        surface.receiveShadow = true;
        this.root.add(surface);
    }
}
