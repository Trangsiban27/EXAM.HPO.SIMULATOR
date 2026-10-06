import * as THREE from 'three';
import { FRONT_PROBE_OFFSET_M, startPosition } from '../startPosition';
import { EXAM_02_STOP_LINE_X, EXAM_03_STOP_LINE_X } from '../exam/examCourseGeometry';
import { steeringConfig } from '../drivetrain/SteeringSystem';
import type { Vehicle } from '../Vehicle';
import type { AutoDriveWaypointStop } from '../TrackObjects';
import type { AutoDriveLesson } from './autoDriveLessons';
import { AUTO_DRIVE_WAYPOINTS_BY_CLASS, type AutoDriveWaypoint } from './autoDriveRoutes';
import { EXAM_01_START_RULES, type ExamVehicleClass } from '../exam/examRules';

const COURSE_X = 105.4;
const COURSE_Z = 1.3;
const COURSE_ENTRY_LENGTH = 10.94;
const COURSE_A = 4.410;
const COURSE_B = 1.700;
const COURSE_ENTRY_SV = 6.62;
const COURSE_EXIT_LENGTH = 53.8;
const COURSE_CORNER_RADIUS = 1.2;
const ROAD_LANE_WIDTH_M = 3.7;
const ROAD_RIGHT_LANE_OFFSET_M = ROAD_LANE_WIDTH_M / 2;
const AUTO_DRIVE_START_RUNUP_M = 5;
const WAYPOINT_STOP_APPROACH_M = 8;
const AUTO_DRIVE_SPEED_MPS = 2.6;
const AUTO_DRIVE_BRAKING_MPS2 = 3.5;

type Stop = { position: THREE.Vector3; lesson: AutoDriveLesson };
type WaypointStopKind = 'bridge';
type Exam04GateWaypoint = { beforeIndex: number; point: AutoDriveWaypoint };

/** Drives a slow route and pauses at each lesson checkpoint. */
export class AutoDriveController {
    enabled = false;
    private stops: Stop[];
    private routes: THREE.Vector3[][];
    private stopIndex = 0;
    private waypointIndex = 0;
    private readonly capturedRoute?: readonly AutoDriveWaypoint[];
    private readonly exam04GateWaypoint?: Exam04GateWaypoint;
    private readonly recordedHeadings = new WeakMap<THREE.Vector3, number>();
    private waypointStopKind: WaypointStopKind = 'bridge';
    private waitingForLesson = false;
    private currentSpeed = 0;
    private brakingForWaypointStop = false;
    private waypointStopReady = false;
    private waypointStopConsumed = false;
    private approachingStartLine = false;
    private waypointStopTarget?: { position: THREE.Vector3; heading: number };
    private recordingWaypoints: { x: number; z: number; heading: number }[] = [];
    private recordingRouteName = 'bridgeToExam05Waypoints';
    private lastRecordedPosition?: THREE.Vector3;
    isWaypointRecording = false;

    constructor(
        lessons: readonly AutoDriveLesson[],
        private readonly publishLesson: (lesson: AutoDriveLesson | null) => void,
        private readonly onComplete: () => void,
        private readonly onWaypointStop: (kind: WaypointStopKind) => void,
        private readonly vehicleClass: ExamVehicleClass,
        private readonly exam04StartYellowSensor: THREE.Box3,
    ) {
        const savedRoutes = AUTO_DRIVE_WAYPOINTS_BY_CLASS[this.vehicleClass];
        this.capturedRoute = savedRoutes?.bridgeToExam05;
        this.exam04GateWaypoint = this.capturedRoute
            ? this.findExam04GateWaypoint(this.capturedRoute)
            : undefined;
        this.stops = this.buildStops(lessons);
        this.routes = this.buildRoutes();
    }

    get currentExamNumber(): number {
        return this.stops[this.stopIndex]?.lesson.id ?? 5;
    }

    get currentExerciseTitle(): string {
        return this.stopIndex === 3 && !this.waitingForLesson
            ? 'Tự động · Chờ vào bài 4'
            : `Tự động · Bài ${this.currentExamNumber}`;
    }

    start(vehicle: Vehicle): void {
        this.enabled = true;
        this.stopIndex = 0;
        this.waypointIndex = 0;
        this.waypointStopKind = 'bridge';
        this.currentSpeed = 0;
        this.brakingForWaypointStop = false;
        this.waypointStopReady = false;
        this.waypointStopConsumed = false;
        this.approachingStartLine = true;
        this.waypointStopTarget = undefined;
        this.recordingWaypoints = [];
        this.isWaypointRecording = false;
        vehicle.root.position.copy(this.stops[0].position);
        vehicle.root.position.x -= AUTO_DRIVE_START_RUNUP_M;
        vehicle.root.rotation.set(0, startPosition.heading, 0);
        this.waitingForLesson = false;
        this.publishLesson(null);
    }

    stop(): void {
        this.enabled = false;
        this.waitingForLesson = false;
        this.approachingStartLine = false;
        this.isWaypointRecording = false;
        this.publishLesson(null);
    }

    /** Resume driving after the learner has read the current lesson. */
    continueLesson(): void {
        if (!this.enabled || !this.waitingForLesson) return;
        this.waitingForLesson = false;
        this.publishLesson(null);
        if (this.stopIndex >= this.stops.length - 1) {
            this.enabled = false;
            this.onComplete();
            return;
        }
        this.stopIndex++;
        this.waypointIndex = 0;
    }

    update(
        dt: number,
        vehicle: Vehicle,
        waypointStops: AutoDriveWaypointStop[],
    ): void {
        if (!this.enabled) return;

        // Bài 1 bắt đầu tại vạch xuất phát. Giữ xi nhan trái đến mốc 5 m
        // sau vạch, nơi bài 1 yêu cầu tắt xi nhan.
        if (this.stopIndex === 0 && this.waitingForLesson) {
            if (!vehicle.signals.left || vehicle.signals.right || vehicle.signals.hazard) {
                vehicle.setSignal({ left: true, right: false, hazard: false });
            }
        } else if (this.stopIndex === 1) {
            const frontX = vehicle.root.position.x + FRONT_PROBE_OFFSET_M;
            const left = frontX < startPosition.lineX + EXAM_01_START_RULES.signalOffDistanceM;
            if (vehicle.signals.left !== left || vehicle.signals.right || vehicle.signals.hazard) {
                vehicle.setSignal({ left, right: false, hazard: false });
            }
        }

        if (this.waypointStopReady) {
            vehicle.updateAutomatic(dt, 0, 0);
            return;
        }

        if (this.approachingStartLine) {
            const target = this.stops[0].position;
            const distance = vehicle.root.position.distanceTo(target);
            const stoppingSpeed = Math.sqrt(2 * AUTO_DRIVE_BRAKING_MPS2 * Math.max(0, distance - .08));
            const targetSpeed = Math.min(AUTO_DRIVE_SPEED_MPS, stoppingSpeed);
            this.currentSpeed = this.approach(this.currentSpeed, targetSpeed,
                (targetSpeed < this.currentSpeed ? AUTO_DRIVE_BRAKING_MPS2 : AUTO_DRIVE_SPEED_MPS) * dt);
            vehicle.updateAutomatic(dt, 0, this.currentSpeed);
            if (distance < .12 && this.currentSpeed < .04) {
                this.currentSpeed = 0;
                vehicle.root.position.copy(target);
                vehicle.root.rotation.set(0, startPosition.heading, 0);
                this.approachingStartLine = false;
                this.waitingForLesson = true;
                vehicle.setSignal({ left: true, right: false, hazard: false });
                this.publishLesson(this.stops[0].lesson);
            }
            return;
        }

        if (this.waitingForLesson) {
            this.currentSpeed = this.approach(this.currentSpeed, 0, AUTO_DRIVE_BRAKING_MPS2 * dt);
            vehicle.updateAutomatic(dt, 0, this.currentSpeed);
            return;
        }

        // Keep the recording checkpoint available for classes that do not yet
        // have a saved route. A class with captured waypoints drives through it.
        if (!this.capturedRoute && !this.waypointStopConsumed) {
            const marker = waypointStops.find(item => this.isApproachingMarker(vehicle, item));
            if (marker) {
                this.waypointStopKind = 'bridge';
                this.waypointStopTarget = this.getMarkerStopTarget(vehicle, marker);
                this.brakingForWaypointStop = true;
                this.waypointStopConsumed = true;
            }
        }
        if (this.brakingForWaypointStop) {
            const target = this.waypointStopTarget!;
            const forwardX = -Math.sin(target.heading);
            const forwardZ = -Math.cos(target.heading);
            const remaining = (target.position.x - vehicle.root.position.x) * forwardX
                + (target.position.z - vehicle.root.position.z) * forwardZ;
            const stoppingSpeed = Math.sqrt(2 * AUTO_DRIVE_BRAKING_MPS2 * Math.max(0, remaining - .08));
            const targetSpeed = Math.min(AUTO_DRIVE_SPEED_MPS, stoppingSpeed);
            this.currentSpeed = this.approach(this.currentSpeed, targetSpeed,
                (targetSpeed < this.currentSpeed ? AUTO_DRIVE_BRAKING_MPS2 : AUTO_DRIVE_SPEED_MPS) * dt);
            // The bridge exit is straight. Braking along its axis avoids the
            // steering loop around a target point when the car is slightly off centre.
            vehicle.updateAutomatic(dt, 0, this.currentSpeed);
            if ((remaining < .12 && this.currentSpeed < .04) || remaining <= 0) {
                this.currentSpeed = 0;
                vehicle.updateAutomatic(dt, 0, 0);
                vehicle.root.position.x = target.position.x;
                vehicle.root.position.z = target.position.z;
                vehicle.root.rotation.y = target.heading;
                this.brakingForWaypointStop = false;
                this.waypointStopReady = true;
                this.onWaypointStop(this.waypointStopKind);
            }
            return;
        }

        const route = this.routes[this.stopIndex - 1] ?? [];
        if (this.capturedRoute && (this.stopIndex === 3 || this.stopIndex === 4)) {
            this.followSavedRoute(dt, vehicle, route);
            return;
        }
        if (this.waypointIndex >= route.length) {
            this.currentSpeed = this.approach(this.currentSpeed, 0, AUTO_DRIVE_BRAKING_MPS2 * dt);
            vehicle.updateAutomatic(dt, 0, this.currentSpeed);
            if (this.currentSpeed < .04) {
                this.currentSpeed = 0;
                this.waitingForLesson = true;
                this.publishLesson(this.stops[this.stopIndex].lesson);
            }
            return;
        }

        const target = route[this.waypointIndex];
        const dx = target.x - vehicle.root.position.x;
        const dz = target.z - vehicle.root.position.z;
        const distance = Math.hypot(dx, dz);
        if (distance < 1.35) {
            this.waypointIndex++;
            if (this.waypointIndex >= route.length) {
                this.currentSpeed = this.approach(this.currentSpeed, 0, AUTO_DRIVE_BRAKING_MPS2 * dt);
                vehicle.updateAutomatic(dt, 0, this.currentSpeed);
                return;
            }
        }

        const next = route[this.waypointIndex] ?? target;
        const ndx = next.x - vehicle.root.position.x;
        const ndz = next.z - vehicle.root.position.z;
        const desiredHeading = Math.atan2(-ndx, -ndz);
        const headingError = THREE.MathUtils.euclideanModulo(
            desiredHeading - vehicle.root.rotation.y + Math.PI,
            Math.PI * 2,
        ) - Math.PI;
        // Pure-pursuit steering: scale the correction by the target distance so
        // short curve waypoints produce enough steering to stay on the lane arc.
        // Positive road-wheel angle turns right and decreases heading.
        const lookahead = Math.max(.25, Math.hypot(ndx, ndz));
        const roadWheelAngle = -Math.atan(
            (2 * steeringConfig.wheelBase * Math.sin(headingError)) / lookahead,
        );
        const steering = THREE.MathUtils.clamp(
            roadWheelAngle / THREE.MathUtils.degToRad(steeringConfig.maxRoadWheelAngle),
            -1,
            1,
        );
        const endDistance = vehicle.root.position.distanceTo(route[route.length - 1]);
        const stoppingSpeed = Math.sqrt(2 * AUTO_DRIVE_BRAKING_MPS2 * Math.max(0, endDistance - .35));
        const targetSpeed = Math.min(AUTO_DRIVE_SPEED_MPS, stoppingSpeed);
        this.currentSpeed = this.approach(this.currentSpeed, targetSpeed,
            (targetSpeed < this.currentSpeed ? AUTO_DRIVE_BRAKING_MPS2 : AUTO_DRIVE_SPEED_MPS) * dt);
        vehicle.updateAutomatic(dt, steering, this.currentSpeed);
    }

    /** Replay the recorded vehicle path at a fixed speed without steering toward a stale point. */
    private followSavedRoute(dt: number, vehicle: Vehicle, route: readonly THREE.Vector3[]): void {
        const position = vehicle.root.position;
        const finish = route[route.length - 1];
        if (!finish) return;

        let remaining = this.waypointIndex < route.length
            ? Math.hypot(position.x - route[this.waypointIndex].x,
                position.z - route[this.waypointIndex].z)
            : 0;
        for (let i = this.waypointIndex + 1; i < route.length; i++) {
            remaining += Math.hypot(route[i].x - route[i - 1].x,
                route[i].z - route[i - 1].z);
        }
        if (remaining < .03 || this.waypointIndex >= route.length) {
            this.currentSpeed = 0;
            vehicle.updateAutomatic(dt, 0, 0);
            position.x = finish.x;
            position.z = finish.z;
            this.waypointIndex = route.length;
            this.waitingForLesson = true;
            this.publishLesson(this.stops[this.stopIndex].lesson);
            return;
        }

        const stoppingSpeed = Math.sqrt(2 * AUTO_DRIVE_BRAKING_MPS2 * remaining);
        const targetSpeed = Math.min(AUTO_DRIVE_SPEED_MPS, stoppingSpeed);
        this.currentSpeed = this.approach(this.currentSpeed, targetSpeed,
            (targetSpeed < this.currentSpeed ? AUTO_DRIVE_BRAKING_MPS2 : AUTO_DRIVE_SPEED_MPS) * dt);

        let travel = this.currentSpeed * dt;
        let x = position.x;
        let z = position.z;
        let heading = vehicle.root.rotation.y;
        const initialHeading = heading;
        while (travel > 0 && this.waypointIndex < route.length) {
            const target = route[this.waypointIndex];
            const dx = target.x - x;
            const dz = target.z - z;
            const distance = Math.hypot(dx, dz);
            if (distance < .0001) {
                this.waypointIndex++;
                continue;
            }
            const step = Math.min(travel, distance);
            x += dx * step / distance;
            z += dz * step / distance;
            const segmentHeading = this.recordedHeadings.get(target) ?? Math.atan2(-dx, -dz);
            const headingError = THREE.MathUtils.euclideanModulo(
                segmentHeading - heading + Math.PI, Math.PI * 2,
            ) - Math.PI;
            heading += headingError * step / distance;
            travel -= step;
            if (step >= distance - .0001) this.waypointIndex++;
        }

        // Show the corresponding wheel angle while the saved route remains the
        // authoritative position and heading of the guided car.
        const travelled = Math.hypot(x - position.x, z - position.z);
        const headingChange = THREE.MathUtils.euclideanModulo(
            heading - initialHeading + Math.PI, Math.PI * 2,
        ) - Math.PI;
        const roadWheelAngle = -Math.atan(steeringConfig.wheelBase * headingChange
            / Math.max(travelled, .001));
        const steering = THREE.MathUtils.clamp(
            roadWheelAngle / THREE.MathUtils.degToRad(steeringConfig.maxRoadWheelAngle),
            -1, 1,
        );
        vehicle.updateAutomatic(dt, steering, this.currentSpeed);
        position.x = x;
        position.z = z;
        vehicle.root.rotation.y = heading;
    }

    beginWaypointRecording(vehicle: Vehicle): void {
        if (!this.enabled || !this.waypointStopReady || this.isWaypointRecording) return;
        this.recordingRouteName = 'bridgeToExam05Waypoints';
        this.recordingWaypoints = [];
        this.lastRecordedPosition = undefined;
        this.recordWaypoint(vehicle, true);
        this.isWaypointRecording = true;
    }

    captureWaypoint(vehicle: Vehicle): number {
        if (this.isWaypointRecording) this.recordWaypoint(vehicle);
        return this.recordingWaypoints.length;
    }

    finishWaypointRecording(vehicle: Vehicle): string {
        if (!this.isWaypointRecording) return this.formatRecordedRoute();
        this.recordWaypoint(vehicle, true);
        this.isWaypointRecording = false;
        return this.formatRecordedRoute();
    }

    private recordWaypoint(vehicle: Vehicle, force = false): void {
        const position = vehicle.root.position;
        if (this.lastRecordedPosition && this.lastRecordedPosition.distanceTo(position) < (force ? .005 : .4)) return;
        this.recordingWaypoints.push({
            x: Number(position.x.toFixed(2)),
            z: Number(position.z.toFixed(2)),
            heading: Number(vehicle.root.rotation.y.toFixed(3)),
        });
        this.lastRecordedPosition = position.clone();
    }

    private formatRecordedRoute(): string {
        return `const ${this.recordingRouteName} = [\n${this.recordingWaypoints
            .map(point => `    { x: ${point.x}, z: ${point.z}, heading: ${point.heading} },`)
            .join('\n')}\n];`;
    }

    private isApproachingMarker(vehicle: Vehicle, marker: AutoDriveWaypointStop): boolean {
        const localPosition = marker.root.worldToLocal(vehicle.root.position.clone());
        if (Math.abs(localPosition.z - marker.laneOffsetM) > 2.5) return false;

        const forward = new THREE.Vector3(-Math.sin(vehicle.root.rotation.y), 0, -Math.cos(vehicle.root.rotation.y));
        const markerNormal = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(marker.root.getWorldQuaternion(new THREE.Quaternion()))
            .setY(0)
            .normalize();
        const alignment = forward.dot(markerNormal);
        if (Math.abs(alignment) < .85) return false;

        const linePoint = marker.root.localToWorld(new THREE.Vector3(0, 0, marker.laneOffsetM));
        const frontPoint = vehicle.root.position.clone().addScaledVector(forward, FRONT_PROBE_OFFSET_M);
        const distanceAhead = linePoint.sub(frontPoint).dot(forward);
        return distanceAhead >= 0 && distanceAhead <= WAYPOINT_STOP_APPROACH_M;
    }

    private getMarkerStopTarget(
        vehicle: Vehicle,
        marker: AutoDriveWaypointStop,
    ): { position: THREE.Vector3; heading: number } {
        const forward = new THREE.Vector3(-Math.sin(vehicle.root.rotation.y), 0, -Math.cos(vehicle.root.rotation.y));
        const markerNormal = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(marker.root.getWorldQuaternion(new THREE.Quaternion()))
            .setY(0)
            .normalize();
        if (forward.dot(markerNormal) < 0) markerNormal.negate();
        const heading = Math.atan2(-markerNormal.x, -markerNormal.z);
        const frontPoint = marker.root.localToWorld(new THREE.Vector3(0, 0, marker.laneOffsetM));
        const position = frontPoint.addScaledVector(markerNormal, -FRONT_PROBE_OFFSET_M);
        position.y = 0;
        return { position, heading };
    }

    private approach(value: number, target: number, maxDelta: number): number {
        return value < target ? Math.min(target, value + maxDelta) : Math.max(target, value - maxDelta);
    }

    private recordedPoint(point: AutoDriveWaypoint): THREE.Vector3 {
        const position = new THREE.Vector3(point.x, 0, point.z);
        this.recordedHeadings.set(position, point.heading);
        return position;
    }

    private buildStops(lessons: readonly AutoDriveLesson[]): Stop[] {
        const lessonFor = (id: number): AutoDriveLesson => {
            const lesson = lessons.find(item => item.id === id);
            if (!lesson) throw new Error(`Missing auto drive lesson ${id}.`);
            return lesson;
        };
        const startRootX = startPosition.lineX - FRONT_PROBE_OFFSET_M;
        const laneZ = startPosition.lineZ + startPosition.laneOffset;
        const recordedGate = this.exam04GateWaypoint?.point;
        const gateCenter = this.exam04StartYellowSensor.getCenter(new THREE.Vector3());
        const exam04StartRoot = recordedGate
            ? new THREE.Vector3(recordedGate.x, 0, recordedGate.z)
            : new THREE.Vector3(this.exam04StartYellowSensor.max.x + FRONT_PROBE_OFFSET_M, 0, gateCenter.z);
        const recordedExam05Start = this.capturedRoute?.at(-1);
        const finalStop = recordedExam05Start
            ? new THREE.Vector3(recordedExam05Start.x, 0, recordedExam05Start.z)
            : new THREE.Vector3(21.4, 0, -33.7);
        return [
            { position: new THREE.Vector3(startRootX, 0, laneZ), lesson: lessonFor(1) },
            { position: new THREE.Vector3(EXAM_02_STOP_LINE_X - FRONT_PROBE_OFFSET_M, 0, laneZ), lesson: lessonFor(2) },
            { position: new THREE.Vector3(EXAM_03_STOP_LINE_X - FRONT_PROBE_OFFSET_M, 0, laneZ), lesson: lessonFor(3) },
            { position: exam04StartRoot, lesson: lessonFor(4) },
            { position: finalStop, lesson: lessonFor(5) },
        ];
    }

    private buildRoutes(): THREE.Vector3[][] {
        const stops = this.stops;
        const leg1 = [stops[1].position.clone()];
        const leg2 = [stops[2].position.clone()];
        const leg3 = this.bridgeToWheelTrackRoute(stops[2].position, stops[3].position);
        const leg4 = this.wheelTrackToIntersectionRoute(stops[3].position, stops[4].position);
        return [leg1, leg2, leg3, leg4];
    }

    private bridgeToWheelTrackRoute(from: THREE.Vector3, exam04Start: THREE.Vector3): THREE.Vector3[] {
        if (this.capturedRoute && this.exam04GateWaypoint) {
            const approachPoints = this.capturedRoute
                .slice(0, this.exam04GateWaypoint.beforeIndex + 1)
                .map(point => this.recordedPoint(point));
            const route = this.dedupe([from.clone(), ...approachPoints]);
            // Keep the interpolated contact point even when it is closer than
            // the normal dedupe threshold to the preceding recorded waypoint.
            route.push(this.recordedPoint(this.exam04GateWaypoint.point));
            return route;
        }

        const rightLaneZ = 18.2 + ROAD_RIGHT_LANE_OFFSET_M;
        const rightLaneX = 109.1 + ROAD_RIGHT_LANE_OFFSET_M;
        const outsideTurnRadius = 3.7 + ROAD_RIGHT_LANE_OFFSET_M;
        const points = [from.clone(), new THREE.Vector3(103.3, 0, rightLaneZ)];
        // Follow the right-lane centre around the outside of the left turn, then
        // stay in that lane on the descent. Merge toward the course entry only
        // near the lower junction, where the route leaves the two-lane road.
        points.push(...this.arcPoints(105.4, 14.5, outsideTurnRadius, Math.PI / 2, 0));
        points.push(
            new THREE.Vector3(rightLaneX, 0, 12),
            new THREE.Vector3(rightLaneX - .25, 0, 10),
            new THREE.Vector3(109.9, 0, 8),
            new THREE.Vector3(109.1, 0, 7.1),
        );
        points.push(...this.arcPoints(105.4, 5, 3.7, 0, -Math.PI / 2));
        points.push(exam04Start.clone());
        return this.dedupe(points);
    }

    private wheelTrackToIntersectionRoute(exam04Start: THREE.Vector3, finalStop: THREE.Vector3): THREE.Vector3[] {
        const shape = this.courseShape();
        if (this.capturedRoute && this.exam04GateWaypoint) {
            const route: THREE.Vector3[] = [this.recordedPoint(this.exam04GateWaypoint.point), ...this.capturedRoute
                .slice(this.exam04GateWaypoint.beforeIndex + 1)
                .map(point => this.recordedPoint(point))];
            return this.dedupe(route);
        }

        const route: THREE.Vector3[] = [exam04Start.clone()];
        for (const point of shape.points.slice(1)) {
            const world = this.courseLocalToWorld(point.x, point.y);
            const previous = shape.points[Math.max(0, shape.points.indexOf(point) - 1)];
            const tangentLocal = new THREE.Vector2(point.x - previous.x, point.y - previous.y).normalize();
            const tangentWorld = new THREE.Vector2(tangentLocal.y, -tangentLocal.x).normalize();
            world.x -= tangentWorld.x * FRONT_PROBE_OFFSET_M;
            world.z -= tangentWorld.y * FRONT_PROBE_OFFSET_M;
            route.push(world);
        }
        route.push(...this.arcPoints(23.5, 6.4, 3.7, Math.PI / 2, Math.PI));
        route.push(new THREE.Vector3(19.8, 0, -27.9));
        route.push(...this.arcPoints(23.5, -30, 3.7, Math.PI, Math.PI * 1.5));
        route.push(finalStop.clone());
        return this.dedupe(route);
    }

    private courseShape(): { points: THREE.Vector2[] } {
        const halfBv = (COURSE_B * 2.2) / 2;
        const trackStartZ = -COURSE_ENTRY_LENGTH;
        const limitStartZ = trackStartZ - COURSE_A - 2;
        const crossZ = limitStartZ - COURSE_ENTRY_SV + halfBv;
        const exitX = -2 * COURSE_A;
        const limitEndZ = crossZ + halfBv - 1.5 * COURSE_A;
        const exitZ = limitEndZ - COURSE_EXIT_LENGTH;
        const r = COURSE_CORNER_RADIUS;
        const firstStraightEnd = crossZ + r;
        const firstArc = this.localArc(-r, firstStraightEnd, r, 0, -Math.PI / 2);
        const firstArcEnd = firstArc[firstArc.length - 1];
        const secondStartX = exitX + r;
        const secondStartZ = firstArcEnd.y;
        const secondArc = this.localArc(secondStartX, secondStartZ - r, r, Math.PI / 2, Math.PI);
        const points: THREE.Vector2[] = [new THREE.Vector2(0, 0), new THREE.Vector2(0, firstStraightEnd), ...firstArc.slice(1)];
        points.push(new THREE.Vector2(secondStartX, firstArcEnd.y));
        points.push(...secondArc.slice(1));
        points.push(new THREE.Vector2(exitX, exitZ));
        return { points: this.dedupe2(points) };
    }

    private courseLocalToWorld(localX: number, localZ: number): THREE.Vector3 {
        return new THREE.Vector3(COURSE_X + localZ, 0, COURSE_Z - localX);
    }

    private findExam04GateWaypoint(waypoints: readonly AutoDriveWaypoint[]): Exam04GateWaypoint {
        const sensor = this.exam04StartYellowSensor;
        const frontX = (point: AutoDriveWaypoint) => point.x - Math.sin(point.heading) * FRONT_PROBE_OFFSET_M;
        for (let index = 1; index < waypoints.length; index++) {
            const previous = waypoints[index - 1];
            const next = waypoints[index];
            const beforeX = frontX(previous);
            const afterX = frontX(next);
            if (beforeX < sensor.max.x || afterX > sensor.max.x || beforeX <= afterX) continue;

            // The B course is entered toward -X. Interpolate the saved pose at
            // the near edge of the same yellow-line sensor used by exam scoring.
            const fraction = (beforeX - sensor.max.x) / (beforeX - afterX);
            const headingDelta = THREE.MathUtils.euclideanModulo(
                next.heading - previous.heading + Math.PI, Math.PI * 2,
            ) - Math.PI;
            const heading = previous.heading + headingDelta * fraction;
            const z = THREE.MathUtils.lerp(previous.z, next.z, fraction);
            const frontZ = z - Math.cos(heading) * FRONT_PROBE_OFFSET_M;
            if (frontZ < sensor.min.z || frontZ > sensor.max.z) continue;
            return {
                beforeIndex: index - 1,
                point: { x: THREE.MathUtils.lerp(previous.x, next.x, fraction), z, heading },
            };
        }
        throw new Error('Saved auto-drive route does not cross EX04_START_YELLOW_LINE.');
    }

    private localArc(cx: number, cz: number, radius: number, start: number, end: number): THREE.Vector2[] {
        const points: THREE.Vector2[] = [];
        const count = Math.max(4, Math.ceil(Math.abs(end - start) * radius / .75));
        for (let i = 0; i <= count; i++) {
            const angle = start + (end - start) * i / count;
            points.push(new THREE.Vector2(cx + radius * Math.cos(angle), cz + radius * Math.sin(angle)));
        }
        return points;
    }

    private arcPoints(cx: number, cz: number, radius: number, start: number, end: number): THREE.Vector3[] {
        const points: THREE.Vector3[] = [];
        const count = Math.max(5, Math.ceil(Math.abs(end - start) * radius / 1.1));
        const direction = Math.sign(end - start);
        for (let i = 0; i <= count; i++) {
            const angle = start + (end - start) * i / count;
            const tangent = new THREE.Vector2(-Math.sin(angle) * direction, Math.cos(angle) * direction);
            points.push(new THREE.Vector3(
                cx + radius * Math.cos(angle) - tangent.x * FRONT_PROBE_OFFSET_M,
                0,
                cz + radius * Math.sin(angle) - tangent.y * FRONT_PROBE_OFFSET_M,
            ));
        }
        return points;
    }

    private dedupe(points: THREE.Vector3[]): THREE.Vector3[] {
        return points.filter((point, index) => index === 0 || point.distanceTo(points[index - 1]) > .15);
    }

    private dedupe2(points: THREE.Vector2[]): THREE.Vector2[] {
        return points.filter((point, index) => index === 0 || point.distanceTo(points[index - 1]) > .15);
    }
}
