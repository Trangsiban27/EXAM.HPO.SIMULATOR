import * as THREE from 'three';
import { ROAD_SURFACE_COLOR } from './roadStyle';
import { CURB_VISUAL_HEIGHT_M, SIDEWALK_CURB_HEIGHT_M,
    SIDEWALK_CURB_WIDTH_M, SIDEWALK_PAINT_GAP_M } from './curbStyle';

type Point = { x: number; y: number; z: number };
type Triangle = [Point, Point, Point];
type Edge = { a: Point; b: Point; nx: number; nz: number; length: number };
type Strip = { triangles: Triangle[]; chain: Edge[]; color: THREE.Color };
type Batch = { positions: number[]; colors: number[] };
const CELL = 4;
const CHUNK = 16;
const vertexKey = (p: Point) => `${p.x.toFixed(4)},${p.y.toFixed(4)},${p.z.toFixed(4)}`;
const cross = (ax: number, az: number, bx: number, bz: number) => ax * bz - az * bx;

function visible(object: THREE.Object3D): boolean {
    for (let item: THREE.Object3D | null = object; item; item = item.parent) if (!item.visible) return false;
    return true;
}

/** Read only upward faces, including the sloping surface of the hill-start bridge. */
function topTriangles(mesh: THREE.Mesh): Triangle[] {
    const geometry = mesh.geometry;
    const positions = geometry.getAttribute('position');
    if (!positions) return [];
    const indices = geometry.index;
    const result: Triangle[] = [];
    const reversedFlatFaces: Triangle[] = [];
    const point = (i: number) => new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld);
    for (let i = 0, count = indices?.count ?? positions.count; i < count; i += 3) {
        const a = point(indices ? indices.getX(i) : i);
        const b = point(indices ? indices.getX(i + 1) : i + 1);
        const c = point(indices ? indices.getX(i + 2) : i + 2);
        const area = cross(b.x - a.x, b.z - a.z, c.x - a.x, c.z - a.z);
        if (area < -1e-9) result.push([a, b, c]);
        else if (area > 1e-9 && Math.abs(a.y - b.y) < 1e-5 && Math.abs(a.y - c.y) < 1e-5) {
            reversedFlatFaces.push([a, c, b]);
        }
    }
    // Mirrored parking-bay arc strips have a double-sided top with reverse winding.
    return result.length ? result : reversedFlatFaces;
}

class RoadSurfaceIndex {
    private cells = new Map<string, Triangle[]>();

    add(triangle: Triangle): void {
        const minX = Math.min(...triangle.map(p => p.x)), maxX = Math.max(...triangle.map(p => p.x));
        const minZ = Math.min(...triangle.map(p => p.z)), maxZ = Math.max(...triangle.map(p => p.z));
        for (let x = Math.floor(minX / CELL); x <= Math.floor(maxX / CELL); x++) {
            for (let z = Math.floor(minZ / CELL); z <= Math.floor(maxZ / CELL); z++) {
                const key = `${x},${z}`;
                const cell = this.cells.get(key) ?? [];
                cell.push(triangle); this.cells.set(key, cell);
            }
        }
    }

    height(x: number, z: number, nearY: number): number | undefined {
        let best: number | undefined;
        for (const [a, b, c] of this.cells.get(`${Math.floor(x / CELL)},${Math.floor(z / CELL)}`) ?? []) {
            const det = cross(b.x - a.x, b.z - a.z, c.x - a.x, c.z - a.z);
            const u = cross(x - a.x, z - a.z, c.x - a.x, c.z - a.z) / det;
            const v = cross(b.x - a.x, b.z - a.z, x - a.x, z - a.z) / det;
            if (u < -1e-7 || v < -1e-7 || u + v > 1 + 1e-7) continue;
            const y = a.y + u * (b.y - a.y) + v * (c.y - a.y);
            if (Math.abs(y - nearY) < .30 && (best === undefined || y > best)) best = y;
        }
        return best;
    }
}

/** Weld the top's triangle edges back into the actual curved outline. */
function outline(triangles: Triangle[]): Point[] {
    const counts = new Map<string, { a: Point; b: Point; count: number }>();
    for (const triangle of triangles) for (let i = 0; i < 3; i++) {
        const a = triangle[i], b = triangle[(i + 1) % 3];
        const ak = vertexKey(a), bk = vertexKey(b);
        const key = ak < bk ? `${ak}|${bk}` : `${bk}|${ak}`;
        const edge = counts.get(key);
        if (edge) edge.count++;
        else counts.set(key, { a, b, count: 1 });
    }
    const edges = [...counts.values()].filter(edge => edge.count === 1);
    if (!edges.length) return [];
    const points = [edges[0].a, edges[0].b];
    const remaining = edges.slice(1);
    while (remaining.length) {
        const key = vertexKey(points[points.length - 1]);
        const index = remaining.findIndex(edge => vertexKey(edge.a) === key || vertexKey(edge.b) === key);
        if (index < 0) break;
        const edge = remaining.splice(index, 1)[0];
        const next = vertexKey(edge.a) === key ? edge.b : edge.a;
        if (vertexKey(next) === vertexKey(points[0])) break;
        points.push(next);
    }
    const area = points.reduce((sum, p, i) => {
        const q = points[(i + 1) % points.length]; return sum + p.x * q.z - q.x * p.z;
    }, 0);
    if (area < 0) points.reverse();
    return points;
}

/** Choose the longitudinal boundary facing away from the neighbouring asphalt. */
function grassEdge(points: Point[], roads: RoadSurfaceIndex, tangent?: THREE.Vector3): Edge[] {
    const center = points.reduce((sum, p) => sum.add(new THREE.Vector2(p.x, p.z)), new THREE.Vector2())
        .multiplyScalar(1 / points.length);
    let xx = 0, zz = 0, xz = 0;
    for (const p of points) { const x = p.x - center.x, z = p.z - center.y; xx += x * x; zz += z * z; xz += x * z; }
    const angle = .5 * Math.atan2(2 * xz, xx - zz);
    const ax = tangent?.x ?? Math.cos(angle), az = tangent?.z ?? Math.sin(angle);
    const edges = points.map((a, i): Edge => {
        const b = points[(i + 1) % points.length];
        const length = Math.hypot(b.x - a.x, b.z - a.z);
        return { a, b, nx: (b.z - a.z) / length, nz: -(b.x - a.x) / length, length };
    }).filter(edge => edge.length > 1e-7);
    const along = edges.map(edge => Math.abs(((edge.b.x - edge.a.x) * ax
        + (edge.b.z - edge.a.z) * az) / edge.length) > .55);
    const firstCap = along.findIndex(value => !value);
    const chains: Edge[][] = [];
    let chain: Edge[] = [];
    for (let i = 1; i <= edges.length; i++) {
        const index = (Math.max(0, firstCap) + i) % edges.length;
        if (along[index]) chain.push(edges[index]);
        else if (chain.length) { chains.push(chain); chain = []; }
    }
    if (chain.length) chains.push(chain);
    if (!chains.length) return [];
    const score = (candidate: Edge[]) => {
        let total = 0, length = 0;
        for (const edge of candidate) {
            const x = (edge.a.x + edge.b.x) / 2, z = (edge.a.z + edge.b.z) / 2;
            const y = (edge.a.y + edge.b.y) / 2;
            let occupancy = 0;
            for (const distance of [.08, .18, .35, .6, .95]) {
                if (roads.height(x + edge.nx * distance, z + edge.nz * distance, y) !== undefined) occupancy++;
                if (roads.height(x - edge.nx * distance, z - edge.nz * distance, y) !== undefined) occupancy--;
            }
            total += occupancy * edge.length; length += edge.length;
        }
        return total / length;
    };
    chains.sort((a, b) => score(a) - score(b));
    return chains[0];
}

function boxTangent(source: THREE.Mesh): THREE.Vector3 | undefined {
    if (!(source.geometry instanceof THREE.BoxGeometry)) return undefined;
    const { width, depth } = source.geometry.parameters;
    const xIsWidth = Math.abs(width - .1) < 1e-6;
    const zIsWidth = Math.abs(depth - .1) < 1e-6;
    if (xIsWidth === zIsWidth) return undefined;
    // A clipped stripe can be shorter than its 10 cm width. Its construction
    // axis still follows the road; choosing its longest side would turn it 90°.
    return new THREE.Vector3(xIsWidth ? 0 : 1, 0, xIsWidth ? 1 : 0)
        .transformDirection(source.matrixWorld);
}

function knownGrassEdge(source: THREE.Mesh): Edge[] | undefined {
    let path = source.userData.roadEdgeGrassPath as [number, number, number][] | undefined;
    const side = source.userData.roadEdgeGrassSide as number | undefined;
    if (!path && (side === -1 || side === 1) && source.geometry instanceof THREE.BoxGeometry) {
        const { width, height, depth } = source.geometry.parameters;
        path = [
            [side * width / 2, height / 2, -side * depth / 2],
            [side * width / 2, height / 2, side * depth / 2],
        ];
    }
    if (!path || path.length < 2) return undefined;
    const points = path.map(point => new THREE.Vector3(...point).applyMatrix4(source.matrixWorld));
    // A mirrored left turn reverses winding. Preserve the intended grass side
    // when deriving world-space right normals from the local path.
    if (source.matrixWorld.determinant() < 0) points.reverse();
    return points.slice(0, -1).map((a, i): Edge => {
        const b = points[i + 1];
        const length = Math.hypot(b.x - a.x, b.z - a.z);
        return { a, b, nx: (b.z - a.z) / length, nz: -(b.x - a.x) / length, length };
    }).filter(edge => edge.length > 1e-7);
}

/**
 * Run after intersection cuts: legacy narrow strips become white paint; the
 * new bevelled red/white kerb occupies the grass side only. Batches stay local
 * (16 m chunks) so cameras can cull distant pieces. No per-stripe draw calls.
 */
export function buildSidewalks(root: THREE.Group): THREE.Group {
    const group = new THREE.Group();
    group.name = 'white-road-edges-and-raised-sidewalks';
    const roads = new RoadSurfaceIndex();
    const roadColor = new THREE.Color(ROAD_SURFACE_COLOR);
    const sources: THREE.Mesh[] = [];
    root.updateWorldMatrix(true, true);
    root.traverse(object => {
        if (!(object instanceof THREE.Mesh) || !visible(object)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        if (object.name.endsWith('red-white-curb') || object.userData.roadEdgeStrip === true) sources.push(object);
        else if (materials.some(material => material instanceof THREE.MeshStandardMaterial && material.color.equals(roadColor))) {
            for (const triangle of topTriangles(object)) roads.add(triangle);
        }
    });

    const strips: Strip[] = [];
    const normals = new Map<string, THREE.Vector2>();
    for (const source of sources) {
        const triangles = topTriangles(source);
        const points = outline(triangles);
        const chain = knownGrassEdge(source) ?? (points.length >= 3 ? grassEdge(points, roads, boxTangent(source)) : []);
        if (!triangles.length || !chain.length) continue;
        // Parallel-bay mouth corners join a road stripe to a perpendicular bay
        // stripe. Their centre-line cuts differ by half the paint width.
        // Snap only the explicitly registered junction endpoints before forming
        // the shared miter; do not add overlapping corner boxes.
        const junctions = root.userData.roadEdgeJunctions as
            { x: number; y: number; z: number; tolerance: number }[] | undefined;
        for (const edge of chain) {
            for (const p of [edge.a, edge.b]) {
                const junction = junctions?.find(q => Math.hypot(p.x - q.x, p.z - q.z) <= q.tolerance
                    && Math.abs(p.y - q.y) < .01);
                if (junction) { p.x = junction.x; p.z = junction.z; p.y = junction.y; }
            }
            edge.length = Math.hypot(edge.b.x - edge.a.x, edge.b.z - edge.a.z);
        }
        for (let i = chain.length - 1; i >= 0; i--) if (chain[i].length < 1e-7) chain.splice(i, 1);
        if (!chain.length) continue;
        const material = (Array.isArray(source.material) ? source.material[0] : source.material) as THREE.MeshStandardMaterial;
        const oldColor = material.color ?? new THREE.Color(0xffffff);
        const color = new THREE.Color(oldColor.r > oldColor.g * 1.5 ? 0xd9574f : 0xf2f0e8);
        strips.push({ triangles, chain, color });
        for (const edge of chain) for (const p of [edge.a, edge.b]) {
            const key = vertexKey(p), normal = normals.get(key) ?? new THREE.Vector2();
            normal.add(new THREE.Vector2(edge.nx, edge.nz)); normals.set(key, normal);
        }
        source.visible = false;
        source.userData.replacedRoadEdge = true;
    }

    const paintBatches = new Map<string, Batch>(), curbBatches = new Map<string, Batch>();
    const batch = (batches: Map<string, Batch>, p: Point): Batch => {
        const key = `${Math.floor(p.x / CHUNK)},${Math.floor(p.z / CHUNK)}`;
        let result = batches.get(key);
        if (!result) { result = { positions: [], colors: [] }; batches.set(key, result); }
        return result;
    };
    const tri = (target: Batch, a: Point, b: Point, c: Point, color?: THREE.Color) => {
        target.positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
        if (color) for (let i = 0; i < 3; i++) target.colors.push(color.r, color.g, color.b);
    };
    const roadHeight = (p: Point, edge: Edge) => {
        for (const distance of [0, .10, .25, .5, .9]) {
            const y = roads.height(p.x - edge.nx * distance, p.z - edge.nz * distance, p.y);
            if (y !== undefined) return y;
        }
        return p.y - CURB_VISUAL_HEIGHT_M;
    };
    for (const strip of strips) {
        const edge = strip.chain[0];
        const paint = batch(paintBatches, edge.a);
        // Flat strips can span two road surfaces with slightly different heights.
        // Interpolating their endpoint heights buries part of the paint under the
        // higher asphalt at the seam. Keep each flat strip above both surfaces.
        const points = strip.triangles.flat();
        const flat = points.every(p => Math.abs(p.y - points[0].y) < 1e-5);
        const flatHeight = flat ? Math.max(...strip.triangles.flatMap(triangle => {
            const samples = [...triangle, ...triangle.map((p, i) => {
                const q = triangle[(i + 1) % 3];
                return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, z: (p.z + q.z) / 2 };
            })];
            return samples.map(p => roadHeight(p, edge));
        })) : undefined;
        for (const triangle of strip.triangles) {
            const painted = triangle.map(p => ({ ...p, y: (flatHeight ?? roadHeight(p, edge)) + .005 })) as Triangle;
            tri(paint, ...painted);
        }
        const curb = batch(curbBatches, edge.a);
        const profile: [number, number][] = [
            [0, 0], [.025, SIDEWALK_CURB_HEIGHT_M - .025], [.05, SIDEWALK_CURB_HEIGHT_M],
            [SIDEWALK_CURB_WIDTH_M - .025, SIDEWALK_CURB_HEIGHT_M],
            [SIDEWALK_CURB_WIDTH_M, SIDEWALK_CURB_HEIGHT_M - .025], [SIDEWALK_CURB_WIDTH_M, 0],
        ];
        const section = (p: Point, current: Edge) => {
            const normal = (normals.get(vertexKey(p)) ?? new THREE.Vector2(current.nx, current.nz)).clone().normalize();
            const miter = 1 / Math.max(.7, normal.x * current.nx + normal.y * current.nz);
            return profile.map(([distance, height]) => ({
                x: p.x + normal.x * (SIDEWALK_PAINT_GAP_M + distance) * miter,
                y: roadHeight(p, current) + height,
                z: p.z + normal.y * (SIDEWALK_PAINT_GAP_M + distance) * miter,
            }));
        };
        const totalLength = strip.chain.reduce((sum, current) => sum + current.length, 0);
        const alternate = new THREE.Color(strip.color.r > strip.color.g * 1.5 ? 0xf2f0e8 : 0xd9574f);
        const colorAt = (distance: number) => totalLength > 1 && Math.floor(distance / .8) % 2
            ? alternate : strip.color;
        let travelled = 0;
        for (const current of strip.chain) {
            const cuts = [0];
            if (totalLength > 1) {
                for (let next = (Math.floor(travelled / .8) + 1) * .8;
                    next < travelled + current.length - 1e-7; next += .8) {
                    cuts.push((next - travelled) / current.length);
                }
            }
            cuts.push(1);
            const pointAt = (t: number): Point => ({
                x: THREE.MathUtils.lerp(current.a.x, current.b.x, t),
                y: THREE.MathUtils.lerp(current.a.y, current.b.y, t),
                z: THREE.MathUtils.lerp(current.a.z, current.b.z, t),
            });
            for (let part = 1; part < cuts.length; part++) {
                const a = section(pointAt(cuts[part - 1]), current), b = section(pointAt(cuts[part]), current);
                const color = colorAt(travelled + (cuts[part - 1] + cuts[part]) * current.length / 2);
                for (let i = 0; i < profile.length; i++) {
                    const j = (i + 1) % profile.length;
                    tri(curb, a[i], b[i], b[j], color);
                    tri(curb, a[i], b[j], a[j], color);
                }
            }
            travelled += current.length;
        }
        for (const [p, current, reverse] of [
            [strip.chain[0].a, strip.chain[0], false],
            [strip.chain.at(-1)!.b, strip.chain.at(-1)!, true],
        ] as const) {
            const cap = section(p, current);
            const color = colorAt(reverse ? totalLength - 1e-7 : 0);
            for (let i = 1; i < cap.length - 1; i++) {
                if (reverse) tri(curb, cap[0], cap[i + 1], cap[i], color);
                else tri(curb, cap[0], cap[i], cap[i + 1], color);
            }
        }
    }
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .95 });
    const sidewalk = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .88 });
    for (const [batches, material, raised] of [[paintBatches, white, false], [curbBatches, sidewalk, true]] as const) {
        for (const [key, data] of batches) {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
            if (raised) geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colors, 3));
            geometry.computeVertexNormals(); geometry.computeBoundingBox(); geometry.computeBoundingSphere();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = `${raised ? 'raised-sidewalk-red-white-curb' : 'white-road-edge-line'}-${key}`;
            mesh.userData.sidewalkCurb = raised;
            mesh.castShadow = false; mesh.receiveShadow = false; mesh.matrixAutoUpdate = false;
            group.add(mesh);
        }
    }
    group.userData.edgeStripCount = strips.length;
    root.add(group);
    return group;
}
