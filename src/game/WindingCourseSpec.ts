import type { ExamVehicleClass } from './exam/examRules';

/**
 * Thông số WindingCourse (chữ S) theo từng hạng xe.
 *
 * Nguồn: `spec/road/s_curve_road_cad_spec.md` §3, §4, §5, §6, §28.
 *
 * Các giá trị `outerRadiusM`, `innerRadiusM`, `clearRoadWidthM`,
 * `constructionEnvelopeWidthM`, `centerDistanceM` đọc trực tiếp từ CAD,
 * phải thỏa mãn:
 *
 *   Bqc == Rn - Rtr
 *   Sqc == Rn + Rtr
 *
 * với sai số 0.005 m (spec §13).
 *
 * CAD ghi "HẠNG F" nhưng thông số kỹ thuật tương ứng với hạng E
 * (TRANSINCO K52 E2, a = 10.5 m, b = 2.5 m — spec §14.4) — map E → bộ
 * CAD_F để giữ geometry chính xác theo bản vẽ.
 */
export interface WindingCourseSpec {
    /** Nhãn CAD (debug metadata). */
    readonly cadLabel: string;
    /** Bán kính vòng ngoài Rn (m). */
    readonly outerRadiusM: number;
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
}

/**
 * Bảng thông số WindingCourse theo từng hạng xe.
 * Mapping theo spec/road/s_curve_road_cad_spec.md §28.
 *
 * Hạng E dùng bộ thông số CAD_F vì spec §6.2 nêu rõ: trong CAD ghi
 * "HẠNG F" nhưng bộ số Rn=11.20 / Rtr=5.70 / Bqc=5.50 / Sqc=16.90
 * tương ứng với hạng E (TRANSINCO K52 E2). Tên `cadLabel` giữ nguyên
 * để debug metadata khớp CAD gốc.
 */
export const WINDING_COURSE_SPEC: Record<
    'B' | 'C' | 'D' | 'E',
    WindingCourseSpec
> = {
    B: {
        cadLabel: 'HẠNG B',
        outerRadiusM: 6.300,
        innerRadiusM: 2.560,
        clearRoadWidthM: 3.740,
        constructionEnvelopeWidthM: 4.140,
        centerDistanceM: 8.860,
        a: 4.410, b: 1.700,
    },
    C: {
        cadLabel: 'HẠNG C',
        outerRadiusM: 9.500,
        innerRadiusM: 4.572,
        clearRoadWidthM: 4.928,
        constructionEnvelopeWidthM: 5.328,
        centerDistanceM: 14.072,
        a: 7.630, b: 2.240,
    },
    D: {
        cadLabel: 'HẠNG D',
        outerRadiusM: 11.20,
        innerRadiusM: 5.70,
        clearRoadWidthM: 5.5,
        constructionEnvelopeWidthM: 5.9,
        centerDistanceM: 16.9,
        a: 7.060, b: 2.080,
    },
    E: {
        // CAD label gốc là "HẠNG F" (xem spec/road/s_curve_road_cad_spec.md §6.2),
        // bộ thông số tương ứng với hạng E (TRANSINCO K52 E2).
        cadLabel: 'HẠNG F (E)',
        outerRadiusM: 8.60,
        innerRadiusM: 4.02,
        clearRoadWidthM: 4.58,
        constructionEnvelopeWidthM: 4.98,
        centerDistanceM: 12.62,
        a: 10.500, b: 2.500,
    },
};

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
