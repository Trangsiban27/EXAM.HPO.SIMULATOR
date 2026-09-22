# PERPENDICULAR PARKING BAY SPEC — CHUỒNG GHÉP XE DỌC HẠNG C

## Mục tiêu

Đặc tả object chuồng ghép xe dọc hạng C theo bản vẽ CAD sân sát hạch Hiệp Phát, để Cursor / Codex CLI / Agent có thể dựng đúng bằng Three.js.

Đơn vị: mét.

Không trace pixel để lấy kích thước. Ưu tiên số đo CAD và các thông số kỹ thuật đã xác nhận.

---

# 1. Nhận diện object

Object trong ảnh là cụm:

```txt
MAIN ROAD / APPROACH CORRIDOR
+
PERPENDICULAR PARKING BAY
```

Chuồng ghép vuông góc với road chính.

Sơ đồ:

```txt
                     MAIN ROAD

        9.156          2.840          9.156
<────────────────><──────────><────────────────>

                         │
                         │
                         │  8.630
                         │
                         ╰────────╯
```

Các thông số chính:

```txt
Ed = 9.156 m
Rd = 2.840 m
Ld = 8.630 m
```

Ý nghĩa:

```txt
Ed = khoảng cách khống chế hai bên cửa chuồng
Rd = chiều rộng nơi ghép xe dọc
Ld = chiều dài / chiều sâu nơi ghép xe dọc
```

---

# 2. Kích thước cốt lõi

## 2.1 Khoảng cách khống chế Ed

```txt
LEFT Ed  = 9.156 m
RIGHT Ed = 9.156 m
```

## 2.2 Chiều rộng cửa chuồng

```txt
Rd = 2.840 m
```

## 2.3 Chiều sâu chuồng

```txt
Ld = 8.630 m
```

## 2.4 Tổng chiều dài vùng khống chế theo road

```txt
9.156 + 2.840 + 9.156 = 21.152 m
```

```ts
const CONTROL_LENGTH_M = 21.152;
```

---

# 3. Dimension 28.58 m

Bản vẽ có dimension:

```txt
28.58
```

Giá trị này lớn hơn:

```txt
Ed + Rd + Ed = 21.152 m
```

Do crop hiện tại không thể hiện đầy đủ hai endpoint của dimension `28.58`, phải lưu:

```txt
overallCadSpanM = 28.58
status = REFERENCE_ONLY
```

Không dùng `28.58` thay cho:

```txt
Ed
Rd
Ld
controlLength
```

nếu chưa xác minh bằng full CAD.

---

# 4. Chiều rộng road

Bản vẽ thể hiện hai kích thước dọc song song:

```txt
9.156
9.55
```

Nên tách:

```txt
clearRoadWidthM = 9.156
outerEnvelopeWidthM ≈ 9.55
```

Ý nghĩa triển khai:

```txt
9.156 m
→ clear / controlled driving width

9.55 m
→ outer construction / physical envelope
```

---

# 5. Hệ tọa độ local

Dựng module theo local coordinates:

```txt
+X = dọc main road
+Z = từ main road đi vào chuồng
+Y = hướng lên
```

Tức:

```txt
main road axis   = +X
parking bay axis = +Z
```

---

# 6. Local origin

Đặt origin tại:

```txt
tâm cửa chuồng
```

Khi đó:

```txt
X = 0
Z = 0
```

là midpoint của opening.

---

# 7. Tọa độ cửa chuồng

Với:

```txt
Rd = 2.840
```

nửa bề rộng:

```txt
Rd / 2 = 1.420
```

Do đó:

```txt
openingLeftX  = -1.420
openingRightX = +1.420
```

---

# 8. Vùng khống chế theo X

Bên trái:

```txt
controlStartX
= -1.420 - 9.156
= -10.576
```

Bên phải:

```txt
controlEndX
= +1.420 + 9.156
= +10.576
```

Kiểm tra:

```txt
10.576 - (-10.576)
= 21.152 m
```

---

# 9. Chiều sâu chuồng theo Z

Cửa chuồng:

```txt
Z = 0
```

Đáy chuồng:

```txt
Z = 8.630
```

Nếu placement thực tế khác hướng, xoay parent bằng `rotationY`, không đổi dimension.

---

# 10. Topology chuồng

Chuồng là parking pocket mở vào road:

```txt
MAIN ROAD
────────────────────────────────────
                    OPENING
                      │
                 ┌────┴────┐
                 │         │
                 │         │
                 │         │
                 │         │
                 ╰─────────╯
```

Hard rule:

```txt
OPENING phải mở
```

Không tạo line hoặc collider chắn cửa.

---

# 11. Red exam boundary

Đường đỏ trong CAD là:

```txt
EXAM_BOUNDARY
```

Scene đề xuất:

```txt
ExamBoundaryRed
├── MainRoadLeft
├── EntryLeft
├── ParkingLeftSide
├── ParkingBottom
├── ParkingRightSide
├── EntryRight
└── MainRoadRight
```

---

# 12. Black physical edge

Đường đen ngoài red boundary là:

```txt
PHYSICAL_EDGE / CURB
```

Phải tách riêng:

```txt
red exam boundary
!=
black curb edge
```

Config:

```txt
physicalEdgeOffsetM = REQUIRED_FROM_CAD
```

---

# 13. Radius local

Crop có các annotation local như:

```txt
R1
R1.5
R2.5
R3
R4
```

Không dùng một radius cho toàn bộ object.

Nên lưu:

```ts
radii: {
  topLeftOuterM?: number;
  parkingEntryLeftM?: number;
  parkingEntryRightM?: number;
  parkingBottomLeftM?: number;
  parkingBottomRightM?: number;
  rightOuterM?: number;
}
```

Chỉ hardcode khi endpoint CAD được xác minh.

---

# 14. Parking interior zone

Tạo logical zone:

```txt
PARKING_INTERIOR_ZONE
```

Clear dimensions:

```txt
width = 2.840 m
depth = 8.630 m
```

Dùng để:

```txt
- xác nhận xe đã vào chuồng;
- kiểm tra xe nằm đúng vùng;
- kiểm tra bánh vượt boundary;
- xác nhận hoàn thành bài.
```

---

# 15. Approach zone

Tạo:

```txt
PARKING_APPROACH_ZONE
```

Theo road axis:

```txt
length = 21.152 m
```

Theo transverse direction:

```txt
width = 9.156 m
```

---

# 16. Entry gate

```txt
PARKING_ENTRY_GATE
```

Local:

```txt
X = -1.420 → +1.420
Z = 0
```

Gate chỉ là logic sensor.

---

# 17. Xe vàng và biển P

Xe vàng:

```txt
CAD_REFERENCE_VEHICLE
```

Biển P:

```txt
PARKING_SIGN
```

Cả hai không thuộc core parking geometry.

---

# 18. Green hatch

Vùng chấm xanh:

```txt
NON_DRIVABLE_GRASS
```

Tạo riêng:

```txt
GrassMesh
GrassCollider
```

---

# 19. Road surface

Main road và parking bay dùng cùng asphalt material.

Nếu mesh riêng:

```txt
same elevation
same material
no seam
```

---

# 20. Parametric interface

```ts
export interface PerpendicularParkingBayCSpec {
  id: string;

  vehicleClass: 'C';

  parking: {
    widthM: number;       // Rd
    depthM: number;       // Ld
  };

  control: {
    leftLengthM: number;  // Ed
    rightLengthM: number; // Ed
  };

  mainRoad: {
    clearWidthM: number;
    outerEnvelopeWidthM?: number;
  };

  cadReference?: {
    overallSpanM?: number;
  };

  placement: {
    x: number;
    y: number;
    z: number;
    rotationY: number;
  };
}
```

---

# 21. Config chuẩn

```ts
export const PERPENDICULAR_PARKING_C = {
  id: 'PERPENDICULAR_PARKING_C',

  vehicleClass: 'C',

  parking: {
    widthM: 2.840,
    depthM: 8.630
  },

  control: {
    leftLengthM: 9.156,
    rightLengthM: 9.156
  },

  mainRoad: {
    clearWidthM: 9.156,
    outerEnvelopeWidthM: 9.550
  },

  cadReference: {
    overallSpanM: 28.580
  }
} as const;
```

---

# 22. Derived values

```ts
export function deriveParkingCGeometry() {
  const Ed = 9.156;
  const Rd = 2.840;
  const Ld = 8.630;

  return {
    openingHalfWidthM: Rd / 2,

    openingLeftX: -Rd / 2,
    openingRightX: +Rd / 2,

    controlStartX:
      -(Rd / 2 + Ed),

    controlEndX:
      +(Rd / 2 + Ed),

    controlLengthM:
      Ed + Rd + Ed,

    parkingDepthM:
      Ld
  };
}
```

Kết quả:

```txt
openingHalfWidth = 1.420

controlStartX = -10.576
controlEndX   = +10.576

controlLength = 21.152
```

---

# 23. Scene graph

```txt
PerpendicularParkingBay_C
│
├── Surface
│   ├── MainRoadSurface
│   └── ParkingPocketSurface
│
├── ExamBoundary
│   └── RedBoundaryPath
│
├── PhysicalEdge
│   └── BlackCurbPath
│
├── Logic
│   ├── ApproachZone
│   ├── ParkingInteriorZone
│   ├── EntryGate
│   └── ExitGate
│
├── Collision
│   ├── LeftGrassCollider
│   └── RightGrassCollider
│
└── Debug
    ├── Dim_Ed_Left
    ├── Dim_Rd
    ├── Dim_Ed_Right
    ├── Dim_Ld
    ├── Dim_MainRoadWidth
    └── Dim_28_58
```

---

# 24. Placement

Build local:

```txt
road axis = +X
parking axis = +Z
```

Sau đó:

```ts
group.position.set(x, 0, z);
group.rotation.y = rotationY;
```

Không scale.

---

# 25. Validation

```ts
function validatePerpendicularParkingC(
  spec: PerpendicularParkingBayCSpec
) {
  const EPS = 0.001;

  if (
    Math.abs(
      spec.parking.widthM - 2.840
    ) > EPS
  ) {
    throw new Error(
      'C-class Rd must be 2.840 m'
    );
  }

  if (
    Math.abs(
      spec.parking.depthM - 8.630
    ) > EPS
  ) {
    throw new Error(
      'C-class Ld must be 8.630 m'
    );
  }

  if (
    Math.abs(
      spec.control.leftLengthM - 9.156
    ) > EPS
  ) {
    throw new Error(
      'Left Ed must be 9.156 m'
    );
  }

  if (
    Math.abs(
      spec.control.rightLengthM - 9.156
    ) > EPS
  ) {
    throw new Error(
      'Right Ed must be 9.156 m'
    );
  }
}
```

---

# 26. Acceptance tests

```txt
TEST_01
Rd = 2.840 m.

TEST_02
Ld = 8.630 m.

TEST_03
Left Ed = 9.156 m.

TEST_04
Right Ed = 9.156 m.

TEST_05
Control length = 21.152 m.

TEST_06
Opening center is local origin.

TEST_07
Opening bounds are -1.420 / +1.420.

TEST_08
Control bounds are -10.576 / +10.576.

TEST_09
Parking bay is perpendicular to main road.

TEST_10
Opening remains unobstructed.

TEST_11
Red exam boundary and black physical edge are separate.

TEST_12
Main clear road width = 9.156 m.

TEST_13
Outer envelope 9.55 m stored separately.

TEST_14
28.58 m remains CAD reference metadata until semantic is confirmed.

TEST_15
No scale changes Ed/Rd/Ld.
```

---

# 27. Hard constraints

```txt
vehicleClass = C

Ed = 9.156 m
Rd = 2.840 m
Ld = 8.630 m

left Ed  = 9.156
right Ed = 9.156

controlLength = 21.152

parking orientation
= perpendicular to main road

red exam boundary
!=
black physical edge
```

---

# 28. Không được làm

```txt
DO NOT:

- trace pixel để lấy dimension;
- đổi Ed 9.156;
- đổi Rd 2.840;
- đổi Ld 8.630;
- dùng 28.58 thay control length;
- dùng 9.55 thay 9.156 làm clear road width nếu chưa xác nhận;
- scale object để vừa scene;
- đóng cửa parking bay;
- merge red line và black curb;
- bake xe vàng;
- bake parking sign;
- dùng một radius cho tất cả corner.
```

---

# 29. API đề xuất

```ts
interface CreatePerpendicularParkingBayCOptions {
  x: number;
  z: number;
  rotationY: number;
  showDebug?: boolean;
}

export function createPerpendicularParkingBayC(
  options: CreatePerpendicularParkingBayCOptions
): THREE.Group;
```

---

# 30. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Implement the C-class perpendicular parking bay described in
perpendicular_parking_bay_C_spec.md using Three.js + TypeScript.

UNITS:
1 unit = 1 meter.

HARD DIMENSIONS:
- Ed = 9.156 m.
- Rd = 2.840 m.
- Ld = 8.630 m.
- Left Ed = 9.156 m.
- Opening = 2.840 m.
- Right Ed = 9.156 m.
- Controlled length = 21.152 m.

LOCAL COORDINATES:
- +X = along main road.
- +Z = from main road into parking bay.
- +Y = up.
- Origin = center of parking opening.

DERIVED:
opening left X = -1.420
opening right X = +1.420

control start X = -10.576
control end X = +10.576

parking Z = 0 → 8.630

MAIN ROAD:
- clear width = 9.156 m.
- outer envelope ≈ 9.55 m, stored separately.
- 28.58 m is CAD reference metadata only until endpoint semantic is confirmed.

LAYERS:
1. Asphalt road/pocket.
2. Red exam boundary.
3. Black physical curb/edge.
4. ParkingInteriorZone.
5. ApproachZone.
6. EntryGate.
7. Debug dimensions.

IMPORTANT:
- Parking bay is perpendicular to main road.
- Opening must remain open.
- Red exam boundary != black physical edge.
- Do not trace pixels.
- Do not scale.
- Do not bake reference vehicle or parking sign.
- Keep local radii as separate CAD parameters.

PLACEMENT:
Build local geometry first.
Then:
group.position.set(x, 0, z);
group.rotation.y = rotationY;

OUTPUT:
- PerpendicularParkingBayC.ts
- PerpendicularParkingBayCConfig.ts
- PerpendicularParkingBayCGeometry.ts
- PerpendicularParkingBayCValidator.ts
- PerpendicularParkingBayCDebug.ts
```

---

# 31. Kết luận

Agent phải hiểu object này là:

```txt
CỤM GHÉP XE DỌC HẠNG C
```

với ba thông số quan trọng nhất:

```txt
Ed = 9.156 m
Rd = 2.840 m
Ld = 8.630 m
```

Topology:

```txt
main road
   │
   ├──── 9.156 ────┬─ 2.840 ─┬──── 9.156 ────┤
                    │         │
                    │ parking │
                    │ 8.630   │
                    │         │
                    ╰─────────╯
```

Geometry phải dựng parametric 1:1 theo mét và chỉ dùng `position + rotationY` để đặt vào sân.
