# BÀI SÁT HẠCH SỐ 1 — XUẤT PHÁT
## Đặc tả quy trình, yêu cầu đạt và lỗi trừ điểm cho Agent/Codex

> Nguồn: 02 ảnh người dùng cung cấp về **“Bài sát hạch số 1: xuất phát”**.
>
> Mục đích: chuyển nội dung bài thi số 1 thành đặc tả kỹ thuật để Agent/Codex có thể triển khai logic mô phỏng trong Three.js.
>
> Chỉ sử dụng nội dung có trong nguồn. Không tự bổ sung các quy định chưa được nguồn nêu.

---

# 1. Tên bài

```txt
BÀI SÁT HẠCH SỐ 1: XUẤT PHÁT
```

ID đề xuất:

```txt
EXAM_01_START
```

Marker sân Hiệp Phát:

```txt
1A
```

---

# 2. Mục tiêu bài thi

Thí sinh phải:

```txt
- thắt dây an toàn;
- dừng xe trước vạch xuất phát;
- chờ hiệu lệnh xuất phát;
- bật xi nhan trái;
- khởi hành và đi qua vạch xuất phát đúng thời gian;
- tắt xi nhan trái tại vị trí quy định;
- giữ động cơ hoạt động;
- không vượt 4000 vòng/phút;
- không vượt tốc độ quy định;
- tiếp tục lái xe đến bài sát hạch tiếp theo.
```

---

# 3. Các bước thực hiện

## Bước 1 — Chuẩn bị trước vạch xuất phát

Thí sinh:

```txt
- thắt dây an toàn;
- dừng xe trước vạch xuất phát;
- chờ hiệu lệnh.
```

Trạng thái đề xuất:

```txt
WAITING_FOR_START_COMMAND
```

---

## Bước 2 — Nhận lệnh xuất phát

Lệnh xuất phát được xác định khi:

```txt
- đèn xanh trên xe bật sáng;
- tiếng loa trên xe báo lệnh xuất phát.
```

Sau khi có lệnh:

```txt
- bật đèn xi nhan trái;
- lái xe xuất phát.
```

Trạng thái:

```txt
START_COMMAND_RECEIVED
```

Mốc thời gian:

```ts
startCommandTimestamp = currentTime;
```

---

## Bước 3 — Đi qua vạch xuất phát

Xe phải khởi hành và đi qua vạch xuất phát.

Mốc sensor đề xuất:

```txt
START_LINE
```

Khi phần quy định của xe đi qua vạch:

```ts
emit('START_LINE_CROSSED');
```

---

## Bước 4 — Tắt xi nhan trái

Thí sinh phải:

```txt
tắt xi nhan trái ở khoảng cách 05 mét sau vạch xuất phát
```

Nguồn đồng thời ghi:

```txt
đèn xanh trên xe tắt
```

Mốc geometry/sensor:

```txt
START_LINE
       │
       │ 5.0 m
       ▼
LEFT_SIGNAL_OFF_GATE
```

Cấu hình:

```ts
const LEFT_SIGNAL_OFF_DISTANCE_M = 5.0;
```

---

## Bước 5 — Đi đến bài tiếp theo

Sau khi hoàn tất thao tác xuất phát:

```txt
lái xe đến bài sát hạch tiếp theo.
```

Trạng thái:

```txt
EXAM_01_COMPLETED
```

---

# 4. Yêu cầu đạt được

## 4.1 Dây an toàn

```txt
Phải thắt dây an toàn trước khi xuất phát.
```

Biến đề xuất:

```ts
seatBeltFastened: boolean
```

---

## 4.2 Khởi hành nhẹ nhàng

Yêu cầu nguồn:

```txt
Khởi hành nhẹ nhàng,
không bị rung giật,
trong khoảng thời gian 20 giây.
```

Agent phải theo dõi:

```txt
- thời điểm có lệnh xuất phát;
- thời điểm xe đi qua vạch xuất phát;
- trạng thái khởi hành.
```

Nguồn không cung cấp ngưỡng vật lý cụ thể để xác định:

```txt
“rung giật”
```

Vì vậy nếu mô phỏng cần chấm tự động, tiêu chí rung giật phải lấy từ tài liệu hoặc rule kỹ thuật bổ sung, không được tự suy đoán từ file này.

---

## 4.3 Xi nhan trái trước khi xuất phát

```txt
Phải bật đèn xi nhan trái trước khi xuất phát.
```

Biến:

```ts
leftTurnSignal: boolean
```

---

## 4.4 Tắt xi nhan trái sau vạch

```txt
Tắt đèn xi nhan trái ở khoảng cách 05 mét sau vạch xuất phát.
```

Tại mốc này:

```txt
đèn xanh trên xe tắt.
```

---

## 4.5 Động cơ hoạt động liên tục

```txt
Giữ động cơ hoạt động liên tục.
```

Biến:

```ts
engineRunning: boolean
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

Đây là yêu cầu chung xuyên suốt bài.

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

# 5. Các lỗi trừ điểm và đình chỉ

## Lỗi 01 — Không thắt dây an toàn

Điều kiện:

```txt
Không thắt dây an toàn.
```

Xử lý:

```txt
trừ 05 điểm
```

```ts
const PENALTY_NO_SEATBELT = 5;
```

---

## Lỗi 02 — Không bật xi nhan trái khi xuất phát

Điều kiện:

```txt
Không bật đèn xi nhan trái khi xuất phát.
```

Xử lý:

```txt
trừ 05 điểm
```

```ts
const PENALTY_NO_LEFT_SIGNAL_AT_START = 5;
```

---

## Lỗi 03 — Không tắt xi nhan trái tại mốc 5 m

Điều kiện:

```txt
Không tắt đèn xi nhan trái
ở khoảng cách 05 mét sau vạch xuất phát.
```

Nguồn ghi kèm:

```txt
đèn xanh trên xe tắt.
```

Xử lý:

```txt
trừ 05 điểm
```

```ts
const PENALTY_LEFT_SIGNAL_NOT_OFF_AT_5M = 5;
```

---

## Lỗi 04 — Không bật/tắt xi nhan trái kịp thời

Điều kiện:

```txt
Không bật và tắt đèn xi nhan trái kịp thời.
```

Xử lý:

```txt
trừ 05 điểm
```

```ts
const PENALTY_LEFT_SIGNAL_TIMING = 5;
```

Lưu ý:

```txt
Nguồn liệt kê lỗi này độc lập với lỗi 02 và lỗi 03.
Không tự suy diễn cách cộng dồn nếu chưa có tài liệu chấm điểm đầy đủ hơn.
```

---

## Lỗi 05 — Quá 20 giây chưa đi qua vạch xuất phát

Thời gian bắt đầu tính:

```txt
kể từ khi có lệnh xuất phát
(đèn xanh trên xe bật sáng)
```

Nếu:

```txt
quá 20 giây
và xe chưa đi qua vạch xuất phát
```

thì:

```txt
trừ 05 điểm
```

Cấu hình:

```ts
const START_CROSS_WARNING_TIME_SEC = 20;
const PENALTY_NOT_CROSSED_START_LINE_20S = 5;
```

---

## Lỗi 06 — Quá 30 giây chưa đi qua vạch xuất phát

Nếu:

```txt
quá 30 giây kể từ khi có lệnh xuất phát
và xe chưa đi qua vạch xuất phát
```

thì:

```txt
ĐÌNH CHỈ SÁT HẠCH
```

Cấu hình:

```ts
const START_CROSS_DISQUALIFY_TIME_SEC = 30;
```

Event:

```txt
DISQUALIFIED_START_TIMEOUT
```

---

## Lỗi 07 — Lái xe lên vỉa hè

Điều kiện:

```txt
Lái xe lên vỉa hè.
```

Xử lý:

```txt
ĐÌNH CHỈ SÁT HẠCH
```

Event:

```txt
DISQUALIFIED_DRIVE_ON_CURB
```

---

## Lỗi 08 — Xử lý không hợp lý gây tai nạn

Điều kiện:

```txt
Xử lý tình huống không hợp lý gây tai nạn.
```

Xử lý:

```txt
ĐÌNH CHỈ SÁT HẠCH
```

Event:

```txt
DISQUALIFIED_ACCIDENT
```

---

## Lỗi 09 — Chết máy

Điều kiện:

```txt
Lái xe bị chết máy.
```

Xử lý:

```txt
mỗi lần trừ 05 điểm
```

```ts
const PENALTY_ENGINE_STALL = 5;
```

Đây là lỗi lặp:

```txt
mỗi lần chết máy
→ áp dụng một lần trừ điểm
```

---

## Lỗi 10 — Vượt 4000 vòng/phút

Điều kiện:

```txt
Tốc độ động cơ > 4000 vòng/phút.
```

Xử lý:

```txt
mỗi lần trừ 05 điểm
```

```ts
const PENALTY_ENGINE_RPM_EXCEEDED = 5;
```

Agent cần có cơ chế tránh trừ điểm liên tục mỗi frame.

Nên xác định theo **mỗi lần vi phạm**:

```txt
RPM <= 4000
    ↓
RPM > 4000
    → penalty once
    ↓
RPM trở về <= 4000
    → reset violation latch
```

---

## Lỗi 11 — Vượt tốc độ quy định

Điều kiện:

```txt
speed > maxSpeedForVehicleClass
```

Xử lý:

```txt
cứ 03 giây
→ trừ 01 điểm
```

Cấu hình:

```ts
const SPEEDING_INTERVAL_SEC = 3;
const PENALTY_SPEEDING_PER_INTERVAL = 1;
```

Ví dụ:

```txt
vượt tốc độ 0–<3 giây
→ chưa đủ một chu kỳ 3 giây

vượt liên tục đủ 3 giây
→ -1 điểm

vượt liên tục đủ 6 giây
→ thêm -1 điểm

vượt liên tục đủ 9 giây
→ thêm -1 điểm
```

Agent nên reset bộ đếm khi xe trở về tốc độ hợp lệ.

---

# 6. Timeline bài thi

```txt
BEFORE START
│
├── seat belt ON
├── vehicle before START_LINE
└── wait
      │
      ▼
START COMMAND
green light ON + audio command
      │
      ├── start timer 20s / 30s
      ├── left signal ON
      └── vehicle starts moving
      │
      ▼
CROSS START LINE
      │
      ├── if >20s → -5
      └── if >30s before crossing → disqualified
      │
      ▼
TRAVEL 5 METERS
      │
      ▼
LEFT_SIGNAL_OFF_GATE
      │
      ├── turn left signal OFF
      └── green light OFF
      │
      ▼
CONTINUE TO EXAM 02
```

---

# 7. State machine đề xuất

```txt
PRE_START
    ↓ seat belt + waiting position
WAITING_COMMAND
    ↓ command
COMMAND_RECEIVED
    ↓ left signal ON + move
STARTING
    ↓ cross START_LINE
START_LINE_CROSSED
    ↓ travel 5m
SIGNAL_OFF_ZONE
    ↓ left signal OFF
COMPLETED
```

Trạng thái kết thúc bất thường:

```txt
DISQUALIFIED
```

Có thể xảy ra từ:

```txt
- timeout > 30s chưa qua vạch;
- lái lên vỉa hè;
- gây tai nạn.
```

---

# 8. Sensor cần có trong Three.js

## 8.1 Start waiting zone

```txt
SENSOR_1A_WAITING_ZONE
```

Dùng để xác nhận xe đang:

```txt
dừng trước vạch xuất phát
```

---

## 8.2 Start line

```txt
SENSOR_1A_START_LINE
```

Phát event:

```txt
START_LINE_CROSSED
```

---

## 8.3 Mốc 5 mét sau vạch

```txt
SENSOR_1A_SIGNAL_OFF_5M
```

Vị trí:

```txt
5.0 m sau START_LINE theo hướng chạy
```

Dùng để đánh giá:

```txt
leftTurnSignal == false
```

---

## 8.4 Curb / sidewalk collider

```txt
CURB_COLLIDER
```

Nếu xe đi lên vỉa hè:

```txt
DISQUALIFIED
```

---

# 9. Các biến runtime cần theo dõi

```ts
interface Exam01RuntimeState {
  active: boolean;

  commandReceived: boolean;
  commandTimestamp: number | null;

  seatBeltFastened: boolean;

  leftSignalOn: boolean;

  engineRunning: boolean;
  engineRPM: number;

  speedKmh: number;

  startLineCrossed: boolean;
  startLineCrossTimestamp: number | null;

  distanceAfterStartLineM: number;

  reachedSignalOffGate: boolean;

  engineStallCount: number;

  speedingContinuousSec: number;

  rpmViolationLatched: boolean;

  disqualified: boolean;

  completed: boolean;
}
```

---

# 10. Cấu hình kỹ thuật đề xuất

```ts
export const EXAM_01_START_RULES = {
  id: 'EXAM_01_START',

  signalOffDistanceM: 5,

  startTimeout: {
    penaltyAtSec: 20,
    penaltyPoints: 5,

    disqualifyAtSec: 30
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

  penalties: {
    noSeatbelt: 5,
    noLeftSignalAtStart: 5,
    leftSignalNotOffAt5m: 5,
    leftSignalTiming: 5
  },

  disqualify: {
    startTimeout: true,
    driveOnCurb: true,
    accident: true
  }
} as const;
```

---

# 11. Logic pseudo-code

```ts
function updateExam01Start(
  state: Exam01RuntimeState,
  vehicle: VehicleState,
  dt: number
) {
  if (!state.active || state.completed || state.disqualified) return;

  // 1. Engine stall
  detectEngineStall(vehicle);

  // 2. RPM
  checkRPMViolation(vehicle.engineRPM);

  // 3. Speed
  checkSpeeding(vehicle.speedKmh, dt);

  // 4. Wait for start command
  if (!state.commandReceived) {
    return;
  }

  const elapsed =
    now() - state.commandTimestamp;

  // 5. Before crossing start line
  if (!state.startLineCrossed) {
    if (elapsed > 20 && !penalty20sApplied) {
      addPenalty(5, 'START_LINE_NOT_CROSSED_WITHIN_20S');
    }

    if (elapsed > 30) {
      disqualify('START_LINE_NOT_CROSSED_WITHIN_30S');
      return;
    }
  }

  // 6. Start line crossing
  if (crossedStartLine()) {
    state.startLineCrossed = true;

    if (!state.leftSignalOn) {
      addPenalty(5, 'NO_LEFT_SIGNAL_AT_START');
    }
  }

  // 7. Five meter gate
  if (crossedSignalOff5mGate()) {
    if (state.leftSignalOn) {
      addPenalty(5, 'LEFT_SIGNAL_NOT_OFF_AT_5M');
    }
  }

  // 8. Curb
  if (vehicleOnCurb()) {
    disqualify('DRIVE_ON_CURB');
  }

  // 9. Accident
  if (accidentDetected()) {
    disqualify('ACCIDENT');
  }
}
```

---

# 12. Penalty event names

```txt
PENALTY_01_NO_SEATBELT
PENALTY_01_NO_LEFT_SIGNAL
PENALTY_01_LEFT_SIGNAL_NOT_OFF_5M
PENALTY_01_LEFT_SIGNAL_TIMING
PENALTY_01_START_TIMEOUT_20S
PENALTY_01_ENGINE_STALL
PENALTY_01_RPM_OVER_4000
PENALTY_01_SPEEDING
```

Disqualification:

```txt
DQ_01_START_TIMEOUT_30S
DQ_01_DRIVE_ON_CURB
DQ_01_ACCIDENT
```

---

# 13. Bảng tổng hợp lỗi

| Mã | Lỗi | Xử lý |
|---|---|---:|
| E01-01 | Không thắt dây an toàn | -5 |
| E01-02 | Không bật xi nhan trái khi xuất phát | -5 |
| E01-03 | Không tắt xi nhan trái tại 5 m sau vạch | -5 |
| E01-04 | Không bật/tắt xi nhan trái kịp thời | -5 |
| E01-05 | Quá 20 giây chưa qua vạch xuất phát | -5 |
| E01-06 | Quá 30 giây chưa qua vạch xuất phát | Đình chỉ |
| E01-07 | Lái xe lên vỉa hè | Đình chỉ |
| E01-08 | Xử lý không hợp lý gây tai nạn | Đình chỉ |
| E01-09 | Chết máy | -5 mỗi lần |
| E01-10 | RPM > 4000 | -5 mỗi lần |
| E01-11 | Quá tốc độ quy định | -1 mỗi 3 giây |

---

# 14. Các điểm Agent không được tự suy diễn

```txt
1. Không tự định nghĩa ngưỡng gia tốc để quyết định “rung giật”
   nếu chưa có tài liệu bổ sung.

2. Không tự đổi mốc 5 m sau vạch xuất phát.

3. Không thay 20 giây hoặc 30 giây bằng thời gian khác.

4. Không thay mức -5 hoặc -1 điểm.

5. Không biến lỗi đình chỉ thành lỗi trừ điểm.

6. Không áp tốc độ của hạng B cho hạng C/C1/D.

7. Không trừ RPM liên tục mỗi frame;
   nguồn ghi “mỗi lần”.

8. Không trừ tốc độ mỗi frame;
   nguồn ghi “cứ 03 giây trừ 01 điểm”.
```

---

# 15. Quan hệ với các file khác

File này là rule riêng của bài 1.

Nên sử dụng cùng:

```txt
hiep_phat_exam_yard_standard_v2_corrected.md
→ vị trí thực tế của 1A trên sân.

threejs_exam_yard_specification_v2.md
→ geometry/vạch xuất phát.

general_driving_exam_rules.md
→ yêu cầu chung của toàn kỳ thi.

exam_01_start.md
→ logic, yêu cầu và chấm lỗi riêng bài xuất phát.
```

---

# 16. Prompt ngắn cho Codex

```txt
Triển khai bài sát hạch số 1 — Xuất phát.

Yêu cầu:

1. Xe phải đứng trước START_LINE và chờ lệnh.
2. Kiểm tra dây an toàn.
3. Khi nhận start command:
   - bật đèn xanh trên xe;
   - phát loa báo xuất phát;
   - bắt đầu timer;
   - yêu cầu xi nhan trái.
4. Xe phải qua START_LINE trong 20 giây:
   - quá 20 giây chưa qua: -5 điểm.
5. Quá 30 giây chưa qua START_LINE:
   - đình chỉ sát hạch.
6. Sau START_LINE đúng 5 m:
   - yêu cầu tắt xi nhan trái.
7. Không thắt dây: -5.
8. Không bật xi nhan trái: -5.
9. Không tắt xi nhan tại 5 m: -5.
10. Không bật/tắt xi nhan kịp thời: -5.
11. Chết máy: -5 mỗi lần.
12. RPM > 4000: -5 mỗi lần.
13. Quá tốc độ:
    -1 điểm cho mỗi 3 giây vi phạm liên tục.
14. Lên vỉa hè: đình chỉ.
15. Gây tai nạn: đình chỉ.
16. Sau khi hoàn tất, chuyển sang bài thi tiếp theo.
```

---

# 17. Nguồn

```txt
Bài sát hạch số 1: xuất phát

Các cột nguồn:
- Các bước thực hiện
- Yêu cầu đạt được
- Các lỗi trừ điểm
```

File này là bản chuyển đổi nội dung nguồn sang định dạng kỹ thuật phục vụ mô phỏng Three.js/Agent.
