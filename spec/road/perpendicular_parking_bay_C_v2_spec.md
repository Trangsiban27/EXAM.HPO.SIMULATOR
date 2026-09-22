# PERPENDICULAR PARKING BAY SPEC — HẠNG C

## 1. Mục tiêu

Dựng đúng object **chuồng ghép xe dọc hạng C** theo bản vẽ CAD sân sát hạch Hiệp Phát bằng Three.js/TypeScript.

- Đơn vị: mét.
- Không trace pixel.
- Số đo CAD là hard constraint.
- Các layer đỏ/đen phải tách riêng.
- Geometry phải parametric và đặt vào sân bằng `position + rotationY`, không scale.

---

## 2. Thông số chính

Theo bản vẽ:

```txt
Ed = 9.156 m
Rd = 2.840 m
Ld = 8.630 m
```

Ý nghĩa:

```txt
Ed = khoảng cách khống chế hai bên cửa chuồng
Rd = chiều rộng nơi ghép xe dọc
Ld = chiều dài/chiều sâu nơi ghép xe dọc
```

Hai phía cửa chuồng:

```txt
LEFT Ed  = 9.156 m
RIGHT Ed = 9.156 m
```

Tổng vùng khống chế theo phương road:

```txt
9.156 + 2.840 + 9.156 = 21.152 m
```

---

## 3. Các dimension khác trên CAD

Bản vẽ còn thể hiện:

```txt
39.10 m
9.156 m
9.55 m
```

Diễn giải dùng cho Agent:

```txt
clearRoadWidthM       = 9.156
outerEnvelopeWidthM   = 9.550
overallCadSpanM       = 39.100
```

`39.10 m` là dimension tổng lớn hơn vùng control `21.152 m`, vì vậy chỉ lưu:

```txt
overallCadSpanM = 39.10
status = REFERENCE_ONLY
```

Không dùng `39.10` thay cho `Ed`, `Rd`, `Ld` hoặc control length.

---

## 4. Topology

Chuồng vuông góc với road chính:

```txt
                         MAIN ROAD

        9.156              2.840              9.156
<──────────────────><────────────────><──────────────────>

                               │
                               │
                               │
                               │ 8.630
                               │
                               │
                               ╰──────────────╯
```

Hard rule:

```txt
parking axis ⟂ main road axis
```

Cửa chuồng phải mở vào road.

---

## 5. Hệ tọa độ local

Quy ước:

```txt
+X = dọc theo main road
+Z = từ road đi vào chuồng
+Y = hướng lên
```

Đặt origin tại tâm cửa chuồng:

```txt
X = 0
Z = 0
```

---

## 6. Tọa độ cửa chuồng

Với:

```txt
Rd = 2.840 m
```

nửa bề rộng:

```txt
1.420 m
```

Do đó:

```txt
openingLeftX  = -1.420
openingRightX = +1.420
```

---

## 7. Control bounds

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

## 8. Chiều sâu chuồng

```txt
parkingStartZ = 0
parkingEndZ   = 8.630
```

Hard constraint:

```txt
parkingDepthM = 8.630
```

---

## 9. Parking interior zone

Tạo logical zone:

```txt
PARKING_INTERIOR_ZONE
```

Clear dimensions:

```txt
width  = 2.840 m
depth  = 8.630 m
```

Dùng để:

```txt
- xác nhận xe đã vào chuồng;
- kiểm tra xe nằm trong vùng;
- kiểm tra bánh vượt boundary;
- xác nhận hoàn thành bài.
```

---

## 10. Entry gate

Tạo:

```txt
PARKING_ENTRY_GATE
```

Local:

```txt
X = -1.420 → +1.420
Z = 0
```

Gate chỉ là logic sensor, không render production.

---

## 11. Red exam boundary

Đường đỏ trên CAD là:

```txt
EXAM_BOUNDARY
```

Scene:

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

## 12. Black physical edge

Đường đen ngoài red line là:

```txt
PHYSICAL_EDGE / CURB
```

Hard rule:

```txt
ExamBoundaryRed != PhysicalEdgeBlack
```

Không merge thành một object duy nhất.

---

## 13. Radius local

Crop có các annotation local như:

```txt
R1
R1.5
R4
```

và các bán kính khác ở khu vực lân cận.

Các radius này chỉ áp dụng cho từng góc cụ thể.

Không dùng một radius cho toàn bộ object.

Đề xuất config:

```ts
radii: {
  topLeftOuterM?: number;
  entryLeftM?: number;
  entryRightM?: number;
  bottomLeftM?: number;
  bottomRightM?: number;
  rightOuterM?: number;
}
```

Chỉ hardcode khi xác định đúng endpoint trên full CAD.

---

## 14. Grass / non-drivable area

Vùng chấm xanh là:

```txt
NON_DRIVABLE_GRASS
```

Tách riêng:

```txt
GrassMesh
GrassCollider
```

Không coi là asphalt.

---

## 15. Xe vàng và biển P

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

## 16. Road surface

Main road và parking pocket phải dùng cùng asphalt material.

Nếu tách mesh:

```txt
same Y
same material
no visible seam
```

---

## 17. Parametric interface

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
    outerEnvelopeWidthM: number;
  };

  cadReference: {
    overallSpanM: number;
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

## 18. Config chuẩn

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
    overallSpanM: 39.100
  }
} as const;
```

---

## 19. Derived values

```ts
export function deriveParkingCGeometry() {
  const Ed = 9.156;
  const Rd = 2.840;
  const Ld = 8.630;

  const halfOpening = Rd / 2;

  return {
    openingHalfWidthM: halfOpening,

    openingLeftX: -halfOpening,
    openingRightX: +halfOpening,

    controlStartX:
      -(halfOpening + Ed),

    controlEndX:
      +(halfOpening + Ed),

    controlLengthM:
      Ed + Rd + Ed,

    parkingDepthM:
      Ld
  };
}
```

Kết quả:

```txt
openingHalfWidthM = 1.420
openingLeftX      = -1.420
openingRightX     = +1.420

controlStartX     = -10.576
controlEndX       = +10.576
controlLengthM    = 21.152

parkingDepthM     = 8.630
```

---

## 20. Scene graph

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
│   ├── GrassColliderLeft
│   └── GrassColliderRight
│
└── Debug
    ├── Dim_Ed_Left
    ├── Dim_Rd
    ├── Dim_Ed_Right
    ├── Dim_Ld
    ├── Dim_RoadWidth
    ├── Dim_OuterEnvelope
    └── Dim_39_10
```

---

## 21. Geometry builder

Thứ tự triển khai:

```txt
1. Build main road polygon.
2. Tạo opening rộng 2.840 m.
3. Tạo parking pocket sâu 8.630 m.
4. Tạo các corner arc theo radius CAD.
5. Build asphalt surface.
6. Build red exam boundary riêng.
7. Build black physical edge riêng.
8. Build parking sensors riêng.
```

Không ghép visual + sensor + collider thành một mesh duy nhất.

---

## 22. Placement

Build local geometry trước:

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

## 23. Validation

```ts
function validatePerpendicularParkingC(
  spec: PerpendicularParkingBayCSpec
) {
  const EPS = 0.001;

  if (Math.abs(spec.parking.widthM - 2.840) > EPS) {
    throw new Error('Rd must be 2.840 m');
  }

  if (Math.abs(spec.parking.depthM - 8.630) > EPS) {
    throw new Error('Ld must be 8.630 m');
  }

  if (Math.abs(spec.control.leftLengthM - 9.156) > EPS) {
    throw new Error('Left Ed must be 9.156 m');
  }

  if (Math.abs(spec.control.rightLengthM - 9.156) > EPS) {
    throw new Error('Right Ed must be 9.156 m');
  }
}
```

---

## 24. Acceptance tests

```txt
TEST_01  Rd = 2.840 m
TEST_02  Ld = 8.630 m
TEST_03  Left Ed = 9.156 m
TEST_04  Right Ed = 9.156 m
TEST_05  Control length = 21.152 m
TEST_06  Opening bounds = -1.420 / +1.420
TEST_07  Control bounds = -10.576 / +10.576
TEST_08  Parking bay ⟂ main road
TEST_09  Opening remains unobstructed
TEST_10  Red boundary != black physical edge
TEST_11  Clear road width = 9.156 m
TEST_12  Outer envelope = 9.550 m stored separately
TEST_13  39.10 m remains CAD reference metadata
TEST_14  No scale changes Ed/Rd/Ld
```

---

## 25. Hard constraints

```txt
vehicleClass = C

Ed = 9.156 m
Rd = 2.840 m
Ld = 8.630 m

left Ed  = 9.156
right Ed = 9.156

controlLength = 21.152

clearRoadWidth = 9.156
outerEnvelope  = 9.550

parking orientation
= perpendicular to main road

red exam boundary
!=
black physical edge
```

---

## 26. Không được làm

```txt
DO NOT:

- trace pixel để lấy dimension;
- đổi Ed/Rd/Ld;
- dùng 39.10 làm control length;
- dùng 9.55 thay 9.156 cho clear road width;
- scale object để vừa scene;
- đóng cửa parking bay;
- merge red line và black curb;
- bake xe tham chiếu;
- bake biển P;
- dùng một radius cho mọi corner.
```

---

## 27. API đề xuất

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

## 28. Prompt cho Cursor / Codex CLI

```txt
TASK:
Implement the C-class perpendicular parking bay described in
perpendicular_parking_bay_C_v2_spec.md using Three.js + TypeScript.

UNITS:
1 unit = 1 meter.

HARD DIMENSIONS:
Ed = 9.156
Rd = 2.840
Ld = 8.630

Left Ed = 9.156
Opening = 2.840
Right Ed = 9.156

Control length = 21.152

Main clear road width = 9.156
Outer envelope = 9.550

CAD overall span = 39.100
REFERENCE ONLY.

LOCAL:
+X = along main road
+Z = from road into parking bay
+Y = up

Origin = center of parking opening

DERIVED:
openingLeftX  = -1.420
openingRightX = +1.420

controlStartX = -10.576
controlEndX   = +10.576

parking Z = 0 → 8.630

BUILD:
- MainRoadSurface
- ParkingPocketSurface
- Red ExamBoundary
- Black PhysicalCurbEdge
- ParkingInteriorZone
- ApproachZone
- EntryGate
- Debug dimensions

IMPORTANT:
- Parking bay is perpendicular to main road.
- Opening must remain open.
- Red exam boundary != black physical edge.
- Do not trace pixels.
- Do not scale.
- Do not bake the reference vehicle or parking sign.
- Local radii must remain independent CAD parameters.

PLACEMENT:
group.position.set(x, 0, z)
group.rotation.y = rotationY
```

---

## 29. Kết luận

Agent phải hiểu object này là:

```txt
CỤM GHÉP XE DỌC HẠNG C
```

với:

```txt
Ed = 9.156 m
Rd = 2.840 m
Ld = 8.630 m
```

và:

```txt
9.156 + 2.840 + 9.156
= 21.152 m
```

`39.10 m` là dimension CAD tổng lớn hơn và được giữ riêng như metadata cho đến khi xác minh endpoint.

Geometry phải dựng parametric 1:1 theo mét, sau đó chỉ dùng `position + rotationY` để đặt vào sân.
