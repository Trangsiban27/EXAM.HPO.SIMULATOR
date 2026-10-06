import type { ExamVehicleClass } from './exam/examRules';

/**
 * Thông số WindingCourse (chữ S) theo từng hạng xe.
 *
 * Nguồn: `spec/road/s_curve_road_cad_spec.md` §3, §4, §5, §6, §28.
 *
 * `outerRadiusM` và `innerRadiusM` là constraints đọc từ bản vẽ. Các giá trị
 * còn lại được kiểm tra hoặc dẫn xuất từ hai bán kính này:
 *
 *   Bqc = 2.2b
 *   Rn = Rqv + 1.2
 *   Bqc = Rn - Rtr
 *   Sqc = Rn + Rtr
 *
 * và phải thỏa mãn:
 *
 *   Bqc == Rn - Rtr
 *   Sqc == Rn + Rtr
 *
 * với sai số 0.005 m (spec §13).
 *
 * Bảng dưới giữ thêm `a`, `b`, `Rqv` để kiểm tra công thức CAD và metadata.
 */
export interface WindingCourseSpec {
    /** Nhãn CAD (debug metadata). */
    readonly cadLabel: string;
    /** Bán kính vòng ngoài Rn (m). */
    readonly outerRadiusM: number;
    /** Bán kính quay vòng nhỏ nhất Rqv (m). */
    readonly rqvM: number;
    /** Bán kính vòng trong Rtr (m). */
    readonly innerRadiusM: number;
    /** Chiều rộng phần đường driveable Bqc = Rn - Rtr (m). */
    readonly clearRoadWidthM: number;
    /** Chiều rộng envelope vật lý (mép curb + clear width). */
    readonly constructionEnvelopeWidthM: number;
    /** Khoảng cách tâm hai nửa vòng tròn Sqc = Rn + Rtr (m). */
    readonly centerDistanceM: number;
    /** Chiều dài toàn bộ xe (m) — tham chiếu spec §14. */
    readonly a: number;
    /** Chiều rộng toàn bộ xe (m). */
    readonly b: number;
    /**
     * Kích thước dọc tổng trên bản vẽ (từ mép trong đoạn thẳng trên đến mép
     * ngoài đoạn thẳng dưới, cùng lề). H = dz + Sqc. Dùng để suy ra góc nghiêng
     * đường nối tâm: cosφ = (H - Sqc) / Sqc. Bỏ trống → dùng tỉ lệ đo từ hạng B.
     */
    readonly verticalSpanM?: number;
}

/**
 * Bảng thông số WindingCourse theo từng hạng xe.
 * Mapping theo spec/road/s_curve_road_cad_spec.md §28.
 *
 * Hạng D: Rn=8.60 / Rtr=4.02 / Bqc=4.58 / Sqc=12.62.
 * Hạng E: Rn=11.20 / Rtr=5.70 / Bqc=5.50 / Sqc=16.90.
 */
const CONSTRUCTION_MARGIN_M = 0.40;

export const WINDING_COURSE_SPEC: Record<
    'B' | 'C' | 'D' | 'E',
    WindingCourseSpec
> = {
    B: createWindingCourseSpec('HẠNG B', 4.410, 1.700, 5.100, 6.300, 2.560),
    C: createWindingCourseSpec('HẠNG C', 7.630, 2.240, 8.300, 9.500, 4.572),
    D: createWindingCourseSpec('HẠNG D', 7.060, 2.080, 7.400, 8.600, 4.024),
    E: createWindingCourseSpec('HẠNG E', 10.500, 2.500, 10.000, 11.200, 5.700),
};

function createWindingCourseSpec(
    cadLabel: string,
    a: number,
    b: number,
    rqvM: number,
    outerRadiusM: number,
    innerRadiusM: number,
): WindingCourseSpec {
    const clearRoadWidthM = outerRadiusM - innerRadiusM;

    return {
        cadLabel,
        outerRadiusM,
        rqvM,
        innerRadiusM,
        clearRoadWidthM,
        constructionEnvelopeWidthM: clearRoadWidthM + CONSTRUCTION_MARGIN_M,
        centerDistanceM: outerRadiusM + innerRadiusM,
        a,
        b,
    };
}

/**
 * Lấy spec WindingCourse cho một hạng xe.
 * Hạng không có trong bảng (A1/A2/C1/D1/D2/Fc) sẽ fallback về B
 * để tránh vỡ layout.
 */
export function getWindingCourseSpec(vehicleClass: ExamVehicleClass): WindingCourseSpec {
    return (
        WINDING_COURSE_SPEC[vehicleClass as keyof typeof WINDING_COURSE_SPEC] ??
        WINDING_COURSE_SPEC.B
    );
}

/**
 * Validate spec theo công thức bắt buộc (spec §13):
 *   Bqc == Rn - Rtr
 *   Sqc == Rn + Rtr
 * với sai số 0.005 m.
 */
export function validateWindingCourseSpec(spec: WindingCourseSpec, eps = 0.005): void {
    const clearRoadWidth = 2.2 * spec.b;
    if (Math.abs(clearRoadWidth - spec.clearRoadWidthM) > eps) {
        throw new Error(
            `WindingCourse spec "${spec.cadLabel}": Bqc (${spec.clearRoadWidthM}) != 2.2b (${clearRoadWidth})`
        );
    }
    const outerRadius = spec.rqvM + 1.2;
    if (Math.abs(outerRadius - spec.outerRadiusM) > eps) {
        throw new Error(
            `WindingCourse spec "${spec.cadLabel}": Rn (${spec.outerRadiusM}) != Rqv + 1.2 (${outerRadius})`
        );
    }
    const width = spec.outerRadiusM - spec.innerRadiusM;
    if (Math.abs(width - spec.clearRoadWidthM) > eps) {
        throw new Error(
            `WindingCourse spec "${spec.cadLabel}": Bqc (${spec.clearRoadWidthM}) != Rn - Rtr (${width})`
        );
    }
    const centerDistance = spec.outerRadiusM + spec.innerRadiusM;
    if (Math.abs(centerDistance - spec.centerDistanceM) > eps) {
        throw new Error(
            `WindingCourse spec "${spec.cadLabel}": Sqc (${spec.centerDistanceM}) != Rn + Rtr (${centerDistance})`
        );
    }
}