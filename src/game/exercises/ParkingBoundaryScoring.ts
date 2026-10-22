import * as THREE from 'three';
import type { PenaltyEvent } from '../types';

const TYRE_HALF_WIDTH_M = .1;
type PaintTriangle = { shape: THREE.Triangle; bounds: THREE.Box2 };
type Boundary = { group: THREE.Group; triangles: PaintTriangle[]; bounds: THREE.Box2 };

function pointSegmentDistanceSq(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): number {
    const dx = b.x - a.x, dz = b.z - a.z;
    const lengthSq = dx * dx + dz * dz;
    const t = lengthSq === 0 ? 0 : THREE.MathUtils.clamp(((p.x - a.x) * dx + (p.z - a.z) * dz) / lengthSq, 0, 1);
    return (p.x - a.x - t * dx) ** 2 + (p.z - a.z - t * dz) ** 2;
}

function segmentsDistanceSq(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3): number {
    const cross = (p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3) =>
        (q.x - p.x) * (r.z - p.z) - (q.z - p.z) * (r.x - p.x);
    if (Math.max(a.x, b.x) >= Math.min(c.x, d.x) && Math.max(c.x, d.x) >= Math.min(a.x, b.x)
        && Math.max(a.z, b.z) >= Math.min(c.z, d.z) && Math.max(c.z, d.z) >= Math.min(a.z, b.z)
        && cross(a, b, c) * cross(a, b, d) <= 0 && cross(c, d, a) * cross(c, d, b) <= 0) return 0;
    return Math.min(pointSegmentDistanceSq(a, c, d), pointSegmentDistanceSq(b, c, d),
        pointSegmentDistanceSq(c, a, b), pointSegmentDistanceSq(d, a, b));
}

/** Exact painted mesh footprints; entrance dashes are outside these boundary groups. */
export class ParkingBoundaryScoring {
    private readonly boundaries: Boundary[];
    private previous: THREE.Vector3[] = [];
    private touching = false;
    private lastPenaltyAt = 0;

    constructor(groups: readonly THREE.Group[]) {
        this.boundaries = groups.map(group => {
            group.updateWorldMatrix(true, true);
            const inverse = group.matrixWorld.clone().invert();
            const triangles: PaintTriangle[] = [];
            const bounds = new THREE.Box2();
            group.traverse(object => {
                if (!(object instanceof THREE.Mesh)) return;
                const geometry = object.geometry;
                const positions = geometry.getAttribute('position');
                if (!positions) return;
                const transform = new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld);
                const index = geometry.index;
                const count = index?.count ?? positions.count;
                for (let i = 0; i < count; i += 3) {
                    const vertex = (offset: number) => new THREE.Vector3()
                        .fromBufferAttribute(positions, index ? index.getX(i + offset) : i + offset)
                        .applyMatrix4(transform).setY(0);
                    const shape = new THREE.Triangle(vertex(0), vertex(1), vertex(2));
                    if (shape.getArea() < 1e-10) continue; // Ignore vertical sides.
                    const triangleBounds = new THREE.Box2().setFromPoints([shape.a, shape.b, shape.c]
                        .map(p => new THREE.Vector2(p.x, p.z))).expandByScalar(TYRE_HALF_WIDTH_M);
                    triangles.push({ shape, bounds: triangleBounds });
                    bounds.union(triangleBounds);
                }
            });
            return { group, triangles, bounds };
        });
    }

    reset(): void { this.previous = []; this.touching = false; this.lastPenaltyAt = 0; }

    update(wheels: readonly THREE.Vector3[], now = performance.now()): PenaltyEvent[] {
        let touchingNow = false, sweptContact = false;
        const closest = new THREE.Vector3();
        const radiusSq = TYRE_HALF_WIDTH_M ** 2;
        for (const boundary of this.boundaries) {
            boundary.group.updateWorldMatrix(true, false);
            const inverse = boundary.group.matrixWorld.clone().invert();
            for (let i = 0; i < wheels.length; i++) {
                const point = wheels[i].clone().applyMatrix4(inverse).setY(0);
                const before = this.previous[i]?.clone().applyMatrix4(inverse).setY(0) ?? point;
                const sweepBounds = new THREE.Box2().setFromPoints([
                    new THREE.Vector2(point.x, point.z), new THREE.Vector2(before.x, before.z)]);
                if (!boundary.bounds.intersectsBox(sweepBounds)) continue;
                for (const triangle of boundary.triangles) {
                    if (!triangle.bounds.intersectsBox(sweepBounds)) continue;
                    const { a, b, c } = triangle.shape;
                    const currentHit = triangle.shape.closestPointToPoint(point, closest).distanceToSquared(point) <= radiusSq;
                    touchingNow ||= currentHit;
                    sweptContact ||= currentHit
                        || triangle.shape.closestPointToPoint(before, closest).distanceToSquared(before) <= radiusSq
                        || segmentsDistanceSq(before, point, a, b) <= radiusSq
                        || segmentsDistanceSq(before, point, b, c) <= radiusSq
                        || segmentsDistanceSq(before, point, c, a) <= radiusSq;
                }
            }
        }
        const penalties: PenaltyEvent[] = [];
        if (sweptContact && !this.touching) {
            penalties.push({ at: now, points: 5, reason: 'Bài 7: Bánh xe đè vạch giới hạn chuồng ghép dọc' });
            this.lastPenaltyAt = now;
        } else if (sweptContact && this.touching) {
            while (now - this.lastPenaltyAt > 5000) {
                penalties.push({ at: now, points: 5, reason: 'Bài 7: Bánh xe đè vạch giới hạn quá 5 giây' });
                this.lastPenaltyAt += 5000;
            }
        }
        this.touching = touchingNow;
        this.previous = wheels.map(wheel => wheel.clone());
        return penalties;
    }
}
