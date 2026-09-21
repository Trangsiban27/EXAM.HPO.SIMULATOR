# PARKING BAY SPEC — CHUỒNG GHÉP XE NGANG HẠNG B
## Đặc tả object chuồng đỗ xe theo bản vẽ CAD sân sát hạch Hiệp Phát
### Tối ưu cho Cursor / Codex CLI / Agent

> Nguồn: ảnh crop CAD người dùng cung cấp và bộ kích thước hạng B đã cung cấp trước đó.
>
> Mục tiêu: dựng đúng object chuồng ghép xe ngang hạng B trong Three.js.
>
> Đơn vị: mét. Không trace pixel.

---

# 0. Tóm tắt cho Agent

Object trong ảnh là một **parking bay dạng chữ U mở về phía road**.

```txt
ROAD / LANE
    │
    │   OPEN SIDE
    │
    │   ┌─────────────────────╮
    │   │                     │
    │   │       VEHICLE       │
    │   │                     │
    │   └─────────────────────╯
    │
```

Đặc điểm:

```txt
- xe đỗ song song với road;
- chuồng mở về phía road;
- đầu trong bo cong;
- đường đỏ = biên sát hạch;
- đường đen ngoài = mép vật lý / curb;
- không merge red boundary và black curb.
```

---

# 1. Loại bài

```txt
GHÉP XE NGANG VÀO NƠI ĐỖ — HẠNG B
```

ID:

```txt
PARKING_BAY_PARALLEL_B
```

Marker 13A/14A nếu có chỉ là annotation của sân, không bake vào geometry.

---

# 2. Kích thước chuẩn

Theo bảng kỹ thuật hạng B:

```txt
Lg = 6.615 m
Rg = 2.125 m
```

Ý nghĩa:

```txt
Lg = chiều dài nơi đỗ
Rg = chiều rộng / chiều sâu nơi đỗ
```

Trong crop CAD số `6.61` là hiển thị làm tròn của chiều dài.

Agent phải dùng:

```txt
parkingLengthM = 6.615
parkingDepthM  = 2.125
```

---

# 3. Hệ tọa độ local

Quy ước:

```txt
+Z = dọc road và dọc chiều dài chuồng
+X = từ road đi vào chuồng
+Y = lên trên
```

Chuồng mở tại:

```txt
X = 0
```

và đi sâu vào trong theo:

```txt
+X
```

---

# 4. Bounding box

Đặt tâm chiều dài tại `Z = 0`.

```txt
zMin = -Lg / 2 = -3.3075
zMax = +Lg / 2 = +3.3075

xMin = 0
xMax = Rg = 2.125
```

---

# 5. Topology

Chuồng không phải rectangle kín 4 cạnh.

Nó gồm:

```txt
TOP_BOUNDARY
+
FAR_END_BOUNDARY
+
BOTTOM_BOUNDARY
```

Phía road phải mở:

```txt
OPEN_SIDE
```

Hard constraint:

```txt
không có line đóng ngang cửa vào chuồng.
```

---

# 6. Biên đỏ

Đường đỏ là:

```txt
EXAM_BOUNDARY_LINE
```

Scene:

```txt
ExamBoundary
├── TopRedLine
├── FarEndRedLine
└── BottomRedLine
```

Không tạo red line ở open side.

---

# 7. Biên đen phía ngoài

Đường đen/gray phía ngoài là:

```txt
PHYSICAL_CURB_EDGE
```

Scene:

```txt
ParkingBay
├── ExamBoundaryRed
└── PhysicalCurbEdgeBlack
```

Khoảng cách giữa hai lớp:

```txt
physicalEdgeOffsetM = REQUIRED_FROM_CAD
```

Không đoán từ pixel.

---

# 8. Đầu kín bo cong

Phía trong chuồng là đầu kín bo cong:

```txt
TOP STRAIGHT
→ TOP-RIGHT ARC
→ FAR SIDE
→ BOTTOM-RIGHT ARC
→ BOTTOM STRAIGHT
```

Minh họa:

```txt
open
  ├────────────────────╮
  │                    │
  │                    │
  ├────────────────────╯
open
```

---

# 9. Bán kính bo

Ảnh crop không cho thấy số bán kính rõ.

Do đó:

```txt
cornerRadiusM = REQUIRED_FROM_CAD
```

Không tự đặt bằng pixel.

Không mặc định:

```txt
cornerRadius = parkingDepth / 2
```

nếu chưa có CAD xác nhận.

---

# 10. Parametric geometry

```ts
export interface ParallelParkingBaySpec {
  id: string;

  parkingLengthM: number;
  parkingDepthM: number;

  cornerRadiusM: number;

  examBoundaryWidthM: number;
  physicalEdgeOffsetM?: number;

  placement: {
    x: number;
    y: number;
    z: number;
    rotationY: number;
  };
}
```

Config:

```ts
export const PARALLEL_PARKING_B = {
  id: 'PARKING_BAY_PARALLEL_B',

  parkingLengthM: 6.615,
  parkingDepthM: 2.125,

  cornerRadiusM: null,
  examBoundaryWidthM: null,
  physicalEdgeOffsetM: null
} as const;
```

`null` = `REQUIRED_INPUT`.

---

# 11. Các điểm geometry local

Gọi:

```txt
L = parkingLengthM
D = parkingDepthM
R = cornerRadiusM
```

Các mốc:

```txt
TOP_OPEN:
(0, +L/2)

TOP_ARC_START:
(D - R, +L/2)

TOP_ARC_END:
(D, +L/2 - R)

BOTTOM_ARC_START:
(D, -L/2 + R)

BOTTOM_ARC_END:
(D - R, -L/2)

BOTTOM_OPEN:
(0, -L/2)
```

---

# 12. Path chữ U

Pseudo-code:

```ts
function createParkingBayBoundary(
  L: number,
  D: number,
  R: number
) {
  const path = new THREE.Path();

  path.moveTo(0, +L / 2);

  // top straight
  path.lineTo(
    D - R,
    +L / 2
  );

  // top-right circular arc

  // far side
  path.lineTo(
    D,
    -L / 2 + R
  );

  // bottom-right circular arc

  // bottom straight
  path.lineTo(
    0,
    -L / 2
  );

  // IMPORTANT:
  // do NOT close path across open side

  return path;
}
```

---

# 13. Corner phải dùng circular arc

Nếu CAD có bán kính:

```txt
dùng arc tròn chuẩn
```

Không dùng:

```txt
CatmullRomCurve3
Bezier tùy ý
```

cho phần bo.

---

# 14. Parking surface

Nếu road và chuồng cùng mặt asphalt:

```txt
ParkingBay chỉ cần boundary + sensor
```

Nếu cần mesh riêng:

```txt
ParkingSurface
```

phải:

```txt
- cùng Y với road;
- cùng material asphalt;
- không có seam.
```

---

# 15. Open side

Phía mở quay về road.

Không tạo:

```txt
curb
wall
red boundary
black boundary
```

ngang cửa.

---

# 16. Quan hệ với road

Chuồng nằm cạnh road và xe đỗ song song road.

Core object nên hỗ trợ:

```ts
side: 'LEFT' | 'RIGHT'
```

để có thể mirror sang phía đối diện.

Không hardcode placement sân vào geometry.

---

# 17. Placement

Dựng local trước, sau đó:

```ts
group.position.set(x, 0, z);
group.rotation.y = rotationY;
```

Không scale object để vừa scene.

---

# 18. Xe vàng trong CAD

Xe vàng là:

```txt
CAD reference vehicle
```

Không bake vào object production.

Có thể dùng:

```txt
DEBUG_REFERENCE_VEHICLE
```

---

# 19. Text HẠNG B

Text cyan `HẠNG B` là annotation CAD.

Không bake vào asphalt.

Chỉ lưu metadata:

```ts
metadata.vehicleClass = 'B';
```

---

# 20. Arrow và lane line bên cạnh

Các mũi tên và vạch lane cạnh chuồng thuộc:

```txt
ROAD OBJECT
```

không thuộc core parking bay.

Không bake chúng vào chuồng.

---

# 21. Scene graph

```txt
ParallelParkingBay_B
│
├── Surface
│   └── ParkingSurface       // optional
│
├── ExamBoundary
│   ├── TopRedLine
│   ├── FarEndRedLine
│   └── BottomRedLine
│
├── PhysicalEdge
│   ├── TopCurb
│   ├── FarEndCurb
│   └── BottomCurb
│
├── Logic
│   ├── ParkingInteriorZone
│   ├── EntryGate
│   └── ExitGate
│
└── Debug
    ├── LengthDimension
    ├── DepthDimension
    ├── CornerRadius
    ├── OpenSide
    └── VehicleReference
```

---

# 22. Entry gate

Tạo logic gate tại phía mở:

```txt
PARKING_ENTRY_GATE
```

Gate chạy:

```txt
x = 0
z = -L/2 → +L/2
```

Không render production.

---

# 23. Parking interior zone

Tạo:

```txt
PARKING_INTERIOR_ZONE
```

Dùng để kiểm tra:

```txt
- xe đã vào chuồng;
- xe có nằm đủ trong vùng;
- bánh xe có vượt boundary;
- xe có ra khỏi chuồng.
```

---

# 24. Boundary sensor

Tách:

```txt
VisualBoundary
LogicBoundarySensor
PhysicalCurbCollider
```

Không dùng duy nhất một red mesh cho cả visual + collision + scoring.

---

# 25. Physical curb

Các thông số:

```txt
curbWidthM
curbHeightM
physicalEdgeOffsetM
```

phải lấy từ config/CAD.

Không suy từ screenshot.

---

# 26. Validation

```ts
function validateParkingBay(
  spec: ParallelParkingBaySpec
) {
  if (
    Math.abs(
      spec.parkingLengthM - 6.615
    ) > 0.001
  ) {
    throw new Error(
      'B-class parking length must be 6.615 m'
    );
  }

  if (
    Math.abs(
      spec.parkingDepthM - 2.125
    ) > 0.001
  ) {
    throw new Error(
      'B-class parking depth must be 2.125 m'
    );
  }

  if (
    spec.cornerRadiusM <= 0 ||
    spec.cornerRadiusM > spec.parkingDepthM
  ) {
    throw new Error(
      'Invalid corner radius'
    );
  }
}
```

---

# 27. Acceptance tests

```txt
TEST_01
parkingLengthM == 6.615 m

TEST_02
parkingDepthM == 2.125 m

TEST_03
Open side has no blocking boundary.

TEST_04
Top and bottom boundaries are parallel.

TEST_05
Far end connects top and bottom boundaries.

TEST_06
Corner transitions are tangent.

TEST_07
Red exam line and black physical edge remain separate.

TEST_08
Reference vehicle is not production geometry.

TEST_09
HẠNG B text is metadata/debug only.

TEST_10
Road arrow/lane line are not children of parking bay.

TEST_11
rotationY rotates the full object without changing dimensions.

TEST_12
No scaling changes 6.615 × 2.125.
```

---

# 28. Hard constraints

```txt
vehicleClass = B

parkingLengthM = 6.615

parkingDepthM = 2.125

shape = U-SHAPED OPEN BAY

open side = toward road

vehicle parked orientation
= parallel to road

red exam boundary
!=
black physical curb
```

---

# 29. REQUIRED_INPUT

```txt
cornerRadiusM

examBoundaryWidthM

physicalEdgeOffsetM

curbWidthM
curbHeightM

exact x
exact z
exact rotationY
```

Không đoán bằng pixel.

---

# 30. Không được làm

```txt
DO NOT:

- đóng kín cửa vào chuồng;
- biến chuồng thành rectangle 4 cạnh;
- đổi 6.615 m;
- đổi 2.125 m;
- scale để vừa road;
- merge red exam line và black curb;
- bake xe vàng;
- bake HẠNG B;
- bake arrow road;
- dùng spline tự do nếu CAD có radius.
```

---

# 31. API đề xuất

```ts
interface CreateParallelParkingBayBOptions {
  x: number;
  z: number;

  rotationY: number;

  cornerRadiusM: number;

  side?: 'LEFT' | 'RIGHT';

  showDebug?: boolean;
}

export function createParallelParkingBayB(
  options: CreateParallelParkingBayBOptions
): THREE.Group;
```

---

# 32. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Implement the B-class parallel parking bay described in
parallel_parking_bay_B_spec.md using Three.js + TypeScript.

UNITS:
1 unit = 1 meter.

HARD DIMENSIONS:
- parking length Lg = 6.615 m.
- parking depth Rg = 2.125 m.

LOCAL COORDINATES:
- +Z = along road / parking length.
- +X = from road into parking bay.
- +Y = up.

SHAPE:
- U-shaped parking pocket.
- Open side at X=0 toward the road.
- No boundary across the open side.
- Top and bottom straight boundaries.
- Rounded closed far end.
- Vehicle parks parallel to road.

LAYERS:
1. ParkingSurface (optional).
2. Red ExamBoundary.
3. Black PhysicalCurbEdge.
4. ParkingInteriorZone.
5. EntryGate.
6. Debug dimensions.

IMPORTANT:
- Red exam boundary and black curb are separate.
- cornerRadiusM comes from config/CAD.
- Do not infer corner radius from pixels.
- Do not bake the yellow vehicle.
- Do not bake HẠNG B text.
- Do not bake road arrows.
- Do not close the road-facing side.
- Do not scale the bay.

PLACEMENT:
group.position.set(x, 0, z);
group.rotation.y = rotationY;

OUTPUT:
- ParallelParkingBayB.ts
- ParallelParkingBayGeometry.ts
- ParallelParkingBayConfig.ts
- ParallelParkingBayValidator.ts
- ParallelParkingBayDebug.ts
```

---

# 33. Kết luận

Agent phải hiểu object này là:

```txt
CHUỒNG GHÉP XE NGANG HẠNG B
```

kích thước:

```txt
6.615 m × 2.125 m
```

và topology:

```txt
MỞ VỀ PHÍA ROAD
+
ĐẦU TRONG BO CONG
+
XE ĐỖ SONG SONG ROAD
```

Geometry phải parametric 1:1 theo mét, không trace screenshot.
