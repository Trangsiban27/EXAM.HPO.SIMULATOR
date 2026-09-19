# BÀI SÁT HẠCH SỐ 5 — QUA NGÃ TƯ CÓ TÍN HIỆU ĐIỀU KHIỂN GIAO THÔNG

## 1. Thông tin chung

```txt
Tên bài: Qua ngã tư có tín hiệu điều khiển giao thông
ID đề xuất: EXAM_05_SIGNALIZED_INTERSECTION
Marker sân Hiệp Phát: 5A
```

Theo route sân Hiệp Phát:

```txt
5A = đi thẳng qua ngã tư có tín hiệu điều khiển giao thông
```

Tuy nhiên tài liệu nguồn cũng mô tả yêu cầu xi nhan khi rẽ trái hoặc rẽ phải, vì vậy module ngã tư nên hỗ trợ:

```txt
STRAIGHT
LEFT
RIGHT
```

---

# 2. Các bước thực hiện

## 2.1 Chấp hành tín hiệu đèn

Nguồn quy định:

```txt
- Đèn đỏ: phải dừng lại.
- Đèn xanh hoặc vàng: được phép đi.
- Đèn vàng:
  + nếu đã đi quá vạch dừng thì được phép đi;
  + nếu chưa đến vạch dừng thì phải dừng lại.
```

Logic đề xuất:

```ts
function canProceed(
  light: 'RED' | 'YELLOW' | 'GREEN',
  hasPassedStopLine: boolean
) {
  if (light === 'RED') return false;
  if (light === 'GREEN') return true;

  // YELLOW
  return hasPassedStopLine;
}
```

---

## 2.2 Dừng xe tại vạch dừng

Ở cột **Các bước thực hiện**, nguồn ghi:

```txt
Khoảng cách A từ hình chiếu thanh cản phía trước
xuống mặt đường đến vạch dừng
không quá 500 mm.
```

Tức:

```txt
A <= 0.5 m
```

Điểm tham chiếu phải là:

```txt
FRONT_BUMPER_REFERENCE
```

Không dùng tâm xe.

---

# 3. Lưu ý quan trọng về khoảng cách dừng

Trong cùng ảnh nguồn có hai giá trị khác nhau.

## Cột “Các bước thực hiện”

```txt
A không quá 500 mm
```

## Cột “Yêu cầu đạt được”

```txt
Dừng xe cách vạch dừng quy định không quá 1000 mm
```

Do đó Agent không được tự kết luận một trong hai giá trị là sai.

Cấu hình nên giữ:

```ts
const STOP_DISTANCE_SOURCE = {
  procedureMaxM: 0.5,
  requirementMaxM: 1.0,
  verifiedMaxM: null
};
```

Cho đến khi có tài liệu xác nhận:

```txt
STOP_DISTANCE_THRESHOLD = NEEDS_SOURCE_VERIFICATION
```

---

# 4. Xi nhan

## Rẽ trái

```txt
Bật đèn xi nhan trái khi qua ngã tư rẽ trái.
```

## Rẽ phải

```txt
Bật đèn xi nhan phải khi qua ngã tư rẽ phải.
```

Rule:

```ts
if (turnDirection === 'LEFT' && !leftSignalOn) {
  addPenalty(5, 'NO_LEFT_SIGNAL');
}

if (turnDirection === 'RIGHT' && !rightSignalOn) {
  addPenalty(5, 'NO_RIGHT_SIGNAL');
}
```

---

# 5. Thời gian qua ngã tư

Nguồn yêu cầu:

```txt
Xe qua ngã tư trong thời gian 20 giây.
```

Các lỗi thời gian được tính:

```txt
từ khi đèn tín hiệu màu xanh bật sáng
```

Mốc kết thúc:

```txt
vạch kết thúc ngã tư
```

Do đó cần:

```txt
TRAFFIC_LIGHT_GREEN_EVENT
INTERSECTION_END_LINE
```

---

# 6. Không vi phạm vạch kẻ đường

Nguồn yêu cầu:

```txt
Lái xe qua ngã tư không vi phạm vạch kẻ đường.
```

Nên tạo:

```txt
LANE_MARKING_SENSOR
ROUTE_BOUNDARY_SENSOR
```

---

# 7. Yêu cầu đạt được

Nguồn liệt kê:

```txt
1. Chấp hành theo tín hiệu đèn điều khiển giao thông.

2. Dừng xe cách vạch dừng quy định không quá 1000 mm.

3. Bật xi nhan trái khi rẽ trái.

4. Bật xi nhan phải khi rẽ phải.

5. Xe qua ngã tư trong thời gian 20 giây.

6. Lái xe qua ngã tư không vi phạm quy tắc giao thông đường bộ.

7. Giữ động cơ hoạt động liên tục.

8. Tốc độ động cơ không quá 4000 vòng/phút.

9. Tốc độ xe không quá:
   - 24 km/h: hạng B, D1, D2;
   - 20 km/h: hạng C1, C, D.
```

---

# 8. Giới hạn động cơ và tốc độ

```ts
const MAX_ENGINE_RPM = 4000;

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

# 9. Sensor và object cần có

```txt
SENSOR_5A_ENTRY

EX05_STOP_LINE
SENSOR_5A_STOP_LINE

TRAFFIC_LIGHT_RED
TRAFFIC_LIGHT_YELLOW
TRAFFIC_LIGHT_GREEN

EX05_INTERSECTION_END_LINE
SENSOR_5A_INTERSECTION_END_LINE

EX05_LANE_MARKINGS
EX05_MARKING_VIOLATION_SENSOR

EX05_CURB_COLLIDER
```

---

# 10. Timer đèn xanh

Timer 20/30 giây bắt đầu đúng lúc:

```txt
đèn xanh bật sáng
```

Không bắt đầu từ lúc:

```txt
- xe vào bài;
- xe dừng;
- xe vượt stop line;
- xe bắt đầu tăng tốc.
```

Pseudo-code:

```ts
function onLightChanged(
  previous: 'RED' | 'YELLOW' | 'GREEN',
  current: 'RED' | 'YELLOW' | 'GREEN'
) {
  if (current === 'GREEN' && previous !== 'GREEN') {
    state.greenLightTimestamp = now();
  }
}
```

---

# 11. Các lỗi trừ điểm và đình chỉ

## Lỗi 01 — Đi qua ngã tư khi đèn đỏ

```txt
Vi phạm tín hiệu đèn điều khiển giao thông
(đi qua ngã tư khi đèn đỏ)
→ trừ 10 điểm.
```

```ts
const PENALTY_RED_LIGHT = 10;
```

---

## Lỗi 02 — Dừng quá vạch

```txt
Dừng xe quá vạch dừng quy định
→ trừ 05 điểm.
```

```ts
const PENALTY_STOP_OVER_LINE = 5;
```

---

## Lỗi 03 — Dừng chưa đến vạch

```txt
Dừng xe chưa đến vạch dừng quy định
→ trừ 05 điểm.
```

```ts
const PENALTY_STOP_TOO_EARLY = 5;
```

Lưu ý:

```txt
Threshold chính xác cần xác minh do nguồn có cả 500 mm và 1000 mm.
```

---

## Lỗi 04 — Không bật xi nhan khi rẽ

```txt
Không bật đèn xi nhan khi rẽ trái hoặc rẽ phải
→ trừ 05 điểm.
```

```ts
const PENALTY_NO_TURN_SIGNAL = 5;
```

---

## Lỗi 05 — Quá 20 giây chưa qua vạch kết thúc ngã tư

```txt
Quá 20 giây từ khi đèn xanh bật sáng
không lái xe qua được vạch kết thúc ngã tư
→ trừ 05 điểm.
```

```ts
const INTERSECTION_WARNING_TIME_SEC = 20;
const PENALTY_TIMEOUT_20S = 5;
```

---

## Lỗi 06 — Quá 30 giây chưa qua vạch kết thúc ngã tư

```txt
Quá 30 giây từ khi đèn xanh bật sáng
không lái xe qua được vạch kết thúc ngã tư
→ bị đình chỉ sát hạch.
```

```ts
const INTERSECTION_DQ_TIME_SEC = 30;
```

Event:

```txt
DQ_05_TIMEOUT_30S
```

---

## Lỗi 07 — Vi phạm vạch kẻ đường làm sai trình tự

Nguồn:

```txt
Lái xe vi phạm vạch kẻ đường
để thiết bị báo không thực hiện đúng trình tự bài sát hạch
→ bị đình chỉ sát hạch.
```

Event:

```txt
DQ_05_MARKING_SEQUENCE_VIOLATION
```

---

## Lỗi 08 — Lái xe lên vỉa hè

```txt
→ bị đình chỉ sát hạch.
```

Event:

```txt
DQ_05_DRIVE_ON_CURB
```

---

## Lỗi 09 — Xử lý không hợp lý gây tai nạn

```txt
→ bị đình chỉ sát hạch.
```

Event:

```txt
DQ_05_ACCIDENT
```

---

## Lỗi 10 — Chết máy

```txt
Xe bị chết máy
→ mỗi lần trừ 05 điểm.
```

```ts
const PENALTY_ENGINE_STALL = 5;
```

---

# 12. Phạm vi nguồn lỗi

Ảnh nguồn hiện tại hiển thị danh sách lỗi đến:

```txt
10. Xe bị chết máy, mỗi lần trừ 05 điểm.
```

Ảnh không hiển thị các lỗi tiếp theo nếu có.

Do đó file này không tự bổ sung lỗi số 11 trở đi.

Các rule chung về:

```txt
RPM > 4000
quá tốc độ
```

có thể lấy từ:

```txt
general_driving_exam_rules.md
```

nhưng phải phân biệt đó là **rule chung**, không phải lỗi đọc trực tiếp từ phần ảnh bài 5 hiện tại.

---

# 13. Bảng tổng hợp lỗi

| Mã | Lỗi | Xử lý |
|---|---|---:|
| E05-01 | Đi qua ngã tư khi đèn đỏ | -10 |
| E05-02 | Dừng quá vạch | -5 |
| E05-03 | Dừng chưa đến vạch | -5 |
| E05-04 | Không bật xi nhan khi rẽ | -5 |
| E05-05 | Quá 20 giây từ lúc đèn xanh mà chưa qua vạch kết thúc | -5 |
| E05-06 | Quá 30 giây từ lúc đèn xanh mà chưa qua vạch kết thúc | Đình chỉ |
| E05-07 | Vi phạm vạch kẻ đường làm sai trình tự | Đình chỉ |
| E05-08 | Lái xe lên vỉa hè | Đình chỉ |
| E05-09 | Xử lý không hợp lý gây tai nạn | Đình chỉ |
| E05-10 | Chết máy | -5 mỗi lần |

---

# 14. State machine đề xuất

```txt
INACTIVE
    ↓
APPROACH_INTERSECTION
    ↓
LIGHT_DECISION
    ├── RED → STOP_REQUIRED
    ├── YELLOW + before stop line → STOP_REQUIRED
    ├── YELLOW + passed stop line → MAY_CONTINUE
    └── GREEN → MAY_CONTINUE
                    ↓
              GREEN_TIMER
                    ↓
          CROSS_INTERSECTION
             ├── LEFT → left signal required
             ├── RIGHT → right signal required
             └── STRAIGHT
                    ↓
       INTERSECTION_END_LINE
                    ↓
                COMPLETED
```

---

# 15. Runtime state đề xuất

```ts
interface Exam05RuntimeState {
  active: boolean;

  trafficLightState:
    | 'RED'
    | 'YELLOW'
    | 'GREEN';

  previousTrafficLightState:
    | 'RED'
    | 'YELLOW'
    | 'GREEN'
    | null;

  greenLightTimestamp: number | null;

  frontBumperDistanceToStopLineM: number | null;

  turnDirection:
    | 'STRAIGHT'
    | 'LEFT'
    | 'RIGHT';

  leftSignalOn: boolean;
  rightSignalOn: boolean;

  crossedStopLine: boolean;
  crossedIntersectionEndLine: boolean;

  engineRunning: boolean;
  engineRPM: number;
  speedKmh: number;

  disqualified: boolean;
  completed: boolean;
}
```

---

# 16. Config đề xuất

```ts
export const EXAM_05_RULES = {
  id: 'EXAM_05_SIGNALIZED_INTERSECTION',

  stopDistanceSource: {
    procedureMaxM: 0.5,
    requirementMaxM: 1.0,
    verifiedMaxM: null
  },

  timer: {
    penaltyAtSec: 20,
    penaltyPoints: 5,
    disqualifyAtSec: 30
  },

  penalties: {
    redLight: 10,
    stopOverLine: 5,
    stopTooEarly: 5,
    noTurnSignal: 5,
    engineStall: 5
  },

  maxEngineRPM: 4000,

  maxSpeedKmh: {
    B: 24,
    D1: 24,
    D2: 24,

    C1: 20,
    C: 20,
    D: 20
  },

  disqualify: {
    timeout30s: true,
    markingSequenceViolation: true,
    driveOnCurb: true,
    accident: true
  }
} as const;
```

---

# 17. Pseudo-code timer 20/30 giây

```ts
if (
  state.greenLightTimestamp !== null &&
  !state.crossedIntersectionEndLine
) {
  const elapsed =
    (now() - state.greenLightTimestamp) / 1000;

  if (elapsed > 20 && !state.penalty20sApplied) {
    addPenalty(5, 'TIMEOUT_20S');
    state.penalty20sApplied = true;
  }

  if (elapsed > 30) {
    disqualify('TIMEOUT_30S');
  }
}
```

---

# 18. Quan hệ với sân Hiệp Phát

Theo route:

```txt
4A
↓
5A — đi thẳng qua ngã tư
↓
6A
```

Ngoài ra còn:

```txt
7A  = đi thẳng
10A = rẽ trái
14A = rẽ phải
```

Nên tái sử dụng controller chung:

```ts
interface IntersectionExerciseConfig {
  marker: '5A' | '7A' | '10A' | '14A';

  movement:
    | 'STRAIGHT'
    | 'LEFT'
    | 'RIGHT';
}
```

---

# 19. Quy tắc Agent bắt buộc tuân thủ

```txt
RULE_EX05_01
Đèn đỏ → phải dừng.

RULE_EX05_02
Đèn xanh → được phép đi.

RULE_EX05_03
Đèn vàng + đã quá vạch → được phép đi.

RULE_EX05_04
Đèn vàng + chưa đến vạch → phải dừng.

RULE_EX05_05
Đi qua ngã tư khi đèn đỏ → -10.

RULE_EX05_06
Dừng quá vạch → -5.

RULE_EX05_07
Dừng chưa đến vạch → -5.

RULE_EX05_08
Rẽ trái phải xi nhan trái.

RULE_EX05_09
Rẽ phải phải xi nhan phải.

RULE_EX05_10
Không xi nhan khi rẽ → -5.

RULE_EX05_11
Timer 20/30 giây bắt đầu khi đèn xanh bật.

RULE_EX05_12
Quá 20 giây chưa qua vạch kết thúc → -5.

RULE_EX05_13
Quá 30 giây chưa qua vạch kết thúc → đình chỉ.

RULE_EX05_14
Vi phạm vạch kẻ đường làm hệ thống báo sai trình tự → đình chỉ.

RULE_EX05_15
Lên vỉa hè → đình chỉ.

RULE_EX05_16
Gây tai nạn → đình chỉ.

RULE_EX05_17
Chết máy → -5 mỗi lần.

RULE_EX05_18
Không tự hòa giải mâu thuẫn 500 mm / 1000 mm.

RULE_EX05_19
Threshold vị trí dừng chính thức phải được xác minh.

RULE_EX05_20
Không tự bổ sung lỗi không nhìn thấy trong ảnh nguồn.
```

---

# 20. Quan hệ với các file khác

```txt
hiep_phat_exam_yard_standard_v2_corrected.md
→ vị trí 5A/7A/10A/14A.

threejs_exam_yard_specification_v2.md
→ geometry ngã tư, stop line, crosswalk, traffic light.

general_driving_exam_rules.md
→ rule chung của toàn kỳ thi.

exam_05_signalized_intersection.md
→ logic riêng bài 05.
```

---

# 21. Prompt ngắn cho Codex

```txt
Triển khai bài 05 — Qua ngã tư có tín hiệu điều khiển giao thông.

1. RED: bắt buộc dừng.
2. GREEN: được đi.
3. YELLOW:
   - đã quá stop line → được đi;
   - chưa đến stop line → phải dừng.
4. Dùng FRONT_BUMPER_REFERENCE để đánh giá vị trí dừng.
5. Nguồn có 2 giá trị:
   - bước thực hiện: <= 0.5 m;
   - yêu cầu đạt: <= 1.0 m.
   Không tự chọn, dùng verified config.
6. Rẽ trái: xi nhan trái.
7. Rẽ phải: xi nhan phải.
8. Không xi nhan khi rẽ: -5.
9. Đi qua khi đèn đỏ: -10.
10. Dừng quá vạch: -5.
11. Dừng chưa đến vạch: -5.
12. Khi GREEN bật: bắt đầu timer.
13. >20s chưa qua end line: -5.
14. >30s chưa qua end line: đình chỉ.
15. Vi phạm vạch làm sai trình tự: đình chỉ.
16. Lên vỉa hè: đình chỉ.
17. Gây tai nạn: đình chỉ.
18. Chết máy: -5 mỗi lần.
19. Không tự bổ sung lỗi ngoài ảnh nguồn.
```

---

# 22. Nguồn

```txt
Bài sát hạch số 5:
Qua ngã tư có tín hiệu điều khiển giao thông

Các cột nguồn:
- Các bước thực hiện
- Yêu cầu đạt được
- Các lỗi trừ điểm
```

File này là bản chuyển đổi nội dung ảnh nguồn sang định dạng kỹ thuật phục vụ mô phỏng Three.js/Agent.
