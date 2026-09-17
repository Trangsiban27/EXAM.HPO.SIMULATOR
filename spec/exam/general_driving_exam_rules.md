# GENERAL DRIVING EXAM RULES
## Yêu cầu chung khi thi sát hạch thực hành lái xe trong hình

> Nguồn: ảnh chụp mục **2.2.3. Yêu cầu chung** do người dùng cung cấp.
>
> Mục đích: chuyển nội dung yêu cầu chung thành đặc tả kỹ thuật để Agent/Codex có thể áp dụng vào game mô phỏng sát hạch trên Three.js.
>
> Chỉ dùng các nội dung có trong nguồn. Phần nguồn không nêu rõ thì không tự bổ sung.

---

# 1. Yêu cầu chung

Trong quá trình sát hạch, thí sinh phải:

```txt
- Thực hiện đúng trình tự.
- Chấp hành quy tắc giao thông đường bộ.
- Giữ động cơ hoạt động liên tục.
- Tốc độ động cơ không quá 4000 vòng/phút.
- Tốc độ xe chạy không vượt giới hạn theo hạng xe.
- Xử lý đúng tình huống nguy hiểm.
- Bật xi nhan khi rẽ hoặc chuyển làn.
- Không dừng xe sai vị trí.
- Hoàn thành bài thi trong thời gian quy định.
```

---

# 2. Thứ tự bài thi

Thí sinh phải thực hiện đúng trình tự bài thi.

Agent phải dùng route chính thức của sân:

```txt
currentExercise
expectedExercise
```

Nếu người chơi đi sai thứ tự hoặc bỏ bài:

```ts
registerEvent('WRONG_EXERCISE_SEQUENCE');
```

File này không quy định mức trừ điểm cụ thể cho lỗi sai trình tự.

---

# 3. Động cơ

## 3.1 Động cơ phải hoạt động liên tục

```txt
engineRunning == true
```

Trong suốt quá trình sát hạch, thí sinh phải giữ động cơ hoạt động liên tục.

Nguồn hiện tại không nêu mức trừ điểm cụ thể cho lỗi tắt máy.

## 3.2 Giới hạn vòng tua

```txt
engineRPM <= 4000
```

Cấu hình:

```ts
const MAX_ENGINE_RPM = 4000;
```

Nguồn hiện tại không nêu mức trừ điểm cụ thể cho lỗi vượt 4000 vòng/phút.

---

# 4. Giới hạn tốc độ xe

Giới hạn này áp dụng:

```txt
TRỪ bài thay đổi số trên đường bằng
```

## 4.1 Hạng C1, C, D

```txt
speed <= 20 km/h
```

## 4.2 Hạng B, D1, D2

```txt
speed <= 24 km/h
```

Cấu hình:

```ts
const GENERAL_MAX_SPEED_KMH = {
  B: 24,
  D1: 24,
  D2: 24,

  C1: 20,
  C: 20,
  D: 20
} as const;
```

Nguồn ảnh không nêu giới hạn cho các hạng khác.

---

# 5. Tình huống nguy hiểm

## 5.1 Phạm vi xuất hiện

Trong sân sát hạch:

```txt
ngoài khu vực các bài sát hạch
```

thí sinh sẽ gặp tình huống nguy hiểm.

Đặc điểm:

```txt
- xuất hiện ngẫu nhiên;
- bất ngờ;
- có tiếng loa báo tín hiệu nguy hiểm;
- đèn đỏ trên xe bật sáng.
```

## 5.2 Trình tự xử lý

```txt
HAZARD_TRIGGERED
      ↓
phanh dừng xe
      ↓
bật tín hiệu nguy hiểm
      ↓
chờ hết tín hiệu nguy hiểm
      ↓
tắt tín hiệu nguy hiểm
      ↓
mới được tiếp tục di chuyển
```

---

# 6. Phanh dừng khi có tình huống nguy hiểm

Kể từ khi có tín hiệu báo tình huống nguy hiểm:

```txt
nếu không phanh dừng xe trong 03 giây
→ trừ 10 điểm
```

Cấu hình:

```ts
const HAZARD_STOP_TIME_LIMIT_SEC = 3;
const PENALTY_HAZARD_NO_STOP = 10;
```

---

# 7. Bật tín hiệu nguy hiểm

Nếu không ấn nút bật tín hiệu nguy hiểm trên xe trong:

```txt
05 giây
```

kể từ khi có tín hiệu nguy hiểm:

```txt
→ trừ 10 điểm
```

Cấu hình:

```ts
const HAZARD_LIGHT_ON_TIME_LIMIT_SEC = 5;
const PENALTY_HAZARD_LIGHT_NOT_ON = 10;
```

---

# 8. Tắt tín hiệu nguy hiểm trước khi đi tiếp

Khi hết tín hiệu báo tình huống nguy hiểm:

```txt
phải tắt tín hiệu nguy hiểm
trước khi cho xe đi tiếp
```

Nếu không:

```txt
→ trừ 10 điểm
```

Cấu hình:

```ts
const PENALTY_HAZARD_LIGHT_NOT_OFF = 10;
```

---

# 9. Không thực hiện được chuỗi thao tác xử lý nguy hiểm

Nguồn nêu:

```txt
nếu không thực hiện được các thao tác trên
→ trừ 10 điểm
```

Do nguồn hiện tại chưa làm rõ quan hệ cộng dồn giữa lỗi này và các lỗi riêng phía trên, Agent nên giữ riêng:

```ts
const PENALTY_HAZARD_SEQUENCE_FAILURE = 10;
```

Không tự suy diễn cách cộng dồn nếu chưa có tài liệu chấm điểm đầy đủ.

---

# 10. Xi nhan khi chuyển hướng hoặc chuyển làn

Trong sân sát hạch, ngoài khu vực các bài sát hạch:

```txt
nếu xe chuyển hướng rẽ hoặc chuyển làn đường
thí sinh phải bật xi nhan theo hướng di chuyển
```

Nếu không:

```txt
mỗi lần trừ 05 điểm
```

Cấu hình:

```ts
const PENALTY_NO_TURN_SIGNAL = 5;
```

---

# 11. Xi nhan khi rẽ trái hoặc rẽ phải

Khi chuyển hướng:

```txt
rẽ trái
hoặc
rẽ phải
```

thí sinh phải bật đèn xi nhan báo hướng di chuyển.

Mỗi lần không bật:

```txt
trừ 05 điểm
```

Ví dụ:

```ts
if (turnDirection === 'LEFT' && !leftSignal) {
  score -= 5;
}

if (turnDirection === 'RIGHT' && !rightSignal) {
  score -= 5;
}
```

---

# 12. Dừng xe sai vị trí

Trong sân sát hạch, ngoài khu vực các bài sát hạch:

```txt
nếu dừng xe tại vị trí không đúng quy định
→ mỗi lần trừ 05 điểm
```

Cấu hình:

```ts
const PENALTY_INVALID_STOP_POSITION = 5;
```

---

# 13. Thời gian thi thực hành trong hình

## Hạng B

```txt
18 phút
```

```ts
const EXAM_TIME_B_SEC = 18 * 60;
```

## Hạng D1, D2

```txt
15 phút
```

```ts
const EXAM_TIME_D1_D2_SEC = 15 * 60;
```

## Hạng C1, C, D

```txt
20 phút
```

```ts
const EXAM_TIME_C1_C_D_SEC = 20 * 60;
```

Cấu hình:

```ts
const EXAM_TIME_LIMIT_SEC = {
  B: 18 * 60,

  D1: 15 * 60,
  D2: 15 * 60,

  C1: 20 * 60,
  C: 20 * 60,
  D: 20 * 60
} as const;
```

Nguồn ảnh không nêu thời gian cho các hạng khác.

---

# 14. Bảng tổng hợp

| Rule | Yêu cầu | Hậu quả |
|---|---|---|
| Trình tự | Thực hiện đúng thứ tự bài | Bắt buộc |
| Động cơ | Hoạt động liên tục | Bắt buộc |
| RPM | Không quá 4000 vòng/phút | Giới hạn chung |
| Tốc độ B, D1, D2 | Không quá 24 km/h | Trừ bài thay đổi số |
| Tốc độ C1, C, D | Không quá 20 km/h | Trừ bài thay đổi số |
| Hazard: phanh | Dừng trong 3 giây | Không đạt: -10 |
| Hazard: bật cảnh báo | Bật trong 5 giây | Không đạt: -10 |
| Hazard: tắt cảnh báo | Tắt trước khi đi tiếp | Không đạt: -10 |
| Hazard: không thực hiện chuỗi thao tác | Không hoàn thành xử lý | -10 |
| Xi nhan | Phải bật khi rẽ/chuyển làn | Mỗi lần -5 |
| Dừng sai vị trí | Không được dừng sai | Mỗi lần -5 |
| Thời gian hạng B | 18 phút | Giới hạn toàn bài |
| Thời gian D1, D2 | 15 phút | Giới hạn toàn bài |
| Thời gian C1, C, D | 20 phút | Giới hạn toàn bài |

---

# 15. Phạm vi áp dụng

## Áp dụng toàn bộ bài thi

```txt
- đúng trình tự;
- chấp hành quy tắc giao thông;
- động cơ hoạt động;
- RPM <= 4000;
- thời gian tổng.
```

## Không áp dụng giới hạn tốc độ chung tại

```txt
bài thay đổi số trên đường bằng
```

## Các rule nguồn nêu riêng "ngoài khu vực các bài sát hạch"

```txt
- tình huống nguy hiểm;
- xi nhan khi chuyển hướng/chuyển làn;
- dừng xe sai vị trí.
```

Agent nên theo dõi:

```ts
isInsideExerciseZone: boolean
```

---

# 16. State machine tình huống nguy hiểm

```txt
INACTIVE
   ↓ random trigger
HAZARD_ACTIVE
   ↓ stop <= 3s
VEHICLE_STOPPED
   ↓ hazard light ON <= 5s
HAZARD_LIGHT_ON
   ↓ hazard signal ends
WAIT_FOR_LIGHT_OFF
   ↓ hazard light OFF
READY_TO_CONTINUE
   ↓ vehicle moves
COMPLETED
```

Vi phạm:

```txt
không dừng <= 3s         → -10
không bật cảnh báo <= 5s → -10
không tắt trước khi đi   → -10
không thực hiện thao tác → -10
```

---

# 17. Event system đề xuất

```txt
EXAM_STARTED

ENGINE_STOPPED
ENGINE_RPM_EXCEEDED
GENERAL_SPEED_EXCEEDED

HAZARD_TRIGGERED
HAZARD_STOPPED_IN_TIME
HAZARD_STOP_TIMEOUT
HAZARD_LIGHT_ON
HAZARD_LIGHT_ON_TIMEOUT
HAZARD_SIGNAL_ENDED
HAZARD_LIGHT_OFF
HAZARD_CONTINUE_WITH_LIGHT_ON
HAZARD_SEQUENCE_FAILURE

TURN_STARTED
LANE_CHANGE_STARTED
TURN_SIGNAL_MISSING

INVALID_STOP

EXAM_TIME_EXCEEDED
EXAM_FINISHED
```

---

# 18. Data config đề xuất

```ts
export const GENERAL_EXAM_RULES = {
  maxEngineRPM: 4000,

  maxSpeedKmh: {
    B: 24,
    D1: 24,
    D2: 24,

    C1: 20,
    C: 20,
    D: 20
  },

  examTimeSec: {
    B: 18 * 60,

    D1: 15 * 60,
    D2: 15 * 60,

    C1: 20 * 60,
    C: 20 * 60,
    D: 20 * 60
  },

  hazard: {
    stopWithinSec: 3,
    lightOnWithinSec: 5,

    penaltyNoStop: 10,
    penaltyNoLightOn: 10,
    penaltyNoLightOff: 10,
    penaltySequenceFailure: 10
  },

  turnSignal: {
    penaltyMissing: 5
  },

  invalidStop: {
    penalty: 5
  }
} as const;
```

---

# 19. Rule engine đề xuất

```ts
function updateGeneralExamRules(
  exam: ExamState,
  vehicle: VehicleState,
  dt: number
) {
  checkExerciseSequence(exam);

  checkEngineRunning(vehicle);
  checkEngineRPM(vehicle);

  if (!exam.isInsideGearChangeExercise) {
    checkGeneralSpeedLimit(exam.vehicleClass, vehicle);
  }

  if (!exam.isInsideExerciseZone) {
    checkHazardScenario(exam, vehicle, dt);
    checkTurnAndLaneSignals(exam, vehicle);
    checkInvalidStop(exam, vehicle);
  }

  checkTotalExamTime(exam);
}
```

---

# 20. Các rule bắt buộc Agent phải tuân thủ

```txt
RULE_GENERAL_01
Không tự thêm mức trừ điểm nếu nguồn không nêu.

RULE_GENERAL_02
Không áp giới hạn tốc độ chung vào bài thay đổi số trên đường bằng.

RULE_GENERAL_03
Hạng B, D1, D2: tối đa 24 km/h.

RULE_GENERAL_04
Hạng C1, C, D: tối đa 20 km/h.

RULE_GENERAL_05
RPM động cơ tối đa 4000 vòng/phút.

RULE_GENERAL_06
Tình huống nguy hiểm xuất hiện ngẫu nhiên, bất ngờ,
ngoài khu vực các bài sát hạch.

RULE_GENERAL_07
Khi có hazard phải phanh dừng trong 3 giây.

RULE_GENERAL_08
Phải bật tín hiệu nguy hiểm trong 5 giây.

RULE_GENERAL_09
Khi hết tín hiệu nguy hiểm phải tắt cảnh báo trước khi đi tiếp.

RULE_GENERAL_10
Không xi nhan khi rẽ/chuyển làn: trừ 5 điểm mỗi lần.

RULE_GENERAL_11
Dừng xe sai vị trí: trừ 5 điểm mỗi lần.

RULE_GENERAL_12
Thời gian hạng B = 18 phút.

RULE_GENERAL_13
Thời gian D1/D2 = 15 phút.

RULE_GENERAL_14
Thời gian C1/C/D = 20 phút.

RULE_GENERAL_15
Không suy diễn tốc độ hoặc thời gian cho hạng xe không có trong nguồn.

RULE_GENERAL_16
Rule chung không thay thế rule riêng của từng bài thi.
```

---

# 21. Quan hệ với các file specification khác

Nên tổ chức hệ thống thành 3 file riêng:

```txt
hiep_phat_exam_yard_standard_v2_corrected.md
→ quy chuẩn bố cục sân, route, vị trí bài.

threejs_exam_yard_specification_v2.md
→ quy chuẩn hình học và logic của từng bài thi.

general_driving_exam_rules.md
→ yêu cầu chung áp dụng trong toàn bộ kỳ thi.
```

Kiến trúc:

```txt
YARD STANDARD
      +
EXERCISE STANDARD
      +
GENERAL EXAM RULES
      ↓
FULL DRIVING EXAM SIMULATION
```

---

# 22. Prompt cho Agent/Codex

```txt
Đọc file này như bộ rule chung của kỳ thi sát hạch.

Yêu cầu:

1. Theo dõi trình tự bài thi.
2. Theo dõi engineRunning.
3. Giới hạn engineRPM ở 4000 rpm.
4. Giới hạn tốc độ theo hạng xe ngoài bài thay đổi số.
5. Theo dõi timer tổng của kỳ thi.
6. Sinh tình huống nguy hiểm ngẫu nhiên ngoài exercise zone.
7. Hazard:
   - dừng trong 3 giây;
   - bật cảnh báo trong 5 giây;
   - tắt cảnh báo trước khi tiếp tục.
8. Theo dõi xi nhan khi rẽ hoặc chuyển làn.
9. Theo dõi dừng xe sai vị trí.
10. Phát penalty event đúng số điểm nguồn quy định.
11. Không tự thêm penalty nếu nguồn chưa định nghĩa.
```

---

# 23. Nguồn

```txt
Mục 2.2.3. Yêu cầu chung
trong ảnh người dùng cung cấp.
```

File này là bản chuyển đổi yêu cầu chung sang cấu trúc kỹ thuật phục vụ mô phỏng Three.js/Agent.

Khi có thêm toàn bộ phần quy trình chấm điểm, cần đối chiếu và cập nhật để xác định chính xác:
- lỗi cộng dồn;
- lỗi loại trực tiếp;
- điều kiện đạt/rớt;
- mức điểm khởi tạo;
- điều kiện kết thúc bài thi.
