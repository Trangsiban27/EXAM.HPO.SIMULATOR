# S-CURVE ROAD CAD SPEC — CỤM ĐƯỜNG VÒNG QUANH CO THEO HẠNG XE
## Đặc tả số đo để Cursor / Codex CLI / Agent dựng road đúng bản vẽ Hiệp Phát

> **Nguồn chính:** ảnh crop CAD người dùng cung cấp của cụm đường vòng quanh co.
>
> **Mục tiêu:** giúp Agent dựng chính xác geometry của các road chữ S theo số đo trên bản vẽ, thay vì ước lượng bằng mắt hoặc trace pixel.
>
> **Đơn vị:** toàn bộ số đo CAD trong file này được hiểu là **mét**.
>
> **Nguyên tắc quan trọng:** sử dụng số đo hình học làm hard constraint. Ảnh chỉ dùng để hiểu topology, chiều cong và quan hệ giữa các đoạn.

---

# 0. Agent summary — đọc phần này trước

Ảnh CAD thể hiện nhiều **road chữ S / đường vòng quanh co** cho các hạng xe khác nhau.

Mỗi module chữ S được xác định bởi 4 thông số cốt lõi:

```txt
Rn   = bán kính vòng ngoài
Rtr  = bán kính vòng trong
Bqc  = chiều rộng phần đường hình quanh co
Sqc  = khoảng cách tâm của hai nửa vòng tròn
```

Quan hệ bắt buộc:

```txt
Bqc = Rn - Rtr

Sqc = Rn + Rtr
```

Các bộ số đọc được:

```txt
HẠNG B
Rn   = 6.30 m
Rtr  = 2.56 m
Bqc  = 3.74 m
Sqc  = 8.86 m

HẠNG C
Rn   = 9.50 m
Rtr  ≈ 4.57 m
Bqc  = 4.928 m
Sqc  ≈ 14.07 m

HẠNG D
Rn   = 8.60 m
Rtr  ≈ 4.02 m
Bqc  ≈ 4.58 m
Sqc  ≈ 12.62 m

BỘ HÌNH CAD GHI “HẠNG F”
Rn   = 11.20 m
Rtr  = 5.70 m
Bqc  = 5.50 m
Sqc  = 16.90 m
```

Không dựng bằng spline tùy ý.

Phải dựng từ **các cung tròn có bán kính thật**.

---

# 1. Cách hiểu topology

Mỗi road quanh co gồm:

```txt
02 nửa hình vòng tròn
nối tiếp nhau
cong ngược chiều nhau
```

Tạo thành hình chữ S.

Minh họa logic:

```txt
ENTRY ──────╮
            │
         ╭──╯
        ╱
       ╲
        ╲
         ╰──╮
            │
EXIT  ──────╯
```

Đây chỉ là minh họa topology.

Geometry thực phải sinh từ:

```txt
Rn
Rtr
Sqc
Bqc
```

---

# 2. Hai loại kích thước chiều rộng nhìn thấy trên CAD

Trong ảnh, tại nhiều road có **hai kích thước song song**.

Ví dụ Hạng B:

```txt
3.74
4.14
```

Hạng C:

```txt
4.928
≈ 5.33
```

Bộ hình ghi Hạng F:

```txt
5.50
5.90
```

Hạng D:

```txt
≈ 4.58
≈ 4.98
```

Sai khác đều xấp xỉ:

```txt
0.40 m
```

Agent phải tách thành:

```txt
clearRoadWidthM
constructionEnvelopeWidthM
```

Không được tự kết luận ngay rằng:

```txt
0.20 m mỗi bên = curb thickness
```

nếu chưa có layer legend hoặc chi tiết cấu tạo xác nhận.

---

# 3. HẠNG B — geometry chính xác

## 3.1 Số đo cốt lõi

Đọc từ bản vẽ:

```txt
Rn  = 6.30 m
Rtr = 2.56 m

Sqc = 8.86 m

Bqc = 3.74 m
```

Validation:

```txt
Rn - Rtr
= 6.30 - 2.56
= 3.74 m
```

```txt
Rn + Rtr
= 6.30 + 2.56
= 8.86 m
```

Khớp CAD.

---

## 3.2 Chiều rộng hiển thị trên CAD

```txt
clearRoadWidthM         = 3.74
constructionEnvelopeM   = 4.14
```

Sai khác:

```txt
4.14 - 3.74
= 0.40 m
```

---

## 3.3 Config

```ts
export const S_CURVE_B = {
  cadLabel: 'HẠNG B',

  outerRadiusM: 6.30,
  innerRadiusM: 2.56,

  clearRoadWidthM: 3.74,
  constructionEnvelopeWidthM: 4.14,

  centerDistanceM: 8.86
} as const;
```

---

# 4. HẠNG C — geometry chính xác

## 4.1 Số đo cốt lõi

CAD thể hiện:

```txt
Rn  = 9.50 m
Rtr ≈ 4.57 m

Sqc ≈ 14.07 m

Bqc = 4.928 m
```

Theo bảng thông số kỹ thuật đã cung cấp trước đó:

```txt
Rtr = 4.572 m
Sqc = 14.072 m
```

Nên Agent dùng giá trị kỹ thuật chính xác:

```txt
Rn   = 9.500 m
Rtr  = 4.572 m
Bqc  = 4.928 m
Sqc  = 14.072 m
```

Validation:

```txt
9.500 - 4.572 = 4.928
9.500 + 4.572 = 14.072
```

---

## 4.2 Chiều rộng ngoài nhìn trên CAD

Ảnh thể hiện:

```txt
clearRoadWidthM       = 4.928
outer/envelope width  ≈ 5.33
```

Theo quan hệ +0.40:

```txt
constructionEnvelopeWidthM
≈ 5.328 m
```

CAD làm tròn hiển thị:

```txt
5.33
```

---

## 4.3 Config

```ts
export const S_CURVE_C = {
  cadLabel: 'HẠNG C',

  outerRadiusM: 9.500,
  innerRadiusM: 4.572,

  clearRoadWidthM: 4.928,
  constructionEnvelopeWidthM: 5.328,

  centerDistanceM: 14.072
} as const;
```

---

# 5. HẠNG D — geometry chính xác

## 5.1 Số đo đọc từ CAD

Trong cụm phía trên-trái:

```txt
Rn  ≈ 8.60 m
Rtr ≈ 4.02 m

Sqc ≈ 12.62 m

clear width ≈ 4.58 m
outer width ≈ 4.98 m
```

Theo bảng kỹ thuật đã cung cấp trước đó:

```txt
Rn   = 8.600 m
Rtr  = 4.024 m
Bqc  = 4.576 m
Sqc  = 12.624 m
```

Validation:

```txt
8.600 - 4.024 = 4.576
8.600 + 4.024 = 12.624
```

CAD hiển thị làm tròn:

```txt
Rtr  → 4.02
Bqc  → 4.58
Sqc  → 12.62
```

---

## 5.2 Envelope

```txt
clearRoadWidthM = 4.576

constructionEnvelopeWidthM
≈ 4.976 m
```

CAD hiển thị:

```txt
≈ 4.98 m
```

---

## 5.3 Config

```ts
export const S_CURVE_D = {
  cadLabel: 'HẠNG D',

  outerRadiusM: 8.600,
  innerRadiusM: 4.024,

  clearRoadWidthM: 4.576,
  constructionEnvelopeWidthM: 4.976,

  centerDistanceM: 12.624
} as const;
```

---

# 6. BỘ HÌNH CAD GHI “HẠNG F”

## 6.1 Số đo

Ảnh crop thể hiện label:

```txt
HẠNG F
```

và bộ số:

```txt
Rn   = 11.20 m
Rtr  = 5.70 m

Bqc  = 5.50 m
Sqc  = 16.90 m
```

Validation:

```txt
11.20 - 5.70 = 5.50
11.20 + 5.70 = 16.90
```

Chiều rộng ngoài:

```txt
constructionEnvelopeWidthM = 5.90 m
```

---

## 6.2 Lưu ý tên hạng

Trong bảng kỹ thuật đã cung cấp trước đó, bộ số:

```txt
Rn   = 11.20
Rtr  = 5.70
Bqc  = 5.50
Sqc  = 16.90
```

xuất hiện ở cột hạng E.

Trong ảnh CAD hiện tại lại có chữ:

```txt
HẠNG F
```

Agent không được tự đổi tên.

Giữ metadata:

```ts
cadLabel = 'HẠNG F';
technicalGeometryKey = 'R11_2_R5_7_W5_5';
```

Việc map chính thức sang hạng GPLX nào phải do config/layout xác nhận.

---

## 6.3 Config

```ts
export const S_CURVE_CAD_F = {
  cadLabel: 'HẠNG F',

  outerRadiusM: 11.20,
  innerRadiusM: 5.70,

  clearRoadWidthM: 5.50,
  constructionEnvelopeWidthM: 5.90,

  centerDistanceM: 16.90
} as const;
```

---

# 7. Bảng tổng hợp geometry

| CAD/Config | Rn ngoài | Rtr trong | Bqc clear width | Sqc tâm–tâm | Envelope CAD |
|---|---:|---:|---:|---:|---:|
| Hạng B | 6.300 | 2.560 | 3.740 | 8.860 | 4.140 |
| Hạng C | 9.500 | 4.572 | 4.928 | 14.072 | 5.328 ≈ 5.33 |
| Hạng D | 8.600 | 4.024 | 4.576 | 12.624 | 4.976 ≈ 4.98 |
| CAD “Hạng F” | 11.200 | 5.700 | 5.500 | 16.900 | 5.900 |

---

# 8. Các bán kính phụ trên ảnh KHÔNG được nhầm với S-curve radius

Ảnh còn có các annotation như:

```txt
R1
R1.5
R2
R2.5
R3
R4
R5
...
```

nằm ở:

```txt
- đầu bo đảo cỏ;
- đầu mút dải phân cách;
- connector;
- góc nối với đường khác.
```

Đây **không phải**:

```txt
Rn
hoặc
Rtr
```

của bài đường vòng quanh co.

Ví dụ:

```txt
Hạng B core S-curve:
Rtr = 2.56
Rn  = 6.30
```

Không được thay bằng các label:

```txt
R3
R5
```

ở đầu đảo.

---

# 9. Red line và black edge phải tách riêng

Trong CAD có:

```txt
- đường đỏ dọc một số biên đường;
- đường đen/gray tại mép đảo cỏ.
```

Agent không được merge chúng thành cùng một object nếu chưa có legend CAD.

Đề xuất:

```txt
ExamBoundaryLine
PhysicalIslandEdge
```

Hai layer logic độc lập.

Scene:

```txt
SCurveModule
├── RoadSurface
├── ExamBoundaryLines
└── PhysicalIslandEdges
```

---

# 10. Green hatch

Vùng hatch xanh là:

```txt
NON_DRIVABLE_ISLAND
```

Không phải road.

Phải dựng riêng:

```txt
GrassIslandMesh
IslandCollider
```

Vehicle không được xuyên qua.

---

# 11. Local coordinate system cho một S-curve

Mỗi module phải dựng trong local space trước.

Quy ước:

```txt
X = ngang module
Y = cao độ
Z = hướng entry ban đầu
```

Mặt đường:

```txt
Y = 0
```

Sau khi build xong mới:

```txt
translate
rotateY
mirror (nếu cần)
```

để khớp layout sân.

Không thay đổi scale.

---

# 12. Data structure chuẩn

```ts
export interface SCurveCadSpec {
  id: string;

  cadLabel: string;

  outerRadiusM: number;
  innerRadiusM: number;

  clearRoadWidthM: number;

  constructionEnvelopeWidthM?: number;

  centerDistanceM: number;

  entryStraightLengthM?: number;
  exitStraightLengthM?: number;

  placement: {
    x: number;
    y: number;
    z: number;

    rotationY: number;

    mirrorX?: boolean;
  };
}
```

---

# 13. Validation toán học bắt buộc

```ts
const EPS = 0.005;

function validateSCurveSpec(
  spec: SCurveCadSpec
) {
  const width =
    spec.outerRadiusM -
    spec.innerRadiusM;

  if (
    Math.abs(
      width - spec.clearRoadWidthM
    ) > EPS
  ) {
    throw new Error(
      'Bqc != Rn - Rtr'
    );
  }

  const centerDistance =
    spec.outerRadiusM +
    spec.innerRadiusM;

  if (
    Math.abs(
      centerDistance -
      spec.centerDistanceM
    ) > EPS
  ) {
    throw new Error(
      'Sqc != Rn + Rtr'
    );
  }
}
```

---

# 14. Không trace pixel để lấy radius

Agent không được làm:

```txt
screenshot
→ detect edge
→ estimate radius from pixels
→ build geometry
```

khi CAD đã ghi rõ bán kính.

Thứ tự ưu tiên:

```txt
1. số đo CAD;
2. bảng thông số kỹ thuật;
3. công thức;
4. topology ảnh;
5. pixel chỉ để kiểm chứng bằng mắt.
```

---

# 15. Thuật toán dựng S-curve

## Phase 1 — nhận spec

Ví dụ Hạng B:

```ts
const spec = S_CURVE_B;
```

---

## Phase 2 — tạo hai tâm cung

Hai nửa vòng tròn phải có khoảng cách tâm:

```txt
Sqc
```

Không đo tâm từ pixel.

Ví dụ local:

```ts
const C1 = new THREE.Vector2(
  0,
  0
);

const C2 = new THREE.Vector2(
  spec.centerDistanceM,
  0
);
```

Đây chỉ là local construction frame.

Sau đó rotate module để khớp CAD.

---

# 16. Nguyên tắc arc

Mỗi phần cong phải dùng:

```txt
circular arc
```

không dùng:

```txt
CatmullRom approximation
Bezier tự do
```

cho core geometry.

Các bán kính phải giữ:

```txt
inner arc radius = Rtr
outer arc radius = Rn
```

---

# 17. Tangency

Hai nửa vòng tròn phải:

```txt
nối tiếp;
ngược chiều;
tangent liên tục tại vùng chuyển tiếp.
```

Yêu cầu:

```txt
không tạo kink;
không tạo góc gãy;
không có gap;
không overlap.
```

Debug:

```txt
show tangent vector at join.
```

---

# 18. Road surface

Không nên dựng road chỉ bằng một centerline có width tùy ý.

Ưu tiên:

```txt
build exact inner boundary arcs
+
build exact outer boundary arcs
+
close Shape
+
ShapeGeometry / triangulated BufferGeometry
```

Như vậy radius biên đúng CAD.

---

# 19. Driveable region

Driveable region phải dùng:

```txt
clearRoadWidthM
```

Ví dụ B:

```txt
3.740 m
```

Không dùng:

```txt
constructionEnvelopeWidthM = 4.140
```

làm phần lái xe nếu chưa xác nhận envelope là road clear width.

---

# 20. Construction envelope

`constructionEnvelopeWidthM` được lưu để:

```txt
- dựng mép vật lý;
- curb/edge;
- đối chiếu CAD;
- debug kích thước.
```

Không dùng nó thay `Bqc`.

---

# 21. Entry và exit straight

Ảnh thể hiện các đoạn thẳng nối trước/sau cung.

Tuy nhiên crop hiện tại không đủ để đọc toàn bộ chiều dài của mọi đoạn thẳng.

Vì vậy:

```txt
entryStraightLengthM = REQUIRED_FROM_LAYOUT
exitStraightLengthM  = REQUIRED_FROM_LAYOUT
```

Không suy ra từ pixel.

---

# 22. Đầu đảo bo tròn

Các đầu đảo cỏ có radius riêng như:

```txt
R1
R1.5
R2
R2.5
R3
R5
```

Phải là module riêng:

```txt
IslandEndCap
```

Không ép chúng vào S-curve core.

---

# 23. Scene graph đề xuất

```txt
SCurveRoad_<Class>
│
├── RoadSurface
│
├── Boundaries
│   ├── InnerExamBoundary
│   ├── OuterExamBoundary
│   ├── InnerPhysicalEdge
│   └── OuterPhysicalEdge
│
├── Islands
│   ├── Island_A
│   └── Island_B
│
├── Collision
│   ├── IslandCollider_A
│   └── IslandCollider_B
│
├── Navigation
│   └── RecommendedPath
│
├── Sensors
│   ├── EntrySensor
│   └── ExitSensor
│
└── Debug
    ├── Center_C1
    ├── Center_C2
    ├── Radius_Rn
    ├── Radius_Rtr
    ├── Dimension_Bqc
    └── Dimension_Sqc
```

---

# 24. Debug bắt buộc

Khi:

```ts
DEBUG_SCURVE = true;
```

hiển thị:

```txt
C1
C2

line C1 → C2

Rn
Rtr

Bqc
Sqc

entry direction
exit direction

arc tangent points
```

Agent phải có thể nhìn scene và đối chiếu trực tiếp với bản vẽ.

---

# 25. RecommendedPath không phải geometry chuẩn

Có thể tạo một center navigation path để:

```txt
AI
camera
HUD
route guidance
```

Nhưng:

```txt
RecommendedPath
```

không được dùng làm nguồn sinh radius nếu điều đó khiến biên road sai CAD.

Biên CAD là nguồn chính.

---

# 26. Placement trong sân

Mỗi road module cần:

```txt
origin
rotationY
mirror
```

để khớp orientation trên layout.

Không sửa:

```txt
Rn
Rtr
Bqc
Sqc
```

để “xoay cho vừa”.

---

# 27. Mirror

Hai chữ S có thể cong trái-phải ngược nhau.

Cho phép:

```ts
mirrorX: true
```

hoặc đổi `turnSign`.

Mirror chỉ thay topology hướng cong.

Không thay dimension.

---

# 28. Config đầy đủ

```ts
export const HIEP_PHAT_S_CURVES = {
  B: {
    id: 'SCURVE_B',
    cadLabel: 'HẠNG B',

    outerRadiusM: 6.300,
    innerRadiusM: 2.560,

    clearRoadWidthM: 3.740,
    constructionEnvelopeWidthM: 4.140,

    centerDistanceM: 8.860
  },

  C: {
    id: 'SCURVE_C',
    cadLabel: 'HẠNG C',

    outerRadiusM: 9.500,
    innerRadiusM: 4.572,

    clearRoadWidthM: 4.928,
    constructionEnvelopeWidthM: 5.328,

    centerDistanceM: 14.072
  },

  D: {
    id: 'SCURVE_D',
    cadLabel: 'HẠNG D',

    outerRadiusM: 8.600,
    innerRadiusM: 4.024,

    clearRoadWidthM: 4.576,
    constructionEnvelopeWidthM: 4.976,

    centerDistanceM: 12.624
  },

  CAD_F: {
    id: 'SCURVE_CAD_F',
    cadLabel: 'HẠNG F',

    outerRadiusM: 11.200,
    innerRadiusM: 5.700,

    clearRoadWidthM: 5.500,
    constructionEnvelopeWidthM: 5.900,

    centerDistanceM: 16.900
  }
} as const;
```

---

# 29. Acceptance tests — Hạng B

```ts
expect(spec.outerRadiusM)
  .toBeCloseTo(6.3);

expect(spec.innerRadiusM)
  .toBeCloseTo(2.56);

expect(
  spec.outerRadiusM -
  spec.innerRadiusM
).toBeCloseTo(3.74);

expect(
  spec.outerRadiusM +
  spec.innerRadiusM
).toBeCloseTo(8.86);
```

---

# 30. Acceptance tests — Hạng C

```ts
expect(
  9.5 - 4.572
).toBeCloseTo(4.928);

expect(
  9.5 + 4.572
).toBeCloseTo(14.072);
```

---

# 31. Acceptance tests — Hạng D

```ts
expect(
  8.6 - 4.024
).toBeCloseTo(4.576);

expect(
  8.6 + 4.024
).toBeCloseTo(12.624);
```

---

# 32. Acceptance tests — CAD Hạng F

```ts
expect(
  11.2 - 5.7
).toBeCloseTo(5.5);

expect(
  11.2 + 5.7
).toBeCloseTo(16.9);
```

---

# 33. Không được làm

```txt
DO NOT:

- trace hình cong bằng mắt;
- dùng spline tự do thay cung tròn;
- scale module để vừa sân;
- thay đổi Bqc;
- nhầm radius bo đầu đảo với Rn/Rtr;
- dùng envelope width thay clear road width;
- coi text HẠNG B/C/F là texture đường;
- suy ra chiều dài straight bằng pixel;
- merge red boundary và black physical edge khi chưa biết layer;
- đổi “HẠNG F” thành hạng khác trong metadata mà không có config xác nhận.
```

---

# 34. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Implement the S-curve road modules shown in
s_curve_road_cad_spec.md using Three.js + TypeScript.

IMPORTANT:
Do NOT trace the screenshot.
Build exact parametric circular geometry from the dimensions.

UNITS:
1 Three.js unit = 1 meter.

HARD CONSTRAINTS:

B:
Rn=6.300
Rtr=2.560
Bqc=3.740
Sqc=8.860
Envelope=4.140

C:
Rn=9.500
Rtr=4.572
Bqc=4.928
Sqc=14.072
Envelope=5.328

D:
Rn=8.600
Rtr=4.024
Bqc=4.576
Sqc=12.624
Envelope=4.976

CAD label F:
Rn=11.200
Rtr=5.700
Bqc=5.500
Sqc=16.900
Envelope=5.900

VALIDATE:
Bqc == Rn - Rtr
Sqc == Rn + Rtr

GEOMETRY:
- two opposite connected semicircular turns;
- exact circular arcs;
- tangent continuity;
- no CatmullRom approximation for core boundaries;
- road surface built from exact inner/outer boundaries.

ARCHITECTURE:
SCurveRoad
- RoadSurface
- ExamBoundaryLines
- PhysicalIslandEdges
- GrassIslands
- Colliders
- NavigationPath
- EntrySensor
- ExitSensor
- DebugDimensions

RULES:
- clearRoadWidth is the driveable geometry reference.
- construction envelope is separate.
- R1/R1.5/R2/R2.5/R3/R5 labels around island ends are NOT Rn/Rtr.
- preserve red exam-boundary and black physical-edge layers separately.
- entry/exit straight length comes from layout config.
- support rotation and mirror without scaling.

OUTPUT:
- SCurveRoad.ts
- SCurveRoadConfig.ts
- SCurveRoadGeometry.ts
- SCurveRoadValidator.ts
- SCurveRoadDebug.ts
```

---

# 35. Kết luận cho Agent

Agent phải hiểu cụm road này là **geometry tham số chính xác**, không phải một hình cong cần bắt chước.

Nguồn thật của hình dạng là:

```txt
Rn
Rtr
Bqc
Sqc
```

Ví dụ Hạng B:

```txt
6.30
2.56
3.74
8.86
```

Chỉ cần bốn thông số này đúng và các cung nối tangent đúng, road chữ S sẽ giữ đúng hình học theo bản vẽ khi được đặt vào layout bằng transform 1:1.
