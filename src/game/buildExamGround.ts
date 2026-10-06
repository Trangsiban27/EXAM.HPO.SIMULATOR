import * as THREE from 'three';
import { ExerciseSign } from './ExerciseSign';
import type { TrackObjects } from './TrackObjects';
import { StarShape } from './StarShape';
import { startPosition } from './startPosition';
import { PERPENDICULAR_PARKING_BAY_B } from './PerpendicularParkingBayB';
import { PERPENDICULAR_PARKING_C } from './PerpendicularParkingBayC';
import {
    EXAM_02_ROAD_CENTER_X,
    EXAM_02_ROAD_LENGTH_M,
    EXAM_02_APPROACH_LENGTH_M,
    EXAM_02_STOP_LINE_X,
    EXAM_03_BRIDGE_CENTER_X,
    EXAM_03_STOP_LINE_X,
} from './exam/examCourseGeometry';

/** Positions and dimensions of the examination ground. */
export function buildExamGround(objects: TrackObjects) {
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),
    new THREE.MeshStandardMaterial({color:0x63735a,roughness:1}));

    ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;

    objects.root.add(ground);

    objects.addRoad(7.2, 18.2, 2 * 3.7, 20, 'horizontal', 'straight', 'white-dashed', 2);
    // Đầu đường này nối trực tiếp với crossingRoad ở x ≈ 17,2.

    // ============================================================
    // Bài 2A: vạch dừng, lối qua đường và cảm biến cùng nằm trên đường hướng +X.
    // Tọa độ vạch dừng dùng EXAM_02_STOP_LINE_X ở phần dựng đường bên dưới.

    // ============================================================
    // ZONE_03_HILL (3A) — DỪNG VÀ KHỞI HÀNH XE NGANG DỐC
    // Vạch dừng trên cầu tại X = 59.81; vạch này dùng chung tọa độ với ExamEngine.
    // ========================sS====================================
    const EX03_STOP_LINE_X = EXAM_03_STOP_LINE_X;
    const EX03_EXIT_X = EX03_STOP_LINE_X + 3;   // Exit sensor 3m sau vạch dừng

    // Vạch dừng màu trắng được vẽ trên mặt cầu trong Bridge.ts.

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

  
    // Đoạn đường 2 làn, mỗi làn 3.70 m; chỉnh x/z/góc trực tiếp khi cần.
    //đường kết thúc
    objects.addRoad(-15.3, -20.9, 2 * 3.7, 79.95, 'horizontal', 'straight', 'white-dashed', 2);
   
    objects.addRoadStraight955({
        // Đặt mép gần của thanh chạm mép ngoài curb cong cuối chuồng E:
        // local X = depth E + physical offset + curb width + nửa bề rộng thanh.
        x: 1.55,
        z: -1.41,
        widthM: 35.4,
        lengthM: 27.43,
        rotationY:  Math.PI / 2 ,
        showDebug: false,
        highlight: false,
        showEdges: false,
    });
 
    // Dải song song: tổng 43.79 m, chia thành 4 đoạn liền nhau.
   
 
    // CAD bài 2A: 14.79 m tiếp cận, vạch trắng, rồi 6.83 m chứa vạch qua đường.
    const crossingRoadX = EXAM_02_ROAD_CENTER_X;
    const crossingRoadZ = 18.2;
    const crossingRoadWidthM = 7.4;
    const crossingRoadLengthM = EXAM_02_ROAD_LENGTH_M;
    const crossingRoadStartX = crossingRoadX - crossingRoadLengthM / 2;
    const approachLengthM = EXAM_02_APPROACH_LENGTH_M;
    const crossingLengthM = crossingRoadLengthM - approachLengthM;
    const separatorX = EXAM_02_STOP_LINE_X;
    objects.addRoad(
        crossingRoadX, crossingRoadZ, crossingRoadWidthM, crossingRoadLengthM,
        'vertical', 'none', 'white-dashed', 2, Math.PI / 2,
    );
    // Vạch ở cuối đường đầu (x = 7.2 + 20/2 = 17.2); chữ ở đầu đường kế tiếp.
    objects.addStartZone(startPosition.lineX, crossingRoadZ, 'horizontal', crossingRoadWidthM, {
        textX: crossingRoadStartX + 1,
        textZ: crossingRoadZ,
    });
    for (const laneZ of [crossingRoadZ - crossingRoadWidthM / 4, crossingRoadZ + crossingRoadWidthM / 4]) {
        objects.addStraightRoadArrow(separatorX - 2.7, laneZ, 3.7, approachLengthM, Math.PI / 2, true);
    }
    objects.addLine(separatorX, crossingRoadZ, .18, crossingRoadWidthM - .4, 0xffffff);
    objects.addPedestrianCrossing(
        separatorX + crossingLengthM / 2, crossingRoadZ,
        'horizontal', crossingRoadWidthM, 5,
    );
    // Đoạn 11 m sau vạch qua đường: mũi tên hướng lên cầu, vạch trắng sát đầu cầu.
    const bridgeApproachX = 44.31;
    const bridgeApproachLengthM = 11;
    const bridgeApproachWhiteLineX = bridgeApproachX + bridgeApproachLengthM / 2 - .15;
    objects.addRoad(
        bridgeApproachX, crossingRoadZ, crossingRoadWidthM, bridgeApproachLengthM,
        'vertical', 'none', 'white-dashed', 2, Math.PI / 2,
    );
    for (const laneZ of [crossingRoadZ - crossingRoadWidthM / 4, crossingRoadZ + crossingRoadWidthM / 4]) {
        objects.addStraightRoadArrow(
            bridgeApproachWhiteLineX - 1.4, laneZ, 3.7, bridgeApproachLengthM, Math.PI / 2, true,
        );
    }
    objects.addLine(bridgeApproachWhiteLineX, crossingRoadZ, .18, crossingRoadWidthM - .4, 0xffffff);

    const exam03Bridge = objects.addBridge(EXAM_03_BRIDGE_CENTER_X, 18.2, 'horizontal', 7.4);
    objects.addRoad(97.6, 18.2, 7.4, 15.61, 'horizontal', 'none', 'white-dashed', 2);
    for (const laneZ of [18.2 - 7.4 / 4, 18.2 + 7.4 / 4]) {
        objects.addTurnRoadArrow(101.7, laneZ, 3.7, 15.61, 'left', -Math.PI / 2);
    }

    objects.addRightAngleTurn(109.101, 18.2, 7.4, 'horizontal', 'left', 'white-dashed', 2, 0, 3);
    objects.addRoad(109.1,-14.65, 7.4, 58.5, 'vertical', 'none', 'white-dashed', 2, Math.PI);
   

    // ZONE_04_HILL (4A) — DỪNG VÀ KHỞI HÀNH XE NGANG DỐC
    // Nested courses: each successive entry extends one lane pitch farther
    // before turning, keeping the elbows alongside rather than across each other.
    //
    // Spec §9.2 hard constraints (VIOS — hạng B):
    //   Bv = 2.2 * b = 3.96 m   chiều rộng làn đường vuông góc
    //   Lv = 2.0 * a = 8.8  m   chiều dài đường vuông góc
    //   Sv = 1.5 * a = 6.615 m   chiều sâu đoạn vuông góc (exit leg)
    const Bv = 2.2 * 2;
    const Lv = 2.0 * 4.4;
    const Sv = 6.615;
    // objects.root.add(new ExerciseSign({
    //     title: 'QUA VỆT BÁNH XE\nVÀ ĐƯỜNG VÒNG VUÔNG GÓC',
    //     subtitle: 'Đưa bánh phải vào giữa hai vạch trắng',
    //     x: 72, z: -12.92, rotation: Math.PI / 2
    // }).root);
    // objects.addRoad(79, -10, 8, 6, 'vertical', 'straight', 'yellow-dashed');
    // Mốc dừng ghi waypoint ở cuối cầu chỉ cần tọa độ, không cần tạo mặt đường
    // hoặc vạch kích thước nhô ra hai bên mép cầu.
    const bridgeDescentWaypointRoot = new THREE.Group();
    bridgeDescentWaypointRoot.position.set(EXAM_03_BRIDGE_CENTER_X + exam03Bridge.length / 2, 0, 18.2);
    objects.root.add(bridgeDescentWaypointRoot);
    objects.autoDriveWaypointStops.push({
        id: 'bridge-descent-waypoint-start',
        root: bridgeDescentWaypointRoot,
        widthM: 10,
        lengthM: 0.005,
        laneOffsetM: 3.7 / 2,
    });
    // Chuồng vuông góc 1
    const course1 = objects.addWheelTrackCourse({
        x: 105.4, 
        z: 1.3,
         direction: 'horizontal', 
         entryLength: 10.94,
        a: 4.410,
        b: 1.700,
        B1: 0.185,
        entrySvM: 6.62,
        exitLength:53.8,
    });
    objects.wheelTrackCourseSensors.push(course1);
   

    // Chuồng vuông góc 2
    const course2 = objects.addWheelTrackCourse({
        x: 105.4,
        z: -11.5,
        direction: 'horizontal',
        entryLength: 10.46,
        a: 7.630,
        b: 2.241,
        B1: 0.500,
        entrySvM: 11.45,
        exitLength: 42.59,
    });
    objects.wheelTrackCourseSensors.push(course2);

    // Chuồng vuông góc 3
    const course3 = objects.addWheelTrackCourse({
        x: 105.4,
        z: -19,
        direction: 'horizontal',
        entryLength: 19.69,
        a: 7.060,
        b: 4.58 / 2.2,
        B1: 0.440,
        exitLength: 35.3,
    });
    objects.wheelTrackCourseSensors.push(course3);

    // Chuồng vuông góc 4
    const course4 = objects.addWheelTrackCourse({
        x: 105.4,
        z: -33.5,
        direction: 'horizontal',
        entryLength: 20.65,
        a: 10.500,
        b: 2.500,
        B1: 0.590,
        exitLength: 21.5,
    });
    objects.wheelTrackCourseSensors.push(course4);

    // Mỗi chuồng có một mũi tên rẽ ở làn sát cửa vào, đặt trước cửa theo hướng -Z.
    const bayEntryLaneX = 109.1 - 7.4 / 4;
    const bayArrowLeadM = 2;
    for (const { entryWorld } of [course1, course2, course3, course4]) {
        objects.addTurnRoadArrow(bayEntryLaneX, entryWorld.z + bayArrowLeadM, 3.7, 10, 'left');
    }
    // CAD: mũi tên làn ngoài ở giữa D/C (hơi gần C), thay vì thẳng tim C.
    const bayOuterLaneX = 109.1 + 7.4 / 4;
    const betweenDAndCArrowZ = THREE.MathUtils.lerp(
        course3.entryWorld.z, course2.entryWorld.z, .6,
    ) + bayArrowLeadM;
    for (const arrowZ of [course1.entryWorld.z + bayArrowLeadM, betweenDAndCArrowZ, course4.entryWorld.z + bayArrowLeadM]) {
        objects.addTurnRoadArrow(bayOuterLaneX, arrowZ, 3.7, 10, 'left');
    }

    // Lối ra lùi một làn 3,7 m so với mép đường chính theo CAD.
    const exitApronLaneWidthM = 3.7;
    for (const { exitWorld } of [course1, course2, course3, course4]) {
        objects.addTurnRoadArrow(exitWorld.x + exitApronLaneWidthM + 2, exitWorld.z, 3.7, 10, 'right', Math.PI / 2);
    }



    ////////////////////////////////////////////////////////////////////////////
    //ngã tư đầu tiên
    // Một object gồm hai section nối liền: 3 làn chuyển thành 1 làn.
    // section 1 nằm ở làn thứ 3 (phía phải) của section 3 làn.
    objects.addFourLaneRoad({
        x: 19.4,
        z: -17.4,
        lengthM: 42,
        laneWidthM: 3.7,
        withArrows: false,
        withLaneMarkings: false,
        sectionAlignment: 'right',
        sections: [
            { lengthM: 25, laneCount: 3 },
            { lengthM: 34.5, laneCount: 1 },
        ],
    });
    // Làn nhập rộng thêm 3,7 m: đầu các dải cỏ nằm lùi khỏi đường một làn,
    // còn bãi cỏ lớn tiếp giáp đường và bo R10 như trên bản vẽ.
    objects.addWheelTrackExitApron(
        [course1, course2, course3, course4],
        19.4 + 3 * 3.7 / 2,
        exitApronLaneWidthM,
    );
    // Crosswalk phủ trọn đoạn 3 làn của đường tại Z=-36.5 (3 × 3.7 m).
    objects.addPedestrianCrossing(19.4, -36.5, 'vertical', 3 * 3.7, 3);
    // Đường ngang phía ĐÔNG ngã tư (xe từ Đông đến dừng trước crosswalk)
    // 2 làn × 3.70 m, cùng bề rộng làn với addFourLaneBidirectionalRoad().
    objects.addRoad(34, -42, 2 * 3.7, 26, 'horizontal', 'straight', 'yellow-dashed', 2);
    // Nối mép đông đường dọc với mép bắc đường ngang bằng góc curb R7.5.
    objects.addRoadCornerR7_5(19.4 + 3 * 3.7 / 2, -42 + 7.4 / 2);
    // Crosswalk phụ ở rìa phía Đông (giữ visual hint ở giữa ngã tư bằng 2 crosswalk dưới)
    objects.addPedestrianCrossing(27, -42, 'horizontal', 8, 3);
    objects.addPedestrianCrossing(12.5, -42, 'horizontal', 12, 3);
    // Đường ngang phía TÂY ngã tư (xe từ Tây đến dừng trước crosswalak)
    // objects.addRoad(8, -42, 8, 26, 'horizontal', 'straight', 'yellow-dashed');
    // objects.addRoad(21, -50, 8, 10, 'vertical', 'straight', 'yellow-dashed');
     // ============================================================
    // FOUR-LANE BIDIRECTIONAL ROAD — đường 4 làn hai chiều
    // Theo spec/road/road_4lane_bidirectional_spec.md
    // Layout: L1 ↓ | WHITE_DASHED | L2 ↓ | YELLOW_SOLID | L3 ↑ | WHITE_DASHED | L4 ↑
    // ============================================================
    objects.addFourLaneBidirectionalRoad({
        x: -13.95,
        z: -42,
        lengthM: 70.3,
        laneWidthM: 3.7,
        rotationY: Math.PI / 2,
        // Góc vuông 4 → 3 làn theo CAD: mép trong R3, mép ngoài R7, vạch vàng R7.
        negativeZCurveRadiusM: 3,
        negativeZCurveOuterRadiusM: 7,
        negativeZCurveCenterLineRadiusM: 7,
        negativeZCurveLegLengthM: 19.3,
        negativeZCurveSide: 'positive-x',
    });
    objects.addPedestrianCrossing(21, -51, 'vertical', 8, 3);
    
    // Pole luôn lệch local -X (TrafficLight.ts: poleX = -width/2 - 0.55).
    // Đường dọc NS trải X ∈ [17, 25]; đường ngang EW trải Z ∈ [-46, -38].
    // Pole phải nằm ngoài lane; panel chính hướng về chiều xe đến.
    objects.addTrafficLight(30.5, -33, 8, 0, {
        stopLineZ: 2,
        stopLineX: -7.7,
        stopLineLength: 4,
        triggerStart: 3,
        triggerLength: 2,
        markerId: 'SOUTH',
    });
    // Vạch hoàn thành bài 5: vùng xanh lá nhạt phía nam ngã tư.
    // Xe đi qua ngã tư South → chạm zone (frontPosition ∈ Box3)
    // → Exam05South.state = COMPLETED → ExamEngine.finished = true.
    // Tâm (23, -45): lane phải của đường dọc X∈[17,25], ngay sau crosswalk Z=-48.
    // Kích thước 4×6: rộng 4m theo X (đúng lane phải), dài 6m theo Z để bắt chắc
    // dù xe vào zone với góc lệch nhẹ. Box3 sensor trong ExamEngine.ts phải khớp
    // vị trí và kích thước này (xem wireExam05South).
    objects.addTriggerZone(23, -45, 4, 6);

 
    objects.addRoad(21, -78.05, 8, 68, 'vertical', 'straight', 'yellow-dashed');

//đường 5 lane cho bài tăng tốc
   
    // Đoạn 6 làn đặt liền về phía +Z, không chồng lên đoạn 5 làn.
    // 6A theo CAD: mép trái thẳng tại z = -112.05 (nối tiếp mép ngoài 8A), x từ 22.4 tới 70.6.
    // Làn 12A ngoài cùng bên trái đi ngược chiều, ngăn bằng vạch liền; phía đảo chuồng
    // thu hẹp dần 6 → 5 → 4 làn. Section đầu (local -Z) nằm ở phía world +X.
    // Các section xếp liên tiếp từ -lengthM/2, nên rút ngắn section đầu sẽ dịch cả đường.
    // Bù nửa lượng rút trên x (local -Z = world +X) để đoạn 5 làn và 6 làn đứng nguyên,
    // chỉ đầu +X của đoạn 4 làn ngắn lại.
    // 1.112 = 70.6 - 69.488: đầu +X dừng ngang mép ngoài lối vào chuồng D.
    const sixAFourLaneTrimM = 1.112;
    const sixAFourLaneRoad = objects.addFourLaneRoad({
        x: 46.5 - sixAFourLaneTrimM / 2,
        z: -100.95,
        lengthM: 48.2,
        laneWidthM: 3.7,
        rotationY: Math.PI / 2 + Math.PI,
        withArrows: false,
        outlineOnly: false,
        withLaneNumbers: true,
        sectionAlignment: 'left',
        dividerSide: 'left',
        sections: [
            { lengthM: 20 - sixAFourLaneTrimM, laneCount: 4 },
            { lengthM: 15, laneCount: 5 },
            { lengthM: 13.2, laneCount: 6 },
        ],
    });



    //đường chuyển từ dốc cầu qua bài vệt bánh xe vuông góc
    const road11AEndX = 109.1;
    const road11AEndZ = -53.7;
    const road11AWidthM = 7.4;
    const road11AEndLengthM = 19.6;
    objects.addRoad(road11AEndX, road11AEndZ, road11AWidthM, road11AEndLengthM, 'vertical', 'straight', 'white-dashed');

    // 11A nối trọn lane 3 và 4 của section 4 làn. Đoạn chéo trên CAD nghiêng
    // khoảng 60°: bo đầu R22.6/R30, chạy chéo, rồi bo R12.6/R20 vào đường dọc.
    // Hai mép cách nhau 7.4 m; đầu cuối vừa chạm mép -Z của đoạn 109.1/-53.7.
    const road11AFirstRadiusM = (22.6 + 30) / 2;
    const road11ASecondRadiusM = (12.6 + 20) / 2;
    const road11AFirstSweep = Math.PI / 3;
    const road11ASecondSweep = Math.PI / 2 - road11AFirstSweep;
    const fourLaneSection = sixAFourLaneRoad.footprints[0];
    sixAFourLaneRoad.root.updateWorldMatrix(true, false);
    const road11AStart = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        fourLaneSection.minX + road11AWidthM / 2,
        0,
        fourLaneSection.minZ,
    ));
    const road11AEndSouthZ = road11AEndZ - road11AEndLengthM / 2;
    const firstArcDx = road11AFirstRadiusM * Math.sin(road11AFirstSweep);
    const firstArcDz = road11AFirstRadiusM * (1 - Math.cos(road11AFirstSweep));
    const secondArcDx = road11ASecondRadiusM * (1 - Math.sin(road11AFirstSweep));
    const secondArcDz = road11ASecondRadiusM * Math.cos(road11AFirstSweep);
    // Giải hai khoảng thẳng từ đúng hai điểm nối: đoạn vào nằm ngang, đoạn
    // giữa tiếp tuyến với cả hai cung. Cung thứ hai kết thúc ngay tại road đích.
    const road11ADiagonalM = (road11AEndSouthZ - road11AStart.z - firstArcDz - secondArcDz)
        / Math.sin(road11AFirstSweep);
    const road11ALeadM = road11AEndX - road11AStart.x - firstArcDx - secondArcDx
        - road11ADiagonalM * Math.cos(road11AFirstSweep);
    const firstArcStartX = road11AStart.x + road11ALeadM;
    const firstArcEndX = firstArcStartX + firstArcDx;
    const firstArcEndZ = road11AStart.z + firstArcDz;
    const diagonalDx = road11ADiagonalM * Math.cos(road11AFirstSweep);
    const diagonalDz = road11ADiagonalM * Math.sin(road11AFirstSweep);
    const secondArcStartX = firstArcEndX + diagonalDx;
    const secondArcStartZ = firstArcEndZ + diagonalDz;
    objects.addRoad(
        road11AStart.x + road11ALeadM / 2,
        road11AStart.z,
        road11AWidthM,
        road11ALeadM,
        'horizontal',
        'none',
        'white-dashed',
    );
    objects.addRoadCurve(
        firstArcStartX,
        road11AStart.z + road11AFirstRadiusM,
        road11AWidthM,
        road11AFirstRadiusM,
        'white-dashed',
        2,
        -Math.PI / 2,
        road11AFirstSweep,
    );
    objects.addRoad(
        firstArcEndX + diagonalDx / 2,
        firstArcEndZ + diagonalDz / 2,
        road11AWidthM,
        road11ADiagonalM,
        'horizontal',
        'straight',
        'white-dashed',
        2,
        -road11AFirstSweep,
    );
    objects.addRoadCurve(
        secondArcStartX - road11ASecondRadiusM * Math.sin(road11AFirstSweep),
        secondArcStartZ + road11ASecondRadiusM * Math.cos(road11AFirstSweep),
        road11AWidthM,
        road11ASecondRadiusM,
        'white-dashed',
        2,
        -Math.PI / 2 - road11AFirstSweep,
        road11ASecondSweep,
    );

    // 3 làn × 3.70 m, cùng bề rộng làn với addFourLaneBidirectionalRoad().
    objects.addRoad(76, -43.8, 3 * 3.7, 60, 'horizontal', 'straight', 'yellow-dashed', 3);

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
    objects.addWindingCourse({ x: 33.5, z: -89.85, entryLength: 32.05, exitLength: 6, vehicleClass: 'B' });
   
    // Hạng C — THACO OLLIN450A (b = 2.240 m → width = 4.928 m)
    objects.addWindingCourse({ x: 43.5, z: -93.55, entryLength: 25.05, exitLength: 10, vehicleClass: 'C' });
    objects.addRoadStraight955({
        // Đặt mép gần của thanh chạm mép ngoài curb cong cuối chuồng E:
        // local X = depth E + physical offset + curb width + nửa bề rộng thanh.
        x: 80.4,
        z: -59,
        widthM: 5.90,
        lengthM:20
        ,
        curbWidthM: 0.10,
        rotationY: Math.PI /2 ,
        showDebug: false,
        highlight: false,
        showEdges: true,
    });
   
    // Hạng E — COUTY HD29 E3 (b = 2.080 m → width = 4.576 m)
    const windingCourseE = objects.addWindingCourse({
        x: 53.4,
        z: -82.4    ,
        entryLength: 0,
        exitLength: 0,
        vehicleClass: 'E',
        rotationY: Math.PI / 2 + THREE.MathUtils.degToRad(-2),
    });
  
    // Lối vào E theo CAD: lòng đường 5.50, ngoài curb 5.90, cùng hướng chữ S.
    // Cạnh trên chạy thẳng tới mép đoạn 4 làn của 6A (z = -97.25); cạnh dưới bè ra
    // để chạm mép đoạn 5 làn (z = -93.55) lùi `eLowerFlareM` so với cạnh thẳng
    // (đầu đảo R2 trên CAD), rồi kéo tiếp tới z = -97.25 trên mặt 5 làn để đầu
    // connector khép kín với 6A.
    const eEntryRotationY = windingCourseE.course.root.rotation.y;
    const eEntryDirection = new THREE.Vector3(
        Math.cos(eEntryRotationY),
        0,
        -Math.sin(eEntryRotationY),
    );
    const eEntryLateral = new THREE.Vector3(
        Math.sin(eEntryRotationY),
        0,
        Math.cos(eEntryRotationY),
    );
    const eEntryPoint = windingCourseE.course.root.position.clone();
    const eConnectorWidthM = 5.90;
    const sixAFourLaneEdgeZ = -97.25;
    const sixAFiveLaneEdgeZ = -93.55;
    const eLowerFlareM = 2;
    const eSidePointAtZ = (side: number, z: number) => {
        const start = eEntryPoint.clone().addScaledVector(eEntryLateral, side * eConnectorWidthM / 2);
        return start.addScaledVector(eEntryDirection, (start.z - z) / Math.sin(eEntryRotationY));
    };
    const eLowerStart = eSidePointAtZ(-1, eEntryPoint.z);
    const eLowerAtFiveLaneEdge = eSidePointAtZ(-1, sixAFiveLaneEdgeZ);
    eLowerAtFiveLaneEdge.x -= eLowerFlareM;
    const eLowerEnd = eLowerStart.clone().lerp(
        eLowerAtFiveLaneEdge,
        (eLowerStart.z - sixAFourLaneEdgeZ) / (eLowerStart.z - eLowerAtFiveLaneEdge.z),
    );
    const eLowerEndLocal = eLowerEnd.clone().sub(eEntryPoint);
    const eConnectorUpperLengthM = eSidePointAtZ(1, sixAFourLaneEdgeZ)
        .sub(eEntryPoint).dot(eEntryDirection);
    const eConnectorLowerLengthM = eLowerEndLocal.dot(eEntryDirection);
    const eConnectorEndLowerWidthM = -eLowerEndLocal.dot(eEntryLateral);
    const eConnectorLengthM = Math.max(eConnectorUpperLengthM, eConnectorLowerLengthM);
    const eConnectorCenter = eEntryPoint.clone()
        .addScaledVector(eEntryDirection, eConnectorLengthM / 2);
    objects.addRoadStraight955({
        x: eConnectorCenter.x,
        z: eConnectorCenter.z,
        widthM: eConnectorWidthM,
        lengthM: eConnectorLengthM,
        endLowerWidthM: eConnectorEndLowerWidthM,
        upperLengthM: eConnectorUpperLengthM,
        lowerLengthM: eConnectorLowerLengthM,
        curbWidthM: 0.20,
        curbPlacement: 'inside',
        rotationY: eEntryRotationY,
        showDebug: false,
        highlight: false,
        showEdges: true,
    });
    // Hạng D — COUTY HD29 E3 (b = 2.080 m → width = 4.576 m)
    const dRotationY = Math.PI / 2;
    const windingCourseD = objects.addWindingCourse({
        x: 65.5+1.5,
        z: -91,
        entryLength: 0,
        exitLength: 0,
        vehicleClass: 'D',
        rotationY: Math.PI / 2 + THREE.MathUtils.degToRad(8),
    });
    const dRoadRotationY = dRotationY - Math.PI / 2;
    const dEntryDirection = new THREE.Vector3(
        Math.cos(dRotationY),
        0,
        -Math.sin(dRotationY),
    );
    const dEntryPoint = windingCourseD.course.root.position.clone();
    // Tự chỉnh trực tiếp 4 thông số chiều dài của connector entry:
    const dEntryUpperLengthM = 7.25; // chiều dài cạnh trên — chạm mép 4 làn 6A (z = -97.25)
    const dEntryLowerLengthM = 7.25; // chiều dài cạnh dưới
    const dEntryStartUpperOffsetM = 1; // dịch riêng góc trên sát chữ S
    // Tự chỉnh trực tiếp 4 góc bề rộng:
    const dEntryStartUpperWidthM = 2.288; // góc trên, sát chữ S
    const dEntryStartLowerWidthM = 2.288; // góc dưới, sát chữ S
    const dEntryEndUpperWidthM = 2.488; // góc trên, phía ngoài
    const dEntryEndLowerWidthM = 2.9; // góc dưới, phía ngoài
    // Chiều dài bao ngoài tự lấy theo cạnh dài hơn để chứa cả hai cạnh.
    const dEntryLengthM = Math.max(dEntryUpperLengthM, dEntryLowerLengthM);
    const dEntryCenter = dEntryPoint.clone()
        .addScaledVector(dEntryDirection, dEntryLengthM / 2);
    objects.addRoadStraight955({
        x: dEntryCenter.x,
        z: dEntryCenter.z + 1,
        widthM: windingCourseD.course.envelopeWidth,
        lengthM: dEntryLengthM,
        startUpperWidthM: dEntryStartUpperWidthM,
        startLowerWidthM: dEntryStartLowerWidthM,
        endUpperWidthM: dEntryEndUpperWidthM,
        endLowerWidthM: dEntryEndLowerWidthM,
        upperLengthM: dEntryUpperLengthM,
        lowerLengthM: dEntryLowerLengthM,
        startUpperOffsetM: dEntryStartUpperOffsetM,
        curbWidthM: 0.10,
        rotationY: dRotationY,
        showDebug: false,
        highlight: false,
        showEdges: true,
    });

    // Tọa độ tâm connector exit — chỉnh trực tiếp nếu cần.
    const dExitCenterX = 87.202;
    const dExitCenterZ = -66.7;
    // Các số dưới đây có thể chỉnh trực tiếp:
    const dExitUpperLengthM = 34.89; // chiều dài cạnh trên
    const dExitLowerLengthM = 35.62; // chiều dài cạnh dưới
    const dExitStartUpperWidthM = 2.488; // góc trên bên trái
    const dExitStartLowerWidthM = 2.488; // góc dưới bên trái
    const dExitEndUpperWidthM = 2.488; // góc trên bên phải
    const dExitEndLowerWidthM = 2.488; // góc dưới bên phải
    const dExitLengthM = 30; // chiều dài tổng của connector
    objects.addRoadStraight955({
        x: dExitCenterX +1.5,
        z: dExitCenterZ,
        widthM: 4.98,
        lengthM: dExitLengthM,
        startUpperWidthM: dExitStartUpperWidthM,
        startLowerWidthM: dExitStartLowerWidthM,
        endUpperWidthM: dExitEndUpperWidthM,
        endLowerWidthM: dExitEndLowerWidthM,
        upperLengthM: dExitUpperLengthM,
        lowerLengthM: dExitLowerLengthM,
        curbWidthM: 0.10,
        curbPlacement: 'inside',
        taperDirection: 'right-to-left',
        rotationY: dRoadRotationY - Math.PI / 2,
        placementLabel: 'HẠNG D EXIT CONNECTOR',
        showDebug: false,
        highlight: false,
        showEdges: true,
    });

    // Tạo railway crossing road tại vị trí (x, z)
    objects.addRailwayCrossingRoad({
        x: 100,
        z: -115,
        roadWidthM: 4.0,
        rotationY: Math.PI, // có thể xoay theo hướng đường
    });

    // ============================================================
    // DECORATION: ngôi sao 5 cánh ở góc xa Đông-Nam của sân.
    // Vị trí (130, 80) nằm ngoài tất cả các corridor bài thi, không ảnh hưởng
    // đến sensor/penalty zone nào.
    // ============================================================
    // objects.root.add(new StarShape({
    //     x: 34,
    //     z: -32,
    //     size: 4,
    //     color: '#fe2020',
    //     rotationY: 120,
    // }).root);

    // ============================================================
    // PARALLEL PARKING BAY (HẠNG B) — test object theo spec §11-12.
    // 6.615 m (dọc Z) × 2.125 m (sâu theo -X), open side quay về world +Z.
    // Vị trí (130, 80) cách xa tất cả corridor bài thi để không ảnh hưởng scoring.
    // ============================================================
    objects.addParallelParkingBayB({
        x: -10,
        z: -35,
        rotationY: -Math.PI / 2,
        cornerRadiusM: 0.3,
        vehicleClass: 'B',
    });

    objects.addParallelParkingBayB({
        x: -24.5,
        z: -35,
        rotationY: -Math.PI / 2,
        cornerRadiusM: 0.3,
        vehicleClass: 'B',
    });

    objects.addParallelParkingBayB({
        x: -39.5,
        z: -35,
        rotationY: -Math.PI / 2,
        cornerRadiusM: 0.3,
        vehicleClass: 'B',
    });

    // CHUỒNG GHÉP XE VUÔNG GÓC HẠNG C — object thử nghiệm theo CAD.
    // Local +X chạy dọc đường tiếp cận, local +Z đi vào chuồng; cửa chuồng tại (120, 80).
    objects.addPerpendicularParkingBayC({
        x: 0,
        z:-66.78,
        rotationY:-Math.PI / 2,
        capEnd: false,
        showDebug: false,
    });
    objects.addRoadStraight955({
        x: 4.56,
        z: -52.5,
        widthM: PERPENDICULAR_PARKING_C.mainRoad.clearWidthM,
        lengthM: 7.428,
        rotationY:-Math.PI / 2,        
        showDebug: false,
    });
    // Bản test thứ hai dùng chung object chuồng ghép xe vuông góc hạng C.
    objects.addPerpendicularParkingBayC({
        x: -21,
        z: -77.6,
        rotationY:-Math.PI / 2,       
        capEnd: false,
         showDebug: false,
    });

    // ROAD_STRAIGHT_9_55 — primitive tái sử dụng, cấu hình widthM/lengthM tại call site.
    objects.addRoadStraight955({
        x: -16.5,
        z: -58.1,
        widthM: PERPENDICULAR_PARKING_C.mainRoad.clearWidthM,
        lengthM: 17.948,
        rotationY:-Math.PI / 2,        
        showDebug: false,
    });

    objects.addPerpendicularParkingBayB({
        x: -28,
        z: -67.3,
        capEnd: false,
        rotationY:-Math.PI / 2,         showDebug: false,
    });
    objects.addRoadStraight955({
        x: -25.35,
        z: -55,       
        widthM: PERPENDICULAR_PARKING_BAY_B.mainRoad.clearWidthM,
        lengthM: 12.5,
        rotationY:-Math.PI / 2,        
        showDebug: false,
    });

    objects.addPerpendicularParkingBayB({
        x: -41.1,
        z: -67.3,
        capEnd: false,
        rotationY:-Math.PI / 2,         showDebug: false,
    });
    objects.addRoadStraight955({
        x: -38.45,
        z: -55,       
        widthM: PERPENDICULAR_PARKING_BAY_B.mainRoad.clearWidthM,
        lengthM: 12.5,
        rotationY:-Math.PI / 2,        
        showDebug: false,
    });
    // CHUỒNG GHÉP XE VUÔNG GÓC HẠNG B — test độc lập theo CAD.
    objects.addPerpendicularParkingBayB({
        x: 9.4,
        z: -85.8,
        capEnd: false,
        rotationY: Math.PI / 2,         showDebug: false,
    });
    objects.addRoadStraight955({
        x: 6.75,
        z: -96.6,       
        widthM: PERPENDICULAR_PARKING_BAY_B.mainRoad.clearWidthM,
        lengthM: 8.8,        rotationY: Math.PI / 2,        
        showDebug: false,
    });
    objects.addPerpendicularParkingBayB({
        x: -3.8,
        z: -85.8,
        capEnd: false,
        rotationY: Math.PI / 2,         showDebug: false,
    });
    objects.addRoadStraight955({
      x: -6.45,
      z: -96.6,      
        widthM: PERPENDICULAR_PARKING_BAY_B.mainRoad.clearWidthM,
        lengthM: 8.8, 
        rotationY: Math.PI / 2,        
        showDebug: false,
    });
    objects.addParallelParkingBayB({
        x: -52.1,
        z: -59,  
        rotationY: 0,        cornerRadiusM: 0.3,
        vehicleClass: 'D',
    });
    // Nối tiếp nhánh 3 làn của đường 4 làn (mép trong x = -52.1, đầu nhánh z = -68.7).
    // Mép trong đoạn chéo 9A trùng cạnh mở chuồng E (cùng góc -1.100987).
    // Cua 9A → 8A kết thúc tại thanh 8A (x = 0); đoạn 8A chạy theo +X, mép trong z = -100.95,
    // qua cả hai lối vào chuồng B.
    objects.addRoadCornerCurveR8R9({
        x: -52.1,
        z: -68.7,
        segmentLengthsM: [7.693, 54.244, 21],
        bends: [
            // Mép ngoài CAD không ghi bán kính, lấy bằng vạch vàng.
            { sweepDeg: THREE.MathUtils.radToDeg(1.100987), innerEdgeRadiusM: 6, dashedLineRadiusM: 8, centerLineRadiusM: 9, outerEdgeRadiusM: 9 },
            { sweepDeg: 90 - THREE.MathUtils.radToDeg(1.100987), innerEdgeRadiusM: 3, dashedLineRadiusM: 20, centerLineRadiusM: 23, outerEdgeRadiusM: 26.7 },
        ],
    });
    // Hạng E theo CAD: 1.83 m tới control trái B, 2.46 m tới chuồng C,
    // 2.99 m tới control trái C; mặt mở quay về phía RIGHT.
    // Dời 1.85 m về phía đường (từ -35, -83) để cua 9A → 8A kết thúc đúng thanh 8A.
    objects.addParallelParkingBayB({
        x: -35.838,
        z: -84.65,
        rotationY: -1.100987,
        cornerRadiusM: 0.3,
        vehicleClass: 'E',
        side: 'RIGHT',
    });
   

 
   
}
