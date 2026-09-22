# ROAD SPEC — ĐOẠN ĐƯỜNG THẲNG DÙNG CHUNG, RỘNG 9.55 m
## Đặc tả reusable Road object theo bản vẽ CAD sân sát hạch Hiệp Phát
### Tối ưu cho Cursor / Codex CLI / Agent / Three.js

> **Nguồn:** ảnh crop CAD do người dùng cung cấp.
>
> **Mục tiêu:** dựng đúng object đoạn đường thẳng hạng C nằm giữa hai dải cỏ/đảo biên.
>
> **Đơn vị:** mét.
>
> **Nguyên tắc:** số đo nhìn rõ trên CAD là hard constraint. Phần không có số đo rõ phải để `REQUIRED_INPUT`, không suy từ pixel.

---

# 0. Agent summary

Object trong ảnh được hiểu là:

```txt
GRASS / NON-DRIVABLE
────────────────────────────────────

          ROAD HẠNG C
          width = 9.55 m

────────────────────────────────────
GRASS / NON-DRIVABLE
```

Đặc điểm chính:

```txt
- road chạy thẳng theo phương ngang của bản vẽ;
- bề rộng road thể hiện trên CAD = 9.55 m;
- phía trên và phía dưới là vùng cỏ / non-drivable;
- mép road được xác định bởi physical edge màu đen;
- đầu phải của các đảo/cỏ có các đoạn bo tròn nối sang module khác;
- không có lane marking rõ trong crop này;
- chữ HẠNG C và biển P là annotation/object phụ, không bake vào core road.
```

---

# 0.1. Nguyên tắc reusable

Object này là **Road primitive dùng chung cho nhiều hạng xe**.

Không hardcode:

```txt
vehicleClass
HẠNG B
HẠNG C
HẠNG D
HẠNG E
```

vào geometry.

Một road instance chỉ nhận:

```txt
widthM
lengthM
x
z
rotationY
optional edge radii
optional debug label
```

Việc road này được dùng cho hạng nào là trách nhiệm của:

```txt
yard layout / placement config
```

không phải core road object.

---

# 1. Tên object

```txt
ROAD_STRAIGHT_9_55
```

Tên file/code đề xuất:

```txt
RoadStraight955
```

---

# 2. Kích thước hard constraint

Bản vẽ thể hiện rõ dimension vuông góc với trục road:

```txt
9.55 m
```

Do đó:

```ts
const ROAD_WIDTH_M = 9.55;
```

Agent không được:

```txt
- đổi road width;
- scale road để vừa scene;
- dùng pixel để tính lại width.
```

---

# 3. Chiều dài road

Crop có đường dimension theo phương ngang nhưng phần số không nằm đầy đủ trong ảnh.

Do đó:

```txt
roadLengthM = REQUIRED_INPUT
```

Không suy đoán từ:

```txt
- chiều rộng ảnh;
- pixel;
- chiều dài dải cỏ;
- label HẠNG C.
```

---

# 4. Hệ tọa độ local

Dựng road theo local space:

```txt
+X = dọc theo road
+Z = ngang road
+Y = hướng lên
```

Road center:

```txt
Z = 0
```

Hai mép:

```txt
top/left transverse edge  = -9.55 / 2
bottom/right transverse edge = +9.55 / 2
```

Tức:

```txt
Z = -4.775 m
Z = +4.775 m
```

Nếu convention project dùng road dọc theo +Z, chỉ xoay parent bằng `rotationY`.

---

# 5. Road surface

Core surface là một rectangle:

```txt
length = roadLengthM
width  = 9.55 m
```

Three.js:

```ts
const geometry = new THREE.PlaneGeometry(
  roadLengthM,
  9.55
);

geometry.rotateX(-Math.PI / 2);
```

Dùng asphalt material:

```txt
dark asphalt / charcoal
```

Không dùng nền trắng của CAD làm màu road.

---

# 6. Physical road edges

Hai đường đen chạy dọc theo road được hiểu là:

```txt
PHYSICAL_ROAD_EDGE
```

Tạo:

```txt
ROAD_EDGE_TOP
ROAD_EDGE_BOTTOM
```

hoặc theo local coordinate:

```txt
ROAD_EDGE_NEG_Z
ROAD_EDGE_POS_Z
```

Các edge này tách riêng khỏi road surface.

---

# 7. Grass / non-drivable zones

Vùng hatch xanh phía trên và dưới là:

```txt
NON_DRIVABLE_GRASS
```

Tạo riêng:

```txt
GrassZoneTop
GrassZoneBottom
```

Không merge vào asphalt.

Nếu game cần collision:

```txt
GrassColliderTop
GrassColliderBottom
```

---

# 8. Đầu bo phía phải

Ở phía phải crop, cả dải cỏ phía trên và phía dưới đều có đoạn bo cong.

Đây là geometry local của:

```txt
road connector / island end
```

Không đủ số đo radius trong crop hiện tại để hardcode.

Do đó:

```txt
topRightRadiusM = REQUIRED_FROM_CAD
bottomRightRadiusM = REQUIRED_FROM_CAD
```

Không lấy radius bằng pixel.

---

# 9. Không tự tạo lane marking

Crop này không cho thấy rõ:

```txt
- center line;
- dashed lane line;
- yellow divider;
- direction arrow.
```

Do đó core object này **không tự thêm lane marking**.

Nếu road layout đầy đủ có marking, cung cấp chúng bằng config/module khác.

---

# 10. Label HẠNG C

Text cyan như:

```txt
HẠNG B
HẠNG C
HẠNG D
...
```

chỉ là **CAD annotation / nhãn khu vực** tại từng vị trí sử dụng road.

Core road object **không thuộc riêng một hạng xe nào**.

Không bake các nhãn hạng xe vào asphalt.

Metadata core nên là:

```ts
metadata.usage = 'SHARED_MULTI_CLASS';
```

Nếu cần hiển thị nhãn theo từng placement, truyền từ layout:

```ts
placementLabel?: string;
```

và chỉ render trong debug/CAD mode.

---

# 11. Biển P

Biển `P` ở vùng cỏ phía dưới là object phụ:

```txt
PARKING_SIGN
```

Không thuộc core road.

Nếu cần render:

```txt
scene.add(createParkingSign(...))
```

nhưng không để làm child bắt buộc của `RoadStraight955`.

---

# 12. Scene graph đề xuất

```txt
RoadStraight955
│
├── Surface
│   └── AsphaltRoad
│
├── Edges
│   ├── RoadEdge_NegZ
│   └── RoadEdge_PosZ
│
├── Surroundings
│   ├── GrassZone_NegZ
│   └── GrassZone_PosZ
│
├── Logic
│   └── DrivableRoadZone
│
└── Debug
    ├── WidthDimension_9_55
    ├── RoadCenterline
    └── Label_HANG_C
```

---

# 13. Drivable zone

Tạo một logical zone:

```txt
DRIVABLE_ROAD_ZONE
```

Dimension:

```txt
length = roadLengthM
width  = 9.55 m
```

Dùng cho:

```txt
- vehicle road membership;
- route validation;
- off-road detection;
- debug.
```

---

# 14. Parametric config

```ts
export interface RoadStraight955Config {
  id: string;

  widthM: number;
  lengthM: number;

  placementLabel?: string;

  placement: {
    x: number;
    y: number;
    z: number;
    rotationY: number;
  };

  edge?: {
    topRightRadiusM?: number;
    bottomRightRadiusM?: number;
  };

  showCadDebug?: boolean;
}
```

---

# 15. Config mẫu

```ts
export const ROAD_STRAIGHT_955_EXAMPLE = {
  id: 'ROAD_STRAIGHT_9_55_EXAMPLE',

  widthM: 9.55,

  lengthM: null, // REQUIRED_INPUT

  placement: {
    x: 0,
    y: 0,
    z: 0,
    rotationY: 0
  },

  edge: {
    topRightRadiusM: null,
    bottomRightRadiusM: null
  }
} as const;
```

---

# 16. Derived dimensions

```ts
export function deriveRoadClassC955(
  lengthM: number
) {
  const widthM = 9.55;

  return {
    widthM,
    lengthM,

    halfWidthM: 4.775,

    edgeNegZ: -4.775,
    edgePosZ: +4.775
  };
}
```

---

# 17. Placement

Build local geometry trước.

Sau đó:

```ts
group.position.set(
  x,
  0,
  z
);

group.rotation.y =
  rotationY;
```

Không dùng:

```ts
group.scale.x
group.scale.z
```

để hiệu chỉnh kích thước.

---

# 18. Validation

```ts
function validateRoadClassC955(
  config: RoadStraight955Config
) {
  const EPS = 0.001;

  if (config.widthM <= 0) {
    throw new Error(
      'widthM must be > 0'
    );
  }

  if (
    config.lengthM <= 0
  ) {
    throw new Error(
      'lengthM must be > 0'
    );
  }
}
```

---

# 19. Acceptance tests

```txt
TEST_01
Road width = 9.55 m.

TEST_02
Half width = 4.775 m.

TEST_03
Road edges are parallel.

TEST_04
Road surface is continuous.

TEST_05
Grass is outside the drivable zone.

TEST_06
HẠNG C label is debug metadata only.

TEST_07
P sign is not part of core road geometry.

TEST_08
No lane markings are invented from this crop.

TEST_09
rotationY rotates the entire module without changing width.

TEST_10
No scale transform changes 9.55 m.
```

---

# 20. Hard constraints

```txt
roadWidthM = 9.55

road shape = straight corridor

top/bottom grass
= non-drivable

black boundary
= physical road edge
```

---

# 21. REQUIRED_INPUT

```txt
roadLengthM

topRightRadiusM
bottomRightRadiusM

grass extents

exact x
exact z
rotationY
```

Không lấy từ pixel.

---

# 22. Không được làm

```txt
DO NOT:

- đổi width 9.55;
- dùng 9.156 thay 9.55 cho object crop này;
- suy road length từ pixel;
- tự thêm vạch phân làn;
- tự thêm vạch vàng;
- bake chữ HẠNG C vào road;
- bake biển P vào core road;
- merge grass vào asphalt;
- scale object để vừa layout.
```

---

# 23. API đề xuất

```ts
interface CreateRoadStraight955Options {
  x: number;
  z: number;

  widthM: number;
  lengthM: number;

  rotationY: number;

  placementLabel?: string;

  showDebug?: boolean;
}

export function createRoadStraight955(
  options: CreateRoadStraight955Options
): THREE.Group;
```

---

# 24. File structure đề xuất

```txt
src/
└── roads/
    └── class-c-straight-955/
        ├── RoadStraight955.ts
        ├── RoadStraight955Config.ts
        ├── RoadStraight955Geometry.ts
        ├── RoadStraight955Validator.ts
        └── RoadStraight955Debug.ts
```

---

# 25. Prompt tối ưu cho Cursor / Codex CLI

```txt
TASK:
Implement the reusable straight road segment described in
road_straight_9_55_reusable_spec.md using Three.js + TypeScript.

UNITS:
1 unit = 1 meter.

REFERENCE INSTANCE DIMENSION:
widthM = 9.55

CORE RULE:
- widthM must be a parameter.
- The object must be reusable for different road widths and vehicle classes.
- Do not hardcode vehicle class into geometry.

LOCAL COORDINATES:
+X = along road
+Z = road transverse direction
+Y = up

Road centered at Z=0.

For the 9.55 m instance:
Z = -4.775
Z = +4.775

Generic formula:
edgeNegZ = -widthM / 2
edgePosZ = +widthM / 2

LENGTH:
roadLengthM comes from config.
Do not infer it from screenshot pixels.

BUILD:
1. Continuous dark asphalt RoadSurface.
2. Two parallel physical road edges.
3. DrivableRoadZone.
4. Grass/non-drivable zones outside the road.
5. Optional right-side local curved connectors only when radius values are provided.
6. Debug dimension 9.55.

IMPORTANT:
- Do not invent lane markings.
- Do not bake HẠNG C into asphalt.
- Do not bake the P parking sign into the core road.
- Do not scale the road.
- Right-side radii remain configurable until verified from full CAD.

PLACEMENT:
group.position.set(x, 0, z);
group.rotation.y = rotationY;

OUTPUT:
- RoadStraight955.ts
- RoadStraight955Config.ts
- RoadStraight955Geometry.ts
- RoadStraight955Validator.ts
- RoadStraight955Debug.ts
```

---

# 25.1. Ví dụ tái sử dụng cho nhiều hạng

```ts
const roadForB = createRoadStraight955({
  x: 0,
  z: 0,
  widthM: 9.55,
  lengthM: 30,
  rotationY: 0,
  placementLabel: 'HẠNG B'
});

const roadForC = createRoadStraight955({
  x: 50,
  z: 0,
  widthM: 9.55,
  lengthM: 40,
  rotationY: Math.PI / 2,
  placementLabel: 'HẠNG C'
});
```

Hai instance dùng cùng một core object.

Khác nhau chỉ ở:

```txt
placement
dimension config
optional debug label
```

---

# 26. Kết luận

Agent phải hiểu object này là:

```txt
REUSABLE STRAIGHT ROAD OBJECT
```

Trong ảnh hiện tại instance có:

```txt
width = 9.55 m
```

nhưng core geometry không thuộc riêng hạng xe nào.

với:

```txt
roadWidth = 9.55 m
halfWidth = 4.775 m
```

Hai vùng hatch xanh nằm ngoài road là non-drivable grass.

Các đoạn bo ở phía phải là connector/edge local và chỉ được dựng khi có radius CAD đầy đủ.

Geometry phải 1:1 theo mét, không trace screenshot và không scale.
