# BÀI SÁT HẠCH SỐ 4 — QUA VỆT BÁNH XE VÀ ĐƯỜNG VÒNG VUÔNG GÓC

## Đặc tả quy trình, yêu cầu đạt và lỗi trừ điểm cho Agent/Codex

> Nguồn: ảnh người dùng cung cấp về **“Bài sát hạch số 4: qua vệt bánh xe và đường vòng vuông góc”**.
>
> Mục đích: chuyển nội dung bài thi số 4 thành đặc tả kỹ thuật để Agent/Codex triển khai logic mô phỏng, sensor và chấm lỗi trong Three.js.
>
> Chỉ sử dụng nội dung thể hiện trong nguồn. Những phần nguồn không làm rõ được giữ dưới dạng rule riêng hoặc `REQUIRED_INPUT`.

---

# 1. Tên bài

```txt
BÀI SÁT HẠCH SỐ 4:
QUA VỆT BÁNH XE VÀ ĐƯỜNG VÒNG VUÔNG GÓC
```

ID đề xuất:

```txt
EXAM_04_WHEEL_TRACK_AND_RIGHT_ANGLE
```

Marker sân Hiệp Phát:

```txt
4A
```

---

# 2. Mục tiêu bài thi

Thí sinh phải:

```txt
- đi đúng hình quy định của hạng xe sát hạch;
- điều khiển bánh xe trước và bánh xe sau bên lái phụ
  đi qua vùng giới hạn của hình vệt bánh xe;
- lái xe qua đường vòng vuông góc trong vùng giới hạn của hình sát hạch;
- không để bánh xe đè vào vạch giới hạn;
- hoàn thành bài trong thời gian 02 phút;
- giữ động cơ hoạt động liên tục;
- không để tốc độ động cơ vượt 4000 vòng/phút;
- không vượt tốc độ quy định;
- qua vạch kết thúc bài và đến bài sát hạch tiếp theo.
```

---

# 3. Các bước thực hiện

## Bước 1 — Qua hình vệt bánh xe

Nguồn quy định:

```txt
Lái xe để bánh xe trước và bánh xe sau bên lái phụ
qua vùng giới hạn của hình vệt bánh xe.
```

Agent phải theo dõi riêng:

```txt
FRONT_PASSENGER_WHEEL
REAR_PASSENGER_WHEEL
```

Không dùng tâm xe hoặc `VehicleRoot` để thay thế kiểm tra bánh xe.

---

## Bước 2 — Qua đường vòng vuông góc

Nguồn quy định:

```txt
Lái xe qua đường vòng vuông góc
trong vùng giới hạn của hình sát hạch
trong thời gian 02 phút.
```

Quy đổi:

```txt
02 phút = 120 giây
```

```ts
const EXAM_04_TIME_LIMIT_SEC = 120;
```

---

## Bước 3 — Qua vạch vàng kết thúc bài

```txt
Lái xe qua vạch vàng cuối đường của bài sát hạch
và đến bài sát hạch tiếp theo.
```

Vạch vàng này là mốc:

```txt
END_GATE
```

Object:

```txt
EX04_END_YELLOW_LINE
SENSOR_4A_END_YELLOW_LINE
```

---

# 4. Yêu cầu đạt được

## 4.1 Đi đúng hình quy định của hạng xe

```txt
Đi đúng hình quy định của hạng xe sát hạch.
```

Agent phải chọn đúng geometry theo hạng xe đang thi.

---

## 4.2 Hai bánh bên lái phụ phải qua vùng vệt bánh xe

```txt
Bánh xe trước và bánh xe sau bên lái phụ
qua vùng giới hạn của hình vệt bánh xe.
```

Điều kiện logic (soft mode — nới từ yêu cầu cũ):

```ts
// Đủ điều kiện hoàn thành khi ÍT NHẤT 1 trong 2 bánh (FR hoặc RR) đã qua zone.
const wheelTrackCompleted =
  state.frontPassengerWheelPassed || state.rearPassengerWheelPassed;

// Mỗi bánh còn lại chưa qua → phạt wheelTrack.missingWheelPenalty.
const missingWheels =
  (!state.frontPassengerWheelPassed ? 1 : 0) +
  (!state.rearPassengerWheelPassed ? 1 : 0);

const wheelTrackPenalty = missingWheels * RULES.wheelTrack.missingWheelPenalty;
```

**Quy tắc chi tiết:**

- Cả **FR + RR** qua zone → hoàn thành, **không phạt** điểm wheel-track.
- Chỉ **FR** qua (RR ngoài) → hoàn thành, **trừ 5 điểm** cho bánh sau.
- Chỉ **RR** qua (FR ngoài) → hoàn thành, **trừ 5 điểm** cho bánh trước.
- **Không bánh nào** qua zone → **đình chỉ** (`DQ_04_WHEEL_TRACK_NOT_COMPLETED`).

Đảm bảo phạt "thiếu bánh" chỉ phát **một lần** khi `wheelTrackCompleted` chuyển từ `false → true` (latch), không cộng dồn mỗi frame.

---

## 4.3 Bánh xe không đè vạch giới hạn

```txt
Bánh xe không đè vào vạch giới hạn hình sát hạch.
```

Phải kiểm tra footprint/contact của bánh xe, không chỉ tâm bánh.

---

## 4.4 Hoàn thành trong 02 phút

```txt
Hoàn thành bài sát hạch trong thời gian 02 phút.
```

```ts
const EXAM_04_TIME_LIMIT_SEC = 120;
```

---

## 4.5 Giữ động cơ hoạt động liên tục

```txt
engineRunning == true
```

---

## 4.6 Giới hạn tốc độ động cơ

```txt
engineRPM <= 4000 vòng/phút
```

```ts
const MAX_ENGINE_RPM = 4000;
```

---

## 4.7 Giới hạn tốc độ xe

### Hạng B, D1, D2

```txt
speed <= 24 km/h
```

### Hạng C1, C, D

```txt
speed <= 20 km/h
```

```ts
const MAX_SPEED_KMH = {
  B: 24,
  D1: 24,
  D2: 24,
  C1: 20,
  C: 20,
  D: 20
} as const;
```

---

# 5. Sensor và geometry cần có

## 5.1 Entry sensor

```txt
SENSOR_4A_ENTRY
```

## 5.2 Wheel-track zone

```txt
EX04_WHEEL_TRACK_ZONE
```

Dùng để kiểm tra bánh trước và bánh sau bên lái phụ.

## 5.3 Boundary sensors

```txt
BOUNDARY_LINE_*
BOUNDARY_SENSOR_*
```

## 5.4 Right-angle section

```txt
EX04_RIGHT_ANGLE_SECTION
```

Geometry lấy từ file quy chuẩn bài thi, không hardcode lại trong file này.

## 5.5 Vạch vàng đầu bài — mốc bắt đầu bài thi

Tại đầu đoạn đường của bài số 4 có một **vạch vàng ngang đường** dùng để báo hiệu:

```txt
BẮT ĐẦU BÀI THI SỐ 4
```

Trong mô phỏng, đây là `START_GATE` chính thức của bài.

Tên object đề xuất:

```txt
EX04_START_YELLOW_LINE
SENSOR_4A_START_YELLOW_LINE
```

Khi xe đi qua vạch vàng đầu bài theo đúng chiều chạy:

```txt
- kích hoạt bài số 4;
- đặt state.active = true;
- ghi nhận thời điểm bắt đầu bài;
- bắt đầu timer 02 phút;
- bắt đầu theo dõi vệt bánh xe;
- bắt đầu áp dụng các lỗi và rule riêng của bài 4.
```

Pseudo-code:

```ts
if (
  crossedLineInCorrectDirection(
    vehicle,
    EX04_START_YELLOW_LINE
  )
) {
  state.active = true;
  state.startYellowLineCrossed = true;
  state.exerciseStartTimestamp = now();

  emit('EXAM_04_STARTED');
}
```

Agent không được dùng:

```txt
- tâm zone;
- entry bounding box;
- khoảng cách ước lượng;
```

để thay thế mốc bắt đầu nếu sân thực tế đã có vạch vàng.

Vạch vàng đầu bài phải được phân biệt với:

```txt
- vạch giới hạn hình sát hạch;
- vạch dừng;
- vạch phân làn;
- các vạch sơn khác.
```

---

## 5.6 Vạch vàng cuối bài — mốc kết thúc bài thi

Ở cuối đoạn đường của bài số 4 có một **vạch vàng ngang đường** dùng để báo hiệu:

```txt
KẾT THÚC BÀI THI SỐ 4
```

Trong mô phỏng, đây là `END_GATE` chính thức của bài.

Tên object đề xuất:

```txt
EX04_END_YELLOW_LINE
SENSOR_4A_END_YELLOW_LINE
```

Khi xe đã thực hiện xong phần vệt bánh xe và đường vòng vuông góc, sau đó đi qua vạch vàng cuối bài theo đúng chiều:

```txt
- ghi nhận kết thúc bài số 4;
- dừng timer bài;
- tắt logic chấm lỗi riêng của bài 4;
- đặt state.completed = true;
- chuyển sang đoạn đường nối/bài tiếp theo.
```

Pseudo-code:

```ts
if (
  state.wheelTrackCompleted &&
  crossedLineInCorrectDirection(
    vehicle,
    EX04_END_YELLOW_LINE
  )
) {
  state.endYellowLineCrossed = true;
  state.completed = true;
  state.active = false;

  emit('EXAM_04_COMPLETED');
}
```

Vạch vàng cuối bài phải được phân biệt với:

```txt
- vạch giới hạn hình sát hạch;
- vạch vàng đầu bài;
- vạch phân làn;
- vạch dừng.
```

---

## 5.7 Quan hệ giữa hai vạch vàng

```txt
          HƯỚNG XE CHẠY
               ↓

      VẠCH VÀNG ĐẦU BÀI
          START_GATE
               │
               ▼
        BẮT ĐẦU TIMER
               │
               ▼
        VỆT BÁNH XE
               │
               ▼
   ĐƯỜNG VÒNG VUÔNG GÓC
               │
               ▼
      VẠCH VÀNG CUỐI BÀI
           END_GATE
               │
               ▼
        KẾT THÚC BÀI 4
```

Agent phải xem hai vạch này là hai gate logic độc lập:

```txt
START_GATE != END_GATE
```

---

# 6. Cách xác định bên lái phụ

Nguồn dùng thuật ngữ:

```txt
bên lái phụ
```

Agent không được hardcode trái/phải mà phải map từ cấu hình xe.

```ts
interface VehicleDrivingSideConfig {
  driverSide: 'LEFT' | 'RIGHT';
  passengerSide: 'LEFT' | 'RIGHT';
}
```

---

# 7. Logic qua vệt bánh xe

```txt
WHEEL_TRACK_NOT_ENTERED
        ↓
FRONT_PASSENGER_WHEEL_PASSED  ──┐
        ↓                        │
REAR_PASSENGER_WHEEL_PASSED   ──┤
        ↓                        │  Soft mode: bất kỳ bánh nào
WHEEL_TRACK_COMPLETED  ←─────────┘  đầu tiên qua zone đều qualify.
                                  Bánh còn lại chưa qua →
                                  trừ 5 điểm (1-shot).
        ↓ (hết 120s mà không bánh nào qua)
DQ_04_WHEEL_TRACK_NOT_COMPLETED
```

Điều kiện hoàn thành (soft mode):

```ts
const wheelTrackCompleted =
  state.frontPassengerWheelPassed || state.rearPassengerWheelPassed;

// Bánh còn lại chưa qua → trừ điểm 1-shot khi qualify.
if (wheelTrackCompleted) {
  if (!state.frontPassengerWheelPassed) {
    penalties.push({
      reason: 'Bánh trước bên lái phụ chưa qua vệt bánh xe',
      points: RULES.wheelTrack.missingWheelPenalty,
    });
  }
  if (!state.rearPassengerWheelPassed) {
    penalties.push({
      reason: 'Bánh sau bên lái phụ chưa qua vệt bánh xe',
      points: RULES.wheelTrack.missingWheelPenalty,
    });
  }
}
```

---

# 8. Các lỗi trừ điểm và đình chỉ

## Lỗi 01 — Đi không đúng hình của hạng xe

```txt
Đi không đúng hình của hạng xe sát hạch
→ bị đình chỉ sát hạch.
```

Event:

```txt
DQ_04_WRONG_EXAM_LAYOUT
```

---

## Lỗi 02 — Bánh trước/sau bên lái phụ không qua vùng vệt bánh xe

**Quy tắc soft mode** (thay thế quy tắc cũ):

```txt
Không có bánh nào (cả trước và sau bên lái phụ) qua vùng vệt bánh xe
→ bị đình chỉ sát hạch.

Chỉ có 1 trong 2 bánh (trước hoặc sau bên lái phụ) qua vùng vệt bánh xe
→ trừ 5 điểm cho mỗi bánh còn lại chưa qua.
```

Event (chỉ phát khi đình chỉ):

```txt
DQ_04_WHEEL_TRACK_NOT_COMPLETED
```

Event phạt điểm (1-shot khi qualify mà thiếu bánh):

```txt
PENALTY_04_FRONT_WHEEL_NOT_PASSED   // -5 khi FR chưa qua
PENALTY_04_REAR_WHEEL_NOT_PASSED    // -5 khi RR chưa qua
```

---

## Lỗi 03 — Bánh xe đè vạch giới hạn

```txt
Bánh xe đè vào vạch giới hạn hình sát hạch
→ mỗi lần trừ 05 điểm.
```

```ts
const PENALTY_BOUNDARY_CONTACT = 5;
```

Không trừ liên tục mỗi frame cho cùng một lần tiếp xúc.

---

## Lỗi 04 — Bánh xe đè vạch kéo dài quá 05 giây

```txt
Bánh xe đè vào vạch giới hạn hình sát hạch,
cứ quá 05 giây,
trừ 05 điểm.
```

```ts
const BOUNDARY_CONTACT_INTERVAL_SEC = 5;
const PENALTY_BOUNDARY_CONTACT_INTERVAL = 5;
```

Nguồn có cả lỗi 03 và lỗi 04 nhưng không làm rõ quan hệ cộng dồn, nên Agent phải giữ hai rule riêng.

---

## Lỗi 05 — Thời gian thực hiện bài quá 02 phút

```txt
Thời gian thực hiện bài sát hạch,
cứ quá 02 phút,
trừ 05 điểm.
```

```ts
const EXAM_04_OVERTIME_INTERVAL_SEC = 120;
const PENALTY_EXAM_04_OVERTIME = 5;
```

Nguồn không làm rõ cách lặp penalty sau nhiều khoảng 02 phút, nên không tự suy diễn thêm.

---

## Lỗi 06 — Lái xe lên vỉa hè

```txt
Lái xe lên vỉa hè
→ bị đình chỉ sát hạch.
```

Event:

```txt
DQ_04_DRIVE_ON_CURB
```

---

## Lỗi 07 — Xử lý không hợp lý gây tai nạn

```txt
Xử lý tình huống không hợp lý gây tai nạn
→ bị đình chỉ sát hạch.
```

Event:

```txt
DQ_04_ACCIDENT
```

---

## Lỗi 08 — Chết máy

```txt
Xe bị chết máy
→ mỗi lần trừ 05 điểm.
```

```ts
const PENALTY_ENGINE_STALL = 5;
```

---

## Lỗi 09 — Vượt 4000 vòng/phút

```txt
Để tốc độ động cơ quá 4000 vòng/phút
→ mỗi lần trừ 05 điểm.
```

```ts
const PENALTY_ENGINE_RPM_EXCEEDED = 5;
```

---

## Lỗi 10 — Vượt tốc độ quy định

```txt
Xe quá tốc độ quy định
→ cứ 03 giây trừ 01 điểm.
```

```ts
const SPEEDING_INTERVAL_SEC = 3;
const PENALTY_SPEEDING_PER_INTERVAL = 1;
```

---

## Lỗi 11 — Tổng thời gian đến bài đang thực hiện quá quy định

```txt
Tổng thời gian đến bài sát hạch đang thực hiện quá quy định
→ cứ 03 giây trừ 01 điểm.
```

```ts
const ARRIVAL_OVERTIME_INTERVAL_SEC = 3;
const PENALTY_ARRIVAL_OVERTIME_PER_INTERVAL = 1;
```

Ngưỡng thời gian cho phép không có trong ảnh này:

```txt
allowedArrivalTimeSec = REQUIRED_INPUT
```

---

# 9. Bảng tổng hợp lỗi

| Mã | Lỗi | Xử lý |
|---|---|---:|
| E04-01 | Đi không đúng hình của hạng xe sát hạch | Đình chỉ |
| E04-02 | Bánh trước/sau bên lái phụ không qua vùng vệt bánh | Đình chỉ |
| E04-03 | Bánh xe đè vạch giới hạn | -5 mỗi lần |
| E04-04 | Bánh xe đè vạch kéo dài quá 5 giây | -5 theo rule nguồn |
| E04-05 | Thời gian thực hiện bài quá 2 phút | -5 theo rule nguồn |
| E04-06 | Lái xe lên vỉa hè | Đình chỉ |
| E04-07 | Xử lý không hợp lý gây tai nạn | Đình chỉ |
| E04-08 | Chết máy | -5 mỗi lần |
| E04-09 | RPM > 4000 | -5 mỗi lần |
| E04-10 | Quá tốc độ quy định | -1 mỗi 3 giây |
| E04-11 | Tổng thời gian đến bài vượt quy định | -1 mỗi 3 giây |

---

# 10. State machine đề xuất

```txt
INACTIVE
    ↓ qua VẠCH VÀNG ĐẦU BÀI
EXAM_04_ACTIVE
    ↓
WHEEL_TRACK_ACTIVE
    ├── wrong layout → DQ
    ├── boundary contact → -5/event
    └── passenger-side wheels pass
             ↓
WHEEL_TRACK_COMPLETED
             ↓
RIGHT_ANGLE_ACTIVE
    ├── boundary contact → -5/event
    ├── sustained contact >5s → penalty rule
    ├── curb → DQ
    └── accident → DQ
             ↓
qua VẠCH VÀNG CUỐI BÀI
             ↓
COMPLETED
```

---

# 11. Runtime state đề xuất

```ts
interface Exam04RuntimeState {
  active: boolean;

  correctLayout: boolean;

  frontPassengerWheelPassed: boolean;
  rearPassengerWheelPassed: boolean;
  wheelTrackCompleted: boolean;

  boundaryContactActive: boolean;
  boundaryContactStartedAt: number | null;
  boundaryContactIntervalCount: number;

  exerciseStartTimestamp: number | null;

  startYellowLineCrossed: boolean;
  endYellowLineCrossed: boolean;

  engineRunning: boolean;
  engineRPM: number;
  speedKmh: number;

  speedingContinuousSec: number;
  arrivalOvertimeContinuousSec: number;

  rpmViolationLatched: boolean;

  disqualified: boolean;
  completed: boolean;
}
```

---

# 12. Config kỹ thuật đề xuất

```ts
export const EXAM_04_RULES = {
  id: 'EXAM_04_WHEEL_TRACK_AND_RIGHT_ANGLE',

  time: {
    limitSec: 120,
    overtimeIntervalSec: 120,
    overtimePenalty: 5
  },

  wheelTrack: {
    missingWheelPenalty: 5 // -5 cho mỗi bánh (FR hoặc RR) còn lại chưa qua zone
  },

  boundary: {
    contactPenalty: 5,
    sustainedContactIntervalSec: 5,
    sustainedContactPenalty: 5
  },

  engine: {
    maxRPM: 4000,
    stallPenalty: 5,
    rpmExceededPenalty: 5
  },

  maxSpeedKmh: {
    B: 24,
    D1: 24,
    D2: 24,
    C1: 20,
    C: 20,
    D: 20
  },

  speeding: {
    intervalSec: 3,
    penaltyPerInterval: 1
  },

  arrivalOvertime: {
    intervalSec: 3,
    penaltyPerInterval: 1,
    allowedTimeSec: null
  },

  disqualify: {
    wrongLayout: true,
    wheelTrackNotCompleted: true,
    driveOnCurb: true,
    accident: true
  }
} as const;
```

---

# 13. Pseudo-code kiểm tra wheel-track

```ts
function updateWheelTrackPass(
  state: Exam04RuntimeState,
  vehicle: VehicleState,
  wheelTrackZone: Region
) {
  if (
    wheelTrackZone.contains(
      vehicle.frontPassengerWheel.contactPoint
    )
  ) {
    state.frontPassengerWheelPassed = true;
  }

  if (
    wheelTrackZone.contains(
      vehicle.rearPassengerWheel.contactPoint
    )
  ) {
    state.rearPassengerWheelPassed = true;
  }

  state.wheelTrackCompleted =
    state.frontPassengerWheelPassed &&
    state.rearPassengerWheelPassed;
}
```

---

# 14. Pseudo-code boundary contact

```ts
function updateBoundaryContact(
  state: Exam04RuntimeState
) {
  const touchingBoundary =
    anyWheelTouchesBoundary();

  if (touchingBoundary && !state.boundaryContactActive) {
    state.boundaryContactActive = true;
    state.boundaryContactStartedAt = now();
    addPenalty(5, 'BOUNDARY_CONTACT');
  }

  if (!touchingBoundary) {
    state.boundaryContactActive = false;
    state.boundaryContactStartedAt = null;
    state.boundaryContactIntervalCount = 0;
    return;
  }

  const elapsedSec =
    state.boundaryContactStartedAt === null
      ? 0
      : (now() - state.boundaryContactStartedAt) / 1000;

  const intervals =
    Math.floor(elapsedSec / 5);

  while (
    state.boundaryContactIntervalCount < intervals
  ) {
    state.boundaryContactIntervalCount++;
    addPenalty(
      5,
      'BOUNDARY_CONTACT_OVER_5_SECONDS'
    );
  }
}
```

> Quan hệ cộng dồn giữa lỗi “mỗi lần đè vạch” và “cứ quá 05 giây” cần được đối chiếu thêm nếu có tài liệu chấm điểm chi tiết hơn.

---

# 15. Event names

Penalty:

```txt
PENALTY_04_BOUNDARY_CONTACT
PENALTY_04_BOUNDARY_CONTACT_OVER_5S
PENALTY_04_EXERCISE_OVERTIME
PENALTY_04_ENGINE_STALL
PENALTY_04_RPM_OVER_4000
PENALTY_04_SPEEDING
PENALTY_04_ARRIVAL_OVERTIME
```

Disqualification:

```txt
DQ_04_WRONG_EXAM_LAYOUT
DQ_04_WHEEL_TRACK_NOT_COMPLETED
DQ_04_DRIVE_ON_CURB
DQ_04_ACCIDENT
```

---

# 16. Quan hệ với quy chuẩn hình học bài 4

Geometry phải lấy từ file quy chuẩn hình học riêng.

Các công thức đã có:

```txt
Bvb = B1 + 0.2
Lvb = a

Sv = 1.5a
Lv = 2.0a
Bv = 2.2b
```

File bài 4 này chịu trách nhiệm:

```txt
- quy trình;
- sensor;
- điều kiện đạt;
- trừ điểm;
- đình chỉ;
- timer.
```

---

# 17. Quan hệ với sân Hiệp Phát

Theo route:

```txt
1A START
  ↓
2A PEDESTRIAN
  ↓
3A HILL
  ↓
4A WHEEL TRACK + RIGHT ANGLE
  ↓
5A INTERSECTION
```

Zone 4A phải nối đúng từ exit của bài 3A và sang bài 5A.

---

# 18. Quy tắc Agent bắt buộc tuân thủ

```txt
RULE_EX04_01
Phải dùng đúng hình theo hạng xe.

RULE_EX04_02
Sai hình hạng xe → đình chỉ.

RULE_EX04_03
Phải kiểm tra riêng bánh trước và bánh sau bên lái phụ.

RULE_EX04_04
Không dùng tâm xe để xác định qua vệt bánh.

RULE_EX04_05
Không có bánh nào qua vệt bánh → đình chỉ.
Chỉ 1 trong 2 bánh qua vệt bánh → trừ wheelTrack.missingWheelPenalty
cho mỗi bánh còn lại (1-shot, latch).

RULE_EX04_05b
Phạt "thiếu bánh" phát đúng 1 lần khi wheelTrackCompleted chuyển từ
false → true, không cộng dồn mỗi frame và không re-trigger khi bánh
đã qualify rời zone rồi vào lại.

RULE_EX04_06
Bánh xe đè vạch → -5 mỗi lần.

RULE_EX04_07
Đè vạch quá 5 giây → áp rule -5 theo nguồn.

RULE_EX04_08
Hoàn thành bài trong 2 phút.

RULE_EX04_09
Quá thời gian bài → áp rule -5 theo nội dung nguồn.

RULE_EX04_10
Lên vỉa hè → đình chỉ.

RULE_EX04_11
Gây tai nạn → đình chỉ.

RULE_EX04_12
Chết máy → -5 mỗi lần.

RULE_EX04_13
RPM > 4000 → -5 mỗi lần.

RULE_EX04_14
Quá tốc độ → -1 mỗi 3 giây.

RULE_EX04_15
Tổng thời gian đến bài vượt quy định
→ -1 mỗi 3 giây.

RULE_EX04_16
Không tự bịa allowedArrivalTimeSec.

RULE_EX04_17
Không tự suy diễn cách cộng dồn lỗi đè vạch
nếu chưa có tài liệu chi tiết hơn.

RULE_EX04_18
Không hardcode passenger side là trái/phải;
phải lấy từ vehicle config.


RULE_EX04_19
Vạch vàng đầu đường là mốc bắt đầu chính thức của bài số 4.

RULE_EX04_20
Timer 02 phút và rule riêng của bài 4 chỉ bắt đầu
khi xe qua vạch vàng đầu bài theo đúng chiều.

RULE_EX04_21
Vạch vàng cuối đường là mốc kết thúc chính thức của bài số 4.

RULE_EX04_22
Chỉ đánh dấu COMPLETED khi xe qua vạch vàng cuối bài
theo đúng chiều sau khi hoàn thành phần bài bắt buộc.

RULE_EX04_23
Không nhầm vạch vàng đầu/cuối bài với vạch giới hạn hình sát hạch.
```

---

# 19. Quan hệ với các file khác

```txt
hiep_phat_exam_yard_standard_v2_corrected.md
→ vị trí zone 4A trong sân.

threejs_exam_yard_specification_v2.md
→ geometry vệt bánh xe và đường vòng vuông góc.

general_driving_exam_rules.md
→ quy tắc chung toàn kỳ thi.

exam_04_wheel_track_and_right_angle.md
→ logic, sensor và chấm lỗi riêng bài 4.
```

---

# 20. Prompt ngắn cho Codex

```txt
Triển khai bài sát hạch số 4 — Qua vệt bánh xe và đường vòng vuông góc.

1. Dùng đúng geometry theo hạng xe.
2. Kiểm tra bánh trước và bánh sau bên lái phụ.
3. Soft mode: chỉ cần ÍT NHẤT 1 trong 2 bánh (FR hoặc RR)
   qua vùng wheel-track là đạt. Bánh còn lại chưa qua → -5/bánh.
4. Không dùng tâm xe để kiểm tra wheel-track.
5. Sai hình hạng xe: đình chỉ.
6. Không bánh nào qua wheel-track: đình chỉ.
7. Phạt "thiếu bánh" là 1-shot, không cộng dồn mỗi frame.
8. Bánh đè vạch: -5 mỗi lần.
9. Bánh đè vạch kéo dài quá 5 giây:
   áp rule -5 theo nguồn.
10. Bài có thời gian 2 phút.
11. Quá thời gian bài:
    áp rule -5 theo nguồn.
12. Chết máy: -5 mỗi lần.
13. RPM > 4000: -5 mỗi lần.
14. Quá tốc độ: -1 mỗi 3 giây.
15. Tổng thời gian đến bài quá quy định:
    -1 mỗi 3 giây.
16. Lên vỉa hè: đình chỉ.
17. Gây tai nạn: đình chỉ.
18. Qua finish line thì chuyển sang bài tiếp theo.
18. Passenger side phải lấy từ vehicle config.
```

---

# 20.1 Quy ước render vạch vàng trong Three.js

Hai vạch vàng nên là mesh/object độc lập để vừa hiển thị vừa gắn sensor:

```txt
EX04_START_YELLOW_LINE
EX04_END_YELLOW_LINE
```

Khuyến nghị scene:

```txt
Exercise04
├── StartYellowLine
├── StartYellowLineSensor
├── WheelTrack
├── RightAngleSection
├── EndYellowLine
└── EndYellowLineSensor
```

Visual và sensor nên tách nhau:

```txt
YellowLineMesh
≠
YellowLineTrigger
```

Vạch sơn có thể nâng nhẹ khỏi mặt đường để tránh z-fighting, nhưng việc này chỉ là kỹ thuật render và không thay đổi vị trí logic của vạch.

---

# 21. Nguồn

```txt
Bài sát hạch số 4:
Qua vệt bánh xe và đường vòng vuông góc

Các cột nguồn:
- Các bước thực hiện
- Yêu cầu đạt được
- Các lỗi trừ điểm
```

File này là bản chuyển đổi nội dung nguồn sang định dạng kỹ thuật phục vụ mô phỏng Three.js/Agent.
