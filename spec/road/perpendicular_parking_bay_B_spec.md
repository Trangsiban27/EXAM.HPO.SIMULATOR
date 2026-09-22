# PERPENDICULAR PARKING BAY SPEC — HẠNG B
## Object ghép xe dọc hạng B theo bản vẽ CAD sân sát hạch Hiệp Phát
### Tối ưu cho Cursor / Codex CLI / Agent / Three.js

> **Nguồn:** ảnh crop CAD người dùng cung cấp.
>
> **Mục tiêu:** mô tả chính xác object **ghép xe dọc hạng B** để agent có thể dựng đúng hình học trong Three.js.
>
> **Đơn vị:** mét.
>
> **Nguyên tắc:** ưu tiên số đo CAD; không trace pixel; không scale để ép khớp.

---

# 0. Agent summary

Object là cụm:

```txt
MAIN ROAD / APPROACH CORRIDOR
+
PERPENDICULAR PARKING BAY — HẠNG B
```

Topology:

```txt
                         MAIN ROAD

        5.292              2.300              5.292
<──────────────────><────────────────><──────────────────>

                               │
                               │
                               │
                               │ 5.410
                               │
                               │
                               ╰──────────────╯
```

Thông số đọc từ ảnh:

```txt
Ed = 5.292 m
Rd = 2.300 m
Ld = 5.410 m

clearRoadWidthM     = 5.292 m
outerEnvelopeWidthM = 5.700 m
```

Trên CAD đang hiển thị làm tròn:

```txt
5.29
2.3
5.29
5.29
5.7
```

---

# 1. Nhận diện object

Đây là:

```txt
BÀI GHÉP XE DỌC — HẠNG B
```

ID đề xuất:

```txt
PERPENDICULAR_PARKING_BAY_B
```

Tên file/code đề xuất:

```txt
PerpendicularParkingBayB
```

---

# 2. Các thông số cốt lõi

## 2.1 Kích thước chuồng

```txt
Ed = 5.292 m
Rd = 2.300 m
Ld = 5.410 m
```

Ý nghĩa:

```txt
Ed = khoảng cách khống chế ở mỗi bên cửa chuồng
Rd = chiều rộng nơi ghép xe dọc / chiều rộng cửa chuồng
Ld = chiều dài (chiều sâu) nơi ghép xe dọc
```

## 2.2 Chiều rộng road

```txt
clearRoadWidthM     = 5.292 m
outerEnvelopeWidthM = 5.700 m
```

Diễn giải:

```txt
5.292 m = bề rộng clear dùng cho logic driving
5.700 m = bề rộng bao ngoài / reference envelope
```

Không được dùng `5.700 m` để thay cho `5.292 m` trong logic drivable zone.

---

# 3. Tổng chiều dài vùng khống chế

Công thức:

```txt
controlLengthM = Ed + Rd + Ed
```

Tính ra:

```txt
controlLengthM = 5.292 + 2.300 + 5.292
               = 12.884 m
```

---

# 4. Hệ tọa độ local

Quy ước local:

```txt
+X = dọc theo road chính
+Z = từ road đi vào chuồng
+Y = hướng lên
```

Tức là:

```txt
main road axis   = +X
parking bay axis = +Z
```

---

# 5. Origin

Đặt origin tại:

```txt
tâm cửa chuồng
```

Khi đó:

```txt
X = 0
Z = 0
```

---

# 6. Tọa độ cửa chuồng

Với:

```txt
Rd = 2.300 m
```

nửa bề rộng cửa:

```txt
halfOpening = 1.150 m
```

Suy ra:

```txt
openingLeftX  = -1.150
openingRightX = +1.150
```

---

# 7. Control bounds

Bên trái:

```txt
controlStartX = -(1.150 + 5.292)
              = -6.442
```

Bên phải:

```txt
controlEndX   = +(1.150 + 5.292)
              = +6.442
```

Kiểm tra:

```txt
6.442 - (-6.442) = 12.884 m
```

---

# 8. Chiều sâu chuồng

Chuồng bắt đầu tại:

```txt
parkingStartZ = 0
```

Đáy chuồng:

```txt
parkingEndZ = 5.410
```

---

# 9. Topology bắt buộc

Chuồng là pocket mở vuông góc từ road:

```txt
MAIN ROAD
────────────────────────────────────────
                     OPENING
                       │
                  ┌────┴────┐
                  │         │
                  │         │
                  │         │
                  │         │
                  ╰─────────╯
```

Hard rules:

```txt
- opening phải mở;
- parking bay vuông góc với main road;
- không tạo wall/curb chắn ngang cửa chuồng.
```

---

# 10. Red exam boundary

Đường đỏ trên CAD là:

```txt
EXAM_BOUNDARY
```

Tách riêng thành layer:

```txt
ExamBoundaryRed
├── MainRoadLeftSegment
├── EntryLeftTransition
├── ParkingLeftSide
├── ParkingBottom
├── ParkingRightSide
├── EntryRightTransition
└── MainRoadRightSegment
```

---

# 11. Black physical edge

Đường đen ngoài red line là:

```txt
PHYSICAL_EDGE / CURB
```

Hard rule:

```txt
ExamBoundaryRed != PhysicalEdgeBlack
```

Không merge vào cùng một mesh hoặc sensor.

---

# 12. Radius local

Crop thể hiện các annotation radius:

```txt
R1
R1.5
R3
```

Đây là **local corner radii**, không phải một radius dùng cho toàn bộ object.

Config đề xuất:

```ts
radii: {
  mainRoadOuterLeftM?: number;
  entryLeftM?: number;
  entryRightM?: number;
  parkingBottomLeftM?: number;
  parkingBottomRightM?: number;
  outerRightM?: number;
}
```

Chỉ hardcode khi đã xác minh đúng vị trí trên full CAD.

---

# 13. Parking interior zone

Tạo logical zone:

```txt
PARKING_INTERIOR_ZONE
```

Kích thước clear:

```txt
widthM = 2.300
depthM = 5.410
```

Dùng cho:

```txt
- phát hiện xe đã vào chuồng;
- kiểm tra bánh xe nằm trong vùng;
- kiểm tra vượt boundary;
- xác nhận hoàn thành bài.
```

---

# 14. Approach zone

Tạo:

```txt
PARKING_APPROACH_ZONE
```

Kích thước:

```txt
lengthM = 12.884
widthM  = 5.292
```

---

# 15. Entry gate

Tạo sensor logic:

```txt
PARKING_ENTRY_GATE
```

Bounds:

```txt
X = -1.150 → +1.150
Z = 0
```

Không cần render production.

---

# 16. Grass / non-drivable area

Vùng chấm xanh là:

```txt
NON_DRIVABLE_GRASS
```

Tạo riêng:

```txt
GrassMesh
GrassCollider
```

Không merge vào asphalt.

---

# 17. Parking sign và xe tham chiếu

Biển `P`:

```txt
PARKING_SIGN
```

Xe vàng:

```txt
CAD_REFERENCE_VEHICLE
```

Cả hai là object phụ.

Không bake vào core parking geometry.

---

# 18. Road surface

Main road và parking bay nên dùng cùng:

```txt
material
elevation
roughness
```

Nếu tách mesh:

```txt
- same Y
- same asphalt material
- no visible seam
```

---

# 19. Interface đề xuất

```ts
export interface PerpendicularParkingBayBConfig {
  id: string;

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

  radii?: {
    mainRoadOuterLeftM?: number;
    entryLeftM?: number;
    entryRightM?: number;
    parkingBottomLeftM?: number;
    parkingBottomRightM?: number;
    outerRightM?: number;
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

# 20. Config chuẩn cho object này

```ts
export const PERPENDICULAR_PARKING_BAY_B = {
  id: 'PERPENDICULAR_PARKING_BAY_B',

  parking: {
    widthM: 2.300,
    depthM: 5.410
  },

  control: {
    leftLengthM: 5.292,
    rightLengthM: 5.292
  },

  mainRoad: {
    clearWidthM: 5.292,
    outerEnvelopeWidthM: 5.700
  }
} as const;
```

---

# 21. Derived geometry

```ts
export function deriveParkingBayBGeometry() {
  const Ed = 5.292;
  const Rd = 2.300;
  const Ld = 5.410;

  const halfOpening = Rd / 2;

  return {
    openingHalfWidthM: halfOpening,

    openingLeftX: -halfOpening,
    openingRightX: +halfOpening,

    controlStartX: -(halfOpening + Ed),
    controlEndX: +(halfOpening + Ed),

    controlLengthM: Ed + Rd + Ed,

    parkingDepthM: Ld
  };
}
```

Kết quả:

```txt
openingHalfWidthM = 1.150
openingLeftX      = -1.150
openingRightX     = +1.150

controlStartX     = -6.442
controlEndX       = +6.442
controlLengthM    = 12.884

parkingDepthM     = 5.410
```

---

# 22. Scene graph

```txt
PerpendicularParkingBayB
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
│   ├── GrassColliderLeft
│   └── GrassColliderRight
│
└── Debug
    ├── Dim_Ed_Left
    ├── Dim_Rd
    ├── Dim_Ed_Right
    ├── Dim_Ld
    └── Dim_RoadWidth
```

---

# 23. Geometry builder

Thứ tự triển khai khuyến nghị:

```txt
1. Build main road polygon.
2. Tạo opening rộng 2.300 m.
3. Extend parking pocket sâu 5.410 m.
4. Áp local corner radii.
5. Build asphalt surface.
6. Build red boundary riêng.
7. Build black physical edge riêng.
8. Build logic zones/sensors.
9. Add debug dimensions.
```

---

# 24. Placement

Build local geometry trước.

Sau đó đặt vào scene:

```ts
group.position.set(x, 0, z);
group.rotation.y = rotationY;
```

Không dùng scale.

---

# 25. Validation

```ts
export function validateParkingBayB(
  config: PerpendicularParkingBayBConfig
) {
  const EPS = 0.001;

  if (Math.abs(config.parking.widthM - 2.300) > EPS) {
    throw new Error('Rd must be 2.300 m');
  }

  if (Math.abs(config.parking.depthM - 5.410) > EPS) {
    throw new Error('Ld must be 5.410 m');
  }

  if (Math.abs(config.control.leftLengthM - 5.292) > EPS) {
    throw new Error('Left Ed must be 5.292 m');
  }

  if (Math.abs(config.control.rightLengthM - 5.292) > EPS) {
    throw new Error('Right Ed must be 5.292 m');
  }
}
```

---

# 26. Acceptance tests

```txt
TEST_01  Rd = 2.300 m
TEST_02  Ld = 5.410 m
TEST_03  Left Ed = 5.292 m
TEST_04  Right Ed = 5.292 m
TEST_05  Control length = 12.884 m
TEST_06  Opening bounds = -1.150 / +1.150
TEST_07  Control bounds = -6.442 / +6.442
TEST_08  Parking bay ⟂ main road
TEST_09  Opening remains unobstructed
TEST_10  Red boundary != black physical edge
TEST_11  Clear road width = 5.292 m
TEST_12  Outer envelope = 5.700 m stored separately
TEST_13  No scaling changes Ed/Rd/Ld
```

---

# 27. Không được làm

```txt
DO NOT:

- trace pixel để lấy dimension;
- scale object để vừa scene;
- dùng 5.700 thay cho 5.292 trong drivable logic;
- đóng cửa chuồng;
- merge red boundary và black curb;
- bake xe vàng;
- bake biển P;
- dùng một radius cho mọi corner.
```

---

# 28. API đề xuất

```ts
interface CreatePerpendicularParkingBayBOptions {
  x: number;
  z: number;
  rotationY: number;
  showDebug?: boolean;
}

export function createPerpendicularParkingBayB(
  options: CreatePerpendicularParkingBayBOptions
): THREE.Group;
```

---

# 29. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Implement the B-class perpendicular parking bay described in
perpendicular_parking_bay_B_spec.md using Three.js + TypeScript.

UNITS:
1 unit = 1 meter.

HARD DIMENSIONS:
Ed = 5.292
Rd = 2.300
Ld = 5.410

Left Ed = 5.292
Opening = 2.300
Right Ed = 5.292

Control length = 12.884

Main clear road width = 5.292
Outer envelope width  = 5.700

LOCAL:
+X = along main road
+Z = from main road into parking pocket
+Y = up

Origin = center of parking opening.

DERIVED:
openingLeftX  = -1.150
openingRightX = +1.150

controlStartX = -6.442
controlEndX   = +6.442

parking Z = 0 → 5.410

BUILD:
1. MainRoadSurface
2. ParkingPocketSurface
3. Red ExamBoundary
4. Black PhysicalCurbEdge
5. ParkingInteriorZone
6. ApproachZone
7. EntryGate
8. Debug dimensions

IMPORTANT:
- Parking bay is perpendicular to main road.
- Opening must remain open.
- Red exam boundary != black physical edge.
- Do not trace pixels.
- Do not scale.
- Do not bake the yellow reference car.
- Do not bake the P parking sign.
- Local radii must stay independent.
```

---

# 30. Kết luận

Agent phải hiểu object này là:

```txt
B-CLASS PERPENDICULAR PARKING BAY
```

với các thông số hard:

```txt
Ed = 5.292 m
Rd = 2.300 m
Ld = 5.410 m
clearRoadWidthM = 5.292 m
outerEnvelopeWidthM = 5.700 m
```

Geometry phải dựng parametric 1:1 theo mét, sau đó chỉ dùng `position + rotationY` để đặt vào sân.
