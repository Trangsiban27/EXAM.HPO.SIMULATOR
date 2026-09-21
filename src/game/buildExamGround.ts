import * as THREE from 'three';
import { ExerciseSign } from './ExerciseSign';
import type { TrackObjects } from './TrackObjects';
import { StarShape } from './StarShape';
import { startPosition } from './startPosition';

/** Positions and dimensions of the examination ground. */
export function buildExamGround(objects: TrackObjects) {
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),
    new THREE.MeshStandardMaterial({color:0x63735a,roughness:1}));

    ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;

    objects.root.add(ground);

    objects.addRoad(0, -2, 8, 20, 'horizontal', 'straight', 'white-dashed');
    // ZONE_01_START: vạch xuất phát + chữ "XUẤT PHẤT" + marker 1A. Cây đèn
    // tín hiệu bị xoá khỏi bài 1 — chỉ bật khi truyền withSignal: true.
    objects.addStartZone(startPosition.lineX, startPosition.lineZ, 'horizontal', 8);
    // Road segment BEFORE the start line (negative X side). Extended to 65m so the
    // vehicle spawn point (15m behind the line, x = lineX - distance = -50) sits
    // squarely on asphalt instead of bare ground.
    objects.addRoad(-35, -2, 8, 60, 'horizontal', 'straight', 'white-dashed');
    objects.addRoad(8, -2, 8, 20, 'horizontal', 'straight', 'white-dashed');
    // T-junction: this branch ends at the main road's center, opening only its north side.

    // ============================================================
    // ZONE_02_PEDESTRIAN (2A) — DỪNG XE NHƯỜNG ĐƯỜNG CHO NGƯỜI ĐI BỘ
    // Trên cùng corridor với 1A (main road, axis along X).
    // Xe spawn tại X = -50, heading -PI/2 (hướng +X).
    // Vạch xuất phát 1A tại X = -35.
    // Crosswalk tại X = -5 (giữ nguyên từ layout sân).
    // Vạch dừng 2A đặt tại X = -8 (3 m trước crosswalk) — đúng thứ tự
    // spec §7.1: [xe] → vạch dừng → crosswalk.
    // Khoảng cách spawn→2A: -8 - (-50) = 42 m.
    // ============================================================
    const EX02_CROSSWALK_X = -5;
    const EX02_STOP_LINE_X = -7;
    const EX02_STOP_BAR_X = -7.5;   // 8 m trước crosswalk, học viên dễ canh điểm dừng

    // Crosswalk có sẵn (line 35) — addPedestrianZone sẽ attach lại vào zone.
    objects.addPedestrianCrossing(EX02_CROSSWALK_X, -2, 'horizontal', 8, 3);

    // Stop-bar cảnh báo thị giác: dừng trước vạch này = không trừ điểm (không có sensor gameplay).
    const zone2A = objects.addPedestrianZone({
        stopLineX: EX02_STOP_LINE_X,
        crosswalkX: EX02_CROSSWALK_X,
        roadZ: startPosition.lineZ,
        roadWidth: 8,
        direction: 'horizontal',
    });

    // ============================================================
    // ZONE_03_HILL (3A) — DỪNG VÀ KHỞI HÀNH XE NGANG DỐC
    // Trên cùng corridor với 1A và 2A (trục dọc phía phải sân).
    // Xe đi từ 2A (X=-8) → lên cầu → dừng tại vạch 3A → qua đỉnh dốc → tiếp tục.
    //
    // Theo Bridge.ts (đã sửa — vạch ở ramp lên TÂY):
    //   - Bridge at X=31, Z=-2, direction='horizontal'
    //   - Sau rotation -PI/2: local +Z → world X nhỏ hơn, mapping world_X = 31 - local_Z
    //   - Stop line tại local Z = +5.5 → world X = 31 - 5.5 = 25.5 (xe đang lên dốc)
    //   - Yellow reference tại local Z = +9.5 → world X = 31 - 9.5 = 21.5
    //   - Đỉnh dốc tại local Z = 0 → world X = 31
    //   - Chân dốc phía TÂY (xe vào) tại world X = 31 - 13 = 18
    //   - Chân dốc phía ĐÔNG (xe ra) tại world X = 31 + 13 = 44
    // ============================================================
    const EX03_STOP_LINE_X = 25.5;  // = 31 - 5.5 (matches Bridge.ts local Z=+5.5 stop line center)
    const EX03_EXIT_X = EX03_STOP_LINE_X + 3;  // Exit sensor 3m sau vạch dừng

    // Vạch dừng 3A (trên cầu, đã có sẵn trong Bridge.ts geometry)
    // Tham chiếu 0.5 m đặt TRƯỚC vạch dừng (theo hướng xe đến) — học viên
    // canh khoảng cách A dương để dừng hợp lệ. Vị trí: world X = 25.0.
    const ex03Ref05 = new THREE.Mesh(
        new THREE.BoxGeometry(8, .008, .05),
        new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: .85 })
    );
    ex03Ref05.position.set(EX03_STOP_LINE_X - 0.5, .07, startPosition.lineZ);
    ex03Ref05.receiveShadow = true;
    ex03Ref05.name = 'EX03_REFERENCE_0_5M';
    objects.root.add(ex03Ref05);

    // Chữ "0.5 m" bên cạnh vạch tham chiếu
    const ex03Ref05Label = objects.makeGroundLabel('0.5 m',
        EX03_STOP_LINE_X - 0.5, startPosition.lineZ + 4, 8, .55);
    ex03Ref05Label.name = 'EX03_REFERENCE_0_5M_TEXT';
    objects.root.add(ex03Ref05Label);

    // Sensor logic cho bài 3 (attach vào userData của một group)
    const zone3A = new THREE.Group();
    zone3A.name = 'ZONE_03_HILL';
    objects.root.add(zone3A);

    const halfWidth = 8 / 2;
    const roadZ = startPosition.lineZ;
    // Stop line sensor — dải mỏng tại vạch dừng 3A
    // Box3(worldX_min, worldY_min, worldZ_min) → (worldX_max, worldY_max, worldZ_max)
    const stopLineSensor = new THREE.Box3(
        new THREE.Vector3(EX03_STOP_LINE_X - .15, -1, roadZ - halfWidth),
        new THREE.Vector3(EX03_STOP_LINE_X + .15, 3, roadZ + halfWidth)
    );
    // Over-line sensor — phát hiện thanh cản trước đã vượt vạch
    const overLineSensor = new THREE.Box3(
        new THREE.Vector3(EX03_STOP_LINE_X + .15, -1, roadZ - halfWidth),
        new THREE.Vector3(EX03_STOP_LINE_X + 1, 3, roadZ + halfWidth)
    );
    // Exit sensor — 3m sau vạch dừng
    const exitSensor = new THREE.Box3(
        new THREE.Vector3(EX03_EXIT_X - .4, -1, roadZ - halfWidth),
        new THREE.Vector3(EX03_EXIT_X + .4, 3, roadZ + halfWidth)
    );
    // Vùng tiếp cận — 15m trước vạch dừng
    const approachEntryX = EX03_STOP_LINE_X - 15;
    const approachSensor = new THREE.Box3(
        new THREE.Vector3(approachEntryX, -1, roadZ - halfWidth),
        new THREE.Vector3(EX03_STOP_LINE_X + .15, 3, roadZ + halfWidth)
    );

    zone3A.userData = {
        sensors: {
            stopLine: stopLineSensor,
            overLine: overLineSensor,
            exitSensor,
            approachSensor,
        },
        metadata: {
            stopLineX: EX03_STOP_LINE_X,
            exitX: EX03_EXIT_X,
            roadZ,
            roadWidth: 8,
            direction: 'horizontal',
            markerId: '3A',
        },
    };

    // The existing road ends at X=18; the bridge connects there and ends at X=44.
    objects.addBridge(31, -2, 'horizontal');
    objects.addRoad(49, -2, 8, 20, 'horizontal', 'straight', 'white-solid');
    objects.addRoad(69, -2, 8, 20, 'horizontal', 'straight', 'white-solid');
    objects.addRightAngleTurn(79, -2, 8, 'horizontal', 'left', 'white-solid');
    objects.addRoad(79, -8, 8, 6, 'vertical', 'straight', 'white-dashed');
    objects.addRoad(79, -15, 8, 10, 'vertical', 'straight', 'white-dashed');
    
    // ZONE_04_HILL (4A) — DỪNG VÀ KHỞI HÀNH XE NGANG DỐC
    // Nested courses: each successive entry extends one lane pitch farther
    // before turning, keeping the elbows alongside rather than across each other.
    //
    // Spec §9.2 hard constraints (VIOS — hạng B):
    //   Bv = 2.2 * b = 3.96 m   chiều rộng làn đường vuông góc
    //   Lv = 2.0 * a = 8.8  m   chiều dài đường vuông góc
    //   Sv = 1.5 * a = 6.6  m   chiều sâu đoạn vuông góc (exit leg)
    const Bv = 2.2 * 2;
    const Lv = 2.0 * 4.4;
    const Sv = 1.5 * 4.4;
    const coursePitch = Bv + .44;
    // objects.root.add(new ExerciseSign({
    //     title: 'QUA VỆT BÁNH XE\nVÀ ĐƯỜNG VÒNG VUÔNG GÓC',
    //     subtitle: 'Đưa bánh phải vào giữa hai vạch trắng',
    //     x: 72, z: -12.92, rotation: Math.PI / 2
    // }).root);
    objects.addRoad(79, -27, 8, 14, 'vertical', 'straight', 'white-dashed');
    // objects.addRoad(79, -10, 8, 6, 'vertical', 'straight', 'yellow-dashed');

    for (let i = 0; i < 4; i++) {
        const entryZ = -18 - i * coursePitch;
        const entryLength = 10.8 + i * coursePitch;

        // Đặt hình vệt bánh xe + đường vuông góc (Bài 04) — lấy về world exit để đặt đường ra
        const sensors = objects.addWheelTrackCourse({
            x: 73, z: entryZ, direction: 'horizontal', entryLength
        });
        // Store all 4 course sensors for Exam04 use
        objects.wheelTrackCourseSensors.push(sensors);

        // Đường nối từ main road (X=79) vào entry — đúng chiều sâu Sv theo spec §9.2
        objects.addRoad(76, entryZ, Bv, Sv, 'horizontal', 'none', 'white-solid', 1);

        // Đường ra: mirror entry — vertical road đặt tại course exit, kéo dài Sv về phía nam
        // (hướng xe chạy khi thoát khỏi course). Width = Bv (theo chiều X), length = Sv (theo chiều Z).
        // Vị trí tâm đường: world exit của course. Đường kéo dài về phía -Z (hướng thoát) cho Sv.
        objects.addRoad(
            sensors.exitWorld.x - 10, sensors.exitWorld.z,
            Bv, Sv + 18, 'horizontal', 'none', 'white-solid', 1
        );

    }

    //road ra đường vòng vuông góc số 3
    objects.addRoad(25, -18.85, Bv, 2, 'horizontal', 'none', 'white-solid', 1);
    //road ra đường vòng vuông góc số 2
    objects.addRoad(27, -14.05, Bv, 7, 'horizontal', 'none', 'white-solid', 1);
    //road ra đường vòng vuông góc số 1
    objects.addRoad(30, -9.25, Bv, 12, 'horizontal', 'none', 'white-solid', 1);

    ////////////////////////////////////////////////////////////////////////////

    objects.addRoad(21, -24, 8, 36, 'vertical', 'straight', 'yellow-dashed');
    objects.addPedestrianCrossing(21, -36, 'vertical', 8, 3);
    // Đường ngang phía ĐÔNG ngã tư (xe từ Đông đến dừng trước crosswalk)
    objects.addRoad(34, -42, 8, 26, 'horizontal', 'straight', 'yellow-dashed');
    // Crosswalk phụ ở rìa phía Đông (giữ visual hint ở giữa ngã tư bằng 2 crosswalk dưới)
    objects.addPedestrianCrossing(27, -42, 'horizontal', 8, 3);
    objects.addPedestrianCrossing(15, -42, 'horizontal', 8, 3);
    // Đường ngang phía TÂY ngã tư (xe từ Tây đến dừng trước crosswalak)
    objects.addRoad(8, -42, 8, 26, 'horizontal', 'straight', 'yellow-dashed');
    objects.addRoad(21, -50, 8, 10, 'vertical', 'straight', 'yellow-dashed');
    objects.addPedestrianCrossing(21, -48, 'vertical', 8, 3);
    
    // Pole luôn lệch local -X (TrafficLight.ts: poleX = -width/2 - 0.55).
    // Đường dọc NS trải X ∈ [17, 25]; đường ngang EW trải Z ∈ [-46, -38].
    // Pole phải nằm ngoài lane; panel chính hướng về chiều xe đến.
    for (const [x, z, rotation, stopLineZ, stopLineX, triggerStart, triggerStartX, triggerLength, markerId] of [
        [30, -36, 0, 6, -7, 7, , 2, 'SOUTH'], // Pole ở X=16.45 (ngoài mép Tây đường dọc). Panel +Z → xe từ Nam.
        [12, -47, Math.PI, 7, -7, 7, ,2, 'NORTH'], // Pole ở X=25.55 (ngoài mép Đông đường dọc). Panel -Z → xe từ Bắc.
        [16, -42, Math.PI / 2, -6, -2, -10, -6, 2, 'WEST'],  // Pole ở Z=-37.45 (ngoài mép Bắc đường ngang). Panel +X → xe từ Tây.
        [26, -42, -Math.PI / 2, -4, -2, -10, -6, 2, 'EAST'],  // Pole ở Z=-46.55 (ngoài mép Nam đường ngang). Panel -X → xe từ Đông.
    ] as const) {
        objects.addTrafficLight(
            x, 
            z, 
            8,
            rotation, 
            { 
                stopLineZ,
                stopLineX, 
                triggerStart,
                triggerStartX,
                triggerLength, 
                markerId: markerId 
            }
        );
    }

    // Vạch hoàn thành bài 5: vùng xanh lá nhạt phía nam ngã tư.
    // Xe đi qua ngã tư South → chạm zone (frontPosition ∈ Box3)
    // → Exam05South.state = COMPLETED → ExamEngine.finished = true.
    // Tâm (23, -45): lane phải của đường dọc X∈[17,25], ngay sau crosswalk Z=-48.
    // Kích thước 4×6: rộng 4m theo X (đúng lane phải), dài 6m theo Z để bắt chắc
    // dù xe vào zone với góc lệch nhẹ. Box3 sensor trong ExamEngine.ts phải khớp
    // vị trí và kích thước này (xem wireExam05South).
    objects.addTriggerZone(23, -45, 4, 6);

    objects.addRoad(21, -60, 8, 30, 'vertical', 'straight', 'yellow-dashed');
    objects.addRoad(21, -70, 8, 20, 'vertical', 'straight', 'yellow-dashed');
    objects.addRoad(21, -94, 8, 34, 'vertical', 'straight', 'yellow-dashed');
    objects.addRoad(21, -120, 8, 34, 'vertical', 'straight', 'yellow-dashed');

    // The straight ends at Z=-80; the corner enters there and exits toward +X.
    objects.addRightAngleTurn(21, -138, 8, 'vertical', 'right', 'yellow-dashed');

    objects.addFourLaneRoad({
        x: 45,
        z: -132,
        lengthM: 45,
        laneWidthM: 4,
        rotationY: Math.PI / 2,
    });

    objects.addRoad(82, -140, 4, 29, 'horizontal', 'straight', 'yellow-dashed', 1, -Math.PI);

    // Exam 06
    // objects.addRoad(34, -100, 8, 20, 'horizontal', 'straight', 'yellow-dashed');
    // Branch from the right (+Z) side of the eastbound main road.

    objects.addRightAngleTurn(100, -138, 8, 'vertical', 'left', 'white-dashed');

    objects.addRoad(100, -108, 8, 60, 'vertical', 'straight', 'white-dashed');
    objects.addRoad(100, -66, 8, 40, 'vertical', 'straight', 'white-dashed');

    // Mirror turn phía Bắc line 262: xe đi Nam → Bắc (-Z) rồi quẹo phải về hướng Đông (+X).
    objects.addRightAngleTurn(100, -42, 8, 'vertical', 'right', 'yellow-dashed', 2, Math.PI);

    objects.addRoad(66, -42, 8, 60, 'horizontal', 'straight', 'yellow-dashed');

    // ============================================================
    // BÀI 06 — QUA ĐƯỜNG VÒNG QUANH CO CHỮ S
    // Số đo lấy theo spec/road/s_curve_road_cad_spec.md §3–§6, §28:
    //   Hạng B: Rn=6.30 Rtr=2.56 Bqc=3.74 Sqc=8.86
    //   Hạng C: Rn=9.50 Rtr=4.572 Bqc=4.928 Sqc=14.072
    //   Hạng D: Rn=8.60 Rtr=4.024 Bqc=4.576 Sqc=12.624
    //   Hạng E: Rn=11.20 Rtr=5.70 Bqc=5.50 Sqc=16.90 (CAD label "HẠNG F")
    // validateWindingCourseSpec() chạy runtime để đảm bảo Bqc = Rn - Rtr
    // và Sqc = Rn + Rtr (sai số 0.005 m).
    // ============================================================
    // Hạng B — VIOS 1.5E (b = 1.700 m → width = 3.74 m)
    objects.addWindingCourse({ x: 32, z: -125, entryLength: 70, exitLength: 10, vehicleClass: 'B' });
    // Hạng C — THACO OLLIN450A (b = 2.240 m → width = 4.928 m)
    objects.addWindingCourse({ x: 40, z: -124, entryLength: 50, exitLength: 30, vehicleClass: 'C' });
    // Hạng D — COUTY HD29 E3 (b = 2.080 m → width = 4.576 m)
    objects.addWindingCourse({ x: 48, z: -127, entryLength: 30, exitLength: 55, vehicleClass: 'D' });
    // Hạng E — TRANSINCO K52 E2 (b = 2.500 m → width = 5.500 m)
    objects.addWindingCourse({ x: 64, z: -124, entryLength: 4, exitLength: 78, vehicleClass: 'E' });

    // Tạo railway crossing road tại vị trí (x, z)
    objects.addRailwayCrossingRoad({
        x: 20,
        z: 0,
        roadWidthM: 4.0,
        rotationY: 0, // có thể xoay theo hướng đường
    });

    // ============================================================
    // DECORATION: ngôi sao 5 cánh ở góc xa Đông-Nam của sân.
    // Vị trí (130, 80) nằm ngoài tất cả các corridor bài thi, không ảnh hưởng
    // đến sensor/penalty zone nào.
    // ============================================================
    objects.root.add(new StarShape({
        x: 34,
        z: -32,
        size: 4,
        color: '#fe2020',
        rotationY: 120,
    }).root);
    
}
