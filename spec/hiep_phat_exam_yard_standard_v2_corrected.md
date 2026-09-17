# HIỆP PHÁT EXAM YARD STANDARD
## Quy chuẩn bố trí và mô hình hóa sân sát hạch Hiệp Phát trên Three.js

> Tài liệu này mô tả **quy chuẩn của toàn sân sát hạch**: bố cục, luồng giao thông, phân khu, hệ tọa độ, cách tổ chức scene, tuyến thi, marker, loại xe và nguyên tắc dựng lại bản quy hoạch trong Three.js.
>
> **Không dùng tài liệu này để thay thế quy chuẩn hình học chi tiết của từng bài thi.**
>
> Quy chuẩn từng bài thi, công thức kích thước và logic bài thi nằm trong file riêng:
>
> ```txt
> threejs_exam_yard_specification_v2.md
> ```
>
> Tài liệu này nên được dùng song song với file quy chuẩn bài thi.

---

# 0.1 Hiệu chỉnh theo bản vẽ PDF gốc tỷ lệ 1/500

Phiên bản này đã sửa lại cách hiểu vị trí đầu tuyến thi:

```txt
SAI TRƯỚC ĐÂY:
- gộp xuất phát và kết thúc thành một zone;
- mô tả chưa rõ vị trí thực tế của 1A;
- chưa thể hiện 1A → 2A → 3A là một chuỗi cùng trục;
- có nguy cơ hiểu 3A là chân dốc.

ĐÚNG THEO BẢN VẼ PDF:
- 1A nằm ở trục dọc phía phải sân, sát Phòng điều hành F;
- 2A nằm ngay phía trên 1A trên cùng trục;
- 3A tiếp tục phía trên 2A, vạch dừng nằm trên phần dốc lên;
- dốc tiếp tục qua đỉnh 0% rồi xuống dốc 10%;
- 15A là khu kết thúc riêng, nằm ở một trục khác.
```

---

# 1. Mục tiêu

Mục tiêu của tài liệu này là để Agent/Codex hiểu sân sát hạch Hiệp Phát như một **hệ thống không gian hoàn chỉnh**, thay vì chỉ hiểu từng bài thi rời rạc.

Agent phải có khả năng:

```txt
Bản quy hoạch sân
      ↓
Phân vùng
      ↓
Xác định tuyến giao thông
      ↓
Xác định vị trí từng bài
      ↓
Xác định hướng vào / hướng ra
      ↓
Đặt marker 1A → 15A
      ↓
Ghép geometry từng bài từ file quy chuẩn bài thi
      ↓
Tạo toàn bộ sân sát hạch Three.js
```

---

# 2. Phạm vi tài liệu

Tài liệu này bao gồm:

```txt
- Hệ tọa độ toàn sân.
- Đơn vị dựng hình.
- Phân khu sân.
- Hệ thống đường giao thông.
- Hướng di chuyển.
- Vị trí tương đối các nhóm bài.
- Marker bài thi.
- Tuyến thi sát hạch.
- Tuyến đào tạo mở rộng.
- Loại xe dùng trong sân.
- Các thông số xe dùng để chọn geometry bài thi.
- Nguyên tắc nối các bài.
- Đảo cỏ, bó vỉa, vạch đường, đèn, biển báo.
- Quy tắc xác định geometry từ CAD.
- Quy tắc debug và validation.
```

Tài liệu này **không định nghĩa lại**:

```txt
- Công thức chi tiết của bài vệt bánh xe.
- Công thức đường vuông góc.
- Công thức chữ S.
- Công thức ghép dọc.
- Công thức ghép ngang.
- Kích thước dốc.
- Khoảng cách vạch dừng đường sắt.
- Quy chuẩn chi tiết từng bài.
```

Những nội dung đó phải lấy từ:

```txt
threejs_exam_yard_specification_v2.md
```

---

# 3. Nguồn dữ liệu sân

Sân Hiệp Phát được mô hình hóa dựa trên các nguồn sau:

```txt
1. Bản quy hoạch tổng thể sân sát hạch.

2. Bản quy hoạch chi tiết có:
   - kích thước;
   - bán kính cong;
   - hướng chạy;
   - marker 1A, 2A, ... 15A;
   - phân khu hạng B/C;
   - vị trí ghép xe;
   - ngã tư;
   - đường thẳng;
   - vùng cỏ và bó vỉa.

3. Bảng thông số kỹ thuật xe của sân đã thi công.

4. Bảng kích thước hình sát hạch tương ứng từng hạng xe.

5. Quy trình thi sát hạch B, C, D, E.

6. Quy trình sân đào tạo hạng B, C mở rộng.
```

---

# 4. Đơn vị và hệ tọa độ

## 4.1 Đơn vị

```txt
1 Three.js unit = 1 meter
```

Toàn bộ dữ liệu từ bản vẽ CAD có ghi kích thước bằng mét phải được giữ nguyên theo tỷ lệ 1:1.

Nếu bảng kỹ thuật sử dụng mm:

```txt
Three.js meter = CAD/mm value / 1000
```

Ví dụ:

```txt
4410 mm → 4.410 m
1700 mm → 1.700 m
5100 mm → 5.100 m
```

---

## 4.2 Hệ trục

Quy ước toàn sân:

```txt
X = trái / phải trên bản quy hoạch
Y = cao độ
Z = từ dưới bản vẽ đi lên phía trên bản vẽ
```

Khuyến nghị:

```ts
const YARD_UP = new THREE.Vector3(0, 1, 0);
```

Mặt đường cơ sở:

```txt
Y = 0
```

---

# 5. Gốc tọa độ sân

Khuyến nghị đặt:

```txt
ORIGIN = góc dưới trái của phần sân sát hạch
```

Từ đó:

```txt
+X = sang phải
+Z = lên phía trên bản quy hoạch
```

Lý do:

```txt
- dễ đối chiếu CAD;
- dễ chuyển kích thước sang tọa độ;
- dễ debug;
- tránh tọa độ âm không cần thiết.
```

Nếu khi triển khai thực tế cần đặt tâm sân tại `(0,0,0)`, agent được phép dịch toàn bộ scene bằng một transform duy nhất.

Không được thay đổi scale.

---

# 6. Cấu trúc tổng thể sân

Sân không phải một tuyến đơn giản.

Đây là một **mạng đường một chiều có nhiều cụm bài thi và nhiều lần đi qua các ngã tư chung**.

Có thể phân thành các cụm lớn:

```txt
A. Cụm đường cong / đường quanh co
   → khu phía trên bên trái.

B. Cụm vệt bánh xe + đường hẹp vuông góc
   → khu phía trên bên phải.

C. Cụm ghép xe
   → khu nửa dưới bên trái và giữa.

D. Trục giao thông chính
   → chạy qua giữa sân và mép phải.

E. Cụm ngã tư / vạch người đi bộ
   → kết nối nhiều bài.

F. Đường thay đổi số
   → đoạn thẳng dài.

G. Khu đường sắt.

H. Khu xuất phát 1A.
   → nằm ở phần dưới của trục dọc phía phải sân sát hạch,
     ngay bên trái/phía tây Phòng điều hành trung tâm F.

I. Khu kết thúc 15A.
   → là một vị trí riêng, không trùng với 1A;
     nằm trên trục dọc kết thúc ở nửa dưới-phải của sân.

J. Khu phụ trợ / điều hành / bãi đỗ.
```

---

# 7. Phân vùng chức năng

Agent nên dựng sân dưới dạng các zone độc lập.

```txt
ZONE_00_SITE_BOUNDARY

ZONE_01_START

ZONE_02_PEDESTRIAN

ZONE_03_HILL

ZONE_04_WHEEL_TRACK_RIGHT_ANGLE

ZONE_05_INTERSECTION_MAIN

ZONE_06_S_CURVE

ZONE_07_PARALLEL_PARKING_BC

ZONE_08_PERPENDICULAR_PARKING_DE

ZONE_09_RAILWAY

ZONE_10_GEAR_CHANGE

ZONE_11_PERPENDICULAR_PARKING_B

ZONE_12_OPERATION_AREA

ZONE_13_GRASS_ISLANDS

ZONE_14_OUTER_ROAD

ZONE_15_FINISH
```

Các zone có thể nằm trong cùng một không gian nhưng vẫn phải tách object logic.

---

# 8. Bố cục tương đối của sân

Theo bản quy hoạch PDF tỷ lệ 1/500, sân phải được hiểu theo topology sau.

```txt
PHÍA BẮC / PHÍA TRÊN BẢN VẼ
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  CỤM ĐƯỜNG QUANH CO             CỤM ĐƯỜNG HẸP / VUÔNG GÓC   │
│  ở phía trái-trên                ở phía giữa-trên             │
│                                                              │
│                                     ↑                        │
│                                     │ tuyến từ 3A đi tiếp     │
│                                     │ tới các bài phía trên   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  CỤM GHÉP XE / HẠNG B-C          TRỤC DỌC 1A → 2A → 3A       │
│                                  ở phía phải sân sát hạch     │
│                                         ↑                    │
│                                    3A - DỐC                   │
│                                         ↑                    │
│                                    2A - NGƯỜI ĐI BỘ           │
│                                         ↑                    │
│                                    1A - XUẤT PHÁT             │
│                                         │                    │
│                              [PHÒNG ĐIỀU HÀNH F ở bên phải]  │
│                                                              │
│                 13A / 14A        15A - KẾT THÚC               │
│                 ở khu dưới       trên một trục riêng          │
└──────────────────────────────────────────────────────────────┘
PHÍA NAM / PHÍA DƯỚI BẢN VẼ
```

Sơ đồ trên chỉ mô tả topology tương đối. Tọa độ chính xác phải lấy từ CAD/PDF và các kích thước ghi trên bản vẽ.

---

## 8.1 Cụm đầu tuyến thi 1A → 2A → 3A

Đây là một điểm bắt buộc phải hiểu đúng.

`1A`, `2A`, `3A` **không phải ba module đặt rời nhau ở ba khu vực khác nhau**.

Chúng nằm liên tiếp trên **cùng một trục đường dọc phía phải của sân sát hạch đã thi công**.

Theo chiều thi:

```txt
PHÍA BẮC
    ↑

    │  xuống dốc 10% sau khi qua đỉnh
    │
────┼────  ĐỈNH DỐC 0%
    │
    │  lên dốc 10%
    │
────┼────  STOP LINE / vùng thực hiện 3A
    │
    │  phần dốc lên
    │
    ●  CHÂN DỐC
    │
    │  connector ngắn, cùng trục
    │
██████████  2A - VẠCH NGƯỜI ĐI BỘ
──────────  VẠCH DỪNG 2A
    │
    │
──────────  VẠCH XUẤT PHÁT
  XUẤT PHÁT
    1A
    │
    ↑
hướng xe chạy

PHÍA NAM
```

Quan hệ bắt buộc:

```txt
1A_START
    ↓ cùng trục đường
2A_PEDESTRIAN
    ↓ cùng trục đường
HILL_FOOT
    ↓
UPHILL_10_PERCENT
    ↓
3A_STOP_LINE
    ↓
HILL_CREST
    ↓
DOWNHILL_10_PERCENT
    ↓
NEXT_CONNECTOR_TO_4A
```

Agent **không được**:

```txt
- đặt 1A ở khu giữa hoặc khu trái sân;
- đặt 2A ở một zone độc lập không nối trực tiếp với 1A;
- đặt 3A ở một khu dốc khác không thuộc cùng hành lang 1A → 2A → 3A;
- xem 3A là chân dốc;
- gộp 1A và 15A thành cùng một zone.
```

---

## 8.2 Vị trí 1A — Xuất phát

`1A` nằm ở **phần dưới của trục dọc phía phải sân sát hạch**, sát cạnh khu Phòng điều hành trung tâm `F`.

Trên bản vẽ:

```txt
Phòng điều hành F
        │
        │   road corridor
        │      ↑
        │   XUẤT PHÁT
        │      1A
```

Xe bắt đầu bài thi tại đây và chạy **lên phía trên bản vẽ**.

Scene đề xuất:

```txt
ZONE_01_START
├── START_APPROACH
├── START_LINE
├── START_TEXT
├── START_TRIGGER
├── ROUTE_MARKER_1A
└── EXIT_TO_2A
```

---

## 8.3 Vị trí 2A — Người đi bộ

`2A` nằm **phía trên 1A trên cùng trục đường**.

Đây là vị trí:

```txt
STOP_LINE
+
CROSSWALK
```

Sau khi hoàn thành 2A, xe tiếp tục đi thẳng lên phía dốc.

Không tạo một đoạn chuyển hướng giữa `1A` và `2A`.

---

## 8.4 Vị trí 3A — Dừng và khởi hành ngang dốc

`3A` nằm tiếp tục **phía trên 2A**, trên cùng hành lang dọc.

Bản quy hoạch thể hiện rõ chuỗi cao độ:

```txt
LÊN DỐC 10%
→ ĐỈNH DỐC 0%
→ XUỐNG DỐC 10%
```

Trong khi file quy chuẩn bài thi quy định chi tiết kích thước dốc và vị trí vạch dừng.

Yard standard chỉ chịu trách nhiệm xác nhận:

```txt
- 3A thuộc cùng trục với 1A và 2A;
- xe tiếp cận dốc theo hướng từ nam lên bắc;
- vạch 3A nằm trên phần dốc lên;
- sau đó xe đi qua đỉnh dốc rồi xuống dốc;
- đầu ra của dốc nối tiếp route tới 4A.
```

Không được hiểu:

```txt
3A_STOP_LINE == HILL_FOOT
```

Đây là hai mốc khác nhau.

---

## 8.5 Vị trí 15A — Kết thúc

`15A` **không nằm tại 1A**.

Trên bản quy hoạch, sau cụm `13A` và `14A`, xe được dẫn về một **trục đường kết thúc riêng ở nửa dưới-phải sân**.

Tại đây có chữ/vạch:

```txt
KẾT THÚC
```

và marker:

```txt
15A
```

Scene bắt buộc tách riêng:

```txt
ZONE_15_FINISH
├── FINISH_APPROACH
├── FINISH_LINE
├── FINISH_TEXT
├── FINISH_TRIGGER
└── ROUTE_MARKER_15A
```

Không dùng lại:

```txt
START_LINE
START_TRIGGER
ZONE_01_START
```

cho bài kết thúc.

---

## 8.6 Cụm đầu tuyến dưới dạng graph

```txt
[1A START]
     │
     │ straight / same corridor
     ▼
[2A PEDESTRIAN]
     │
     │ straight / same corridor
     ▼
[HILL FOOT]
     │
     ▼
[3A HILL STOP]
     │
     ▼
[HILL CREST]
     │
     ▼
[HILL DOWN]
     │
     ▼
[CONNECTOR TO 4A]
```

Đây là topology bắt buộc cho mô phỏng sân Hiệp Phát.

---

# 9. Hệ thống đường giao thông

## 9.1 Một chiều

Các mũi tên màu cyan/xanh trên bản quy hoạch xác định hướng xe chạy.

Agent phải coi chúng là:

```txt
HARD_DIRECTION_REFERENCE
```

Không được tự đảo chiều tuyến.

---

## 9.2 Road segment

Mỗi đoạn đường phải được biểu diễn thành:

```ts
interface YardRoadSegment {
  id: string;

  centerline: THREE.Curve<THREE.Vector3>;

  width: number;

  direction: 'ONE_WAY';

  entryNode: string;
  exitNode: string;
}
```

---

## 9.3 Nút giao

Các ngã tư được dùng lặp lại trong route.

Không tạo một ngã tư mới cho mỗi lần xe đi qua.

Ví dụ:

```txt
5A
7A
10A
14A
```

có thể sử dụng cùng hệ thống giao thông / giao cắt tùy đúng vị trí trên bản quy hoạch.

Logic bài thi là khác nhau, nhưng geometry nút giao có thể là cùng một zone.

---

# 10. Tuyến thi sát hạch sân đã thi công

> Lưu ý quan trọng: `1A` và `15A` là hai vị trí vật lý khác nhau.  
> `1A → 2A → 3A` là chuỗi liên tục trên cùng trục dọc phía phải sân.

Tuyến sát hạch sử dụng marker:

```txt
1A → 15A
```

Thứ tự:

```txt
1A
XUẤT PHÁT

↓

2A
DỪNG XE TẠI ĐƯỜNG DÀNH RIÊNG CHO NGƯỜI ĐI BỘ

↓

3A
DỪNG VÀ KHỞI HÀNH XE NGANG DỐC

↓

4A
VÀO HÌNH VỆT BÁNH XE, ĐƯỜNG HẸP VUÔNG GÓC

↓

5A
ĐI THẲNG QUA NGÃ TƯ CÓ TÍN HIỆU ĐIỀU KHIỂN GIAO THÔNG

↓

6A
VÀO HÌNH ĐƯỜNG QUANH CO

↓

7A
ĐI THẲNG QUA NGÃ TƯ CÓ TÍN HIỆU ĐIỀU KHIỂN GIAO THÔNG

↓

8A
GHÉP XE DỌC VÀO NƠI ĐỖ ĐỐI VỚI XE HẠNG B, C

↓

9A
GHÉP XE NGANG VÀO NƠI ĐỖ ĐỐI VỚI XE HẠNG D, E

↓

10A
RẼ TRÁI QUA NGÃ TƯ CÓ TÍN HIỆU ĐIỀU KHIỂN GIAO THÔNG

↓

11A
DỪNG Ở CHỖ CÓ ĐƯỜNG SẮT CHẠY QUA

↓

12A
VÀO ĐƯỜNG THAY ĐỔI SỐ TRÊN ĐƯỜNG THẲNG

↓

13A
GHÉP XE NGANG VÀO NƠI ĐỖ ĐỐI VỚI XE HẠNG B

↓

14A
RẼ PHẢI QUA NGÃ TƯ CÓ TÍN HIỆU ĐIỀU KHIỂN GIAO THÔNG

↓

15A
ĐIỀU KHIỂN XE QUA VẠCH KẾT THÚC
```

---

# 11. Route configuration

Agent nên lưu route thành data:

```ts
export const EXAM_ROUTE_A = [
  '1A_START',
  '2A_PEDESTRIAN_STOP',
  '3A_HILL_STOP_AND_START',
  '4A_WHEEL_TRACK_RIGHT_ANGLE',
  '5A_INTERSECTION_STRAIGHT_1',
  '6A_S_CURVE',
  '7A_INTERSECTION_STRAIGHT_2',
  '8A_PARALLEL_PARKING_BC',
  '9A_PERPENDICULAR_PARKING_DE',
  '10A_INTERSECTION_LEFT',
  '11A_RAILWAY_STOP',
  '12A_GEAR_CHANGE',
  '13A_PERPENDICULAR_PARKING_B',
  '14A_INTERSECTION_RIGHT',
  '15A_FINISH_LINE'
] as const;
```

---

# 12. Tuyến đào tạo mở rộng

Tuyến đào tạo hạng B, C mở rộng dùng marker:

```txt
1 → 14
```

Không được trộn với route thi sát hạch.

Thứ tự:

```txt
1  Xuất phát

2  Dừng xe tại đường dành riêng cho người đi bộ

3  Dừng và khởi hành xe ngang dốc

4  Vào hình vệt bánh xe, đường hẹp vuông góc

5  Đi thẳng qua ngã tư có tín hiệu

6  Vào hình đường quanh co

7  Đi thẳng qua ngã tư có tín hiệu

8  Ghép xe dọc vào nơi đỗ đối với B, C

9  Rẽ trái qua ngã tư có tín hiệu

10 Dừng ở chỗ có đường sắt chạy qua

11 Vào đường thay đổi số trên đường thẳng

12 Ghép xe ngang vào nơi đỗ đối với B

13 Rẽ phải qua ngã tư có tín hiệu

14 Qua vạch kết thúc
```

---

# 13. Marker

Các marker trên bản quy hoạch:

```txt
1A
2A
3A
...
15A
```

phải được giữ trong debug scene.

Scene object:

```txt
DebugMarker_1A
DebugMarker_2A
...
DebugMarker_15A
```

Mỗi marker chứa:

```ts
interface YardMarker {
  id: string;
  position: THREE.Vector3;
  routeOrder: number;
  exerciseId: string;
}
```

---

# 14. Thông số xe sát hạch

## 14.1 Hạng B

```txt
Model : VIOS 1.5E (2017)

a    = 4.410 m
b    = 1.700 m
B1   = 0.185 m
Rqv  = 5.100 m
L    = 2.550 m
```

---

## 14.2 Hạng C

```txt
Model : THACO OLLIN450A - XTL

a    = 7.630 m
b    = 2.240 m
B1   = 0.50010 m
Rqv  = 8.300 m
L    = 4.200 m
```

---

## 14.3 Hạng D

```txt
Model : COUTY HD29 E3

a    = 7.060 m
b    = 2.080 m
B1   = 0.440 m
Rqv  = 7.400 m
L    = 4.085 m
```

---

## 14.4 Hạng E

```txt
Model : TRANSINCO (BA-HAI CA K52 E2)

a    = 10.500 m
b    = 2.500 m
B1   = 0.590 m
Rqv  = 10.000 m
L    = 5.170 m
```

---

# 15. Xe dùng trong từng khu

## Sân sát hạch

```txt
Hạng B : VIOS 2017 1.5E
Hạng C : THACO OLLIN450A - XTL
Hạng D : COUTY HD29 E3
Hạng E : TRANSINCO K52 E2
Hạng Fc: đầu kéo + sơ mi rơ moóc 20 feet
```

---

## Sân đào tạo mở rộng

```txt
Hạng B : CHEVROLET AVEO
Hạng C : THACO OLLIN450A - XTL
```

Không dùng thông số VIOS thay cho Chevrolet Aveo nếu chưa có dữ liệu xe Aveo.

---

# 16. Scene graph toàn sân

Đề xuất:

```txt
HiepPhatExamYard
│
├── SiteBoundary
│
├── Ground
│
├── RoadNetwork
│   ├── OuterRoad
│   ├── MainAxisRoad
│   ├── ConnectorRoads
│   └── ExerciseRoads
│
├── ExerciseZones
│   ├── Zone_1A
│   ├── Zone_2A
│   ├── ...
│   └── Zone_15A
│
├── Intersections
│
├── Curbs
│
├── GrassIslands
│
├── Markings
│   ├── LaneArrows
│   ├── StopLines
│   ├── Crosswalks
│   ├── BoundaryLines
│   └── RoadText
│
├── Signs
│
├── TrafficLights
│
├── Railway
│
├── ParkingAreas
│
├── OperationArea
│
├── Sensors
│
├── Navigation
│
└── Debug
```

---

# 16.1 Scene graph bắt buộc cho cụm 1A → 3A và 15A

```txt
HiepPhatExamYard
│
├── StartCorridor
│   │
│   ├── Zone_1A_Start
│   │   ├── StartLine
│   │   ├── StartText
│   │   └── StartTrigger
│   │
│   ├── Connector_1A_2A
│   │
│   ├── Zone_2A_Pedestrian
│   │   ├── StopLine
│   │   ├── Crosswalk
│   │   └── StopTrigger
│   │
│   ├── Connector_2A_HillFoot
│   │
│   └── Zone_3A_Hill
│       ├── HillFoot
│       ├── UphillSurface
│       ├── HillStopLine
│       ├── HillStopTrigger
│       ├── HillCrest
│       ├── DownhillSurface
│       └── ExitTo4A
│
└── FinishCorridor
    └── Zone_15A_Finish
        ├── FinishApproach
        ├── FinishLine
        ├── FinishText
        └── FinishTrigger
```

`StartCorridor` và `FinishCorridor` là hai vùng vật lý khác nhau.

---

# 17. Quy tắc dựng đảo cỏ

Các vùng màu xanh trên CAD được coi là:

```txt
NON_DRIVABLE_ZONE
```

Tạo:

```txt
GrassIslandMesh
GrassIslandCollider
```

Không để xe đi xuyên qua đảo.

Collider có thể đơn giản hơn mesh hiển thị.

---

# 18. Bó vỉa

Bó vỉa phải tách khỏi mặt đường.

```txt
CURB_MESH
CURB_COLLIDER
```

Bó vỉa nên chạy đúng theo đường biên CAD.

Đối với đoạn cong:

```txt
không dựng curb bằng nhiều box vuông góc thô
```

nếu đã có thông số bán kính.

Ưu tiên:

```txt
ArcCurve
Shape
ExtrudeGeometry
```

---

# 19. Đường cong

Bản quy hoạch có nhiều cung tròn ghi bán kính.

Nếu CAD cung cấp bán kính:

```txt
R = ...
```

Agent phải dựng bằng cung tròn chuẩn.

Không dùng spline tự do thay thế nếu đủ dữ liệu.

Ưu tiên:

```txt
Circle / Arc
→ offset
→ road boundary
→ curb
```

---

# 20. Đường vuông góc

Các đoạn vuông góc ở khu phía trên phải phải giữ:

```txt
90° turn topology
```

Không được smooth thành đường cong lớn chỉ vì lái xe dễ hơn.

Nếu bản vẽ có bo góc bằng bán kính:

```txt
dùng radius đúng CAD
```

---

# 21. Đường nối giữa các bài

Các bài thi không được nối bằng teleport.

Phải có:

```txt
CONNECTOR_ROAD
```

giữa:

```txt
exercise.exit
→ next exercise.entry
```

Connector road phải theo đúng hướng tuyến CAD.

---

# 22. Vạch đường

Các loại vạch chính:

```txt
STOP_LINE
CROSSWALK
BOUNDARY_LINE
LANE_ARROW
GUIDE_LINE
ROAD_TEXT
```

Vạch phải tách khỏi road mesh.

Nâng lên nhẹ:

```txt
Y ≈ 0.005–0.015 m
```

để tránh z-fighting.

Đây là giá trị render, không phải kích thước quy chuẩn.

---

# 23. Ngã tư

Ngã tư không chỉ là mesh.

Phải gồm:

```txt
IntersectionGeometry
StopLines
Crosswalks
TrafficLights
Signs
RouteSensors
```

Các lần đi qua khác nhau phải được ghi nhận bằng route state:

```txt
5A  = đi thẳng
7A  = đi thẳng
10A = rẽ trái
14A = rẽ phải
```

---

# 24. Route state machine

```txt
CURRENT_STEP
      ↓
detect entry marker
      ↓
activate exercise logic
      ↓
complete exercise
      ↓
unlock next route segment
      ↓
NEXT_STEP
```

Ví dụ:

```ts
routeState.current = '6A_S_CURVE';
```

sau khi hoàn thành:

```ts
routeState.current = '7A_INTERSECTION_STRAIGHT_2';
```

---

# 25. Navigation path

Agent phải tạo một path logic riêng với road mesh.

```txt
Visual Road Mesh
≠
Vehicle Navigation Path
```

Navigation path dùng để:

```txt
- debug tuyến;
- AI vehicle;
- camera preview;
- kiểm tra đi sai hướng;
- chỉ dẫn HUD.
```

---

# 26. Road graph

Đề xuất:

```ts
interface YardRoadNode {
  id: string;
  position: THREE.Vector3;
}

interface YardRoadEdge {
  from: string;
  to: string;
  oneWay: true;
  segmentId: string;
}
```

Toàn sân được biểu diễn thành directed graph.

---

# 27. Entry / Exit của mỗi zone

Mỗi zone phải có:

```txt
ENTRY_POINT
ENTRY_DIRECTION

EXIT_POINT
EXIT_DIRECTION
```

Ví dụ:

```ts
interface YardZonePort {
  position: THREE.Vector3;
  direction: THREE.Vector3;
}
```

---

# 28. Liên kết với file quy chuẩn bài thi

Mỗi zone chỉ chịu trách nhiệm:

```txt
WHERE
```

tức là:

```txt
- nằm ở đâu;
- quay hướng nào;
- nối với đường nào.
```

File quy chuẩn bài thi chịu trách nhiệm:

```txt
WHAT / HOW BIG
```

tức là:

```txt
- hình học bài;
- công thức;
- kích thước;
- sensor nội bộ.
```

Quan hệ:

```txt
YARD STANDARD
      │
      │ placement
      ▼
EXERCISE STANDARD
      │
      │ geometry
      ▼
FINAL THREE.JS MODULE
```

---

# 29. Kiến trúc code đề xuất

```txt
src/
│
├── exam-yard/
│
│   ├── standards/
│   │   ├── exercise-standard.ts
│   │   └── yard-standard.ts
│   │
│   ├── layout/
│   │   ├── HiepPhatLayout.ts
│   │   ├── YardRoadGraph.ts
│   │   └── YardMarkers.ts
│   │
│   ├── zones/
│   │   ├── StartFinishZone.ts
│   │   ├── IntersectionZone.ts
│   │   ├── SCurveZone.ts
│   │   ├── ParkingZone.ts
│   │   └── ...
│   │
│   ├── builders/
│   │   ├── RoadBuilder.ts
│   │   ├── CurbBuilder.ts
│   │   ├── GrassIslandBuilder.ts
│   │   └── MarkingBuilder.ts
│   │
│   └── HiepPhatExamYard.ts
```

---

# 30. Quy tắc đọc dữ liệu từ CAD

Thứ tự ưu tiên:

```txt
PRIORITY 1
Giá trị số ghi trực tiếp trên CAD.

PRIORITY 2
Bảng thông số kỹ thuật sân đã thi công.

PRIORITY 3
Công thức trong file quy chuẩn bài thi.

PRIORITY 4
Topology / hình dạng nhìn thấy trên CAD.

PRIORITY 5
Ước lượng pixel.
```

Nếu dùng ước lượng:

```txt
status = ESTIMATED
```

Nếu cần kiểm chứng:

```txt
status = NEEDS_CAD_VERIFICATION
```

---

# 31. Không được scale ảnh trực tiếp thành sân

Agent không được:

```txt
take screenshot
→ map pixel 1:1
→ extrude
```

vì ảnh raster có thể:

```txt
- bị resize;
- bị crop;
- không đúng DPI CAD;
- mất tỷ lệ;
- có text/annotation chồng lên geometry.
```

Ảnh chỉ dùng để xác định topology khi chưa đọc được CAD vector.

---

# 32. Cách chuyển CAD sang Three.js

Pipeline:

```txt
CAD / PDF
   ↓
dimension extraction
   ↓
road centerline
   ↓
curve radius
   ↓
road boundaries
   ↓
grass islands
   ↓
curbs
   ↓
markings
   ↓
exercise placements
   ↓
route markers
   ↓
sensors
   ↓
Three.js scene
```

---

# 33. Debug mode sân

Bắt buộc có:

```ts
const YARD_DEBUG = true;
```

Khi bật, hiển thị:

```txt
- origin;
- trục X/Z;
- marker 1A → 15A;
- zone boundary;
- road centerline;
- entry / exit;
- road graph;
- sensor;
- bán kính cung;
- kích thước đường;
- ID object.
```

---

# 34. Naming convention

## Zone

```txt
ZONE_01_START
ZONE_02_PEDESTRIAN
ZONE_03_HILL
...
ZONE_15_FINISH
```

## Marker

```txt
MARKER_1A
MARKER_2A
...
```

## Road

```txt
ROAD_MAIN_001
ROAD_CONNECTOR_002
ROAD_EXERCISE_006
```

## Curb

```txt
CURB_006_LEFT
CURB_006_RIGHT
```

## Sensor

```txt
SENSOR_6A_ENTRY
SENSOR_6A_EXIT
```

---

# 35. Performance

Không dựng toàn sân thành một mesh duy nhất.

Nên chia:

```txt
Road chunks
Grass islands
Curbs
Signs
Markings
Sensors
```

Có thể merge theo material sau khi hoàn tất geometry.

Không merge:

```txt
traffic light
sensor
marker
interactive sign
```

nếu gameplay cần truy cập riêng.

---

# 36. Collision

Không dùng visual mesh làm collider trực tiếp cho toàn sân.

Nên tạo:

```txt
ROAD_COLLIDER
CURB_COLLIDER
ISLAND_COLLIDER
BUILDING_COLLIDER
```

dạng geometry đơn giản.

---

# 37. Các vùng không chạy xe

Các vùng sau là non-drivable:

```txt
- đảo cỏ;
- bó vỉa;
- khu nhà;
- vùng điều hành;
- vùng ngoài ranh sân;
- khu vực không nằm trong route.
```

Agent phải có:

```txt
DrivableMask
```

hoặc collider tương đương.

---

# 38. Mặt đường

Khuyến nghị dùng PBR material:

```txt
asphalt
```

nhưng texture không được làm thay đổi kích thước hoặc biên đường.

Visual:

```txt
asphalt texture
roughness
normal map
```

chỉ là presentation layer.

---

# 39. Màu debug khái niệm

Nếu dùng debug, có thể phân nhóm:

```txt
ROAD
GRASS
CURB
SENSOR
MARKER
CENTERLINE
```

Màu thực tế do renderer quyết định.

Không coi màu debug là quy chuẩn pháp lý.

---

# 40. Kiểm tra toàn sân

Trước khi coi sân hoàn thành, Agent phải validate:

```txt
1. Route 1A → 15A liên tục.

1.1. `1A → 2A → 3A` phải nằm trên cùng một corridor logic, không có teleport và không có chuyển hướng tùy ý.

1.2. `3A_STOP_LINE` phải thuộc phần dốc lên, không được đặt tại chân dốc.

1.3. `ZONE_01_START` và `ZONE_15_FINISH` phải là hai zone vật lý độc lập.

2. Không có đoạn route bị đứt.

3. Tất cả entry/exit đúng hướng.

4. Xe không phải teleport giữa các bài.

5. Tất cả marker nằm trên đúng tuyến.

6. Geometry bài thi lấy từ exercise spec.

7. Geometry bài không bị thay đổi để vừa layout.

8. Các connector không xâm lấn bài khác.

9. Đảo cỏ không nằm trên drivable route.

10. Curb có collider.

11. Stop line và crosswalk đúng vị trí relative.

12. Các lần qua ngã tư đúng action:
    thẳng / trái / phải.

13. Route hạng B không bắt buộc thực hiện bài dành riêng D/E.

14. Scale toàn sân = 1 meter/unit.
```

---

# 41. Quy tắc dành riêng cho hạng B

Game hiện tại ưu tiên hạng B với:

```txt
VIOS 1.5E 2017
```

Do đó cấu hình sân mặc định:

```ts
export const DEFAULT_EXAM_CLASS = 'B';
```

Geometry bài thi phải lấy:

```txt
a   = 4.410
b   = 1.700
B1  = 0.185
Rqv = 5.100
L   = 2.550
```

Không dùng kích thước xe C/D/E để build route B.

---

# 42. Phân biệt geometry sân và geometry bài thi

Ví dụ bài chữ S:

```txt
YARD STANDARD:
- chữ S nằm phía trên-trái;
- hướng xe vào;
- hướng xe ra;
- đường nào nối trước/sau.

EXERCISE STANDARD:
- Bqc;
- Rn;
- Rtr;
- Sqc;
- geometry biên trong/ngoài.
```

Đây là cách Agent phải tách trách nhiệm.

---

# 43. Config tổng thể đề xuất

```ts
interface HiepPhatYardConfig {
  units: 'meter';

  origin: {
    x: number;
    y: number;
    z: number;
  };

  vehicleClass: 'B' | 'C' | 'D' | 'E';

  route: readonly string[];

  markers: YardMarker[];

  roads: YardRoadSegment[];

  zones: YardZonePlacement[];

  debug: boolean;
}
```

---

# 44. Placement của bài thi

```ts
interface YardZonePlacement {
  id: string;

  exerciseType: string;

  position: {
    x: number;
    y: number;
    z: number;
  };

  rotationY: number;

  entryRoadId: string;
  exitRoadId: string;
}
```

Khi chưa đọc được tọa độ chính xác:

```txt
position = NEEDS_CAD_VERIFICATION
```

Không tự gán số đo tùy ý.

---

# 45. Nguyên tắc cuối cùng cho Agent

```txt
RULE_YARD_01
Sân được dựng theo layout thực tế, không dựng tuyến giả.

RULE_YARD_02
Tất cả geometry bài thi lấy từ exercise specification.

RULE_YARD_03
Không được co kéo bài thi để vừa khoảng trống.

RULE_YARD_04
Nếu layout không đủ chỗ theo geometry chuẩn:
báo conflict thay vì scale bài.

RULE_YARD_05
Mỗi bài có entry/exit rõ ràng.

RULE_YARD_06
Tuyến thi là directed route.

RULE_YARD_07
Ngã tư có thể được sử dụng nhiều lần.

RULE_YARD_08
Marker 1A..15A chỉ route thi.

RULE_YARD_09
Marker 1..14 chỉ route đào tạo mở rộng.

RULE_YARD_10
Hạng B dùng VIOS 2017 khi mô phỏng sân thi.

RULE_YARD_11
Số đo CAD có ưu tiên cao hơn việc đo pixel.

RULE_YARD_12
Ảnh chỉ là visual reference nếu đã có số đo CAD.

RULE_YARD_13
Không tự bịa tọa độ chính xác.

RULE_YARD_14
Không tự sửa kích thước quy chuẩn.

RULE_YARD_15
Scene phải modular và có thể debug.

RULE_YARD_16
1A, 2A và 3A phải được bố trí liên tục trên cùng trục dọc phía phải sân.

RULE_YARD_17
1A nằm cạnh Phòng điều hành F; không được đặt ở khu ghép xe hoặc khu đường cong.

RULE_YARD_18
3A_STOP_LINE nằm trên dốc lên; HILL_FOOT và 3A_STOP_LINE là hai mốc khác nhau.

RULE_YARD_19
15A là khu kết thúc riêng; tuyệt đối không gộp với 1A.

RULE_YARD_20
Khi đối chiếu PDF/CAD, ưu tiên topology và kích thước bản vẽ gốc hơn ảnh minh họa đã tạo trước đó.
```

---

# 46. Prompt cho Codex/Agent

```txt
Bạn đang dựng toàn bộ sân sát hạch Hiệp Phát bằng Three.js.

Có 2 file specification:

1. hiep_phat_exam_yard_standard.md
   → quyết định layout, route, zone, vị trí, hướng xe,
     marker, road network và tổ chức toàn sân.

2. threejs_exam_yard_specification_v2.md
   → quyết định geometry và quy chuẩn chi tiết của từng bài thi.

Không trộn vai trò của hai file.

Yêu cầu:

- Dùng 1 unit = 1 meter.
- Dùng hệ trục Y-up.
- Build road network trước.
- Sau đó đặt exercise modules vào đúng zone.
- Không scale exercise geometry để vừa layout.
- Dùng route 1A → 15A cho sân thi.
- Dùng VIOS 2017 cho hạng B.
- Tạo entry/exit cho từng zone.
- Tạo directed road graph.
- Tách visual geometry và collider/sensor.
- Tạo debug mode.
- Mọi kích thước chưa xác minh phải đánh dấu NEEDS_CAD_VERIFICATION.
```

---

# 47. Quan hệ giữa hai tài liệu

```txt
hiep_phat_exam_yard_standard.md
            │
            │ WHERE?
            │
            ▼
      Bố trí toàn sân
            │
            │
            ├──────────────┐
            │              │
            ▼              ▼
       road network    exercise placement
                           │
                           │ HOW?
                           ▼
threejs_exam_yard_specification_v2.md
                           │
                           ▼
                    exercise geometry
                           │
                           ▼
                     FINAL SCENE
```

---

# 48. Kết luận

Tài liệu này mô tả **sân Hiệp Phát như một hệ thống giao thông và không gian hoàn chỉnh**.

File quy chuẩn bài thi mô tả **từng bài**.

Hai file phải được giữ riêng:

```txt
YARD STANDARD
= sân nằm như thế nào

EXERCISE STANDARD
= từng bài được dựng như thế nào
```

Đây là kiến trúc dữ liệu phù hợp để Agent/Codex có thể dựng đúng sân sát hạch Hiệp Phát trên Three.js mà vẫn giữ được tính modular, có thể kiểm tra và có thể mở rộng cho nhiều hạng xe.
