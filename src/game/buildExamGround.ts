import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';
import { ExerciseSign } from './signs/ExerciseSign';
import type { TrackObjects } from './TrackObjects';
import { StarShape } from './StarShape';
import { StarFlowerBed } from './StarFlowerBed';
import { createGrassSurfaceTexture } from './grassSurface';
import { startPosition } from './startPosition';
import { StackedPedestrianStopSign } from './signs/StackedPedestrianStopSign';
import { StackedRailwayStopSign } from './signs/StackedRailwayStopSign';
import { StopSign } from './signs/StopSign';
import { UphillWarningSign } from './signs/UphillWarningSign';
import { DownhillWarningSign } from './signs/DownhillWarningSign';
import { WindingCourseClassSign } from './signs/WindingCourseClassSign';
import { Exam05JunctionSigns } from './signs/Exam05JunctionSigns';
import { Exam05TurnJunctionSigns } from './signs/Exam05TurnJunctionSigns';
import { ParkingBayBSign } from './signs/ParkingBayBSign';
import { AccelerationInstructionSign } from './signs/AccelerationInstructionSign';
import { SpeedLimit20EndAccelerationSign } from './signs/SpeedLimit20EndAccelerationSign';
import { MinimumSpeed20StartDecelerationSign } from './signs/MinimumSpeed20StartDecelerationSign';
import { createStripedSignPost } from './signs/StripedSignPost';
import type { PerpendicularParkingBayB } from './PerpendicularParkingBayB';
import type { PerpendicularParkingBayC } from './PerpendicularParkingBayC';
import type { RoadStraight955 } from './RoadStraight955';
import { PARKING_BAY_SIZES, type ParallelParkingBayB } from './ParallelParkingBayB';
import { createRoadArrowTexture } from './straightRoadArrow';
import { offsetPath, roundCorners, splitByPattern, type Point } from './roundedPath';
import {
    EXAM_02_ROAD_CENTER_X,
    EXAM_02_ROAD_LENGTH_M,
    EXAM_02_APPROACH_LENGTH_M,
    EXAM_02_STOP_LINE_X,
    EXAM_03_BRIDGE_CENTER_X,
    EXAM_03_STOP_LINE_X,
    EXAM_05_FINISH_CROSSWALK_X,
    EXAM_05_FINISH_CROSSWALK_Z,
    EXAM_05_FINISH_CROSSWALK_WIDTH_M,
    EXAM_05_FINISH_CROSSWALK_DEPTH_M,
} from './exam/examCourseGeometry';

/** Positions and dimensions of the examination ground. */
export function buildExamGround(objects: TrackObjects) {
    const showRoadLaneNumbers = false;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500),
        new THREE.MeshStandardMaterial({ color: 0x63735a, roughness: 1 }));

    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;

    objects.root.add(ground);

    const startRoad = objects.addRoad(7.2, 18.2, 2 * 3.7, 20, 'horizontal', 'straight', 'white-dashed', 2);
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
    // Mép -X của đường kết thúc ngang mép ngoài nhánh road-corner-positive-x.
    const westJunctionRoadX = -13.95;
    const westJunctionRoadLengthM = 70.3;
    const westJunctionLaneWidthM = 3.7;
    const westJunctionInnerRadiusM = 3;
    // Vạch kết thúc cách mép tây đoạn đường 3 làn 15 m.
    const finishLineX = 19.4 - 3 * 3.7 / 2 - 15;
    // Nhánh 3 làn nằm ở local -Z; xoay +90° thì local Z trở thành world X.
    const finishRoadWestEdgeX = westJunctionRoadX - westJunctionRoadLengthM / 2
        - westJunctionInnerRadiusM - 3 * westJunctionLaneWidthM;
    const finishRoadEastEdgeX = -15.3 + 79.95 / 2;
    const finishRoad = objects.addRoad(
        (finishRoadWestEdgeX + finishRoadEastEdgeX) / 2,
        -20.9, 2 * 3.7, finishRoadEastEdgeX - finishRoadWestEdgeX,
        'horizontal', 'none', 'white-dashed', 2,
    );
    const finishRoadLaneWidthM = 3.7;
    // Số làn đặt trên đoạn 2 làn phía tiếp cận vạch kết thúc, trước chỗ nối 1/3 làn.
    const finishRoadLaneNumberWorldX = finishLineX + 10;
    const finishRoadLaneNumberLocalZ = finishRoad.position.x - finishRoadLaneNumberWorldX;
    for (const [lane, localX] of [
        [1, -finishRoadLaneWidthM / 2],
        [2, finishRoadLaneWidthM / 2],
    ] as const) {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const context = canvas.getContext('2d');
        if (!context) continue;
        context.fillStyle = '#ffffff';
        context.font = 'bold 88px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String(lane), 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(1.1, 1.1),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
        );
        label.name = `lane-number-${lane}`;
        label.visible = showRoadLaneNumbers;
        label.rotation.x = -Math.PI / 2;
        label.position.set(localX, .09, finishRoadLaneNumberLocalZ);
        finishRoad.add(label);
    }

    const finishRoadConnectorX = 1.55;
    const finishRoadConnectorZ = -1.41;
    const finishRoadConnectorWidthM = 35.4;
    const finishRoadConnectorLengthM = 27.43;
    const finishRoadConnector = objects.addRoadStraight955({
        // Đặt mép gần của thanh chạm mép ngoài curb cong cuối chuồng E:
        // local X = depth E + physical offset + curb width + nửa bề rộng thanh.
        x: finishRoadConnectorX,
        z: finishRoadConnectorZ,
        widthM: finishRoadConnectorWidthM,
        lengthM: finishRoadConnectorLengthM,
        rotationY: Math.PI / 2,
        showDebug: false,
        highlight: false,
        showEdges: false,
        // Sau khi xoay 90°, cạnh bottom của shape là mép +X thế giới.
        // Nhìn theo hướng +X: bên trái là -Z, bên phải là +Z.
        edge: { bottomRightRadiusM: 5, bottomLeftRadiusM: 2 },
    });
    // Hai dải cỏ chữ nhật mặc định kéo dài quá đầu bo mới; nền sân đã là màu cỏ.
    for (const grass of [...finishRoadConnector.surroundingsGroup.children]) {
        finishRoadConnector.surroundingsGroup.remove(grass);
        if (grass instanceof THREE.Mesh) grass.geometry.dispose();
    }
    // Mặt sân giữa đường kết thúc và đường xuất phát mở rộng tới mép xanh
    // của bản vẽ: nhánh phải chạy xuống rồi nối chéo về đầu -X finishRoad.
    const connectorRightX = finishRoadConnectorX + finishRoadConnectorWidthM / 2;
    const connectorNearZ = finishRoadConnectorZ - finishRoadConnectorLengthM / 2;
    const connectorFarZ = finishRoadConnectorZ + finishRoadConnectorLengthM / 2;
    const finishRoadInnerEdgeZ = finishRoad.position.z + 3.7;
    const finishRoadOuterEdgeZ = finishRoad.position.z - 3.7;
    const startRoadRightEdgeZ = startRoad.position.z + 3.7;
    const startRoadLeftEdgeZ = startRoad.position.z - 3.7;
    const startRoadWestEdgeX = startRoad.position.x - 20 / 2;
    const startRoadEastEdgeX = startRoad.position.x + 20 / 2;
    // Giữ đảo rộng 2 m cạnh đường xuất phát. Chừa 0,1 m ở mỗi mép;
    // đầu đảo cách vạch xuất phát 11,17 m và bo gần R1.
    const islandLeftZ = connectorFarZ + CURB_VISUAL_WIDTH_M;
    // Mép phải đảo trùng mép startRoad để bó vỉa đầu bo nối thẳng vào lề
    // trong của startRoad (z 14,5–14,6), không phải dịch ngang 0,1 m gây gãy.
    const islandRightZ = startRoadLeftEdgeZ;
    const islandRadiusM = (islandRightZ - islandLeftZ) / 2;
    const islandTipX = startRoadEastEdgeX - 11.17;
    const islandCenterX = islandTipX + islandRadiusM;
    const islandCenterZ = (islandLeftZ + islandRightZ) / 2;
    const startRoadInnerCurbJoinLengthM = .8;
    const startRoadInnerCurbJoinX = islandCenterX + startRoadInnerCurbJoinLengthM;
    // Vạch đứt và lề ngoài kết thúc ở mũi đảo; lề trong nối sang đường bo.
    // startRoad xoay -90°, nên local +Z tương ứng với world -X.
    const markingEndLocalZ = startRoad.position.x - islandTipX;
    const innerCurbEndLocalZ = startRoad.position.x - startRoadInnerCurbJoinX;
    const startRoadArrowX = startPosition.lineX - 6.5; // Gần xe hơn 3,5 m theo hướng +X.
    const arrowLocalZ = startRoad.position.x - startRoadArrowX;
    for (const child of [...startRoad.children]) {
        if (!(child instanceof THREE.Mesh)) continue;
        if (child.geometry instanceof THREE.PlaneGeometry) {
            child.position.z = arrowLocalZ;
            continue;
        }
        if ((child.name !== 'red-white-curb' && child.name !== 'road-center-line')
            || !(child.geometry instanceof THREE.BoxGeometry)) continue;
        const { width, height, depth: lengthM } = child.geometry.parameters;
        const fromZ = child.position.z - lengthM / 2;
        const endLocalZ = child.name === 'red-white-curb' && child.position.x < 0
            ? innerCurbEndLocalZ : markingEndLocalZ;
        const keptLengthM = Math.min(lengthM, endLocalZ - fromZ);
        if (keptLengthM <= 0) {
            startRoad.remove(child);
            child.geometry.dispose();
            if (child.name === 'red-white-curb') {
                if (Array.isArray(child.material)) child.material.forEach(material => material.dispose());
                else child.material.dispose();
            }
        } else if (keptLengthM < lengthM) {
            child.geometry.dispose();
            child.geometry = new THREE.BoxGeometry(width, height, keptLengthM);
            child.position.z = fromZ + keptLengthM / 2;
        }
    }
    const islandCap: Point[] = Array.from({ length: 17 }, (_, index) => {
        const angle = -Math.PI / 2 + Math.PI * index / 16;
        return [
            islandCenterX - islandRadiusM * Math.cos(angle),
            islandCenterZ + islandRadiusM * Math.sin(angle),
        ];
    });
    // Đầu đảo 2 m cạnh finishRoad: hai cung 1/4 R1 và đoạn nối 0,075 m
    // ở mũi đảo (bề rộng thực tế giữa hai mép đường là 2,075 m).
    const leftIslandRadiusM = 1;
    // Mũi bo nằm ngang chữ KẾT (vạch xanh trong ảnh), phần nhựa phía sau vẫn rộng.
    const leftIslandCenterX = finishLineX - 2 + leftIslandRadiusM;
    const leftIslandCap: Point[] = [
        ...Array.from({ length: 9 }, (_, index): Point => {
            const angle = -Math.PI / 2 + Math.PI * index / 16;
            return [
                leftIslandCenterX - leftIslandRadiusM * Math.cos(angle),
                finishRoadInnerEdgeZ + leftIslandRadiusM + leftIslandRadiusM * Math.sin(angle),
            ];
        }),
        ...Array.from({ length: 9 }, (_, index): Point => {
            const angle = Math.PI * index / 16;
            return [
                leftIslandCenterX - leftIslandRadiusM * Math.cos(angle),
                connectorNearZ - leftIslandRadiusM + leftIslandRadiusM * Math.sin(angle),
            ];
        }),
    ];
    // Lề phía đảo của finishRoad chỉ bắt đầu tại tiếp tuyến đầu bo R1.
    const finishRoadInnerCurbEndLocalZ = finishRoad.position.x - leftIslandCenterX;
    for (const child of [...finishRoad.children]) {
        if (!(child instanceof THREE.Mesh) || child.name !== 'red-white-curb'
            || child.position.x <= 0 || !(child.geometry instanceof THREE.BoxGeometry)) continue;
        const { width, height, depth: lengthM } = child.geometry.parameters;
        const fromZ = child.position.z - lengthM / 2;
        const keptLengthM = Math.min(lengthM, finishRoadInnerCurbEndLocalZ - fromZ);
        if (keptLengthM <= 0) {
            finishRoad.remove(child);
            child.geometry.dispose();
            if (Array.isArray(child.material)) child.material.forEach(material => material.dispose());
            else child.material.dispose();
        } else if (keptLengthM < lengthM) {
            child.geometry.dispose();
            child.geometry = new THREE.BoxGeometry(width, height, keptLengthM);
            child.position.z = fromZ + keptLengthM / 2;
        }
    }
    // Đầu bo đã tiếp tuyến đúng lề startRoad: nối thẳng 0,8 m tới đầu lề trong.
    const islandToStartRoad: Point[] = [
        [islandCenterX, islandRightZ],
        [islandCenterX + startRoadInnerCurbJoinLengthM, islandRightZ],
    ];
    const apronKnee: Point = [finishRoadWestEdgeX + 20, startRoadRightEdgeZ];
    // Mép chéo mới bắt đầu từ góc ngoài của finishRoad, uốn theo nét xanh
    // rồi tiếp tuyến với phần cuối của cạnh chéo cũ.
    const oldDiagonalStart: Point = [finishRoadWestEdgeX, finishRoadInnerEdgeZ];
    const curvedEdgeStart: Point = [finishRoadWestEdgeX, finishRoadOuterEdgeZ];
    const diagonalJoinT = .7;
    const diagonalJoin: Point = [
        THREE.MathUtils.lerp(oldDiagonalStart[0], apronKnee[0], diagonalJoinT),
        THREE.MathUtils.lerp(oldDiagonalStart[1], apronKnee[1], diagonalJoinT),
    ];
    const curvedOuterEdge: Point[] = new THREE.CubicBezierCurve3(
        new THREE.Vector3(curvedEdgeStart[0], 0, curvedEdgeStart[1]),
        new THREE.Vector3(curvedEdgeStart[0] + 3.7, 0, curvedEdgeStart[1] + 11),
        new THREE.Vector3(
            diagonalJoin[0] - (apronKnee[0] - oldDiagonalStart[0]) * .1,
            0,
            diagonalJoin[1] - (apronKnee[1] - oldDiagonalStart[1]) * .1,
        ),
        new THREE.Vector3(diagonalJoin[0], 0, diagonalJoin[1]),
    ).getPoints(24).map(point => [point.x, point.z]);
    const apronOutline: Point[] = [
        leftIslandCap[leftIslandCap.length - 1],
        [connectorRightX, connectorNearZ], // R5 cũ
        [connectorRightX, connectorFarZ],  // R2 cũ
        ...islandCap,
        ...islandToStartRoad.slice(1),
        [startRoadEastEdgeX, startRoadLeftEdgeZ],
        [startRoadEastEdgeX, startRoadRightEdgeZ],
        [startRoadWestEdgeX, startRoadRightEdgeZ],
        apronKnee,
        diagonalJoin,
        ...curvedOuterEdge.slice(0, -1).reverse(),
        [leftIslandCenterX, finishRoadOuterEdgeZ],
        ...leftIslandCap,
    ];
    const apronRadii = Array<number>(apronOutline.length - 2).fill(0);
    apronRadii[0] = 5;
    apronRadii[1] = 2;
    const roundedApron = roundCorners(apronOutline, apronRadii);
    // Bó vỉa đỏ/trắng theo mép trong của dải đảo: từ đầu bo cạnh finishRoad,
    // qua hai góc của sân, tới đầu bo cạnh startRoad.
    const islandCurbEnd = islandToStartRoad[islandToStartRoad.length - 1];
    const islandCurbEndIndex = roundedApron.findIndex(([x, z]) =>
        Math.hypot(x - islandCurbEnd[0], z - islandCurbEnd[1]) < 1e-6);
    if (islandCurbEndIndex < 0) throw new Error('Finish/start island curb end is missing');
    const islandCurbPath: Point[] = [
        ...leftIslandCap.slice(0, -1),
        ...roundedApron.slice(0, islandCurbEndIndex + 1),
    ];
    const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
        new THREE.MeshStandardMaterial({ color, roughness: .85 }));
    const addApronCurb = (path: Point[], name: string) => {
        const curbs = new THREE.Group();
        curbs.name = name;
        splitByPattern(path, [.8]).forEach((piece, index) => {
            if (piece.every(([x, z]) => Math.hypot(x - piece[0][0], z - piece[0][1]) < 1e-6)) return;
            const outline = piece.concat(offsetPath(piece, CURB_VISUAL_WIDTH_M).reverse());
            const shape = new THREE.Shape(outline.map(([x, z]) => new THREE.Vector2(x, -z)));
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: CURB_VISUAL_HEIGHT_M,
                bevelEnabled: false,
            });
            geometry.rotateX(-Math.PI / 2);
            const curb = new THREE.Mesh(geometry, curbMaterials[index % 2]);
            curb.name = 'red-white-curb';
            curb.position.y = .06;
            curb.castShadow = true;
            curb.receiveShadow = true;
            curbs.add(curb);
        });
        objects.root.add(curbs);
    };
    addApronCurb(islandCurbPath, 'finish-start-inner-island-curb');
    // Mép ngoài theo đường cong rồi nhập lại cạnh chéo, nối lề finishRoad và startRoad.
    addApronCurb([
        [islandTipX, startRoadRightEdgeZ],
        apronKnee,
        diagonalJoin,
        ...curvedOuterEdge.slice(0, -1).reverse(),
    ], 'finish-start-outer-apron-curb');
    // Che dải mặt đường cũ giữa đường chéo và đường cong mới bằng màu nền sân.
    const grassCutoutOutline: Point[] = [
        oldDiagonalStart,
        diagonalJoin,
        ...curvedOuterEdge.slice(0, -1).reverse(),
    ];
    const grassCutoutShape = new THREE.Shape(grassCutoutOutline.map(([x, z]) =>
        new THREE.Vector2(x, -z)));
    const grassCutoutGeometry = new THREE.ShapeGeometry(grassCutoutShape);
    grassCutoutGeometry.rotateX(-Math.PI / 2);
    const grassCutout = new THREE.Mesh(grassCutoutGeometry,
        new THREE.MeshStandardMaterial({
            map: createGrassSurfaceTexture(),
            roughness: 1,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1,
        }));
    grassCutout.name = 'finish-start-outer-apron-grass-cutout';
    grassCutout.position.y = .064;
    grassCutout.receiveShadow = true;
    objects.root.add(grassCutout);
    finishRoadConnector.root.updateMatrixWorld(true);
    const toApronLocal = (x: number, z: number) => {
        const local = finishRoadConnector.root.worldToLocal(new THREE.Vector3(x, 0, z));
        return new THREE.Vector2(local.x, -local.z);
    };
    const apronShape = new THREE.Shape(roundedApron.map(([x, z]) => toApronLocal(x, z)));
    // Không phủ asphalt sân lên mặt đường xuất phát: polygonOffset của sân
    // làm vạch đứt giữa làn trước vạch xuất phát lúc ẩn lúc hiện.
    const startRoadHolePoints = [
        [startRoadWestEdgeX, startRoadLeftEdgeZ],
        [startRoadEastEdgeX, startRoadLeftEdgeZ],
        [startRoadEastEdgeX, startRoadRightEdgeZ],
        [startRoadWestEdgeX, startRoadRightEdgeZ],
    ].map(([x, z]) => toApronLocal(x, z));
    if (Math.sign(THREE.ShapeUtils.area(apronShape.getPoints()))
        === Math.sign(THREE.ShapeUtils.area(startRoadHolePoints))) {
        startRoadHolePoints.reverse();
    }
    apronShape.holes.push(new THREE.Path(startRoadHolePoints));
    const apronSurface = finishRoadConnector.surfaceGroup.getObjectByName('AsphaltRoad');
    if (!(apronSurface instanceof THREE.Mesh)) throw new Error('Finish road connector surface is missing');
    // Mặt sân chồng lên finishRoad: chỉ dựng mặt trên để cạnh khối không
    // tạo một nét tối cắt ngang mặt đường tại đầu đảo cạnh vạch kết thúc.
    const apronGeometry = new THREE.ShapeGeometry(apronShape);
    apronGeometry.rotateX(-Math.PI / 2);
    apronSurface.geometry.dispose();
    apronSurface.geometry = apronGeometry;
    apronSurface.position.y = .061;
    if (apronSurface.material instanceof THREE.MeshStandardMaterial) {
        apronSurface.material.polygonOffset = true;
        apronSurface.material.polygonOffsetFactor = -1;
        apronSurface.material.polygonOffsetUnits = -1;
    }

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
    // Cột W.224 phía trên R.122, trước vạch dừng và nằm ngoài mép phải đường.
    objects.root.add(new StackedPedestrianStopSign(
        separatorX - 2,
        crossingRoadZ + crossingRoadWidthM / 2 + 0.7,
    ).root);
    // Vạch ở cuối đường đầu (x = 7.2 + 20/2 = 17.2); chữ ở đầu đường kế tiếp.
    objects.addStartZone(startPosition.lineX, crossingRoadZ, 'horizontal', crossingRoadWidthM, {
        textX: crossingRoadStartX + 1,
        textZ: crossingRoadZ,
    });
    for (const laneZ of [crossingRoadZ - crossingRoadWidthM / 4, crossingRoadZ + crossingRoadWidthM / 4]) {
        objects.addStraightRoadArrow(separatorX - 6.2, laneZ, 3.7, approachLengthM, Math.PI / 2, true);
    }
    objects.addLine(separatorX, crossingRoadZ, .18, crossingRoadWidthM - .4, 0xffffff);
    objects.addPedestrianCrossing(
        separatorX + crossingLengthM / 2, crossingRoadZ,
        'horizontal', crossingRoadWidthM, 5,
    );
    // Đoạn 11 m sau vạch qua đường: mũi tên hướng lên cầu.
    const bridgeApproachX = 44.31;
    const bridgeApproachLengthM = 11;
    const bridgeApproachArrowX = bridgeApproachX + bridgeApproachLengthM / 2 - 1.55;
    objects.addRoad(
        bridgeApproachX, crossingRoadZ, crossingRoadWidthM, bridgeApproachLengthM,
        'vertical', 'none', 'white-dashed', 2, Math.PI / 2,
    );
    for (const laneZ of [crossingRoadZ - crossingRoadWidthM / 4, crossingRoadZ + crossingRoadWidthM / 4]) {
        objects.addStraightRoadArrow(
            bridgeApproachArrowX, laneZ, 3.7, bridgeApproachLengthM, Math.PI / 2, true,
        );
    }

    const bridgeRoadZ = 18.2;
    const bridgeRoadWidthM = 7.4;
    const bridgeSignShoulderOffsetM = 0.5;
    const bridgeSignZ = bridgeRoadZ + bridgeRoadWidthM / 2 + bridgeSignShoulderOffsetM;
    const exam03Bridge = objects.addBridge(EXAM_03_BRIDGE_CENTER_X, bridgeRoadZ, 'horizontal', bridgeRoadWidthM);
    // W.220 báo dốc 10% ở lề phải, đúng ranh giới road và chân cầu.
    objects.root.add(new UphillWarningSign(
        EXAM_03_BRIDGE_CENTER_X - exam03Bridge.length / 2,
        bridgeSignZ,
    ).root);
    // W.219 ở cuối đỉnh cầu, nơi mặt đường bắt đầu dốc xuống.
    const downhillStartX = EXAM_03_BRIDGE_CENTER_X + exam03Bridge.crestHalfLength;
    objects.root.add(new DownhillWarningSign(
        downhillStartX,
        bridgeSignZ,
        exam03Bridge.surfaceHeight(downhillStartX, bridgeRoadZ) ?? 0,
    ).root);
    // Biển STOP ở lề phải, ngay trước vạch dừng trên dốc lên.
    const uphillStopSign = new StopSign({
        x: EXAM_03_STOP_LINE_X - 1,
        z: bridgeRoadZ,
        roadWidth: bridgeRoadWidthM,
        shoulderOffsetM: bridgeSignShoulderOffsetM,
        heightOffsetM: 0.8,
    });
    uphillStopSign.root.name = 'EX03_UPHILL_STOP_SIGN';
    objects.root.add(uphillStopSign.root);
    const bridgeExitRoad = objects.addRoad(97.6, 18.2, 7.4, 15.61, 'horizontal', 'none', 'white-dashed', 2);
    for (const laneZ of [18.2 - 7.4 / 4, 18.2 + 7.4 / 4]) {
        objects.addTurnRoadArrow(101.7, laneZ, 3.7, 15.61, 'left', -Math.PI / 2);
    }

    objects.addRightAngleTurn(109.101, 18.2, 7.4, 'horizontal', 'left', 'white-dashed', 2, 0, 3);
    const wheelTrackApproachRoad = objects.addRoad(
        109.1, -14.65, 7.4, 58.5, 'vertical', 'none', 'white-dashed', 2, Math.PI,
    );


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
        exitLength: 53.8,
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

    // Biển ở bên phải từng lối vào: B, C, D trên các đảo cỏ; E ở dải cỏ cuối.
    // Lối C có đảo hẹp nên đặt cột giữa hai mép bó vỉa của C và D.
    const classSignX = course1.entryWorld.x - 2.4;
    const classSignPlacements = [
        { vehicleClass: 'B', z: course1.entryWorld.z - course1.roadWidthM / 2 - 1 },
        {
            vehicleClass: 'C', z: (course2.entryWorld.z - course2.roadWidthM / 2
                + course3.entryWorld.z + course3.roadWidthM / 2) / 2
        },
        { vehicleClass: 'D', z: course3.entryWorld.z - course3.roadWidthM / 2 - 1 },
        { vehicleClass: 'E', z: course4.entryWorld.z - course4.roadWidthM / 2 - 1 },
    ] as const;
    for (const { vehicleClass, z } of classSignPlacements) {
        objects.root.add(new WindingCourseClassSign(classSignX, z, vehicleClass).root);
    }

    // Chữ hạng xe trên mặt đường ngay đầu bốn chuồng vuông góc nối với đường 2 làn.
    // Tọa độ local -Z đi từ đường chính vào chuồng; xoay chữ để đọc thẳng
    // khi nhìn dọc đường 2 làn thay vì nằm ngang theo hướng chuồng.
    const wheelTrackEntryLabelInsetM = 2.5;
    const wheelTrackEntryLabels = [
        { vehicleClass: 'B', entry: course1 },
        { vehicleClass: 'C', entry: course2 },
        { vehicleClass: 'D', entry: course3 },
        { vehicleClass: 'E', entry: course4 },
    ] as const;
    for (const { vehicleClass, entry } of wheelTrackEntryLabels) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Cannot draw wheel-track entry class label');
        context.fillStyle = '#f6d34c';
        context.font = 'bold 200px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(vehicleClass, 128, 136);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
        );
        label.name = `EX04_ENTRY_LABEL_${vehicleClass}`;
        label.rotation.x = -Math.PI / 2;
        label.rotateZ(-Math.PI / 2);
        label.position.set(0, .09, -wheelTrackEntryLabelInsetM);
        entry.courseRoot.add(label);
    }

    objects.addWheelTrackEntryIslandCaps(
        [
            { entryWorld: new THREE.Vector3(109.1 - 7.4 / 2, 0, 18.2), roadWidthM: 7.4, courseRoot: bridgeExitRoad },
            course1, course2, course3, course4,
        ],
        109.1 - 7.4 / 2,
        [4, 3, .75, 3],
    );

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
    const wheelTrackExitRoad = objects.addFourLaneRoad({
        withLaneNumbers: showRoadLaneNumbers,
        x: 19.4,
        z: -17.4,
        lengthM: 42,
        laneWidthM: 3.7,
        withArrows: false,
        withLaneMarkings: false,
        sectionAlignment: 'right',
        sections: [
            // Tâm section 3 làn trùng mép bắc đường 4 làn; lệch +Z để số nằm trên mặt đường.
            { lengthM: 25, laneCount: 3, laneNumberOffsetM: 6.5 },
            { lengthM: 34.5, laneCount: 1 },
        ],
    });
    // Bài kết thúc: vạch ngang nằm trước mép ngã tư 15 m theo hướng -X.
    const finishLine = objects.addStartLine(finishLineX, finishRoad.position.z,
        'horizontal', 2 * 3.7);
    finishLine.name = 'EX11_FINISH_LINE';
    // Xe đi về -X: vạch đứt giữa hai làn dừng ngay mép vạch kết thúc.
    const finishLineApproachEdgeX = new THREE.Box3().setFromObject(finishLine).max.x;
    const dividerEndLocalZ = finishRoad.position.x - finishLineApproachEdgeX;
    for (const child of [...finishRoad.children]) {
        if (!(child instanceof THREE.Mesh) || child.name !== 'road-center-line'
            || !(child.geometry instanceof THREE.BoxGeometry)) continue;
        const { width, height, depth: lengthM } = child.geometry.parameters;
        const fromZ = child.position.z - lengthM / 2;
        const keptLengthM = Math.min(lengthM, dividerEndLocalZ - fromZ);
        if (keptLengthM <= 0) {
            finishRoad.remove(child);
            child.geometry.dispose();
        } else if (keptLengthM < lengthM) {
            child.geometry.dispose();
            child.geometry = new THREE.BoxGeometry(width, height, keptLengthM);
            child.position.z = fromZ + keptLengthM / 2;
        }
    }
    // Xe đi về -X: cả hai mũi tên ở phía tiếp cận (+X) của vạch kết thúc.
    const finishArrowX = finishLineX + 6;
    for (const [laneIndex, laneZ] of [
        finishRoad.position.z - 3.7 / 2,
        finishRoad.position.z + 3.7 / 2,
    ].entries()) {
        const arrow = objects.addStraightRoadArrow(finishArrowX, laneZ, 3.7, 10,
            Math.PI / 2);
        arrow.name = `EX11_FINISH_ARROW_LANE_${laneIndex + 1}`;
    }
    // Bảng xanh KẾT THÚC trên bãi cỏ bên phải, ngang cặp mũi tên tiếp cận.
    // Mặt bảng quay về +X để xe chạy hướng -X nhìn thấy.
    const finishSign = new AccelerationInstructionSign(
        finishArrowX + 1,
        finishRoad.position.z - 4.5,
        Math.PI / 2,
        { lines: ['KẾT THÚC'], name: 'EX11_FINISH_SIGN' },
    );
    objects.root.add(finishSign.root);
    const finishText = objects.addRoadText('KẾT THÚC', finishLineX - 2,
        finishRoad.position.z, 'horizontal', 2 * 3.7);
    finishText.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI);
    finishText.name = 'EX11_FINISH_TEXT';
    objects.root.add(finishText);
    // Làn nhập rộng thêm 3,7 m: đầu các dải cỏ nằm lùi khỏi đường một làn,
    // còn bãi cỏ lớn tiếp giáp đường và bo R10 như trên bản vẽ.
    objects.addWheelTrackExitApron(
        [course1, course2, course3, course4],
        19.4 + 3 * 3.7 / 2,
        exitApronLaneWidthM,
    );
    objects.addWheelTrackExitUpperCorner(wheelTrackExitRoad, course1, 2);
    // Crosswalk phủ trọn đoạn 3 làn của đường tại Z=-36.5 (3 × 3.7 m).
    const exam05CrosswalkZ = -36.5;
    const exam05CrosswalkDepthM = 3;
    const exam05StopBarWidthM = .60;
    const stopBarCurbOverlapM = .01;
    const eastCornerX = 19.4 + 3 * 3.7 / 2;
    const eastCornerZ = -42 + 7.4 / 2;
    const eastCornerRadiusM = 7.5;
    const eastCornerCenterX = eastCornerX + eastCornerRadiusM;
    const eastCornerCenterZ = eastCornerZ + eastCornerRadiusM;
    // Biên dùng để định vị vạch dừng và vạch vàng, lùi 0,1 m so với bó vỉa R7,5.
    const curbRoadEdgeXAt = (z: number) => eastCornerCenterX
        - Math.sqrt((eastCornerRadiusM + .2) ** 2 - (z - eastCornerCenterZ) ** 2);
    // Mép trong thực tế của bó vỉa cong; stop bar lấn nhẹ vào mép này để không hở khe.
    const stopBarCurbEdgeXAt = (z: number) => eastCornerCenterX
        - Math.sqrt((eastCornerRadiusM + CURB_VISUAL_WIDTH_M) ** 2
            - (z - eastCornerCenterZ) ** 2) + stopBarCurbOverlapM;
    // Keep the yellow paint against the straight edge of hatch 5A. Locate the
    // 3.7 m stop bar where that edge and the opposite curved curb are 3.7 m apart.
    const oneLaneSection = wheelTrackExitRoad.footprints[wheelTrackExitRoad.footprints.length - 1];
    const oneLaneEdgeX = wheelTrackExitRoad.root.position.x + oneLaneSection.minX;
    const finishSurface = finishRoad.getObjectByName('road-surface');
    if (!finishSurface) throw new Error('Finish road surface is missing');
    finishRoad.updateMatrixWorld(true);
    const finishRoadEdgeZ = new THREE.Box3().setFromObject(finishSurface).max.z;
    const hatchRadiusM = 7;
    const hatchOuterRadiusM = hatchRadiusM - .1;
    const hatchTopZ = finishRoadEdgeZ + hatchRadiusM;
    const hatchEdgeSlope = (hatchRadiusM - hatchOuterRadiusM) / (hatchRadiusM + hatchOuterRadiusM);
    const hatchEdgeXAt = (z: number) => oneLaneEdgeX + hatchEdgeSlope * (z - hatchTopZ);
    let stopBarMinZ = eastCornerZ;
    let stopBarMaxZ = eastCornerCenterZ;
    for (let i = 0; i < 32; i++) {
        const middleZ = (stopBarMinZ + stopBarMaxZ) / 2;
        if (curbRoadEdgeXAt(middleZ) - hatchEdgeXAt(middleZ) > wheelTrackExitRoad.laneWidthM) {
            stopBarMinZ = middleZ;
        } else {
            stopBarMaxZ = middleZ;
        }
    }
    // Advance the stop bar 1 m along Z from its previous placement.
    const exam05StopBarZ = (stopBarMinZ - 2 + stopBarMaxZ) / 2;
    const exam05StopBarToCrosswalkM = exam05StopBarZ - exam05CrosswalkZ;
    const exam05LightToCrosswalkM = 2.5;
    const exam05YellowToLightM = 5;
    const exam05TriggerToYellowM = 5;
    const exam05TriggerLengthM = 2;
    const trimYellowDividerAtStopBar = (
        road: THREE.Group, dividerName: string, stopBarX: number, travelX: 1 | -1,
        paintOverlapM = .02,
    ) => {
        const divider = road.getObjectByName(dividerName);
        if (!(divider instanceof THREE.Mesh)) throw new Error(`${dividerName} is missing`);
        road.updateMatrixWorld(true);
        const originalBounds = new THREE.Box3().setFromObject(divider);
        // Cho nét vàng chạy vào dưới vạch trắng để mối nối không hở khi nhìn nghiêng.
        const joinX = stopBarX - travelX * (exam05StopBarWidthM / 2 - paintOverlapM);
        const minX = travelX === 1 ? originalBounds.min.x : joinX;
        const maxX = travelX === 1 ? joinX : originalBounds.max.x;
        if (maxX <= minX) throw new Error(`${dividerName} does not reach the stop bar`);
        divider.geometry.computeBoundingBox();
        const geometryBounds = divider.geometry.boundingBox!;
        const lineWidthM = geometryBounds.max.x - geometryBounds.min.x;
        const lineHeightM = geometryBounds.max.y - geometryBounds.min.y;
        divider.geometry.dispose();
        divider.geometry = new THREE.BoxGeometry(lineWidthM, lineHeightM, maxX - minX);
        divider.position.z = road.worldToLocal(new THREE.Vector3(
            (minX + maxX) / 2, 0, road.position.z,
        )).z;
    };
    const stopBarLeftX = hatchEdgeXAt(exam05StopBarZ);
    const stopBarNearZ = exam05StopBarZ + exam05StopBarWidthM / 2;
    const stopBarFarZ = exam05StopBarZ - exam05StopBarWidthM / 2;

    // Vạch vàng từ mép bó vỉa góc 5A chạy thẳng tới vạch dừng trắng.
    const yellowLineEndZ = stopBarNearZ - .02;
    objects.addFinishRoadJunctionCorners(finishRoad, wheelTrackExitRoad, hatchRadiusM, 5,
        [hatchEdgeXAt(yellowLineEndZ) + .075, yellowLineEndZ]);
    objects.addPedestrianCrossing(19.4, exam05CrosswalkZ, 'vertical', 3 * 3.7, exam05CrosswalkDepthM);
    // Đầu phải của vạch trắng cắt theo mép cong thực tế của bó vỉa.
    const stopBarShape = new THREE.Shape();
    stopBarShape.moveTo(stopBarLeftX, -stopBarNearZ);
    stopBarShape.lineTo(stopBarCurbEdgeXAt(stopBarNearZ), -stopBarNearZ);
    for (let i = 1; i <= 16; i++) {
        const z = stopBarNearZ + (stopBarFarZ - stopBarNearZ) * i / 16;
        stopBarShape.lineTo(stopBarCurbEdgeXAt(z), -z);
    }
    stopBarShape.lineTo(stopBarLeftX, -stopBarFarZ);
    stopBarShape.closePath();
    const stopBarGeometry = new THREE.ShapeGeometry(stopBarShape);
    stopBarGeometry.rotateX(-Math.PI / 2);
    const stopBar = new THREE.Mesh(stopBarGeometry,
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .7, side: THREE.DoubleSide }));
    stopBar.name = 'exam-05-stop-bar';
    stopBar.position.y = .095;
    stopBar.receiveShadow = true;
    objects.root.add(stopBar);
    // Đường ngang phía ĐÔNG ngã tư (xe từ Đông đến dừng trước crosswalk)
    // 2 làn × 3.70 m, cùng bề rộng làn với addFourLaneBidirectionalRoad().
    //hướng bắc 2
    const eastJunctionRoadX = 34;
    const eastJunctionRoadZ = -42;
    const eastJunctionLaneWidthM = 3.7;
    const eastJunctionRoadLengthM = 26;
    const eastJunctionRoad = objects.addRoad(
        eastJunctionRoadX, eastJunctionRoadZ,
        2 * eastJunctionLaneWidthM, eastJunctionRoadLengthM,
        'horizontal', 'straight', 'yellow-solid', 2,
    );
    // Nối mép đông đường dọc với mép bắc đường ngang bằng góc curb R7.5.
    objects.addRoadCornerR7_5(eastCornerX, eastCornerZ);
    // Làn phía nam đường Đông đi về -X: vạch qua đường, stop bar, đèn và
    // vùng cảm biến cùng nằm trên một hướng tiếp cận ngã tư.
    const eastCrosswalkX = 28.5;
    const eastCrosswalkDepthM = 3;
    objects.addPedestrianCrossing(eastCrosswalkX, eastJunctionRoadZ, 'horizontal', 8, eastCrosswalkDepthM);
    const eastIncomingLaneZ = eastJunctionRoadZ - eastJunctionLaneWidthM / 2;
    const eastSouthCornerRadiusM = 7.5;
    const eastSouthCornerCenterX = EXAM_05_FINISH_CROSSWALK_X
        + EXAM_05_FINISH_CROSSWALK_WIDTH_M / 2 + eastSouthCornerRadiusM;
    const eastSouthCornerCenterZ = eastJunctionRoadZ - eastJunctionLaneWidthM
        - eastSouthCornerRadiusM;
    const eastStopBarCurbZAtX = (x: number) => eastSouthCornerCenterZ
        + Math.sqrt((eastSouthCornerRadiusM + CURB_VISUAL_WIDTH_M) ** 2
            - (x - eastSouthCornerCenterX) ** 2) - stopBarCurbOverlapM;
    const eastYellowDivider = eastJunctionRoad.getObjectByName('road-center-line');
    if (!(eastYellowDivider instanceof THREE.Mesh)) {
        throw new Error('East road yellow divider is missing');
    }
    eastJunctionRoad.updateMatrixWorld(true);
    const eastStopBarDividerZ = new THREE.Box3().setFromObject(eastYellowDivider).max.z
        + stopBarCurbOverlapM;
    // Cụm đèn hướng bắc của eastJunctionRoad (objects.addRoad).
    const eastStopBarToCrosswalkM = exam05StopBarToCrosswalkM;
    const eastLightToCrosswalkM = exam05LightToCrosswalkM;
    const eastYellowToLightM = exam05YellowToLightM;
    const eastTriggerToYellowM = exam05TriggerToYellowM;
    const eastTriggerLengthM = exam05TriggerLengthM;
    const eastStopBarX = eastCrosswalkX + eastStopBarToCrosswalkM;
    const eastStopBarLeftX = eastStopBarX - exam05StopBarWidthM / 2;
    const eastStopBarRightX = eastStopBarX + exam05StopBarWidthM / 2;
    const eastStopBarShape = new THREE.Shape();
    eastStopBarShape.moveTo(eastStopBarLeftX, -eastStopBarDividerZ);
    eastStopBarShape.lineTo(eastStopBarRightX, -eastStopBarDividerZ);
    for (let i = 0; i <= 16; i++) {
        const x = eastStopBarRightX - (eastStopBarRightX - eastStopBarLeftX) * i / 16;
        eastStopBarShape.lineTo(x, -eastStopBarCurbZAtX(x));
    }
    eastStopBarShape.closePath();
    const eastStopBarGeometry = new THREE.ShapeGeometry(eastStopBarShape);
    eastStopBarGeometry.rotateX(-Math.PI / 2);
    const eastStopBar = new THREE.Mesh(eastStopBarGeometry,
        new THREE.MeshStandardMaterial({
            color: 0xffffff, roughness: .7,
            side: THREE.DoubleSide
        }));
    eastStopBar.name = 'exam-05-east-stop-bar';
    eastStopBar.position.y = .095;
    eastStopBar.receiveShadow = true;
    objects.root.add(eastStopBar);

    const eastLightX = eastCrosswalkX + eastLightToCrosswalkM;
    const eastLaneMarkingLengthM = eastJunctionLaneWidthM - .3;
    const eastLocalLaneX = eastJunctionRoadZ - eastIncomingLaneZ;
    objects.addTrafficLight(eastLightX, eastJunctionRoadZ, 2 * eastJunctionLaneWidthM,
        Math.PI / 2, {
        poleOffsetX: 2 * eastJunctionLaneWidthM + 1.1,
        realisticHead: true,
        stopLineZ: eastYellowToLightM,
        stopLineX: eastLocalLaneX,
        stopLineLength: eastLaneMarkingLengthM,
        stopLineDashed: true,
        triggerStart: eastYellowToLightM + eastTriggerToYellowM,
        triggerLength: eastTriggerLengthM,
        triggerStartX: eastLocalLaneX - eastLaneMarkingLengthM / 2,
        triggerLengthX: eastLaneMarkingLengthM,
        showTriggerZone: false,
        markerId: 'EAST',
    });
    trimYellowDividerAtStopBar(
        eastJunctionRoad, 'road-center-line', eastStopBarX, -1, .08,
    );
    objects.root.add(new Exam05JunctionSigns(
        eastLightX + eastYellowToLightM,
        eastJunctionRoadZ - eastJunctionLaneWidthM - .7,
        Math.PI / 2,
    ).root);
    // Mũi tên giữ kích thước chuẩn bài 01; dịch mũi tên làn vào khỏi vạch vàng.
    for (const arrow of eastJunctionRoad.children) {
        if (arrow instanceof THREE.Mesh && arrow.geometry instanceof THREE.PlaneGeometry
            && arrow.position.x < 0) arrow.position.z = -0.2;
    }
    // ============================================================
    // FOUR-LANE BIDIRECTIONAL ROAD — đường 4 làn hai chiều
    // Theo spec/road/road_4lane_bidirectional_spec.md
    // Layout: L1 ↓ | WHITE_DASHED | L2 ↓ | YELLOW_SOLID | L3 ↑ | WHITE_DASHED | L4 ↑
    // ============================================================
    //hướng nam
    const westJunctionRoad = objects.addFourLaneBidirectionalRoad({
        x: westJunctionRoadX,
        z: -42,
        lengthM: westJunctionRoadLengthM,
        laneWidthM: westJunctionLaneWidthM,
        rotationY: Math.PI / 2,
        withLaneNumbers: showRoadLaneNumbers,
        withPositiveXCornerLaneNumbers: showRoadLaneNumbers,
        positiveXCornerInnerArrowType: 'diagonal-right',
        // Road xoay +90°: local +X 8 m tương ứng world -Z 8 m so với vị trí gốc.
        positiveXCornerInnerArrowShiftXM: 8,
        positiveXCornerLane2ArrowType: 'diagonal-left',
        // Road xoay +90°: local -X 8 m tương ứng world +Z 8 m.
        positiveXCornerLane2ArrowShiftXM: -15,
        // Góc vuông 4 → 3 làn theo CAD: mép trong R3, mép ngoài R7, vạch vàng R7.
        negativeZCurveRadiusM: westJunctionInnerRadiusM,
        negativeZCurveOuterRadiusM: 7,
        negativeZCurveCenterLineRadiusM: 7,
        negativeZCurveLegLengthM: 19.3,
        negativeZCurveSide: 'positive-x',
    });
    // Vạch qua đường phủ gần tới bó vỉa hai bên của đoạn bốn làn.
    objects.addPedestrianCrossing(12.5, -42, 'horizontal', westJunctionRoad.widthM, 3);
    // Các làn có mũi tên đặt riêng bên dưới; bỏ mũi tên mặc định ở giữa đường
    // để các ký hiệu không chồng lên nhau.
    for (const arrow of [...westJunctionRoad.root.children]) {
        if (!(arrow instanceof THREE.Mesh)
            || (arrow.name !== 'arrow-forward' && arrow.name !== 'arrow-backward')) continue;
        arrow.removeFromParent();
        arrow.geometry.dispose();
        const material = arrow.material as THREE.MeshBasicMaterial;
        material.map?.dispose();
        material.dispose();
    }
    // Hai làn bên trái ảnh (phía +Z) đi về +X, dừng trước vạch tại X=12,5.
    const westIncomingLaneZ = westJunctionRoad.root.position.z + westJunctionRoad.laneWidthM;
    // Cụm đèn hướng nam của westJunctionRoad (objects.addFourLaneBidirectionalRoad).
    const westStopBarToCrosswalkM = exam05StopBarToCrosswalkM;
    const westLightToCrosswalkM = exam05LightToCrosswalkM;
    const westYellowToLightM = exam05YellowToLightM;
    const westTriggerToYellowM = exam05TriggerToYellowM;
    const westTriggerLengthM = exam05TriggerLengthM;
    const westCrosswalkX = 12.5;
    const westRoadCenterZ = westJunctionRoad.root.position.z;
    const westStopBarX = westCrosswalkX - westStopBarToCrosswalkM;
    // Cho đầu stop bar phủ nhẹ lên vạch vàng giữa hai chiều để không hở mối nối.
    const westStopBarMinZ = westRoadCenterZ - .09;
    const westStopBarMaxZ = westRoadCenterZ + westJunctionRoad.widthM / 2
        - CURB_VISUAL_WIDTH_M + stopBarCurbOverlapM;
    const westStopBar = new THREE.Mesh(
        new THREE.BoxGeometry(exam05StopBarWidthM, .012, westStopBarMaxZ - westStopBarMinZ),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .7 }),
    );
    westStopBar.name = 'exam-05-west-stop-bar';
    westStopBar.position.set(westStopBarX, .095, (westStopBarMinZ + westStopBarMaxZ) / 2);
    westStopBar.receiveShadow = true;
    objects.root.add(westStopBar);

    const westLightX = westCrosswalkX - westLightToCrosswalkM;
    const westLaneMarkingLengthM = 2 * westJunctionRoad.laneWidthM - .3;
    const westLocalLaneX = westIncomingLaneZ - westRoadCenterZ;
    objects.addTrafficLight(westLightX, westRoadCenterZ, westJunctionRoad.widthM,
        -Math.PI / 2, {
        poleOffsetX: westJunctionRoad.widthM + 2,
        poleOffsetZ: -2, // Góc xoay -90°: local -Z dịch riêng cột và đầu đèn về world +X.
        realisticHead: true,
        stopLineZ: westYellowToLightM,
        stopLineX: westLocalLaneX,
        stopLineLength: westLaneMarkingLengthM,
        stopLineDashed: true,
        triggerStart: westYellowToLightM + westTriggerToYellowM,
        triggerLength: westTriggerLengthM,
        triggerStartX: westLocalLaneX - westLaneMarkingLengthM / 2,
        triggerLengthX: westLaneMarkingLengthM,
        showTriggerZone: false,
        markerId: 'WEST',
        alwaysGreen: true,
    });
    // Hai vạch trắng dọc dừng trước vạch vàng đứt, không kéo tiếp tới stopbar/vạch qua đường.
    // Đèn xoay -90° nên vạch vàng nằm tại world X = westLightX - stopLineZ.
    const westWhiteDashEndX = westLightX - westYellowToLightM - .09;
    westJunctionRoad.root.updateMatrixWorld(true);
    for (const dash of [...westJunctionRoad.root.children]) {
        if (!(dash instanceof THREE.Mesh)
            || (dash.name !== 'white-dashed-left' && dash.name !== 'white-dashed-right')
            || !(dash.geometry instanceof THREE.BoxGeometry)) continue;
        const bounds = new THREE.Box3().setFromObject(dash);
        if (bounds.max.x <= westWhiteDashEndX) continue;
        if (bounds.min.x >= westWhiteDashEndX) {
            dash.removeFromParent();
            dash.geometry.dispose();
            continue;
        }
        const { width, height } = dash.geometry.parameters;
        dash.geometry.dispose();
        dash.geometry = new THREE.BoxGeometry(width, height, westWhiteDashEndX - bounds.min.x);
        dash.position.z = westJunctionRoad.root.worldToLocal(new THREE.Vector3(
            (bounds.min.x + westWhiteDashEndX) / 2, 0, westRoadCenterZ,
        )).z;
    }
    trimYellowDividerAtStopBar(
        westJunctionRoad.root, 'yellow-solid-center', westStopBarX, 1,
    );
    objects.root.add(new Exam05JunctionSigns(
        westLightX - westYellowToLightM + 2,
        westJunctionRoad.root.position.z + westJunctionRoad.widthM / 2 + .7,
        -Math.PI / 2,
        'right',
    ).root);
    // Hai góc phía nam ngã tư: bên đường đông R7,5, bên đường tây R3.
    // Lấy đúng mép nam của hai mặt đường để cung tiếp tuyến với curb hiện có.
    const eastJunctionSurface = eastJunctionRoad.getObjectByName('road-surface');
    const westJunctionSurface = westJunctionRoad.root.getObjectByName('road-surface');
    if (!eastJunctionSurface || !westJunctionSurface) {
        throw new Error('Exam 5 junction road surface is missing');
    }
    eastJunctionRoad.updateMatrixWorld(true);
    westJunctionRoad.root.updateMatrixWorld(true);
    const eastJunctionSouthZ = new THREE.Box3().setFromObject(eastJunctionSurface).min.z;
    const westJunctionBounds = new THREE.Box3().setFromObject(westJunctionSurface);
    const westJunctionSouthZ = westJunctionBounds.min.z;
    const westJunctionNorthZ = westJunctionBounds.max.z;
    // Bo R4 góc quẹo phải ở mép bắc đường 4 làn, nối vào mép trái
    // của section 3 làn thuộc đường ra bài vệt bánh xe.
    const wheelTrackExitWestEdgeX = wheelTrackExitRoad.root.position.x
        + wheelTrackExitRoad.footprints[0].minX;
    objects.addRoadJunctionCorner(
        wheelTrackExitWestEdgeX, westJunctionNorthZ, 4, 'west', 'north',
    );
    const southApproachHalfWidthM = EXAM_05_FINISH_CROSSWALK_WIDTH_M / 2;
    objects.addRoadJunctionCorner(
        EXAM_05_FINISH_CROSSWALK_X + southApproachHalfWidthM,
        eastJunctionSouthZ, eastSouthCornerRadiusM, 'east', 'south',
    );
    objects.addRoadJunctionCorner(
        EXAM_05_FINISH_CROSSWALK_X - southApproachHalfWidthM,
        westJunctionSouthZ, 3, 'west', 'south',
    );
    objects.addPedestrianCrossing(
        EXAM_05_FINISH_CROSSWALK_X,
        EXAM_05_FINISH_CROSSWALK_Z,
        'vertical',
        EXAM_05_FINISH_CROSSWALK_WIDTH_M,
        EXAM_05_FINISH_CROSSWALK_DEPTH_M,
    );

    // Pole luôn lệch local -X (TrafficLight.ts: poleX = -width/2 - 0.55).
    // Đường dọc NS trải X ∈ [17, 25]; đường ngang EW trải Z ∈ [-46, -38].
    // Pole phải nằm ngoài lane; panel chính hướng về chiều xe đến.
    const southLightX = 30.5;
    const southLightZ = exam05CrosswalkZ + exam05LightToCrosswalkM;
    // The dashed marking moves independently of the light pole at southLightZ.
    const southStopLineLocalZ = exam05YellowToLightM;
    const southStopLineWorldZ = southLightZ + southStopLineLocalZ;
    // The dashed stop line stays between the longitudinal yellow edge and curb.
    const southStopLineMinX = hatchEdgeXAt(southStopLineWorldZ) + .2;
    const southStopLineMaxX = curbRoadEdgeXAt(southStopLineWorldZ) - .12;
    const southTriggerStartLocalZ = exam05YellowToLightM + exam05TriggerToYellowM;
    const southTriggerLengthM = exam05TriggerLengthM;
    const southTriggerStartWorldZ = southLightZ + southTriggerStartLocalZ;
    const southTriggerLeftX = Math.min(
        hatchEdgeXAt(southTriggerStartWorldZ),
        hatchEdgeXAt(southTriggerStartWorldZ + southTriggerLengthM),
    );
    // Match the road-facing edge of the apron R10 curb above. Its final curb-width
    // blend joins the straight curb without a visible step.
    const apronLowerZ = Math.min(...[course1, course2, course3, course4]
        .map(course => course.exitWorld.z - course.roadWidthM / 2));
    const apronRadiusM = 10;
    const apronCenterZ = apronLowerZ - apronRadiusM;
    const apronCenterX = eastCornerX + apronRadiusM;
    const apronCurbRoadEdgeXAt = (z: number) => {
        const clampedZ = THREE.MathUtils.clamp(z, apronCenterZ, apronLowerZ);
        const dz = clampedZ - apronCenterZ;
        const t = 1 - 2 * Math.asin(dz / apronRadiusM) / Math.PI;
        const blend = t * t * (3 - 2 * t);
        return apronCenterX - Math.sqrt(apronRadiusM ** 2 - dz ** 2)
            - CURB_VISUAL_WIDTH_M * blend;
    };
    const southTriggerRightX = apronCurbRoadEdgeXAt(southTriggerStartWorldZ + southTriggerLengthM);
    //đèn hướng đông
    objects.addTrafficLight(southLightX, southLightZ, 8, 0, {
        poleOffsetX: .7,
        realisticHead: true,
        stopLineZ: southStopLineLocalZ,
        stopLineX: (southStopLineMinX + southStopLineMaxX) / 2 - southLightX,
        stopLineLength: southStopLineMaxX - southStopLineMinX,
        stopLineDashed: true,
        triggerStart: southTriggerStartLocalZ,
        triggerLength: southTriggerLengthM,
        triggerStartX: southTriggerLeftX - southLightX,
        triggerLengthX: southTriggerRightX - southTriggerLeftX,
        triggerMaxXAtZ: localZ => apronCurbRoadEdgeXAt(southLightZ + localZ) - southLightX,
        markerId: 'SOUTH',
    });
    // Mũi tên đi thẳng nằm giữa vạch vàng đứt và mép gần của vùng cảm biến đỏ.
    // Canh theo hai mép đường tại chính vị trí này để nằm giữa làn khi curb uốn cong.
    const southStraightArrowZ = (southStopLineWorldZ + southTriggerStartWorldZ) / 2;
    const southStraightArrowX = (
        hatchEdgeXAt(southStraightArrowZ) + apronCurbRoadEdgeXAt(southStraightArrowZ)
    ) / 2;
    const southStraightArrow = objects.addStraightRoadArrow(
        southStraightArrowX, southStraightArrowZ,
        wheelTrackExitRoad.laneWidthM,
        southTriggerStartWorldZ - southStopLineWorldZ,
    );
    southStraightArrow.name = 'exam-05-south-straight-arrow';
    // Cụm biển nằm trong phần cỏ bo R7,5 cạnh đèn tín hiệu, tại vùng khoanh bài 5.
    // Giữ khoảng lùi khỏi cả mép cong và cột đèn; mặt biển hướng về xe từ phía nam.
    objects.root.add(new Exam05JunctionSigns(
        eastCornerCenterX - 6,
        eastCornerCenterZ - 1.2,
    ).root);
    // Tâm vạch qua đường ở Z=-51 là mốc kết thúc bài 5; cảm biến logic không vẽ lên đường.

    // Giữ nguyên mũi xương cá ở đầu vạch vàng. Đáy xương cá nằm tại ranh giới
    // làn 6/5, cách mép đầu đường 3,7 m để phần sọc không lấn vào làn 6.
    //hướng tây
    const southRoadX = 21;
    const southRoadZ = -78.05;
    const southRoadWidthM = 8;
    const southRoadLengthM = 68;
    const southLaneWidthM = 3.7;
    const southHerringboneLengthM = 4;
    const southDividerSetbackM = southLaneWidthM + southHerringboneLengthM;
    const southHerringboneRadiusM = 5;
    const southRoad = objects.addRoad(
        southRoadX, southRoadZ, southRoadWidthM, southRoadLengthM,
        'vertical', 'none', 'yellow-solid', 2,
    );
    // Chỉnh trực tiếp X/Z để di chuyển riêng bồn hoa ngôi sao (đơn vị mét).
    const starFlowerBedX = 40;
    const starFlowerBedZ = -26;
    const starFlowerBedRadiusM = 9.5;
    const starFlowerBed = new StarFlowerBed(
        starFlowerBedX, starFlowerBedZ, starFlowerBedRadiusM,
    );
    // Một mũi hướng -Z, hai chân hướng +Z.
    starFlowerBed.root.rotation.y = Math.PI;
    objects.root.add(starFlowerBed.root);
    // Chỉnh X để dịch ngang; chỉnh Z để dịch dọc (Z lớn hơn: gần vạch qua đường).
    const southUpperArrowX = southRoadX + southRoadWidthM / 4;
    const southUpperArrowZ = southRoadZ - 5;
    const southLowerArrowX = southRoadX - southRoadWidthM / 4;
    const southLowerArrowZ = southRoadZ + 16.5;
    // Hai mũi tên rẽ chéo; làn trái đi theo chiều +Z.
    objects.addDiagonalTurnRoadArrow(
        southUpperArrowX, southUpperArrowZ - 6,
        southLaneWidthM, southRoadLengthM,
    );
    objects.addDiagonalTurnRoadArrow(
        southLowerArrowX, southLowerArrowZ + 5,
        southLaneWidthM, southRoadLengthM, 'left', true,
    );
    // Theo bản vẽ, stopbar nằm ở làn trái đi về +Z, phía -Z của vạch qua đường.
    // Giữ đúng khoảng cách stopbar → vạch qua đường như ở đầu vào bài 5.
    const southStopBarCurbX = southRoadX - southRoadWidthM / 2
        + CURB_VISUAL_WIDTH_M - stopBarCurbOverlapM;
    const southStopBarDividerX = southRoadX + .075;
    const southStopBar = new THREE.Mesh(
        new THREE.PlaneGeometry(southStopBarDividerX - southStopBarCurbX, exam05StopBarWidthM),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .7, side: THREE.DoubleSide }),
    );
    southStopBar.rotation.x = -Math.PI / 2;
    southStopBar.position.set(
        (southStopBarCurbX + southStopBarDividerX) / 2,
        .095,
        EXAM_05_FINISH_CROSSWALK_Z - exam05StopBarToCrosswalkM,
    );
    southStopBar.name = 'south-road-stop-bar';
    southStopBar.receiveShadow = true;
    objects.root.add(southStopBar);
    // Cụm W.202a, W.205a, R.301e đặt ngoài lề phải và quay về hướng -Z.
    const southRightShoulderOffsetM = -8.5;
    const southSignApproachOffsetM = 1;
    const southTurnSignX = southRoadX + southRoadWidthM / 2 + southRightShoulderOffsetM;
    const southTurnSignZ = southStopBar.position.z - southSignApproachOffsetM - 1;
    objects.root.add(new Exam05TurnJunctionSigns(southTurnSignX, southTurnSignZ).root);

    // Cột đèn thứ hai nằm cùng lề với biển, quay về hướng -Z như cụm biển.
    // Stop bar trắng dùng chung khoảng cách với đầu vào bài 05; vạch vàng và
    // vùng cảm biến của đèn tuân theo cùng các mốc 5 m / 5 m / 2 m.
    const southSideLightWidthM = 8;
    const southSideLightPoleOffsetX = .7;
    const southSideLightPoleLocalX = -southSideLightWidthM / 2 - .55 + southSideLightPoleOffsetX;
    const southSideLightX = southTurnSignX - Math.abs(southSideLightPoleLocalX) - 0.8;
    const southSideLightZ = EXAM_05_FINISH_CROSSWALK_Z - exam05LightToCrosswalkM;
    // Cùng chuỗi khoảng cách với đèn ở vạch qua đường phía bắc.
    const southSideLightStopLineZ = exam05YellowToLightM;
    const southSideStopLineLengthM = southStopBarDividerX - southStopBarCurbX;
    const southSideStopLineCenterX = (southStopBarDividerX + southStopBarCurbX) / 2;
    const southSideTriggerStartX = southSideLightX - southStopBarDividerX;
    //đèn hướng tây
    objects.addTrafficLight(southSideLightX, southSideLightZ, southSideLightWidthM, Math.PI, {
        poleOffsetX: southSideLightPoleOffsetX,
        realisticHead: true,
        stopLineZ: southSideLightStopLineZ,
        stopLineX: southSideLightX - southSideStopLineCenterX,
        stopLineLength: southSideStopLineLengthM,
        stopLineDashed: true,
        showStopLine: true,
        triggerStart: southSideLightStopLineZ + exam05TriggerToYellowM,
        triggerLength: exam05TriggerLengthM,
        triggerStartX: southSideTriggerStartX,
        triggerLengthX: southSideStopLineLengthM,
        showTriggerZone: false,
        markerId: 'SOUTH_EXIT',
    });
    const southDivider = southRoad.getObjectByName('road-center-line');
    if (!(southDivider instanceof THREE.Mesh)) throw new Error('South road center line is missing');
    // Cùng sắc vàng với vạch ngang nối vào đầu xương cá.
    const southHerringboneYellowColor = 0xffd700;
    (southDivider.material as THREE.MeshStandardMaterial).color.setHex(southHerringboneYellowColor);
    const southRoadEndZ = southRoadZ - southRoadLengthM / 2;
    const herringboneTipZ = southRoadEndZ + southDividerSetbackM;
    // Vạch vàng chỉ chạy từ mũi xương cá đến mép stopbar phía xe đến.
    // Chồng 2 cm dưới vạch trắng để không hở khe tại chỗ nối.
    const southDividerEndZ = southStopBar.position.z - exam05StopBarWidthM / 2 + .02;
    southDivider.scale.z = (southDividerEndZ - herringboneTipZ) / southRoadLengthM;
    southDivider.position.z = (herringboneTipZ + southDividerEndZ) / 2 - southRoadZ;

    const herringboneBaseZ = southRoadEndZ + southLaneWidthM;
    // Đáy 7,4 m nằm lọt trong đường 8 m, để hai góc trên không chạm bó vỉa.
    const halfHerringboneWidthM = southLaneWidthM;
    // Cung tròn R5 đi từ mép mỗi bên của đáy tới mũi trên tim đường.
    const chordM = Math.hypot(halfHerringboneWidthM, southHerringboneLengthM);
    const centerOffsetM = Math.sqrt(southHerringboneRadiusM ** 2 - (chordM / 2) ** 2);
    const arcCenterX = halfHerringboneWidthM / 2
        + southHerringboneLengthM * centerOffsetM / chordM;
    const arcCenterZ = southHerringboneLengthM / 2
        + halfHerringboneWidthM * centerOffsetM / chordM;
    const startAngle = Math.atan2(-arcCenterZ, halfHerringboneWidthM - arcCenterX);
    const endAngle = Math.atan2(southHerringboneLengthM - arcCenterZ, -arcCenterX);
    const curvedEdgePoint = (t: number) => {
        const angle = startAngle + (endAngle - startAngle) * t;
        return new THREE.Vector2(
            arcCenterX + southHerringboneRadiusM * Math.cos(angle),
            herringboneBaseZ + arcCenterZ + southHerringboneRadiusM * Math.sin(angle),
        );
    };
    const herringboneSteps = 64;
    const herringboneShape = new THREE.Shape();
    herringboneShape.moveTo(southRoadX - halfHerringboneWidthM, -herringboneBaseZ);
    herringboneShape.lineTo(southRoadX + halfHerringboneWidthM, -herringboneBaseZ);
    for (let i = 1; i <= herringboneSteps; i++) {
        const point = curvedEdgePoint(i / herringboneSteps);
        herringboneShape.lineTo(southRoadX + point.x, -point.y);
    }
    for (let i = herringboneSteps - 1; i >= 0; i--) {
        const point = curvedEdgePoint(i / herringboneSteps);
        herringboneShape.lineTo(southRoadX - point.x, -point.y);
    }
    herringboneShape.closePath();
    const herringboneGeometry = new THREE.ShapeGeometry(herringboneShape);
    herringboneGeometry.rotateX(-Math.PI / 2);
    const herringbone = new THREE.Mesh(herringboneGeometry, new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        depthWrite: false,
        vertexShader: `
            varying vec2 ground;
            void main() {
                vec4 world = modelMatrix * vec4(position, 1.0);
                ground = world.xz;
                gl_Position = projectionMatrix * viewMatrix * world;
            }
        `,
        fragmentShader: `
            varying vec2 ground;
            void main() {
                float stripe = mod((ground.x - ground.y) * 0.70710678, 0.8);
                if (stripe > 0.38) discard;
                gl_FragColor = vec4(1.0);
            }
        `,
    }));
    herringbone.name = 'south-road-end-herringbone';
    herringbone.position.y = .084;
    objects.root.add(herringbone);
    // Viền trắng sát vùng xương cá; viền vàng ôm sát hai cung và nối mượt vào vạch ngang.
    const yellowHerringboneWidthM = .15;
    const yellowHerringboneMaterial = new THREE.MeshStandardMaterial({
        color: southHerringboneYellowColor, roughness: .85, side: THREE.DoubleSide,
    });
    for (const side of [-1, 1]) {
        const vertices: number[] = [];
        const yellowVertices: number[] = [];
        const yellowCurveCenter = (t: number) => {
            const point = curvedEdgePoint(t);
            const angle = startAngle + (endAngle - startAngle) * t;
            const tangentX = -southHerringboneRadiusM * Math.sin(angle) * (endAngle - startAngle);
            const tangentZ = southHerringboneRadiusM * Math.cos(angle) * (endAngle - startAngle);
            const tangentLength = Math.hypot(tangentX, tangentZ);
            const endBlend = Math.min(1, t / .12, (1 - t) / .12);
            const outwardOffsetM = yellowHerringboneWidthM / 2
                * endBlend * endBlend * (3 - 2 * endBlend);
            return new THREE.Vector2(
                southRoadX + side * (point.x + tangentZ / tangentLength * outwardOffsetM),
                point.y - tangentX / tangentLength * outwardOffsetM,
            );
        };
        // Đầu cung tiếp tuyến với vạch ngang tại mép đường, không gãy ở chân tam giác.
        const transitionEndT = .1;
        const yellowJoinOverlapM = .02;
        const transitionStart = new THREE.Vector2(
            southRoadX + side * (southRoadWidthM / 2 + yellowJoinOverlapM), herringboneBaseZ,
        );
        const transitionEnd = yellowCurveCenter(transitionEndT);
        const baseTangentX = -southHerringboneRadiusM * Math.sin(startAngle)
            * (endAngle - startAngle);
        const endTangent = yellowCurveCenter(transitionEndT + .001)
            .sub(yellowCurveCenter(transitionEndT - .001)).multiplyScalar(500);
        const yellowBaseCurve = new THREE.CubicBezierCurve(
            transitionStart,
            transitionStart.clone().add(new THREE.Vector2(
                side * baseTangentX * transitionEndT / 3, 0,
            )),
            transitionEnd.clone().addScaledVector(endTangent, -transitionEndT / 3),
            transitionEnd,
        );
        const yellowCenter = (t: number) => t < transitionEndT
            ? yellowBaseCurve.getPoint(t / transitionEndT)
            : yellowCurveCenter(t);
        for (let i = 0; i < herringboneSteps; i++) {
            const fromT = i / herringboneSteps;
            const toT = (i + 1) / herringboneSteps;
            const from = curvedEdgePoint(fromT);
            const to = curvedEdgePoint(toT);
            const vertex = (point: THREE.Vector2, t: number, inner: boolean) => [
                southRoadX + side * Math.max(0, point.x - (inner
                    ? .09 * Math.min(1, t / .12, (1 - t) / .12)
                    : 0)),
                .085,
                point.y,
            ];
            vertices.push(
                ...vertex(from, fromT, false), ...vertex(from, fromT, true), ...vertex(to, toT, false),
                ...vertex(to, toT, false), ...vertex(from, fromT, true), ...vertex(to, toT, true),
            );
            const yellowVertex = (t: number, outer: boolean) => {
                const center = yellowCenter(t);
                const before = yellowCenter(Math.max(0, t - .001));
                const after = yellowCenter(Math.min(1, t + .001));
                const tangent = after.sub(before).normalize();
                const offsetM = (outer ? 1 : -1) * yellowHerringboneWidthM / 2;
                return [
                    center.x + side * tangent.y * offsetM,
                    .087,
                    center.y - side * tangent.x * offsetM,
                ];
            };
            yellowVertices.push(
                ...yellowVertex(fromT, false), ...yellowVertex(fromT, true),
                ...yellowVertex(toT, false),
                ...yellowVertex(toT, false), ...yellowVertex(fromT, true),
                ...yellowVertex(toT, true),
            );
        }
        const edgeGeometry = new THREE.BufferGeometry();
        edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const edge = new THREE.Mesh(edgeGeometry,
            new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
        edge.name = 'south-road-end-herringbone-edge';
        objects.root.add(edge);
        const yellowGeometry = new THREE.BufferGeometry();
        yellowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(yellowVertices, 3));
        yellowGeometry.computeVertexNormals();
        const yellowEdge = new THREE.Mesh(yellowGeometry, yellowHerringboneMaterial);
        yellowEdge.name = 'south-road-end-herringbone-yellow-edge';
        yellowEdge.receiveShadow = true;
        objects.root.add(yellowEdge);
    }
    // Che mối nối nhỏ giữa hai cung và đoạn tim đường bắt đầu đúng tại mũi xương cá.
    const yellowTipJoin = new THREE.Mesh(
        new THREE.CircleGeometry(yellowHerringboneWidthM / 2, 16),
        yellowHerringboneMaterial,
    );
    yellowTipJoin.name = 'south-road-end-herringbone-yellow-tip-join';
    yellowTipJoin.rotation.x = -Math.PI / 2;
    yellowTipJoin.position.set(southRoadX, .088, herringboneTipZ);
    objects.root.add(yellowTipJoin);

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
        dashGapM: 3,
        rotationY: Math.PI / 2 + Math.PI,
        withArrows: false,
        outlineOnly: false,
        withLaneNumbers: showRoadLaneNumbers,
        sectionAlignment: 'left',
        dividerSide: 'left',
        dividerColor: 0xffffff,
        sections: [
            { lengthM: 20 - sixAFourLaneTrimM, laneCount: 4, dashStartInsetM: 10 },
            { lengthM: 15, laneCount: 5 },
            { lengthM: 13.2, laneCount: 6, hiddenLaneSeparators: [1] },
        ],
    });
    // Vị trí 1: vạch vàng đứt và biển TĂNG SỐ / TĂNG TỐC ở làn ngoài cùng.
    // Đường xoay 270° nên giảm local Z sẽ tăng world X; ba vị trí cùng dịch +5 m.
    const fourLaneYellowSection = sixAFourLaneRoad.footprints[0];
    const sixLaneYellowSection = sixAFourLaneRoad.footprints[2];
    const accelerationPosition1BaseLocalZ =
        (fourLaneYellowSection.minZ + fourLaneYellowSection.maxZ) / 2 + 6;
    const accelerationPosition1LocalZ = accelerationPosition1BaseLocalZ - 5;
    const accelerationPosition2LocalZ = accelerationPosition1LocalZ + 25;
    const yellowCrossbarWidthM = .15;
    const yellowDashLengthM = .45;
    const yellowCrossbarMaterial = new THREE.MeshStandardMaterial({
        color: '#fcde59', roughness: .85,
    });
    const addYellowCrossbar = (outerLaneEdgeX: number, localZ: number,
        dashCount: number, name: string) => {
        const fromX = outerLaneEdgeX + CURB_VISUAL_WIDTH_M;
        const toX = outerLaneEdgeX + sixAFourLaneRoad.laneWidthM - yellowCrossbarWidthM / 2;
        const gapM = (toX - fromX - dashCount * yellowDashLengthM) / (dashCount - 1);
        for (let i = 0; i < dashCount; i++) {
            const startX = fromX + i * (yellowDashLengthM + gapM);
            const dash = new THREE.Mesh(
                new THREE.BoxGeometry(yellowDashLengthM, .008, yellowCrossbarWidthM),
                yellowCrossbarMaterial,
            );
            dash.name = name;
            dash.position.set(startX + yellowDashLengthM / 2, .067, localZ);
            dash.receiveShadow = true;
            sixAFourLaneRoad.root.add(dash);
        }
    };
    addYellowCrossbar(fourLaneYellowSection.minX, accelerationPosition1LocalZ,
        5, 'six-a-acceleration-position-1-yellow-dash');
    addYellowCrossbar(sixLaneYellowSection.minX, accelerationPosition2LocalZ,
        3, 'six-a-acceleration-position-2-yellow-dash');
    // Cùng dịch ba biển ở các vị trí 1, 2, 3 thêm 0,5 m theo trục Z thế giới.
    const accelerationSignShiftZM = .5;
    // Biển vị trí 1 cùng tọa độ X với vạch vàng.
    sixAFourLaneRoad.root.updateWorldMatrix(true, false);
    const accelerationSignPoint = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        fourLaneYellowSection.minX - 1.1,
        0,
        accelerationPosition1LocalZ,
    ));
    objects.root.add(new AccelerationInstructionSign(
        accelerationSignPoint.x,
        accelerationSignPoint.z + accelerationSignShiftZM,
        Math.PI / 2,
    ).root);
    // Biển tốc độ tối thiểu 20 và bảng BẮT ĐẦU GIẢM SỐ, TỐC ĐỘ ở vị trí 2.
    const position2SignPoint = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        sixLaneYellowSection.minX - 1.1,
        0,
        accelerationPosition2LocalZ,
    ));
    objects.root.add(new MinimumSpeed20StartDecelerationSign(
        position2SignPoint.x,
        position2SignPoint.z + accelerationSignShiftZM,
        Math.PI / 2,
    ).root);
    // Mũi tên làn 4 nằm bên phải vạch vàng theo hướng +X, đầu chỉ về -X.
    // 4,8 m đặt tâm mũi tên đúng vị trí số 4 cũ (tâm section + 1,2 m).
    const lane4ArrowDistanceFromCrossbarM = 4.8;
    sixAFourLaneRoad.root.updateWorldMatrix(true, false);
    const lane4ArrowPoint = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        fourLaneYellowSection.minX + sixAFourLaneRoad.laneWidthM / 2,
        0,
        accelerationPosition1LocalZ - lane4ArrowDistanceFromCrossbarM,
    ));
    const lane4LeftArrow = objects.addStraightRoadArrow(
        lane4ArrowPoint.x,
        lane4ArrowPoint.z,
        sixAFourLaneRoad.laneWidthM,
        fourLaneYellowSection.maxZ - fourLaneYellowSection.minZ,
        Math.PI / 2,
    );
    lane4LeftArrow.name = 'six-a-lane-4-left-arrow';

    // Sau vạch vàng vị trí 2 là 5 m theo -X, ở giữa chính làn có vạch vàng.
    // Đường xoay 270°: tăng local Z tương ứng với giảm world X.
    const position2ArrowPoint = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        sixLaneYellowSection.minX + sixAFourLaneRoad.laneWidthM / 2,
        0,
        accelerationPosition2LocalZ + 5,
    ));
    const position2StraightArrow = objects.addStraightRoadArrow(
        position2ArrowPoint.x,
        position2ArrowPoint.z,
        sixAFourLaneRoad.laneWidthM,
        sixLaneYellowSection.maxZ - sixLaneYellowSection.minZ,
        Math.PI / 2,
    );
    position2StraightArrow.name = 'six-a-acceleration-position-2-straight-arrow';

    // Mũi tên theo CAD tại ba hàng khoanh đỏ: cặp sát xương cá rẽ xéo phải;
    // các làn còn lại đi thẳng có nhánh rẽ phải hoặc rẽ xéo vào chuồng S.
    // Texture gốc chỉ về -Z; xoay -90° để thân chỉ về +X và nhánh phải về +Z.
    // Dùng tâm làn của từng section; lùi 3 m khỏi số làn ở giữa section.
    // offsetXM tính theo trục X thế giới: số dương dịch sang +X, số âm sang -X.
    const sCourseApproachArrows: ReadonlyArray<{
        sectionIndex: number;
        laneNumber: number;
        direction: 'straight' | 'turn' | 'diagonal-right';
        offsetXM?: number;
    }> = [
            { sectionIndex: 0, laneNumber: 2, direction: 'diagonal-right', offsetXM: +6 },
            { sectionIndex: 0, laneNumber: 3, direction: 'diagonal-right', offsetXM: +6 },
            { sectionIndex: 0, laneNumber: 2, direction: 'straight', offsetXM: -6 },
            { sectionIndex: 0, laneNumber: 3, direction: 'straight', offsetXM: -6 },
            { sectionIndex: 1, laneNumber: 4, direction: 'straight', offsetXM: -1.5 },
            { sectionIndex: 1, laneNumber: 3, direction: 'straight', offsetXM: -1.5 },
            { sectionIndex: 1, laneNumber: 1, direction: 'turn', offsetXM: +11 },
            { sectionIndex: 1, laneNumber: 1, direction: 'turn', offsetXM: -1 },
            { sectionIndex: 2, laneNumber: 2, direction: 'turn', offsetXM: +3 },
        ];
    sixAFourLaneRoad.root.updateMatrixWorld(true);
    for (const { sectionIndex, laneNumber, direction, offsetXM = 0 } of sCourseApproachArrows) {
        const section = sixAFourLaneRoad.footprints[sectionIndex];
        const laneLocalX = section.maxX - (laneNumber - .5) * sixAFourLaneRoad.laneWidthM;
        const arrowLocalZ = (section.minZ + section.maxZ) / 2 + 3;
        const point = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(laneLocalX, 0, arrowLocalZ));
        point.x += offsetXM;
        const sectionLengthM = section.maxZ - section.minZ;
        const arrow = direction === 'straight'
            ? objects.addStraightRightRoadArrow(point.x, point.z, sixAFourLaneRoad.laneWidthM,
                sectionLengthM, -Math.PI / 2)
            : objects.addDiagonalTurnRoadArrow(point.x, point.z, sixAFourLaneRoad.laneWidthM,
                sectionLengthM, 'right', false, -Math.PI / 2, direction === 'turn');
        arrow.name = `EX06_S_APPROACH_SECTION_${sectionIndex + 1}_LANE_${laneNumber}_${direction}`;
    }



    //đường chuyển từ dốc cầu qua bài vệt bánh xe vuông góc
    const road11AEndX = 109.1;
    const road11AEndZ = -53.7;
    const road11AWidthM = 7.4;
    const road11AEndLengthM = 19.6;
    const road11AEndRoad = objects.addRoad(
        road11AEndX, road11AEndZ, road11AWidthM, road11AEndLengthM,
        'vertical', 'straight', 'white-dashed',
    );

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
    // Góc trong 6A → 11A bo R5, tiếp tuyến với mép trong R22,6 của cung đầu.
    // Lead chỉ dài ~1,06 m nên cung R5 phải nối trực tiếp vào cung 11A.
    const road11AFilletRadiusM = 5;
    const road11AInnerRadiusM = road11AFirstRadiusM - road11AWidthM / 2;
    const road11AInnerEdgeZ = road11AStart.z + road11AWidthM / 2;
    const road11AArcCenterZ = road11AStart.z + road11AFirstRadiusM;
    const road11AFilletCenterX = road11AStart.x + road11AFilletRadiusM;
    const centerDx = road11AFilletCenterX - firstArcStartX;
    const centerDistanceM = road11AInnerRadiusM - road11AFilletRadiusM;
    const road11AFilletCenterZ = road11AArcCenterZ
        - Math.sqrt(centerDistanceM ** 2 - centerDx ** 2);
    const road11ATangentX = firstArcStartX + road11AInnerRadiusM * centerDx / centerDistanceM;
    const road11ATangentZ = road11AArcCenterZ
        + road11AInnerRadiusM * (road11AFilletCenterZ - road11AArcCenterZ) / centerDistanceM;
    const road11ATangentSweep = Math.atan2(
        road11ATangentZ - road11AArcCenterZ,
        road11ATangentX - firstArcStartX,
    ) + Math.PI / 2;
    const road11ALead = objects.addRoad(
        road11AStart.x + road11ALeadM / 2,
        road11AStart.z,
        road11AWidthM,
        road11ALeadM,
        'horizontal',
        'none',
        'white-dashed',
    );
    // Mép phía đảo cỏ sẽ được thay bằng bó vỉa R5; bỏ curb thẳng cũ của lead.
    for (const child of [...road11ALead.children]) {
        if (child.name !== 'red-white-curb' || child.position.x <= 0) continue;
        child.removeFromParent();
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
        }
    }
    const road11AAutoArrows = (road: THREE.Group): THREE.Mesh[] => {
        const arrows: THREE.Mesh[] = [];
        road.traverse(child => {
            if (child instanceof THREE.Mesh
                && child.geometry instanceof THREE.PlaneGeometry
                && child.material instanceof THREE.MeshBasicMaterial
                && child.material.map instanceof THREE.CanvasTexture) {
                arrows.push(child);
            }
        });
        return arrows;
    };
    const road11AFirstCurve = objects.addRoadCurve(
        firstArcStartX,
        road11AStart.z + road11AFirstRadiusM,
        road11AWidthM,
        road11AFirstRadiusM,
        'white-dashed',
        2,
        -Math.PI / 2,
        road11AFirstSweep,
        road11ATangentSweep,
    );
    const road11AArrowShiftM = 8;
    const road11ACurveArrowShiftAngle = road11AArrowShiftM / road11AFirstRadiusM;
    for (const arrow of road11AAutoArrows(road11AFirstCurve)) {
        const holder = arrow.parent;
        if (holder instanceof THREE.Group) {
            const radiusM = Math.hypot(holder.position.x, holder.position.z);
            const angle = Math.atan2(holder.position.z, holder.position.x)
                + road11ACurveArrowShiftAngle;
            holder.position.set(radiusM * Math.cos(angle), 0, radiusM * Math.sin(angle));
            holder.rotation.y -= road11ACurveArrowShiftAngle;
        }
        arrow.rotateZ(Math.PI);
        // Sau khi đảo chiều chạy, dùng hình gốc rẽ trái để nhánh hiển thị
        // thành rẽ phải theo chiều mới.
        const material = arrow.material as THREE.MeshBasicMaterial;
        material.map?.dispose();
        material.map = createRoadArrowTexture('left');
        material.needsUpdate = true;
    }
    // Vá phần tam giác mặt đường giữa hai mép cũ và cung R5 mới.
    const filletArcStart = Math.PI;
    const filletArcEnd = 3 * Math.PI / 2 + road11ATangentSweep;
    const filletPoint = (angle: number, radiusM: number): [number, number] => [
        road11AFilletCenterX + radiusM * Math.cos(angle),
        road11AFilletCenterZ + radiusM * Math.sin(angle),
    ];
    const road11AFilletOutline: Array<[number, number]> = [
        [road11AStart.x, road11AFilletCenterZ],
        [road11AStart.x, road11AInnerEdgeZ],
        [firstArcStartX, road11AInnerEdgeZ],
    ];
    for (let i = 1; i <= 64; i++) {
        const angle = -Math.PI / 2 + road11ATangentSweep * i / 64;
        road11AFilletOutline.push([
            firstArcStartX + road11AInnerRadiusM * Math.cos(angle),
            road11AArcCenterZ + road11AInnerRadiusM * Math.sin(angle),
        ]);
    }
    for (let i = 63; i >= 0; i--) {
        road11AFilletOutline.push(filletPoint(
            filletArcStart + (filletArcEnd - filletArcStart) * i / 64,
            road11AFilletRadiusM,
        ));
    }
    const road11AFilletShape = (points: Array<[number, number]>) =>
        new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
    const road11AFillet = new THREE.Group();
    road11AFillet.name = 'road-11a-entry-r5-fillet';
    const filletAsphalt = new THREE.Mesh(
        new THREE.ShapeGeometry(road11AFilletShape(road11AFilletOutline)),
        new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95, side: THREE.DoubleSide }),
    );
    filletAsphalt.geometry.rotateX(-Math.PI / 2);
    filletAsphalt.position.y = .061;
    filletAsphalt.receiveShadow = true;
    road11AFillet.add(filletAsphalt);
    // Vùng xương cá bắt đầu ở đầu vạch trắng 6A; nét cong chỉ chạy từ
    // đầu cung 11A tới điểm gặp bó vỉa, thay vì kéo hết cả cung 60°.
    const hatchTip = new THREE.Vector2(road11AStart.x - road11AWidthM, road11AStart.z);
    const hatchCurbStart = new THREE.Vector2(road11AStart.x, road11AFilletCenterZ);
    const hatchCurveStart = new THREE.Vector2(firstArcStartX, road11AStart.z);
    const hatchEndSweep = .6;
    const hatchInnerArcPoint = (sweep: number) => new THREE.Vector2(
        firstArcStartX + road11AInnerRadiusM * Math.sin(sweep),
        road11AArcCenterZ - road11AInnerRadiusM * Math.cos(sweep),
    );
    const hatchCurveEnd = hatchInnerArcPoint(hatchEndSweep);
    const hatchUpperCurve = new THREE.CubicBezierCurve(
        hatchCurveStart,
        new THREE.Vector2(firstArcStartX + 5, road11AStart.z + .25),
        new THREE.Vector2(hatchCurveEnd.x - 3, hatchCurveEnd.y - 3),
        hatchCurveEnd,
    );
    const hatchLeftCurve = new THREE.CubicBezierCurve(
        hatchTip,
        new THREE.Vector2(hatchTip.x + 3, hatchTip.y + 1.5),
        new THREE.Vector2(hatchCurbStart.x, hatchCurbStart.y - 3),
        hatchCurbStart,
    );
    // Bo nhẹ hai đầu nêm; viền trắng và vùng sọc dùng chung đường cong đã bo.
    // Mũi trên rất nhọn nên cần cắt mỗi cạnh dài hơn để cung bo vẫn rộng hơn nét viền.
    const hatchTopRoundTrimM = .9;
    const hatchBaseRoundTrimM = .22;
    const hatchTopTrimT = hatchUpperCurve.getUtoTmapping(
        0, hatchUpperCurve.getLength() - hatchTopRoundTrimM);
    const hatchArcTrimSweep = hatchEndSweep - hatchTopRoundTrimM / road11AInnerRadiusM;
    const roundedHatchTop = new THREE.QuadraticBezierCurve(
        hatchUpperCurve.getPoint(hatchTopTrimT),
        hatchCurveEnd,
        hatchInnerArcPoint(hatchArcTrimSweep),
    );
    const hatchBaseTrim = hatchTip.clone().lerp(hatchCurveStart,
        hatchBaseRoundTrimM / hatchTip.distanceTo(hatchCurveStart));
    const hatchLeftTrimT = hatchLeftCurve.getUtoTmapping(0, hatchBaseRoundTrimM);
    const roundedHatchBase = new THREE.QuadraticBezierCurve(
        hatchLeftCurve.getPoint(hatchLeftTrimT),
        hatchTip,
        hatchBaseTrim,
    );
    const hatchUpperBorderPoints = [
        ...Array.from({ length: 65 }, (_, i) =>
            hatchUpperCurve.getPoint(hatchTopTrimT * i / 64)),
        ...roundedHatchTop.getPoints(8).slice(1),
    ];
    const hatchLeftBorderPoints = [
        ...roundedHatchBase.getPoints(8).reverse(),
        ...Array.from({ length: 64 }, (_, i) =>
            hatchLeftCurve.getPoint(hatchLeftTrimT
                + (1 - hatchLeftTrimT) * (i + 1) / 64)),
    ];
    const hatchOutline: Array<[number, number]> = [
        [hatchBaseTrim.x, hatchBaseTrim.y],
        [hatchCurveStart.x, hatchCurveStart.y],
    ];
    for (const point of hatchUpperBorderPoints.slice(1)) {
        hatchOutline.push([point.x, point.y]);
    }
    for (let i = 62; i >= 0; i--) {
        const angle = -Math.PI / 2
            + (road11ATangentSweep + (hatchArcTrimSweep - road11ATangentSweep) * i / 63);
        hatchOutline.push([
            firstArcStartX + road11AInnerRadiusM * Math.cos(angle),
            road11AArcCenterZ + road11AInnerRadiusM * Math.sin(angle),
        ]);
    }
    for (let i = 63; i >= 0; i--) {
        hatchOutline.push(filletPoint(
            filletArcStart + (filletArcEnd - filletArcStart) * i / 63,
            road11AFilletRadiusM,
        ));
    }
    for (const point of hatchLeftBorderPoints.slice(1, -1).reverse()) {
        hatchOutline.push([point.x, point.y]);
    }
    const filletHatchGeometry = new THREE.ShapeGeometry(road11AFilletShape(hatchOutline));
    filletHatchGeometry.rotateX(-Math.PI / 2);
    const filletHatch = new THREE.Mesh(filletHatchGeometry, new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        depthWrite: false,
        vertexShader: `
            varying vec2 ground;
            void main() {
                vec4 world = modelMatrix * vec4(position, 1.0);
                ground = world.xz;
                gl_Position = projectionMatrix * viewMatrix * world;
            }
        `,
        fragmentShader: `
            varying vec2 ground;
            void main() {
                float stripe = mod((ground.x - ground.y) * 0.70710678, 0.55);
                if (stripe > 0.27) discard;
                gl_FragColor = vec4(1.0);
            }
        `,
    }));
    filletHatch.name = 'road-11a-entry-white-herringbone';
    filletHatch.position.y = .084;
    road11AFillet.add(filletHatch);

    // Hai nét trắng viền phía làn xe và phía đầu nêm; mép còn lại là bó vỉa.
    const hatchBorderMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, side: THREE.DoubleSide,
    });
    for (const [name, points] of [
        ['upper', hatchUpperBorderPoints],
        ['left', hatchLeftBorderPoints],
    ] as const) {
        const halfWidthM = .075;
        const borderSide = (side: number) => points.map((point, i) => {
            const before = points[Math.max(0, i - 1)];
            const after = points[Math.min(points.length - 1, i + 1)];
            const dx = after.x - before.x;
            const dz = after.y - before.y;
            const length = Math.hypot(dx, dz);
            return [point.x - side * dz / length * halfWidthM,
            point.y + side * dx / length * halfWidthM] as [number, number];
        });
        const borderGeometry = new THREE.ShapeGeometry(road11AFilletShape([
            ...borderSide(1), ...borderSide(-1).reverse(),
        ]));
        borderGeometry.rotateX(-Math.PI / 2);
        const border = new THREE.Mesh(borderGeometry, hatchBorderMaterial);
        border.name = `road-11a-entry-white-herringbone-${name}-border`;
        border.position.y = .085;
        road11AFillet.add(border);
    }
    const filletCurbMaterials = [0xffffff, 0xd83b3b].map(color =>
        new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
    const filletStripeCount = Math.ceil(road11AFilletRadiusM * (filletArcEnd - filletArcStart) / .8);
    for (let i = 0; i < filletStripeCount; i++) {
        const from = filletArcStart + (filletArcEnd - filletArcStart) * i / filletStripeCount;
        const to = filletArcStart + (filletArcEnd - filletArcStart) * (i + 1) / filletStripeCount;
        const inside = Array.from({ length: 5 }, (_, j) =>
            filletPoint(from + (to - from) * j / 4, road11AFilletRadiusM));
        const outside = Array.from({ length: 5 }, (_, j) =>
            filletPoint(to - (to - from) * j / 4,
                road11AFilletRadiusM + CURB_VISUAL_WIDTH_M));
        const curb = new THREE.Mesh(
            new THREE.ExtrudeGeometry(road11AFilletShape([...inside, ...outside]), {
                depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
            }),
            filletCurbMaterials[i % 2],
        );
        curb.geometry.rotateX(-Math.PI / 2);
        curb.position.y = .06;
        curb.name = 'red-white-curb';
        curb.castShadow = true;
        road11AFillet.add(curb);
    }
    const fourLaneNorthEdgeZ = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        fourLaneSection.maxX, 0, fourLaneSection.minZ,
    )).z;
    for (let z = road11AFilletCenterZ, stripe = 0; z < fourLaneNorthEdgeZ - .0001; stripe++) {
        const lengthM = Math.min(.8, fourLaneNorthEdgeZ - z);
        const curb = new THREE.Mesh(
            new THREE.BoxGeometry(CURB_VISUAL_WIDTH_M, CURB_VISUAL_HEIGHT_M, lengthM),
            filletCurbMaterials[stripe % 2],
        );
        curb.position.set(road11AStart.x - CURB_VISUAL_WIDTH_M / 2,
            .085, z + lengthM / 2);
        curb.name = 'red-white-curb';
        curb.castShadow = true;
        road11AFillet.add(curb);
        z += lengthM;
    }
    objects.root.add(road11AFillet);
    const road11ADiagonalRoad = objects.addRoad(
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
    for (const arrow of road11AAutoArrows(road11ADiagonalRoad)) {
        arrow.position.z -= road11AArrowShiftM;
        arrow.rotateZ(Math.PI);
    }
    // Hai ray chạy ngang đường, tà vẹt nhô ra hai phía như vạch đường sắt trên CAD.
    // Local +Z của addRoad này hướng về cung thứ nhất; hướng đi tiếp là -Z.
    const railDistanceFromFirstArcM = 12;
    const railGaugeM = 1.45;
    const railPaintWidthM = .18;
    const sleeperLengthM = 2.1;
    const railMarkingWidthM = road11AWidthM - .6;
    const railMarkingMaterial = new THREE.MeshBasicMaterial({ color: 0xf5f5f5 });
    const railMarking = new THREE.Group();
    railMarking.name = 'road-11a-railway-crossing-marking';
    railMarking.position.z = road11ADiagonalM / 2 - railDistanceFromFirstArcM;
    const addRailMark = (widthM: number, lengthM: number, x: number, z: number, y: number) => {
        const mark = new THREE.Mesh(new THREE.PlaneGeometry(widthM, lengthM), railMarkingMaterial);
        mark.rotation.x = -Math.PI / 2;
        mark.position.set(x, y, z);
        railMarking.add(mark);
    };
    const sleeperCount = 9;
    for (let i = 0; i < sleeperCount; i++) {
        const x = -railMarkingWidthM / 2 + .2
            + i * (railMarkingWidthM - .4) / (sleeperCount - 1);
        addRailMark(.32, sleeperLengthM, x, 0, .085);
    }
    for (const z of [-railGaugeM / 2, railGaugeM / 2]) {
        addRailMark(railMarkingWidthM, railPaintWidthM, 0, z, .086);
    }
    road11ADiagonalRoad.add(railMarking);

    // Đo 5 m từ mép ray phía trước đến mép gần của vạch trắng.
    const whiteLineGapFromRailsM = 5;
    const whiteLineThicknessM = .2;
    const railwayStopLine = new THREE.Mesh(
        new THREE.PlaneGeometry(road11AWidthM - .4, whiteLineThicknessM),
        railMarkingMaterial,
    );
    railwayStopLine.name = 'road-11a-railway-white-line';
    railwayStopLine.rotation.x = -Math.PI / 2;
    railwayStopLine.position.set(0, .085,
        railMarking.position.z - railGaugeM / 2 - railPaintWidthM / 2
        - whiteLineGapFromRailsM - whiteLineThicknessM / 2);
    road11ADiagonalRoad.add(railwayStopLine);
    // Biển 211 / 242 / 122 ở lề phải, tiến gần vạch trắng và cách vạch 1,5 m.
    road11ADiagonalRoad.add(new StackedRailwayStopSign(
        -road11AWidthM / 2 - .75,
        railwayStopLine.position.z - 1.5,
    ).root);
    const road11ASecondCurve = objects.addRoadCurve(
        secondArcStartX - road11ASecondRadiusM * Math.sin(road11AFirstSweep),
        secondArcStartZ + road11ASecondRadiusM * Math.cos(road11AFirstSweep),
        road11AWidthM,
        road11ASecondRadiusM,
        'white-dashed',
        2,
        -Math.PI / 2 - road11AFirstSweep,
        road11ASecondSweep,
    );
    for (const arrow of road11AAutoArrows(road11ASecondCurve)) {
        const arrowGroup = arrow.parent;
        arrow.removeFromParent();
        arrow.geometry.dispose();
        const material = arrow.material as THREE.MeshBasicMaterial;
        material.map?.dispose();
        material.dispose();
        if (arrowGroup?.children.length === 0) arrowGroup.removeFromParent();
    }

    // Số làn trên các đoạn thẳng và cung cong của đường xe lửa 11A.
    if (showRoadLaneNumbers) {
        const addRailwayLaneNumber = (parent: THREE.Group, lane: number,
            x: number, z: number, rotationY = 0) => {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 128;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 88px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(lane), 64, 64);
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 8;
            const label = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1),
                new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
            label.name = `lane-number-${lane}`;
            label.rotation.x = -Math.PI / 2;
            label.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationY);
            label.position.set(x, .095, z);
            parent.add(label);
        };
        for (const [lane, laneX] of [[1, road11AWidthM / 4], [2, -road11AWidthM / 4]]) {
            addRailwayLaneNumber(road11ALead, lane, laneX, 0);
            addRailwayLaneNumber(road11ADiagonalRoad, lane, laneX, -road11ADiagonalM / 4);
            addRailwayLaneNumber(road11AEndRoad, lane, laneX, 0);
            for (const [curve, radius, sweep] of [
                [road11AFirstCurve, road11AFirstRadiusM, road11AFirstSweep],
                [road11ASecondCurve, road11ASecondRadiusM, road11ASecondSweep],
            ] as const) {
                const angle = Math.PI + sweep / 2;
                const laneRadius = radius - laneX;
                addRailwayLaneNumber(curve, lane,
                    laneRadius * Math.cos(angle), laneRadius * Math.sin(angle), -sweep / 2);
            }
        }
    }

    // 3 làn × 3.70 m, cùng bề rộng làn với addFourLaneBidirectionalRoad().
    //hướng bắc 1
    const threeLaneRoadStartX = eastJunctionRoadX + eastJunctionRoadLengthM / 2;
    const threeLaneRoadEndX = 76 + 60 / 2;
    const threeLaneRoadZ = eastJunctionRoadZ - eastJunctionLaneWidthM / 2;
    const threeLaneRoadWidthM = 3 * eastJunctionLaneWidthM;
    const threeLaneRoad = objects.addRoad(
        (threeLaneRoadStartX + threeLaneRoadEndX) / 2,
        threeLaneRoadZ,
        threeLaneRoadWidthM,
        threeLaneRoadEndX - threeLaneRoadStartX,
        'horizontal', 'straight', ['white-dashed', 'yellow-solid'], 3,
    );
    // Các làn đánh số từ trái sang phải: chỉ giữ mũi tên ở làn 3.
    for (const arrow of [...threeLaneRoad.children]) {
        if (!(arrow instanceof THREE.Mesh) || !(arrow.geometry instanceof THREE.PlaneGeometry)
            || arrow.position.x > 0) continue;
        arrow.removeFromParent();
        arrow.geometry.dispose();
        const material = arrow.material as THREE.MeshBasicMaterial;
        material.map?.dispose();
        material.dispose();
    }
    const threeLaneRoadSouthEdgeZ = threeLaneRoadZ - threeLaneRoadWidthM / 2;
    // Cùng một mốc X tại tiếp tuyến của góc curb R4: vạch trắng đứt bên trái
    // bắt đầu tại đây rồi kéo về phía -X; vạch vàng chuyển sang cung trắng đứt.
    const road11AWestEdgeX = road11AEndX - road11AWidthM / 2;
    const junctionCornerRadiusM = 4;
    const markingTransitionX = road11AWestEdgeX - junctionCornerRadiusM;
    // Làn ngoài cùng bên phải, giữa vạch vàng và mép đường: đặt mũi tên
    // rẽ trái cùng kiểu lối ra bài 05 gần điểm chuyển sang cung trắng đứt.
    const outerRightLeftTurnArrow = objects.addDiagonalTurnRoadArrow(
        markingTransitionX + 1,
        threeLaneRoadZ + eastJunctionLaneWidthM,
        eastJunctionLaneWidthM,
        threeLaneRoadEndX - threeLaneRoadStartX,
        'left', false, -Math.PI / 2,
    );
    outerRightLeftTurnArrow.name = 'exam-05-outer-right-left-turn-arrow';
    const whiteSeparatorLocalX = -threeLaneRoadWidthM / 6;
    for (const child of [...threeLaneRoad.children]) {
        if (!(child instanceof THREE.Mesh) || child.name !== 'road-center-line'
            || Math.abs(child.position.x - whiteSeparatorLocalX) > .001) continue;
        child.geometry.computeBoundingBox();
        const box = child.geometry.boundingBox!;
        const lengthM = box.max.z - box.min.z;
        const dashMinX = threeLaneRoad.position.x - child.position.z - lengthM / 2;
        const dashMaxX = dashMinX + lengthM;
        if (dashMinX >= markingTransitionX) {
            child.removeFromParent();
            child.geometry.dispose();
        } else if (dashMaxX > markingTransitionX) {
            const trimM = dashMaxX - markingTransitionX;
            child.geometry.dispose();
            child.geometry = new THREE.BoxGeometry(.15, .008, lengthM - trimM);
            child.position.z += trimM / 2;
        }
    }

    // Cung trắng bắt đầu đúng tại mốc trên và gặp vạch tim đứt của 11A.
    const yellowLineZ = threeLaneRoadZ + threeLaneRoadWidthM / 6;
    const turnCurveTangentX = markingTransitionX;
    const turnCurveRadiusM = road11AEndX - turnCurveTangentX;
    const turnCurveEndZ = yellowLineZ - turnCurveRadiusM;
    const yellowStraightLine = threeLaneRoad.children.find((child): child is THREE.Mesh =>
        child instanceof THREE.Mesh && child.name === 'road-center-line'
        && Math.abs(child.position.x - threeLaneRoadWidthM / 6) < .001);
    if (!yellowStraightLine) throw new Error('Three-lane yellow center line is missing');
    const yellowStraightLengthM = turnCurveTangentX - threeLaneRoadStartX;
    yellowStraightLine.geometry.dispose();
    yellowStraightLine.geometry = new THREE.BoxGeometry(.15, .008, yellowStraightLengthM);
    yellowStraightLine.position.z += (threeLaneRoadEndX - turnCurveTangentX) / 2;

    const turnCurvePoint = (angle: number, radiusM: number) => new THREE.Vector2(
        turnCurveTangentX + radiusM * Math.cos(angle),
        -(turnCurveEndZ + radiusM * Math.sin(angle)),
    );
    const curveLengthM = turnCurveRadiusM * Math.PI / 2;
    const dashCount = Math.max(1, Math.ceil(curveLengthM / 2.5));
    const dashLengthM = Math.min(1.5, curveLengthM / dashCount);
    const dashGapM = dashCount > 1 ? (curveLengthM - dashCount * dashLengthM) / (dashCount - 1) : 0;
    const halfLineWidthM = .15 / 2;
    const whiteDashMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 });
    for (let dashIndex = 0; dashIndex < dashCount; dashIndex++) {
        const startAngle = Math.PI / 2 - dashIndex * (dashLengthM + dashGapM) / turnCurveRadiusM;
        const endAngle = startAngle - dashLengthM / turnCurveRadiusM;
        const dashShape = new THREE.Shape();
        for (let i = 0; i <= 12; i++) {
            const angle = startAngle + (endAngle - startAngle) * i / 12;
            const point = turnCurvePoint(angle, turnCurveRadiusM + halfLineWidthM);
            if (i === 0) dashShape.moveTo(point.x, point.y);
            else dashShape.lineTo(point.x, point.y);
        }
        for (let i = 0; i <= 12; i++) {
            const angle = endAngle + (startAngle - endAngle) * i / 12;
            const point = turnCurvePoint(angle, turnCurveRadiusM - halfLineWidthM);
            dashShape.lineTo(point.x, point.y);
        }
        dashShape.closePath();
        const dashGeometry = new THREE.ShapeGeometry(dashShape);
        dashGeometry.rotateX(-Math.PI / 2);
        const dash = new THREE.Mesh(dashGeometry, whiteDashMaterial);
        dash.name = 'road-center-line-white-11a-curve';
        dash.position.y = .072;
        dash.receiveShadow = true;
        objects.root.add(dash);
    }
    // Bo R4 tại góc tây-nam nơi đường 3 làn gặp mép trái đường dọc 11A (2 làn).
    // Lấy giao điểm từ hai mép đường để cung tiếp tuyến với cả hai curb thẳng.
    objects.addRoadJunctionCorner(
        road11AWestEdgeX, threeLaneRoadSouthEdgeZ, junctionCornerRadiusM, 'west', 'south', 0, .10,
    );

    // Khép dải đảo hẹp cạnh lối vào hạng E tới mép ngoài đường ngang.
    const eIslandSouthZ = threeLaneRoadZ + threeLaneRoadWidthM / 2;
    const eIslandNorthZ = course4.entryWorld.z - course4.roadWidthM / 2;
    const eIslandStartX = course4.entryWorld.x;
    const eIslandEndX = road11AEndX + road11AWidthM / 2;
    const eIslandClosure = new THREE.Group();
    eIslandClosure.name = 'exam-04-e-island-closure';
    objects.root.add(eIslandClosure);
    const islandCurbMaterials = [0xffffff, 0xd83b3b].map(color =>
        new THREE.MeshStandardMaterial({ color, roughness: .85 }));
    // Đặt tâm hai dải curb trùng tâm các curb thẳng ở mép đường 3 làn và chuồng E.
    for (const edgeZ of [eIslandSouthZ - CURB_VISUAL_WIDTH_M / 2,
    eIslandNorthZ - CURB_VISUAL_WIDTH_M / 2]) {
        for (let x = eIslandStartX, stripe = 0; x < eIslandEndX - .0001; stripe++) {
            const lengthM = Math.min(.8, eIslandEndX - x);
            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(lengthM, CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M),
                islandCurbMaterials[stripe % 2],
            );
            curb.name = 'red-white-curb';
            curb.position.set(x + lengthM / 2, .085, edgeZ);
            curb.castShadow = true;
            curb.receiveShadow = true;
            eIslandClosure.add(curb);
            x += lengthM;
        }
    }
    const hatchSouthZ = eIslandSouthZ + .2;
    const hatchNorthZ = eIslandNorthZ - .2;
    const hatchSlantM = (hatchNorthZ - hatchSouthZ) * .8;
    const hatchWidthM = .24;
    const hatchMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, roughness: .85, side: THREE.DoubleSide,
    });
    for (let x = eIslandStartX + .4; x + hatchSlantM + hatchWidthM < eIslandEndX - .3; x += 1.2) {
        const hatch = new THREE.Shape([
            new THREE.Vector2(x, -hatchSouthZ),
            new THREE.Vector2(x + hatchWidthM, -hatchSouthZ),
            new THREE.Vector2(x + hatchSlantM + hatchWidthM, -hatchNorthZ),
            new THREE.Vector2(x + hatchSlantM, -hatchNorthZ),
        ]);
        const geometry = new THREE.ShapeGeometry(hatch);
        geometry.rotateX(-Math.PI / 2);
        const stripe = new THREE.Mesh(geometry, hatchMaterial);
        stripe.name = 'exam-04-e-island-hatch';
        stripe.position.y = .072;
        stripe.receiveShadow = true;
        eIslandClosure.add(stripe);
    }

    // Xóa vạch tim trong cả hai vùng hai bên dải gạch chéo: từ điểm cung 11A
    // nhập vào đường ngang tới mép xa của lối vào hạng E.
    const centerLineCutEndZ = course4.entryWorld.z + course4.roadWidthM / 2;
    for (const road of [road11AEndRoad, wheelTrackApproachRoad]) {
        road.updateWorldMatrix(true, false);
        const cutLocalZ = [turnCurveEndZ, centerLineCutEndZ].map(z =>
            road.worldToLocal(new THREE.Vector3(road11AEndX, 0, z)).z);
        const cutMinZ = Math.min(...cutLocalZ);
        const cutMaxZ = Math.max(...cutLocalZ);
        for (const child of [...road.children]) {
            if (!(child instanceof THREE.Mesh) || child.name !== 'road-center-line') continue;
            child.geometry.computeBoundingBox();
            const box = child.geometry.boundingBox!;
            const from = child.position.z + box.min.z;
            const to = child.position.z + box.max.z;
            if (to <= cutMinZ || from >= cutMaxZ) continue;
            const pieces = [[from, Math.min(to, cutMinZ)], [Math.max(from, cutMaxZ), to]];
            for (const [start, end] of pieces) {
                if (end - start < .0001) continue;
                const line = new THREE.Mesh(new THREE.BoxGeometry(.15, .008, end - start), child.material);
                line.name = child.name;
                line.position.set(child.position.x, child.position.y, (start + end) / 2);
                line.receiveShadow = child.receiveShadow;
                road.add(line);
            }
            child.removeFromParent();
            child.geometry.dispose();
        }
    }

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
    const windingCourseB = objects.addWindingCourse({
        x: 33.5, z: -89.85, entryLength: 32.05, exitLength: 6, vehicleClass: 'B', withArrows: false,
    });
    const bEntryLeftX = windingCourseB.course.root.position.x - windingCourseB.course.width / 2;
    const bEntryRightX = windingCourseB.course.root.position.x + windingCourseB.course.width / 2;
    const sixALastSection = sixAFourLaneRoad.footprints[sixAFourLaneRoad.footprints.length - 1];
    const sixAPreviousSection = sixAFourLaneRoad.footprints[sixAFourLaneRoad.footprints.length - 2];
    sixAFourLaneRoad.root.updateMatrixWorld(true);
    const sixANorthEdgeZ = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        sixALastSection.maxX, 0, sixALastSection.maxZ,
    )).z;
    const sixAFiveLaneNorthEdgeZ = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        sixAPreviousSection.maxX, 0, sixAPreviousSection.maxZ,
    )).z;
    // Cửa vào chuồng S hạng B: trái bo R3 với section 6 làn,
    // phải bo R2,5 với section 5 làn lùi 3,7 m.
    objects.addRoadJunctionCorner(bEntryLeftX, sixANorthEdgeZ, 3, 'west', 'north');
    objects.addRoadJunctionCorner(bEntryRightX, sixAFiveLaneNorthEdgeZ, 2.5, 'east', 'north');

    // Trong góc nhìn dọc lối ra B, đầu đảo bên trái ảnh là mép +X của đường
    // 3 làn (R2); đầu đảo bên phải ảnh là mép -X của đường 2 làn (R5).
    windingCourseB.course.root.updateWorldMatrix(true, false);
    const bExitWorld = windingCourseB.course.root.localToWorld(windingCourseB.course.exit.clone());
    const bExitLeftX = bExitWorld.x - windingCourseB.course.width / 2;
    const bOuterArcCenter = windingCourseB.course.root.localToWorld(
        windingCourseB.course.arcCenters[1].clone());
    const bOuterCurbRadiusM = windingCourseB.course.outerRadius + windingCourseB.course.curbWidthM;
    const bLeftCornerRadiusM = 2;
    const bLeftCornerCenterZ = threeLaneRoadSouthEdgeZ - bLeftCornerRadiusM;
    const bCenterDeltaZ = bLeftCornerCenterZ - bOuterArcCenter.z;
    const bTangentCenterDistanceM = bOuterCurbRadiusM + bLeftCornerRadiusM;
    const bLeftCornerCenterX = bOuterArcCenter.x + Math.sqrt(
        bTangentCenterDistanceM ** 2 - bCenterDeltaZ ** 2);
    const bLeftCornerCenter = new THREE.Vector3(bLeftCornerCenterX, 0, bLeftCornerCenterZ);
    const bOuterCurbTangent = bOuterArcCenter.clone().addScaledVector(
        bLeftCornerCenter.clone().sub(bOuterArcCenter).normalize(), bOuterCurbRadiusM);
    objects.addRoadJunctionCorner(
        bLeftCornerCenterX - bLeftCornerRadiusM, threeLaneRoadSouthEdgeZ,
        bLeftCornerRadiusM, 'east', 'south', 0, .10);
    windingCourseB.course.trimExitOuterCurbAtWorldPoint(bOuterCurbTangent);
    objects.addRoadJunctionCorner(bExitLeftX, eastJunctionSouthZ, 5, 'west', 'south', 0, .10);

    // Hạng C — THACO OLLIN450A (b = 2.240 m → width = 4.928 m)
    const windingCourseC = objects.addWindingCourse({
        x: 43.5, z: -93.55, entryLength: 25.05, exitLength: 10, vehicleClass: 'C', withArrows: false,
    });
    const cEntryLeftX = windingCourseC.course.root.position.x - windingCourseC.course.width / 2;
    const cEntryRightX = windingCourseC.course.root.position.x + windingCourseC.course.width / 2;
    const cRightCornerRadiusM = .8;
    objects.addRoadJunctionCorner(cEntryLeftX, sixAFiveLaneNorthEdgeZ, 2.5, 'west', 'north');
    objects.addRoadJunctionCorner(cEntryRightX, sixAFiveLaneNorthEdgeZ, cRightCornerRadiusM, 'east', 'north');
    // Lối ra C1 nhìn theo hướng xe chạy: trái (+X) bo R3, phải (-X) bo R7.
    windingCourseC.course.root.updateWorldMatrix(true, false);
    const cExitWorld = windingCourseC.course.root.localToWorld(windingCourseC.course.exit.clone());
    const cExitWestX = cExitWorld.x - windingCourseC.course.width / 2;
    const cExitEastX = cExitWorld.x + windingCourseC.course.width / 2;
    objects.addRoadJunctionCorner(cExitEastX, threeLaneRoadSouthEdgeZ, 3, 'east', 'south', 0, .10);
    objects.addRoadJunctionCorner(cExitWestX, threeLaneRoadSouthEdgeZ, 7, 'west', 'south', 0, .10);
    const eExitConnector = objects.addRoadStraight955({
        // Đặt mép gần của thanh chạm mép ngoài curb cong cuối chuồng E:
        // local X = depth E + physical offset + curb width + nửa bề rộng thanh.
        x: 80.4,
        z: -59,
        widthM: 5.90,
        lengthM: 20
        ,
        curbWidthM: 0.10,
        curbPlacement: 'inside',
        rotationY: Math.PI / 2,
        showDebug: false,
        highlight: false,
        showEdges: true,
    });
    // Lối ra E nhìn theo hướng xe chạy: bên trái (+X) R1, bên phải (-X) R4.
    // Lấy mép từ chính connector để các cung bo nối đúng curb đang hiển thị.
    eExitConnector.root.updateWorldMatrix(true, false);
    const eExitHalfWidthM = eExitConnector.geometry.widthM / 2;
    const eExitLeftX = eExitConnector.root.localToWorld(
        new THREE.Vector3(0, 0, eExitHalfWidthM)).x;
    const eExitRightX = eExitConnector.root.localToWorld(
        new THREE.Vector3(0, 0, -eExitHalfWidthM)).x;
    objects.addRoadJunctionCorner(
        eExitLeftX, threeLaneRoadSouthEdgeZ, 1, 'east', 'south', 0, .10);
    objects.addRoadJunctionCorner(
        eExitRightX, threeLaneRoadSouthEdgeZ, 4, 'west', 'south', 0, .10);

    // Hạng E — COUTY HD29 E3 (b = 2.080 m → width = 4.576 m)
    const windingCourseE = objects.addWindingCourse({
        x: 53.4,
        z: -82.4,
        entryLength: 0,
        exitLength: 0,
        vehicleClass: 'E',
        withArrows: false,
        rotationY: Math.PI / 2 + THREE.MathUtils.degToRad(-2),
    });

    // Lối vào E rộng 5,90 m: mép trái nối đảo C/E, mép phải bo R4 vào đảo E/D.
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
    const sixAFourLaneSection = sixAFourLaneRoad.footprints[0];
    const sixAFourLaneEdgeZ = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        sixAFourLaneSection.maxX, 0, sixAFourLaneSection.maxZ,
    )).z;
    const sixAFiveLaneEdgeZ = sixAFiveLaneNorthEdgeZ;
    // Độ vát cạnh connector, độc lập với bán kính bo 0,2 m ở góc đảo.
    const eLowerSideTaperM = 2;
    const eSidePointAtZ = (side: number, z: number) => {
        const start = eEntryPoint.clone().addScaledVector(eEntryLateral, side * eConnectorWidthM / 2);
        return start.addScaledVector(eEntryDirection, (start.z - z) / Math.sin(eEntryRotationY));
    };
    const eLowerStart = eEntryPoint.clone().addScaledVector(eEntryLateral, -eConnectorWidthM / 2);
    const eLowerAtFiveLaneEdge = eSidePointAtZ(-1, sixAFiveLaneEdgeZ);
    eLowerAtFiveLaneEdge.x -= eLowerSideTaperM;
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
    const eLeftCornerRadiusM = .2;
    const eLeftCorner = objects.addAngledRoadJunctionCorner(
        eLowerAtFiveLaneEdge, eLowerStart, eLeftCornerRadiusM, 'west',
    );
    const eUpperStart = eEntryPoint.clone().addScaledVector(eEntryLateral, eConnectorWidthM / 2);
    const eRightCorner = objects.addAngledRoadJunctionCorner(
        eSidePointAtZ(1, sixAFourLaneEdgeZ), eUpperStart, 4, 'east',
    );
    const sixAFiveLaneEndX = sixAFourLaneRoad.root.localToWorld(new THREE.Vector3(
        0, 0, sixAPreviousSection.minZ,
    )).x;
    objects.connectRoadJunctionCurbs(
        cEntryRightX + cRightCornerRadiusM,
        eLeftCorner.horizontalTangent.x,
        sixAFiveLaneEdgeZ,
        sixAFiveLaneEndX,
    );
    // C và E dùng chung một đảo cỏ. Lấp phần giữa hai curb bo và đoạn curb nối,
    // theo đúng biên cong để không phủ lên mặt đường ở hai bên.
    const cRightCornerCenterX = cEntryRightX + cRightCornerRadiusM;
    const cRightCornerCenterZ = sixAFiveLaneEdgeZ + cRightCornerRadiusM;
    const eLeftCornerCenterX = eLeftCorner.horizontalTangent.x;
    const eLeftCornerCenterZ = sixAFiveLaneEdgeZ + eLeftCornerRadiusM;
    const eLeftSideAngle = Math.atan2(
        eLeftCorner.sideTangent.z - eLeftCornerCenterZ,
        eLeftCorner.sideTangent.x - eLeftCornerCenterX,
    );
    const cEIslandOutline: Array<[number, number]> = [
        [cRightCornerCenterX, sixAFiveLaneEdgeZ],
        [eLeftCornerCenterX, sixAFiveLaneEdgeZ],
    ];
    for (let i = 1; i <= 32; i++) {
        const angle = -Math.PI / 2 + (eLeftSideAngle + Math.PI / 2) * i / 32;
        cEIslandOutline.push([
            eLeftCornerCenterX + eLeftCornerRadiusM * Math.cos(angle),
            eLeftCornerCenterZ + eLeftCornerRadiusM * Math.sin(angle),
        ]);
    }
    cEIslandOutline.push([eLowerStart.x, eLowerStart.z]);
    cEIslandOutline.push([cEntryRightX, eLowerStart.z]);
    cEIslandOutline.push([cEntryRightX, cRightCornerCenterZ]);
    for (let i = 1; i <= 32; i++) {
        const angle = Math.PI + Math.PI / 2 * i / 32;
        cEIslandOutline.push([
            cRightCornerCenterX + cRightCornerRadiusM * Math.cos(angle),
            cRightCornerCenterZ + cRightCornerRadiusM * Math.sin(angle),
        ]);
    }
    const cEIsland = new THREE.Mesh(
        new THREE.ShapeGeometry(new THREE.Shape(cEIslandOutline.map(
            ([x, z]) => new THREE.Vector2(x, -z),
        ))),
        new THREE.MeshStandardMaterial({
            map: createGrassSurfaceTexture(), roughness: 1, side: THREE.DoubleSide,
        }),
    );
    cEIsland.geometry.rotateX(-Math.PI / 2);
    cEIsland.position.y = .061;
    cEIsland.name = 'exam-6-c-e-shared-island';
    cEIsland.receiveShadow = true;
    objects.root.add(cEIsland);
    objects.addRoadStraight955({
        x: eConnectorCenter.x,
        z: eConnectorCenter.z,
        widthM: eConnectorWidthM,
        lengthM: eConnectorLengthM,
        endLowerWidthM: eConnectorEndLowerWidthM,
        upperLengthM: eConnectorUpperLengthM,
        lowerLengthM: eConnectorLowerLengthM,
        lowerCurbLengthM: eLeftCorner.sideTangent.clone().sub(eLowerStart).dot(eEntryDirection),
        upperCurbLengthM: eRightCorner.sideTangent.clone().sub(eUpperStart).dot(eEntryDirection),
        curbWidthM: CURB_VISUAL_WIDTH_M,
        curbPlacement: 'inside',
        rotationY: eEntryRotationY,
        showDebug: false,
        highlight: false,
        showEdges: true,
    });
    // Hạng D — COUTY HD29 E3 (b = 2.080 m → width = 4.576 m)
    const dRotationY = Math.PI / 2;
    const windingCourseD = objects.addWindingCourse({
        x: 65.5 + 1.5,
        z: -91,
        entryLength: 0,
        exitLength: 0,
        vehicleClass: 'D',
        withArrows: false,
        rotationY: Math.PI / 2 + THREE.MathUtils.degToRad(8),
    });
    const dRoadRotationY = dRotationY - Math.PI / 2;
    const dEntryPoint = windingCourseD.course.root.position.clone();
    // Đầu gần chuồng lấy đúng hai mép của S đang xoay 8°; đầu xa nằm trong
    // mặt đường 6A một đoạn ngắn để không hở đường tại đường nối.
    const dEntryHalfEnvelopeM = windingCourseD.course.envelopeWidth / 2;
    const dCourseRotationY = windingCourseD.course.root.rotation.y;
    const dEntryStartUpperWidthM = dEntryHalfEnvelopeM * Math.sin(dCourseRotationY);
    const dEntryStartLowerWidthM = dEntryStartUpperWidthM;
    const dEntryUpperStartZ = dEntryPoint.z + dEntryHalfEnvelopeM * Math.cos(dCourseRotationY);
    const dEntryLowerStartZ = dEntryPoint.z - dEntryHalfEnvelopeM * Math.cos(dCourseRotationY);
    const dEntryStartUpperOffsetM = dEntryLowerStartZ - dEntryUpperStartZ;
    const dEntryJoinOverlapM = .2;
    const dEntryEndZ = sixAFourLaneEdgeZ - dEntryJoinOverlapM;
    const dEntryUpperLengthM = dEntryLowerStartZ - dEntryEndZ;
    const dEntryLowerLengthM = dEntryUpperLengthM;
    // Bề rộng hai mép tại đầu nối 6A:
    const dEntryEndUpperWidthM = 2.488; // góc trên, phía ngoài
    const dEntryEndLowerWidthM = 2.9; // góc dưới, phía ngoài
    const dEntryLengthM = Math.max(dEntryUpperLengthM, dEntryLowerLengthM);
    const dLowerStart = new THREE.Vector3(
        dEntryPoint.x - dEntryStartLowerWidthM, 0, dEntryLowerStartZ,
    );
    const dLowerAtSixAEdgeX = THREE.MathUtils.lerp(
        dLowerStart.x,
        dEntryPoint.x - dEntryEndLowerWidthM,
        (sixAFourLaneEdgeZ - dEntryLowerStartZ) / (dEntryEndZ - dEntryLowerStartZ),
    );
    const dLeftCorner = objects.addAngledRoadJunctionCorner(
        new THREE.Vector3(dLowerAtSixAEdgeX, 0, sixAFourLaneEdgeZ),
        dLowerStart, 2, 'west',
    );
    objects.addRoadStraight955({
        x: dEntryPoint.x,
        z: (dEntryLowerStartZ + dEntryEndZ) / 2,
        widthM: windingCourseD.course.envelopeWidth,
        lengthM: dEntryLengthM,
        startUpperWidthM: dEntryStartUpperWidthM,
        startLowerWidthM: dEntryStartLowerWidthM,
        endUpperWidthM: dEntryEndUpperWidthM,
        endLowerWidthM: dEntryEndLowerWidthM,
        upperLengthM: dEntryUpperLengthM,
        lowerLengthM: dEntryLowerLengthM,
        startUpperOffsetM: dEntryStartUpperOffsetM,
        lowerCurbLengthM: dEntryLowerStartZ - dLeftCorner.sideTangent.z,
        curbWidthM: 0.10,
        curbPlacement: 'inside',
        rotationY: dRotationY,
        showDebug: false,
        highlight: false,
        showEdges: true,
    });
    objects.connectRoadJunctionCurbs(
        eRightCorner.horizontalTangent.x,
        dLeftCorner.horizontalTangent.x,
        sixAFourLaneEdgeZ,
        // Mở trọn miệng D để không còn mẩu curb 6A giữa góc R2 và connector.
        dEntryPoint.x + dEntryEndUpperWidthM,
    );

    // Vạch đứt cách vạch vàng đầu chữ S 2 m về phía đường vào.
    for (const { course } of [windingCourseB, windingCourseC, windingCourseE, windingCourseD]) {
        course.addEntryApproachYellowDashedGate(2);
    }

    // Mũi tên rẽ phải tại lối ra từng chuồng S. offsetZM dịch mũi tên theo trục Z thế giới.
    const sCourseExitArrowPlacements = [
        { vehicleClass: 'B', entry: windingCourseB, offsetZM: 1 },
        { vehicleClass: 'C', entry: windingCourseC, offsetZM: 2 },
        { vehicleClass: 'E', entry: windingCourseE, offsetZM: 16 },
        { vehicleClass: 'D', entry: windingCourseD, offsetZM: 32 },
    ] as const;
    const sCourseExitArrowBranchAngleRad = THREE.MathUtils.degToRad(20);
    for (const { vehicleClass, entry, offsetZM } of sCourseExitArrowPlacements) {
        const { course } = entry;
        const courseRotationY = course.root.rotation.y;
        const exitWorld = course.exit.clone().applyMatrix4(course.root.matrix);
        const exitDirection = new THREE.Vector3(-Math.cos(courseRotationY), 0, Math.sin(courseRotationY));
        const arrowCenter = exitWorld.addScaledVector(exitDirection, Math.max(entry._exitLength / 2, 1.5));
        arrowCenter.z += offsetZM;
        const arrow = objects.addDiagonalTurnRoadArrow(
            arrowCenter.x,
            arrowCenter.z,
            course.width,
            10,
            'right',
            false,
            vehicleClass === 'D' ? Math.PI : courseRotationY + Math.PI / 2,
            false,
            sCourseExitArrowBranchAngleRad,
        );
        arrow.name = `EX06_${vehicleClass}_S_COURSE_EXIT_RIGHT_ARROW`;
    }

    // Biển chuồng chữ S nằm trên bốn đảo cỏ ở lối vào B, C, E, D.
    // Chỉ biển chữ S: bảng hạng xe hướng -X (về bên phải trong góc nhìn này),
    // tam giác W.202a hướng -Z. Biển chuồng vuông góc giữ góc mặc định.
    const sCourseSignOptions = {
        namePrefix: 'EX06',
        boardRotationY: -Math.PI / 2,
        warningRotationY: Math.PI,
    } as const;
    const sCourseSignPositions = [
        {
            vehicleClass: 'B',
            x: (southRoadX + southRoadWidthM / 2 + bEntryLeftX + 3.5) / 2,
            z: sixANorthEdgeZ + 2.9,
        },
        {
            vehicleClass: 'C',
            x: (bEntryRightX + cEntryLeftX) / 2 + 1.5,
            z: sixAFiveLaneNorthEdgeZ + 2.5,
        },
        {
            vehicleClass: 'E',
            x: (cEntryRightX + eLowerAtFiveLaneEdge.x) / 2 + 0.5,
            z: sixAFiveLaneEdgeZ + 1,
        },
        {
            vehicleClass: 'D',
            x: (eSidePointAtZ(1, sixAFourLaneEdgeZ).x + dEntryPoint.x - dEntryEndLowerWidthM) / 2 + 2,
            z: sixAFourLaneEdgeZ + 1
            ,
        },
    ] as const;
    for (const { vehicleClass, x, z } of sCourseSignPositions) {
        const signOptions = vehicleClass === 'C'
            ? { ...sCourseSignOptions, boardClassLabel: 'C1' }
            : sCourseSignOptions;
        objects.root.add(new WindingCourseClassSign(x, z, vehicleClass, signOptions).root);
    }

    // Chữ vàng ở đầu đường vào từng chuồng S, đầu chữ hướng +X để đứng thẳng trong góc nhìn dọc đường 6A.
    const sCourseEntryLabelInsetM = 2.3;
    const sCourseEntryLabels = [
        { letter: 'B', x: (bEntryLeftX + bEntryRightX) / 2 - 0.8, z: sixANorthEdgeZ + sCourseEntryLabelInsetM - 5 },
        { letter: 'C1', x: (cEntryLeftX + cEntryRightX) / 2, z: sixAFiveLaneNorthEdgeZ + sCourseEntryLabelInsetM - 2 },
        {
            letter: 'E', x: eSidePointAtZ(0, sixAFiveLaneEdgeZ + sCourseEntryLabelInsetM).x - 1,
            z: sixAFiveLaneEdgeZ + sCourseEntryLabelInsetM - 3
        },
        { letter: 'D', x: dEntryPoint.x, z: sixAFourLaneEdgeZ + sCourseEntryLabelInsetM - 5 },
    ] as const;
    for (const { letter, x, z } of sCourseEntryLabels) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#f6d34c';
        context.font = 'bold 200px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(letter, 128, 136, 224);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
        );
        label.rotation.x = -Math.PI / 2;
        label.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
        label.position.set(x, .09, z);
        label.name = `EX06_ENTRY_LABEL_${letter}`;
        objects.root.add(label);
    }

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
    const dExitConnector = objects.addRoadStraight955({
        x: dExitCenterX + 1.5,
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
    // Lối ra D nhìn theo hướng xe chạy: trái (+X) R5, phải (-X) R1.
    dExitConnector.root.updateWorldMatrix(true, false);
    const dExitLeftX = dExitConnector.root.localToWorld(
        new THREE.Vector3(0, 0, -dExitEndLowerWidthM)).x;
    const dExitRightX = dExitConnector.root.localToWorld(
        new THREE.Vector3(0, 0, dExitEndUpperWidthM)).x;
    objects.addRoadJunctionCorner(
        dExitLeftX, threeLaneRoadSouthEdgeZ, 5, 'east', 'south', 0, .10);
    objects.addRoadJunctionCorner(
        dExitRightX, threeLaneRoadSouthEdgeZ, 1, 'west', 'south', 0, .10);

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
    // Mỗi mục điều khiển riêng một cặp mũi tên ở làn 3 và 4.
    // arrowX/arrowShiftZM là tọa độ riêng của mũi tên, không dịch chuyển chuồng B.
    const westBayLengthM = PARKING_BAY_SIZES.B.parkingLengthM;
    const westBay1X = -6.5;
    const westBayGap12M = 7.9;
    const westBayGap23M = 8.39;
    const westBay2X = westBay1X - westBayLengthM - westBayGap12M;
    const westBay3X = westBay2X - westBayLengthM - westBayGap23M;
    const westBayRoadEdgeZ = westJunctionRoad.root.position.z + westJunctionRoad.widthM / 2;
    const westBayEntranceMarkings = {
        examBoundaryWidthM: .05,
        examBoundaryStartM: 0,
        yellowDashedEntrance: true,
        joinRoadCurb: true,
    } as const;
    const westParallelParkingBays = [
        {
            bay: objects.addParallelParkingBayB({
                x: westBay1X, z: westBayRoadEdgeZ, rotationY: -Math.PI / 2,
                cornerRadiusM: 0.3, vehicleClass: 'B',
                ...westBayEntranceMarkings,
            }),
            arrowX: 6.8075,
            arrowShiftZM: 0,
        },
        {
            bay: objects.addParallelParkingBayB({
                x: westBay2X, z: westBayRoadEdgeZ, rotationY: -Math.PI / 2,
                cornerRadiusM: 0.3, vehicleClass: 'B',
                ...westBayEntranceMarkings,
            }),
            arrowX: -14,
            arrowShiftZM: 0,
        },
        {
            bay: objects.addParallelParkingBayB({
                x: westBay3X, z: westBayRoadEdgeZ, rotationY: -Math.PI / 2,
                cornerRadiusM: 0.3, vehicleClass: 'B',
                ...westBayEntranceMarkings,
            }),
            arrowX: -24,
            arrowShiftZM: 0,
        },
    ];
    const parallelBaySignGrassOffsetM = .6;
    const parallelBaySignEndOffsetM = .45;
    const addParallelBaySign = (
        bay: ParallelParkingBayB,
        name: string,
        localShiftM: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
    ) => {
        const sign = new ParkingBayBSign(bay.vehicleClass);
        sign.root.name = name;
        // Đầu +X của đường nằm ở local -Z của chuồng; đặt biển trên cỏ cạnh đầu này.
        sign.root.position.set(
            bay.depthM + bay.physicalEdgeOffsetM + bay.curbWidthM + parallelBaySignGrassOffsetM + localShiftM.x,
            localShiftM.y,
            -bay.lengthM / 2 - parallelBaySignEndOffsetM + localShiftM.z,
        );
        // Mặt +Z của biển xoay theo hướng của chuồng.
        bay.root.add(sign.root);
    };
    for (const [index, { bay }] of westParallelParkingBays.entries()) {
        addParallelBaySign(bay, `west-parallel-parking-bay-${index + 1}-sign`);
    }
    westJunctionRoad.root.updateMatrixWorld(true);
    const lane3Z = westJunctionRoad.root.localToWorld(
        new THREE.Vector3(westJunctionRoad.laneCentersX[2], 0, 0),
    ).z;
    const lane4Z = westJunctionRoad.root.localToWorld(
        new THREE.Vector3(westJunctionRoad.laneCentersX[3], 0, 0),
    ).z;
    const lane1Z = westJunctionRoad.root.localToWorld(
        new THREE.Vector3(westJunctionRoad.laneCentersX[0], 0, 0),
    ).z;
    const lane2Z = westJunctionRoad.root.localToWorld(
        new THREE.Vector3(westJunctionRoad.laneCentersX[1], 0, 0),
    ).z;
    for (const [index, { arrowX, arrowShiftZM }] of westParallelParkingBays.entries()) {
        // Chỉ dùng tọa độ mũi tên; thay đổi arrowX không ảnh hưởng vị trí chuồng.
        const straightArrow = objects.addStraightRoadArrow(
            arrowX, lane3Z + arrowShiftZM, westJunctionRoad.laneWidthM, 10, Math.PI / 2,
        );
        straightArrow.name = `parallel-bay-${index + 1}-lane-3-straight-arrow`;
        const straightRightArrow = objects.addStraightRightRoadArrow(
            arrowX, lane4Z + arrowShiftZM, westJunctionRoad.laneWidthM, 10, Math.PI / 2,
        );
        straightRightArrow.name = `parallel-bay-${index + 1}-lane-4-straight-right-arrow`;
    }
    // Cặp thứ tư gần đầu nối 4→3 làn: cả hai làn dùng mũi tên rẽ phải
    // cùng nét, góc và tỉ lệ với mũi tên ở lối ra chữ S.
    const westSCourseArrowPairX = -50;
    const westSCourseArrowPairShiftZM = 0;
    for (const [laneNumber, laneZ] of [[3, lane3Z], [4, lane4Z]] as const) {
        const arrow = objects.addDiagonalTurnRoadArrow(
            westSCourseArrowPairX,
            laneZ + westSCourseArrowPairShiftZM,
            westJunctionRoad.laneWidthM,
            10,
            'right',
            false,
            Math.PI / 2,
            false,
            sCourseExitArrowBranchAngleRad,
        );
        arrow.name = `west-junction-s-course-style-lane-${laneNumber}-arrow`;
    }
    // Các cặp ở làn 1–2 đi theo +X: kiểu 'parking' có làn 1 thẳng/rẽ phải,
    // làn 2 đi thẳng; kiểu 'turn' cho cả hai làn rẽ phải như lối ra chữ S.
    // Chỉnh x/shiftZM của từng mục để dịch riêng từng cặp.
    const westOppositeArrowPairs = [
        { x: -49.5, shiftZM: 0, style: 'parking' },
        { x: -40, shiftZM: 0, style: 'parking' },
        { x: -24, shiftZM: 0, style: 'parking' },
        { x: -9, shiftZM: 0, style: 'parking' },
        { x: 7, shiftZM: 0, style: 'turn' },
    ];
    for (const [index, pair] of westOppositeArrowPairs.entries()) {
        if (pair.style === 'turn') {
            for (const [laneNumber, laneZ] of [[1, lane1Z], [2, lane2Z]] as const) {
                const arrow = objects.addDiagonalTurnRoadArrow(
                    pair.x, laneZ + pair.shiftZM, westJunctionRoad.laneWidthM, 10,
                    'right', false, -Math.PI / 2, false, sCourseExitArrowBranchAngleRad,
                );
                arrow.name = `west-junction-opposite-pair-${index + 1}-lane-${laneNumber}-right-arrow`;
            }
            continue;
        }
        const outerArrow = objects.addStraightRightRoadArrow(
            pair.x, lane1Z + pair.shiftZM, westJunctionRoad.laneWidthM, 10, -Math.PI / 2,
        );
        outerArrow.name = `west-junction-opposite-pair-${index + 1}-lane-1-straight-right-arrow`;
        const innerArrow = objects.addStraightRoadArrow(
            pair.x, lane2Z + pair.shiftZM, westJunctionRoad.laneWidthM, 10, -Math.PI / 2,
        );
        innerArrow.name = `west-junction-opposite-pair-${index + 1}-lane-2-straight-arrow`;
    }

    // CHUỒNG GHÉP XE VUÔNG GÓC HẠNG C — object thử nghiệm theo CAD.
    // Local +X chạy dọc đường tiếp cận, local +Z đi vào chuồng; cửa chuồng tại (120, 80).
    // sign dời cả cột theo trục chuồng; pBoard/classBoard dời riêng từng mặt
    // theo trục thế giới vì cột được xoay bù góc của chuồng.
    type SignShiftM = { x: number; y: number; z: number };
    const addPerpendicularBaySign = (
        bay: PerpendicularParkingBayB | PerpendicularParkingBayC,
        vehicleClass: 'B' | 'C',
        name: string,
        shifts: {
            sign: SignShiftM;
            pBoard: SignShiftM;
            classBoard: SignShiftM;
            pBoardRotationY?: number;
            classBoardRotationY?: number;
        },
    ) => {
        const sign = new ParkingBayBSign(vehicleClass, {
            pBoardRotationY: shifts.pBoardRotationY ?? 0,
            classBoardRotationY: shifts.classBoardRotationY ?? Math.PI / 2,
            pBoardShiftM: shifts.pBoard,
            classBoardShiftM: shifts.classBoard,
        });
        sign.root.name = name;
        // Bên phải ô đỗ là bãi cỏ; xoay ngược góc chuồng để các góc bảng
        // phía trên luôn tính theo tọa độ thế giới.
        sign.root.position.set(
            bay.geometry.openingRightX + .9 + shifts.sign.x,
            shifts.sign.y,
            bay.parkingDepthM / 2 + shifts.sign.z,
        );
        sign.root.rotation.y = -bay.root.rotation.y;
        bay.root.add(sign.root);
    };
    const firstPerpendicularCBay = objects.addPerpendicularParkingBayC({
        x: 0,
        z: -66.78,
        rotationY: -Math.PI / 2,
        capEnd: false,
        mainRoadBottomRadiusM: 1,
        parkingBottomRadiusM: 0.5,
        showDebug: false,
    });
    addPerpendicularBaySign(firstPerpendicularCBay, 'C', 'first-perpendicular-c-parking-sign', {
        sign: { x: 12, y: 0, z: -2.5 },
        pBoard: { x: 0, y: 0, z: 0 },
        classBoard: { x: 0, y: 0, z: 0 },
    });
    // Lấy mặt cắt và điểm đầu trực tiếp từ chuồng, để asphalt và hai tâm bó vỉa
    // trùng nhau. Mỗi bó vỉa dừng đúng ở tiếp tuyến với góc bo riêng của nó.
    const addWestPerpendicularConnector = (
        bay: PerpendicularParkingBayB | PerpendicularParkingBayC,
        widthM: number,
        roadEndZ: number,
        leftRadiusM: number,
        rightRadiusM: number,
        leftColorOffset = 0,
    ): RoadStraight955 => {
        bay.root.updateWorldMatrix(true, false);
        const bayRoadEnd = bay.root.localToWorld(
            new THREE.Vector3(bay.geometry.controlEndX, 0, -widthM / 2));
        const startZ = bayRoadEnd.z;
        const lengthM = roadEndZ - startZ;
        if (lengthM <= 0) throw new Error('Perpendicular connector must reach the main road');
        const connector = objects.addRoadStraight955({
            x: bayRoadEnd.x,
            z: (startZ + roadEndZ) / 2,
            widthM,
            lengthM,
            curbWidthM: CURB_VISUAL_WIDTH_M,
            curbPlacement: 'centered',
            lowerCurbLengthM: westJunctionSouthZ - leftRadiusM - startZ,
            upperCurbLengthM: westJunctionSouthZ - rightRadiusM - startZ,
            rotationY: -Math.PI / 2,
            showDebug: false,
        });
        const leftX = bay.root.localToWorld(
            new THREE.Vector3(bay.geometry.controlEndX, 0, -widthM)).x;
        const rightX = bay.root.localToWorld(
            new THREE.Vector3(bay.geometry.controlEndX, 0, 0)).x;
        objects.addRoadJunctionCorner(leftX, westJunctionSouthZ, leftRadiusM,
            'east', 'south', leftColorOffset, CURB_VISUAL_WIDTH_M, 'centered');
        objects.addRoadJunctionCorner(rightX, westJunctionSouthZ, rightRadiusM,
            'west', 'south', 1, CURB_VISUAL_WIDTH_M, 'centered');
        return connector;
    };
    const firstPerpendicularCConnector = addWestPerpendicularConnector(
        firstPerpendicularCBay, firstPerpendicularCBay.outerEnvelopeWidthM,
        -52.5 + 7.428 / 2, 3, 4);
    // Bản test thứ hai dùng chung object chuồng ghép xe vuông góc hạng C.
    const secondPerpendicularCBay = objects.addPerpendicularParkingBayC({
        x: -21,
        z: -77.6,
        rotationY: -Math.PI / 2,
        capEnd: false,
        showDebug: false,
        mainRoadBottomRadiusM: 1,
        parkingBottomRadiusM: 0.5,
    });
    addPerpendicularBaySign(secondPerpendicularCBay, 'C', 'second-perpendicular-c-parking-sign', {
        sign: { x: 22.8, y: 0, z: -3.5 },
        pBoard: { x: 0, y: 0, z: 0 },
        classBoard: { x: 0, y: 0, z: 0 },
    });

    // ROAD_STRAIGHT_9_55 — primitive tái sử dụng, cấu hình widthM/lengthM tại call site.
    const secondPerpendicularCConnector = addWestPerpendicularConnector(
        secondPerpendicularCBay, secondPerpendicularCBay.outerEnvelopeWidthM,
        -58.1 + 17.948 / 2, 3, .84);

    const firstPerpendicularBBay = objects.addPerpendicularParkingBayB({
        x: -28,
        z: -67.3,
        capEnd: false,
        rotationY: -Math.PI / 2, showDebug: false,
    });
    addPerpendicularBaySign(firstPerpendicularBBay, 'B', 'first-perpendicular-b-parking-sign', {
        sign: { x: 12.8, y: 0, z: -1 },
        pBoard: { x: 0, y: 0, z: 0 },
        classBoard: { x: 0, y: 0, z: 0 },
    });
    const firstPerpendicularBConnector = addWestPerpendicularConnector(
        firstPerpendicularBBay, firstPerpendicularBBay.clearRoadWidthM,
        -55 + 12.5 / 2, .84, 3, 1);

    const secondPerpendicularBBay = objects.addPerpendicularParkingBayB({
        x: -41.1,
        z: -67.3,
        capEnd: false,
        rotationY: -Math.PI / 2, showDebug: false,
    });
    addPerpendicularBaySign(secondPerpendicularBBay, 'B', 'second-perpendicular-b-parking-sign', {
        sign: { x: 12.5, y: 0, z: 0 },
        pBoard: { x: 0, y: 0, z: 0 },
        classBoard: { x: 0, y: 0, z: 0 },
    });
    const secondPerpendicularBConnector = addWestPerpendicularConnector(
        secondPerpendicularBBay, secondPerpendicularBBay.clearRoadWidthM,
        -55 + 12.5 / 2, 3, 3, 1);
    // CHUỒNG GHÉP XE VUÔNG GÓC HẠNG B — test độc lập theo CAD.
    const firstSouthPerpendicularBBay = objects.addPerpendicularParkingBayB({
        x: 9.4,
        z: -85.8,
        capEnd: false,
        rotationY: Math.PI / 2, showDebug: false,
    });
    addPerpendicularBaySign(firstSouthPerpendicularBBay, 'B', 'first-south-perpendicular-b-parking-sign', {
        sign: { x: 5.8, y: 0, z: -9 },
        pBoard: { x: 0, y: 0, z: 0 },
        classBoard: { x: 0, y: 0, z: 0 },
        pBoardRotationY: -Math.PI / 2,
        classBoardRotationY: -Math.PI / 2,
    });
    // R.301d có tọa độ thế giới riêng: dời biển P/HẠNG B sẽ không dời biển này.
    const keepRightSign = new THREE.Group();
    keepRightSign.name = 'first-south-perpendicular-b-r301d-sign';
    keepRightSign.position.set(16, 0, -98.5);
    keepRightSign.add(createStripedSignPost(3.12, .045));
    const keepRightMount = new THREE.Group();
    keepRightMount.position.y = 2.65;
    keepRightMount.rotation.y = -Math.PI / 2;
    const keepRightFace = Exam05JunctionSigns.cloneKeepRightModel();
    keepRightFace.name = 'R301D_KEEP_RIGHT';
    keepRightFace.updateMatrixWorld(true);
    const keepRightBounds = new THREE.Box3().setFromObject(keepRightFace);
    const keepRightSize = keepRightBounds.getSize(new THREE.Vector3());
    const keepRightCenter = keepRightBounds.getCenter(new THREE.Vector3());
    const keepRightDiameterM = .82;
    const keepRightScale = keepRightDiameterM / keepRightSize.x;
    keepRightFace.scale.setScalar(keepRightScale);
    keepRightFace.position.set(
        -keepRightCenter.x * keepRightScale,
        -keepRightCenter.y * keepRightScale,
        .095 - keepRightCenter.z * keepRightScale,
    );
    keepRightFace.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    keepRightMount.add(keepRightFace);
    keepRightSign.add(keepRightMount);
    objects.root.add(keepRightSign);
    firstSouthPerpendicularBBay.root.updateWorldMatrix(true, false);
    const firstSouthBBayRoadEnd = firstSouthPerpendicularBBay.root.localToWorld(
        new THREE.Vector3(
            firstSouthPerpendicularBBay.geometry.controlEndX,
            0,
            -firstSouthPerpendicularBBay.clearRoadWidthM / 2,
        ));
    // Đầu phía đường 8A lấn 0,05 m vào asphalt để hai mặt đường không hở.
    const southBConnectorSouthEndZ = -101;
    const firstSouthBConnectorLengthM = firstSouthBBayRoadEnd.z - southBConnectorSouthEndZ;
    const firstSouthPerpendicularBConnector = objects.addRoadStraight955({
        x: firstSouthBBayRoadEnd.x,
        z: (firstSouthBBayRoadEnd.z + southBConnectorSouthEndZ) / 2,
        widthM: firstSouthPerpendicularBBay.clearRoadWidthM,
        lengthM: firstSouthBConnectorLengthM,
        curbWidthM: CURB_VISUAL_WIDTH_M,
        curbPlacement: 'centered',
        rotationY: Math.PI / 2,
        showDebug: false,
    });
    const secondSouthPerpendicularBBay = objects.addPerpendicularParkingBayB({
        x: -3.8,
        z: -85.8,
        capEnd: false,
        rotationY: Math.PI / 2, showDebug: false,
    });
    addPerpendicularBaySign(secondSouthPerpendicularBBay, 'B', 'second-south-perpendicular-b-parking-sign', {
        sign: { x: 6, y: 0, z: -10 },
        pBoard: { x: 0, y: 0, z: 0 },
        classBoard: { x: 0, y: 0, z: 0 },
        pBoardRotationY: -Math.PI / 2,
        classBoardRotationY: -Math.PI / 2,
    });
    secondSouthPerpendicularBBay.root.updateWorldMatrix(true, false);
    const secondSouthBBayRoadEnd = secondSouthPerpendicularBBay.root.localToWorld(
        new THREE.Vector3(
            secondSouthPerpendicularBBay.geometry.controlEndX,
            0,
            -secondSouthPerpendicularBBay.clearRoadWidthM / 2,
        ));
    const secondSouthBConnectorLengthM = secondSouthBBayRoadEnd.z - southBConnectorSouthEndZ;
    const secondSouthPerpendicularBConnector = objects.addRoadStraight955({
        x: secondSouthBBayRoadEnd.x,
        z: (secondSouthBBayRoadEnd.z + southBConnectorSouthEndZ) / 2,
        widthM: secondSouthPerpendicularBBay.clearRoadWidthM,
        lengthM: secondSouthBConnectorLengthM,
        curbWidthM: CURB_VISUAL_WIDTH_M,
        curbPlacement: 'centered',
        rotationY: Math.PI / 2,
        showDebug: false,
    });
    // Vạch đứt ngang lối vào nằm trên asphalt của connector. C có một hàng,
    // B có hai hàng; hàng sát chuồng chạm hai vạch vàng dọc tại mối nối.
    // offsetsM đo dọc đoạn nối từ đầu giáp chuồng; có thể chỉnh riêng từng lối.
    const addPerpendicularConnectorDashedLines = (
        connector: RoadStraight955, vehicleClass: 'B' | 'C', offsetsM: readonly number[],
    ): void => {
        const gapM = .20;
        const lineWidthM = .10;
        // Nét đầu và nét cuối chạm đúng tâm bó vỉa ở hai mép connector.
        const patternWidthM = connector.geometry.widthM;
        const dashCount = Math.round((patternWidthM + gapM) / (.41 + gapM));
        const dashLengthM = (patternWidthM - (dashCount - 1) * gapM) / dashCount;
        const material = new THREE.MeshBasicMaterial({ color: 0xf6d34c });
        for (const [lineIndex, offsetM] of offsetsM.entries()) {
            if (offsetM < 0 || offsetM >= connector.geometry.lengthM) {
                throw new Error('Perpendicular connector dashed line must stay on its asphalt');
            }
            const line = new THREE.Group();
            line.name = `ParkingBay${vehicleClass}ConnectorDashedLine_${lineIndex + 1}`;
            line.position.x = -connector.geometry.lengthM / 2 + offsetM;
            for (let index = 0; index < dashCount; index++) {
                const dash = new THREE.Mesh(
                    new THREE.BoxGeometry(lineWidthM, .004, dashLengthM), material);
                dash.position.set(0, .066, -patternWidthM / 2
                    + dashLengthM / 2 + index * (dashLengthM + gapM));
                line.add(dash);
            }
            connector.surfaceGroup.add(line);
        }
    };
    addPerpendicularConnectorDashedLines(firstPerpendicularCConnector, 'C', [0]);
    addPerpendicularConnectorDashedLines(secondPerpendicularCConnector, 'C', [0]);
    addPerpendicularConnectorDashedLines(firstPerpendicularBConnector, 'B', [0, .95]);
    addPerpendicularConnectorDashedLines(secondPerpendicularBConnector, 'B', [0, .95]);
    addPerpendicularConnectorDashedLines(firstSouthPerpendicularBConnector, 'B', [0, .95]);
    addPerpendicularConnectorDashedLines(secondSouthPerpendicularBConnector, 'B', [0, .95]);
    // Chữ hạng xe sơn trên sáu đoạn nối, sát đầu giao với đường chính.
    const connectorClassTextures = new Map<'B' | 'C', THREE.CanvasTexture>();
    const addPerpendicularConnectorClassLabel = (
        connector: RoadStraight955, vehicleClass: 'B' | 'C', name: string,
    ): void => {
        let texture = connectorClassTextures.get(vehicleClass);
        if (!texture) {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Cannot draw perpendicular parking class label');
            context.fillStyle = '#f6d34c';
            context.font = 'bold 200px Arial, sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(vehicleClass, 128, 136);
            texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 4;
            connectorClassTextures.set(vehicleClass, texture);
        }
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
        );
        label.name = name;
        label.rotation.x = -Math.PI / 2;
        // Xoay chữ trên mặt đường để B ở cả hai phía có nét dọc bên trái.
        label.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI);
        label.position.set(connector.geometry.lengthM / 2 - 1.6, .073, 0);
        connector.surfaceGroup.add(label);
    };
    addPerpendicularConnectorClassLabel(firstPerpendicularCConnector, 'C', 'first-perpendicular-c-road-label');
    addPerpendicularConnectorClassLabel(secondPerpendicularCConnector, 'C', 'second-perpendicular-c-road-label');
    addPerpendicularConnectorClassLabel(firstPerpendicularBConnector, 'B', 'first-perpendicular-b-road-label');
    addPerpendicularConnectorClassLabel(secondPerpendicularBConnector, 'B', 'second-perpendicular-b-road-label');
    addPerpendicularConnectorClassLabel(firstSouthPerpendicularBConnector, 'B', 'first-south-perpendicular-b-road-label');
    addPerpendicularConnectorClassLabel(secondSouthPerpendicularBConnector, 'B', 'second-south-perpendicular-b-road-label');
    const southParallelParkingBayD = objects.addParallelParkingBayB({
        x: -52.1,
        z: -59,
        rotationY: 0, cornerRadiusM: 0.3,
        vehicleClass: 'D',
        examBoundaryWidthM: 0.05,
        examBoundaryStartM: 0,
        yellowDashedEntrance: true,
        joinRoadCurb: true,
    });
    // Chỉnh riêng vị trí biển D (mét, theo trục local của chuồng).
    addParallelBaySign(southParallelParkingBayD, 'south-parallel-parking-bay-d-sign', {
        x: -0.5, y: 0, z: 13,
    });
    // Nối tiếp nhánh 3 làn của đường 4 làn (mép trong x = -52.1, đầu nhánh z = -68.7).
    // Mép trong đoạn chéo 9A trùng cạnh mở chuồng E (cùng góc -1.100987).
    // Cua 9A → 8A kết thúc tại thanh 8A (x = 0); đoạn 8A chạy theo +X, mép trong z = -100.95,
    // qua cả hai lối vào chuồng B.
    const road8A9A = objects.addRoadCornerCurveR8R9({
        x: -52.1,
        z: -68.7,
        withLaneNumbers: showRoadLaneNumbers,
        // distanceM đo từ đầu segmentIndex (mặc định đoạn chéo 1); shiftWorldXM/ZM theo tọa độ sân.
        lane4Arrows: [
            { type: 'straight-right', distanceM: 13, shiftWorldXM: 0, shiftWorldZM: 0 },
            { type: 'straight-right', distanceM: 47, shiftWorldXM: 0, shiftWorldZM: 0 },
            { type: 'straight-right', distanceM: 47, shiftWorldXM: 0, shiftWorldZM: 0 },
            // Trước lối vào chuồng B phía +X trên đoạn 8A.
            { type: 'straight-right', segmentIndex: 2, distanceM: 7, shiftWorldXM: 0, shiftWorldZM: 0 },
            { type: 'diagonal-right', segmentIndex: 2, distanceM: 19, shiftWorldXM: 0, shiftWorldZM: 0 },

        ],
        lane3Arrows: [
            { type: 'diagonal-right', distanceM: 47, shiftWorldXM: 0, shiftWorldZM: 0 },
            { type: 'diagonal-right', segmentIndex: 2, distanceM: 19, shiftWorldXM: 0, shiftWorldZM: 0 },
        ],
        lane2Arrows: [
            { type: 'diagonal-left', distanceM: 0, shiftWorldXM: 0, shiftWorldZM: 0 },
        ],
        segmentLengthsM: [7.693, 54.244, 21],
        bends: [
            // Mép ngoài CAD không ghi bán kính, lấy bằng vạch vàng.
            { sweepDeg: THREE.MathUtils.radToDeg(1.100987), innerEdgeRadiusM: 6, dashedLineRadiusM: 8, centerLineRadiusM: 9, outerEdgeRadiusM: 9 },
            { sweepDeg: 90 - THREE.MathUtils.radToDeg(1.100987), innerEdgeRadiusM: 3, dashedLineRadiusM: 20, centerLineRadiusM: 23, outerEdgeRadiusM: 26.7 },
        ],
    });
    // Bo R3 hai bồn cỏ ở đầu kia của đường dọc: trái nối 8A/9A, phải nối 6A.
    road8A9A.root.updateMatrixWorld(true);
    const road8AEndPoints = road8A9A.surfaceOutline.map(([x, z]) =>
        road8A9A.root.localToWorld(new THREE.Vector3(x, 0, z)));
    const road8AEndX = Math.max(...road8AEndPoints.map(point => point.x));
    const road8ANorthEdgeZ = Math.max(...road8AEndPoints
        .filter(point => Math.abs(point.x - road8AEndX) < .01)
        .map(point => point.z));
    // Vị trí 3 cách vị trí 2 thêm 25 m về -X, trên làn ngoài cùng của đoạn 8A.
    const accelerationPosition2WorldX = sixAFourLaneRoad.root.localToWorld(
        new THREE.Vector3(0, 0, accelerationPosition2LocalZ)).x;
    const accelerationPosition3WorldX = accelerationPosition2WorldX - 25;
    const road8ASouthEdgeZ = Math.min(...road8AEndPoints
        .filter(point => Math.abs(point.x - road8AEndX) < .01)
        .map(point => point.z));
    // Biển tốc độ 20 và bảng kết thúc giảm số/tốc độ ở cùng mốc X với vạch số 3.
    objects.root.add(new SpeedLimit20EndAccelerationSign(
        accelerationPosition3WorldX,
        road8ASouthEdgeZ - 1.1 + accelerationSignShiftZM,
        Math.PI / 2,
    ).root);
    // Khi nối đường, curb 6A bị cắt hết phần nằm dưới southRoad tới mép X=25.
    // Bịt toàn bộ đầu cụt từ mép 8A tới mép phải southRoad, không dừng ở đầu 6A (X=22,4).
    const curbBridgeStartX = road8AEndX - .01;
    const curbBridgeEndX = southRoadX + southRoadWidthM / 2 + .01;
    const curbStripeLengthM = .8;
    for (let x = curbBridgeStartX, stripe = 0; x < curbBridgeEndX - .0001; stripe++) {
        const lengthM = Math.min(curbStripeLengthM, curbBridgeEndX - x);
        const curb = new THREE.Mesh(
            new THREE.BoxGeometry(lengthM, CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M),
            new THREE.MeshStandardMaterial({
                color: stripe % 2 === 0 ? 0xd83b3b : 0xffffff,
                roughness: .85,
            }),
        );
        curb.name = 'road-8a-6a-south-end-red-white-curb';
        curb.position.set(x + lengthM / 2, .085,
            road8ASouthEdgeZ + CURB_VISUAL_WIDTH_M / 2);
        curb.castShadow = true;
        objects.root.add(curb);
        x += lengthM;
    }
    const position3DashCount = 3;
    const position3FromZ = road8ASouthEdgeZ + CURB_VISUAL_WIDTH_M;
    const position3ToZ = road8ASouthEdgeZ + sixAFourLaneRoad.laneWidthM
        - yellowCrossbarWidthM / 2;
    const position3DashGapM = (position3ToZ - position3FromZ
        - position3DashCount * yellowDashLengthM) / (position3DashCount - 1);
    for (let i = 0; i < position3DashCount; i++) {
        const dashCenterZ = position3FromZ + i * (yellowDashLengthM + position3DashGapM)
            + yellowDashLengthM / 2;
        const dash = new THREE.Mesh(
            new THREE.BoxGeometry(yellowCrossbarWidthM, .008, yellowDashLengthM),
            yellowCrossbarMaterial,
        );
        dash.name = 'eight-a-acceleration-position-3-yellow-dash';
        dash.position.copy(road8A9A.root.worldToLocal(new THREE.Vector3(
            accelerationPosition3WorldX, .067, dashCenterZ,
        )));
        dash.receiveShadow = true;
        road8A9A.root.add(dash);
    }
    // Mũi tên xéo trái sau vạch 5 m; mũi tên thẳng trước vạch 8 m.
    // Cả hai cùng tim làn ngoài và cùng chiều chạy -X.
    const position3ArrowLaneCenterZ = road8ASouthEdgeZ + sixAFourLaneRoad.laneWidthM / 2;
    const position3DiagonalLeftArrow = objects.addDiagonalTurnRoadArrow(
        accelerationPosition3WorldX - 5,
        position3ArrowLaneCenterZ,
        sixAFourLaneRoad.laneWidthM,
        10,
        'left', false, Math.PI / 2,
    );
    position3DiagonalLeftArrow.name = 'eight-a-acceleration-position-3-diagonal-left-arrow';
    const position3StraightArrow = objects.addStraightRoadArrow(
        accelerationPosition3WorldX + 8,
        position3ArrowLaneCenterZ,
        sixAFourLaneRoad.laneWidthM,
        10,
        Math.PI / 2,
    );
    position3StraightArrow.name = 'eight-a-acceleration-position-3-straight-arrow';
    const road8AInnerEdge = road8A9A.innerEdge.map(([x, z]) =>
        road8A9A.root.localToWorld(new THREE.Vector3(x, 0, z)));
    // Chuồng B tại X=9,4 đi ra theo -Z: hai mép của connector cùng bo R3.
    firstSouthPerpendicularBConnector.root.updateWorldMatrix(true, false);
    const firstSouthBHalfWidthM = firstSouthPerpendicularBConnector.geometry.widthM / 2;
    const firstSouthBLeftX = firstSouthPerpendicularBConnector.root.localToWorld(
        new THREE.Vector3(0, 0, firstSouthBHalfWidthM)).x;
    const firstSouthBRightX = firstSouthPerpendicularBConnector.root.localToWorld(
        new THREE.Vector3(0, 0, -firstSouthBHalfWidthM)).x;
    objects.addRoadJunctionCorner(
        firstSouthBLeftX, road8ANorthEdgeZ, 3, 'east', 'north', 1,
        CURB_VISUAL_WIDTH_M, 'centered',
    );
    objects.addRoadJunctionCorner(
        firstSouthBRightX, road8ANorthEdgeZ, 3, 'west', 'north', 1,
        CURB_VISUAL_WIDTH_M, 'centered',
    );
    // Từ chuồng B đi ra theo -Z: mép trái +X và mép phải -X cùng bo R3 vào đường 8A.
    secondSouthPerpendicularBConnector.root.updateWorldMatrix(true, false);
    const secondSouthBHalfWidthM = secondSouthPerpendicularBConnector.geometry.widthM / 2;
    const secondSouthBLeftX = secondSouthPerpendicularBConnector.root.localToWorld(
        new THREE.Vector3(0, 0, secondSouthBHalfWidthM)).x;
    const secondSouthBRightX = secondSouthPerpendicularBConnector.root.localToWorld(
        new THREE.Vector3(0, 0, -secondSouthBHalfWidthM)).x;
    objects.addRoadJunctionCorner(
        secondSouthBLeftX, road8ANorthEdgeZ, 3, 'east', 'north', 1,
        CURB_VISUAL_WIDTH_M, 'centered',
    );
    const secondSouthBWestCorner = objects.addWestRoadJunctionCornerToSlopedNorthEdge(
        secondSouthBRightX, road8AInnerEdge, 3, 1, 'centered',
    );
    // Cắt bó vỉa của 8A đúng ở bốn điểm tiếp tuyến R3. Cắt theo tâm khúc
    // đỏ/trắng 0,8 m sẽ làm vạch dừng hụt trước các cung bo.
    const curbLocalX = (worldX: number, worldZ: number) =>
        road8A9A.root.worldToLocal(new THREE.Vector3(worldX, 0, worldZ)).x;
    road8A9A.setInnerCurbOpenings([
        [
            curbLocalX(secondSouthBWestCorner.roadTangent.x, secondSouthBWestCorner.roadTangent.z),
            curbLocalX(secondSouthBLeftX + 3, road8ANorthEdgeZ),
        ],
        [
            curbLocalX(firstSouthBRightX - 3, road8ANorthEdgeZ),
            curbLocalX(firstSouthBLeftX + 3, road8ANorthEdgeZ),
        ],
    ]);
    const southRoadLeftX = southRoadX - southRoadWidthM / 2;
    const southRoadRightX = southRoadX + southRoadWidthM / 2;
    objects.addRoadJunctionCorner(southRoadLeftX, road8ANorthEdgeZ, 3, 'west', 'north', 1);
    objects.trimRoadCornerCurveEndCurb(road8A9A, road8ANorthEdgeZ, southRoadLeftX - 3);
    objects.addRoadJunctionCorner(southRoadRightX, sixANorthEdgeZ, 3, 'east', 'north', 1);
    // Hạng E theo CAD: 1.83 m tới control trái B, 2.46 m tới chuồng C,
    // 2.99 m tới control trái C; mặt mở quay về phía RIGHT.
    // Dời 1.85 m về phía đường (từ -35, -83) để cua 9A → 8A kết thúc đúng thanh 8A.
    const southParallelParkingBayE = objects.addParallelParkingBayB({
        x: -35.838,
        z: -84.65,
        rotationY: -1.100987,
        cornerRadiusM: 0.3,
        vehicleClass: 'E',
        examBoundaryWidthM: 0.05,
        examBoundaryStartM: 0,
        yellowDashedEntrance: true,
        joinRoadCurb: true,
        side: 'RIGHT',
    });
    // Chỉnh riêng vị trí biển E (mét, theo trục local của chuồng đã xoay).
    addParallelBaySign(southParallelParkingBayE, 'south-parallel-parking-bay-e-sign', {
        x: 0, y: 0, z: 0,
    });

    // Bỏ các tấm cỏ chữ nhật xanh sáng của connector/chuồng B.
    // Nền sân đã có cỏ liên tục; giữ nguyên mặt đường, bó vỉa và vùng va chạm.
    const flatGrassNames = new Set([
        'GrassZone_NegZ', 'GrassZone_PosZ', 'GrassMeshLeft', 'GrassMeshRight',
    ]);
    const flatGrassPatches: THREE.Mesh[] = [];
    objects.root.traverse(child => {
        if (child instanceof THREE.Mesh && flatGrassNames.has(child.name)) {
            flatGrassPatches.push(child);
        }
    });
    const removedGrassMaterials = new Set<THREE.Material>();
    for (const patch of flatGrassPatches) {
        patch.removeFromParent();
        patch.geometry.dispose();
        if (Array.isArray(patch.material)) {
            patch.material.forEach(material => removedGrassMaterials.add(material));
        } else {
            removedGrassMaterials.add(patch.material);
        }
    }
    removedGrassMaterials.forEach(material => material.dispose());

    // Chỉ phủ vân cỏ quanh sân thi; nền xa vẫn giữ màu xanh phẳng ban đầu.
    const courseBounds = new THREE.Box3();
    objects.root.updateMatrixWorld(true);
    for (const child of objects.root.children) {
        if (child !== ground && child.visible) courseBounds.expandByObject(child);
    }
    if (!courseBounds.isEmpty()) {
        const grassMarginM = 8;
        const minX = Math.max(-250, courseBounds.min.x - grassMarginM);
        const maxX = Math.min(250, courseBounds.max.x + grassMarginM);
        const minZ = Math.max(-250, courseBounds.min.z - grassMarginM);
        const maxZ = Math.min(250, courseBounds.max.z + grassMarginM);
        const widthM = maxX - minX;
        const heightM = maxZ - minZ;
        if (widthM > 0 && heightM > 0) {
            const centerX = (minX + maxX) / 2;
            const centerZ = (minZ + maxZ) / 2;
            const fadeSize = 128;
            const fadeCanvas = document.createElement('canvas');
            fadeCanvas.width = fadeCanvas.height = fadeSize;
            const fadeContext = fadeCanvas.getContext('2d')!;
            const fadeImage = fadeContext.createImageData(fadeSize, fadeSize);
            for (let y = 0; y < fadeSize; y++) {
                for (let x = 0; x < fadeSize; x++) {
                    const distanceM = Math.min(
                        x * widthM / (fadeSize - 1),
                        (fadeSize - 1 - x) * widthM / (fadeSize - 1),
                        y * heightM / (fadeSize - 1),
                        (fadeSize - 1 - y) * heightM / (fadeSize - 1),
                    );
                    const t = THREE.MathUtils.clamp(distanceM / grassMarginM, 0, 1);
                    const alpha = Math.round(255 * t * t * (3 - 2 * t));
                    const offset = (y * fadeSize + x) * 4;
                    fadeImage.data[offset] = alpha;
                    fadeImage.data[offset + 1] = alpha;
                    fadeImage.data[offset + 2] = alpha;
                    fadeImage.data[offset + 3] = 255;
                }
            }
            fadeContext.putImageData(fadeImage, 0, 0);
            const fadeTexture = new THREE.CanvasTexture(fadeCanvas);
            const grassDetail = new THREE.Mesh(
                new THREE.PlaneGeometry(widthM, heightM),
                new THREE.MeshStandardMaterial({
                    map: createGrassSurfaceTexture({ widthM, heightM, centerX, centerZ }),
                    alphaMap: fadeTexture,
                    transparent: true,
                    depthWrite: false,
                    roughness: 1,
                }),
            );
            grassDetail.name = 'exam-course-grass-detail';
            grassDetail.rotation.x = -Math.PI / 2;
            grassDetail.position.set(centerX, .003, centerZ);
            grassDetail.receiveShadow = true;
            objects.root.add(grassDetail);
        }
    }
}
