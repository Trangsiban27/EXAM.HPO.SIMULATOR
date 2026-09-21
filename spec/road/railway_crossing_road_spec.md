# RAILWAY CROSSING ROAD SPEC
## Đặc tả object đường bộ giao cắt đường sắt — sân sát hạch Hiệp Phát
### Phiên bản đã hiệu chỉnh hướng Stop Line và đường ray

> **Nguồn:** ảnh crop CAD người dùng cung cấp của cụm đường bộ giao với đường sắt.
>
> **Mục tiêu:** giúp Cursor / Codex CLI / Agent dựng đúng object Road + Railway Crossing trong Three.js, đặc biệt giữ đúng quan hệ hình học giữa hướng xe chạy, vạch dừng và đường ray.
>
> **Đơn vị:** mét.
>
> **Hiệu chỉnh quan trọng:** `STOP_LINE` và các thanh `RAIL` phải **song song với nhau** và **vuông góc với hướng xe chạy**.

---

# 0. Agent summary

Object được hiểu là một đoạn:

```txt
ROAD
+
RAILWAY CROSSING
+
STOP LINE
```

Quan hệ bắt buộc:

```txt
STOP_LINE ∥ RAIL_01 ∥ RAIL_02

STOP_LINE ⟂ ROAD_DIRECTION

RAIL_01 ⟂ ROAD_DIRECTION
RAIL_02 ⟂ ROAD_DIRECTION
```

Nếu quy ước xe chạy theo:

```txt
+Z
```

thì:

```txt
STOP_LINE chạy theo trục X
RAIL_01  chạy theo trục X
RAIL_02  chạy theo trục X
```

Không được xoay đường ray theo hướng dọc của road.

---

# 1. Topology đúng

Ví dụ nhìn từ trên xuống:

```txt
                     +Z
                      ↑
                      │
                      │
      RAIL_01  ─────────────────────
      RAIL_02  ─────────────────────
                      │
                      │  5.00 m
                      │
      STOP_LINE ────────────────────
                      │
                      │
                     CAR
```

Tức:

```txt
CAR
 ↓
STOP_LINE
 ↓ 5.00 m
APPROACH_SIDE_OUTER_RAIL
 ↓
RAILWAY CROSSING
 ↓
CONTINUE
```

---

# 2. Hướng xe chạy

Tạo vector chuẩn:

```ts
const roadDirection =
  new THREE.Vector3(0, 0, 1);
```

Với cấu hình này:

```txt
+Z = hướng xe chạy
```

Nếu scene thực tế xoay road:

```txt
rotationY
```

thì toàn bộ:

```txt
road
stop line
railway
sensor
```

phải được transform cùng module.

---

# 3. Hướng của Stop Line

Vạch dừng phải nằm ngang so với hướng xe chạy:

```txt
STOP_LINE ⟂ ROAD_DIRECTION
```

Nếu road theo +Z:

```ts
const stopLineDirection =
  new THREE.Vector3(1, 0, 0);
```

Validation:

```ts
Math.abs(
  roadDirection.dot(stopLineDirection)
) < EPS;
```

---

# 4. Hướng đường ray

Hai ray cũng phải nằm ngang với hướng xe:

```txt
RAIL_01 ⟂ ROAD_DIRECTION
RAIL_02 ⟂ ROAD_DIRECTION
```

và:

```txt
RAIL_01 ∥ STOP_LINE
RAIL_02 ∥ STOP_LINE
```

Nếu road theo +Z:

```ts
const railDirection =
  new THREE.Vector3(1, 0, 0);
```

---

# 5. Khoảng cách 5.00 m

Bản vẽ thể hiện:

```txt
5.00 m
```

giữa:

```txt
STOP_LINE
và
RAY NGOÀI CÙNG PHÍA XE TIẾP CẬN
```

Khoảng cách phải đo:

```txt
theo trục road direction
```

Không đo:

```txt
- theo đường chéo;
- theo Euclidean shortest distance nếu object bị xoay;
- từ tâm cụm đường ray;
- từ ray xa hơn.
```

Công thức:

```ts
const delta =
  outerApproachRailPoint
    .clone()
    .sub(stopLinePoint);

const distanceAlongRoad =
  Math.abs(
    delta.dot(roadDirection)
  );
```

Validation:

```ts
distanceAlongRoad === 5.0
```

trong tolerance kỹ thuật nhỏ.

---

# 6. Xác định ray ngoài cùng phía tiếp cận

Không hardcode:

```txt
Rail_01 luôn là outer rail
```

vì module có thể xoay/mirror.

Cần xác định theo hướng xe:

```ts
function getApproachSideOuterRail(
  rails: RailwayRail[],
  roadDirection: THREE.Vector3
) {
  // chọn rail nằm gần STOP_LINE / phía xe tiếp cận nhất
}
```

Khái niệm:

```txt
APPROACH_SIDE_OUTER_RAIL
```

là ray đầu tiên xe gặp sau khi vượt stop line.

---

# 7. Bề rộng Road

Trong crop có dimension:

```txt
4
```

nằm theo bề ngang road.

Tạm hiểu:

```txt
roadWidthM = 4.00
```

Config:

```ts
const ROAD_WIDTH_M = 4.0;
```

Nếu bản CAD đầy đủ xác nhận khác:

```txt
ưu tiên CAD gốc.
```

---

# 8. Center line / lane marking

Trong ảnh có đường cyan nét đứt chạy dọc road.

Đây là:

```txt
CENTER_MARKING
```

không phải:

```txt
- stop line;
- rail;
- sensor.
```

Nếu road theo +Z:

```txt
CENTER_MARKING
```

cũng chạy theo +Z.

---

# 9. Railway object structure

```txt
RailwayCrossing
│
├── Rail_01
├── Rail_02
└── Sleepers
    ├── Sleeper_001
    ├── Sleeper_002
    └── ...
```

Các sleeper phải:

```txt
vuông góc với ray
```

Nếu rail chạy theo X thì sleeper chạy theo Z.

---

# 10. Quan hệ hướng

Với:

```txt
roadDirection = +Z
```

thì:

```txt
STOP_LINE   → X
RAIL_01     → X
RAIL_02     → X
SLEEPERS    → Z
CENTER_LINE → Z
```

Tóm tắt:

```txt
Road direction     : +Z
Stop line          : X
Rails              : X
Sleepers           : Z
```

---

# 11. Scene graph đề xuất

```txt
RailwayCrossingRoad
│
├── RoadSurface
│
├── RoadMarkings
│   ├── CenterDashedLine
│   └── StopLine
│
├── Railway
│   ├── Rail_01
│   ├── Rail_02
│   └── Sleepers
│
├── Sensors
│   ├── ApproachSensor
│   ├── StopLineSensor
│   ├── OuterRailSensor
│   ├── RailwayEntrySensor
│   └── RailwayExitSensor
│
├── Collision
│   └── RoadCollider
│
└── Debug
    ├── RoadDirectionVector
    ├── StopLineDirectionVector
    ├── RailDirectionVector
    ├── Dimension_5m
    └── Dimension_4m
```

---

# 12. Stop Line geometry

Object:

```txt
EX_RAIL_STOP_LINE
```

Geometry:

```ts
interface StopLineConfig {
  center: THREE.Vector3;

  widthAcrossRoadM: number;

  direction: THREE.Vector3;
}
```

Với road rộng 4 m:

```txt
stopLine width ≈ road width
```

Không suy diễn line paint thickness nếu CAD chưa ghi.

---

# 13. Railway geometry

Mỗi rail:

```ts
interface RailConfig {
  center: THREE.Vector3;

  direction: THREE.Vector3;

  lengthM: number;
}
```

Rail phải kéo ngang hết corridor road và phần railway cần thiết.

Không giới hạn rail đúng bằng road width nếu bản CAD thể hiện kéo dài ra ngoài road.

---

# 14. Sleepers

Sleepers là các thanh ngang nằm giữa/dưới ray.

Quan hệ:

```txt
SLEEPER ⟂ RAIL
```

Không dùng sleeper direction = rail direction.

Spacing:

```txt
sleepersSpacingM = VISUAL_CONFIG
```

nếu crop không ghi kích thước.

---

# 15. Sensor bài thi

## Approach sensor

```txt
SENSOR_RAIL_APPROACH
```

Dùng để biết xe đang tiến tới cụm đường sắt.

## Stop line sensor

```txt
SENSOR_RAIL_STOP_LINE
```

Dùng để đánh giá dừng trước vạch.

## Outer rail sensor

```txt
SENSOR_APPROACH_OUTER_RAIL
```

Mốc kiểm tra đúng khoảng cách 5 m.

## Exit sensor

```txt
SENSOR_RAIL_EXIT
```

Bài/cụm hoàn thành khi xe qua railway crossing.

---

# 16. Không đo khoảng cách từ tâm xe

Nếu chấm vị trí dừng, Agent nên sử dụng:

```txt
FRONT_BUMPER_REFERENCE
```

không dùng:

```txt
VehicleRoot.position
```

Tương tự các bài dừng trước đó.

---

# 17. Config TypeScript đề xuất

```ts
export interface RailwayCrossingRoadConfig {
  id: string;

  road: {
    widthM: number;
    direction: THREE.Vector3;
  };

  stopLine: {
    direction: THREE.Vector3;
  };

  railway: {
    railDirection: THREE.Vector3;

    approachOuterRailDistanceFromStopLineM: number;
  };

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
export const RAILWAY_CROSSING_ROAD_CONFIG = {
  id: 'RAILWAY_CROSSING_ROAD',

  road: {
    widthM: 4.0,
    direction: new THREE.Vector3(0, 0, 1)
  },

  stopLine: {
    direction: new THREE.Vector3(1, 0, 0)
  },

  railway: {
    railDirection: new THREE.Vector3(1, 0, 0),

    approachOuterRailDistanceFromStopLineM: 5.0
  },

  placement: {
    x: 0,
    y: 0,
    z: 0,

    rotationY: 0
  }
};
```

---

# 18. Validation bắt buộc

```ts
const EPS = 1e-4;

function validateRailwayCrossing(
  config: RailwayCrossingRoadConfig
) {
  const roadDir =
    config.road.direction.clone().normalize();

  const stopDir =
    config.stopLine.direction.clone().normalize();

  const railDir =
    config.railway.railDirection.clone().normalize();

  // stop line phải vuông góc road
  if (
    Math.abs(
      roadDir.dot(stopDir)
    ) > EPS
  ) {
    throw new Error(
      'STOP_LINE must be perpendicular to road direction'
    );
  }

  // rail phải vuông góc road
  if (
    Math.abs(
      roadDir.dot(railDir)
    ) > EPS
  ) {
    throw new Error(
      'RAILS must be perpendicular to road direction'
    );
  }

  // rail và stop line phải song song
  if (
    Math.abs(
      Math.abs(stopDir.dot(railDir)) - 1
    ) > EPS
  ) {
    throw new Error(
      'STOP_LINE and RAILS must be parallel'
    );
  }

  if (
    Math.abs(
      config.railway
        .approachOuterRailDistanceFromStopLineM
      - 5.0
    ) > EPS
  ) {
    throw new Error(
      'STOP_LINE to approach outer rail must be 5.0 m'
    );
  }
}
```

---

# 19. Acceptance tests

```txt
TEST_01
roadDirection dot stopLineDirection == 0

TEST_02
roadDirection dot railDirection == 0

TEST_03
abs(stopLineDirection dot railDirection) == 1

TEST_04
distance along road:
STOP_LINE → APPROACH_SIDE_OUTER_RAIL = 5.00 m

TEST_05
stop line crosses road horizontally.

TEST_06
both rails cross road horizontally.

TEST_07
sleepers are perpendicular to rails.

TEST_08
road width = 4.00 m unless full CAD overrides.

TEST_09
center dashed marking runs along road direction.

TEST_10
module rotationY rotates all sub-objects together.
```

---

# 20. Không được làm

```txt
DO NOT:

- đặt rail song song hướng xe;
- đặt stop line song song hướng xe;
- đặt rail vuông góc stop line;
- đo 5 m theo đường chéo;
- đo 5 m từ tâm railway;
- hardcode Rail_01 luôn là approach rail;
- dùng tâm xe để kiểm tra dừng;
- xoay road nhưng quên xoay rail/stop line;
- coi sleeper là rail;
- merge center line với stop line.
```

---

# 21. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Implement the railway crossing road module from
railway_crossing_road_spec.md using Three.js + TypeScript.

COORDINATE CONVENTION:
- +Z = vehicle travel direction.
- +X = road transverse direction.
- +Y = up.

HARD GEOMETRY:
- Road width = 4.00 m.
- STOP_LINE is perpendicular to road direction.
- Both RAILS are perpendicular to road direction.
- STOP_LINE is parallel to both RAILS.
- STOP_LINE to approach-side outer rail = 5.00 m measured along road direction.

ORIENTATION:
roadDirection = +Z
stopLineDirection = +X
railDirection = +X
sleepersDirection = +Z

SCENE:
RailwayCrossingRoad
- RoadSurface
- CenterDashedLine
- StopLine
- Railway
  - Rail_01
  - Rail_02
  - Sleepers
- Sensors
  - Approach
  - StopLine
  - ApproachOuterRail
  - RailwayExit
- Debug

VALIDATE:
dot(roadDir, stopLineDir) == 0
dot(roadDir, railDir) == 0
abs(dot(stopLineDir, railDir)) == 1
distanceAlongRoad(stopLine, approachOuterRail) == 5.0

IMPORTANT:
- Stop line and rails are horizontal across the road relative to vehicle motion.
- Do NOT orient rails along the road.
- Apply module rotation as one parent transform.
```

---

# 22. Kết luận

Agent phải hiểu cụm này theo quan hệ hình học:

```txt
                 HƯỚNG XE
                    ↑
                    │

RAIL_01  ─────────────────────
RAIL_02  ─────────────────────
                    │
                    │ 5.00 m
                    │
STOP_LINE ────────────────────
                    │
                   CAR
```

Điểm cốt lõi:

```txt
STOP_LINE ∥ RAILS
STOP_LINE ⟂ ROAD_DIRECTION
RAILS ⟂ ROAD_DIRECTION
```

Đây là constraint bắt buộc, không phải lựa chọn visual.
