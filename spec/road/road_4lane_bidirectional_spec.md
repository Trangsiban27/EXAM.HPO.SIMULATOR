# ROAD SPEC — TRỤC ĐƯỜNG 4 LÀN HAI CHIỀU
## Đặc tả Road object từ bản vẽ CAD sân sát hạch Hiệp Phát
### Tối ưu cho Cursor / Codex CLI / Agent

> **Nguồn:** ảnh crop CAD người dùng cung cấp.
>
> **Mục tiêu:** dựng đúng một trục đường thẳng 4 làn, gồm **2 làn đi xuống** và **2 làn đi lên**.
>
> **Quy tắc bắt buộc do người dùng xác nhận:**
>
> ```txt
> - Tổng cộng 4 làn.
> - 2 làn bên trái đi xuống.
> - 2 làn bên phải đi lên.
> - Vạch giữa 2 làn cùng chiều bên trái = trắng đứt.
> - Vạch giữa 2 làn cùng chiều bên phải = trắng đứt.
> - Vạch phân chia hai chiều = vàng liền.
> ```
>
> Các kích thước không đọc chắc chắn từ crop phải để `REQUIRED_INPUT`, không đoán theo pixel.

---

# 0. Agent summary

```txt
             PHÍA TRÊN / +Z

        ↓            ↓      ↑            ↑
     LANE_01      LANE_02  LANE_03      LANE_04

        |  - - -  |  ━━━  |  - - -  |
           WHITE    YELLOW    WHITE
           DASHED    SOLID     DASHED

             PHÍA DƯỚI / -Z
```

Hướng:

```txt
LANE_01 = -Z
LANE_02 = -Z
LANE_03 = +Z
LANE_04 = +Z
```

Vạch:

```txt
L1/L2 = WHITE_DASHED
L2/L3 = YELLOW_SOLID
L3/L4 = WHITE_DASHED
```

---

# 1. Hệ tọa độ

```txt
X = ngang road
Y = cao độ
Z = dọc road

+Z = lên phía trên bản vẽ
-Z = xuống phía dưới bản vẽ
```

```ts
const FORWARD_Z =
  new THREE.Vector3(0, 0, 1);

const BACKWARD_Z =
  new THREE.Vector3(0, 0, -1);
```

---

# 2. Số làn

Hard constraint:

```txt
laneCount = 4
```

Không được:

```txt
- thêm lane thứ 5;
- gộp còn 3 lane;
- cho cả 4 lane cùng chiều.
```

---

# 3. Hướng từng làn

```txt
LANE_01 = DOWN / -Z
LANE_02 = DOWN / -Z

LANE_03 = UP / +Z
LANE_04 = UP / +Z
```

```ts
export const ROAD_4LANE_DIRECTION = {
  LANE_01: 'BACKWARD_Z',
  LANE_02: 'BACKWARD_Z',
  LANE_03: 'FORWARD_Z',
  LANE_04: 'FORWARD_Z'
} as const;
```

---

# 4. Vạch phân làn

## 4.1 Giữa LANE_01 và LANE_02

Hai làn cùng chiều đi xuống:

```txt
WHITE_DASHED
```

Object:

```txt
MARKING_LANE_01_02_WHITE_DASHED
```

---

## 4.2 Giữa LANE_02 và LANE_03

Đây là ranh giới hai chiều giao thông ngược nhau:

```txt
YELLOW_SOLID
```

Object:

```txt
MARKING_DIRECTION_DIVIDER_YELLOW_SOLID
```

Đây là vạch trung tâm hai chiều.

Không được đổi thành:

```txt
WHITE
DASHED_YELLOW
```

---

## 4.3 Giữa LANE_03 và LANE_04

Hai làn cùng chiều đi lên:

```txt
WHITE_DASHED
```

Object:

```txt
MARKING_LANE_03_04_WHITE_DASHED
```

---

# 5. Mặt cắt ngang

```txt
LEFT EDGE

| L1 ↓ | - - - | L2 ↓ | ━━━━━ | L3 ↑ | - - - | L4 ↑ |

                    YELLOW SOLID

RIGHT EDGE
```

---

# 6. Lane width

Crop hiện tại không có dimension ngang đủ rõ để khóa chiều rộng lane.

Do đó:

```txt
laneWidthM = REQUIRED_INPUT
```

Nguồn:

```txt
- CAD/PDF đầy đủ;
- layout config;
- dimension đã xác minh.
```

Không đo pixel.

---

# 7. Road width

Nếu 4 lane bằng nhau:

```txt
roadWidthM = 4 × laneWidthM
```

```ts
const roadWidthM =
  laneWidthM * 4;
```

---

# 8. Road length

Không thấy đủ hai đầu road trong crop.

Do đó:

```txt
roadLengthM = REQUIRED_INPUT
```

Không được lấy các dimension dọc cạnh phải như:

```txt
6.61
7.9
```

làm tổng chiều dài road nếu chưa xác nhận endpoint.

---

# 9. Tọa độ lane theo X

Đặt road center tại:

```txt
X = 0
```

Gọi:

```txt
W = laneWidthM
```

Biên:

```txt
X0 = -2W
X1 = -W
X2 = 0
X3 = +W
X4 = +2W
```

Tâm lane:

```txt
LANE_01 = -1.5W
LANE_02 = -0.5W
LANE_03 = +0.5W
LANE_04 = +1.5W
```

Vị trí vạch:

```txt
X = -W  → WHITE_DASHED
X =  0  → YELLOW_SOLID
X = +W  → WHITE_DASHED
```

---

# 10. Công thức derive

```ts
const W = laneWidthM;

const ROAD_WIDTH = 4 * W;

const LANE_CENTERS = [
  -1.5 * W,
  -0.5 * W,
  +0.5 * W,
  +1.5 * W
];

const MARKING_X = {
  leftSameDirection: -W,
  centerDirectionDivider: 0,
  rightSameDirection: +W
};
```

---

# 11. Lane config

```ts
export interface RoadLaneConfig {
  id: string;
  index: number;
  centerX: number;
  widthM: number;

  direction:
    | 'FORWARD_Z'
    | 'BACKWARD_Z';
}
```

```ts
export function createLaneConfigs(
  laneWidthM: number
): RoadLaneConfig[] {
  return [
    {
      id: 'LANE_01',
      index: 0,
      centerX: -1.5 * laneWidthM,
      widthM: laneWidthM,
      direction: 'BACKWARD_Z'
    },
    {
      id: 'LANE_02',
      index: 1,
      centerX: -0.5 * laneWidthM,
      widthM: laneWidthM,
      direction: 'BACKWARD_Z'
    },
    {
      id: 'LANE_03',
      index: 2,
      centerX: +0.5 * laneWidthM,
      widthM: laneWidthM,
      direction: 'FORWARD_Z'
    },
    {
      id: 'LANE_04',
      index: 3,
      centerX: +1.5 * laneWidthM,
      widthM: laneWidthM,
      direction: 'FORWARD_Z'
    }
  ];
}
```

---

# 12. Marking config

```ts
export interface RoadMarkingConfig {
  id: string;
  x: number;

  type:
    | 'WHITE_DASHED'
    | 'YELLOW_SOLID';
}
```

```ts
export function createRoadMarkings(
  laneWidthM: number
): RoadMarkingConfig[] {
  return [
    {
      id: 'MARKING_L1_L2',
      x: -laneWidthM,
      type: 'WHITE_DASHED'
    },
    {
      id: 'MARKING_CENTER',
      x: 0,
      type: 'YELLOW_SOLID'
    },
    {
      id: 'MARKING_L3_L4',
      x: +laneWidthM,
      type: 'WHITE_DASHED'
    }
  ];
}
```

---

# 13. Màu marking

```txt
WHITE_DASHED = trắng
YELLOW_SOLID = vàng
```

Default:

```ts
const WHITE_MARKING = 0xffffff;
const YELLOW_MARKING = 0xffd700;
```

Màu có thể configurable, nhưng semantic không được đổi:

```txt
center divider luôn là YELLOW_SOLID.
```

---

# 14. Vạch trắng đứt

Thông số:

```txt
dashLengthM
dashGapM
lineWidthM
```

crop không thể hiện chắc chắn.

Do đó:

```txt
dashLengthM = VISUAL_CONFIG
dashGapM = VISUAL_CONFIG
lineWidthM = VISUAL_CONFIG
```

Không coi giá trị visual là dimension CAD.

---

# 15. Vạch vàng liền

Vạch phân hai chiều:

```txt
continuous line
không gap
```

Pseudo-code:

```ts
createSolidLine({
  x: 0,
  lengthM: roadLengthM,
  color: YELLOW_MARKING
});
```

---

# 16. Direction arrows

Theo bản vẽ:

```txt
LANE_01 ↓
LANE_02 ↓

LANE_03 ↑
LANE_04 ↑
```

Có thể dùng object reusable:

```txt
createRoadDirectionArrow(...)
```

nếu arrow base hướng +Z:

```ts
rotationYForward = 0;
rotationYBackward = Math.PI;
```

---

# 17. Arrow placement

Khoảng cách arrow trong crop không phải dimension xác minh.

Do đó:

```txt
arrowSpacingM = VISUAL_CONFIG
```

Nhưng hướng arrow là hard constraint.

---

# 18. Road surface

Road là một surface liên tục.

```ts
const geometry =
  new THREE.PlaneGeometry(
    roadWidthM,
    roadLengthM
  );

geometry.rotateX(-Math.PI / 2);
```

Không cần 4 asphalt meshes nếu material giống nhau.

---

# 19. Mặt đường

Dùng asphalt tối:

```txt
dark charcoal / black asphalt
```

Ví dụ:

```ts
const material =
  new THREE.MeshStandardMaterial({
    roughness: 0.9,
    metalness: 0
  });
```

---

# 20. Lane regions

Tạo logic region riêng:

```txt
LANE_REGION_01
LANE_REGION_02
LANE_REGION_03
LANE_REGION_04
```

Dùng cho:

```txt
- xác định xe đang ở lane nào;
- wrong-way detection;
- navigation;
- route validation;
- debug.
```

---

# 21. Navigation paths

```txt
PATH_LANE_01 → -Z
PATH_LANE_02 → -Z
PATH_LANE_03 → +Z
PATH_LANE_04 → +Z
```

Navigation path không phải lane marking.

---

# 22. Wrong-way detection

```ts
function isCorrectDirection(
  vehicleForward: THREE.Vector3,
  laneDirection: THREE.Vector3
) {
  return (
    vehicleForward
      .clone()
      .normalize()
      .dot(
        laneDirection
          .clone()
          .normalize()
      ) > 0
  );
}
```

Vectors:

```ts
const LANE_DIRECTION = {
  LANE_01: new THREE.Vector3(0, 0, -1),
  LANE_02: new THREE.Vector3(0, 0, -1),
  LANE_03: new THREE.Vector3(0, 0, 1),
  LANE_04: new THREE.Vector3(0, 0, 1)
};
```

---

# 23. Parking pockets bên phải

Bản vẽ có các pocket/lõm bên phải quanh marker:

```txt
13A
14A
```

Đây không phải core geometry của road 4 lane.

Tách riêng:

```txt
ParkingPocket_13A
ParkingPocket_14A
```

hoặc connector module.

Không merge pocket vào road surface chính nếu muốn tái sử dụng road object.

---

# 24. Marker 13A / 14A

Các vòng tròn:

```txt
13A
14A
```

là annotation/route marker.

Không render như sơn mặt đường trong production.

Chỉ dùng:

```txt
DEBUG_MARKER_13A
DEBUG_MARKER_14A
```

---

# 25. Label HẠNG B

Text:

```txt
HẠNG B
```

là CAD annotation.

Không tự đưa vào road texture production.

---

# 26. Scene hierarchy

```txt
Road_4Lane_Bidirectional
│
├── Visual
│   ├── RoadSurface
│   ├── WhiteDashed_L1_L2
│   ├── YellowSolid_Center
│   ├── WhiteDashed_L3_L4
│   └── DirectionArrows
│
├── Logic
│   ├── LaneRegion_01
│   ├── LaneRegion_02
│   ├── LaneRegion_03
│   ├── LaneRegion_04
│   └── WrongWaySensors
│
├── Navigation
│   ├── Path_Lane_01
│   ├── Path_Lane_02
│   ├── Path_Lane_03
│   └── Path_Lane_04
│
├── Collision
│   └── RoadCollider
│
└── Debug
    ├── LaneCenters
    ├── LaneDirections
    ├── Marker_13A
    └── Marker_14A
```

---

# 27. Main config

```ts
export interface FourLaneBidirectionalRoadConfig {
  id: string;

  laneWidthM: number;
  roadLengthM: number;

  origin: {
    x: number;
    y: number;
    z: number;
  };

  rotationY: number;

  dashedLine: {
    dashLengthM: number;
    gapLengthM: number;
    lineWidthM: number;
  };

  centerYellowLine: {
    lineWidthM: number;
  };
}
```

---

# 28. Derived dimensions

```ts
export function deriveRoadDimensions(
  config: FourLaneBidirectionalRoadConfig
) {
  const W = config.laneWidthM;

  return {
    roadWidthM: 4 * W,

    laneCentersX: [
      -1.5 * W,
      -0.5 * W,
      +0.5 * W,
      +1.5 * W
    ],

    whiteDashedLeftX: -W,
    yellowCenterX: 0,
    whiteDashedRightX: +W
  };
}
```

---

# 29. Rotation

Road được build local theo Z.

Sau đó đặt:

```ts
group.position.set(x, y, z);
group.rotation.y = rotationY;
```

Tất cả sub-object phải nằm dưới cùng parent:

```txt
RoadSurface
Markings
LaneRegions
Navigation
Arrows
```

để xoay đồng bộ.

---

# 30. Validation

```ts
function validateRoad(
  config: FourLaneBidirectionalRoadConfig
) {
  if (config.laneWidthM <= 0) {
    throw new Error(
      'laneWidthM must be > 0'
    );
  }

  if (config.roadLengthM <= 0) {
    throw new Error(
      'roadLengthM must be > 0'
    );
  }

  const lanes =
    createLaneConfigs(
      config.laneWidthM
    );

  if (
    lanes[0].direction !== 'BACKWARD_Z' ||
    lanes[1].direction !== 'BACKWARD_Z'
  ) {
    throw new Error(
      'Lane 01/02 must travel downward (-Z)'
    );
  }

  if (
    lanes[2].direction !== 'FORWARD_Z' ||
    lanes[3].direction !== 'FORWARD_Z'
  ) {
    throw new Error(
      'Lane 03/04 must travel upward (+Z)'
    );
  }
}
```

---

# 31. Acceptance tests

```txt
TEST_01
laneCount == 4

TEST_02
LANE_01 direction == -Z

TEST_03
LANE_02 direction == -Z

TEST_04
LANE_03 direction == +Z

TEST_05
LANE_04 direction == +Z

TEST_06
L1/L2 separator == WHITE_DASHED

TEST_07
L2/L3 separator == YELLOW_SOLID

TEST_08
L3/L4 separator == WHITE_DASHED

TEST_09
center yellow line is continuous.

TEST_10
white same-direction separators are dashed.

TEST_11
roadWidth == laneWidthM * 4

TEST_12
rotationY rotates all road components together.
```

---

# 32. Hard constraints

```txt
laneCount = 4

LANE_01 = DOWN / -Z
LANE_02 = DOWN / -Z

LANE_03 = UP / +Z
LANE_04 = UP / +Z

L1/L2 = WHITE_DASHED

L2/L3 = YELLOW_SOLID

L3/L4 = WHITE_DASHED
```

---

# 33. REQUIRED_INPUT

```txt
laneWidthM
roadLengthM

whiteDashLengthM
whiteDashGapM
whiteLineWidthM

yellowLineWidthM

arrowSpacingM

exact x
exact z
exact rotationY
```

Không suy đoán từ pixel.

---

# 34. Không được làm

```txt
DO NOT:

- cho 4 lane cùng chiều;
- dùng vạch trắng ở trung tâm hai chiều;
- dùng vạch vàng đứt ở trung tâm;
- đặt vạch trắng liền giữa các lane cùng chiều;
- merge parking pocket 13A/14A vào core road;
- render marker 13A/14A như road marking;
- đo laneWidth bằng pixel;
- dùng dimension dọc cạnh phải làm road width;
- scale road tùy ý để vừa scene.
```

---

# 35. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Implement the four-lane bidirectional road described in
road_4lane_bidirectional_spec.md using Three.js + TypeScript.

COORDINATE:
+Z = upward on CAD.
-Z = downward on CAD.
+X = right.

HARD TRAFFIC LAYOUT:
- Total 4 lanes.
- Lane 01 = -Z.
- Lane 02 = -Z.
- Lane 03 = +Z.
- Lane 04 = +Z.

MARKINGS:
- Between lane 01 and lane 02:
  WHITE DASHED.
- Between lane 02 and lane 03:
  YELLOW SOLID.
- Between lane 03 and lane 04:
  WHITE DASHED.

DIMENSIONS:
- laneWidthM comes from config.
- roadWidthM = laneWidthM * 4.
- roadLengthM comes from config.
- Do not infer dimensions from screenshot pixels.

CENTERING:
Road center X = 0.

If laneWidth = W:
lane centers:
-1.5W
-0.5W
+0.5W
+1.5W

marking X:
-W  = white dashed
0   = yellow solid
+W  = white dashed

BUILD:
1. One continuous asphalt RoadSurface.
2. Four LaneRegion logic zones.
3. Two white dashed lane separators.
4. One solid yellow bidirectional divider.
5. Direction arrows:
   lane 1/2 downward,
   lane 3/4 upward.
6. Four navigation centerlines.
7. Wrong-way detection.
8. Simple road collider.
9. Debug labels.

DO NOT:
- make all lanes same direction;
- use white center divider;
- use dashed yellow center divider;
- merge 13A/14A parking pockets into the core road.
```

---

# 36. Kết luận

Agent phải hiểu road này là:

```txt
4 LÀN HAI CHIỀU

↓  ↓  |  ↑  ↑
```

Semantic vạch:

```txt
↓  - - -  ↓
WHITE_DASHED

↓  ━━━━━  ↑
YELLOW_SOLID

↑  - - -  ↑
WHITE_DASHED
```

Đây là hard constraint của object Road và phải giữ nguyên sau mọi thao tác dịch chuyển hoặc `rotationY`.
