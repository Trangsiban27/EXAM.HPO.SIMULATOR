import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';
import { createGrassSurfaceTexture } from './grassSurface';
import { Bridge } from './Bridge';
import { RailwayCrossingRoad, type RailwayCrossingRoadOptions } from './RailwayCrossingRoad';
import { TrafficLight, type TrafficLightOptions } from './TrafficLight';
import { ExerciseSign } from './signs/ExerciseSign';
import { PedestrianSign, type PedestrianSignOptions } from './signs/PedestrianSign';
import { StopSign, type StopSignOptions } from './signs/StopSign';
import { SCurveTrack, type SCurveTrackOptions } from './WindingCourse';
import { WheelTrackCourse, type WheelTrackCourseOptions } from './WheelTrackCourse';
import { startPosition } from './startPosition';
import { FourLaneRoad, type FourLaneRoadOptions } from './FourLaneRoad';
import { FourLaneBidirectionalRoad, type FourLaneBidirectionalRoadOptions } from './FourLaneBidirectionalRoad';
import { RoadCornerCurveR8R9, type RoadCornerCurveR8R9Options } from './RoadCornerCurveR8R9';
import { isPointInPolygon, offsetPath, splitByPattern, type Point } from './roundedPath';
import { ParallelParkingBayB, type ParallelParkingBayBOptions } from './ParallelParkingBayB';
import { PerpendicularParkingBayB, type PerpendicularParkingBayBOptions } from './PerpendicularParkingBayB';
import { PerpendicularParkingBayC, type PerpendicularParkingBayCOptions } from './PerpendicularParkingBayC';
import { RoadStraight955, type RoadStraight955Options } from './RoadStraight955';
import type { ExamVehicleClass } from './exam/examRules';
import type { ParkingTimerGate } from './exercises/Exam07ParkingTimer';
import { getWindingCourseSpec, validateWindingCourseSpec } from './WindingCourseSpec';
import {
    createRoadArrowTexture,
    STRAIGHT_ROAD_ARROW_LENGTH_M,
    STRAIGHT_ROAD_ARROW_WIDTH_M,
} from './straightRoadArrow';

type ArrowType = 'straight' | 'straight-right' | 'left' | 'right' | 'diagonal-left' | 'diagonal-right' | 'none';
type RoadDirection = 'vertical' | 'horizontal';
type LaneCount = 1 | 2 | 3;
type CenterLineType = 'white-dashed' | 'white-solid' | 'yellow-dashed' | 'yellow-solid';
type RoadRect = { minX: number; maxX: number; minZ: number; maxZ: number };
export type RoadSegment = {
    group: THREE.Group;
    x: number;
    z: number;
    direction: RoadDirection;
    bounds: RoadRect;
    /** Actual rectangle in group coordinates; avoids false cuts from a rotated road's world AABB. */
    localFootprint?: RoadRect;
};
export type AutoDriveWaypointStop = { id: string; root: THREE.Group; widthM: number; lengthM: number; laneOffsetM: number };
export type WindingCourseEntry = {
    vehicleClass: ExamVehicleClass;
    course: SCurveTrack;
    entryRoadIndex: number;
    exitRoadIndex: number;
    /** Length of the straight entry road segment that leads into the winding course. */
    _entryLength: number;
    /** Length of the straight exit road segment that follows the winding course. */
    _exitLength: number;
};
export type ParkingClassZone = {
    root: THREE.Object3D;
    vehicleClass: ExamVehicleClass;
    bounds: THREE.Box3;
};
export class TrackObjects {
    readonly parkingClassZones: ParkingClassZone[] = [];
    readonly parkingTimerGates: ParkingTimerGate[] = [];
    readonly perpendicularParkingBoundaryGroups: THREE.Group[] = [];
    exam05To06LaneRule?: { road: THREE.Group; widthM: number; lengthM: number };
    readonly root = new THREE.Group();
    showRoadLaneNumbers = false;
    readonly straightRoadEdgeReplacements: Array<{
        name: string; x: number; toX?: number; fromZ: number; toZ: number; grassSide: -1 | 1;
    }> = [];

    /** Rebuild declared continuous edges after intersection clipping, removing old stubs first. */
    rebuildStraightRoadEdges(): void {
        this.root.updateWorldMatrix(true, true);
        for (const edge of this.straightRoadEdgeReplacements) {
            const dx = (edge.toX ?? edge.x) - edge.x, dz = edge.toZ - edge.fromZ;
            const totalLength = Math.hypot(dx, dz);
            const tx = dx / totalLength, tz = dz / totalLength;
            const obsolete: THREE.Mesh[] = [];
            this.root.traverse(object => {
                if (!(object instanceof THREE.Mesh) || !object.name.endsWith('red-white-curb')) return;
                const positions = object.geometry.getAttribute('position');
                const point = new THREE.Vector3();
                for (let i = 0; i < positions.count; i++) {
                    point.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld);
                    const x = point.x - edge.x, z = point.z - edge.fromZ;
                    const along = x * tx + z * tz, across = x * tz - z * tx;
                    if (along < -.025 || along > totalLength + .025 || Math.abs(across) > .16) return;
                }
                obsolete.push(object);
            });
            for (const mesh of obsolete) { mesh.removeFromParent(); mesh.geometry.dispose(); }
            const group = new THREE.Group();
            group.name = edge.name;
            const materials = [0xffffff, 0xd83b3b].map(color =>
                new THREE.MeshStandardMaterial({ color, roughness: .85 }));
            for (let distance = 0, stripe = 0; distance < totalLength - 1e-6; stripe++) {
                const length = Math.min(.8, totalLength - distance);
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(
                    CURB_VISUAL_WIDTH_M, CURB_VISUAL_HEIGHT_M, length), materials[stripe % 2]);
                mesh.name = 'red-white-curb';
                const centerDistance = distance + length / 2;
                mesh.position.set(edge.x + tx * centerDistance - edge.grassSide * tz * CURB_VISUAL_WIDTH_M / 2,
                    .06 + CURB_VISUAL_HEIGHT_M / 2,
                    edge.fromZ + tz * centerDistance + edge.grassSide * tx * CURB_VISUAL_WIDTH_M / 2);
                mesh.rotation.y = Math.atan2(tx, tz);
                mesh.userData.roadEdgeGrassSide = edge.grassSide;
                group.add(mesh);
                distance += length;
            }
            this.root.add(group);
        }
    }

    private addLaneNumber(parent: THREE.Group, lane: number, x: number, z: number,
        y = .095, rotationY = 0): void {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#ffffff';
        context.font = 'bold 88px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String(lane), 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const label = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
        label.name = `lane-number-${lane}`;
        label.rotation.set(-Math.PI / 2, 0, 0);
        label.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationY);
        label.position.set(x, y, z);
        parent.add(label);
    }
    readonly penaltyZones: THREE.Box3[] = [];
    readonly curvedBoundaryChecks: { groupIndex: number; touches: (wheel: THREE.Vector3) => boolean }[] = [];
    /** Các đoạn vạch trong cùng một chuồng S dùng chung thời gian chờ báo lỗi. */
    readonly penaltyZoneGroupIndices: number[] = [];
    private readonly bridges: Bridge[] = [];
    /** Tất cả traffic lights trong scene. Exposed để ExamEngine tra cứu theo markerId. */
    readonly trafficLights: TrafficLight[] = [];
    readonly railwayCrossings: RailwayCrossingRoad[] = [];
    readonly autoDriveWaypointStops: AutoDriveWaypointStop[] = [];
    startSignal: TrafficLight | null = null;
    /**
     * Exam04 course sensors for all 4 wheel-track courses.
     * Populated by buildExamGround after addWheelTrackCourse() calls.
     */
    wheelTrackCourseSensors: ReturnType<TrackObjects['addWheelTrackCourse']>[] = [];

    update(dt: number, vehiclePosition: THREE.Vector3) {
        for (const light of this.trafficLights) light.update(dt, vehiclePosition);
    }

    reset() {
        for (const light of this.trafficLights) light.reset();
        if (this.startSignal) this.startSignal.reset();
    }
    addTrafficLight(x: number, z: number, width = 8, rotation = 0, options: TrafficLightOptions = {}) {
        const signal = new TrafficLight(x, z, width, rotation, options);
        this.trafficLights.push(signal);
        this.root.add(signal.root);
        return signal;
    }

    /**
     * Tra cứu traffic light theo markerId (e.g. 'SOUTH', 'NORTH', 'WEST', 'EAST', 'START').
     * Trả về `undefined` nếu không tìm thấy.
     */
    getTrafficLight(markerId: string): TrafficLight | undefined {
        return this.trafficLights.find(l => l.markerId === markerId);
    }

    private readonly roads: RoadSegment[] = [];
    /** Registry of all WindingCourse placements so the editor can find/rebuild/persist them. */
    private readonly windingCourses: WindingCourseEntry[] = [];
    /**
     * Các "vật cản" không phải road (vd: ParallelParkingBayB, cột đèn, vật thể trang trí…)
     * dùng làm nguồn cut cho `roads[]` trong `connectRoadIntersections()`. Các vật cản
     * KHÔNG bị iterate để trim các mesh của chính nó — chỉ mesh của `roads[]` bị trim.
     */
    private readonly roadObstacles: RoadSegment[] = [];
    private readonly roadCornerCurves: RoadCornerCurveR8R9[] = [];
    private readonly parallelParkingBays: ParallelParkingBayB[] = [];

    /** Round the grass heads between the approach road and the four exam-4 entrances. */
    addWheelTrackEntryIslandCaps(
        entries: Array<{ entryWorld: THREE.Vector3; roadWidthM: number; courseRoot: THREE.Group }>,
        roadEdgeX: number,
        radiiM: readonly number[],
    ): void {
        const ordered = [...entries].sort((a, b) => b.entryWorld.z - a.entryWorld.z);
        const island = new THREE.Group();
        island.name = 'wheel-track-entry-island-caps';
        this.root.add(island);
        const asphalt = new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide });
        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        const shape = (points: Point[]) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
        const addAsphalt = (outline: Point[]) => {
            const geometry = new THREE.ShapeGeometry(shape(outline));
            geometry.rotateX(-Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, asphalt);
            mesh.name = 'wheel-track-entry-cap-asphalt';
            mesh.position.y = .061;
            mesh.receiveShadow = true;
            island.add(mesh);
        };
        const trimStraightCurb = (courseRoot: THREE.Group, edgeZ: number, tangentX: number, grassSide: number,
            pathSide = grassSide) => {
            courseRoot.updateMatrixWorld(true);
            const obsolete: THREE.Mesh[] = [];
            let remainingEndX = -Infinity;
            courseRoot.traverse(child => {
                if (!(child instanceof THREE.Mesh) || child.name !== 'red-white-curb') return;
                const box = new THREE.Box3().setFromObject(child);
                if (Math.abs(box.getCenter(new THREE.Vector3()).z - edgeZ) > .3) return;
                if (box.max.x > tangentX + .005 && box.min.x < roadEdgeX + .3) obsolete.push(child);
                else if (box.max.x <= tangentX + .005) remainingEndX = Math.max(remainingEndX, box.max.x);
            });
            for (const curb of obsolete) {
                curb.removeFromParent();
                curb.geometry.dispose();
            }
            const gap = tangentX - remainingEndX;
            if (gap > .01 && gap < 1) {
                const bridge = new THREE.Mesh(new THREE.BoxGeometry(
                    gap, CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M), curbMaterials[0]);
                bridge.position.set(remainingEndX + gap / 2, .085,
                    edgeZ + grassSide * CURB_VISUAL_WIDTH_M / 2);
                bridge.name = 'red-white-curb';
                bridge.userData.roadEdgeGrassPath = [
                    [pathSide * gap / 2, CURB_VISUAL_HEIGHT_M / 2, pathSide * CURB_VISUAL_WIDTH_M / 2],
                    [-pathSide * gap / 2, CURB_VISUAL_HEIGHT_M / 2, pathSide * CURB_VISUAL_WIDTH_M / 2],
                ];
                bridge.castShadow = true;
                bridge.receiveShadow = true;
                island.add(bridge);
            }
        };

        for (let i = 0; i < ordered.length - 1; i++) {
            const upper = ordered[i];
            const lower = ordered[i + 1];
            const zMin = lower.entryWorld.z + lower.roadWidthM / 2;
            const zMax = upper.entryWorld.z - upper.roadWidthM / 2;
            const width = zMax - zMin;
            if (width <= 0) continue;
            const radius = Math.min(radiiM[i] ?? width / 2, width / 2);
            const tangentX = roadEdgeX - radius;
            const segments = Math.max(8, Math.ceil(radius * 8));
            const lowerArc: Point[] = [];
            const upperArc: Point[] = [];
            for (let j = 0; j <= segments; j++) {
                const lowerAngle = -Math.PI / 2 + j * Math.PI / (2 * segments);
                lowerArc.push([
                    tangentX + radius * Math.cos(lowerAngle),
                    zMin + radius + radius * Math.sin(lowerAngle),
                ]);
                const upperAngle = j * Math.PI / (2 * segments);
                upperArc.push([
                    tangentX + radius * Math.cos(upperAngle),
                    zMax - radius + radius * Math.sin(upperAngle),
                ]);
            }
            addAsphalt([[roadEdgeX, zMin], ...lowerArc.slice().reverse()]);
            addAsphalt([[roadEdgeX, zMax - radius], [roadEdgeX, zMax], ...upperArc.slice().reverse()]);

            const curbPath: Point[] = [...lowerArc];
            if (width > 2 * radius + 1e-6) curbPath.push(upperArc[0]);
            curbPath.push(...upperArc.slice(1));
            const lowerArcLength = radius * Math.PI / 2;
            const upperArcStart = lowerArcLength + width - 2 * radius;
            const upperIsApproachRoad = upper.courseRoot.name === 'road';
            const smoothstep = (value: number) => {
                const t = THREE.MathUtils.clamp(value, 0, 1);
                return t * t * (3 - 2 * t);
            };
            let distanceAlongCurb = 0;
            splitByPattern(curbPath, [.8]).forEach((piece, index) => {
                const roadSide: Point[] = [];
                const grassSide: Point[] = [];
                piece.forEach(([x, z], pointIndex) => {
                    if (pointIndex > 0) {
                        const previous = piece[pointIndex - 1];
                        distanceAlongCurb += Math.hypot(x - previous[0], z - previous[1]);
                    }
                    // Course curbs extend into grass; the main-road curb extends
                    // into asphalt. Move the visible band across the arc so both
                    // tangent ends meet their existing straight curb flush.
                    const side = distanceAlongCurb < lowerArcLength
                        ? 1 - 2 * smoothstep(distanceAlongCurb / lowerArcLength)
                        : distanceAlongCurb < upperArcStart || upperIsApproachRoad
                            ? -1
                            : -1 + 2 * smoothstep((distanceAlongCurb - upperArcStart) / lowerArcLength);
                    // Use the same inward normal on both sides of every colour
                    // seam, with exact tangent normals at the straight joins.
                    const centerZ = THREE.MathUtils.clamp(z, zMin + radius, zMax - radius);
                    const normalLength = Math.hypot(tangentX - x, centerZ - z);
                    const normalX = (tangentX - x) / normalLength;
                    const normalZ = (centerZ - z) / normalLength;
                    const offset = -CURB_VISUAL_WIDTH_M / 2 * (1 - side);
                    roadSide.push([x + normalX * offset, z + normalZ * offset]);
                    grassSide.push([x + normalX * (offset + CURB_VISUAL_WIDTH_M),
                    z + normalZ * (offset + CURB_VISUAL_WIDTH_M)]);
                });
                const outline = roadSide.concat([...grassSide].reverse());
                const geometry = new THREE.ExtrudeGeometry(shape(outline), {
                    depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
                });
                geometry.rotateX(-Math.PI / 2);
                const curb = new THREE.Mesh(geometry, curbMaterials[index % 2]);
                curb.position.y = .06;
                curb.name = 'red-white-curb';
                // Keep the known grass-facing curve: tight C1/D caps are too
                // short for a principal-axis estimate to distinguish their ends.
                curb.userData.roadEdgeGrassPath = grassSide.map(([x, z]) =>
                    [x, CURB_VISUAL_HEIGHT_M, z]).reverse();
                curb.castShadow = true;
                curb.receiveShadow = true;
                island.add(curb);
            });

            // Remove the old straight curb of the main road across this cap.
            this.roadObstacles.push({
                group: island, x: roadEdgeX, z: (zMin + zMax) / 2, direction: 'vertical',
                bounds: { minX: roadEdgeX - .3, maxX: roadEdgeX + .3, minZ: zMin, maxZ: zMax },
            });
            trimStraightCurb(lower.courseRoot, zMin, tangentX, 1);
            trimStraightCurb(upper.courseRoot, zMax, tangentX, upperIsApproachRoad ? 1 : -1, -1);
        }
    }

    /** Làn nhập đường 3,7 m trước bốn lối ra, cùng các đầu bãi cỏ bo theo CAD. */
    addWheelTrackExitApron(
        exits: Array<{ exitWorld: THREE.Vector3; roadWidthM: number; courseRoot: THREE.Group }>,
        roadEdgeX: number,
        laneWidthM = 3.7,
    ) {
        if (exits.length < 2) return;
        const ordered = [...exits].sort((a, b) => b.exitWorld.z - a.exitWorld.z);
        const apronEndX = roadEdgeX + laneWidthM;
        const upperZ = ordered[0].exitWorld.z + ordered[0].roadWidthM / 2;
        const lowerZ = ordered[ordered.length - 1].exitWorld.z - ordered[ordered.length - 1].roadWidthM / 2;
        const apron = new THREE.Group();
        apron.name = 'wheel-track-exit-apron';
        this.root.add(apron);

        const asphaltMaterial = new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide });
        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        const shape = (points: Array<[number, number]>) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
        const addAsphalt = (outline: Array<[number, number]>) => {
            const geometry = new THREE.ShapeGeometry(shape(outline));
            geometry.rotateX(-Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, asphaltMaterial);
            mesh.position.y = .061;
            mesh.name = 'wheel-track-exit-apron-asphalt';
            mesh.receiveShadow = true;
            apron.add(mesh);
        };
        type ArcPoint = { x: number; z: number; nx: number; nz: number };
        const addArc = (point: (t: number) => ArcPoint, lengthM: number) => {
            const stripeCount = Math.max(1, Math.ceil(lengthM / .8));
            for (let i = 0; i < stripeCount; i++) {
                const inner = Array.from({ length: 5 }, (_, j) => point((i + j / 4) / stripeCount));
                const outline: Array<[number, number]> = [
                    ...inner.map(p => [p.x, p.z] as [number, number]),
                    ...inner.slice().reverse().map(p => [
                        p.x + CURB_VISUAL_WIDTH_M * p.nx,
                        p.z + CURB_VISUAL_WIDTH_M * p.nz,
                    ] as [number, number]),
                ];
                const geometry = new THREE.ExtrudeGeometry(shape(outline), {
                    depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
                });
                geometry.rotateX(-Math.PI / 2);
                const curb = new THREE.Mesh(geometry, curbMaterials[i % 2]);
                curb.position.y = .06;
                curb.name = 'red-white-curb';
                curb.castShadow = true;
                curb.receiveShadow = true;
                apron.add(curb);
            }
        };
        const trimCourseCurb = (courseRoot: THREE.Group, edgeZ: number, tangentX: number, grassSide: number) => {
            courseRoot.updateMatrixWorld(true);
            const obsolete: THREE.Mesh[] = [];
            let nextCurbX = Infinity;
            courseRoot.traverse(child => {
                if (!(child instanceof THREE.Mesh) || child.name !== 'red-white-curb') return;
                const box = new THREE.Box3().setFromObject(child);
                const center = box.getCenter(new THREE.Vector3());
                if (Math.abs(center.z - edgeZ) > .3) return;
                if (center.x >= roadEdgeX - .3 && center.x < tangentX) obsolete.push(child);
                else if (center.x >= tangentX) nextCurbX = Math.min(nextCurbX, box.min.x);
            });
            for (const curb of obsolete) {
                curb.removeFromParent();
                curb.geometry.dispose();
            }
            // Các đoạn curb cũ chia từng 0,8 m; nối phần lẻ tại tiếp tuyến.
            const gap = nextCurbX - tangentX;
            if (gap > .01 && gap < 1) {
                const bridge = new THREE.Mesh(
                    new THREE.BoxGeometry(gap, CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M), curbMaterials[0],
                );
                bridge.position.set(tangentX + gap / 2, .085,
                    edgeZ + grassSide * CURB_VISUAL_WIDTH_M / 2);
                bridge.name = 'red-white-curb';
                bridge.castShadow = true;
                bridge.receiveShadow = true;
                apron.add(bridge);
            }
        };

        // Phủ kín khoảng còn thiếu giữa đường một làn và miệng các chuồng.
        addAsphalt([
            [roadEdgeX - CURB_VISUAL_WIDTH_M, lowerZ], [apronEndX, lowerZ],
            [apronEndX, upperZ], [roadEdgeX - CURB_VISUAL_WIDTH_M, upperZ],
        ]);
        // Mở liên tục bó vỉa cũ của đường chính trên toàn chiều rộng lối nhập.
        this.roadObstacles.push({
            group: apron, x: roadEdgeX, z: lowerZ, direction: 'horizontal',
            bounds: { minX: roadEdgeX - .3, maxX: roadEdgeX + .2, minZ: lowerZ, maxZ: upperZ },
        });

        for (let i = 0; i < ordered.length - 1; i++) {
            const upper = ordered[i];
            const lower = ordered[i + 1];
            const zMin = lower.exitWorld.z + lower.roadWidthM / 2;
            const zMax = upper.exitWorld.z - upper.roadWidthM / 2;
            if (zMax <= zMin) continue;
            const radius = (zMax - zMin) / 2;
            const centerZ = (zMin + zMax) / 2;
            const tangentX = apronEndX + radius;
            const point = (t: number): ArcPoint => {
                const angle = -Math.PI / 2 + Math.PI * t;
                return {
                    x: tangentX - radius * Math.cos(angle),
                    z: centerZ + radius * Math.sin(angle),
                    nx: Math.cos(angle), nz: -Math.sin(angle),
                };
            };
            const arc = Array.from({ length: 49 }, (_, j) => point(j / 48));
            addAsphalt([
                [apronEndX, zMin], [apronEndX, zMax],
                ...arc.slice().reverse().map(p => [p.x, p.z] as [number, number]),
            ]);
            addArc(point, Math.PI * radius);
            trimCourseCurb(lower.courseRoot, zMin, tangentX, 1);
            trimCourseCurb(upper.courseRoot, zMax, tangentX, -1);
        }

        // Bãi cỏ ngoài cùng có góc R10 giữa mép đường và cạnh lối ra cuối.
        const outerRadius = 10;
        const outerCenterX = roadEdgeX + outerRadius;
        const outerCenterZ = lowerZ - outerRadius;
        const outerPoint = (t: number): ArcPoint => {
            const angle = Math.PI / 2 + Math.PI / 2 * t;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            // Curb của FourLaneRoad nằm *trong* mép roadEdgeX. Đưa đầu cung
            // vào đúng bề rộng curb để mép ngoài cung trùng mép ngoài đoạn thẳng.
            const blend = t * t * (3 - 2 * t);
            const dx = -outerRadius * sin * Math.PI / 2
                - CURB_VISUAL_WIDTH_M * 6 * t * (1 - t);
            const dz = outerRadius * cos * Math.PI / 2;
            const tangentLength = Math.hypot(dx, dz);
            return {
                x: outerCenterX + outerRadius * cos - CURB_VISUAL_WIDTH_M * blend,
                z: outerCenterZ + outerRadius * sin,
                nx: -dz / tangentLength, nz: dx / tangentLength,
            };
        };
        const outerArc = Array.from({ length: 65 }, (_, i) => outerPoint(i / 64));
        addAsphalt([[roadEdgeX, lowerZ], ...outerArc.map(p => [p.x, p.z] as [number, number])]);
        addArc(outerPoint, outerRadius * Math.PI / 2);
        trimCourseCurb(ordered[ordered.length - 1].courseRoot, lowerZ, outerCenterX, -1);
        this.roadObstacles.push({
            group: apron, x: roadEdgeX, z: outerCenterZ, direction: 'horizontal',
            bounds: { minX: roadEdgeX - .3, maxX: roadEdgeX + .2, minZ: outerCenterZ, maxZ: lowerZ },
        });
    }

    /** Bo R2 góc trên bên trái đường một làn tại lối ra hạng B. */
    addWheelTrackExitUpperCorner(
        road: FourLaneRoad,
        exit: { exitWorld: THREE.Vector3; roadWidthM: number },
        radiusM: number,
    ): void {
        const topSection = road.footprints[road.footprints.length - 1];
        const leftX = road.root.position.x + topSection.minX;
        const rightX = road.root.position.x + topSection.maxX;
        const roadTopZ = road.root.position.z + topSection.maxZ;
        const exitTopZ = exit.exitWorld.z + exit.roadWidthM / 2;
        const centerX = leftX + radiusM;
        const centerZ = exitTopZ - radiusM;
        const group = new THREE.Group();
        group.name = 'wheel-track-exit-b-upper-r2-corner';
        this.root.add(group);

        const shape = (points: Point[]) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
        const addGrass = (outline: Point[]) => {
            const geometry = new THREE.ShapeGeometry(shape(outline));
            geometry.rotateX(-Math.PI / 2);
            const grass = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({
                    map: createGrassSurfaceTexture(), roughness: 1, side: THREE.DoubleSide,
                }),
            );
            grass.name = 'wheel-track-exit-corner-grass';
            grass.position.y = .07;
            grass.receiveShadow = true;
            group.add(grass);
        };
        const arcPoint = (t: number, radius: number): Point => {
            const angle = Math.PI / 2 + t * Math.PI / 2;
            return [centerX + radius * Math.cos(angle), centerZ + radius * Math.sin(angle)];
        };
        const arcLength = radiusM * Math.PI / 2;
        const arcStripes = Math.ceil(arcLength / .8);
        const curbPoint = (t: number, grassSide: boolean): Point => {
            const blend = t * t * (3 - 2 * t);
            // The main road curb sits inside its left edge, while the B-exit
            // curb sits outside its upper edge. Shift the band across the arc
            // so both tangents join the existing straight curbs flush.
            const radius = grassSide
                ? radiusM + CURB_VISUAL_WIDTH_M * (1 - blend)
                : radiusM - CURB_VISUAL_WIDTH_M * blend;
            return arcPoint(t, radius);
        };
        // Match the actual outer paint edge and its tessellation. The grass is
        // above the paint, so a nominal-radius mask would cover part of the band.
        const grassArc = Array.from({ length: arcStripes * 4 + 1 }, (_, i) =>
            curbPoint(i / (arcStripes * 4), true));
        // Một miếng cỏ duy nhất che góc vuông thừa của mặt đường section 1 làn
        // (BoxGeometry cao -0,02..0,06). Miếng cỏ lấn ra ngoài mép hộp asphalt
        // một khoảng để che luôn thành đứng của hộp — nếu không, khi nhìn xiên
        // thành hộp lộ ra thành nét đen hình chữ L quanh góc bo.
        const wallCoverM = .3;
        const coverTopZ = Math.max(roadTopZ, exitTopZ) + wallCoverM;
        addGrass([
            [leftX - wallCoverM, centerZ],
            [leftX - wallCoverM, coverTopZ],
            [rightX + wallCoverM, coverTopZ],
            [rightX + wallCoverM, exitTopZ + CURB_VISUAL_WIDTH_M],
            ...grassArc,
        ]);

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        for (let i = 0; i < arcStripes; i++) {
            const asphaltSide = Array.from({ length: 5 }, (_, j) =>
                curbPoint((i + j / 4) / arcStripes, false));
            const grassSide = Array.from({ length: 5 }, (_, j) =>
                curbPoint((i + (4 - j) / 4) / arcStripes, true));
            const geometry = new THREE.ExtrudeGeometry(shape([...asphaltSide, ...grassSide]), {
                depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
            });
            geometry.rotateX(-Math.PI / 2);
            const curb = new THREE.Mesh(geometry, curbMaterials[i % 2]);
            curb.name = 'red-white-curb';
            curb.position.y = .06;
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }

        // Continue the top curb to the existing straight curb on the B exit.
        const bridgeLength = exit.exitWorld.x - centerX;
        for (let offset = 0, stripe = 0; offset < bridgeLength; offset += .8, stripe++) {
            const length = Math.min(.8, bridgeLength - offset);
            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(length, CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M),
                curbMaterials[(arcStripes + stripe) % 2],
            );
            curb.name = 'red-white-curb';
            curb.position.set(centerX + offset + length / 2, .085,
                exitTopZ + CURB_VISUAL_WIDTH_M / 2);
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }

        // Cut only the former straight curb on the left edge of this corner.
        this.roadObstacles.push({
            group, x: leftX, z: exitTopZ, direction: 'vertical',
            bounds: {
                minX: leftX - .2, maxX: leftX + .25,
                minZ: centerZ, maxZ: roadTopZ + .2,
            },
        });
    }

    /** Nối hai mép đường kết thúc vào đúng cạnh của section 1 và 3 làn. */
    addFinishRoadJunctionCorners(
        finishRoad: THREE.Group,
        splitRoad: FourLaneRoad,
        oneLaneRadiusM: number,
        threeLaneRadiusM: number,
        yellowLineEnd: Point,
    ): void {
        const finishSurface = finishRoad.getObjectByName('road-surface');
        if (!finishSurface || splitRoad.footprints.length < 2) return;
        finishRoad.updateMatrixWorld(true);
        const finishBounds = new THREE.Box3().setFromObject(finishSurface);
        const sections = [...splitRoad.footprints].sort((a, b) => b.maxZ - a.maxZ);
        const corners = [
            {
                name: 'one-lane',
                edgeX: splitRoad.root.position.x + sections[0].minX,
                edgeZ: finishBounds.max.z,
                zSide: 1,
                radius: oneLaneRadiusM,
            },
            {
                name: 'three-lane',
                edgeX: splitRoad.root.position.x + sections[sections.length - 1].minX,
                edgeZ: finishBounds.min.z,
                zSide: -1,
                radius: threeLaneRadiusM,
            },
        ];
        const group = new THREE.Group();
        group.name = 'finish-road-section-junction-corners';
        this.root.add(group);
        const asphaltMaterial = new THREE.MeshStandardMaterial({
            color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide,
        });
        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        const shape = (points: Point[]) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));

        for (const { name, edgeX, edgeZ, zSide, radius } of corners) {
            const centerX = edgeX - radius;
            const centerZ = edgeZ + zSide * radius;
            const arcPoint = (t: number, r: number): Point => {
                const angle = -zSide * (1 - t) * Math.PI / 2;
                return [centerX + r * Math.cos(angle), centerZ + r * Math.sin(angle)];
            };
            const arc = Array.from({ length: 49 }, (_, i) => arcPoint(i / 48, radius));
            const asphaltGeometry = new THREE.ShapeGeometry(shape([[edgeX, edgeZ], ...arc]));
            asphaltGeometry.rotateX(-Math.PI / 2);
            const asphalt = new THREE.Mesh(asphaltGeometry, asphaltMaterial);
            asphalt.name = `finish-road-${name}-corner-asphalt`;
            asphalt.position.y = .061;
            asphalt.receiveShadow = true;
            group.add(asphalt);

            if (name === 'one-lane') {
                // The CAD 5A marking has a straight top and two opposing
                // rounded sides that meet at the lower tangent. Its outside
                // edge is R6.9; the existing R7 curb is the other side.
                const outerRadius = radius - .1;
                const outerArc: Point[] = Array.from({ length: 49 }, (_, i) => {
                    const angle = i / 48 * Math.PI / 2;
                    return [
                        centerX + outerRadius * Math.cos(angle),
                        edgeZ - zSide * outerRadius + zSide * outerRadius * Math.sin(angle),
                    ];
                });
                const wedge: Point[] = [...arc, ...outerArc.slice(0, -1)];
                const wedgeGeometry = new THREE.ShapeGeometry(shape(wedge));
                wedgeGeometry.rotateX(-Math.PI / 2);
                const stripePaint = new THREE.ShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms: {
                        centerX: { value: centerX },
                        edgeZ: { value: edgeZ },
                        radius: { value: radius },
                        outerRadius: { value: outerRadius },
                        zSide: { value: zSide },
                    },
                    vertexShader: `
                        varying vec2 ground;
                        void main() {
                            vec4 world = modelMatrix * vec4(position, 1.0);
                            ground = world.xz;
                            gl_Position = projectionMatrix * viewMatrix * world;
                        }
                    `,
                    fragmentShader: `
                        uniform float centerX;
                        uniform float edgeZ;
                        uniform float radius;
                        uniform float outerRadius;
                        uniform float zSide;
                        varying vec2 ground;
                        void main() {
                            float u = (ground.x - centerX) / radius;
                            float v = zSide * (ground.y - edgeZ) / radius;
                            float diagonal = (u + v) * radius * 0.70710678;
                            float band = mod(diagonal + 0.19, 0.8);
                            float boundary = min(
                                (1.0 - u) * radius,
                                length(vec2(
                                    ground.x - centerX,
                                    zSide * (ground.y - edgeZ) + outerRadius
                                )) - outerRadius
                            );
                            if (band > 0.38 && boundary > 0.055) discard;
                            gl_FragColor = vec4(1.0);
                        }
                    `,
                });
                const hatching = new THREE.Mesh(wedgeGeometry, stripePaint);
                hatching.name = 'finish-road-one-lane-hatching';
                hatching.position.y = .083;
                group.add(hatching);

                // The left edge of this single straight strip follows the
                // hatch's straight A-to-B edge from the R7 curb to the stop bar.
                const lineWidth = .15;
                const lineStartZ = edgeZ + radius;
                const lineStartX = edgeX + lineWidth / 2;
                const lineDx = yellowLineEnd[0] - lineStartX;
                const lineDz = yellowLineEnd[1] - lineStartZ;
                const lineLength = Math.hypot(lineDx, lineDz);
                if (lineLength > .001) {
                    const yellowLine = new THREE.Mesh(
                        new THREE.BoxGeometry(lineWidth, .004, lineLength),
                        new THREE.MeshStandardMaterial({
                            color: 0xf6d34c, roughness: .8, side: THREE.DoubleSide,
                        }),
                    );
                    yellowLine.name = 'finish-road-one-lane-hatching-yellow-extension';
                    yellowLine.position.set((lineStartX + yellowLineEnd[0]) / 2, .089,
                        (lineStartZ + yellowLineEnd[1]) / 2);
                    yellowLine.rotation.y = Math.atan2(lineDx, lineDz);
                    group.add(yellowLine);
                }
            }

            const stripeCount = Math.ceil(radius * Math.PI / 2 / .8);
            for (let i = 0; i < stripeCount; i++) {
                const inner = Array.from({ length: 5 }, (_, j) =>
                    arcPoint((i + j / 4) / stripeCount, radius));
                const outer = Array.from({ length: 5 }, (_, j) =>
                    arcPoint((i + (4 - j) / 4) / stripeCount, radius + CURB_VISUAL_WIDTH_M));
                const geometry = new THREE.ExtrudeGeometry(shape([...inner, ...outer]), {
                    depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
                });
                geometry.rotateX(-Math.PI / 2);
                const curb = new THREE.Mesh(geometry, curbMaterials[i % 2]);
                curb.name = 'red-white-curb';
                curb.position.y = .06;
                curb.castShadow = true;
                curb.receiveShadow = true;
                group.add(curb);
            }

            // Keep the two tangent points clear of the original straight curbs.
            this.roadObstacles.push({
                group, x: centerX, z: edgeZ, direction: 'horizontal',
                bounds: {
                    minX: centerX, maxX: edgeX + .01,
                    minZ: edgeZ - .25, maxZ: edgeZ + .25,
                },
            });
            this.roadObstacles.push({
                group, x: edgeX, z: centerZ, direction: 'vertical',
                bounds: {
                    minX: edgeX - .25, maxX: edgeX + .25,
                    minZ: Math.min(edgeZ, centerZ),
                    maxZ: Math.max(edgeZ, centerZ),
                },
            });
        }
    }

    /** Bo góc bồn cỏ ở giao giữa đường dọc và đường ngang về phía đông-bắc. */
    addRoadCornerR7_5(cornerX: number, cornerZ: number) {
        const radiusM = 7.5;
        const centerX = cornerX + radiusM;
        const centerZ = cornerZ + radiusM;
        const group = new THREE.Group();
        group.name = 'road-corner-r7-5';
        this.root.add(group);

        const toShape = (points: Array<[number, number]>) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
        const arcPoint = (t: number, radius: number): [number, number] => {
            const angle = -Math.PI / 2 - t * Math.PI / 2;
            return [centerX + radius * Math.cos(angle), centerZ + radius * Math.sin(angle)];
        };
        const arcPoints = Array.from({ length: 65 }, (_, i) => arcPoint(i / 64, radiusM));
        const asphaltOutline: Array<[number, number]> = [
            [cornerX, cornerZ],
            [centerX, cornerZ],
            ...arcPoints.slice(1, -1),
            [cornerX, centerZ],
        ];
        const asphaltGeometry = new THREE.ShapeGeometry(toShape(asphaltOutline));
        asphaltGeometry.rotateX(-Math.PI / 2);
        const asphalt = new THREE.Mesh(
            asphaltGeometry,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide }),
        );
        asphalt.position.y = .061;
        asphalt.name = 'road-surface-r7-5-corner';
        asphalt.receiveShadow = true;
        group.add(asphalt);

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
        const stripeCount = Math.ceil(radiusM * Math.PI / 2 / .8);
        for (let i = 0; i < stripeCount; i++) {
            const samples = Array.from({ length: 5 }, (_, j) =>
                arcPoint((i + j / 4) / stripeCount, radiusM));
            const outside = Array.from({ length: 5 }, (_, j) =>
                arcPoint((i + (4 - j) / 4) / stripeCount, radiusM + CURB_VISUAL_WIDTH_M));
            const curbGeometry = new THREE.ExtrudeGeometry(
                toShape([...samples, ...outside]),
                { depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false },
            );
            curbGeometry.rotateX(-Math.PI / 2);
            const curb = new THREE.Mesh(curbGeometry, curbMaterials[i % 2]);
            curb.position.y = .06;
            curb.name = 'red-white-curb';
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }

        // Cắt hai đoạn curb thẳng trong vùng tiếp tuyến để cung R7.5 nối liền.
        this.roadObstacles.push({
            group,
            x: cornerX,
            z: cornerZ,
            direction: 'horizontal',
            // Mở rộng một phần curb vào mặt đường để hệ thống cắt được cả hai mép thẳng.
            bounds: { minX: cornerX - .25, maxX: centerX, minZ: cornerZ - .25, maxZ: centerZ },
        });
        return group;
    }

    /** Bo góc từ mép bắc hoặc nam đường ngang vào mép đường dọc. */
    addRoadJunctionCorner(
        cornerX: number,
        horizontalRoadEdgeZ: number,
        radiusM: number,
        side: 'east' | 'west',
        edge: 'north' | 'south',
        curbColorOffset = 0,
        curbWidthM = CURB_VISUAL_WIDTH_M,
        connectorCurbPlacement: 'inside' | 'centered' = 'inside',
    ): THREE.Group {
        curbWidthM = Math.min(curbWidthM, CURB_VISUAL_WIDTH_M);
        const direction = side === 'east' ? 1 : -1;
        const zDirection = edge === 'north' ? 1 : -1;
        const centerX = cornerX + direction * radiusM;
        const centerZ = horizontalRoadEdgeZ + zDirection * radiusM;
        const group = new THREE.Group();
        group.name = `road-junction-${edge}-${side}-r${radiusM}-corner`;
        this.root.add(group);

        const shape = (points: Array<[number, number]>) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
        const arcPoint = (t: number, radius: number): [number, number] => {
            const angle = side === 'east'
                ? Math.PI + zDirection * t * Math.PI / 2
                : -zDirection * t * Math.PI / 2;
            return [centerX + radius * Math.cos(angle), centerZ + radius * Math.sin(angle)];
        };
        const arc = Array.from({ length: 65 }, (_, i) => arcPoint(i / 64, radiusM));
        const asphaltGeometry = new THREE.ShapeGeometry(shape([
            [cornerX, horizontalRoadEdgeZ], ...arc, [centerX, horizontalRoadEdgeZ],
        ]));
        asphaltGeometry.rotateX(-Math.PI / 2);
        const asphalt = new THREE.Mesh(asphaltGeometry,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide }));
        asphalt.name = 'road-junction-corner-asphalt';
        asphalt.position.y = .061;
        asphalt.receiveShadow = true;
        group.add(asphalt);

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
        const stripeCount = Math.ceil(radiusM * Math.PI / 2 / .8);
        const curbArcPoint = (t: number, outer: boolean): [number, number] => {
            const connectorOffset = connectorCurbPlacement === 'centered'
                ? -curbWidthM * (1 - t) / 2 : 0;
            return arcPoint(t, radiusM + connectorOffset + (outer ? curbWidthM : 0));
        };
        for (let i = 0; i < stripeCount; i++) {
            const inside = Array.from({ length: 5 }, (_, j) =>
                curbArcPoint((i + j / 4) / stripeCount, false));
            const outside = Array.from({ length: 5 }, (_, j) =>
                curbArcPoint((i + (4 - j) / 4) / stripeCount, true));
            const geometry = new THREE.ExtrudeGeometry(shape([...inside, ...outside]), {
                depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
            });
            geometry.rotateX(-Math.PI / 2);
            const curb = new THREE.Mesh(geometry, curbMaterials[(i + curbColorOffset) % 2]);
            curb.name = 'red-white-curb';
            curb.position.y = .06;
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }

        // Hai dải cắt chỉ tác động lên curb cũ; mặt đường thẳng vẫn nguyên.
        this.roadObstacles.push({
            group, x: cornerX, z: (centerZ + horizontalRoadEdgeZ) / 2,
            direction: 'vertical',
            bounds: {
                minX: cornerX - .25, maxX: cornerX + .25,
                minZ: Math.min(centerZ, horizontalRoadEdgeZ),
                maxZ: Math.max(centerZ, horizontalRoadEdgeZ),
            },
        });
        this.roadObstacles.push({
            group, x: (cornerX + centerX) / 2, z: horizontalRoadEdgeZ,
            direction: 'horizontal',
            bounds: {
                minX: Math.min(cornerX, centerX), maxX: Math.max(cornerX, centerX),
                minZ: horizontalRoadEdgeZ - .25, maxZ: horizontalRoadEdgeZ + .25,
            },
        });
        return group;
    }

    /** Bo mép connector nghiêng để nối tiếp tuyến với bó vỉa đường ngang. */
    addAngledRoadJunctionCorner(
        edgePoint: THREE.Vector3,
        sidePoint: THREE.Vector3,
        radiusM: number,
        side: 'east' | 'west',
    ): { sideTangent: THREE.Vector3; horizontalTangent: THREE.Vector3 } {
        const dz = sidePoint.z - edgePoint.z;
        if (dz <= 0 || radiusM <= 0) {
            throw new Error('Angled road corner needs an upward side and a positive radius');
        }
        const slope = (sidePoint.x - edgePoint.x) / dz;
        const grassSide = side === 'east' ? 1 : -1;
        const normalLength = Math.hypot(1, slope);
        const centerX = edgePoint.x + slope * radiusM + grassSide * radiusM * normalLength;
        const centerZ = edgePoint.z + radiusM;
        const sideTangent = new THREE.Vector3(
            centerX - grassSide * radiusM / normalLength,
            0,
            centerZ + grassSide * radiusM * slope / normalLength,
        );
        const horizontalTangent = new THREE.Vector3(centerX, 0, edgePoint.z);
        const rawStartAngle = Math.atan2(sideTangent.z - centerZ, sideTangent.x - centerX);
        const startAngle = side === 'east' && rawStartAngle < 0
            ? rawStartAngle + 2 * Math.PI : rawStartAngle;
        const endAngle = side === 'east' ? 3 * Math.PI / 2 : -Math.PI / 2;
        const arcPoint = (t: number, radius: number): [number, number] => {
            const angle = startAngle + (endAngle - startAngle) * t;
            return [centerX + radius * Math.cos(angle), centerZ + radius * Math.sin(angle)];
        };
        const shape = (points: Array<[number, number]>) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
        const group = new THREE.Group();
        group.name = `road-junction-angled-${side}-r${radiusM}-corner`;
        this.root.add(group);

        const arc = Array.from({ length: 65 }, (_, i) => arcPoint(i / 64, radiusM));
        const asphaltGeometry = new THREE.ShapeGeometry(shape([
            [edgePoint.x, edgePoint.z], ...arc, [horizontalTangent.x, horizontalTangent.z],
        ]));
        asphaltGeometry.rotateX(-Math.PI / 2);
        const asphalt = new THREE.Mesh(asphaltGeometry,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide }));
        asphalt.name = 'road-junction-corner-asphalt';
        asphalt.position.y = .061;
        asphalt.receiveShadow = true;
        group.add(asphalt);

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
        const stripeCount = Math.ceil(radiusM * Math.abs(endAngle - startAngle) / .8);
        const arcSteps = Math.max(4, Math.ceil(Math.abs(endAngle - startAngle) / stripeCount / (Math.PI / 24)));
        for (let i = 0; i < stripeCount; i++) {
            const inside = Array.from({ length: arcSteps + 1 }, (_, j) =>
                arcPoint((i + j / arcSteps) / stripeCount, radiusM));
            const outside = Array.from({ length: arcSteps + 1 }, (_, j) =>
                arcPoint((i + (arcSteps - j) / arcSteps) / stripeCount, radiusM + CURB_VISUAL_WIDTH_M));
            const geometry = new THREE.ExtrudeGeometry(shape([...inside, ...outside]), {
                depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
            });
            geometry.rotateX(-Math.PI / 2);
            const curb = new THREE.Mesh(geometry, curbMaterials[i % 2]);
            curb.name = 'red-white-curb';
            curb.position.y = .06;
            const grassPath = inside.map(([x, z]) => [x, CURB_VISUAL_HEIGHT_M, z]);
            curb.userData.roadEdgeGrassPath = endAngle > startAngle ? grassPath.reverse() : grassPath;
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }

        // Curb của connector dừng ở sideTangent; curb ngang cũ dừng ở horizontalTangent.
        this.roadObstacles.push({
            group,
            x: (edgePoint.x + horizontalTangent.x) / 2,
            z: edgePoint.z,
            direction: 'horizontal',
            bounds: {
                minX: Math.min(edgePoint.x, horizontalTangent.x),
                maxX: Math.max(edgePoint.x, horizontalTangent.x),
                minZ: edgePoint.z - .25,
                maxZ: edgePoint.z + .25,
            },
        });
        return { sideTangent, horizontalTangent };
    }

    /** Bo R cho mép tây của lối vào hướng nam khi mép bắc đường ngang đang chạy chéo. */
    addWestRoadJunctionCornerToSlopedNorthEdge(
        connectorWestX: number,
        northEdge: THREE.Vector3[],
        radiusM: number,
        curbColorOffset = 0,
        connectorCurbPlacement: 'inside' | 'centered' = 'inside',
    ): { group: THREE.Group; roadTangent: THREE.Vector3 } {
        if (radiusM <= 0 || northEdge.length < 2) {
            throw new Error('Sloped junction needs a positive radius and a road edge');
        }
        const segmentAtX = (x: number) => {
            for (let i = 0; i < northEdge.length - 1; i++) {
                const from = northEdge[i];
                const to = northEdge[i + 1];
                if (to.x <= from.x || x < from.x || x > to.x) continue;
                const t = (x - from.x) / (to.x - from.x);
                return {
                    index: i, point: new THREE.Vector3(x, 0,
                        from.z + t * (to.z - from.z))
                };
            }
            throw new Error('Connector does not reach the sloped road edge');
        };
        const intersection = segmentAtX(connectorWestX);
        const centerX = connectorWestX - radiusM;
        let tangent: { index: number; point: THREE.Vector3; centerZ: number } | undefined;
        for (let i = 0; i <= intersection.index; i++) {
            const from = northEdge[i];
            const to = northEdge[i + 1];
            const dx = to.x - from.x;
            const dz = to.z - from.z;
            if (dx <= 0) continue;
            const length = Math.hypot(dx, dz);
            const normalX = -dz / length;
            const normalZ = dx / length;
            const t = (centerX - from.x - radiusM * normalX) / dx;
            if (t < 0 || t > 1) continue;
            const point = new THREE.Vector3(from.x + dx * t, 0, from.z + dz * t);
            if (point.x >= connectorWestX) continue;
            tangent = { index: i, point, centerZ: point.z + radiusM * normalZ };
        }
        if (!tangent) throw new Error('Cannot fit R corner to the sloped north road edge');

        const centerZ = tangent.centerZ;
        const endAngle = Math.atan2(tangent.point.z - centerZ, tangent.point.x - centerX);
        const arcPoint = (t: number, radius: number): [number, number] => {
            const angle = endAngle * t;
            return [centerX + radius * Math.cos(angle), centerZ + radius * Math.sin(angle)];
        };
        const shape = (points: Array<[number, number]>) =>
            new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
        const group = new THREE.Group();
        group.name = `road-junction-sloped-north-west-r${radiusM}-corner`;
        this.root.add(group);
        const arc = Array.from({ length: 65 }, (_, i) => arcPoint(i / 64, radiusM));
        const roadEdgeBetween = northEdge.slice(tangent.index + 1, intersection.index + 1)
            .map(point => [point.x, point.z] as [number, number]);
        const asphaltGeometry = new THREE.ShapeGeometry(shape([
            [intersection.point.x, intersection.point.z], ...arc,
            ...roadEdgeBetween, [intersection.point.x, intersection.point.z],
        ]));
        asphaltGeometry.rotateX(-Math.PI / 2);
        const asphalt = new THREE.Mesh(asphaltGeometry,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide }));
        asphalt.name = 'road-junction-corner-asphalt';
        asphalt.position.y = .061;
        asphalt.receiveShadow = true;
        group.add(asphalt);

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
        const stripeCount = Math.ceil(radiusM * Math.abs(endAngle) / .8);
        const curbArcPoint = (t: number, outer: boolean): [number, number] => {
            const connectorOffset = connectorCurbPlacement === 'centered'
                ? -CURB_VISUAL_WIDTH_M * (1 - t) / 2 : 0;
            return arcPoint(t, radiusM + connectorOffset + (outer ? CURB_VISUAL_WIDTH_M : 0));
        };
        for (let i = 0; i < stripeCount; i++) {
            const inside = Array.from({ length: 5 }, (_, j) =>
                curbArcPoint((i + j / 4) / stripeCount, false));
            const outside = Array.from({ length: 5 }, (_, j) =>
                curbArcPoint((i + (4 - j) / 4) / stripeCount, true));
            const geometry = new THREE.ExtrudeGeometry(shape([...inside, ...outside]), {
                depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
            });
            geometry.rotateX(-Math.PI / 2);
            const curb = new THREE.Mesh(geometry, curbMaterials[(i + curbColorOffset) % 2]);
            curb.name = 'red-white-curb';
            curb.position.y = .06;
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }

        this.roadObstacles.push({
            group, x: connectorWestX,
            z: (centerZ + intersection.point.z) / 2,
            direction: 'vertical',
            bounds: {
                minX: connectorWestX - .25, maxX: connectorWestX + .25,
                minZ: Math.min(centerZ, intersection.point.z),
                maxZ: Math.max(centerZ, intersection.point.z),
            },
        });
        this.roadObstacles.push({
            group, x: (tangent.point.x + connectorWestX) / 2,
            z: (tangent.point.z + intersection.point.z) / 2,
            direction: 'horizontal',
            bounds: {
                minX: tangent.point.x - .25, maxX: connectorWestX + .25,
                minZ: Math.min(tangent.point.z, intersection.point.z) - .25,
                maxZ: Math.max(tangent.point.z, intersection.point.z) + .25,
            },
        });
        return { group, roadTangent: tangent.point };
    }

    /** Nối curb thẳng giữa hai góc bo; có thể mở thêm curb cũ tới miệng connector. */
    connectRoadJunctionCurbs(startX: number, endX: number, edgeZ: number, openingEndX: number): void {
        if (endX <= startX) throw new Error('Junction curb bridge needs endX > startX');
        if (openingEndX < endX) throw new Error('Junction curb opening must reach the connector');
        const group = new THREE.Group();
        group.name = 'road-junction-curb-bridge';
        this.root.add(group);
        const materials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        const overlapM = .005;
        const fromX = startX - overlapM;
        const toX = endX + overlapM;
        for (let x = fromX, stripe = 0; x < toX - .0001; stripe++) {
            const length = Math.min(.8, toX - x);
            const curb = new THREE.Mesh(new THREE.BoxGeometry(
                length, CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M), materials[stripe % 2]);
            curb.name = 'red-white-curb';
            curb.position.set(x + length / 2, .085, edgeZ - CURB_VISUAL_WIDTH_M / 2);
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
            x += length;
        }
        this.roadObstacles.push({
            group,
            x: (startX + endX) / 2,
            z: edgeZ,
            direction: 'horizontal',
            bounds: {
                minX: fromX,
                maxX: toX,
                minZ: edgeZ - .25,
                maxZ: edgeZ + .25,
            },
        });
        // Cắt curb cũ nằm phía sau góc bo, trong nửa mặt đường ngang.
        if (openingEndX > endX + .0001) {
            this.roadObstacles.push({
                group,
                x: (endX + openingEndX) / 2,
                z: edgeZ - .1,
                direction: 'horizontal',
                bounds: {
                    minX: endX,
                    maxX: openingEndX,
                    minZ: edgeZ - .25,
                    maxZ: edgeZ + .01,
                },
            });
        }
    }

    /** Đảo tam giác kẻ sọc cyan tại góc nối đường ngang với làn nhập, mép cong R5. */
    addEastToSouthRoadTurn(entryCenterZ: number, exitCenterX: number, centerRadiusM: number, laneWidthM = 3.7) {
        const cornerRadius = centerRadiusM + laneWidthM / 2;
        const centerX = exitCenterX - centerRadiusM;
        const centerZ = entryCenterZ - centerRadiusM;
        const group = new THREE.Group();
        group.name = 'traffic-island-east-to-south-r5';
        group.position.set(centerX, 0, centerZ);
        this.root.add(group);

        // Local 2D shape coordinates use y = -worldZ before rotateX(-PI/2).
        const arcPoint = (radius: number, t: number): THREE.Vector2 => {
            const angle = Math.PI / 2 - t * Math.PI / 2;
            return new THREE.Vector2(radius * Math.cos(angle), -radius * Math.sin(angle));
        };
        const islandShape = new THREE.Shape();
        islandShape.moveTo(0, 0);
        for (let i = 0; i <= 64; i++) {
            const point = arcPoint(cornerRadius, i / 64);
            islandShape.lineTo(point.x, point.y);
        }
        islandShape.closePath();
        const hatchCanvas = document.createElement('canvas');
        hatchCanvas.width = 256;
        hatchCanvas.height = 256;
        const ctx = hatchCanvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, 256, 256);
            ctx.strokeStyle = '#00eaff';
            ctx.lineWidth = 18;
            for (let offset = -256; offset <= 512; offset += 48) {
                ctx.beginPath();
                ctx.moveTo(offset, 256);
                ctx.lineTo(offset + 256, 0);
                ctx.stroke();
            }
        }
        const hatchTexture = new THREE.CanvasTexture(hatchCanvas);
        hatchTexture.colorSpace = THREE.SRGBColorSpace;
        const hatchGeometry = new THREE.ShapeGeometry(islandShape);
        hatchGeometry.rotateX(-Math.PI / 2);
        const hatch = new THREE.Mesh(
            hatchGeometry,
            new THREE.MeshBasicMaterial({
                color: '#00eaff', map: hatchTexture, transparent: true,
                depthWrite: false, side: THREE.DoubleSide,
            }),
        );
        hatch.position.y = .074;
        hatch.name = 'traffic-island-cyan-hatch';
        group.add(hatch);

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
        const addCurbBand = (outline: THREE.Vector2[], materialIndex: number) => {
            const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(outline), {
                depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false,
            });
            geometry.rotateX(-Math.PI / 2);
            const curb = new THREE.Mesh(geometry, curbMaterials[materialIndex % curbMaterials.length]);
            curb.position.y = .06;
            curb.name = 'red-white-curb';
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        };

        // Các đoạn curb xen màu chạy liền quanh cung R5.
        const stripeCount = Math.ceil(cornerRadius * Math.PI / 2 / .8);
        for (let i = 0; i < stripeCount; i++) {
            const outline: THREE.Vector2[] = [];
            for (let j = 0; j <= 4; j++) {
                outline.push(arcPoint(cornerRadius, (i + j / 4) / stripeCount));
            }
            for (let j = 4; j >= 0; j--) {
                outline.push(arcPoint(cornerRadius + CURB_VISUAL_WIDTH_M, (i + j / 4) / stripeCount));
            }
            addCurbBand(outline, i);
        }
        // Curb thẳng khép kín hai cạnh của đảo và chạm vào hai tiếp tuyến.
        const straightCount = Math.ceil(cornerRadius / .8);
        for (let i = 0; i < straightCount; i++) {
            const from = cornerRadius * i / straightCount;
            const to = cornerRadius * (i + 1) / straightCount;
            addCurbBand([
                new THREE.Vector2(-.1, -from), new THREE.Vector2(-.1, -to),
                new THREE.Vector2(.1, -to), new THREE.Vector2(.1, -from),
            ], stripeCount + i);
            addCurbBand([
                new THREE.Vector2(from, -.1), new THREE.Vector2(to, -.1),
                new THREE.Vector2(to, .1), new THREE.Vector2(from, .1),
            ], stripeCount + straightCount + i);
        }

        // Mở curb của hai đoạn thẳng tại đúng vùng tiếp tuyến để không có curb chồng lên đảo.
        this.roadObstacles.push({
            group,
            x: centerX,
            z: centerZ,
            direction: 'horizontal',
            bounds: {
                minX: centerX - .25,
                maxX: exitCenterX + .25,
                minZ: centerZ - .25,
                maxZ: entryCenterZ + laneWidthM / 2 + .25,
            },
        });
        return group;
    }

    getSurfaceHeight(x: number, z: number) {
        for (const bridge of this.bridges) {
            const height = bridge.surfaceHeight(x, z);
            if (height !== undefined) return height;
        }
        return .06;
    }

    addBridge(x: number, z: number, direction: RoadDirection = 'vertical', widthM = 8) {
        const bridge = new Bridge(x, z, direction, widthM);
        this.bridges.push(bridge);
        this.root.add(bridge.root);
        if (this.showRoadLaneNumbers) {
            const y = (bridge.surfaceHeight(x, z) ?? .06) + .035;
            for (let lane = 1; lane <= 2; lane++) {
                this.addLaneNumber(bridge.root, lane, widthM / 2 - (lane - .5) * widthM / 2, 0, y);
            }
        }
        return bridge;
    }

    /**
     * Railway Crossing Road — đường bộ giao cắt đường sắt.
     * Theo spec/road/railway_crossing_road_spec.md
     *
     * Key constraints:
     *   STOP_LINE ⟂ ROAD_DIRECTION
     *   RAILS ⟂ ROAD_DIRECTION
     *   STOP_LINE ∥ RAILS
     *   distance(STOP_LINE, approachSideOuterRail) = 5.0 m
     */
    addRailwayCrossingRoad(opts: RailwayCrossingRoadOptions = {}): RailwayCrossingRoad {
        const road = new RailwayCrossingRoad(opts);
        this.railwayCrossings.push(road);
        this.root.add(road.root);
        return road;
    }


    private addRoadArrow(
        x: number,
        z: number,
        w: number,
        d: number,
        type: Exclude<ArrowType, 'none'>,
        parent: THREE.Group,
        rotationY = 0,
        thinStroke = false,
        diagonalAngleRad = Math.PI / 4,
    ) {
        const texture = createRoadArrowTexture(type, diagonalAngleRad);

        const arrowWidthM = Math.min(w * (thinStroke ? .42 : .5), STRAIGHT_ROAD_ARROW_WIDTH_M);
        const arrowLengthM = Math.min(d * .35, STRAIGHT_ROAD_ARROW_LENGTH_M);

        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(arrowWidthM, arrowLengthM),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
            })
        );

        arrow.rotation.x = -Math.PI / 2;
        arrow.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationY);
        arrow.position.set(x, 0.09, z); // tách khỏi mặt đường để tránh nhấp nháy khi camera di chuyển
        arrow.userData.isRoadArrow = true;
        parent.add(arrow);
        return arrow;
    }

    /** Mũi tên độc lập cho đoạn đường cần đặt khác tâm hoặc đổi chiều so với addRoad. */
    addStraightRoadArrow(
        x: number,
        z: number,
        laneWidthM: number,
        roadLengthM: number,
        rotationY = 0,
        reverse = false,
    ): THREE.Mesh {
        const arrow = this.addRoadArrow(x, z, laneWidthM, roadLengthM, 'straight', this.root, rotationY);
        if (reverse) arrow.rotateZ(Math.PI);
        return arrow;
    }

    /** Mũi tên đi thẳng có thêm nhánh rẽ chéo phải. */
    addStraightRightRoadArrow(
        x: number,
        z: number,
        laneWidthM: number,
        roadLengthM: number,
        rotationY = 0,
    ): THREE.Mesh {
        return this.addRoadArrow(x, z, laneWidthM, roadLengthM, 'straight-right', this.root, rotationY);
    }

    /** Mũi tên rẽ đặt trên đoạn đường thẳng trước khi vào cua. */
    addTurnRoadArrow(
        x: number,
        z: number,
        laneWidthM: number,
        roadLengthM: number,
        turn: 'left' | 'right',
        rotationY = 0,
    ): THREE.Mesh {
        return this.addRoadArrow(x, z, laneWidthM, roadLengthM, turn, this.root, rotationY);
    }

    /** Mũi tên rẽ chéo; đảo 180° cho làn chạy theo chiều +Z. */
    addDiagonalTurnRoadArrow(
        x: number,
        z: number,
        laneWidthM: number,
        roadLengthM: number,
        turn: 'left' | 'right' = 'right',
        reverse = false,
        rotationY = 0,
        thinStroke = false,
        diagonalAngleRad = Math.PI / 4,
    ): THREE.Mesh {
        const arrow = this.addRoadArrow(x, z, laneWidthM, roadLengthM,
            turn === 'left' ? 'diagonal-left' : 'diagonal-right', this.root,
            rotationY, thinStroke, diagonalAngleRad);
        if (reverse) arrow.rotateZ(Math.PI);
        return arrow;
    }

    private addRoadEdgePattern(
        x: number,
        z: number,
        w: number,
        d: number,
        side: 'left' | 'right',
        parent: THREE.Group,
        curbOutside = false,
        curbWidth = CURB_VISUAL_WIDTH_M,
        curbGap = 0,
    ) {
        const curbHeight = CURB_VISUAL_HEIGHT_M;
        const segmentLen = 0.8;     // độ dài mỗi đoạn đỏ/trắng
        const gap = 0.0;

        const count = Math.ceil(d / segmentLen);

        for (let i = 0; i < count; i++) {
            const length = Math.min(segmentLen, d - i * segmentLen);
            const color = i % 2 === 0 ? 0xffffff : 0xd83b3b;

            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(curbWidth, curbHeight, length - gap),
                new THREE.MeshStandardMaterial({
                    color,
                    roughness: 0.85
                })
            );

            const offsetX = side === 'left'
                ? x - w / 2 + (curbOutside ? -curbGap - curbWidth / 2 : curbWidth / 2)
                : x + w / 2 + (curbOutside ? curbGap + curbWidth / 2 : -curbWidth / 2);

            curb.position.set(
                offsetX,
                0.08 / 2 + curbHeight / 2 + 0.02,
                z - d / 2 + i * segmentLen + length / 2
            );

            curb.name = 'red-white-curb';
            curb.castShadow = true;
            curb.receiveShadow = true;
            curb.userData.roadEdgeGrassSide = side === 'left' ? -1 : 1;
            parent.add(curb);
        }
    }

    private centerLineSegments(length: number, type: CenterLineType, lanes: LaneCount = 2) {
        const material = new THREE.MeshStandardMaterial({
            color: type.startsWith('yellow') ? 0xf6d34c : 0xffffff,
            roughness: .85
        });
        const dashed = type.endsWith('dashed');
        const spans: [number, number][] = [];
        if (lanes === 1) return { material, spans };
        const dashLength = 1.5;
        const gapLength = 1;
        if (dashed) {
            for (let start = 0; start < length; start += dashLength + gapLength) {
                spans.push([start, Math.min(start + dashLength, length)]);
            }
        } else {
            spans.push([0, length]);
        }
        return { material, spans };
    }

    addRoad(
        x: number, // Tọa độ X của tâm đoạn đường trong scene
        z: number, // Tọa độ Z của tâm đoạn đường trong scene
        w: number, // Chiều rộng của đoạn đường
        d: number, // Chiều dài / chiều sâu của đoạn đường
        direction: RoadDirection = 'vertical', // Dọc theo Z hoặc ngang theo X
        arrowType: ArrowType = 'straight', // Loại mũi tên chỉ hướng: thẳng / trái / phải / không có
        centerLine: CenterLineType | readonly CenterLineType[] = 'white-dashed',
        lanes: LaneCount = 2, // w remains the total road width, regardless of lane count.
        rotationY = 0, // Optional: xoay thêm quanh trục Y (radian), áp dụng sau rotation do `direction` thiết lập.
        curbOutside = false,
        curbWidthM = CURB_VISUAL_WIDTH_M,
        curbGapM = 0,
    ) {
        // Dựng theo trục Z rồi xoay cả đoạn, bao gồm viền và mũi tên.
        const segment = new THREE.Group();
        segment.name = 'road';
        segment.position.set(x, 0, z);
        segment.rotation.y = (direction === 'horizontal' ? -Math.PI / 2 : 0) + rotationY;
        this.root.add(segment);
        const envelopeWidth = curbOutside ? w + 0.4 : w;
        segment.updateMatrix();
        const worldBox = new THREE.Box3(
            new THREE.Vector3(-envelopeWidth / 2, 0, -d / 2),
            new THREE.Vector3(envelopeWidth / 2, 0, d / 2),
        ).applyMatrix4(segment.matrix);
        this.roads.push({
            group: segment,
            x,
            z,
            direction: Math.abs(Math.sin(segment.rotation.y)) > 0.5 ? 'horizontal' : 'vertical',
            localFootprint: { minX: -envelopeWidth / 2, maxX: envelopeWidth / 2, minZ: -d / 2, maxZ: d / 2 },
            bounds: {
                minX: worldBox.min.x,
                maxX: worldBox.max.x,
                minZ: worldBox.min.z,
                maxZ: worldBox.max.z,
            },
        });

        // 1. Thân đường
        const road = new THREE.Mesh(
            new THREE.BoxGeometry(w, 0.08, d),
            new THREE.MeshStandardMaterial({
                color: ROAD_SURFACE_COLOR,   // xám mặt đường
                roughness: 0.95
            })
        );

        road.position.set(0, 0.02, 0);
        road.name = 'road-surface';
        road.receiveShadow = true;
        segment.add(road);

        // 2. Viền đỏ trắng hai bên
        this.addRoadEdgePattern(
            0,
            0,
            w,
            d,
            'left',
            segment,
            curbOutside,
            curbOutside ? CURB_VISUAL_WIDTH_M : Math.min(curbWidthM, CURB_VISUAL_WIDTH_M),
            curbOutside ? 0.10 : curbGapM,
        );
        this.addRoadEdgePattern(
            0,
            0,
            w,
            d,
            'right',
            segment,
            curbOutside,
            curbOutside ? CURB_VISUAL_WIDTH_M : Math.min(curbWidthM, CURB_VISUAL_WIDTH_M),
            curbOutside ? 0.10 : curbGapM,
        );

        // 3. Vạch phân làn; có thể đặt kiểu riêng cho từng vạch theo thứ tự local X.
        const separatorX = lanes === 1
            ? []
            : lanes === 2
                ? [0]
                : [-w / 6, w / 6];

        if (typeof centerLine !== 'string' && centerLine.length !== separatorX.length) {
            throw new Error('Number of road center-line styles must match lane separators');
        }
        for (const [index, xOffset] of separatorX.entries()) {
            const lineStyle = typeof centerLine === 'string' ? centerLine : centerLine[index];
            const { material, spans } = this.centerLineSegments(d, lineStyle, lanes);
            for (const [from, to] of spans) {
                const line = new THREE.Mesh(new THREE.BoxGeometry(.15, .008, to - from), material);
                line.name = 'road-center-line';
                line.position.set(xOffset, .067, -d / 2 + (from + to) / 2);
                line.receiveShadow = true;
                segment.add(line);
            }
        }

        // 4. Đặt mũi tên trong từng làn, tránh đè lên vạch giữa.
        if (arrowType !== 'none') {
            const laneCenters = lanes === 1
                ? [0]
                : lanes === 2
                    ? [-w / 4, w / 4]
                    : [-w / 3, 0, w / 3];
            const hasYellowSeparator = typeof centerLine === 'string'
                ? centerLine.startsWith('yellow')
                : centerLine.some(style => style.startsWith('yellow'));
            for (const laneX of laneCenters) {
                const arrow = this.addRoadArrow(laneX, 0, w / lanes, d, arrowType, segment);
                if (hasYellowSeparator && lanes > 1 && laneX < 0) {
                    // Làn trái (local X < 0) đi ngược chiều xe → xoay 180°.
                    arrow.rotateZ(Math.PI);
                }
            }
        }
        if (this.showRoadLaneNumbers && lanes >= 2) {
            for (let lane = 1; lane <= lanes; lane++) {
                this.addLaneNumber(segment, lane, w / 2 - (lane - .5) * w / lanes, -d / 4);
            }
        }
        return segment;
    }

    /**
     * Thêm road primitive tái sử dụng với width/length cấu hình theo từng instance.
     * Không có vạch làn hoặc mũi tên; chỉ gồm asphalt, mép đen và grass zone.
     */
    addRoadStraight955(opts: RoadStraight955Options): RoadStraight955 {
        const road = new RoadStraight955(opts);
        this.root.add(road.root);
        if (opts.autoDriveWaypointStopId) {
            this.autoDriveWaypointStops.push({
                id: opts.autoDriveWaypointStopId,
                root: road.root,
                widthM: road.geometry.widthM,
                lengthM: road.geometry.lengthM,
                laneOffsetM: opts.autoDriveWaypointStopLaneOffsetM ?? 0,
            });
        }

        road.root.updateMatrix();
        const { lengthM, widthM } = road.geometry;
        const worldBox = new THREE.Box3(
            new THREE.Vector3(-lengthM / 2, 0, -widthM / 2),
            new THREE.Vector3(lengthM / 2, 0, widthM / 2),
        ).applyMatrix4(road.root.matrix);
        const rotationY = opts.rotationY ?? 0;
        this.roads.push({
            group: road.root,
            x: opts.x,
            z: opts.z,
            direction: Math.abs(Math.sin(rotationY)) > 0.5 ? 'vertical' : 'horizontal',
            bounds: {
                minX: worldBox.min.x,
                maxX: worldBox.max.x,
                minZ: worldBox.min.z,
                maxZ: worldBox.max.z,
            },
        });
        return road;
    }

    /**
     * Dựng một đoạn đường thẳng 4 làn × `laneWidthM` (mặc định 4 m),
     * tổng rộng 16 m, theo trục đứng (song song world Z).
     *
     * - Lane 01 (ngoài cùng phải): đi xuống (-Z), mũi tên xoay ngược.
     * - Lane 02..04: đi lên (+Z).
     * - Giữa lane 01 và 02: vạch LIỀN (phân chia 2 chiều).
     * - Giữa 02↔03 và 03↔04: vạch ĐỨT trắng.
     * - 2 biên ngoài: curb đỏ-trắng.
     *
     * Truyền `opts.rotationY` để xoay cả đoạn đường quanh trục Y (vd. `Math.PI / 2`
     * để trục đường nằm ngang theo X).
     *
     * Xem module `FourLaneRoad` và spec/road/road_6A_object_spec.md.
     */
    addFourLaneRoad(opts: FourLaneRoadOptions): FourLaneRoad {
        const road = new FourLaneRoad(opts);
        this.root.add(road.root);
        // Register vào `roads[]` để connectRoadIntersections() xử lý giao lộ:
        // trim curb đỏ-trắng, vạch đứt/liền và bỏ mũi tên khi four-lane road
        // cắt ngang một đường đã đăng ký khác (addRoad / ...).
        // Direction: 0 hoặc ±PI → trục đứng (song song world Z, length = Z-extent);
        // ±PI/2 → trục ngang (song song world X, length = X-extent).
        const rotationY = opts.rotationY ?? 0;
        const direction: RoadDirection =
            Math.abs(Math.sin(rotationY)) > 0.5 ? 'horizontal' : 'vertical';
        // Đường nhiều section đăng ký từng section: bao chung sẽ cắt cụt các lối vào
        // nằm ở phần bậc thụt vào của section hẹp.
        road.root.updateMatrix();
        for (const footprint of road.footprints) {
            const worldBox = new THREE.Box3(
                new THREE.Vector3(footprint.minX, 0, footprint.minZ),
                new THREE.Vector3(footprint.maxX, 0, footprint.maxZ),
            ).applyMatrix4(road.root.matrix);
            this.roads.push({
                group: road.root,
                x: opts.x,
                z: opts.z,
                direction,
                bounds: {
                    minX: worldBox.min.x,
                    maxX: worldBox.max.x,
                    minZ: worldBox.min.z,
                    maxZ: worldBox.max.z,
                },
            });
        }
        return road;
    }

    /**
     * Four-Lane Bidirectional Road — đường 4 làn hai chiều.
     * Theo spec/road/road_4lane_bidirectional_spec.md
     *
     * Layout:
     * - LANE_01, LANE_02: đi xuống (-Z)
     * - LANE_03, LANE_04: đi lên (+Z)
     * - Vạch trắng đứt giữa L1/L2 và L3/L4
     * - Vạch vàng liền giữa L2/L3 (trung tâm hai chiều)
     */
    addFourLaneBidirectionalRoad(opts: FourLaneBidirectionalRoadOptions): FourLaneBidirectionalRoad {
        const road = new FourLaneBidirectionalRoad(opts);
        this.root.add(road.root);
        // Register vào `roads[]` để connectRoadIntersections() xử lý giao lộ:
        // trim curb đỏ-trắng, vạch đứt/liền và bỏ mũi tên khi four-lane bidirectional road
        // cắt ngang một đường đã đăng ký khác (addRoad / addFourLaneRoad / ...).
        // Direction: 0 hoặc ±PI → trục đứng (song song world Z, length = Z-extent);
        // ±PI/2 → trục ngang (song song world X, length = X-extent).
        const rotationY = opts.rotationY ?? 0;
        const direction: RoadDirection =
            Math.abs(Math.sin(rotationY)) > 0.5 ? 'horizontal' : 'vertical';
        // For rotationY=0: road runs along world Z → X-extent = widthM, Z-extent = lengthM
        // For rotationY=PI/2: road runs along world X → X-extent = lengthM, Z-extent = widthM
        const halfL = road.lengthM / 2;
        const halfW = road.widthM / 2;
        road.root.updateMatrix();
        // Use only the straight carriageway for rectangular intersection cuts.
        // The optional curved end is not a rectangular extension of the whole road;
        // including its radius here falsely trims nearby connector asphalt.
        const worldBox = new THREE.Box3(
            new THREE.Vector3(-halfW, 0, -halfL),
            new THREE.Vector3(halfW, 0, halfL),
        ).applyMatrix4(road.root.matrix);
        this.roads.push({
            group: road.root,
            x: opts.x,
            z: opts.z,
            direction,
            bounds: {
                minX: worldBox.min.x,
                maxX: worldBox.max.x,
                minZ: worldBox.min.z,
                maxZ: worldBox.max.z,
            },
        });
        return road;
    }

    /**
     * Khúc cua 3 làn R6/R8/R9 theo CAD.
     * Không đăng ký vào roads[]: trimmer giao lộ thay mesh bằng box theo trục và
     * sẽ phá mép chéo. connectRoadIntersections() chỉ bỏ các đoạn curb nằm trong chuồng
     * hoặc trên đường đã đăng ký khác (lối vào chuồng).
     */
    addRoadCornerCurveR8R9(opts: RoadCornerCurveR8R9Options): RoadCornerCurveR8R9 {
        const road = new RoadCornerCurveR8R9(opts);
        this.root.add(road.root);
        this.roadCornerCurves.push(road);
        return road;
    }

    /** Cắt chính xác phần curb thẳng cuối nhánh 8A trước điểm tiếp tuyến góc bo. */
    trimRoadCornerCurveEndCurb(road: RoadCornerCurveR8R9, northEdgeZ: number, tangentX: number): void {
        road.root.updateMatrixWorld(true);
        for (const child of [...road.root.children]) {
            if (!(child instanceof THREE.Mesh) || child.name !== 'red-white-curb') continue;
            const bounds = new THREE.Box3().setFromObject(child);
            if (Math.abs(bounds.getCenter(new THREE.Vector3()).z - northEdgeZ) > .25
                || bounds.max.x <= tangentX + .0001) continue;

            const keptLengthM = tangentX - bounds.min.x;
            if (keptLengthM > .001) {
                const remaining = new THREE.Mesh(new THREE.BoxGeometry(
                    keptLengthM,
                    bounds.max.y - bounds.min.y,
                    bounds.max.z - bounds.min.z,
                ), child.material);
                remaining.position.copy(road.root.worldToLocal(new THREE.Vector3(
                    (bounds.min.x + tangentX) / 2,
                    (bounds.min.y + bounds.max.y) / 2,
                    (bounds.min.z + bounds.max.z) / 2,
                )));
                remaining.name = 'red-white-curb';
                remaining.castShadow = child.castShadow;
                remaining.receiveShadow = child.receiveShadow;
                road.root.add(remaining);
            }
            child.removeFromParent();
            child.geometry.dispose();
        }
    }

    /**
     * Thêm một chuồng ghép xe ngang hạng B (B-class parallel parking bay) theo
     * spec/road/parallel_parking_bay_B_spec.md.
     *
     * Bản visual-test: chỉ dựng mesh, KHÔNG tích hợp logic sensor.
     *
     * Đăng ký vào `roadObstacles[]` (mảng riêng, KHÔNG thuộc `roads[]`) để
     * `connectRoadIntersections()` dùng làm nguồn "cut" cho curb/markings của
     * các road đã đăng ký mà KHÔNG bị iterate để trim các mesh của chính bay.
     *
     * World bounds được tính bằng Box3 + applyMatrix4 từ local bbox của bay, robust
     * với mọi rotation. Bbox bao trùm toàn bộ chuồng kể cả curb (depthM + offset + curbW).
     */
    addParallelParkingBayB(opts: ParallelParkingBayBOptions): ParallelParkingBayB {
        const bay = new ParallelParkingBayB(opts);
        this.root.add(bay.root);
        this.parallelParkingBays.push(bay);
        if (bay.joinRoadCurb && bay.curbPattern === 'red-white') {
            const width = Math.min(bay.curbWidthM, CURB_VISUAL_WIDTH_M);
            const edgeZ = bay.lengthM / 2 + bay.physicalEdgeOffsetM + bay.curbWidthM;
            bay.root.updateWorldMatrix(true, false);
            const junctions = this.root.userData.roadEdgeJunctions ??= [];
            for (const sign of [-1, 1]) {
                const p = bay.root.localToWorld(new THREE.Vector3(0, .06 + bay.curbHeightM, sign * edgeZ));
                junctions.push({ x: p.x, y: p.y, z: p.z, tolerance: width * 1.6 });
            }
        }
        const parkingSign = bay.side === 'LEFT' ? -1 : 1;
        this.parkingClassZones.push({ root: bay.root, vehicleClass: bay.vehicleClass,
            bounds: new THREE.Box3(
                new THREE.Vector3(parkingSign < 0 ? -bay.depthM : .05, -10, -bay.lengthM / 2),
                new THREE.Vector3(parkingSign < 0 ? -.05 : bay.depthM, 10, bay.lengthM / 2)) });

        // Tính world bounds từ local bbox (bao gồm curb mở rộng).
        const sideSign = bay.side === 'LEFT' ? -1 : 1;
        // Với chuồng nối curb, mở curb đường tới tâm hai đoạn curb ngang của chuồng.
        const visibleCurbWidthM = bay.curbPattern === 'red-white'
            ? Math.min(bay.curbWidthM, CURB_VISUAL_WIDTH_M) : bay.curbWidthM;
        const entranceCurbReachM = bay.joinRoadCurb ? visibleCurbWidthM + .02 : 0;
        const curbEndOffsetM = bay.joinRoadCurb
            ? bay.physicalEdgeOffsetM + bay.curbWidthM - visibleCurbWidthM / 2 : 0;
        const localXMin = sideSign > 0 ? -entranceCurbReachM
            : -(bay.depthM + bay.physicalEdgeOffsetM + bay.curbWidthM);
        const localXMax = sideSign > 0 ? (bay.depthM + bay.physicalEdgeOffsetM + bay.curbWidthM)
            : entranceCurbReachM;
        const localZMin = -bay.lengthM / 2 - curbEndOffsetM;
        const localZMax = +bay.lengthM / 2 + curbEndOffsetM;
        bay.root.updateMatrix();
        const localBox = new THREE.Box3(
            new THREE.Vector3(localXMin, 0, localZMin),
            new THREE.Vector3(localXMax, 0, localZMax),
        );
        const worldBox = localBox.applyMatrix4(bay.root.matrix);

        this.roadObstacles.push({
            group: bay.root,
            x: opts.x,
            z: opts.z,
            direction: 'horizontal', // không quan trọng — obstacle không bị iterate để trim
            bounds: {
                minX: worldBox.min.x,
                maxX: worldBox.max.x,
                minZ: worldBox.min.z,
                maxZ: worldBox.max.z,
            },
        });
        return bay;
    }

    /** Thêm chuồng ghép xe vuông góc hạng B theo CAD. */
    addPerpendicularParkingBayB(opts: PerpendicularParkingBayBOptions): PerpendicularParkingBayB {
        const bay = new PerpendicularParkingBayB(opts);
        this.root.add(bay.root);
        this.perpendicularParkingBoundaryGroups.push(bay.examBoundaryGroup);
        this.parkingClassZones.push({ root: bay.root, vehicleClass: 'B',
            bounds: new THREE.Box3(new THREE.Vector3(-bay.parkingWidthM / 2, -10, .05),
                new THREE.Vector3(bay.parkingWidthM / 2, 10, bay.parkingDepthM)) });

        const { controlStartX, controlEndX } = bay.geometry;
        const localBox = new THREE.Box3(
            new THREE.Vector3(controlStartX, 0, -bay.clearRoadWidthM),
            new THREE.Vector3(controlEndX, 0, bay.parkingDepthM),
        );
        bay.root.updateMatrix();
        const worldBox = localBox.applyMatrix4(bay.root.matrix);
        this.roadObstacles.push({
            group: bay.root,
            x: opts.x,
            z: opts.z,
            direction: 'horizontal',
            bounds: {
                minX: worldBox.min.x,
                maxX: worldBox.max.x,
                minZ: worldBox.min.z,
                maxZ: worldBox.max.z,
            },
        });
        return bay;
    }

    /**
     * Thêm chuồng ghép xe vuông góc hạng C theo
     * spec/road/perpendicular_parking_bay_C_spec.md.
     */
    addPerpendicularParkingBayC(opts: PerpendicularParkingBayCOptions): PerpendicularParkingBayC {
        const bay = new PerpendicularParkingBayC(opts);
        this.root.add(bay.root);
        this.perpendicularParkingBoundaryGroups.push(bay.examBoundaryGroup);
        this.parkingClassZones.push({ root: bay.root, vehicleClass: 'C',
            bounds: new THREE.Box3(new THREE.Vector3(-bay.parkingWidthM / 2, -10, .05),
                new THREE.Vector3(bay.parkingWidthM / 2, 10, bay.parkingDepthM)) });

        const { controlStartX, controlEndX } = bay.geometry;
        const localBox = new THREE.Box3(
            new THREE.Vector3(controlStartX, 0, -bay.outerEnvelopeWidthM),
            new THREE.Vector3(
                controlEndX,
                0,
                bay.parkingDepthM + bay.physicalEdgeOffsetM + bay.curbWidthM,
            ),
        );
        bay.root.updateMatrix();
        const worldBox = localBox.applyMatrix4(bay.root.matrix);
        this.roadObstacles.push({
            group: bay.root,
            x: opts.x,
            z: opts.z,
            direction: 'horizontal',
            bounds: {
                minX: worldBox.min.x,
                maxX: worldBox.max.x,
                minZ: worldBox.min.z,
                maxZ: worldBox.max.z,
            },
        });
        return bay;
    }

    connectRoadIntersections() {
        const LOG_ENDPOINT = 'http://127.0.0.1:7243/ingest/41ea114a-de22-43e0-a2f5-b772e9ee7100';
        const log = (msg: string, data: object) => fetch(LOG_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '6e3cd6' },
            body: JSON.stringify({ sessionId: '6e3cd6', location: 'TrackObjects.ts:connectRoadIntersections', message: msg, data, timestamp: Date.now() })
        }).catch(() => { });

        this.root.updateMatrixWorld(true);
        log('connectRoadIntersections: START', { roadCount: this.roads.length });
        for (let i = 0; i < this.roads.length; i++) {
            const r = this.roads[i];
            log('road_registered', { index: i, name: r.group.name, direction: r.direction, bounds: r.bounds });
        }

        const overlap = (a: RoadRect, b: RoadRect) =>
            Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX) > .00001 &&
            Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ) > .00001;
        const subtract = (rect: RoadRect, cut: RoadRect): RoadRect[] => {
            if (!overlap(rect, cut)) return [rect];
            const x1 = Math.max(rect.minX, cut.minX), x2 = Math.min(rect.maxX, cut.maxX);
            const z1 = Math.max(rect.minZ, cut.minZ), z2 = Math.min(rect.maxZ, cut.maxZ);
            return [
                { ...rect, maxX: x1 }, { ...rect, minX: x2 },
                { minX: x1, maxX: x2, minZ: rect.minZ, maxZ: z1 },
                { minX: x1, maxX: x2, minZ: z2, maxZ: rect.maxZ }
            ].filter(r => r.maxX - r.minX > .00001 && r.maxZ - r.minZ > .00001);
        };
        // Đường dừng sát mép đường khác (chưa chồng lên curb) vẫn phải mở curb của nó:
        // nới bao của đường cắt theo trục dọc của chính nó, không nới bề ngang.
        const curbReachM = 0.25;
        const reached = (other: RoadSegment): RoadRect => {
            const reachX = other.direction === 'horizontal' ? curbReachM : 0;
            const reachZ = other.direction === 'vertical' ? curbReachM : 0;
            return {
                minX: other.bounds.minX - reachX,
                maxX: other.bounds.maxX + reachX,
                minZ: other.bounds.minZ - reachZ,
                maxZ: other.bounds.maxZ + reachZ,
            };
        };
        const overlapsFootprint = (mesh: THREE.Mesh, other: RoadSegment, curb: boolean): boolean => {
            if (!other.localFootprint || mesh.geometry instanceof THREE.PlaneGeometry) return true;
            mesh.geometry.computeBoundingBox();
            const box = mesh.geometry.boundingBox!;
            const meshCorners = [
                [box.min.x, box.min.z], [box.max.x, box.min.z],
                [box.max.x, box.max.z], [box.min.x, box.max.z],
            ].map(([x, z]) => new THREE.Vector3(x, 0, z).applyMatrix4(mesh.matrixWorld));
            const footprint = other.localFootprint;
            const reach = curb ? curbReachM : 0;
            const roadCorners = [
                [footprint.minX, footprint.minZ - reach],
                [footprint.maxX, footprint.minZ - reach],
                [footprint.maxX, footprint.maxZ + reach],
                [footprint.minX, footprint.maxZ + reach],
            ].map(([x, z]) => new THREE.Vector3(x, 0, z).applyMatrix4(other.group.matrixWorld));
            for (const polygon of [meshCorners, roadCorners]) {
                for (let i = 0; i < 2; i++) {
                    const from = polygon[i];
                    const to = polygon[i + 1];
                    const axisX = -(to.z - from.z);
                    const axisZ = to.x - from.x;
                    const project = (corners: THREE.Vector3[]) =>
                        corners.map(point => point.x * axisX + point.z * axisZ);
                    const a = project(meshCorners);
                    const b = project(roadCorners);
                    if (Math.max(...a) <= Math.min(...b) + 1e-5
                        || Math.max(...b) <= Math.min(...a) + 1e-5) return false;
                }
            }
            return true;
        };
        for (const [index, road] of this.roads.entries()) {
            const intersecting = this.roads.filter(other => other.group !== road.group && overlap(road.bounds, reached(other)));
            const intersectsObstacle = this.roadObstacles.some(obstacle => overlap(road.bounds, obstacle.bounds));
            log('intersecting_check', { roadIndex: index, roadName: road.group.name, direction: road.direction, intersectCount: intersecting.length });
            if (intersecting.length === 0 && !intersectsObstacle) {
                log('no_intersection_skip', { roadIndex: index, roadName: road.group.name });
                continue;
            }
            for (const inter of intersecting) {
                log('intersecting_road_detail', { roadIndex: index, intersectWith: inter.group.name, interDirection: inter.direction, interBounds: inter.bounds });
            }
            const localRect = (rect: RoadRect): RoadRect => {
                road.group.updateMatrixWorld(true);
                const box = new THREE.Box3(
                    new THREE.Vector3(rect.minX, 0, rect.minZ),
                    new THREE.Vector3(rect.maxX, 0, rect.maxZ)
                ).applyMatrix4(road.group.matrixWorld.clone().invert());
                return { minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z };
            };
            const roadMeshes: THREE.Mesh[] = [];
            const collectRoadMeshes = (parent: THREE.Object3D): void => {
                for (const child of parent.children) {
                    if (
                        child.name === 'Surroundings'
                        || child.name === 'Logic'
                        || child.name === 'Collision'
                        || child.name === 'Debug'
                    ) {
                        continue;
                    }
                    if (child instanceof THREE.Mesh) {
                        roadMeshes.push(child);
                    } else {
                        collectRoadMeshes(child);
                    }
                }
            };
            collectRoadMeshes(road.group);
            for (const child of roadMeshes) {
                const parent = child.parent;
                if (!parent) continue;
                // Mặt asphalt hình thang của RoadStraight955 không phải vạch: cắt thành box
                // sẽ mất hình côn và khoét hụt khi connector xoay lệch trục.
                if (child.name === 'AsphaltRoad' || child.name.startsWith('lane-number-')) continue;
                log('child_mesh', { roadIndex: index, childName: child.name, childType: child.geometry?.constructor?.name });
                // Only crossing roads open curbs/markings. Later surfaces are trimmed against
                // all earlier roads as well, eliminating coplanar overlapping asphalt.
                const isCurb = child.name === 'red-white-curb';
                const crossingRoads = intersecting.filter(other =>
                    (child.name === 'road-surface'
                        ? this.roads.indexOf(other) < index : other.direction !== road.direction)
                    && overlapsFootprint(child, other, isCurb));
                // Chỉ curb đỏ-trắng của đường 4 làn bị cắt theo footprint của parking bay.
                // Mặt asphalt và vạch làn vẫn liền mạch qua vị trí giao.
                const obstacleCuts = this.roadObstacles
                    .filter(obstacle => child.name === 'red-white-curb' && overlap(road.bounds, obstacle.bounds))
                    .map(obstacle => localRect(obstacle.bounds));
                const cuts = [
                    ...crossingRoads.map(other => localRect(isCurb ? reached(other) : other.bounds)),
                    ...obstacleCuts,
                ];
                const roadToParent = parent.matrixWorld.clone().invert().multiply(road.group.matrixWorld);
                const cutsInParentSpace = cuts.map(cut => {
                    const box = new THREE.Box3(
                        new THREE.Vector3(cut.minX, 0, cut.minZ),
                        new THREE.Vector3(cut.maxX, 0, cut.maxZ),
                    ).applyMatrix4(roadToParent);
                    return {
                        minX: box.min.x,
                        maxX: box.max.x,
                        minZ: box.min.z,
                        maxZ: box.max.z,
                    };
                });
                log('cuts_result', { roadIndex: index, childName: child.name, isRoadSurface: child.name === 'road-surface', cutsCount: cutsInParentSpace.length, cutsDetail: cutsInParentSpace });
                if (!cutsInParentSpace.length) { log('no_cuts_skip', { roadIndex: index, childName: child.name }); continue; }
                child.geometry.computeBoundingBox();
                child.updateMatrix();
                const bounds = child.geometry.boundingBox!.clone().applyMatrix4(child.matrix);
                const rect = { minX: bounds.min.x, maxX: bounds.max.x, minZ: bounds.min.z, maxZ: bounds.max.z };
                if (!cutsInParentSpace.some(cut => overlap(rect, cut))) continue;
                if (child.geometry instanceof THREE.PlaneGeometry) {
                    // Omit arrows inside the junction so they do not prescribe a conflicting turn.
                    parent.remove(child);
                    child.geometry.dispose();
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    for (const material of materials) {
                        if (material instanceof THREE.MeshBasicMaterial) material.map?.dispose();
                        material.dispose();
                    }
                    continue;
                }
                let pieces = [rect];
                for (const cut of cutsInParentSpace) pieces = pieces.flatMap(piece => subtract(piece, cut));
                log('piece_created', { roadIndex: index, childName: child.name, piecesCount: pieces.length, pieceRects: pieces });
                for (const piece of pieces) {
                    const mesh = new THREE.Mesh(new THREE.BoxGeometry(piece.maxX - piece.minX,
                        bounds.max.y - bounds.min.y, piece.maxZ - piece.minZ), child.material);
                    mesh.name = child.name;
                    mesh.userData = { ...child.userData };
                    mesh.position.set((piece.minX + piece.maxX) / 2, child.position.y, (piece.minZ + piece.maxZ) / 2);
                    mesh.castShadow = child.castShadow;
                    mesh.receiveShadow = child.receiveShadow;
                    parent.add(mesh);
                }
                parent.remove(child);
                child.geometry.dispose();
                log('trim_complete', { roadIndex: index, childName: child.name });
            }
        }
        const center = new THREE.Vector3();
        const joinedBayRoots = new Set(this.parallelParkingBays
            .filter(bay => bay.joinRoadCurb).map(bay => bay.root));
        const openings = [
            ...this.roadObstacles.filter(obstacle => !joinedBayRoots.has(obstacle.group)),
            ...this.roads,
        ];
        // Curb nằm sát miệng lối vào (trong khoảng bề rộng curb) cũng chặn lối vào.
        const reach = 0.25;
        for (const corner of this.roadCornerCurves) {
            const curbs = corner.root.children.filter(child => child.name === 'red-white-curb');
            for (const curb of curbs) {
                let trimmedForBay = false;
                for (const bay of this.parallelParkingBays) {
                    if (!bay.joinRoadCurb || !(curb instanceof THREE.Mesh)) continue;
                    const visibleWidthM = bay.curbPattern === 'red-white'
                        ? Math.min(bay.curbWidthM, CURB_VISUAL_WIDTH_M) : bay.curbWidthM;
                    const halfOpeningM = bay.lengthM / 2 + bay.physicalEdgeOffsetM
                        + bay.curbWidthM - visibleWidthM / 2;
                    const toBay = bay.root.matrixWorld.clone().invert().multiply(curb.matrixWorld);
                    const positions = curb.geometry.getAttribute('position');
                    const bounds = new THREE.Box3().makeEmpty();
                    const point = new THREE.Vector3();
                    for (let i = 0; i < positions.count; i++) {
                        bounds.expandByPoint(point.fromBufferAttribute(positions, i).applyMatrix4(toBay));
                    }
                    // Cửa chuồng nằm trên đoạn thẳng: giữ chính xác hai mảnh curb
                    // bên ngoài thay vì bỏ nguyên đoạn 0,8 m theo vị trí tâm.
                    if (bounds.min.x < -0.25 || bounds.max.x > 0.15
                        || bounds.max.x - bounds.min.x > 0.16
                        || bounds.max.z <= -halfOpeningM || bounds.min.z >= halfOpeningM) continue;
                    for (const [from, to] of [
                        [bounds.min.z, Math.min(bounds.max.z, -halfOpeningM)],
                        [Math.max(bounds.min.z, halfOpeningM), bounds.max.z],
                    ]) {
                        if (to - from <= 1e-5) continue;
                        const piece = new THREE.Mesh(
                            new THREE.BoxGeometry(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, to - from),
                            curb.material,
                        );
                        piece.name = 'red-white-curb';
                        piece.position.set((bounds.min.x + bounds.max.x) / 2,
                            (bounds.min.y + bounds.max.y) / 2, (from + to) / 2);
                        piece.castShadow = curb.castShadow;
                        piece.receiveShadow = curb.receiveShadow;
                        bay.physicalEdgeGroup.add(piece);
                    }
                    curb.removeFromParent();
                    curb.geometry.dispose();
                    trimmedForBay = true;
                    break;
                }
                if (trimmedForBay) continue;
                const curbBounds = new THREE.Box3().setFromObject(curb);
                curbBounds.getCenter(center);
                // Straight ribbons at a continuation must end exactly at the road
                // boundary. Removing a whole 0.8 m stripe by its centre leaves a hole.
                const size = curbBounds.getSize(new THREE.Vector3());
                if (curb instanceof THREE.Mesh && (size.x <= CURB_VISUAL_WIDTH_M + 1e-4
                    || size.z <= CURB_VISUAL_WIDTH_M + 1e-4)) {
                    const original = { minX: curbBounds.min.x, maxX: curbBounds.max.x,
                        minZ: curbBounds.min.z, maxZ: curbBounds.max.z };
                    let pieces = [original];
                    for (const { bounds } of openings) pieces = pieces.flatMap(piece => subtract(piece, bounds));
                    if (pieces.length === 1 && Object.keys(original).every(key =>
                        pieces[0][key as keyof RoadRect] === original[key as keyof RoadRect])) continue;
                    const fragments: THREE.Mesh[] = [];
                    for (const piece of pieces) {
                        const mesh = new THREE.Mesh(new THREE.BoxGeometry(piece.maxX - piece.minX,
                            size.y, piece.maxZ - piece.minZ), curb.material);
                        mesh.name = 'red-white-curb';
                        mesh.position.set((piece.minX + piece.maxX) / 2, center.y,
                            (piece.minZ + piece.maxZ) / 2);
                        // World-aligned box: attach at the map root, not the rotated curve.
                        this.root.add(mesh);
                        fragments.push(mesh);
                    }
                    corner.replaceInnerCurbMesh(curb, fragments);
                    curb.removeFromParent();
                    curb.geometry.dispose();
                } else if (openings.some(({ bounds }) => center.x > bounds.minX - reach && center.x < bounds.maxX + reach
                    && center.z > bounds.minZ - reach && center.z < bounds.maxZ + reach)) {
                    curb.removeFromParent();
                }
            }
            // Curb của đường khác (vd. lối vào chuồng gặp mép chéo) không được nằm trên mặt đường cua.
            const worldToCorner = corner.root.matrixWorld.clone().invert();
            for (const road of this.roads) {
                const curbs: THREE.Object3D[] = [];
                road.group.traverse(child => { if (child.name === 'red-white-curb') curbs.push(child); });
                for (const curb of curbs) {
                    new THREE.Box3().setFromObject(curb).getCenter(center).applyMatrix4(worldToCorner);
                    if (isPointInPolygon([center.x, center.z], corner.surfaceOutline)) curb.removeFromParent();
                }
            }
            corner.restoreInnerCurbAfterJunctions();
        }
        // Nhánh cong của FourLaneBidirectionalRoad không nằm trong roads[] bounds
        // (bounds chỉ bao đoạn thẳng). Cắt curb tại miệng chuồng, giữ chính xác
        // phần mảnh curb nằm ngoài hai đầu cửa vào.
        for (const bay of this.parallelParkingBays) {
            const worldToBay = bay.root.matrixWorld.clone().invert();
            const curbSideMinX = bay.side === 'RIGHT' ? -0.3 : -0.05;
            const curbSideMaxX = bay.side === 'RIGHT' ? 0.05 : 0.3;
            const visibleCurbWidthM = bay.curbPattern === 'red-white'
                ? Math.min(bay.curbWidthM, CURB_VISUAL_WIDTH_M) : bay.curbWidthM;
            // Cắt curb đường chính tới mép curb chuồng, không dừng ở vạch đỏ.
            const halfOpening = bay.lengthM / 2 + (bay.joinRoadCurb
                ? bay.physicalEdgeOffsetM + bay.curbWidthM - visibleCurbWidthM / 2 : 0);
            const openingStartWorld = bay.root.localToWorld(new THREE.Vector3(0, 0, -halfOpening));
            const openingEndWorld = bay.root.localToWorld(new THREE.Vector3(0, 0, halfOpening));
            for (const road of this.roads) {
                const curvedBranch = road.group.getObjectByName('road-corner-positive-x');
                if (!curvedBranch) continue;
                const curbs: THREE.Mesh[] = [];
                curvedBranch.traverse(child => {
                    if (child instanceof THREE.Mesh && child.name === 'red-white-curb') curbs.push(child);
                });
                for (const curb of curbs) {
                    const box = new THREE.Box3().setFromObject(curb).applyMatrix4(worldToBay);
                    if (box.max.x <= curbSideMinX || box.min.x >= curbSideMaxX
                        || box.max.z <= -halfOpening || box.min.z >= halfOpening) continue;
                    const parent = curb.parent!;
                    const openingStart = parent.worldToLocal(openingStartWorld.clone());
                    const openingEnd = parent.worldToLocal(openingEndWorld.clone());
                    const dx = Math.abs(openingEnd.x - openingStart.x);
                    const dz = Math.abs(openingEnd.z - openingStart.z);
                    curb.geometry.computeBoundingBox();
                    curb.updateMatrix();
                    const bounds = curb.geometry.boundingBox!.clone().applyMatrix4(curb.matrix);
                    const axis = dx > dz ? 'x' : 'z';
                    const crossWidth = axis === 'x' ? bounds.max.z - bounds.min.z : bounds.max.x - bounds.min.x;
                    const length = axis === 'x' ? bounds.max.x - bounds.min.x : bounds.max.z - bounds.min.z;
                    // Cung cong không thể cắt thành hộp chữ nhật; các mảnh cong
                    // rất ngắn sát đầu cửa được bỏ nguyên mảnh.
                    if (Math.min(dx, dz) < Math.max(dx, dz) * 0.01 && crossWidth < 0.3 && length > crossWidth * 2) {
                        const openingMin = Math.min(openingStart[axis], openingEnd[axis]);
                        const openingMax = Math.max(openingStart[axis], openingEnd[axis]);
                        const fragments: [number, number][] = [
                            [bounds.min[axis], Math.min(bounds.max[axis], openingMin)],
                            [Math.max(bounds.min[axis], openingMax), bounds.max[axis]],
                        ];
                        for (const [from, to] of fragments) {
                            if (to - from <= 1e-5) continue;
                            const pieceBounds = bounds.clone();
                            pieceBounds.min[axis] = from;
                            pieceBounds.max[axis] = to;
                            const size = pieceBounds.getSize(new THREE.Vector3());
                            const piece = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), curb.material);
                            piece.name = curb.name;
                            piece.position.copy(pieceBounds.getCenter(new THREE.Vector3()));
                            piece.castShadow = curb.castShadow;
                            piece.receiveShadow = curb.receiveShadow;
                            parent.add(piece);
                        }
                    }
                    curb.removeFromParent();
                    curb.geometry.dispose();
                }
            }
        }
        log('connectRoadIntersections: END', {});
    }

    addRightAngleTurn(
        x: number,
        z: number,
        width = 8,
        direction: RoadDirection = 'vertical',
        turn: 'left' | 'right' = 'right',
        centerLine: CenterLineType = 'white-solid',
        lanes: LaneCount = 2,
        rotationY = 0,
        outerCornerRadiusM = 3,
    ) {
        // Local entry is the south edge (+Z), with the exit on the right (+X).
        if (outerCornerRadiusM <= 0 || outerCornerRadiusM > width) {
            throw new Error('Right-angle turn radius must be within the road width');
        }
        const corner = new THREE.Group();
        corner.name = 'right-angle-turn';
        corner.position.set(x, 0, z);
        corner.rotation.y = direction === 'horizontal' ? -Math.PI / 2 : 0;
        corner.scale.x = turn === 'left' ? -1 : 1;
        const half = width / 2;
        const radius = outerCornerRadiusM;
        const arcCenterX = -half + radius;
        const arcCenterZ = -half + radius;
        const toShapePoint = (px: number, pz: number) => new THREE.Vector2(px, -pz);
        const roadPoints = [
            toShapePoint(-half, half),
            toShapePoint(half, half),
            toShapePoint(half, -half),
            toShapePoint(arcCenterX, -half),
        ];
        for (let i = 1; i <= 24; i++) {
            const angle = -Math.PI / 2 - i * Math.PI / 48;
            roadPoints.push(toShapePoint(
                arcCenterX + radius * Math.cos(angle),
                arcCenterZ + radius * Math.sin(angle),
            ));
        }
        const roadGeometry = new THREE.ShapeGeometry(new THREE.Shape(roadPoints));
        roadGeometry.rotateX(-Math.PI / 2);
        const road = new THREE.Mesh(roadGeometry,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95, side: THREE.DoubleSide }));
        road.position.y = .06;
        road.name = 'road-surface';
        road.receiveShadow = true;
        corner.add(road);

        // Mép ngoài bo R3; hai đầu đường giữ mở để nối với các đoạn thẳng.
        this.addRoadEdgePattern(0, radius / 2, width, width - radius, 'left', corner);
        const farEdge = new THREE.Group();
        farEdge.rotation.y = -Math.PI / 2;
        farEdge.position.x = radius / 2;
        corner.add(farEdge);
        this.addRoadEdgePattern(0, 0, width, width - radius, 'left', farEdge);

        const arcBand = (
            centerX: number, centerZ: number, inner: number, outer: number,
            fromAngle: number, toAngle: number, y: number, material: THREE.Material,
            thickness = 0,
        ) => {
            const points: THREE.Vector2[] = [];
            const count = Math.max(4, Math.ceil((toAngle - fromAngle) * outer * 8));
            for (let i = 0; i <= count; i++) {
                const angle = fromAngle + (toAngle - fromAngle) * i / count;
                points.push(toShapePoint(centerX + outer * Math.cos(angle), centerZ + outer * Math.sin(angle)));
            }
            for (let i = count; i >= 0; i--) {
                const angle = fromAngle + (toAngle - fromAngle) * i / count;
                points.push(toShapePoint(centerX + inner * Math.cos(angle), centerZ + inner * Math.sin(angle)));
            }
            const shape = new THREE.Shape(points);
            const geometry = thickness > 0
                ? new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
                : new THREE.ShapeGeometry(shape);
            geometry.rotateX(-Math.PI / 2);
            const marking = new THREE.Mesh(geometry, material);
            marking.position.y = y;
            marking.receiveShadow = true;
            corner.add(marking);
            return marking;
        };

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85, side: THREE.DoubleSide }));
        const curbCount = Math.ceil(radius * Math.PI / 2 / .8);
        for (let i = 0; i < curbCount; i++) {
            const from = Math.PI + i * Math.PI / (2 * curbCount);
            const to = Math.PI + (i + 1) * Math.PI / (2 * curbCount);
            const curb = arcBand(arcCenterX, arcCenterZ, radius - CURB_VISUAL_WIDTH_M, radius,
                from, to, .06, curbMaterials[i % 2], CURB_VISUAL_HEIGHT_M);
            curb.name = 'red-white-curb';
            const steps = Math.max(4, Math.ceil((to - from) * radius * 8));
            curb.userData.roadEdgeGrassPath = Array.from({ length: steps + 1 }, (_, j) => {
                const angle = from + (to - from) * j / steps;
                return [arcCenterX + radius * Math.cos(angle), CURB_VISUAL_HEIGHT_M,
                    arcCenterZ + radius * Math.sin(angle)];
            });
        }

        // Tâm đường đi theo cung tròn, chia vạch theo chiều dài cung như đường thẳng.
        const centerRadius = half;
        const { material, spans } = this.centerLineSegments(centerRadius * Math.PI / 2, centerLine, lanes);
        material.side = THREE.DoubleSide;
        for (const [from, to] of spans) {
            arcBand(half, half, centerRadius - .075, centerRadius + .075,
                Math.PI + from / centerRadius, Math.PI + to / centerRadius, .077, material);
        }
        this.root.add(corner);
        corner.rotation.y += rotationY;
        return corner;
    }

    addRoadCurve(x: number, z: number, width: number, radius: number,
        centerLine: CenterLineType = 'white-dashed', lanes: LaneCount = 2,
        rotationY = 0, sweepAngle = Math.PI / 2, innerCurbStartSweep = 0) {
        const innerRadius = radius - width / 2;
        const outerRadius = radius + width / 2;
        if (innerRadius <= 0) throw new Error('Road curve radius must exceed half its width');

        const group = new THREE.Group();
        group.name = 'road-curve';
        group.position.set(x, 0, z);
        group.rotation.y = rotationY;
        this.root.add(group);

        // Arc starting at the west side of the circle. Rotation and sweep select
        // the entry direction and bend angle for each road connection.
        const start = Math.PI;
        const end = start + sweepAngle;
        const sector = (inner: number, outer: number, from: number, to: number,
            height: number, top: number, material: THREE.Material, name?: string) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, outer, from, to, false);
            shape.lineTo(inner * Math.cos(to), inner * Math.sin(to));
            shape.absarc(0, 0, inner, to, from, true);
            shape.closePath();
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: height, bevelEnabled: false, curveSegments: 64
            });
            geometry.rotateX(Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, top, 0);
            mesh.receiveShadow = true;
            if (name) mesh.name = name;
            group.add(mesh);
            return mesh;
        };

        sector(innerRadius, outerRadius, start, end, .08, .06,
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95 }), 'road-surface');

        // Measure dashes along the arc so their length matches straight-road markings.
        const { material, spans } = this.centerLineSegments(radius * (end - start), centerLine, lanes);
        for (const [from, to] of spans) {
            sector(radius - .075, radius + .075, start + from / radius,
                start + to / radius, .008, .071, material);
        }

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        for (const [inner, outer] of [
            [innerRadius, innerRadius + CURB_VISUAL_WIDTH_M],
            [outerRadius - CURB_VISUAL_WIDTH_M, outerRadius],
        ]) {
            const curbStart = inner === innerRadius ? start + innerCurbStartSweep : start;
            const count = Math.ceil((end - curbStart) * (inner + outer) / 2 / .8);
            for (let i = 0; i < count; i++) {
                const from = curbStart + (end - curbStart) * i / count;
                const to = curbStart + (end - curbStart) * (i + 1) / count;
                sector(inner, outer, from, to, CURB_VISUAL_HEIGHT_M, .11,
                    curbMaterials[i % 2], 'red-white-curb').castShadow = true;
            }
        }

        const angle = (start + end) / 2;
        for (const laneRadius of lanes === 1 ? [radius] : [radius - width / 4, radius + width / 4]) {
            const arrowGroup = new THREE.Group();
            arrowGroup.position.set(laneRadius * Math.cos(angle), 0, laneRadius * Math.sin(angle));
            arrowGroup.rotation.y = -(angle - start);
            group.add(arrowGroup);
            this.addRoadArrow(0, 0, width / lanes, laneRadius * (end - start), 'right', arrowGroup);
        }
        if (this.showRoadLaneNumbers && lanes >= 2) {
            for (let lane = 1; lane <= lanes; lane++) {
                const laneRadius = radius - width / 2 + (lane - .5) * width / lanes;
                this.addLaneNumber(group, lane, laneRadius * Math.cos(angle),
                    laneRadius * Math.sin(angle), .095, -(angle - start));
            }
        }
        return group;
    }

    addLine(
        x: number,
        z: number,
        w: number,
        d: number,
        color = 0xf0cc3e,
        penalty = false
    ) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, .03, d),
            new THREE.MeshStandardMaterial({ color, roughness: .7 }));

        m.position.set(x, .075, z); this.root.add(m);

        if (penalty)
            this.penaltyZones.push(new THREE.Box3()
                .setFromCenterAndSize(new THREE.Vector3(x, .5, z),
                    new THREE.Vector3(w + .15, 1, d + .15)))
    }

    addCone(x: number, z: number) {
        const c = new THREE.Mesh(new THREE.ConeGeometry(.18, .5, 20),
            new THREE.MeshStandardMaterial({ color: 0xff7a22 }));

        c.position.set(x, .25, z);
        c.castShadow = true; this.root.add(c)
    }

    /**
     * Vẽ một vùng trigger zone bán trong suốt (debug/visual) trên mặt đường.
     * Dùng để đánh dấu vạch hoàn thành bài thi, trigger zone, v.v.
     * Mesh được add vào `this.root` nên tự nằm trong scene track.
     *
     * @param x      tâm X (world)
     * @param z      tâm Z (world)
     * @param width  chiều rộng theo trục X (m)
     * @param length chiều dài theo trục Z (m)
     * @param color  màu hex (mặc định xanh lá nhạt 0x88ff88)
     * @param opacity độ trong suốt (mặc định 0.25)
     * @returns mesh đã add (để caller lưu ref nếu cần toggle visibility)
     */
    addTriggerZone(
        x: number,
        z: number,
        width: number,
        length: number,
        color = 0x88ff88,
        opacity = 0.25,
    ): THREE.Mesh {
        const geom = new THREE.PlaneGeometry(width, length);
        const mat = new THREE.MeshBasicMaterial({
            color,
            opacity,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        });
        const m = new THREE.Mesh(geom, mat);
        m.rotation.x = -Math.PI / 2; // nằm ngang mặt đường
        // Y = 0.075 đủ cao để vượt road-surface top (Y=0.06) và center-line top
        // (Y≈0.071) nhưng vẫn thấp hơn arrow plane (Y=0.081) — không che mũi tên,
        // đồng thời zone màu xanh nhạt hiện rõ trên mặt đường.
        m.position.set(x, 0.075, z);
        m.receiveShadow = false;
        m.castShadow = false;
        this.root.add(m);
        return m;
    }

    // Vạch kẻ đường dành cho người đi bộ
    addPedestrianCrossing(
        x: number,
        z: number,
        direction: RoadDirection = 'vertical',
        roadWidth = 8,
        crossingDepth = 3
    ) {
        const crossing = new THREE.Group();
        crossing.name = 'pedestrian-crossing';
        crossing.position.set(x, 0, z);
        crossing.rotation.y = direction === 'horizontal' ? -Math.PI / 2 : 0;

        // Cover center markings within the crossing, leaving both curbs visible.
        const usableWidth = roadWidth - .4;
        const surface = new THREE.Mesh(new THREE.PlaneGeometry(usableWidth, crossingDepth),
            new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR, roughness: .95 }));
        surface.rotation.x = -Math.PI / 2;
        surface.position.y = .083;
        surface.receiveShadow = true;
        crossing.add(surface);

        const stripeWidth = .45;
        const gap = .4;
        const count = Math.max(1, Math.floor((usableWidth + gap) / (stripeWidth + gap)));
        const totalWidth = count * stripeWidth + (count - 1) * gap;
        const geometry = new THREE.PlaneGeometry(stripeWidth, crossingDepth);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 });
        for (let i = 0; i < count; i++) {
            const stripe = new THREE.Mesh(geometry, material);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(-totalWidth / 2 + stripeWidth / 2 + i * (stripeWidth + gap), .087, 0);
            stripe.receiveShadow = true;
            crossing.add(stripe);
        }
        this.root.add(crossing);
        return crossing;
    }

    addStartLine(
        x = 0,
        z = -2.5,
        direction: RoadDirection = 'vertical',
        roadWidth = 8
    ) {
        // Vạch trắng mảnh cắt ngang mặt đường, không có nền xanh lá.
        const marking = new THREE.Mesh(
            new THREE.PlaneGeometry(roadWidth - .2, .18),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
        );
        marking.rotation.x = -Math.PI / 2;
        marking.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0),
            direction === 'horizontal' ? -Math.PI / 2 : 0);
        marking.position.set(x, .095, z);
        marking.name = 'START_LINE';
        this.root.add(marking);
        return marking;
    }

    /**
     * Bài 04 — Qua vệt bánh xe và đường vòng vuông góc.
     *
     * Spec: spec/threejs_exam_yard_specification_v2.md §9
     *
     * Delegates geometry to `WheelTrackCourse` (mirrors pattern of `WindingCourse`).
     * The course geometry is built at local origin (x = 0, z = 0), then translated
     * and rotated into place via a single Matrix4 transform so that entry/exit
     * stay consistent with the visual layout.
     */
    addWheelTrackCourse({ x = 58, z = -20, direction = 'vertical', entryLength = 0,
        vehicleClass = 'B', ...courseOptions }: {
        x?: number;
        z?: number;
        direction?: RoadDirection;
        /** Đoạn tiếp cận từ entry tới đầu vệt bánh xe. */
        entryLength?: number;
        vehicleClass?: ExamVehicleClass;
    } & WheelTrackCourseOptions = {}) {
        // Build the course at local origin (entry at (0, 0, 0)).
        const course = new WheelTrackCourse(0, 0, entryLength, courseOptions);

        // Rotate + translate the whole subtree into world placement.
        const transform = new THREE.Matrix4().makeTranslation(x, 0, z)
            .multiply(new THREE.Matrix4().makeRotationY(direction === 'horizontal' ? Math.PI / 2 : 0));

        course.root.applyMatrix4(transform);
        this.root.add(course.root);

        // Merge penalty zones (wheel probes) after transform so they remain valid.
        for (const zone of course.penaltyZones) {
            this.penaltyZones.push(zone.clone().applyMatrix4(transform));
        }

        // Expose world-space entry/exit so callers can place connecting roads.
        const entryWorld = new THREE.Vector3(x, 0, z);
        const exitLocal = course.exit.clone();
        const exitWorld = exitLocal.applyMatrix4(transform);

        // World-space forward axis (unit) of the exit leg (local -Z).
        //   'horizontal' → world -X; 'vertical' → world -Z.
        const exitForwardAxis = direction === 'horizontal'
            ? new THREE.Vector3(-1, 0, 0)
            : new THREE.Vector3(0, 0, -1);

        // Transform all sensors to world space and return for Exam04 use.
        const startYellowSensor = course.startYellowSensorLocal.clone().applyMatrix4(transform);
        const timerStartSensor = course.timerStartSensorLocal.clone().applyMatrix4(transform);
        const endYellowSensor = course.endYellowSensorLocal.clone().applyMatrix4(transform);
        const wheelTrackZone = course.wheelTrackZoneLocal.clone().applyMatrix4(transform);
        const boundarySensors = course.boundarySensorsLocal.map(b => b.clone().applyMatrix4(transform));

        // Lối vào / lối ra mở bó vỉa đỏ-trắng của đường mà chúng nối vào.
        for (const connectorLocal of [course.entryConnectorLocal, course.exitConnectorLocal]) {
            const connector = connectorLocal.clone().applyMatrix4(transform);
            this.roadObstacles.push({
                group: course.root,
                x,
                z,
                direction,
                bounds: {
                    minX: connector.min.x,
                    maxX: connector.max.x,
                    minZ: connector.min.z,
                    maxZ: connector.max.z,
                },
            });
        }

        return {
            entryWorld,
            exitWorld,
            roadWidthM: course.roadWidthM,
            vehicleClass,
            courseRoot: course.root,
            exitForwardAxis,
            startYellowLine: course.startYellowLine,
            endYellowLine: course.endYellowLine,
            startYellowSensor,
            timerStartSensor,
            endYellowSensor,
            wheelTrackZone,
            wheelTrackBoundarySensors: course.penaltyZones.map(zone => zone.clone().applyMatrix4(transform)),
            boundarySensors,
        };
    }



    /**
     * Add the shared parametric S-curve object.
     *
     * `innerRadiusM` and `outerRadiusM` are the geometry constraints. The
     * course derives its road width and centre radius from them; the
     * construction diagonal is validated against their sum.
     */
    addSCurveTrack(options: SCurveTrackOptions): SCurveTrack {
        const track = new SCurveTrack(options);
        this.root.add(track.root);
        const coursePenaltyGroupIndex = this.penaltyZones.length;
        // Reserve a unique group without using the approximate arc AABBs for scoring.
        this.penaltyZones.push(new THREE.Box3());
        this.curvedBoundaryChecks.push({ groupIndex: coursePenaltyGroupIndex,
            touches: wheel => track.touchesBoundary(wheel) });
        return track;
    }

    /** Complete exercise branching toward +Z, including registered road connections. */
    addWindingCourse({
        x,
        z,
        entryLength = 30,
        exitLength = 6,
        vehicleClass = 'B',
        rotationY = Math.PI / 2,
        withArrows = true,
    }: {
        x: number;
        z: number;
        entryLength?: number;
        exitLength?: number;
        /** Hạng xe sát hạch (B/C/D/E). Default: 'B'. */
        vehicleClass?: ExamVehicleClass;
        /** Hướng của chữ S và hai đoạn entry/exit (radian). */
        rotationY?: number;
        /** Vẽ mũi tên mặc định ở đường vào và đường ra. Mặc định true. */
        withArrows?: boolean;
    }): WindingCourseEntry {
        const spec = getWindingCourseSpec(vehicleClass);
        validateWindingCourseSpec(spec);
        const winding = this.addSCurveTrack({
            x,
            z: z + entryLength,
            rotationY,
            innerRadiusM: spec.innerRadiusM,
            outerRadiusM: spec.outerRadiusM,
            constructionDiagonalM: spec.centerDistanceM,
            topConstructionWidthM: spec.constructionEnvelopeWidthM,
            bottomConstructionWidthM: spec.constructionEnvelopeWidthM,
            curbWidthM: (spec.constructionEnvelopeWidthM - spec.clearRoadWidthM) / 2,
            topTangentLengthM: 0,
            bottomTangentLengthM: 0,
        });
        const roadRotationY = rotationY - Math.PI / 2;
        const roadDirectionX = Math.cos(rotationY);
        const roadDirectionZ = -Math.sin(rotationY);
        const entryRoadCenterX = x + roadDirectionX * entryLength / 2;
        const entryRoadCenterZ = z + entryLength + roadDirectionZ * entryLength / 2;
        const entryRoadIndex = this.roads.length;
        this.addRoad(entryRoadCenterX, entryRoadCenterZ, winding.width, entryLength,
            'vertical', 'none', 'white-solid', 1, roadRotationY, false, 0.10);
        if (withArrows) {
            this.addRoadArrow(
                entryRoadCenterX,
                entryRoadCenterZ,
                winding.width,
                6,
                'straight',
                this.root,
                roadRotationY,
            ).rotateZ(Math.PI);
        }
        const windingExit = winding.exit.clone().applyMatrix4(winding.root.matrix);
        const exitRoadCenterX = windingExit.x - roadDirectionX * exitLength / 2;
        const exitRoadCenterZ = windingExit.z - roadDirectionZ * exitLength / 2;
        const exitRoadIndex = this.roads.length;
        this.addRoad(exitRoadCenterX, exitRoadCenterZ, winding.width, exitLength,
            'vertical', 'none', 'white-solid', 1, roadRotationY, false, 0.10);
        if (withArrows) {
            this.addRoadArrow(
                exitRoadCenterX,
                exitRoadCenterZ,
                winding.width,
                exitLength,
                'straight',
                this.root,
                roadRotationY,
            ).rotateZ(Math.PI);
        }
        const windingEntry = {
            vehicleClass,
            course: winding,
            entryRoadIndex,
            exitRoadIndex,
            _entryLength: entryLength,
            _exitLength: exitLength,
        };
        this.windingCourses.push(windingEntry);
        return windingEntry;
        // this.root.add(new ExerciseSign({
        //     title: 'QUA ĐƯỜNG\nVÒNG QUANH CO',
        //     subtitle: 'Đi chậm, giữ bánh xe trong vạch giới hạn',
        //     x: x + 4, z: entryArrowZ, rotation: Math.PI
        // }).root);
    }

    /**
     * ZONE_01_START: start marking (EX01_START_LINE), road text "XUẤT PHẤT",
     * 1A roadside board, optional GO signal, route marker, and a separate set of
     * gameplay sensors (wait/start/signalOff) stored on `zone.userData`.
     *
     * Implements spec/exam/exam_01_start.md §8 (Sensors cần có trong Three.js) and
     * spec/threejs_exam_yard_specification_v2.md §6.2 + §17 (visual vs sensor).
     */
    addStartZone(x: number, z: number, direction: RoadDirection = 'horizontal', roadWidth = 8, opts: {
        withSignal?: boolean;
        signalRotation?: number;
        textX?: number;
        textZ?: number;
    } = {}) {
        const zone = new THREE.Group();
        zone.name = 'ZONE_01_START';
        this.root.add(zone);

        // ---- Visual geometry (per spec §6.2 object names) ----
        const startLine = this.addStartLine(x, z, direction, roadWidth);
        startLine.name = 'EX01_START_LINE';
        zone.attach(startLine);

        // Chữ nằm sau vạch theo hướng xe chạy (+X hoặc +Z), như trên CAD.
        const textOffsetM = 1;
        const startText = this.addRoadText(
            'XUẤT PHÁT',
            opts.textX ?? (x + (direction === 'horizontal' ? textOffsetM : 0)),
            opts.textZ ?? (z + (direction === 'vertical' ? textOffsetM : 0)),
            direction,
            roadWidth,
        );
        startText.name = 'EX01_START_TEXT';
        zone.attach(startText);

        if (opts.withSignal) {
            const rotation = opts.signalRotation ?? startPosition.heading;
            const signal = this.addTrafficLight(x, z, roadWidth, rotation, { markerId: 'START' });
            signal.root.name = 'START_SIGNAL';
            this.startSignal = signal;
            zone.attach(signal.root);
        } else {
            this.startSignal = null;
        }

        // ---- Sensor (logic only, separated from visual per spec §17) ----
        const halfWidth = roadWidth / 2;
        // Wait zone: chassis must rest inside this box before countdown begins.
        const waitZone = new THREE.Box3(
            new THREE.Vector3(x - 4, -1, z - halfWidth),
            new THREE.Vector3(x - .15, 3, z + halfWidth)
        );
        // Start line trigger: very thin slab straddling x.
        const startTrigger = new THREE.Box3(
            new THREE.Vector3(x - .15, -1, z - halfWidth),
            new THREE.Vector3(x + .15, 3, z + halfWidth)
        );
        // 5 m gate (HARD_CONSTRAINT từ spec §4.4 LEFT_SIGNAL_OFF_GATE).
        const signalOffX = x + 5;
        const signalOffGate = new THREE.Box3(
            new THREE.Vector3(signalOffX - .4, -1, z - halfWidth),
            new THREE.Vector3(signalOffX + .4, 3, z + halfWidth)
        );

        zone.userData = {
            sensors: {
                waitZone,
                startTrigger,
                signalOffGate,
            },
            metadata: {
                lineX: x,
                lineZ: z,
                direction,
                roadWidth,
                markerId: '1A',
            },
        };
        return zone;
    }

    /**
     * Render the road text (spec §6.2 EX01_*_TEXT). The text is painted into a
     * canvas, sampled as a CanvasTexture, and laid onto a thin plane in the road.
     * `direction` controls whether the text runs along world +X (horizontal) or +Z.
     */
    addRoadText(text: string, x: number, z: number, direction: RoadDirection, roadWidth = 8): THREE.Mesh {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 160px "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 80);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;

        const width = Math.max(2, roadWidth * .75);
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, width / 4),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
            })
        );
        // Plane mặc định nằm trong mặt phẳng XY; xoay xuống mặt đất.
        mesh.rotation.x = -Math.PI / 2;
        // Rotate around world-up so the text reads along the lane direction.
        mesh.rotateOnWorldAxis(
            new THREE.Vector3(0, 1, 0),
            direction === 'horizontal' ? -Math.PI / 2 : 0
        );
        // Sit just above the asphalt to avoid z-fighting (spec §22).
        mesh.position.set(x, .096, z);
        return mesh;
    }

    /**
     * Vạch dừng quy định cho bài 2A (spec/exam/exam_02_pedestrian_stop.md §5.1).
     * Vạch trắng đơn dày hơn vạch giữa, vuông góc trục di chuyển của xe.
     * Đặt tại (x, 0, z) — x là tọa độ X của vạch dừng trên corridor.
     */
    addPedestrianStopLine(z: number, roadWidth = 8, x = 0): THREE.Mesh {
        const marking = new THREE.Mesh(
            new THREE.BoxGeometry(.2, .01, roadWidth),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 })
        );
        marking.position.set(x, .085, z);
        marking.receiveShadow = true;
        marking.name = 'EX02_STOP_LINE';
        this.root.add(marking);
        return marking;
    }

    /**
     * Stop-bar cảnh báo cho bài 2A — vạch trắng phụ, đặt giữa vạch dừng sensor và
     * crosswalk. Học viên dừng TRƯỚC vạch này = không trừ điểm; vượt qua = bị trừ.
     * Không có sensor gameplay; chỉ mang tính thị giác để cảnh báo ranh giới an
     * toàn. Vạch kéo dài toàn bộ chiều rộng đường để nổi bật trên mặt đường.
     */
    addStopBarWarning(x: number, z: number, roadWidth = 8): THREE.Mesh {
        const marking = new THREE.Mesh(
            // Vạch nằm ngang đường (vuông góc hướng xe chạy): 0.5m dày theo trục X,
            // 8m rộng theo trục Z (curb trái → curb phải).
            new THREE.BoxGeometry(.2, .01, roadWidth),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 })
        );
        marking.position.set(x, .085, z);
        marking.receiveShadow = true;
        marking.name = 'EX02_STOP_BAR_WARNING';
        this.root.add(marking);
        return marking;
    }

    addStopSign(opts: StopSignOptions) {
        this.root.add(new StopSign(opts).root);
    }

    addPedestrianSign(opts: PedestrianSignOptions) {
        this.root.add(new PedestrianSign(opts).root);
    }

    async loadStopSignGLB(): Promise<void> {
        return StopSign.preload();
    }

    /**
     * ZONE_02_PEDESTRIAN — bundle cho bài 2A (Dừng xe nhường đường người đi bộ).
     *
     * Tách **visual geometry** (stop line, crosswalk, biển báo, marker) khỏi
     **gameplay sensors** theo spec/threejs_exam_yard_specification_v2.md §17.
     *
     * Crosswalk được tạo trước (ngoài zone) vì nó có thể chia sẻ với cả bài 02
     * và các bài khác (đếm người đi bộ, etc.). Hàm này chỉ `attach` crosswalk đó
     * vào zone và đặt sensor liên quan.
     *
     * Tham khảo:
     * - spec/threejs_exam_yard_specification_v2.md §7.1, §7.2 (EX02_STOP_LINE /
     *   EX02_CROSSWALK / EX02_SIGN_STOP / EX02_SIGN_PEDESTRIAN / EX02_STOP_SENSOR).
     * - spec/exam/exam_02_pedestrian_stop.md §5, §9 (các sensor gameplay).
     */
    addPedestrianZone(opts: {
        stopLineX: number;
        crosswalkX: number;
        roadZ: number;
        roadWidth?: number;
        direction?: RoadDirection;
    }): THREE.Group {
        const roadWidth = opts.roadWidth ?? 8;
        const direction = opts.direction ?? 'horizontal';
        const stopLineX = opts.stopLineX;
        const crosswalkX = opts.crosswalkX;
        const z = opts.roadZ;

        const zone = new THREE.Group();
        zone.name = 'ZONE_02_PEDESTRIAN';
        this.root.add(zone);

        // ---- Visual geometry (spec §7.2 object names) ----
        // Vạch dừng (EX02_STOP_LINE).
        const stopLine = this.addPedestrianStopLine(z, roadWidth, -7.5);
        zone.attach(stopLine);

        // Crosswalk (EX02_CROSSWALK). addPedestrianCrossing auto-add this.root và
        // tạo group riêng; nếu crosswalk chưa tồn tại thì tạo mới đúng vị trí,
        // nếu đã có (như ở X=-5) thì attach object đã tồn tại vào zone.
        let crosswalk = this.root.children.find(
            child => child.name === 'pedestrian-crossing'
        ) as THREE.Group | undefined;
        if (!crosswalk) {
            crosswalk = this.addPedestrianCrossing(crosswalkX, z, direction, roadWidth, 3);
        }
        crosswalk.name = 'EX02_CROSSWALK';
        zone.attach(crosswalk);

        // Biển "Dừng lại" — stop_sign_road_sign.glb (bên phải đường).
        const signStop = new StopSign({ x: stopLineX, z, roadWidth, scale: 0.012 });
        zone.attach(signStop.root);

        // Marker 2A — bảng tên bài thi.
        // const marker2A = this.addRouteMarkerFor(
        //     '2A', z, roadWidth,
        //     'DỪNG XE NHƯỜNG ĐƯỜNG NGƯỜI ĐI BỘ',
        //     4.2
        // );
        // marker2A.position.x = stopLineX;
        // marker2A.position.z = z - roadWidth / 2 - 1.6;
        // // marker2A.rotation.y = Math.PI / 2;   // ← thêm dòng này
        // zone.attach(marker2A);

        // Tham chiếu "0.5 m" — vạch nhỏ đánh dấu ngưỡng A tối đa trên mặt đường
        // (chỉ là visual hint, không ảnh hưởng rule MAX_FRONT_BUMPER_TO_STOP_LINE_M).
        const halfWidth = roadWidth / 2;
        const ref05 = new THREE.Mesh(
            new THREE.BoxGeometry(roadWidth, .008, .05),
            new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: .85 })
        );
        ref05.position.set(stopLineX + .5, .07, z);
        ref05.receiveShadow = true;
        ref05.name = 'EX02_REFERENCE_0_5M';
        zone.add(ref05);

        // Chữ "0.5 m" in trên mặt đất bên cạnh vạch tham chiếu (ngoài làn đường).
        const ref05Label = this.makeGroundLabel('0.5 m', stopLineX + .5, z + roadWidth / 2 + .4, roadWidth, .55);
        ref05Label.name = 'EX02_REFERENCE_0_5M_TEXT';
        zone.add(ref05Label);

        // Sprite world-space dùng để hiển thị "A = X.XX m" động phía trước xe.
        // Ban đầu ẩn; DrivingGame sẽ gọi setStopDistanceLabel() mỗi frame.
        const labelSprite = this.makeStopDistanceSprite();
        labelSprite.visible = false;
        labelSprite.name = 'EX02_LIVE_DISTANCE_LABEL';
        zone.add(labelSprite);

        // ---- Sensor (logic only, separated from visual per spec §17) ----
        // Approach zone — vùng tiếp cận trước vạch dừng 15 m.
        const approachStartX = stopLineX - 15;
        const approachZone = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, approachStartX),
            new THREE.Vector3(z + halfWidth, 3, stopLineX)
        );

        // Stop line trigger — dải mỏng để chấm vị trí dừng.
        const stopLineTrigger = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, stopLineX - .15),
            new THREE.Vector3(z + halfWidth, 3, stopLineX + .15)
        );

        // Over-line sensor — phát hiện thanh cản trước đã vượt vạch.
        const overLineTrigger = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, stopLineX + .15),
            new THREE.Vector3(z + halfWidth, 3, stopLineX + 1)
        );

        // Exit sensor — sau vạch dừng 3 m, báo hoàn thành bài 2.
        const exitX = stopLineX + 3;
        const exitSensor = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, exitX - .4),
            new THREE.Vector3(z + halfWidth, 3, exitX + .4)
        );

        // Curb collider — dải rìa làn đường (mỗi bên 0.4 m) từ X spawn đến hết
        // bài 2 dùng cho DQ "Lái xe lên vỉa hè" (spec §7 Lỗi 04).
        const curbThickness = .4;
        const curbHeight = .25;
        const curbStartX = stopLineX - 16;
        const curbEndX = stopLineX + 4;
        const curbZLeft = new THREE.Box3(
            new THREE.Vector3(z - halfWidth - curbThickness, -1, curbStartX),
            new THREE.Vector3(z - halfWidth, curbHeight, curbEndX)
        );
        const curbZRight = new THREE.Box3(
            new THREE.Vector3(z + halfWidth, -1, curbStartX),
            new THREE.Vector3(z + halfWidth + curbThickness, curbHeight, curbEndX)
        );

        zone.userData = {
            sensors: {
                approachZone,
                stopLine: stopLineTrigger,
                overLine: overLineTrigger,
                exitSensor,
                curbCollider: [curbZLeft, curbZRight],
            },
            metadata: {
                stopLineX,
                crosswalkX,
                roadZ: z,
                roadWidth,
                direction,
                markerId: '2A',
            },
            // Truy cập nội bộ cho setStopDistanceLabel().
            handle: {
                updateLabel: (a: number, status: 'VALID' | 'TOO_EARLY' | 'OVER' | 'APPROACHING' | 'HIDDEN', anchorX: number) =>
                    this.updateStopDistanceLabel(labelSprite, a, status, anchorX),
            },
        };
        return zone;
    }

    /** Tạo một Sprite nhãn "A = X.XX m" đặt phía trước xe (hidden mặc định). */
    private makeStopDistanceSprite(): THREE.Sprite {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 192;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(canvas),
            transparent: true,
            depthTest: false,
            depthWrite: false,
        }));
        sprite.scale.set(4, 1.5, 1);
        sprite.renderOrder = 999;
        return sprite;
    }

    /** Cập nhật texture + vị trí của sprite khoảng cách A. */
    private updateStopDistanceLabel(
        sprite: THREE.Sprite,
        a: number,
        status: 'VALID' | 'TOO_EARLY' | 'OVER' | 'APPROACHING' | 'HIDDEN',
        anchorX: number,
    ): void {
        if (status === 'HIDDEN') {
            sprite.visible = false;
            return;
        }
        sprite.visible = true;
        sprite.position.set(anchorX + 6, 1.8, 0);
        const material = sprite.material as THREE.SpriteMaterial;
        const canvas = (material.map as THREE.CanvasTexture).image as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colorMap = {
            VALID: '#36c66a',
            TOO_EARLY: '#f6d34c',
            OVER: '#e15252',
            APPROACHING: '#5b9bdb',
        } as const;
        const statusText = {
            VALID: 'VỊ TRÍ HỢP LỆ',
            TOO_EARLY: 'DỪNG QUÁ XA',
            OVER: 'ĐÃ VƯỢT VẠCH',
            APPROACHING: 'ĐANG TIẾP CẬN',
        } as const;
        ctx.fillStyle = 'rgba(8, 14, 22, .78)';
        roundRect(ctx, 0, 0, canvas.width, canvas.height, 18);
        ctx.fill();
        ctx.strokeStyle = colorMap[status as Exclude<typeof status, 'HIDDEN'>];
        ctx.lineWidth = 6;
        roundRect(ctx, 3, 3, canvas.width - 6, canvas.height - 6, 15);
        ctx.stroke();
        ctx.fillStyle = colorMap[status as Exclude<typeof status, 'HIDDEN'>];
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`A = ${a.toFixed(2)} m`, canvas.width / 2, canvas.height / 2 - 8);
        ctx.font = '28px Arial';
        ctx.fillText(statusText[status as Exclude<typeof status, 'HIDDEN'>], canvas.width / 2, canvas.height / 2 + 50);
        (material.map as THREE.CanvasTexture).needsUpdate = true;
    }

    /**
     * API công khai: DrivingGame gọi mỗi frame để cập nhật nhãn khoảng cách A
     * trong bài 02. Tự tìm zone 2A đã tạo và gọi handle.updateLabel.
     * Trả về true nếu có zone hoạt động.
     */
    setStopDistanceLabel(a: number, status: 'VALID' | 'TOO_EARLY' | 'OVER' | 'APPROACHING' | 'HIDDEN', anchorX: number): boolean {
        const zone = this.root.children.find(
            child => child.name === 'ZONE_02_PEDESTRIAN'
        ) as THREE.Group | undefined;
        if (!zone || !zone.userData?.handle) return false;
        zone.userData.handle.updateLabel(a, status, anchorX);
        return true;
    }

    /** Tạo chữ in trên mặt đất dùng canvas texture (dùng cho nhãn "0.5 m"). */
    makeGroundLabel(text: string, x: number, z: number, roadWidth: number, heightWorld: number): THREE.Mesh {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f6d34c';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const aspect = canvas.width / canvas.height;
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(heightWorld * aspect, heightWorld),
            new THREE.MeshStandardMaterial({
                map: texture, transparent: true, roughness: .95, depthWrite: false,
            })
        );
        mesh.rotation.x = -Math.PI / 2;
        // Vạch 0.5 m đặt bên trái so với hướng xe (xe đi theo +X); chữ chạy ngược
        // để thí sinh đọc được khi tiến đến.
        mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
        mesh.position.set(x, .012, z + roadWidth / 4);
        mesh.receiveShadow = true;
        return mesh;
    }

    // ─── editor support API ───────────────────────────────────────────────────
    // The Road Editor (develop mode only) depends on the following accessors to
    // look up, mutate, and persist road / winding-course placements.

    /** Return the internal road registry. Used by the editor to find segments and rebind indices. */
    getRoads(): RoadSegment[] {
        return this.roads;
    }

    /** Return all registered winding-course entries (in insertion order). */
    getWindingCourses(): WindingCourseEntry[] {
        return this.windingCourses;
    }

    /** Walk up the parent chain of `obj` and return the WindingCourseEntry whose
     *  `course.root` contains it, or null when `obj` does not belong to any course. */
    findWindingCourseOf(obj: THREE.Object3D): WindingCourseEntry | null {
        for (const wc of this.windingCourses) {
            let cur: THREE.Object3D | null = obj;
            while (cur) {
                if (cur === wc.course.root) return wc;
                cur = cur.parent;
            }
        }
        return null;
    }

    /** Move the entry/exit road segments that belong to a winding course so they
     *  follow the course's current world position. Used after the editor drags
     *  the course to a new location. */
    rebuildWindingCourseRoads(entry: WindingCourseEntry): void {
        const { course } = entry;
        const newX = course.root.position.x;
        const newZ = course.root.position.z;
        const eRoad = this.roads[entry.entryRoadIndex];
        if (eRoad) {
            eRoad.group.position.set(newX, 0, newZ);
            eRoad.x = newX;
            eRoad.z = newZ;
        }
        const exit = course.exit.clone().applyMatrix4(course.root.matrix);
        const xRoad = this.roads[entry.exitRoadIndex];
        if (xRoad) {
            xRoad.group.position.set(exit.x, 0, exit.z);
            xRoad.x = exit.x;
            xRoad.z = exit.z;
        }
    }

    /** Persist a road move to localStorage so a reload restores the layout. */
    persistRoadEdit(roadIndex: number, newX: number, newZ: number): void {
        try {
            localStorage.setItem(`road-edit-${roadIndex}`, JSON.stringify({ x: newX, z: newZ }));
        } catch { /* localStorage unavailable */ }
    }

    /** Persist a winding-course move to localStorage so a reload restores the layout. */
    persistWCEdit(wcIndex: number, newX: number, newZ: number): void {
        try {
            localStorage.setItem(`wc-edit-${wcIndex}`, JSON.stringify({ x: newX, z: newZ }));
        } catch { /* localStorage unavailable */ }
    }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
