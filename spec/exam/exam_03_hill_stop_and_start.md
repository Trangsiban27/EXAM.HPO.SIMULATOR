# BÀI SÁT HẠCH SỐ 3 — DỪNG VÀ KHỞI HÀNH XE NGANG DỐC
## Đặc tả quy trình, yêu cầu đạt và lỗi trừ điểm cho Agent/Codex

> Nguồn: ảnh người dùng cung cấp về **“Bài sát hạch số 3: dừng và khởi hành xe ngang dốc”**.
>
> Mục đích: chuyển nội dung bài thi số 3 thành đặc tả kỹ thuật để Agent/Codex có thể triển khai logic mô phỏng, sensor và chấm lỗi trong Three.js.
>
> Chỉ sử dụng nội dung thể hiện trong nguồn. Các quy ước hình học hoặc cách triển khai kỹ thuật bên dưới chỉ nhằm giúp mô phỏng; không thay đổi nội dung quy định trong nguồn.

---

# 1. Tên bài

```txt
BÀI SÁT HẠCH SỐ 3:
DỪNG VÀ KHỞI HÀNH XE NGANG DỐC
```

ID đề xuất:

```txt
EXAM_03_HILL_STOP_AND_START
```

Marker sân Hiệp Phát:

```txt
3A
```

---

# 2. Mục tiêu bài thi

Thí sinh phải:

```txt
- điều khiển xe lên dốc;
- dừng xe đúng vị trí tại vạch dừng;
- khoảng cách A từ hình chiếu thanh cản phía trước
  xuống mặt đường đến vạch dừng không quá 500 mm;
- khởi hành lên dốc nhẹ nhàng;
- không để xe tụt dốc quá 500 mm;
- đưa xe qua vị trí dừng trong thời gian 30 giây;
- giữ động cơ hoạt động liên tục;
- không để tốc độ động cơ vượt 4000 vòng/phút;
- không vượt tốc độ quy định;
- tiếp tục lái xe đến bài sát hạch tiếp theo.
```

---

# 3. Các bước thực hiện

## Bước 1 — Dừng xe tại vạch dừng trên dốc

Nguồn quy định:

```txt
Dừng xe để khoảng cách từ hình chiếu thanh cản phía trước
của xe xuống mặt đường đến vạch dừng
(khoảng cách A) không quá 500 mm.
```

Đổi sang đơn vị Three.js:

```txt
500 mm = 0.5 m
```

Cấu hình:

```ts
const MAX_FRONT_BUMPER_TO_STOP_LINE_M = 0.5;
```

Điểm tham chiếu phải là:

```txt
FRONT_BUMPER_REFERENCE
```

Không dùng tâm xe.

---

## Bước 2 — Khởi hành lên dốc

Sau khi dừng:

```txt
khởi hành lên dốc nhẹ nhàng;
không bị tụt dốc;
bảo đảm thời gian quy định.
```

Nguồn yêu cầu cụ thể:

```txt
- không tụt dốc quá 500 mm;
- xe phải qua vị trí dừng trong 30 giây.
```

---

## Bước 3 — Đi đến bài tiếp theo

Sau khi hoàn tất bài dốc:

```txt
Lái xe đến bài sát hạch tiếp theo.
```

Trạng thái:

```txt
EXAM_03_COMPLETED
```

---

# 4. Yêu cầu đạt được

## 4.1 Dừng đúng vị trí

```txt
Dừng xe cách vạch dừng quy định không quá 500 mm.
```

Theo quy ước kỹ thuật của mô phỏng:

```txt
A = signed distance từ FRONT_BUMPER_REFERENCE tới STOP_LINE
```

Vùng dừng hợp lệ:

```txt
0 <= A <= 0.5 m
```

trong đó:

```txt
A > 0  : thanh cản trước chưa tới vạch
A = 0  : thanh cản trước trùng vạch
A < 0  : thanh cản trước đã vượt vạch
```

---

## 4.2 Khởi hành êm dịu

Nguồn yêu cầu:

```txt
Khởi hành xe êm dịu.
```

Nguồn không cung cấp ngưỡng vật lý cụ thể cho:

```txt
“êm dịu”
```

Agent không được tự đặt ngưỡng gia tốc/jerk để chấm chính thức nếu chưa có tài liệu bổ sung.

---

## 4.3 Không tụt dốc quá 500 mm

Nguồn yêu cầu:

```txt
không bị tụt dốc quá 500 mm.
```

Đổi đơn vị:

```txt
500 mm = 0.5 m
```

Cấu hình:

```ts
const MAX_ROLLBACK_M = 0.5;
```

Khoảng tụt dốc phải được tính:

```txt
kể từ vị trí xe đã dừng
```

---

## 4.4 Qua vị trí dừng trong 30 giây

Nguồn yêu cầu:

```txt
Xe qua vị trí dừng trong khoảng thời gian 30 giây.
```

Mốc bắt đầu timer:

```txt
kể từ khi dừng xe
```

Cấu hình:

```ts
const HILL_START_TIME_LIMIT_SEC = 30;
```

---

## 4.5 Động cơ hoạt động liên tục

```txt
Giữ động cơ hoạt động liên tục.
```

---

## 4.6 Giới hạn tốc độ động cơ

```txt
engineRPM <= 4000 vòng/phút
```

Cấu hình:

```ts
const MAX_ENGINE_RPM = 4000;
```

---

## 4.7 Chấp hành quy tắc giao thông

```txt
Lái xe theo quy tắc giao thông đường bộ.
```

---

## 4.8 Giới hạn tốc độ xe

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

# 5. Mốc hình học cần có trong Three.js

## 5.1 Chân dốc

```txt
HILL_FOOT
```

Đây là mốc hình học của dốc.

Không đồng nhất:

```txt
HILL_FOOT != STOP_LINE_3A
```

---

## 5.2 Vạch dừng bài 3A

```txt
EX03_STOP_LINE
```

Đây là vạch dùng để:

```txt
- chấm vị trí dừng;
- xác định xe chưa tới vạch;
- xác định xe vượt vạch;
- xác định thời điểm xe qua vị trí dừng sau khi khởi hành.
```

---

## 5.3 Điểm tham chiếu thanh cản trước

```txt
FRONT_BUMPER_REFERENCE
```

Dùng để tính khoảng cách `A`.

---

## 5.4 Mốc vị trí dừng ban đầu

Khi xe đạt trạng thái dừng:

```txt
STOPPED_POSITION_REFERENCE
```

phải lưu lại vị trí để tính tụt dốc.

Ví dụ:

```ts
state.stoppedPosition = vehicle.position.clone();
```

Tốt hơn là lưu theo trục dọc của dốc thay vì Euclidean distance.

---

# 6. Cách tính tụt dốc cho mô phỏng

## 6.1 Nguyên tắc

Nguồn quy định:

```txt
Xe bị tụt dốc quá 500 mm kể từ khi dừng xe
→ đình chỉ sát hạch.
```

Do đó Agent cần lưu:

```txt
vị trí dừng ban đầu
```

và đo chuyển động lùi theo hướng xuống dốc.

---

## 6.2 Trục dọc dốc

Đề xuất:

```txt
HILL_FORWARD_AXIS
```

là vector đơn vị hướng:

```txt
lên dốc.
```

Khi xe lùi ngược vector này, đó là rollback.

Pseudo-code:

```ts
const displacement =
  currentVehiclePosition
    .clone()
    .sub(stoppedPosition);

const forwardDelta =
  displacement.dot(hillForwardAxis);

const rollbackM =
  Math.max(0, -forwardDelta);
```

Điều kiện đình chỉ:

```ts
if (rollbackM > 0.5) {
  disqualify('ROLLBACK_OVER_500MM');
}
```

---

# 7. Các lỗi trừ điểm và đình chỉ

## Lỗi 01 — Không dừng xe ở vạch dừng quy định

Nguồn:

```txt
Không dừng xe ở vạch dừng quy định
→ bị đình chỉ sát hạch.
```

Đây là điểm khác quan trọng so với bài 2.

Xử lý:

```txt
ĐÌNH CHỈ SÁT HẠCH
```

Event:

```txt
DQ_03_NO_REQUIRED_STOP
```

---

## Lỗi 02 — Dừng xe chưa đến vạch dừng

Nguồn:

```txt
Dừng xe chưa đến vạch dừng quy định
→ trừ 05 điểm.
```

Theo mô hình khoảng cách A:

```txt
A > 0.5 m
```

Cấu hình:

```ts
const PENALTY_STOP_TOO_EARLY = 5;
```

---

## Lỗi 03 — Dừng xe quá vạch

Nguồn:

```txt
Dừng xe quá vạch dừng quy định
→ bị đình chỉ sát hạch.
```

Theo mô hình:

```txt
A < 0
```

Xử lý:

```txt
ĐÌNH CHỈ SÁT HẠCH
```

Event:

```txt
DQ_03_STOP_OVER_LINE
```

---

## Lỗi 04 — Quá 30 giây không khởi hành xe qua vạch dừng

Nguồn:

```txt
Quá thời gian 30 giây kể từ khi dừng xe
không khởi hành xe qua vạch dừng
→ bị đình chỉ sát hạch.
```

Cấu hình:

```ts
const HILL_START_TIME_LIMIT_SEC = 30;
```

Event:

```txt
DQ_03_START_TIMEOUT_30S
```

---

## Lỗi 05 — Tụt dốc quá 500 mm

Nguồn:

```txt
Xe bị tụt dốc quá 500 mm kể từ khi dừng xe
→ bị đình chỉ sát hạch.
```

Cấu hình:

```ts
const MAX_ROLLBACK_M = 0.5;
```

Event:

```txt
DQ_03_ROLLBACK_OVER_500MM
```

---

## Lỗi 06 — Xử lý không hợp lý gây tai nạn

Nguồn:

```txt
Xử lý tình huống không hợp lý gây tai nạn
→ đình chỉ sát hạch.
```

Event:

```txt
DQ_03_ACCIDENT
```

---

## Lỗi 07 — Chết máy

Nguồn:

```txt
Xe bị chết máy
→ mỗi lần trừ 05 điểm.
```

Cấu hình:

```ts
const PENALTY_ENGINE_STALL = 5;
```

---

## Lỗi 08 — Vượt 4000 vòng/phút

Nguồn:

```txt
Để tốc độ động cơ quá 4000 vòng/phút
→ mỗi lần trừ 05 điểm.
```

Cấu hình:

```ts
const PENALTY_ENGINE_RPM_EXCEEDED = 5;
```

Agent phải latch theo lần vi phạm, không trừ theo từng frame.

---

## Lỗi 09 — Vượt tốc độ quy định

Nguồn:

```txt
Lái xe quá tốc độ quy định
→ cứ 03 giây trừ 01 điểm.
```

Cấu hình:

```ts
const SPEEDING_INTERVAL_SEC = 3;
const PENALTY_SPEEDING_PER_INTERVAL = 1;
```

---

## Lỗi 10 — Tổng thời gian đến bài đang thực hiện quá quy định

Nguồn:

```txt
Tổng thời gian đến bài sát hạch đang thực hiện quá quy định
→ cứ 03 giây trừ 01 điểm.
```

Cấu hình:

```ts
const EXERCISE_ARRIVAL_OVERTIME_INTERVAL_SEC = 3;
const PENALTY_ARRIVAL_OVERTIME_PER_INTERVAL = 1;
```

Nguồn ảnh này không nêu giá trị thời gian cho phép cụ thể:

```txt
allowedTimeSec = REQUIRED_INPUT
```

---

# 8. Bảng tổng hợp lỗi

| Mã | Lỗi | Xử lý |
|---|---|---:|
| E03-01 | Không dừng xe ở vạch dừng quy định | Đình chỉ |
| E03-02 | Dừng xe chưa đến vạch dừng | -5 |
| E03-03 | Dừng xe quá vạch dừng | Đình chỉ |
| E03-04 | Quá 30 giây từ khi dừng mà chưa khởi hành qua vạch | Đình chỉ |
| E03-05 | Tụt dốc quá 500 mm kể từ khi dừng | Đình chỉ |
| E03-06 | Xử lý không hợp lý gây tai nạn | Đình chỉ |
| E03-07 | Chết máy | -5 mỗi lần |
| E03-08 | RPM > 4000 | -5 mỗi lần |
| E03-09 | Quá tốc độ quy định | -1 mỗi 3 giây |
| E03-10 | Tổng thời gian đến bài vượt quy định | -1 mỗi 3 giây |

---

# 9. Sensor cần có trong Three.js

## 9.1 Entry sensor

```txt
SENSOR_3A_ENTRY
```

Kích hoạt bài khi xe đi vào vùng dốc.

---

## 9.2 Stop line sensor

```txt
SENSOR_3A_STOP_LINE
```

Dùng để tính:

```txt
A
```

và phát hiện xe qua vạch sau khi khởi hành.

---

## 9.3 Valid stop band

Vùng logic:

```txt
0 → 0.5 m trước STOP_LINE.
```

Object debug:

```txt
DEBUG_3A_VALID_STOP_BAND
```

---

## 9.4 Rollback monitor

Không nhất thiết là một collider vật lý.

Có thể là subsystem:

```txt
SENSOR_3A_ROLLBACK_MONITOR
```

theo dõi displacement từ vị trí dừng.

---

## 9.5 Hill stop crossing gate

```txt
SENSOR_3A_PASS_STOP_POSITION
```

Khi xe khởi hành và vượt qua vị trí/vạch dừng:

```txt
hillStartCompleted = true
```

---

## 9.6 Curb / boundary collision

Nếu geometry dốc có vùng không được phép đi lên:

```txt
CURB_COLLIDER
BOUNDARY_COLLIDER
```

Nguồn ảnh bài 3 chỉ nêu tai nạn là đình chỉ; không nêu riêng lỗi "lên vỉa hè" trong bảng bài 3 này.

Agent không được tự thêm một lỗi đình chỉ lên vỉa hè riêng cho bài 3 từ file này.

---

## 9.7 Exit sensor

```txt
SENSOR_3A_EXIT
```

Sau khi xuống dốc và đi tiếp theo route, bài 3 kết thúc.

---

# 10. State machine đề xuất

```txt
INACTIVE
    ↓ entry
APPROACHING_STOP_LINE
    ↓
STOP_EVALUATION
    ├── no stop       → DISQUALIFIED
    ├── A > 0.5       → -5, continue
    ├── A < 0         → DISQUALIFIED
    └── 0<=A<=0.5     → VALID_STOP
                         ↓
                    START_TIMER_30S
                         ↓
                    HILL_STARTING
                         ├── rollback >0.5m → DISQUALIFIED
                         ├── engine stall   → -5 each
                         └── cross stop line
                                  ↓
                            START_COMPLETED
                                  ↓
                             LEAVE_HILL
                                  ↓
                              COMPLETED
```

---

# 11. Timer 30 giây

Timer phải bắt đầu:

```txt
kể từ khi dừng xe.
```

Không bắt đầu:

```txt
- từ lúc vào bài;
- từ chân dốc;
- từ lúc chạm vạch;
- từ lúc đạp ga.
```

Runtime:

```ts
state.stopTimestamp = now();
```

Kiểm tra:

```ts
if (
  state.vehicleHasStopped &&
  !state.crossedStopLineAfterRestart &&
  now() - state.stopTimestamp > 30_000
) {
  disqualify('START_TIMEOUT_30S');
}
```

---

# 12. Runtime state đề xuất

```ts
interface Exam03RuntimeState {
  active: boolean;

  enteredExercise: boolean;

  vehicleStopped: boolean;
  stopTimestamp: number | null;

  frontBumperDistanceToStopLineM: number | null;

  validStopAchieved: boolean;
  stopTooEarlyDetected: boolean;

  stoppedPosition: THREE.Vector3 | null;

  rollbackM: number;

  crossedStopLineAfterRestart: boolean;

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

# 13. Config kỹ thuật đề xuất

```ts
export const EXAM_03_HILL_RULES = {
  id: 'EXAM_03_HILL_STOP_AND_START',

  stopPosition: {
    maxDistanceBeforeLineM: 0.5
  },

  hillStart: {
    maxRollbackM: 0.5,
    mustCrossStopPositionWithinSec: 30
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
    stopTooEarly: 5
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
    noRequiredStop: true,
    stopOverLine: true,
    startTimeout30s: true,
    rollbackOver500mm: true,
    accident: true
  }
} as const;
```

---

# 14. Pseudo-code chấm bài

```ts
function updateExam03(
  state: Exam03RuntimeState,
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

  if (accidentDetected()) {
    disqualify('ACCIDENT');
    return;
  }

  if (!state.vehicleStopped) {
    if (vehicleJustStopped()) {
      state.vehicleStopped = true;
      state.stopTimestamp = now();
      state.stoppedPosition = vehicle.position.clone();

      const A = signedDistanceToStopLine(
        vehicle.frontBumperReference,
        stopLine
      );

      if (A < 0) {
        disqualify('STOP_OVER_LINE');
        return;
      }

      if (A > 0.5) {
        addPenalty(5, 'STOP_TOO_EARLY');
      } else {
        state.validStopAchieved = true;
      }
    }

    if (crossedStopLineWithoutStopping()) {
      disqualify('NO_REQUIRED_STOP');
      return;
    }
  }

  if (state.vehicleStopped && !state.crossedStopLineAfterRestart) {
    state.rollbackM = calculateRollback(
      state.stoppedPosition,
      vehicle.position,
      hillForwardAxis
    );

    if (state.rollbackM > 0.5) {
      disqualify('ROLLBACK_OVER_500MM');
      return;
    }

    const elapsedSec =
      (now() - state.stopTimestamp) / 1000;

    if (elapsedSec > 30) {
      disqualify('START_TIMEOUT_30S');
      return;
    }

    if (crossedStopLineForward()) {
      state.crossedStopLineAfterRestart = true;
    }
  }

  if (crossedExitSensor()) {
    state.completed = true;
  }
}
```

---

# 15. Event names

Penalty:

```txt
PENALTY_03_STOP_TOO_EARLY
PENALTY_03_ENGINE_STALL
PENALTY_03_RPM_OVER_4000
PENALTY_03_SPEEDING
PENALTY_03_ARRIVAL_OVERTIME
```

Disqualification:

```txt
DQ_03_NO_REQUIRED_STOP
DQ_03_STOP_OVER_LINE
DQ_03_START_TIMEOUT_30S
DQ_03_ROLLBACK_OVER_500MM
DQ_03_ACCIDENT
```

---

# 16. Quan hệ vị trí với sân Hiệp Phát

Theo file sân đã hiệu chỉnh:

```txt
1A START
   │
   ▼
2A PEDESTRIAN
   │
   ▼
HILL_FOOT
   │
   ▼
UPHILL
   │
   ▼
3A STOP LINE
   │
   ▼
HILL CREST
   │
   ▼
DOWNHILL
   │
   ▼
ROUTE TO 4A
```

Điểm bắt buộc:

```txt
3A_STOP_LINE không phải HILL_FOOT.
```

Bài 3 nằm trên cùng hành lang logic với 1A và 2A trước khi tuyến chuyển sang các bài tiếp theo.

---

# 17. Quy tắc Agent bắt buộc tuân thủ

```txt
RULE_EX03_01
Đo khoảng cách dừng bằng hình chiếu thanh cản trước.

RULE_EX03_02
Điểm dừng hợp lệ:
0 <= A <= 0.5 m.

RULE_EX03_03
Không dừng tại vạch:
đình chỉ.

RULE_EX03_04
A > 0.5 m:
-5 điểm.

RULE_EX03_05
A < 0:
đình chỉ.

RULE_EX03_06
Timer 30 giây bắt đầu từ thời điểm xe dừng.

RULE_EX03_07
Quá 30 giây chưa khởi hành qua vạch:
đình chỉ.

RULE_EX03_08
Rollback được tính từ vị trí xe đã dừng.

RULE_EX03_09
Rollback > 0.5 m:
đình chỉ.

RULE_EX03_10
Chết máy:
-5 mỗi lần.

RULE_EX03_11
RPM > 4000:
-5 mỗi lần.

RULE_EX03_12
Quá tốc độ:
-1 mỗi 3 giây.

RULE_EX03_13
Tổng thời gian đến bài vượt quy định:
-1 mỗi 3 giây.

RULE_EX03_14
Không tự bịa allowedTimeSec cho thời gian đến bài.

RULE_EX03_15
Không tự đặt ngưỡng “khởi hành êm dịu” nếu chưa có tài liệu định lượng.

RULE_EX03_16
Không đồng nhất STOP_LINE_3A với HILL_FOOT.
```

---

# 18. Quan hệ với các file khác

```txt
hiep_phat_exam_yard_standard_v2_corrected.md
→ vị trí 3A và topology dốc trên sân.

threejs_exam_yard_specification_v2.md
→ geometry dốc, độ dốc, chiều dài và vị trí tương đối của vạch.

general_driving_exam_rules.md
→ quy tắc chung toàn kỳ thi.

exam_03_hill_stop_and_start.md
→ logic và chấm lỗi riêng bài 3.
```

---

# 19. Prompt ngắn cho Codex

```txt
Triển khai bài sát hạch số 3 — Dừng và khởi hành xe ngang dốc.

1. Kích hoạt tại zone 3A.
2. Dùng FRONT_BUMPER_REFERENCE để đo A tới STOP_LINE.
3. Hợp lệ: 0 <= A <= 0.5 m.
4. Không dừng tại vạch: đình chỉ.
5. A > 0.5 m: -5.
6. A < 0: đình chỉ.
7. Khi xe dừng:
   - lưu stoppedPosition;
   - bắt đầu timer 30 giây.
8. Rollback > 0.5 m từ stoppedPosition: đình chỉ.
9. Sau 30 giây chưa khởi hành qua STOP_LINE: đình chỉ.
10. Chết máy: -5 mỗi lần.
11. RPM > 4000: -5 mỗi lần.
12. Quá tốc độ: -1 mỗi 3 giây.
13. Tổng thời gian đến bài vượt quy định: -1 mỗi 3 giây.
14. Gây tai nạn: đình chỉ.
15. Không dùng tâm xe để đo vị trí dừng.
16. Không đặt STOP_LINE_3A tại HILL_FOOT.
17. Sau khi hoàn tất dốc, chuyển sang route dẫn tới bài tiếp theo.
```

---

# 20. Nguồn

```txt
Bài sát hạch số 3:
Dừng và khởi hành xe ngang dốc

Các nhóm nội dung nguồn:
- Các bước thực hiện
- Yêu cầu đạt được
- Các lỗi trừ điểm
```

File này là bản chuyển đổi nội dung nguồn sang định dạng kỹ thuật phục vụ mô phỏng Three.js/Agent.
