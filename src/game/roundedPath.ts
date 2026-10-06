/** Polyline 2D theo (x, z) dùng để dựng mép/vạch có bo góc. */
export type Point = [number, number];

const ARC_SEGMENTS = 12;

export function direction(from: Point, to: Point): Point {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    return [(to[0] - from[0]) / length, (to[1] - from[1]) / length];
}

/** Bo mọi góc trong của polyline bằng cung tiếp tuyến; `radii[i]` cho góc tại `points[i + 1]`. */
export function roundCorners(points: Point[], radii: number | number[]): Point[] {
    const result: Point[] = [points[0]];
    const push = (p: Point) => {
        const last = result[result.length - 1];
        if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 1e-6) result.push(p);
    };
    for (let i = 1; i < points.length - 1; i++) {
        const radius = typeof radii === 'number' ? radii : radii[i - 1];
        const [px, pz] = points[i];
        const [inX, inZ] = direction(points[i - 1], points[i]);
        const [outX, outZ] = direction(points[i], points[i + 1]);
        const cos = inX * outX + inZ * outZ;
        if (cos > 1 - 1e-9) {
            push(points[i]);
            continue;
        }
        const tangent = radius * Math.tan(Math.acos(Math.min(1, Math.max(-1, cos))) / 2);
        const sx = px - inX * tangent, sz = pz - inZ * tangent;
        const ex = px + outX * tangent, ez = pz + outZ * tangent;
        const [nx, nz] = direction([0, 0], [outX - inX * cos, outZ - inZ * cos]);
        const cx = sx + nx * radius;
        const cz = sz + nz * radius;
        const start = Math.atan2(sz - cz, sx - cx);
        const end = Math.atan2(ez - cz, ex - cx);
        let delta = end - start;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        for (let s = 0; s <= ARC_SEGMENTS; s++) {
            const angle = start + delta * s / ARC_SEGMENTS;
            push([cx + radius * Math.cos(angle), cz + radius * Math.sin(angle)]);
        }
    }
    push(points[points.length - 1]);
    return result;
}

/** Offset theo pháp tuyến (-dz, dx) của hướng đi; dương = bên phải khi đi theo -Z. */
export function offsetPath(points: Point[], distance: number): Point[] {
    return points.map((point, i) => {
        const prev = points[Math.max(i - 1, 0)];
        const next = points[Math.min(i + 1, points.length - 1)];
        const [inX, inZ] = i > 0 ? direction(prev, point) : direction(point, next);
        const [outX, outZ] = i < points.length - 1 ? direction(point, next) : [inX, inZ];
        const tx = inX + outX, tz = inZ + outZ;
        const length = Math.hypot(tx, tz);
        const nx = -tz / length, nz = tx / length;
        // Giữ đúng khoảng offset tại điểm nối thẳng–cung (miter).
        const scale = 1 / Math.max(nx * -inZ + nz * inX, 1e-6);
        return [point[0] + nx * distance * scale, point[1] + nz * distance * scale];
    });
}

export function isPointInPolygon([x, z]: Point, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, zi] = polygon[i];
        const [xj, zj] = polygon[j];
        if ((zi > z) !== (zj > z) && x < xi + (z - zi) * (xj - xi) / (zj - zi)) inside = !inside;
    }
    return inside;
}

/** Cắt polyline thành các đoạn liên tiếp, độ dài lần lượt theo `pattern` (lặp vòng). */
export function splitByPattern(points: Point[], pattern: number[]): Point[][] {
    const pieces: Point[][] = [];
    let patternIndex = 0;
    let current: Point[] = [points[0]];
    let remaining = pattern[0];
    for (let i = 1; i < points.length; i++) {
        let from = points[i - 1];
        const to = points[i];
        let length = Math.hypot(to[0] - from[0], to[1] - from[1]);
        while (length > remaining) {
            const t = remaining / length;
            const cut: Point = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
            current.push(cut);
            pieces.push(current);
            current = [cut];
            from = cut;
            length -= remaining;
            patternIndex = (patternIndex + 1) % pattern.length;
            remaining = pattern[patternIndex];
        }
        current.push(to);
        remaining -= length;
    }
    if (current.length > 1) pieces.push(current);
    return pieces;
}
