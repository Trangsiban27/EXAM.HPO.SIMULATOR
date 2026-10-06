# ROAD SPEC — KHÚC CUA R8 / R9
## Đặc tả object khúc cua từ bản vẽ CAD sân sát hạch Hiệp Phát
### Tối ưu cho Cursor / Codex CLI / Agent / Three.js

> **Nguồn:** ảnh crop CAD người dùng cung cấp.
>
> **Mục tiêu:** dựng đúng một khúc cua nối hai đoạn thẳng gần vuông góc, với module làn 3.70 m và hai cung được ghi **R8**, **R9**.
>
> **Đơn vị:** mét. `1 unit = 1 m`.
>
> **Nguyên tắc:** số đo nhìn rõ trên CAD là hard constraint. Phần không có số đo rõ phải để `REQUIRED_INPUT` hoặc `VISUAL_CONFIG`, không suy từ pixel.

---

# 0. Agent summary

Object trong crop là **một khúc cua**, không phải trục thẳng.

```txt
PHÍA TRÊN / +Z
        │
        │  LEG_UPPER
        │  chuỗi 3.7 nhìn thấy: 3 nhãn, cùng bề rộng với nhánh kia
        │
   cỏ   │
        │      R8   cung cyan đứt, R = 8 m
        │      R9   cung cyan đứt, R = 9 m
        └──────────────  LEG_RIGHT / +X
              chuỗi 3.7 nhìn thấy: 3 nhãn
              mũi tên cyan chỉ về phía cung
```

Đặc điểm chính:

```txt
- hai nhánh thẳng gặp nhau qua một cung quét khoảng 60° theo crop CAD;
- mỗi module kích thước lặp trên lòng đường = 3.70 m;
- hai cung cyan trong khúc cua mang chữ R8 và R9;
- R9 - R8 = 1 m là khoảng cách xuyên tâm của HAI CUNG ĐƯỢC GHI CHỮ;
- khoảng 1 m đó không phải bề rộng mặt đường;
- mũi tên cyan trên nhánh ngang chỉ về phía cung;
- dải chấm xanh lá dọc mép là cỏ / lề, không phải làn.
```

---

# 1. Tên object

```txt
ROAD_CORNER_CURVE_R8_R9
```

Tên file/code đề xuất:

```txt
RoadCornerCurveR8R9
```

Object này đứng riêng.

Không gộp vào:

```txt
ROAD_4LANE_BIDIRECTIONAL
ROAD_6A
ROAD_STRAIGHT_9_55
S_CURVE
```

---

# 2. Những gì đọc được chắc chắn

## 2.1 Module làn

Chuỗi kích thước lặp lại trên mặt đường ghi:

```txt
3.7
```

Hard constraint:

```txt
laneModuleM = 3.70
```

```ts
const LANE_MODULE_M = 3.7;
```

Không được đổi thành 3.6, 3.74, hay một giá trị đo từ pixel.

---

## 2.2 Hai cung trong khúc cua

Trong vùng cua, hai cung cyan đứt mang chữ:

```txt
R8
R9
```

Hard constraint:

```txt
radiusArcA_M = 8
radiusArcB_M = 9
```

```ts
const RADIUS_ARC_A_M = 8;
const RADIUS_ARC_B_M = 9;
```

`R8` nghĩa là bán kính 8 m. `R9` nghĩa là bán kính 9 m.

---

## 2.3 Hiệu bán kính

```txt
radiusArcB_M - radiusArcA_M = 1
```

Đây là khoảng cách xuyên tâm giữa **hai cung được ghi chữ**.

Không được hiểu hiệu này là:

```txt
bề rộng cả mặt đường
bề rộng một làn
khoảng từ mép trong tới mép ngoài của toàn bộ lòng đường
```

Bề rộng lòng đường lấy từ số module 3.70 m thuộc lòng đường. Xem mục 6 và mục 7.

---

## 2.4 Góc quét

Hai nhánh thẳng trong crop gần vuông góc.

Crop không có dimension góc riêng.

Topology:

```txt
sweepDeg = 60
```

Không bịa 60°, 45°, hay một góc ước từ pixel.

---

# 3. Hệ tọa độ local

```txt
X = dọc nhánh phải, ra xa cung
Z = dọc nhánh trên, ra xa cung
Y = cao độ, hướng lên
```

```txt
+X = phía phải bản vẽ, dọc LEG_RIGHT, hướng ra khỏi cung
+Z = phía trên bản vẽ, dọc LEG_UPPER, hướng ra khỏi cung
```

Tâm hình học của hai cung nằm tại local:

```txt
(0, 0) trên mặt phẳng XZ
```

Cung quét trong góc phần tư +X / +Z:

```txt
từ trục +Z
sang trục +X
sweep = 60°
```

Nếu scene đặt object chỗ khác, chỉ dịch và xoay parent.

Không scale.

---

# 4. Topology

Hai nhánh và một cung:

```txt
LEG_UPPER
    nối vào cung ở phía +Z
CORNER_ARC
    quét khoảng 60°
LEG_RIGHT
    nối ra khỏi cung ở phía +X
```

```txt
LEG_UPPER  = đoạn thẳng phía trên crop, đi vào cung
LEG_RIGHT  = đoạn thẳng ngang bên phải crop, đi ra khỏi cung
```

Chiều dài mỗi nhánh thẳng bị crop cắt.

```txt
legUpperLengthM = REQUIRED_INPUT
legRightLengthM = REQUIRED_INPUT
```

Không lấy chiều dài từ:

```txt
- biên ảnh;
- pixel;
- thanh đỏ mép dưới;
- polyline tím bên trái.
```

---

# 5. Chuỗi kích thước nhìn thấy

Ghi đúng những gì crop cho thấy. Không thêm module cho đủ một số làn định trước.

## 5.1 LEG_UPPER

Chuỗi `3.7` xếp ngang bề rộng nhánh trên.

Trong crop nhìn thấy:

```txt
3 nhãn 3.7
```

```txt
legUpperVisibleModuleLabels = 3
```

Mỗi nhãn thuộc lòng đường của nhánh này = một module 3.70 m.

---

## 5.2 LEG_RIGHT

Chuỗi `3.7` xếp ngang bề rộng nhánh ngang.

Trong crop nhìn thấy:

```txt
3 nhãn 3.7
```

```txt
legRightVisibleModuleLabels = 4
```

Mỗi nhãn thuộc lòng đường của nhánh này = một module 3.70 m.

---

## 5.3 Nhãn sát miệng bãi đỗ

Góc trên-phải có bãi đỗ, xe và biển P.

Nếu một nhãn `3.7` đo miệng bãi, lối vào bãi, hoặc một khoảng nằm ngoài mặt đường cua:

```txt
không cộng nhãn đó vào laneCount của khúc cua
```

`laneCount` của từng nhánh = số module 3.70 m **thuộc lòng đường của nhánh đó**.

Hai nhánh cùng bề rộng. Mỗi nhánh có 3 module 3.70 m thuộc lòng đường. Không tách thành 3 làn một bên và 4 làn một bên.

---

# 6. Bề rộng lòng đường

```txt
legUpperCarriagewayWidthM = legUpperLaneCount * 3.70
legRightCarriagewayWidthM = legRightLaneCount * 3.70
```

```ts
const legUpperCarriagewayWidthM =
  legUpperLaneCount * LANE_MODULE_M;

const legRightCarriagewayWidthM =
  legRightLaneCount * LANE_MODULE_M;
```

`legUpperLaneCount` và `legRightLaneCount` đếm module lòng đường theo mục 5.

Không dùng:

```txt
9 - 8 = 1 m
```

làm `carriagewayWidthM`.

Không chia đều một dải rộng 1 m thành nhiều làn 3.70 m.

---

# 7. Hai cung R8 và R9

## 7.1 Cung nào mang chữ nào

```txt
ARC_R8 = cung cyan đứt mang chữ R8, bán kính 8 m
ARC_R9 = cung cyan đứt mang chữ R9, bán kính 9 m
```

Mỗi chữ bán kính bám cung mà CAD ghi chữ đó.

Không đảo R8 sang cung R9.

Không gán R8 cho mép lề trong và R9 cho mép lề ngoài của cả mặt đường.

Hai giá trị này cách nhau 1 m theo phương xuyên tâm. Lòng đường rộng nhiều module 3.70 m nên hai mép lòng đường cách nhau nhiều hơn 1 m. R8 và R9 là hai cung được chú thích trong khúc cua, không phải cặp mép của toàn bộ mặt đường.

---

## 7.2 Dựng cung

Dựng bằng cung tròn bán kính thật.

```txt
center = local (0, 0)
ARC_R8 radius = 8 m
ARC_R9 radius = 9 m
    sweep = 60°
góc phần tư = +X / +Z
```

Không dựng khúc cua bằng:

```txt
- CatmullRom / spline tự do;
- Bezier không khóa bán kính;
- chuỗi đoạn thẳng thưa;
- bo góc bằng một bán kính duy nhất rồi scale.
```

Các vạch làn khác, nếu có, offset từ các cung này theo bội số của `laneModuleM` khi chúng cùng tâm. Không tự đặt thêm chữ bán kính mà crop không ghi.

---

# 8. Mặt cắt

Sơ đồ logic, chưa khóa số làn bằng một hằng chung cho cả hai nhánh:

```txt
LEG_UPPER

cỏ | module 3.70 | module 3.70 | module 3.70 | ...
    ←—— chuỗi nhìn thấy: 3 nhãn ——→

LEG_RIGHT

cỏ | module 3.70 | module 3.70 | module 3.70 | module 3.70 | ...
    ←—— chuỗi nhìn thấy: 3 nhãn ——→
```

Dấu `|` là ranh module hoặc vạch. Chỉ những module nằm trên mặt đường cua mới vào `laneCount`.

Trong vùng cung, các làn đi theo cung đồng tâm. Bước xuyên tâm giữa hai làn kề nhau của cùng một nhánh giữ `laneModuleM = 3.70` khi hai làn đó cùng thuộc lòng đường. Bước 1 m giữa ARC_R8 và ARC_R9 không thay thế bước làn.

---

# 9. Vạch cyan đứt

Các cung và đoạn phân làn màu cyan trong crop là vạch đứt.

Object:

```txt
MARKING_CYAN_DASHED_ARC_R8
MARKING_CYAN_DASHED_ARC_R9
```

và các đoạn đứt thẳng trên hai nhánh, cùng họ vạch.

Crop không ghi:

```txt
dashLengthM
dashGapM
lineWidthM
```

Do đó:

```txt
dashLengthM = VISUAL_CONFIG
dashGapM    = VISUAL_CONFIG
lineWidthM  = VISUAL_CONFIG
```

Không hardcode như kích thước pháp lý, và không đo pixel.

Màu production của vạch làn là trắng. Cyan trên CAD là màu layer, không phải màu sơn trên mặt đường.

---

# 10. Mũi tên

Trên LEG_RIGHT, mũi tên cyan chỉ **về phía cung**.

Trong local space:

```txt
+X = ra xa cung dọc LEG_RIGHT
hướng mũi tên nhìn thấy = -X
```

Tức xe trên nhánh ngang, theo mũi tên trong crop, chạy vào phía khúc cua.

Số mũi tên và khoảng cách dọc trục không có dimension.

```txt
arrowCountOnLegRight = VISUAL_CONFIG
arrowSpacingM        = VISUAL_CONFIG
```

Không nhân đôi chiều mũi tên thành hai chiều nếu crop của nhánh đó không có mũi tên ngược lại.

Mũi tên là marking. Không bake vào texture mặt đường.

---

# 11. Dải cỏ / lề

Dải chấm xanh lá dọc mép ngoài khúc cua và dọc mép hai nhánh là:

```txt
NON_DRIVABLE_GRASS
```

Object riêng:

```txt
GRASS_VERGE_OUTER
```

Không merge vào mesh asphalt.

Bề rộng dải cỏ không có số đo riêng trong crop.

```txt
grassVergeWidthM = REQUIRED_INPUT
```

Không lấy `3.70` của làn xe làm bề rộng cỏ, trừ khi một dimension chỉ thẳng vào dải cỏ. Các nhãn `3.7` đang nằm trên chuỗi ngang lòng đường thì thuộc module làn.

Bán kính mép lề, nếu CAD không ghi chữ, không copy từ R8 hoặc R9.

```txt
vergeEdgeRadiusM = REQUIRED_INPUT
```

---

# 12. Mặt đường

Core surface là mặt asphalt của:

```txt
LEG_UPPER
CORNER_ARC
LEG_RIGHT
```

Màu:

```txt
dark asphalt / charcoal
```

Không dùng nền trắng của CAD làm màu đường.

Hai nhánh thẳng là các dải rộng `laneCount * 3.70`.

Phần cua là vành khăn quét khoảng 60°, bề dày xuyên tâm bằng bề rộng lòng đường của khúc nối, không bằng `1 m`.

Liền khối tại hai điểm nối thẳng–cung. Không để hở, không chồng một lớp mặt đường thứ hai lên điểm nối.

---

# 13. Ngoài object

Những thứ có trong crop nhưng **không** thuộc geometry khúc cua:

```txt
PARKING_BAY_TOP_RIGHT
    ô đỗ góc trên-phải
    xe viền cam trong ô
    biển P

VEHICLE_OUTLINE_TOP_LEFT
    xe viền vàng góc trên-trái

MAGENTA_POLYLINES_LEFT
    các polyline tím bên trái crop

RED_BAR_BOTTOM
    thanh đỏ dày ở mép dưới crop
```

Không kéo các object này vào mesh, collider, hoặc bề rộng của `ROAD_CORNER_CURVE_R8_R9`.

Số đo nhỏ trong ô đỗ không dùng cho khúc cua.

---

# 14. Scene hierarchy

```txt
RoadCornerCurveR8R9
├── Surface
│   ├── LegUpper
│   ├── CornerArc
│   └── LegRight
├── Markings
│   ├── DashedArcR8
│   ├── DashedArcR9
│   ├── DashedStraights
│   └── ArrowsLegRight
├── GrassVergeOuter
└── Debug
    ├── ArcRadiusLabels
    └── ModuleWidthLabels
```

Collider mặt đường tách khỏi cỏ.

---

# 15. Config

```ts
export const ROAD_CORNER_CURVE_R8_R9 = {
  laneModuleM: 3.7,

  radiusArcA_M: 8,
  radiusArcB_M: 9,

  sweepDeg: 60,

  legUpper: {
    visibleModuleLabels: 3,
    lengthM: 'REQUIRED_INPUT' as const,
  },

  legRight: {
    visibleModuleLabels: 3,
    lengthM: 'REQUIRED_INPUT' as const,
    arrowDirection: '-X' as const,
  },

  markings: {
    dashLengthM: 'VISUAL_CONFIG' as const,
    dashGapM: 'VISUAL_CONFIG' as const,
    lineWidthM: 'VISUAL_CONFIG' as const,
  },

  grassVergeWidthM: 'REQUIRED_INPUT' as const,
} as const;
```

`laneCount` đưa vào config lúc dựng, sau khi đếm module lòng đường theo mục 5. Không hardcode `4` cho cả hai nhánh.

```ts
export interface RoadCornerCurveR8R9Config {
  laneModuleM: 3.7;

  radiusArcA_M: 8;
  radiusArcB_M: 9;

  sweepDeg: 60;

  legUpperLaneCount: number;
  legRightLaneCount: number;

  legUpperLengthM: number;
  legRightLengthM: number;

  x: number;
  z: number;
  rotationY: number;
}
```

`legUpperLengthM` và `legRightLengthM` đến từ layout CAD đầy đủ, không từ crop này.

---

# 16. Validation

```txt
1. laneModuleM === 3.7
2. radiusArcA_M === 8
3. radiusArcB_M === 9
4. radiusArcB_M - radiusArcA_M === 1
5. sweepDeg === 60
6. legUpperCarriagewayWidthM === legUpperLaneCount * 3.7
7. legRightCarriagewayWidthM === legRightLaneCount * 3.7
8. carriageway width !== 1
9. ARC_R8 và ARC_R9 không bị gán thành hai mép của cả mặt đường
10. grass không nằm trong mesh asphalt
11. parking, xe, polyline tím, thanh đỏ không nằm trong object
```

```ts
export function assertRoadCornerCurveR8R9(
  config: RoadCornerCurveR8R9Config,
): void {
  if (config.laneModuleM !== 3.7) {
    throw new Error('Lane module must be 3.70 m');
  }

  if (config.radiusArcA_M !== 8 || config.radiusArcB_M !== 9) {
    throw new Error('Labeled arcs must be R8 and R9');
  }

  if (config.sweepDeg !== 60) {
    throw new Error('Corner sweep must be 60 degrees');
  }

  const upperWidth = config.legUpperLaneCount * config.laneModuleM;
  const rightWidth = config.legRightLaneCount * config.laneModuleM;

  if (upperWidth <= 1 || rightWidth <= 1) {
    throw new Error('Carriageway width must come from 3.70 m modules');
  }
}
```

---

# 17. REQUIRED_INPUT

```txt
legUpperLengthM
legRightLengthM

legUpperLaneCount
    sau khi loại nhãn không thuộc lòng đường

legRightLaneCount
    sau khi loại nhãn 3.7 của miệng bãi đỗ nếu nhãn đó nằm ngoài mặt đường cua

grassVergeWidthM
vergeEdgeRadiusM

dashLengthM
dashGapM
lineWidthM

arrowCountOnLegRight
arrowSpacingM
```

`laneModuleM`, `radiusArcA_M`, `radiusArcB_M`, `sweepDeg` không nằm trong danh sách này. Chúng đã khóa.

---

# 18. Không được làm

```txt
DO NOT:
- đo pixel để ra mét;
- đổi lane module khỏi 3.70 m;
- coi R9 - R8 = 1 m là bề rộng mặt đường;
- ép các làn 3.70 m vào một dải rộng 1 m;
- gán R8 và R9 làm mép trong và mép ngoài của cả lòng đường;
- dựng cung bằng spline không khóa bán kính;
- bịa góc quét khác 60° khi chưa đối chiếu CAD;
- cho một nhánh 3 làn và nhánh kia 4 làn;
- cộng nhãn 3.7 của miệng bãi đỗ vào lòng đường khi nhãn đó nằm ngoài mặt đường cua;
- nuốt ô đỗ, biển P, xe viền cam, xe viền vàng vào object;
- nuốt polyline tím và thanh đỏ vào object;
- lấy cyan của layer CAD làm màu sơn;
- scale object cho vừa scene;
- hardcode dash/gap như kích thước pháp lý.
```

---

# 19. Prompt cho Cursor / Codex CLI

```txt
TASK:
Build the corner curve in road_corner_curve_r8_r9_spec.md
using Three.js + TypeScript.

HARD CONSTRAINTS:
- 1 unit = 1 meter.
- Lane module = 3.70 m.
- Two labeled cyan arcs: R8 = 8 m, R9 = 9 m.
- R9 - R8 = 1 m is the radial gap of those two arcs only.
- Carriageway width = laneCount * 3.70 m on each leg.
- Do not fit the lanes into a 1 m band.
- Sweep = 60° from the diagonal entry tangent to +X exit tangent.
- Leg upper enters the arc. Leg right leaves the arc.
- Arrows on the right leg point toward the arc (-X).
- Green stipple is grass, separate from asphalt.
- Parking bay, both vehicle outlines, magenta polylines,
  and the bottom red bar are not part of this mesh.

IMPLEMENT:
1. Asphalt surface for both straight legs and the 60° arc.
2. Dashed arcs at 8 m and 9 m.
3. Direction arrows on the right leg, toward the arc.
4. Outer grass verge as its own mesh.
5. Validator for the hard constraints above.

DO NOT:
- invent leg lengths from the crop;
- treat R8/R9 as the inner and outer curbs of the full road;
- measure dash length from pixels.

OUTPUT:
- RoadCornerCurveR8R9.ts
- config matching RoadCornerCurveR8R9Config
```

---

# 20. Kết luận

Object trong crop là:

```txt
MỘT KHÚC CUA KHOẢNG 60°
MODULE LÀN 3.70 m
HAI CUNG ĐƯỢC GHI R8 = 8 m VÀ R9 = 9 m
```

Hình học sinh từ:

```txt
laneModuleM = 3.70 m
radiusArcA  = 8 m
radiusArcB  = 9 m
sweepDeg    = 60
```

Bề rộng mặt đường là bội của 3.70 m. Hiệu 1 m chỉ là khoảng cách giữa hai cung mang chữ R8 và R9.
