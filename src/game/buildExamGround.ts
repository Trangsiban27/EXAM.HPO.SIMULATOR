import * as THREE from 'three';
import { ExerciseSign } from './ExerciseSign';
import type { TrackObjects } from './TrackObjects';
import { startPosition } from './startPosition';

/** Positions and dimensions of the examination ground. */
export function buildExamGround(objects: TrackObjects) {
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(300,300),
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
    const EX02_STOP_LINE_X = -8;
    const EX02_STOP_BAR_X = -8.75;   // 8 m trước crosswalk, học viên dễ canh điểm dừng

    // Crosswalk có sẵn (line 35) — addPedestrianZone sẽ attach lại vào zone.
    objects.addPedestrianCrossing(EX02_CROSSWALK_X, -2, 'horizontal', 8, 3);
    // Stop-bar cảnh báo thị giác: dừng trước vạch này = không trừ điểm (không có sensor gameplay).
    objects.addStopBarWarning(EX02_STOP_BAR_X, startPosition.lineZ, 8);
    const zone2A = objects.addPedestrianZone({
        stopLineX: EX02_STOP_LINE_X,
        crosswalkX: EX02_CROSSWALK_X,
        roadZ: startPosition.lineZ,
        roadWidth: 8,
        direction: 'horizontal',
    });

    // The existing road ends at X=18; the bridge connects there and ends at X=44.
    objects.addBridge(31, -2, 'horizontal');
    objects.addRoad(49, -2, 8, 10, 'horizontal', 'straight', 'white-solid');
    objects.addRightAngleTurn(58, -2, 8, 'horizontal', 'left', 'white-solid');
    objects.addRoad(58, -9, 8, 6, 'vertical', 'straight', 'white-dashed');
    objects.addRoad(58, -15, 8, 10, 'vertical', 'straight', 'white-dashed');
    // Nested courses: each successive entry extends one lane pitch farther
    // before turning, keeping the elbows alongside rather than across each other.
    const courseWidth = 2.2 * 1.8;
    const courseLength = 4.4;
    const coursePitch = courseWidth + .44;
    objects.root.add(new ExerciseSign({
        title: 'QUA VỆT BÁNH XE\nVÀ ĐƯỜNG VÒNG VUÔNG GÓC',
        subtitle: 'Đưa bánh phải vào giữa hai vạch trắng',
        x: 52, z: -12.92, rotation: Math.PI / 2
    }).root);
    objects.addRoad(58, -27, 8, 14, 'vertical', 'straight', 'white-dashed');
    objects.addRoad(21, -10, 8, 6, 'vertical', 'straight', 'yellow-dashed');
    for (let i = 0; i < 4; i++) {
        const entryZ = -18 - i * coursePitch;
        const entryLength = 10.8 + i * coursePitch;
        objects.addWheelTrackCourse({ x: 54, z: entryZ, direction: 'horizontal', entryLength });
        objects.addRoad(56, entryZ, courseWidth, 4, 'horizontal', 'none', 'white-solid', 1);
        const exitX = 54 - entryLength + courseWidth / 2 - 1.5 * courseLength;
        const exitZ = entryZ + 2 * courseLength;
        objects.addRoad((21 + exitX) / 2, exitZ, courseWidth, exitX - 21,
            'horizontal', 'none', 'white-solid', 1);
    }
    objects.addRoad(21, -26, 8, 26, 'vertical', 'straight', 'yellow-dashed');
    objects.addPedestrianCrossing(21, -36, 'vertical', 8, 3);
    objects.addRoad(21, -42, 8, 26, 'horizontal', 'straight', 'white-dashed');
    objects.addPedestrianCrossing(27, -42, 'horizontal', 8, 3);
    objects.addPedestrianCrossing(15, -42, 'horizontal', 8, 3);
    objects.addRoad(21, -42, 8, 26, 'horizontal', 'straight', 'yellow-dashed');
    objects.addRoad(21, -50, 8, 10, 'vertical', 'straight', 'yellow-dashed');
    objects.addPedestrianCrossing(21, -48, 'vertical', 8, 3);
    
    // Local -Z points into the junction; local -X is the incoming lane
    // indicated by the two-way road arrows. Stop lines precede each crossing.
    for (const [x, z, rotation] of [
        [21, -33, 0],             // South: incoming lane X=19, heading north.
        [21, -51, Math.PI],       // North: incoming lane X=23, heading south.
        [12, -42, -Math.PI / 2],  // West: incoming lane Z=-44, heading east.
        [30, -42, Math.PI / 2]    // East: incoming lane Z=-40, heading west.
    ] as const) {
        objects.addTrafficLight(x, z, 8, rotation);
    }

    objects.addRoad(21, -60, 8, 30, 'vertical', 'straight', 'yellow-dashed');
    objects.addRoad(21, -70, 8, 20, 'vertical', 'straight', 'yellow-dashed');

    // The straight ends at Z=-80; the corner enters there and exits toward +X.
    objects.addRightAngleTurn(21, -84, 8, 'vertical', 'right', 'yellow-dashed');
    objects.addRoad(35, -84, 8, 20, 'horizontal', 'straight', 'yellow-dashed');
    // Branch from the right (+Z) side of the eastbound main road.
    objects.addWindingCourse({ x: 41, z: -84, entryLength: 30 });

    objects.addRoad(55, -84, 8, 20, 'horizontal', 'straight', 'yellow-dashed');

    objects.addWindingCourse({ x: 51, z: -84, entryLength: 15 });

}
