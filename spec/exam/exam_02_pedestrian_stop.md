# BÀI SÁT HẠCH SỐ 2 — DỪNG XE NHƯỜNG ĐƯỜNG CHO NGƯỜI ĐI BỘ
## Đặc tả quy trình, yêu cầu đạt và lỗi trừ điểm cho Agent/Codex

> Nguồn: ảnh người dùng cung cấp về **“Bài sát hạch số 2: dừng xe nhường đường cho người đi bộ”**.
>
> Mục đích: chuyển nội dung bài thi số 2 thành đặc tả kỹ thuật để Agent/Codex có thể triển khai logic mô phỏng, sensor và chấm lỗi trong Three.js.
>
> Chỉ sử dụng nội dung thể hiện trong nguồn. Không tự bổ sung các quy định chưa được nguồn nêu.

---

# 1. Tên bài

```txt
BÀI SÁT HẠCH SỐ 2:
DỪNG XE NHƯỜNG ĐƯỜNG CHO NGƯỜI ĐI BỘ
```

ID đề xuất:

```txt
EXAM_02_PEDESTRIAN_STOP
```

Marker sân Hiệp Phát:

```txt
2A
```

---

# 2. Mục tiêu bài thi

Thí sinh phải:

```txt
- điều khiển xe tiến đến vạch dừng dành cho người đi bộ;
- dừng xe đúng vị trí quy định;
- khoảng cách A từ hình chiếu thanh cản phía trước của xe
  xuống mặt đường đến vạch dừng không quá 500 mm;
- không dừng quá sớm;
- không vượt quá vạch dừng;
- giữ động cơ hoạt động liên tục;
- không để tốc độ động cơ vượt 4000 vòng/phút;
- không vượt tốc độ quy định;
- tiếp tục lái xe đến bài sát hạch tiếp theo.
```

---

# 3. Các bước thực hiện

## Bước 1 — Tiếp cận vạch dừng

Thí sinh điều khiển xe tiến đến khu vực người đi bộ.

Xe phải dừng sao cho:

```txt
A <= 500 mm
```

Trong đó:

```txt
A = khoảng cách từ hình chiếu thanh cản phía trước của xe
    xuống mặt đường đến vạch dừng.
```

Đổi sang đơn vị Three.js:

```txt
500 mm = 0.5 m
```

Cấu hình:

```ts
const MAX_FRONT_BUMPER_TO_STOP_LINE_M = 0.5;
```

---

## Bước 2 — Dừng xe đúng vị trí

Điểm tham chiếu của xe không phải:

```txt
tâm xe
```

mà là:

```txt
hình chiếu thanh cản phía trước xuống mặt đường.
```

Agent phải kiểm tra vị trí dừng bằng front-bumper reference point.

Ví dụ:

```txt
VehicleRoot
└── FrontBumperReference
```

---

## Bước 3 — Tiếp tục bài thi

Sau khi hoàn thành yêu cầu dừng:

```txt
lái xe đến bài sát hạch tiếp theo.
```

Trạng thái:

```txt
EXAM_02_COMPLETED
```

---

# 4. Yêu cầu đạt được

## 4.1 Dừng đúng khoảng cách

Nguồn quy định:

```txt
Dừng xe cách vạch dừng quy định không quá 500 mm.
```

Tương đương:

```txt
0 <= A <= 0.5 m
```

với điều kiện xe chưa vượt qua vạch.

---

## 4.2 Động cơ hoạt động liên tục

```txt
Giữ động cơ hoạt động liên tục.
```

Biến:

```ts
engineRunning: boolean
```

---

## 4.3 Giới hạn tốc độ động cơ

```txt
engineRPM <= 4000 vòng/phút
```

Cấu hình:

```ts
const MAX_ENGINE_RPM = 4000;
```

---

## 4.4 Chấp hành quy tắc giao thông

```txt
Lái xe theo quy tắc giao thông đường bộ.
```

---

## 4.5 Giới hạn tốc độ xe

### Hạng B, D1, D2

```txt
speed <= 24 km/h
```

### Hạng C1, C, D

```txt
speed <= 20 km/h
```

Cấu hình:

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

# 5. Hình học kiểm tra vị trí dừng

## 5.1 Vạch dừng

Object:

```txt
EX02_STOP_LINE
```

Vạch dừng phải có:

```txt
position
normal/direction
width
```

---

## 5.2 Điểm tham chiếu thanh cản trước

Object logic:

```txt
FRONT_BUMPER_REFERENCE
```

Đây là điểm hoặc đoạn đại diện cho:

```txt
hình chiếu thanh cản phía trước của xe xuống mặt đường.
```

Không dùng:

```txt
VehicleRoot.position
```

để chấm khoảng cách A.

---

## 5.3 Khoảng cách A

Đề xuất quy ước:

```txt
A > 0
= thanh cản trước còn ở trước vạch dừng.

A = 0
= hình chiếu thanh cản trước trùng vạch.

A < 0
= thanh cản trước đã vượt quá vạch.
```

Khoảng hợp lệ:

```txt
0 <= A <= 0.5 m
```

Pseudo-code:

```ts
const A = signedDistanceToStopLine(
  frontBumperReference,
  stopLine
);

const validStopPosition =
  A >= 0 &&
  A <= 0.5;
```

---

# 6. Phân loại trạng thái dừng

## 6.1 Dừng đúng

```txt
0 <= A <= 0.5 m
```

Kết quả:

```txt
VALID_STOP
```

---

## 6.2 Dừng chưa đến vạch quy định

Nguồn có lỗi riêng:

```txt
Dừng xe chưa đến vạch dừng quy định
→ trừ 05 điểm.
```

Trong mô phỏng có thể hiểu về mặt hình học:

```txt
A > 0.5 m
```

Kết quả:

```txt
STOP_TOO_EARLY
```

---

## 6.3 Dừng quá vạch

Nguồn có lỗi riêng:

```txt
Dừng xe quá vạch dừng quy định
→ trừ 05 điểm.
```

Hình học:

```txt
A < 0
```

Kết quả:

```txt
STOP_OVER_LINE
```

---

## 6.4 Không dừng xe ở vạch dừng quy định

Nguồn có lỗi riêng:

```txt
Không dừng xe ở vạch dừng quy định
→ trừ 05 điểm.
```

Agent phải giữ đây là rule độc lập.

Ví dụ:

```txt
xe đi qua vùng bài
nhưng không đạt trạng thái stopped tại vùng vạch dừng
```

Kết quả:

```txt
NO_REQUIRED_STOP
```

Không tự gộp lỗi này với `STOP_TOO_EARLY` hoặc `STOP_OVER_LINE`
nếu chưa có tài liệu chấm điểm đầy đủ về quan hệ cộng dồn.

---

# 7. Các lỗi trừ điểm và đình chỉ

## Lỗi 01 — Không dừng xe ở vạch dừng quy định

```txt
Không dừng xe ở vạch dừng quy định
→ trừ 05 điểm.
```

```ts
const PENALTY_NO_REQUIRED_STOP = 5;
```

---

## Lỗi 02 — Dừng xe chưa đến vạch dừng quy định

```txt
Dừng xe chưa đến vạch dừng quy định
→ trừ 05 điểm.
```

Với mô hình khoảng cách A:

```txt
A > 0.5 m
```

```ts
const PENALTY_STOP_TOO_EARLY = 5;
```

---

## Lỗi 03 — Dừng xe quá vạch dừng quy định

```txt
Dừng xe quá vạch dừng quy định
→ trừ 05 điểm.
```

Hình học:

```txt
A < 0
```

```ts
const PENALTY_STOP_OVER_LINE = 5;
```

---

## Lỗi 04 — Lái xe lên vỉa hè

```txt
Lái xe lên vỉa hè
→ ĐÌNH CHỈ SÁT HẠCH.
```

Event:

```txt
DQ_02_DRIVE_ON_CURB
```

---

## Lỗi 05 — Xử lý không hợp lý gây tai nạn

```txt
Xử lý tình huống không hợp lý gây tai nạn
→ ĐÌNH CHỈ SÁT HẠCH.
```

Event:

```txt
DQ_02_ACCIDENT
```

---

## Lỗi 06 — Chết máy

```txt
Lái xe bị chết máy
→ mỗi lần trừ 05 điểm.
```

```ts
const PENALTY_ENGINE_STALL = 5;
```

---

## Lỗi 07 — Vượt 4000 vòng/phút

```txt
engineRPM > 4000
→ mỗi lần trừ 05 điểm.
```

```ts
const PENALTY_ENGINE_RPM_EXCEEDED = 5;
```

Agent cần latch theo lần vi phạm, không trừ mỗi frame.

---

## Lỗi 08 — Vượt tốc độ quy định

```txt
speed > maxSpeedForVehicleClass
→ cứ 03 giây trừ 01 điểm.
```

```ts
const SPEEDING_INTERVAL_SEC = 3;
const PENALTY_SPEEDING_PER_INTERVAL = 1;
```

---

## Lỗi 09 — Tổng thời gian đến bài đang thực hiện quá quy định

Nguồn quy định:

```txt
Tổng thời gian đến bài sát hạch đang thực hiện quá quy định,
cứ 03 giây trừ 01 điểm.
```

Cấu hình đề xuất:

```ts
const EXERCISE_ARRIVAL_OVERTIME_INTERVAL_SEC = 3;
const PENALTY_EXERCISE_ARRIVAL_OVERTIME_PER_INTERVAL = 1;
```

Nguồn ảnh này không cung cấp mốc thời gian cho phép cụ thể.

Do đó:

```txt
allowedTimeSec = REQUIRED_INPUT
```

Không tự bịa giá trị.

---

# 8. Bảng tổng hợp lỗi

| Mã | Lỗi | Xử lý |
|---|---|---:|
| E02-01 | Không dừng xe ở vạch dừng quy định | -5 |
| E02-02 | Dừng xe chưa đến vạch dừng quy định | -5 |
| E02-03 | Dừng xe quá vạch dừng quy định | -5 |
| E02-04 | Lái xe lên vỉa hè | Đình chỉ |
| E02-05 | Xử lý không hợp lý gây tai nạn | Đình chỉ |
| E02-06 | Chết máy | -5 mỗi lần |
| E02-07 | RPM > 4000 | -5 mỗi lần |
| E02-08 | Quá tốc độ quy định | -1 mỗi 3 giây |
| E02-09 | Tổng thời gian đến bài đang thực hiện quá quy định | -1 mỗi 3 giây |

---

# 9. Sensor cần có trong Three.js

## 9.1 Entry sensor

```txt
SENSOR_2A_ENTRY
```

Kích hoạt logic bài 2.

---

## 9.2 Stop line

```txt
SENSOR_2A_STOP_LINE
```

Dùng cùng `FRONT_BUMPER_REFERENCE` để tính A.

---

## 9.3 Valid stop band

Vùng logic hợp lệ:

```txt
0.0 m → 0.5 m trước vạch.
```

Debug object:

```txt
DEBUG_2A_VALID_STOP_BAND
```

Đây chỉ là vùng logic/debug, không phải vạch sơn bổ sung ngoài thực tế.

---

## 9.4 Over-line sensor

```txt
SENSOR_2A_OVER_LINE
```

Phát hiện hình chiếu thanh cản trước đã vượt vạch.

---

## 9.5 Curb collider

```txt
CURB_COLLIDER
```

Đi lên vỉa hè:

```txt
ĐÌNH CHỈ.
```

---

## 9.6 Exit sensor

```txt
SENSOR_2A_EXIT
```

Hoàn thành bài 2 và chuyển tiếp sang bài 3A.

---

# 10. State machine đề xuất

```txt
INACTIVE
    ↓ entry
APPROACHING_STOP_LINE
    ↓
STOP_EVALUATION
    ├── 0 <= A <= 0.5 → VALID_STOP
    ├── A > 0.5       → STOP_TOO_EARLY
    ├── A < 0         → STOP_OVER_LINE
    └── no stop       → NO_REQUIRED_STOP
    ↓
LEAVING_EXERCISE
    ↓ exit sensor
COMPLETED
```

Trạng thái:

```txt
DISQUALIFIED
```

khi:

```txt
- drive on curb;
- accident.
```

---

# 11. Runtime state đề xuất

```ts
interface Exam02RuntimeState {
  active: boolean;

  enteredExercise: boolean;

  vehicleStopped: boolean;

  frontBumperDistanceToStopLineM: number | null;

  validStopAchieved: boolean;

  stopTooEarlyDetected: boolean;
  stopOverLineDetected: boolean;
  noRequiredStopDetected: boolean;

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
export const EXAM_02_PEDESTRIAN_STOP_RULES = {
  id: 'EXAM_02_PEDESTRIAN_STOP',

  stopPosition: {
    maxDistanceBeforeLineM: 0.5
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

  penalties: {
    noRequiredStop: 5,
    stopTooEarly: 5,
    stopOverLine: 5
  },

  speeding: {
    intervalSec: 3,
    penaltyPerInterval: 1
  },

  arrivalOvertime: {
    intervalSec: 3,
    penaltyPerInterval: 1,
    allowedTimeSec: null // REQUIRED_INPUT
  },

  disqualify: {
    driveOnCurb: true,
    accident: true
  }
} as const;
```

---

# 13. Pseudo-code chấm vị trí dừng

```ts
function evaluateStopPosition(
  frontBumperReference: THREE.Vector3,
  stopLine: StopLine
) {
  const A = signedDistanceToStopLine(
    frontBumperReference,
    stopLine
  );

  if (A < 0) {
    return 'STOP_OVER_LINE';
  }

  if (A > 0.5) {
    return 'STOP_TOO_EARLY';
  }

  return 'VALID_STOP';
}
```

---

# 14. Pseudo-code tổng thể

```ts
function updateExam02(
  state: Exam02RuntimeState,
  vehicle: VehicleState,
  dt: number
) {
  if (!state.active || state.completed || state.disqualified) {
    return;
  }

  checkEngineStall(vehicle);
  checkRPM(vehicle.engineRPM);
  checkSpeed(vehicle.speedKmh, dt);
  checkArrivalOvertime(dt);

  if (vehicleOnCurb()) {
    disqualify('DRIVE_ON_CURB');
    return;
  }

  if (accidentDetected()) {
    disqualify('ACCIDENT');
    return;
  }

  if (vehicleJustStopped()) {
    const result = evaluateStopPosition(
      vehicle.frontBumperReference,
      stopLine
    );

    if (result === 'VALID_STOP') {
      state.validStopAchieved = true;
    }

    if (result === 'STOP_TOO_EARLY') {
      addPenalty(5, 'STOP_TOO_EARLY');
    }

    if (result === 'STOP_OVER_LINE') {
      addPenalty(5, 'STOP_OVER_LINE');
    }
  }

  if (
    crossedExerciseWithoutRequiredStop() &&
    !state.validStopAchieved
  ) {
    addPenalty(5, 'NO_REQUIRED_STOP');
  }

  if (crossedExitSensor()) {
    state.completed = true;
  }
}
```

---

# 15. Penalty event names

```txt
PENALTY_02_NO_REQUIRED_STOP
PENALTY_02_STOP_TOO_EARLY
PENALTY_02_STOP_OVER_LINE
PENALTY_02_ENGINE_STALL
PENALTY_02_RPM_OVER_4000
PENALTY_02_SPEEDING
PENALTY_02_ARRIVAL_OVERTIME
```

Disqualification:

```txt
DQ_02_DRIVE_ON_CURB
DQ_02_ACCIDENT
```

---

# 16. Quan hệ vị trí với sân Hiệp Phát

Theo quy chuẩn sân đã hiệu chỉnh:

```txt
1A START
   │
   ▼
2A PEDESTRIAN STOP
   │
   ▼
HILL FOOT
   │
   ▼
3A HILL
```

Bài 2 nằm trên cùng corridor với 1A và 3A.

Agent không được đặt bài 2 ở một khu vực tách rời khỏi trục xuất phát–dốc.

---

# 17. Quy tắc Agent bắt buộc phải tuân thủ

```txt
RULE_EX02_01
A được đo từ hình chiếu thanh cản trước xuống mặt đường
đến vạch dừng.

RULE_EX02_02
Không dùng tâm xe để đo A.

RULE_EX02_03
Điểm dừng hợp lệ:
0 <= A <= 0.5 m.

RULE_EX02_04
A > 0.5 m:
dừng chưa đến vạch → -5.

RULE_EX02_05
A < 0:
dừng quá vạch → -5.

RULE_EX02_06
Không thực hiện việc dừng theo yêu cầu → -5.

RULE_EX02_07
Lên vỉa hè → đình chỉ.

RULE_EX02_08
Gây tai nạn → đình chỉ.

RULE_EX02_09
Chết máy → -5 mỗi lần.

RULE_EX02_10
RPM > 4000 → -5 mỗi lần.

RULE_EX02_11
Quá tốc độ → -1 mỗi 3 giây.

RULE_EX02_12
Tổng thời gian đến bài đang thực hiện quá quy định
→ -1 mỗi 3 giây.

RULE_EX02_13
Không tự bịa threshold thời gian đến bài.

RULE_EX02_14
Bài 2 nằm giữa 1A và 3A trên cùng corridor sân Hiệp Phát.
```

---

# 18. Quan hệ với các file khác

```txt
hiep_phat_exam_yard_standard_v2_corrected.md
→ vị trí của 2A trên sân.

threejs_exam_yard_specification_v2.md
→ geometry vạch dừng và vạch người đi bộ.

general_driving_exam_rules.md
→ quy tắc chung toàn kỳ thi.

exam_02_pedestrian_stop.md
→ logic, sensor và chấm lỗi riêng bài 2.
```

---

# 19. Prompt ngắn cho Codex

```txt
Triển khai bài sát hạch số 2 — Dừng xe nhường đường cho người đi bộ.

1. Kích hoạt bài khi xe vào zone 2A.
2. Dùng FRONT_BUMPER_REFERENCE để đo khoảng cách A tới STOP_LINE.
3. Hợp lệ: 0 <= A <= 0.5 m.
4. Không dừng: -5.
5. A > 0.5 m: -5.
6. A < 0: -5.
7. Chết máy: -5 mỗi lần.
8. RPM > 4000: -5 mỗi lần.
9. Quá tốc độ: -1 mỗi 3 giây.
10. Tổng thời gian đến bài vượt quy định: -1 mỗi 3 giây.
11. Lên vỉa hè: đình chỉ.
12. Gây tai nạn: đình chỉ.
13. Sau khi hoàn thành, chuyển sang bài 3A.
14. Không dùng tâm xe để chấm khoảng cách dừng.
```

---

# 20. Nguồn

```txt
Bài sát hạch số 2:
Dừng xe nhường đường cho người đi bộ

Các cột nguồn:
- Các bước thực hiện
- Yêu cầu đạt được
- Các lỗi trừ điểm
```

File này là bản chuyển đổi nội dung nguồn sang định dạng kỹ thuật phục vụ mô phỏng Three.js/Agent.
