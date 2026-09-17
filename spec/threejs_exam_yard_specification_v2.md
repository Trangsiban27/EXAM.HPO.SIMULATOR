# SPECIFICATION — SÂN SÁT HẠCH SA HÌNH MÔ PHỎNG TRÊN THREE.JS

> Mục tiêu: chuyển nội dung tài liệu **“6. QUY TRÌNH LÀM BÀI SA HÌNH”** thành đặc tả kỹ thuật để AI agent/Codex có thể dựng đường thi sát hạch dạng 3D trong Three.js.
>
> Nguyên tắc: mọi kích thước, công thức và yêu cầu dưới đây chỉ lấy từ tài liệu nguồn. Những phần tài liệu không định nghĩa rõ được đánh dấu `REQUIRED_INPUT` thay vì tự suy đoán.

---

## 1. Phạm vi tài liệu nguồn

Tài liệu mô tả 11 nhóm hạng mục/bài sát hạch:

1. Xuất phát và kết thúc.
2. Dừng xe nhường đường cho người đi bộ.
3. Dừng và khởi hành xe trên dốc.
4. Qua vệt bánh xe và đường vòng vuông góc.
5. Ngã tư có đèn tín hiệu.
6. Qua đường vòng quanh co chữ S.
7. Ghép xe dọc vào nơi đỗ — hạng B, C1.
8. Ghép xe ngang vào nơi đỗ — hạng B.
9. Tạm dừng ở chỗ có đường sắt chạy qua.
10. Thay đổi số trên đường bằng.
11. Tình huống nguy hiểm.

Tài liệu này chủ yếu quy định **hình học sân, vạch, biển báo và bố trí bài thi**. Tài liệu **không cung cấp đầy đủ** quy tắc chấm điểm, thời gian tối đa của từng bài, tốc độ bắt buộc, mức trừ điểm hoặc điều kiện rớt.

Agent **không được tự bịa** các giá trị còn thiếu.

---

# 2. Quy ước kỹ thuật chung cho Three.js

## 2.1 Hệ trục và đơn vị

Dùng:

```txt
1 Three.js unit = 1 meter

X = trái / phải
Y = cao độ
Z = hướng tiến của xe
```

Khuyến nghị:

```js
THREE.Object3D.DEFAULT_UP.set(0, 1, 0);
```

Mặt đường cơ bản nằm tại:

```txt
Y = 0
```

Các vạch sơn nên nâng lên một khoảng rất nhỏ để tránh z-fighting. Đây là quy ước hiển thị, không phải kích thước pháp lý.

---

## 2.2 Quy tắc xử lý kích thước

Phân biệt 3 loại giá trị:

```txt
HARD_CONSTRAINT
    = giá trị số hoặc công thức có trong tài liệu.

DERIVED_VALUE
    = giá trị tính trực tiếp từ HARD_CONSTRAINT.

REQUIRED_INPUT
    = biến được tài liệu sử dụng nhưng tài liệu hiện tại không định nghĩa.
```

Ví dụ:

```txt
Dốc:
length = 15 m             // HARD_CONSTRAINT
grade = 10%               // HARD_CONSTRAINT
rise = 1.5 m              // DERIVED_VALUE: 15 × 0.10
```

Không được dùng `DERIVED_VALUE` để thay đổi ý nghĩa của quy chuẩn gốc.

---

# 3. Ý nghĩa các thông số hình học đầu vào

Các công thức sa hình sử dụng các thông số hình học của chính chiếc xe sát hạch. Agent phải hiểu đúng ý nghĩa của từng biến trước khi sinh geometry.

## 3.1 `a` — Chiều dài toàn bộ xe sát hạch

```txt
a = chiều dài toàn bộ của xe sát hạch
unit = meter (m)
```

Đây là kích thước từ điểm ngoài cùng phía trước đến điểm ngoài cùng phía sau của xe.

Trong generator, `a` là một **HARD INPUT** vì nó trực tiếp quyết định kích thước một số bài thi, ví dụ:

```txt
Lvb = a
Sv  = 1.5a
Lv  = 2.0a
Ld  = a + 1.0
Ed  = 1.2a
Lg  = 1.5a
```

Agent không được thay `a` bằng wheelbase hoặc chiều dài khoang xe.

---

## 3.2 `b` — Chiều rộng toàn bộ xe sát hạch

```txt
b = chiều rộng toàn bộ của xe sát hạch
unit = meter (m)
```

Đây là chiều rộng tổng thể của xe theo phương ngang.

Trong generator, `b` là một **HARD INPUT** dùng để xác định chiều rộng các bài thi, ví dụ:

```txt
Bv  = 2.2b
Bqc = 2.2b
Rd  = b + 0.6
Rg  = 1.25b
```

Agent không được nhầm `b` với:

```txt
track width
wheel width
khoảng cách giữa hai bánh
```

---

## 3.3 `Rqv` — Bán kính quay vòng nhỏ nhất của xe sát hạch

```txt
Rqv = bán kính quay vòng nhỏ nhất
unit = meter (m)
```

`Rqv` được tính theo **vết bánh xe trước phía ngoài khi đánh hết lái**.

Có thể hiểu theo hình học:

```txt
                quỹ đạo bánh trước ngoài
                       ╭────────────╮
                    ╭──╯            ╰──╮
                  ●                     │
                  O                     │
                  │<------ Rqv -------->│
```

Trong đó:

```txt
O = tâm quay tức thời

Rqv = khoảng cách từ tâm quay đến vết bánh trước phía ngoài
      khi vô lăng được đánh hết lái
```

Thông số này quyết định khả năng xe xoay trở trong các bài có đường cong. Trong specification hiện tại, `Rqv` được sử dụng trực tiếp cho bài **đường vòng quanh co chữ S**:

```txt
Rn = Rqv + 1.2

Bqc = 2.2b

Rtr = Rn - Bqc

Sqc = Rn + Rtr
```

Quan hệ hình học:

```txt
Rqv tăng
→ bán kính các cung đường tăng
→ bài chữ S phải rộng hơn

Rqv giảm
→ xe có khả năng quay gắt hơn
→ bán kính bài có thể nhỏ hơn theo đúng công thức
```

Agent không được hiểu `Rqv` là:

```txt
turning circle diameter
bán kính thân xe
bán kính tính từ tâm hình học của xe
góc đánh lái
wheelbase
```

Nếu dữ liệu nhà sản xuất chỉ cung cấp `minimum turning diameter`, agent **không được tự động chia đôi rồi coi là `Rqv`** nếu chưa xác nhận cách đo đó tương ứng với định nghĩa quy chuẩn đang sử dụng.

---

## 3.4 `B1` — Thông số dùng để xác định vệt bánh xe

Tài liệu nguồn hiện tại sử dụng:

```txt
Bvb = B1 + 0.2
```

nhưng phần tài liệu đang có **chưa định nghĩa rõ ý nghĩa của `B1`**.

Vì vậy trong generator:

```txt
B1 = REQUIRED_INPUT
```

Agent phải nhận `B1` từ:

```txt
- tài liệu quy chuẩn bổ sung;
- hồ sơ kỹ thuật xe;
- hoặc config đã được người quản trị xác nhận.
```

Không được tự suy đoán:

```txt
B1 = b
```

---

## 3.5 Interface chuẩn

```ts
interface ExamVehicleGeometryInput {
  /**
   * Chiều dài toàn bộ xe sát hạch, mét.
   */
  a: number;

  /**
   * Chiều rộng toàn bộ xe sát hạch, mét.
   */
  b: number;

  /**
   * Thông số dùng trong công thức Bvb = B1 + 0.2.
   * Chưa được định nghĩa đầy đủ trong tài liệu hiện tại.
   */
  B1: number;

  /**
   * Bán kính quay vòng nhỏ nhất tính theo
   * vết bánh trước phía ngoài khi đánh hết lái, mét.
   */
  Rqv: number;
}
```

Validation tối thiểu:

```ts
function validateVehicleGeometry(v: ExamVehicleGeometryInput) {
  if (v.a <= 0) throw new Error('a must be > 0');
  if (v.b <= 0) throw new Error('b must be > 0');
  if (v.B1 <= 0) throw new Error('B1 must be > 0');
  if (v.Rqv <= 0) throw new Error('Rqv must be > 0');
}
```

---

## 3.6 Mối quan hệ giữa xe và sa hình

Có thể hiểu toàn bộ generator theo quan hệ:

```txt
THÔNG SỐ XE
a, b, B1, Rqv
      │
      ▼
CÔNG THỨC QUY CHUẨN
      │
      ▼
KÍCH THƯỚC TỪNG BÀI
      │
      ▼
THREE.JS GEOMETRY
```

Tức là không nên dựng bài thi bằng các kích thước cố định cho mọi loại xe.

Nếu thay đổi chiếc xe sát hạch:

```txt
vehicle config thay đổi
→ công thức được tính lại
→ geometry sa hình được sinh lại
```

Đây là nguyên tắc quan trọng để hệ thống có thể tái sử dụng cho các hạng xe khác nhau.

---

# 4. Scene graph đề xuất

```txt
ExamYardRoot
│
├── Ground
├── Roads
│   ├── Road_StartFinish
│   ├── Road_Pedestrian
│   ├── Road_Hill
│   ├── Road_WheelTrack_RightAngle
│   ├── Road_Intersection
│   ├── Road_SCurve
│   ├── Road_ParallelParking
│   ├── Road_PerpendicularParking
│   ├── Road_Railway
│   └── Road_GearChange
│
├── Markings
│   ├── StopLines
│   ├── Crosswalks
│   ├── BoundaryLines
│   └── TextMarkings
│
├── Curbs
├── TrafficSigns
├── TrafficLights
├── Railway
├── Sensors
├── HazardTriggers
└── Debug
```

Mỗi bài thi nên là một `THREE.Group` độc lập.

```js
const hillExercise = new THREE.Group();
hillExercise.name = 'EXERCISE_03_HILL_START';
```

---

# 5. Quy tắc dựng mặt đường

## 5.1 Đường thẳng

Có thể dùng:

```txt
PlaneGeometry
ShapeGeometry
```

Nếu cần bó vỉa, dùng mesh riêng hoặc `ExtrudeGeometry`.

## 5.2 Đường cong

Đối với đường vòng quanh co:

```txt
CurvePath
ArcCurve / EllipseCurve
Shape + ExtrudeGeometry
```

Không dựng đường cong bằng các đoạn thẳng quá thưa.

## 5.3 Vạch giới hạn và bó vỉa

Các sơ đồ phân biệt:

```txt
Bó vỉa hình sát hạch
Vạch giới hạn hình sát hạch
```

Agent nên tạo thành object khác nhau:

```txt
CURB_*
BOUNDARY_LINE_*
```

để gameplay có thể kiểm tra va chạm hoặc vượt giới hạn độc lập.

---

# 6. BÀI 01 — XUẤT PHÁT VÀ KẾT THÚC

## 6.1 Yêu cầu nguồn

Trên mặt đường có một **vạch ngang vuông góc với trục dọc của đường** theo quy cách vạch dừng xe.

Phía trước vạch có chữ:

```txt
XUẤT PHÁT
```

hoặc:

```txt
KẾT THÚC
```

Xe sát hạch dừng trước vạch chờ tín hiệu và thực hiện thao tác khởi hành để làm bài xuất phát. Khi kết thúc, xe đi qua vạch kết thúc.

## 6.2 Hình học

```txt
Road direction: +Z
Stop line: perpendicular to road axis
Road text: placed before the line
```

Object đề xuất:

```txt
EX01_START_LINE
EX01_START_TEXT
EX01_START_WAIT_ZONE
EX01_FINISH_LINE
EX01_FINISH_TEXT
EX01_FINISH_TRIGGER
```

## 6.3 Logic mô phỏng

```txt
STATE_WAITING
    ↓ signal == GO
STATE_ALLOWED_TO_START
    ↓ vehicle crosses start line
STATE_STARTED
```

Kết thúc:

```txt
vehicle crosses finish line
→ EVENT_EXAM_FINISH
```

---

# 7. BÀI 02 — DỪNG XE NHƯỜNG ĐƯỜNG CHO NGƯỜI ĐI BỘ

## 7.1 Thành phần bắt buộc

Tại vị trí người đi bộ qua đường phải có:

```txt
1. Vạch dừng xe
2. Vạch đi bộ qua đường dạng vuông góc
3. Biển “Dừng lại”
4. Biển “Đường người đi bộ cắt ngang”
```

Mục đích:

```txt
yêu cầu xe sát hạch dừng xe
→ nhường đường cho người đi bộ
```

## 7.2 Object

```txt
EX02_STOP_LINE
EX02_CROSSWALK
EX02_SIGN_STOP
EX02_SIGN_PEDESTRIAN
EX02_STOP_SENSOR
```

## 7.3 Sensor gameplay

Nên tạo:

```txt
EX02_APPROACH_ZONE
EX02_STOP_GATE
```

Hệ thống có thể ghi nhận:

```txt
vehicle entered approach
vehicle speed
vehicle stopped before stop line
vehicle crossed stop line
```

Tài liệu nguồn không đưa ra:

```txt
thời gian dừng tối thiểu
khoảng cách bánh xe tới vạch
mức trừ điểm
```

=> không hardcode các giá trị này từ tài liệu hiện tại.

---

# 8. BÀI 03 — DỪNG VÀ KHỞI HÀNH XE TRÊN DỐC

## 8.1 Kích thước bắt buộc

Đường dốc lên:

```txt
Chiều dài = 15 m
Độ dốc = 10%
```

Vạch dừng xe:

```txt
cách chân dốc tối thiểu 6 m
```

Phải bố trí biển:

```txt
Dừng lại
Dốc lên nguy hiểm
Dốc xuống nguy hiểm
```

Sơ đồ nguồn còn thể hiện đoạn dốc xuống dài `10 m`.

## 8.2 Hình học Three.js

Độ dốc:

```txt
10% = ΔY / ΔZ = 0.10
```

Nếu toàn bộ 15 m dốc đều có grade 10%:

```txt
rise = 15 × 0.10 = 1.5 m
```

`1.5 m` là giá trị suy ra toán học từ hai thông số nguồn.

Không dùng góc `10°`; grade 10% không đồng nghĩa 10 độ.

## 8.3 Object

```txt
EX03_HILL_UP
EX03_HILL_STOP_LINE
EX03_HILL_STOP_SENSOR
EX03_HILL_TOP
EX03_HILL_DOWN
EX03_SIGN_STOP
EX03_SIGN_UPHILL
EX03_SIGN_DOWNHILL
```

---

# 9. BÀI 04 — QUA VỆT BÁNH XE VÀ ĐƯỜNG VÒNG VUÔNG GÓC

## 9.1 Bố trí

Hình vệt bánh xe nằm **phía bên phải theo chiều xe chạy**, gồm `02 vạch dọc song song`, song song với trục dọc đường.

Sau hình vệt bánh xe là `02 hình vuông góc nối tiếp với nhau theo chiều ngược lại`.

## 9.2 Công thức bắt buộc

### Vệt bánh xe

```txt
Bvb = B1 + 0.2 m
Lvb = a
```

Trong đó:

```txt
Bvb = chiều rộng vệt bánh xe
Lvb = chiều dài vệt bánh xe
```

### Đường vòng vuông góc

```txt
Sv = 1.5a
Lv = 2.0a
Bv = 2.2b
```

Trong đó:

```txt
Sv = chiều sâu đường vuông góc
Lv = chiều dài đường vuông góc
Bv = chiều rộng làn đường vuông góc
```

## 9.3 Hàm sinh hình học

```ts
function buildWheelTrackAndRightAngle(input) {
  const Bvb = input.B1 + 0.2;
  const Lvb = input.a;
  const Sv  = 1.5 * input.a;
  const Lv  = 2.0 * input.a;
  const Bv  = 2.2 * input.b;
}
```

## 9.4 Sensor đề xuất

```txt
EX04_WHEEL_TRACK_LEFT_BOUNDARY
EX04_WHEEL_TRACK_RIGHT_BOUNDARY
EX04_WHEEL_TRACK_ENTRY
EX04_WHEEL_TRACK_EXIT
EX04_RIGHT_ANGLE_BOUNDARY_1
EX04_RIGHT_ANGLE_BOUNDARY_2
```

Vệt bánh xe nên kiểm tra bằng vị trí bánh, không chỉ bằng tâm xe.

---

# 10. BÀI 05 — NGÃ TƯ CÓ ĐÈN TÍN HIỆU

## 10.1 Hình học và thiết bị

Là nơi giao nhau giữa `hai đường hai chiều cùng cấp`.

Phải có:

```txt
hệ thống đèn tín hiệu giao thông
vạch dừng xe
vạch đi bộ qua đường dạng vuông góc
```

Biển báo:

```txt
Hướng đi phải theo
Đường giao nhau
Giao nhau có tín hiệu đèn
```

## 10.2 Yêu cầu vận hành

Xe sát hạch:

```txt
dừng tại ngã tư
theo tín hiệu đèn điều khiển giao thông
để nhường đường cho người đi bộ
```

## 10.3 Scene structure

```txt
EX05_INTERSECTION
│
├── ROAD_NS
├── ROAD_EW
├── STOP_LINE_N
├── STOP_LINE_S
├── STOP_LINE_E
├── STOP_LINE_W
├── CROSSWALK_N
├── CROSSWALK_S
├── CROSSWALK_E
├── CROSSWALK_W
└── TRAFFIC_LIGHT_SYSTEM
```

Sơ đồ nguồn cho thấy crosswalk được bố trí quanh nút giao.

## 10.4 Traffic light state machine

Agent có thể triển khai:

```txt
RED
YELLOW
GREEN
```

nhưng chu kỳ thời gian cụ thể **không có trong tài liệu**, vì vậy phải nằm trong config game.

---

# 11. BÀI 06 — QUA ĐƯỜNG VÒNG QUANH CO CHỮ S

## 11.1 Hình dạng

Gồm `02 nửa hình vòng tròn nối tiếp với nhau ngược chiều`, tạo thành hình chữ S.

## 11.2 Công thức bắt buộc

```txt
Bqc = 2.2b
Rn = Rqv + 1.2 m
Rtr = Rn - Bqc
Sqc = Rn + Rtr
```

Trong đó:

```txt
Bqc = chiều rộng đường vòng quanh co
Rn  = bán kính cong vòng ngoài
Rtr = bán kính cong vòng trong
Sqc = khoảng cách tâm của 02 nửa hình vòng tròn
```

`Rqv` là `REQUIRED_INPUT`.

## 11.3 Thuật toán dựng

```txt
1. Nhận b và Rqv.
2. Tính Bqc.
3. Tính Rn.
4. Tính Rtr.
5. Tính Sqc.
6. Tạo arc ngoài và arc trong của nửa vòng tròn thứ nhất.
7. Tạo nửa vòng tròn thứ hai theo chiều cong ngược lại.
8. Nối hai đoạn bảo đảm continuity.
9. Sinh road mesh giữa hai boundary.
10. Sinh curb/boundary line theo hình nguồn.
```

Pseudo-code:

```ts
const Bqc = 2.2 * b;
const Rn  = Rqv + 1.2;
const Rtr = Rn - Bqc;
const Sqc = Rn + Rtr;
```

## 11.4 Kiểm tra biên

Nên dùng collider/sensor dọc:

```txt
innerCurveBoundary
outerCurveBoundary
```

Không dùng một bounding box lớn cho toàn bài.

---

# 12. BÀI 07 — GHÉP XE DỌC VÀO NƠI ĐỖ, HẠNG B/C1

## 12.1 Vị trí

Hình được bố trí `bên phải làn đường theo hướng xe chạy` và có biển `“Nơi đỗ xe”`.

## 12.2 Công thức bắt buộc

```txt
Ld = a + 1.0 m
Rd = b + 0.6 m
Ed = 1.2a
```

Trong đó:

```txt
Ld = chiều dài nơi ghép xe dọc
Rd = chiều rộng nơi ghép xe dọc
Ed = khoảng khống chế để lùi vào nơi ghép xe dọc
```

## 12.3 Geometry

```ts
const parkingLength = a + 1.0;
const parkingWidth  = b + 0.6;
const reverseControlDistance = 1.2 * a;
```

Scene:

```txt
EX07_PARALLEL_PARKING
│
├── PARKING_BAY
├── CURB
├── LIMIT_LINES
├── ENTRY_CONTROL_ZONE
├── PARKING_TARGET_ZONE
└── SIGN_PARKING
```

---

# 13. BÀI 08 — GHÉP XE NGANG VÀO NƠI ĐỖ, HẠNG B

## 13.1 Vị trí

Hình bố trí `phía bên phải làn đường theo hướng xe chạy`, có biển `“Nơi đỗ xe”`.

## 13.2 Công thức

```txt
Lg = 3a / 2
Rg = 5b / 4
```

Trong đó:

```txt
Lg = chiều dài nơi đỗ xe
Rg = chiều rộng nơi đỗ xe
```

## 13.3 Geometry

```ts
const bayLength = 1.5 * a;
const bayDepth  = 1.25 * b;
```

Object:

```txt
EX08_PERPENDICULAR_PARKING
│
├── PARKING_BAY
├── CURB
├── LIMIT_LINES
├── TARGET_ZONE
└── SIGN_PARKING
```

---

# 14. BÀI 09 — TẠM DỪNG Ở CHỖ CÓ ĐƯỜNG SẮT CHẠY QUA

## 14.1 Thành phần

Trên mặt đường bố trí `02 thanh ray đường sắt`.

Tình huống giả định:

```txt
đường bộ giao đường sắt
không có rào chắn
không có người điều khiển giao thông
```

## 14.2 Khoảng cách bắt buộc

Vạch dừng xe:

```txt
cách ray ngoài cùng tối thiểu 5.0 m
```

## 14.3 Biển báo

```txt
Giao nhau với đường sắt không có rào chắn
Nơi đường sắt giao vuông góc với đường bộ
Dừng lại
```

## 14.4 Geometry

Sơ đồ nguồn thể hiện đường sắt giao vuông góc với đường bộ.

```txt
Road axis: Z
Rail axis: X
rail crossing angle = 90°
```

Scene:

```txt
EX09_RAILWAY
│
├── RAIL_1
├── RAIL_2
├── STOP_LINE
├── STOP_SENSOR
├── SIGN_NO_BARRIER
├── SIGN_RAIL_CROSSING
└── SIGN_STOP
```

Constraint:

```txt
distance(STOP_LINE, outermostRail) >= 5.0 m
```

---

# 15. BÀI 10 — THAY ĐỔI SỐ TRÊN ĐƯỜNG BẰNG

## 15.1 Đoạn đường

Đường thẳng:

```txt
chiều dài tối thiểu 100 m
```

## 15.2 Vị trí biển

Từ đầu đoạn đường:

```txt
>= 20 m
```

đặt biển phụ thứ nhất:

```txt
“Bắt đầu tăng số, tăng tốc độ”
```

Sau đó `25 m` đặt biển phụ thứ hai:

```txt
“Bắt đầu giảm số, giảm tốc độ”
```

Sau biển thứ hai `25 m` đặt biển:

```txt
“Kết thúc giảm số, giảm tốc độ”
```

## 15.3 Gate system

```txt
ROAD_START
    │
    │ >= 20m
    ▼
GATE_A — “Bắt đầu tăng số, tăng tốc độ”
    │
    │ 25m
    ▼
GATE_B — “Bắt đầu giảm số, giảm tốc độ”
    │
    │ 25m
    ▼
GATE_C — “Kết thúc giảm số, giảm tốc độ”
```

Object:

```txt
EX10_GEAR_ROAD
EX10_GATE_ACCELERATE
EX10_GATE_DECELERATE
EX10_GATE_END
```

Không hardcode số phải sử dụng, tốc độ cần đạt hoặc thời gian thực hiện vì tài liệu hiện tại không cung cấp.

---

# 16. BÀI 11 — TÌNH HUỐNG NGUY HIỂM

## 16.1 Số vị trí

Trong sân sát hạch:

```txt
Trung tâm loại 1 = 05 vị trí
Trung tâm loại 2 = 03 vị trí
```

## 16.2 Yêu cầu thao tác

Khi tình huống nguy hiểm xuất hiện:

```txt
1. Phanh dừng xe.
2. Bật thông báo tín hiệu nguy hiểm.
3. Tắt thông báo tín hiệu nguy hiểm.
4. Sau đó mới cho xe khởi hành.
5. Thực hiện trong thời gian quy định.
```

Tài liệu không cung cấp giá trị cụ thể của `thời gian quy định`, vì vậy phải đưa vào config riêng.

## 16.3 Trigger design

```txt
HazardTrigger_01
HazardTrigger_02
...
```

```ts
interface HazardTrigger {
  id: string;
  position: THREE.Vector3;
  activationRadius: number;
  active: boolean;
}
```

State machine:

```txt
INACTIVE
   ↓ trigger
HAZARD_ACTIVE
   ↓ vehicle stopped
VEHICLE_STOPPED
   ↓ hazard lights ON
WARNING_ON
   ↓ hazard lights OFF
WARNING_OFF
   ↓ vehicle starts moving
COMPLETED
```

---

# 17. Hệ thống Sensor dùng chung

Agent nên tách **visual geometry** và **logic sensor**.

```txt
Visual:
road
line
curb
sign

Logic:
Box3 / OBB / trigger plane
```

Các loại sensor:

```ts
type ExamSensorType =
  | 'ENTRY_GATE'
  | 'EXIT_GATE'
  | 'STOP_LINE'
  | 'CROSSWALK'
  | 'BOUNDARY'
  | 'WHEEL_TRACK'
  | 'PARKING_ZONE'
  | 'TRAFFIC_LIGHT_GATE'
  | 'RAIL_STOP_GATE'
  | 'GEAR_CHANGE_GATE'
  | 'HAZARD_TRIGGER';
```

---

# 18. Cấu hình dữ liệu đề xuất

```ts
interface ExamYardConfig {
  units: 'meter';

  vehicleGeometry: {
    a: number;
    b: number;
    B1: number;
    Rqv: number;
  };

  hill: {
    length: 15;
    grade: 0.10;
    stopLineMinDistanceFromHillBase: 6;
  };

  railway: {
    stopLineMinDistanceFromOuterRail: 5;
  };

  gearChange: {
    minRoadLength: 100;
    firstSignMinDistanceFromStart: 20;
    gateSpacing1: 25;
    gateSpacing2: 25;
  };

  hazard: {
    centerType1Count: 5;
    centerType2Count: 3;
    responseTime?: number; // NOT PROVIDED BY SOURCE
  };
}
```

---

# 19. Công thức tổng hợp

```txt
Bvb = B1 + 0.2
Lvb = a

Sv = 1.5a
Lv = 2.0a
Bv = 2.2b

Bqc = 2.2b
Rn = Rqv + 1.2
Rtr = Rn - Bqc
Sqc = Rn + Rtr

Ld = a + 1.0
Rd = b + 0.6
Ed = 1.2a

Lg = 1.5a
Rg = 1.25b
```

---

# 20. Thứ tự module đề xuất cho generator

Nếu không có bản vẽ layout sân thực tế khác, agent có thể dùng thứ tự tài liệu làm thứ tự module logic:

```txt
START
 ↓
01 Xuất phát
 ↓
02 Người đi bộ
 ↓
03 Dốc
 ↓
04 Vệt bánh xe + vuông góc
 ↓
05 Ngã tư
 ↓
06 Chữ S
 ↓
07 Ghép dọc
 ↓
08 Ghép ngang (hạng B)
 ↓
09 Đường sắt
 ↓
10 Tăng / giảm số
 ↓
11 Hazard triggers
 ↓
FINISH
```

Lưu ý: thứ tự nối các module thành một sân hoàn chỉnh **không được xem là layout chính thức** nếu tài liệu không cung cấp sơ đồ tổng thể sân.

---

# 21. TrackLayoutConfig đề xuất

```ts
interface ExercisePlacement {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotationY: number;
}

interface TrackLayoutConfig {
  exercises: ExercisePlacement[];
}
```

Các tọa độ bố trí là **layout game**, không phải giá trị quy chuẩn từ tài liệu.

---

# 22. Quy tắc kết nối các module

Mỗi exercise nên khai báo:

```txt
entryPoint
entryDirection
exitPoint
exitDirection
```

```ts
interface ExercisePorts {
  entry: {
    position: THREE.Vector3;
    direction: THREE.Vector3;
  };
  exit: {
    position: THREE.Vector3;
    direction: THREE.Vector3;
  };
}
```

Track builder:

```txt
Exercise A.exit
      ↓
transition road
      ↓
Exercise B.entry
```

Các transition road không được làm thay đổi kích thước hình sát hạch của module chính.

---

# 23. Cách agent nên sinh mesh

## Phase 1 — Parameter calculation

```txt
input config
→ validate required variables
→ calculate all formulas
```

## Phase 2 — Centerline

Sinh đường tim bằng loại curve phù hợp.

## Phase 3 — Road boundaries

Từ centerline sinh:

```txt
leftBoundary
rightBoundary
```

## Phase 4 — Surface

Sinh road mesh giữa hai boundary.

## Phase 5 — Markings

Sinh:

```txt
stop lines
crosswalk
limit lines
wheel-track lines
road text
```

## Phase 6 — Roadside objects

Sinh:

```txt
traffic signs
traffic lights
railway
curbs
```

## Phase 7 — Sensors

Sinh sensor riêng:

```txt
entry
exit
stop
boundary
parking
hazard
```

---

# 24. Validation bắt buộc trước khi render

## Hill

```txt
length == 15 m
grade == 10%
stop line distance from hill base >= 6 m
```

## Railway

```txt
distance stop line → outer rail >= 5 m
```

## Gear change

```txt
roadLength >= 100 m
roadStart → gateA >= 20 m
gateA → gateB == 25 m
gateB → gateC == 25 m
```

## Wheel track

```txt
Bvb == B1 + 0.2
Lvb == a
```

## Right-angle section

```txt
Sv == 1.5a
Lv == 2a
Bv == 2.2b
```

## S-curve

```txt
Bqc == 2.2b
Rn == Rqv + 1.2
Rtr == Rn - Bqc
Sqc == Rn + Rtr
```

## Parallel parking

```txt
Ld == a + 1
Rd == b + 0.6
Ed == 1.2a
```

## Perpendicular parking

```txt
Lg == 1.5a
Rg == 1.25b
```

---

# 25. Debug mode bắt buộc

Nên có:

```js
const DEBUG_EXAM_YARD = true;
```

Khi bật, hiển thị:

```txt
centerline
entry/exit
sensor volumes
dimensions
curve center
turn radius
vehicle path
```

Debug mode chỉ để kiểm tra kỹ thuật, không xuất hiện trong production.

---

# 26. Quy tắc Agent bắt buộc phải tuân thủ

```txt
RULE_01
Không tự phát minh kích thước khi tài liệu không cung cấp.

RULE_02
Mọi công thức trong tài liệu là hard constraint.

RULE_03
Dùng đơn vị meter.

RULE_04
Geometry và gameplay sensor phải tách riêng.

RULE_05
Bánh xe phải được dùng khi kiểm tra bài “vệt bánh xe”.

RULE_06
Không chỉ kiểm tra tâm xe đối với các bài có biên giới hạn.

RULE_07
Không dùng bounding box chung để mô phỏng đường cong chữ S.

RULE_08
Vạch dừng phải là object/sensor riêng.

RULE_09
Biển báo và đèn giao thông phải là object độc lập.

RULE_10
Không tự thêm quy tắc chấm điểm không có trong nguồn.

RULE_11
Không tự thêm giới hạn tốc độ không có trong nguồn.

RULE_12
Không tự thêm thời gian dừng không có trong nguồn.

RULE_13
Nếu thiếu a, b, B1 hoặc Rqv: STOP GENERATION và yêu cầu input.

RULE_14
Nếu có sơ đồ sân thực tế: ưu tiên sơ đồ đó cho vị trí các module nhưng không thay đổi kích thước module quy chuẩn.

RULE_15
Các hình trong tài liệu dùng để hiểu topology và hướng bố trí; kích thước số học/công thức có trong tài liệu có ưu tiên cao hơn việc đo trực tiếp từ ảnh.
```

---

# 27. Prompt ngắn cho Codex/Agent

```txt
Bạn đang xây dựng một sân sát hạch lái xe bằng Three.js.

Hãy đọc file specification này như nguồn quy chuẩn hình học.

Yêu cầu:
1. Dùng 1 Three.js unit = 1 meter.
2. Mỗi bài sát hạch là một THREE.Group độc lập.
3. Không hardcode hoặc suy đoán các biến a, b, B1, Rqv.
4. Nhận chúng từ ExamVehicleGeometryInput.
5. Tính chính xác toàn bộ công thức được định nghĩa trong specification.
6. Sinh road surface, curb, boundary line, stop line, sign và sensor thành các object riêng.
7. Sinh entryPoint và exitPoint cho mỗi module.
8. Tách visual mesh khỏi gameplay sensors.
9. Tạo debug mode để hiển thị kích thước, sensor và centerline.
10. Tạo validation function để kiểm tra toàn bộ hard constraints trước khi scene được chấp nhận.
11. Không tự bổ sung quy tắc chấm điểm, thời gian hoặc tốc độ nếu specification không định nghĩa.
12. Code phải modular để sau này thay đổi layout sân mà không cần viết lại hình học của từng bài.
```

---

# 28. Kiến trúc code đề xuất

```txt
src/
│
├── exam-yard/
│   ├── config/
│   │   ├── ExamYardConfig.ts
│   │   └── TrackLayoutConfig.ts
│   │
│   ├── core/
│   │   ├── Exercise.ts
│   │   ├── ExerciseSensor.ts
│   │   ├── RoadBuilder.ts
│   │   └── MarkingBuilder.ts
│   │
│   ├── exercises/
│   │   ├── StartFinishExercise.ts
│   │   ├── PedestrianExercise.ts
│   │   ├── HillStartExercise.ts
│   │   ├── WheelTrackExercise.ts
│   │   ├── IntersectionExercise.ts
│   │   ├── SCurveExercise.ts
│   │   ├── ParallelParkingExercise.ts
│   │   ├── PerpendicularParkingExercise.ts
│   │   ├── RailwayExercise.ts
│   │   ├── GearChangeExercise.ts
│   │   └── HazardExercise.ts
│   │
│   ├── validation/
│   │   └── ExamYardValidator.ts
│   │
│   └── ExamYard.ts
```

---

# 29. Interface chung của một bài thi

```ts
interface ExamExercise {
  id: string;
  group: THREE.Group;

  entryPoint: THREE.Vector3;
  entryDirection: THREE.Vector3;

  exitPoint: THREE.Vector3;
  exitDirection: THREE.Vector3;

  sensors: ExamSensor[];

  build(): THREE.Group;
  validate(): ValidationResult[];
}
```

---

# 30. Kết luận cho Agent

Mục tiêu của generator không phải dựng một con đường “trông giống sân sát hạch”.

Mục tiêu là dựng:

```txt
PARAMETRIC EXAM YARD
```

trong đó:

```txt
quy chuẩn
      ↓
tham số
      ↓
công thức
      ↓
geometry
      ↓
sensors
      ↓
gameplay
```

Các bài có công thức phải được sinh từ tham số, không dựng thủ công bằng tọa độ cố định.

Các thông số chưa được tài liệu cung cấp phải được đưa thành input.

Khi có thêm:

```txt
1. sơ đồ tổng thể sân sát hạch thực tế
2. định nghĩa chính xác a, b, B1, Rqv
3. quy trình chấm điểm
4. thời gian từng bài
5. giới hạn tốc độ
```

thì có thể mở rộng specification này thành hệ thống mô phỏng sát hạch đầy đủ.

---

# 31. Nguồn

Tài liệu sử dụng:

```txt
6. QUY TRÌNH LÀM BÀI SA HÌNH
Mục 6.1 → 6.11
11 trang
```

Specification này **không thay thế văn bản quy phạm hoặc hồ sơ thiết kế sân chính thức**. Nó là bản chuyển đổi nội dung tài liệu đã cung cấp sang cấu trúc kỹ thuật phục vụ lập trình Three.js.
