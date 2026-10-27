import * as THREE from 'three';

type WheelPositions = { FL: THREE.Vector3; FR: THREE.Vector3; RL: THREE.Vector3; RR: THREE.Vector3 };
type Point = { x: number; z: number };
type CurbFootprint = {
    minX: number; maxX: number; minZ: number; maxZ: number;
    triangles: Float32Array;
};

const CELL_SIZE_M = 4;
const TIRE_CONTACT_RADIUS_M = .16;
const TIRE_CONTACT_RADIUS_SQ = TIRE_CONTACT_RADIUS_M ** 2;

const cross = (ax: number, az: number, bx: number, bz: number) => ax * bz - az * bx;

function pointToSegmentDistanceSq(
    px: number, pz: number, ax: number, az: number, bx: number, bz: number,
): number {
    const dx = bx - ax;
    const dz = bz - az;
    const lengthSq = dx * dx + dz * dz;
    const t = lengthSq > 0
        ? THREE.MathUtils.clamp(((px - ax) * dx + (pz - az) * dz) / lengthSq, 0, 1)
        : 0;
    return (px - ax - t * dx) ** 2 + (pz - az - t * dz) ** 2;
}

function segmentDistanceSq(
    ax: number, az: number, bx: number, bz: number,
    cx: number, cz: number, dx: number, dz: number,
): number {
    const rx = bx - ax;
    const rz = bz - az;
    const sx = dx - cx;
    const sz = dz - cz;
    const denominator = cross(rx, rz, sx, sz);
    if (Math.abs(denominator) > 1e-9) {
        const qx = cx - ax;
        const qz = cz - az;
        const t = cross(qx, qz, sx, sz) / denominator;
        const u = cross(qx, qz, rx, rz) / denominator;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return 0;
    }
    return Math.min(
        pointToSegmentDistanceSq(ax, az, cx, cz, dx, dz),
        pointToSegmentDistanceSq(bx, bz, cx, cz, dx, dz),
        pointToSegmentDistanceSq(cx, cz, ax, az, bx, bz),
        pointToSegmentDistanceSq(dx, dz, ax, az, bx, bz),
    );
}

function segmentTouchesTriangle(from: Point, to: Point, triangle: Float32Array, offset: number): boolean {
    const ax = triangle[offset];
    const az = triangle[offset + 1];
    const bx = triangle[offset + 2];
    const bz = triangle[offset + 3];
    const cx = triangle[offset + 4];
    const cz = triangle[offset + 5];
    const inside = (point: Point) => {
        const ab = cross(bx - ax, bz - az, point.x - ax, point.z - az);
        const bc = cross(cx - bx, cz - bz, point.x - bx, point.z - bz);
        const ca = cross(ax - cx, az - cz, point.x - cx, point.z - cz);
        return !(ab < 0 || bc < 0 || ca < 0) || !(ab > 0 || bc > 0 || ca > 0);
    };
    if (inside(from) || inside(to)) return true;
    return segmentDistanceSq(from.x, from.z, to.x, to.z, ax, az, bx, bz)
        <= TIRE_CONTACT_RADIUS_SQ
        || segmentDistanceSq(from.x, from.z, to.x, to.z, bx, bz, cx, cz)
        <= TIRE_CONTACT_RADIUS_SQ
        || segmentDistanceSq(from.x, from.z, to.x, to.z, cx, cz, ax, az)
        <= TIRE_CONTACT_RADIUS_SQ;
}

/** Checks wheel travel against tagged raised sidewalk curbs. Built once per track. */
export class RedWhiteCurbContact {
    private readonly footprints: CurbFootprint[] = [];
    private readonly cells = new Map<string, number[]>();
    private previousWheels: Point[] | null = null;

    constructor(root: THREE.Object3D) {
        root.updateWorldMatrix(true, true);
        const a = new THREE.Vector3();
        const b = new THREE.Vector3();
        const c = new THREE.Vector3();
        // Render meshes may batch many metres of curb. Partition the triangles
        // themselves so a wheel never scans a whole render chunk at each frame.
        const cellTriangles = new Map<string, {
            minX: number; maxX: number; minZ: number; maxZ: number;
            vertices: number[];
        }>();
        root.traverse(object => {
            if (!(object instanceof THREE.Mesh) || object.userData.sidewalkCurb !== true) return;
            for (let parent: THREE.Object3D | null = object; parent; parent = parent.parent) {
                if (!parent.visible) return;
            }
            const positions = object.geometry.getAttribute('position');
            if (!positions) return;
            const indices = object.geometry.getIndex();
            const vertexAt = (index: number, target: THREE.Vector3) => target
                .set(positions.getX(index), positions.getY(index), positions.getZ(index))
                .applyMatrix4(object.matrixWorld);
            const triangleCount = Math.floor((indices?.count ?? positions.count) / 3);
            for (let i = 0; i < triangleCount; i++) {
                vertexAt(indices ? indices.getX(i * 3) : i * 3, a);
                vertexAt(indices ? indices.getX(i * 3 + 1) : i * 3 + 1, b);
                vertexAt(indices ? indices.getX(i * 3 + 2) : i * 3 + 2, c);
                if (Math.abs(cross(b.x - a.x, b.z - a.z, c.x - a.x, c.z - a.z)) < 1e-8) continue;
                const minX = Math.min(a.x, b.x, c.x);
                const maxX = Math.max(a.x, b.x, c.x);
                const minZ = Math.min(a.z, b.z, c.z);
                const maxZ = Math.max(a.z, b.z, c.z);
                // Include adjacent cells reached by the tire edge, keeping
                // contact continuous at cell boundaries and during fast sweeps.
                for (let cellX = Math.floor((minX - TIRE_CONTACT_RADIUS_M) / CELL_SIZE_M);
                    cellX <= Math.floor((maxX + TIRE_CONTACT_RADIUS_M) / CELL_SIZE_M); cellX++) {
                    for (let cellZ = Math.floor((minZ - TIRE_CONTACT_RADIUS_M) / CELL_SIZE_M);
                        cellZ <= Math.floor((maxZ + TIRE_CONTACT_RADIUS_M) / CELL_SIZE_M); cellZ++) {
                        const key = `${cellX},${cellZ}`;
                        let cell = cellTriangles.get(key);
                        if (!cell) {
                            cell = { minX, maxX, minZ, maxZ, vertices: [] };
                            cellTriangles.set(key, cell);
                        }
                        cell.minX = Math.min(cell.minX, minX);
                        cell.maxX = Math.max(cell.maxX, maxX);
                        cell.minZ = Math.min(cell.minZ, minZ);
                        cell.maxZ = Math.max(cell.maxZ, maxZ);
                        cell.vertices.push(a.x, a.z, b.x, b.z, c.x, c.z);
                    }
                }
            }
        });
        for (const [key, { minX, maxX, minZ, maxZ, vertices }] of cellTriangles) {
            const curbIndex = this.footprints.push({
                minX, maxX, minZ, maxZ, triangles: new Float32Array(vertices),
            }) - 1;
            this.cells.set(key, [curbIndex]);
        }
    }

    reset(): void {
        this.previousWheels = null;
    }

    touches(wheels: WheelPositions): boolean {
        const current: Point[] = [wheels.FL, wheels.FR, wheels.RL, wheels.RR]
            .map(wheel => ({ x: wheel.x, z: wheel.z }));
        const previous = this.previousWheels;
        this.previousWheels = current;
        for (let wheelIndex = 0; wheelIndex < current.length; wheelIndex++) {
            const from = previous?.[wheelIndex] ?? current[wheelIndex];
            const to = current[wheelIndex];
            const minX = Math.min(from.x, to.x) - TIRE_CONTACT_RADIUS_M;
            const maxX = Math.max(from.x, to.x) + TIRE_CONTACT_RADIUS_M;
            const minZ = Math.min(from.z, to.z) - TIRE_CONTACT_RADIUS_M;
            const maxZ = Math.max(from.z, to.z) + TIRE_CONTACT_RADIUS_M;
            const visited = new Set<number>();
            for (let cellX = Math.floor(minX / CELL_SIZE_M);
                cellX <= Math.floor(maxX / CELL_SIZE_M); cellX++) {
                for (let cellZ = Math.floor(minZ / CELL_SIZE_M);
                    cellZ <= Math.floor(maxZ / CELL_SIZE_M); cellZ++) {
                    for (const curbIndex of this.cells.get(`${cellX},${cellZ}`) ?? []) {
                        if (visited.has(curbIndex)) continue;
                        visited.add(curbIndex);
                        const curb = this.footprints[curbIndex];
                        if (maxX < curb.minX || minX > curb.maxX
                            || maxZ < curb.minZ || minZ > curb.maxZ) continue;
                        for (let offset = 0; offset < curb.triangles.length; offset += 6) {
                            if (segmentTouchesTriangle(from, to, curb.triangles, offset)) return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}
