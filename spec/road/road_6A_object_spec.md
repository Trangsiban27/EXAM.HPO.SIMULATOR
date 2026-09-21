# ROAD OBJECT SPEC — TRỤC ĐƯỜNG 5 LÀN KHU 6A
## Đặc tả dựng object Road từ bản vẽ CAD sân sát hạch Hiệp Phát
### Tối ưu cho Cursor / Codex CLI / Agent coding

> **Mục tiêu:** dựng lại đúng object đường thẳng nhiều làn xuất hiện trong ảnh CAD người dùng cung cấp, phục vụ Three.js.
>
> File này chỉ mô tả **object Road** và các lane/marking chính nhìn thấy trên bản vẽ.  
> Không đồng nhất marker `6A` với toàn bộ bài thi số 6. `6A` trong ảnh chỉ là annotation/route marker nằm trên trục đường này.
>
> **Nguyên tắc:** số đo đọc rõ từ bản vẽ là hard constraint; phần không đọc được rõ phải để configurable, không tự bịa.

---

# 0. Tóm tắt để Agent hiểu ngay

Bản vẽ thể hiện một **trục đường thẳng gồm 5 làn song song**, mỗi làn rộng:

```txt
3.70 m
```

Tổng bề rộng phần đường:

```txt
5 × 3.70 = 18.50 m
```

Hướng giao thông nhìn từ ảnh:

```txt
- Làn ngoài cùng bên trái: đi xuống bản vẽ.
- 4 làn còn lại: đi lên bản vẽ.
```

Cấu trúc:

```txt
PHÍA TRÊN BẢN VẼ / +Z

        ↓                ↑        ↑        ↑        ↑
   LANE_01          LANE_02  LANE_03  LANE_04  LANE_05
   3.70 m           3.70 m   3.70 m   3.70 m   3.70 m

|────────|────────|────────|────────|────────|
|        |        :        :        :        |
|   ↓    |   ↑    :   ↑    :   ↑    :   ↑    |
|        |        :        :        :        |
|────────|────────|────────|────────|────────|

PHÍA DƯỚI BẢN VẼ / -Z
```

Ký hiệu:

```txt
| = biên hoặc vạch liền
: = vạch đứt phân làn cùng chiều
```

---

# 1. Những gì đọc được chắc chắn từ bản vẽ

## 1.1 Số làn

```txt
laneCount = 5
```

Bản vẽ có chuỗi kích thước ngang:

```txt
3.7 | 3.7 | 3.7 | 3.7 | 3.7
```

=> tổng cộng 5 module làn.

---

## 1.2 Chiều rộng từng làn

```txt
laneWidth = 3.70 m
```

Đây là hard constraint.

---

## 1.3 Tổng chiều rộng mặt đường

```txt
roadWidth = 5 × 3.70
          = 18.50 m
```

Hard constraint:

```ts
const ROAD_WIDTH_M = 18.5;
```

---

## 1.4 Hướng xe chạy

Theo các mũi tên cyan trên CAD:

```txt
LANE_01 = hướng xuống bản vẽ
LANE_02 = hướng lên bản vẽ
LANE_03 = hướng lên bản vẽ
LANE_04 = hướng lên bản vẽ
LANE_05 = hướng lên bản vẽ
```

Nếu quy ước:

```txt
+Z = lên phía trên bản vẽ
-Z = xuống phía dưới bản vẽ
```

thì:

```ts
lane01.direction = -1; // -Z
lane02.direction = +1; // +Z
lane03.direction = +1;
lane04.direction = +1;
lane05.direction = +1;
```

---

# 2. Hệ tọa độ đề xuất

Dùng hệ tọa độ chung của sân:

```txt
X = ngang bản vẽ
Y = cao độ
Z = dọc theo trục đường
```

Road nằm trên:

```txt
Y = 0
```

Đặt tâm road tại:

```txt
X = 0
```

Khi đó:

```txt
left edge  = -9.25 m
right edge = +9.25 m
```

vì:

```txt
18.50 / 2 = 9.25
```

---

# 3. Tọa độ lane theo X

## 3.1 Biên các làn

Với tâm road `X = 0`:

```txt
X0 = -9.25
X1 = -5.55
X2 = -1.85
X3 = +1.85
X4 = +5.55
X5 = +9.25
```

Do:

```txt
laneWidth = 3.70 m
```

---

## 3.2 Tâm từng làn

```txt
LANE_01 centerX = -7.40 m
LANE_02 centerX = -3.70 m
LANE_03 centerX =  0.00 m
LANE_04 centerX = +3.70 m
LANE_05 centerX = +7.40 m
```

Công thức:

```ts
centerX = -roadWidth / 2 + laneWidth / 2 + index * laneWidth;
```

với:

```txt
index = 0..4
```

---

# 4. Phân chia làn và loại vạch

Theo hình CAD:

## 4.1 Giữa LANE_01 và LANE_02

Vị trí:

```txt
X = -5.55 m
```

Quan sát bản vẽ cho thấy đây là một **đường phân cách liền**, khác với các vạch đứt phía phải.

Ý nghĩa topology:

```txt
LANE_01
= dòng xe ngược chiều

LANE_02 → LANE_05
= dòng xe cùng chiều còn lại
```

Object đề xuất:

```txt
CENTER_DIRECTION_DIVIDER
```

Loại:

```txt
SOLID_LINE
```

---

## 4.2 Giữa LANE_02 và LANE_03

```txt
X = -1.85 m
```

Loại:

```txt
DASHED_LANE_LINE
```

---

## 4.3 Giữa LANE_03 và LANE_04

```txt
X = +1.85 m
```

Loại:

```txt
DASHED_LANE_LINE
```

---

## 4.4 Giữa LANE_04 và LANE_05

```txt
X = +5.55 m
```

Loại:

```txt
DASHED_LANE_LINE
```

---

## 4.5 Biên ngoài

Biên road:

```txt
X = -9.25 m
X = +9.25 m
```

Nên tạo:

```txt
ROAD_EDGE_LEFT
ROAD_EDGE_RIGHT
```

Không tự giả định kiểu sơn của biên nếu bản CAD đầy đủ chưa xác nhận.

---

# 5. Chiều dài Road

Ảnh crop hiện tại **không cho phép xác nhận chiều dài toàn bộ object road**.

Có nhìn thấy một kích thước dọc:

```txt
24.03
```

ở phía trái phần trên ảnh.

Tuy nhiên:

```txt
24.03 m chỉ được xem là kích thước của một đoạn CAD cục bộ,
KHÔNG được tự động coi là totalRoadLength.
```

Vì vậy:

```ts
roadLengthM = REQUIRED_INPUT;
```

Agent phải nhận chiều dài từ:

```txt
- bản CAD/PDF đầy đủ;
- layout config của sân;
- hoặc tọa độ start/end đã xác minh.
```

---

# 6. Object model đề xuất

```txt
Road_6A_MainStraight
│
├── Surface
│
├── LaneRegions
│   ├── Lane_01
│   ├── Lane_02
│   ├── Lane_03
│   ├── Lane_04
│   └── Lane_05
│
├── Markings
│   ├── DirectionDivider
│   ├── LaneLine_02_03
│   ├── LaneLine_03_04
│   ├── LaneLine_04_05
│   ├── LaneArrows
│   └── OptionalTurnArrows
│
├── RoadEdges
│   ├── LeftEdge
│   └── RightEdge
│
├── Colliders
│   ├── RoadCollider
│   └── LaneBoundarySensors
│
├── Navigation
│   ├── LanePath_01
│   ├── LanePath_02
│   ├── LanePath_03
│   ├── LanePath_04
│   └── LanePath_05
│
└── Debug
    ├── LaneCenters
    ├── LaneWidths
    └── CADMarker_6A
```

---

# 7. Không gộp marker 6A vào geometry Road

Trong ảnh có vòng tròn:

```txt
6A
```

Marker này là:

```txt
CAD / route annotation
```

Không phải:

```txt
- lane;
- road marking;
- physical object trên sân;
- collider;
- vạch sơn.
```

Trong production:

```txt
không render 6A xuống mặt sân
```

trừ khi game có debug mode.

Object debug:

```txt
DEBUG_MARKER_6A
```

---

# 8. Label “HẠNG D” và các label hạng xe

Trong crop có chữ:

```txt
HẠNG D
```

và phần label hạng xe khác ở phía phải.

Các text này là annotation CAD.

Không tạo chúng thành texture trên mặt đường nếu sân thực tế không có sơn chữ tương ứng.

Đề xuất:

```txt
cadMetadata.vehicleClassLabels
```

---

# 9. Lane config chuẩn

```ts
type LaneDirection = 'FORWARD_Z' | 'BACKWARD_Z';

interface RoadLaneConfig {
  id: string;

  index: number;

  widthM: number;

  centerX: number;

  direction: LaneDirection;
}
```

Config:

```ts
export const ROAD_6A_LANES: RoadLaneConfig[] = [
  {
    id: 'LANE_01',
    index: 0,
    widthM: 3.7,
    centerX: -7.4,
    direction: 'BACKWARD_Z'
  },
  {
    id: 'LANE_02',
    index: 1,
    widthM: 3.7,
    centerX: -3.7,
    direction: 'FORWARD_Z'
  },
  {
    id: 'LANE_03',
    index: 2,
    widthM: 3.7,
    centerX: 0,
    direction: 'FORWARD_Z'
  },
  {
    id: 'LANE_04',
    index: 3,
    widthM: 3.7,
    centerX: 3.7,
    direction: 'FORWARD_Z'
  },
  {
    id: 'LANE_05',
    index: 4,
    widthM: 3.7,
    centerX: 7.4,
    direction: 'FORWARD_Z'
  }
];
```

---

# 10. Road config tối ưu cho Cursor/Codex CLI

```ts
export interface MultiLaneRoadConfig {
  id: string;

  widthM: number;
  lengthM: number;

  laneWidthM: number;
  laneCount: number;

  lanes: RoadLaneConfig[];

  divider: {
    betweenLaneIndex: [number, number];
    type: 'SOLID';
    x: number;
  };

  dashedSeparators: Array<{
    betweenLaneIndex: [number, number];
    x: number;
  }>;

  origin: {
    x: number;
    y: number;
    z: number;
  };

  rotationY: number;
}
```

Cấu hình:

```ts
export const ROAD_6A_CONFIG: MultiLaneRoadConfig = {
  id: 'ROAD_6A_MAIN_STRAIGHT',

  widthM: 18.5,

  // MUST come from full layout/CAD.
  lengthM: ROAD_LENGTH_REQUIRED_INPUT,

  laneWidthM: 3.7,
  laneCount: 5,

  lanes: ROAD_6A_LANES,

  divider: {
    betweenLaneIndex: [0, 1],
    type: 'SOLID',
    x: -5.55
  },

  dashedSeparators: [
    {
      betweenLaneIndex: [1, 2],
      x: -1.85
    },
    {
      betweenLaneIndex: [2, 3],
      x: 1.85
    },
    {
      betweenLaneIndex: [3, 4],
      x: 5.55
    }
  ],

  origin: {
    x: 0,
    y: 0,
    z: 0
  },

  rotationY: 0
};
```

---

# 11. Cách dựng RoadSurface

Không cần tạo 5 mesh mặt đường riêng nếu material giống nhau.

Có thể dùng:

```ts
new THREE.PlaneGeometry(
  roadWidth,
  roadLength
);
```

Sau đó:

```ts
road.rotation.x = -Math.PI / 2;
```

Hoặc tạo `BufferGeometry` nếu road cần tích hợp với các connector khác.

Road surface phải là:

```txt
một mặt liên tục
```

còn lane là:

```txt
logic + markings
```

---

# 12. Road collider

Collider nên đơn giản:

```txt
ROAD_COLLIDER
```

Kích thước:

```txt
width  = 18.50 m
length = roadLengthM
```

Không dùng toàn bộ decal/vạch lane làm collider vật lý.

---

# 13. LaneRegions

Mỗi lane nên có một vùng logic độc lập:

```txt
LANE_REGION_01
...
LANE_REGION_05
```

Kích thước mỗi vùng:

```txt
width = 3.70 m
```

Dùng để:

```txt
- xác định xe đang ở làn nào;
- phát hiện đi sai hướng;
- hỗ trợ AI;
- navigation;
- debug;
- route validation.
```

---

# 14. Kiểm tra xe đi đúng chiều

```ts
function isDrivingCorrectDirection(
  vehicleForward: THREE.Vector3,
  laneDirection: THREE.Vector3
) {
  return vehicleForward.dot(laneDirection) > 0;
}
```

Lane direction:

```txt
LANE_01 → -Z
LANE_02 → +Z
LANE_03 → +Z
LANE_04 → +Z
LANE_05 → +Z
```

---

# 15. Lane centerline

Mỗi lane có centerline riêng.

Ví dụ:

```ts
Lane_03.centerline = new THREE.Line3(
  new THREE.Vector3(0, 0, -roadLength / 2),
  new THREE.Vector3(0, 0, +roadLength / 2)
);
```

Lane 01 vẫn dùng cùng geometry centerline nhưng direction ngược:

```txt
+Z → -Z
```

---

# 16. Lane arrows

Trong CAD có các mũi tên cyan chỉ hướng.

Tạo decal/object:

```txt
ARROW_STRAIGHT_FORWARD
ARROW_STRAIGHT_BACKWARD
```

Tuy nhiên:

```txt
khoảng cách giữa các arrow
không được suy đoán thành kích thước pháp lý.
```

Nên để:

```ts
arrowSpacingM = VISUAL_CONFIG;
```

Mục đích:

```txt
visual reference
```

không phải sensor.

---

# 17. Vạch đứt

Ảnh cho thấy:

```txt
lane 2/3
lane 3/4
lane 4/5
```

được chia bằng vạch đứt.

Do crop không cho kích thước dash/gap cụ thể:

```txt
dashLengthM = VISUAL_CONFIG
gapLengthM  = VISUAL_CONFIG
lineWidthM  = VISUAL_CONFIG
```

Không hardcode như quy chuẩn pháp lý.

---

# 18. Vạch liền phân hai chiều

Giữa:

```txt
LANE_01
và
LANE_02
```

là separator liền.

Object:

```txt
ROAD_6A_DIRECTION_DIVIDER
```

Vị trí:

```txt
X = -5.55 m
```

Không cho AI tự đổi thành dashed line.

---

# 19. Các nhánh cong bên phải

Ảnh crop có các geometry kết nối bên phải với các bán kính:

```txt
R2
R4
R2.5
```

và các đoạn cong vào đảo cỏ.

Các chi tiết này:

```txt
KHÔNG thuộc core straight road object.
```

Nên dựng riêng:

```txt
RoadConnector_Right_*
```

Mỗi connector phải lấy bán kính từ CAD đầy đủ.

Không bóp méo `Road_6A_MainStraight` để tạo các nhánh này.

---

# 20. Vùng hatch cyan phía trên

Phía trên-trái crop có vùng hatch cyan tam giác/xiên.

Không đủ dữ liệu trong crop để khẳng định đây là:

```txt
- đảo phân luồng;
- vùng cấm xe;
- vạch kênh hóa;
- hoặc marking khác.
```

Do đó:

```txt
HATCHED_ZONE_TOP = NEEDS_CAD_CONTEXT
```

Không đưa vào core Road cho đến khi đối chiếu bản vẽ đầy đủ.

---

# 21. Kích thước đứng 24.03

Có annotation:

```txt
24.03
```

ở phía trái phần trên.

Agent phải ghi:

```txt
LOCAL_CAD_DIMENSION = 24.03 m
```

nhưng:

```txt
DO NOT USE AS TOTAL ROAD LENGTH
```

nếu chưa xác định hai endpoint của dimension trên CAD đầy đủ.

---

# 22. Material đề xuất

Visual không phải quy chuẩn pháp lý.

```ts
const roadMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.9,
  metalness: 0.0
});
```

Markings:

```txt
cyan trong CAD chỉ là màu layer CAD
```

Game thực tế không nhất thiết phải dùng cyan.

Nếu mục tiêu là tái hiện CAD debug:

```txt
CAD_DEBUG_MODE
→ có thể dùng cyan.
```

Nếu production:

```txt
→ dùng màu sơn đường thực tế.
```

---

# 23. Scene hierarchy tối ưu

```txt
Road_6A_MainStraight
│
├── Visual
│   ├── RoadSurface
│   ├── DirectionDivider
│   ├── DashedLaneLine_23
│   ├── DashedLaneLine_34
│   ├── DashedLaneLine_45
│   └── DirectionArrows
│
├── Logic
│   ├── LaneRegion_01
│   ├── LaneRegion_02
│   ├── LaneRegion_03
│   ├── LaneRegion_04
│   ├── LaneRegion_05
│   └── WrongWaySensors
│
├── Collision
│   └── RoadCollider
│
├── Navigation
│   ├── Path_01
│   ├── Path_02
│   ├── Path_03
│   ├── Path_04
│   └── Path_05
│
└── Debug
    ├── Marker_6A
    ├── WidthDimensions
    ├── CenterLines
    └── DirectionVectors
```

---

# 24. Build algorithm

Agent triển khai theo thứ tự:

```txt
1. Read config.
2. Validate laneCount == 5.
3. Validate laneWidth == 3.7.
4. Calculate roadWidth == 18.5.
5. Create road surface.
6. Create lane regions.
7. Create solid direction divider.
8. Create 3 dashed lane separators.
9. Create lane centerlines.
10. Create direction arrows.
11. Create road collider.
12. Create navigation paths.
13. Add debug CAD marker 6A only in debug mode.
14. Leave right-side connectors as separate modules.
```

---

# 25. Validation bắt buộc

```ts
function validateRoad6A(config: MultiLaneRoadConfig) {
  if (config.laneCount !== 5) {
    throw new Error('Road 6A must have 5 lanes');
  }

  if (config.laneWidthM !== 3.7) {
    throw new Error('Each lane must be 3.70 m');
  }

  if (config.widthM !== 18.5) {
    throw new Error('Road width must be 18.50 m');
  }

  if (config.lanes[0].direction !== 'BACKWARD_Z') {
    throw new Error('Lane 01 direction is incorrect');
  }

  for (let i = 1; i < 5; i++) {
    if (config.lanes[i].direction !== 'FORWARD_Z') {
      throw new Error(`Lane ${i + 1} direction is incorrect`);
    }
  }
}
```

---

# 26. Hard constraints

Agent phải xem các giá trị sau là cố định theo crop CAD hiện tại:

```txt
laneCount = 5

laneWidth = 3.70 m

roadWidth = 18.50 m

lane directions:
01 = -Z
02 = +Z
03 = +Z
04 = +Z
05 = +Z

separator 01/02 = solid

separator 02/03 = dashed
separator 03/04 = dashed
separator 04/05 = dashed
```

---

# 27. REQUIRED_INPUT / chưa được phép đoán

```txt
roadLengthM

dashLengthM
dashGapM
paintLineWidthM

exact arrow spacing

exact connection geometry at road top

exact connection geometry at road right

meaning/extent of cyan hatched top zone

whether outer road edges use painted line or only curb/geometry
```

---

# 28. Những điều Agent không được làm

```txt
DO NOT:
- coi 24.03 m là tổng chiều dài road;
- biến 5 làn thành 4 làn;
- đổi lane width khỏi 3.70 m;
- cho tất cả 5 làn cùng chiều;
- dùng dashed divider giữa lane 1 và lane 2;
- merge marker 6A vào road texture;
- dùng chữ HẠNG D làm road marking production;
- tự dựng nhánh R2/R4/R2.5 vào core road nếu chưa có full CAD;
- scale road để vừa scene.
```

---

# 29. Interface hoàn chỉnh đề xuất

```ts
export interface HiepPhatStraightRoad {
  id: string;

  lengthM: number;
  widthM: 18.5;

  laneWidthM: 3.7;
  laneCount: 5;

  lanes: [
    RoadLaneConfig,
    RoadLaneConfig,
    RoadLaneConfig,
    RoadLaneConfig,
    RoadLaneConfig
  ];

  directionDividerX: -5.55;

  dashedLineX: [
    -1.85,
    1.85,
    5.55
  ];

  metadata: {
    cadMarker?: '6A';
    localDimension24_03M?: true;
    source: 'CAD_CROP';
  };
}
```

---

# 30. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Build the multi-lane straight road shown in
road_6A_object_spec.md using Three.js + TypeScript.

HARD CONSTRAINTS:
- 1 unit = 1 meter.
- 5 lanes.
- Every lane width = 3.70 m.
- Total road width = 18.50 m.
- Road centered at X = 0.
- Lane centers:
  -7.40, -3.70, 0, +3.70, +7.40.
- Lane 01 direction = -Z.
- Lane 02..05 direction = +Z.
- Divider between lane 01/02 is SOLID at X=-5.55.
- Separators at X=-1.85, +1.85, +5.55 are DASHED.
- roadLengthM must come from config; do not infer it from the 24.03 CAD annotation.
- Marker 6A is debug metadata only.
- Do not implement the R2/R4 side connectors in this core object.

IMPLEMENT:
1. Road surface mesh.
2. Five logical lane regions.
3. One solid direction divider.
4. Three dashed lane separators.
5. Per-lane centerline/navigation path.
6. Direction arrows based on lane direction.
7. Simple road collider.
8. Debug mode with lane IDs, widths and marker 6A.
9. Validation function.
10. Keep visual markings separate from logic/sensors.

DO NOT:
- invent missing CAD dimensions;
- scale the road;
- change lane direction;
- hardcode visual dash/gap values as regulatory dimensions.

OUTPUT:
- Road6A.ts
- Road6AConfig.ts
- Road6AValidator.ts
```

---

# 31. Kết luận

Object trong crop CAD nên được hiểu là:

```txt
MỘT TRỤC ĐƯỜNG THẲNG 5 LÀN
TỔNG RỘNG 18.50 M
```

với cấu hình giao thông chính:

```txt
1 làn ngược chiều
+
4 làn cùng chiều
```

Cấu trúc hình học chính phải được sinh parametric từ:

```txt
laneWidth = 3.70 m
laneCount = 5
roadLength = input từ layout CAD
```

Các nhánh cong, đảo cỏ và vùng hatch xung quanh phải là object riêng, không được nhét vào core road object này nếu chưa có đầy đủ thông số CAD.
