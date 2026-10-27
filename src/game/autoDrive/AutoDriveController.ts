import * as THREE from 'three';
import { FRONT_PROBE_OFFSET_M, startPosition } from '../startPosition';
import { EXAM_02_STOP_LINE_X, EXAM_03_STOP_LINE_X } from '../exam/examCourseGeometry';
import { steeringConfig } from '../drivetrain/SteeringSystem';
import type { Vehicle } from '../Vehicle';
import type { TrafficLight } from '../TrafficLight';
import type { AutoDriveWaypointStop } from '../TrackObjects';
import type { AutoDriveLesson } from './autoDriveLessons';
import { EXAM_11_LESSON } from './autoDriveLessons';
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
const SELECTED_LESSON_APPROACH_M = 3;
const WAYPOINT_STOP_APPROACH_M = 8;
const AUTO_DRIVE_SPEED_MPS = 2.6;
const AUTO_DRIVE_REVERSE_SPEED_MPS = 5 / 3.6;
const AUTO_DRIVE_BRAKING_MPS2 = 3.5;
const GEAR_CHANGE_PAUSE_SEC = 1.5;
const CONTINUOUS_LESSON_PAUSE_SEC = 2;
const RAILWAY_STOP_FRONT_GAP_M = .5;
const TRAFFIC_STOP_FRONT_GAP_M = .5;
const TRAFFIC_GREEN_COMMIT_SEC = 2;

type Stop = { position: THREE.Vector3; lesson: AutoDriveLesson };
type WaypointStopKind = 'bridge' | 'exam05' | 'exam06' | 'exam07' | 'exam08' | 'exam09' | 'exam10';
type SavedRouteStopKind = WaypointStopKind | 'routeEnd';
type Exam04GateWaypoint = { beforeIndex: number; point: AutoDriveWaypoint };

/** Drives a slow route and pauses at each lesson checkpoint. */
export class AutoDriveController {
    enabled = false;
    private continuous = false;
    private continuousPauseRemaining = 0;
    private pausedLesson: AutoDriveLesson | null = null;
    private stops: Stop[];
    private routes: THREE.Vector3[][];
    private stopIndex = 0;
    private waypointIndex = 0;
    private readonly capturedRoute?: readonly AutoDriveWaypoint[];
    private readonly exam06ApproachRoute?: THREE.Vector3[];
    private readonly exam07ApproachRoute?: THREE.Vector3[];
    private readonly exam08ApproachRoute?: THREE.Vector3[];
    private readonly exam09ApproachRoute?: THREE.Vector3[];
    private readonly exam08PopupWaypointIndex?: number;
    private readonly exam09PopupWaypointIndex?: number;
    private readonly exam10PopupWaypointIndex?: number;
    private readonly exam08DirectionChangeIndices: number[];
    private readonly exam10DirectionChangeIndices: number[];
    private readonly exam04GateWaypoint?: Exam04GateWaypoint;
    private trafficStopWaypointIndex?: number;
    private trafficStopLineWorldZ?: number;
    private eastTrafficStopWaypointIndex?: number;
    private eastTrafficStopLineWorldX?: number;
    private exam05LessonShown = false;
    private exam06ApproachStarted = false;
    private exam07ApproachStarted = false;
    private exam08ApproachStarted = false;
    private exam09ApproachStarted = false;
    private exam08DirectionChangeCursor = 0;
    private exam08ShiftPauseRemaining = 0;
    private readonly recordedHeadings = new WeakMap<THREE.Vector3, number>();
    private readonly recordedSpeeds = new WeakMap<THREE.Vector3, number>();
    private readonly recordedPopupLessons = new WeakMap<THREE.Vector3, number>();
    private southExitStopIndex?: number;
    private southExitStopLineZ?: number;
    private southExitTurnEndIndex?: number;
    private southExitLeftSignalOn = false;
    private waypointStopKind: WaypointStopKind = 'bridge';
    private waitingForLesson = false;
    private waitingForTrafficLight = false;
    private trafficGreenCommitted = false;
    private currentSpeed = 0;
    private finishRightSignalOn = false;
    private brakingForWaypointStop = false;
    private waypointStopReady = false;
    private waypointStopConsumed = false;
    private approachingStartLine = false;
    private selectedApproachRoute?: THREE.Vector3[];
    private waypointStopTarget?: { position: THREE.Vector3; heading: number };
    private recordingWaypoints: AutoDriveWaypoint[] = [];
    private recordingRouteName = 'bridgeToExam05Waypoints';
    private lastRecordedPosition?: THREE.Vector3;
    isWaypointRecording = false;

    constructor(
        lessons: readonly AutoDriveLesson[],
        private readonly onLesson: (lesson: AutoDriveLesson | null) => void,
        private readonly onComplete: () => void,
        private readonly publishWaypointStop: (kind: WaypointStopKind) => void,
        private readonly vehicleClass: ExamVehicleClass,
        private readonly exam04StartYellowSensor: THREE.Box3,
        private readonly southTrafficLight?: TrafficLight,
        private readonly eastTrafficLight?: TrafficLight,
        railwayStopLine?: THREE.Object3D,
        private readonly exam09AccelerationPositions?: readonly [number, number, number],
        private readonly finishTrafficLight?: TrafficLight,
        private readonly southExitTrafficLight?: TrafficLight,
    ) {
        const savedRoutes = AUTO_DRIVE_WAYPOINTS_BY_CLASS[this.vehicleClass];
        this.capturedRoute = savedRoutes?.bridgeToExam05;
        this.exam06ApproachRoute = savedRoutes?.exam05ToExam06?.map(point => this.recordedPoint(point));
        this.exam07ApproachRoute = savedRoutes?.exam06ToExam07?.map(point => this.recordedPoint(point));
        this.exam08ApproachRoute = savedRoutes?.exam07ToExam08?.map(point => this.recordedPoint(point));
        this.exam09ApproachRoute = savedRoutes?.exam08ToExam09?.map(point => this.recordedPoint(point));
        this.addSouthExitTrafficStopWaypoint();
        const exam09PopupIndex = this.exam09ApproachRoute?.findIndex(point => this.recordedPopupLessons.get(point) === 9);
        this.exam09PopupWaypointIndex = exam09PopupIndex !== undefined && exam09PopupIndex >= 0
            ? exam09PopupIndex : undefined;
        const exam10PopupIndex = this.exam09ApproachRoute?.findIndex(point => this.recordedPopupLessons.get(point) === 10);
        this.exam10PopupWaypointIndex = exam10PopupIndex !== undefined && exam10PopupIndex >= 0
            ? exam10PopupIndex : undefined;
        this.exam10DirectionChangeIndices = this.exam09ApproachRoute && this.exam10PopupWaypointIndex !== undefined
            ? this.findDirectionChangeIndices(this.exam09ApproachRoute)
                .filter(index => index >= this.exam10PopupWaypointIndex!) : [];
        this.exam08PopupWaypointIndex = this.exam09ApproachRoute && railwayStopLine
            ? this.findRailwayStopWaypointIndex(this.exam09ApproachRoute, railwayStopLine)
            : undefined;
        this.exam08DirectionChangeIndices = this.exam08ApproachRoute
            ? this.findDirectionChangeIndices(this.exam08ApproachRoute) : [];
        this.exam04GateWaypoint = this.capturedRoute
            ? this.findExam04GateWaypoint(this.capturedRoute)
            : undefined;
        this.stops = this.buildStops(lessons);
        this.routes = this.buildRoutes();
        this.addTrafficStopWaypoint();
        this.addEastTrafficStopWaypoint();
        if (this.trafficStopWaypointIndex !== undefined) {
            this.stops[4].position.copy(this.routes[3][this.trafficStopWaypointIndex]);
        }
    }

    setContinuous(enabled: boolean): void {
        this.continuous = enabled;
        if (!enabled) {
            const pending = this.continuousPauseRemaining > 0;
            this.continuousPauseRemaining = 0;
            if (pending && this.waitingForLesson) this.onLesson(this.pausedLesson);
            else if (pending && this.waypointStopReady) this.publishWaypointStop(this.waypointStopKind);
            this.pausedLesson = null;
            return;
        }
        if (!this.enabled || this.isWaypointRecording) return;
        if (this.waitingForLesson) {
            this.pausedLesson ??= this.stops[this.stopIndex]?.lesson ?? null;
            this.continuousPauseRemaining = CONTINUOUS_LESSON_PAUSE_SEC;
            this.onLesson(null);
        } else if (this.waypointStopReady && this.canContinueCheckpoint()) {
            this.continuousPauseRemaining = CONTINUOUS_LESSON_PAUSE_SEC;
            this.onLesson(null);
        }
    }

    private canContinueCheckpoint(): boolean {
        return (this.waypointStopKind === 'exam05' && !!this.exam06ApproachRoute?.length)
            || (this.waypointStopKind === 'exam07' && !!this.exam08ApproachRoute?.length)
            || (this.waypointStopKind === 'exam08' && !!this.exam09ApproachRoute?.length)
            || this.waypointStopKind === 'exam09' || this.waypointStopKind === 'exam10';
    }

    private publishLesson(lesson: AutoDriveLesson | null): void {
        if (lesson && this.continuous && !this.isWaypointRecording) {
            this.pausedLesson = lesson;
            this.continuousPauseRemaining = CONTINUOUS_LESSON_PAUSE_SEC;
            return;
        }
        this.onLesson(lesson);
    }

    private onWaypointStop(kind: WaypointStopKind): void {
        if (this.continuous && !this.isWaypointRecording && this.canContinueCheckpoint()) {
            this.continuousPauseRemaining = CONTINUOUS_LESSON_PAUSE_SEC;
            return;
        }
        // A checkpoint without a saved continuation still needs manual intervention.
        this.publishWaypointStop(kind);
    }

    get currentExamNumber(): number {
        if (this.finishRightSignalOn) return 11;
        if (this.waypointStopKind === 'exam10') return 10;
        if (this.waypointStopKind === 'exam09' || (this.exam09ApproachStarted
            && this.waypointStopKind === 'exam08')) return 9;
        if (this.exam08ApproachStarted || this.exam09ApproachStarted || (this.waypointStopReady
            && this.waypointStopKind === 'exam08')) return 8;
        if (this.exam07ApproachStarted || (this.waypointStopReady
            && (this.waypointStopKind === 'exam06' || this.waypointStopKind === 'exam07'))) return 7;
        if (this.exam06ApproachStarted || (this.waypointStopReady
            && this.waypointStopKind === 'exam05')) return 6;
        return this.stops[this.stopIndex]?.lesson.id ?? 5;
    }

    get currentExerciseTitle(): string {
        if (this.waitingForTrafficLight) return `Tự động · Bài ${this.currentExamNumber} · Chờ đèn xanh`;
        if (this.currentExamNumber === 8) return this.waypointStopKind === 'exam08'
            ? 'Tự động · Bài 8 · Theo waypoint' : 'Tự động · Bài 8 · Đường vào';
        if (this.currentExamNumber === 7) return this.waypointStopKind === 'exam07'
            ? 'Tự động · Bài 7 · Ghi waypoint' : 'Tự động · Bài 7 · Đường vào';
        if (this.currentExamNumber === 6) return 'Tự động · Bài 6 · Đường vào';
        return this.stopIndex === 3 && !this.waitingForLesson
            ? 'Tự động · Chờ vào bài 4'
            : `Tự động · Bài ${this.currentExamNumber}`;
    }

    get canRecordExam05Continuation(): boolean {
        return this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam05'
            && !!this.capturedRoute && !this.isWaypointRecording;
    }

    get hasSavedExam06Approach(): boolean { return !!this.exam06ApproachRoute?.length; }
    get hasSavedExam07Approach(): boolean { return !!this.exam07ApproachRoute?.length; }
    get hasSavedExam08Approach(): boolean { return !!this.exam08ApproachRoute?.length; }
    get hasSavedExam09Approach(): boolean {
        return this.exam08PopupWaypointIndex !== undefined
            && this.exam08PopupWaypointIndex < (this.exam09ApproachRoute?.length ?? 0) - 1;
    }
    get hasExam08PopupWaypoint(): boolean { return this.exam08PopupWaypointIndex !== undefined; }
    get hasExam09PopupWaypoint(): boolean { return this.exam09PopupWaypointIndex !== undefined; }
    get hasExam10PopupWaypoint(): boolean { return this.exam10PopupWaypointIndex !== undefined; }

    get canRecordExam06Completion(): boolean {
        return this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam06'
            && this.hasSavedExam06Approach && !this.isWaypointRecording;
    }

    get canRecordExam07Continuation(): boolean {
        return this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam07'
            && this.hasSavedExam07Approach && !this.isWaypointRecording;
    }

    get canRecordExam08Continuation(): boolean {
        return this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam08'
            && this.hasExam08PopupWaypoint && !this.isWaypointRecording;
    }

    get canRecordExam09Continuation(): boolean {
        return this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam09'
            && this.hasExam09PopupWaypoint && !this.isWaypointRecording;
    }

    get canRecordExam10Continuation(): boolean {
        return this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam10'
            && this.hasExam10PopupWaypoint && !this.isWaypointRecording;
    }

    start(vehicle: Vehicle): void {
        this.continuousPauseRemaining = 0;
        this.pausedLesson = null;
        this.enabled = true;
        vehicle.transmission.car.engine.start();
        vehicle.transmission.status = 'Máy đang chạy';
        this.stopIndex = 0;
        this.waypointIndex = 0;
        this.waypointStopKind = 'bridge';
        this.finishRightSignalOn = false;
        this.southExitLeftSignalOn = false;
        this.currentSpeed = 0;
        this.exam05LessonShown = false;
        this.exam06ApproachStarted = false;
        this.exam07ApproachStarted = false;
        this.exam08ApproachStarted = false;
        this.exam09ApproachStarted = false;
        this.exam08DirectionChangeCursor = 0;
        this.exam08ShiftPauseRemaining = 0;
        this.waitingForTrafficLight = false;
        this.trafficGreenCommitted = false;
        this.brakingForWaypointStop = false;
        this.waypointStopReady = false;
        this.waypointStopConsumed = false;
        this.approachingStartLine = true;
        this.selectedApproachRoute = undefined;
        this.waypointStopTarget = undefined;
        this.recordingWaypoints = [];
        this.isWaypointRecording = false;
        vehicle.root.position.copy(this.stops[0].position);
        vehicle.root.position.x -= AUTO_DRIVE_START_RUNUP_M;
        vehicle.root.rotation.set(0, startPosition.heading, 0);
        this.waitingForLesson = false;
        this.publishLesson(null);
    }

    /** Start later lessons shortly before their saved-route popup. */
    private get exam11StartIndex(): number {
        if (this.exam10PopupWaypointIndex === undefined || !this.finishTrafficLight) return -1;
        return this.exam09ApproachRoute?.findIndex((point, index) =>
            index > this.exam10PopupWaypointIndex!
            && this.finishTrafficLight!.isVehicleInTriggerZone(point)) ?? -1;
    }

    get hasExam11PopupWaypoint(): boolean {
        return this.exam11StartIndex >= 0;
    }

    jumpToLesson(lessonId: number, vehicle: Vehicle): boolean {
        const selectingExam06 = lessonId === 6;
        const selectingExam07 = lessonId === 7;
        const selectingExam08 = lessonId === 8;
        const selectingExam09 = lessonId === 9;
        const selectingExam10 = lessonId === 10;
        const selectingExam11 = lessonId === 11;
        const exam11Index = selectingExam11 ? this.exam11StartIndex : -1;
        const index = selectingExam06 || selectingExam07 || selectingExam08 || selectingExam09 || selectingExam10 || selectingExam11 ? 4
            : this.stops.findIndex(stop => stop.lesson.id === lessonId);
        if (!this.enabled || index < 0 || (selectingExam06
            && (!this.hasSavedExam06Approach || !this.capturedRoute?.length))
            || (selectingExam07 && !this.hasSavedExam07Approach)
            || (selectingExam08 && !this.hasExam08PopupWaypoint)
            || (selectingExam09 && !this.hasExam09PopupWaypoint)
            || (selectingExam10 && !this.hasExam10PopupWaypoint)
            || (selectingExam11 && exam11Index < 0)) return false;

        const stop = this.stops[index];
        this.finishRightSignalOn = false;
        this.southExitLeftSignalOn = false;
        this.stopIndex = index;
        this.waypointIndex = 0;
        this.currentSpeed = 0;
        this.exam05LessonShown = selectingExam06 || selectingExam07 || selectingExam08 || selectingExam09 || selectingExam10 || selectingExam11;
        this.exam06ApproachStarted = false;
        this.exam07ApproachStarted = false;
        this.exam08ApproachStarted = false;
        this.exam09ApproachStarted = false;
        this.exam08DirectionChangeCursor = 0;
        this.exam08ShiftPauseRemaining = 0;
        this.waitingForTrafficLight = false;
        this.trafficGreenCommitted = false;
        this.waitingForLesson = false;
        this.approachingStartLine = index === 0;
        this.selectedApproachRoute = undefined;
        this.brakingForWaypointStop = false;
        this.waypointStopReady = false;
        this.waypointStopConsumed = index > 2;
        this.waypointStopTarget = undefined;
        this.isWaypointRecording = false;
        this.recordingWaypoints = [];
        this.lastRecordedPosition = undefined;
        if (selectingExam06) {
            const anchor = this.capturedRoute![this.capturedRoute!.length - 1];
            this.waypointIndex = this.routes[3].length;
            this.waypointStopKind = 'exam05';
            this.waypointStopReady = true;
            vehicle.root.position.set(anchor.x, vehicle.root.position.y, anchor.z);
            vehicle.root.rotation.set(0, anchor.heading, 0);
        } else if (selectingExam07) {
            const pose = this.poseBeforeRouteEnd(
                this.exam07ApproachRoute!, SELECTED_LESSON_APPROACH_M);
            this.waypointIndex = pose.waypointIndex;
            this.waypointStopKind = 'exam06';
            this.exam07ApproachStarted = true;
            vehicle.root.position.copy(pose.position);
            vehicle.root.rotation.set(0, pose.heading, 0);
        } else if (selectingExam08) {
            const pose = this.poseBeforeRouteEnd(
                this.exam09ApproachRoute!.slice(0, this.exam08PopupWaypointIndex! + 1),
                SELECTED_LESSON_APPROACH_M);
            this.waypointIndex = pose.waypointIndex;
            this.waypointStopKind = 'exam07';
            this.exam09ApproachStarted = true;
            vehicle.root.position.copy(pose.position);
            vehicle.root.rotation.set(0, pose.heading, 0);
        } else if (selectingExam09) {
            const pose = this.poseBeforeRouteEnd(
                this.exam09ApproachRoute!.slice(0, this.exam09PopupWaypointIndex! + 1),
                SELECTED_LESSON_APPROACH_M);
            this.waypointIndex = pose.waypointIndex;
            this.waypointStopKind = 'exam08';
            this.exam09ApproachStarted = true;
            vehicle.root.position.copy(pose.position);
            vehicle.root.rotation.set(0, pose.heading, 0);
        } else if (selectingExam11) {
            const pose = this.poseBeforeRouteEnd(
                this.exam09ApproachRoute!.slice(0, exam11Index + 1),
                SELECTED_LESSON_APPROACH_M);
            this.waypointIndex = pose.waypointIndex;
            this.waypointStopKind = 'exam10';
            this.exam09ApproachStarted = true;
            this.exam08DirectionChangeCursor = this.exam10DirectionChangeIndices
                .filter(index => index < pose.waypointIndex).length;
            vehicle.root.position.copy(pose.position);
            vehicle.root.rotation.set(0, pose.heading, 0);
        } else if (selectingExam10) {
            const pose = this.poseBeforeRouteEnd(
                this.exam09ApproachRoute!.slice(0, this.exam10PopupWaypointIndex! + 1),
                SELECTED_LESSON_APPROACH_M);
            this.waypointIndex = pose.waypointIndex;
            this.waypointStopKind = 'exam09';
            this.exam09ApproachStarted = true;
            vehicle.root.position.copy(pose.position);
            vehicle.root.rotation.set(0, pose.heading, 0);
        } else if (index === 0) {
            vehicle.root.position.copy(stop.position);
            vehicle.root.position.x -= SELECTED_LESSON_APPROACH_M;
            vehicle.root.rotation.set(0, startPosition.heading, 0);
        } else {
            const route = index === 4 && this.trafficStopWaypointIndex !== undefined
                ? this.routes[3].slice(0, this.trafficStopWaypointIndex + 1)
                : this.routes[index - 1];
            const previousStop = this.stops[index - 1].position;
            const approachRoute = route[0].distanceTo(previousStop) < .01
                ? [...route] : [previousStop, ...route];
            const pose = this.poseBeforeRouteEnd(approachRoute, SELECTED_LESSON_APPROACH_M);
            this.selectedApproachRoute = approachRoute;
            this.waypointIndex = pose.waypointIndex;
            vehicle.root.position.copy(pose.position);
            vehicle.root.rotation.set(0, pose.heading, 0);
        }
        vehicle.speed = 0;
        vehicle.steering = 0;
        vehicle.setSignal({ left: false, right: false, hazard: false });
        this.publishLesson(null);
        if (selectingExam06) this.onWaypointStop('exam05');
        return true;
    }

    private poseBeforeRouteEnd(route: readonly THREE.Vector3[], distanceM: number): {
        position: THREE.Vector3; heading: number; waypointIndex: number;
    } {
        let remaining = distanceM;
        for (let i = route.length - 1; i > 0; i--) {
            const from = route[i - 1];
            const to = route[i];
            const length = Math.hypot(to.x - from.x, to.z - from.z);
            if (length < .0001) continue;
            if (remaining <= length) {
                const fraction = 1 - remaining / length;
                const fromHeading = this.recordedHeadings.get(from);
                const toHeading = this.recordedHeadings.get(to);
                const tangentHeading = Math.atan2(from.x - to.x, from.z - to.z);
                const heading = fromHeading !== undefined && toHeading !== undefined
                    ? fromHeading + (THREE.MathUtils.euclideanModulo(
                        toHeading - fromHeading + Math.PI, Math.PI * 2,
                    ) - Math.PI) * fraction
                    : toHeading ?? fromHeading ?? tangentHeading;
                return { position: from.clone().lerp(to, fraction), heading, waypointIndex: i };
            }
            remaining -= length;
        }
        const first = route[0];
        const next = route[1];
        const tangent = next.clone().sub(first).setY(0).normalize();
        return {
            position: first.clone().addScaledVector(tangent, -remaining),
            heading: this.recordedHeadings.get(next) ?? Math.atan2(-tangent.x, -tangent.z),
            waypointIndex: 1,
        };
    }

    /** First saved pose whose front bumper is within 0.5 m of the near edge of the railway line. */
    private findRailwayStopWaypointIndex(
        route: readonly THREE.Vector3[], line: THREE.Object3D,
    ): number | undefined {
        if (!(line instanceof THREE.Mesh) || !(line.geometry instanceof THREE.PlaneGeometry)) {
            return undefined;
        }
        line.updateWorldMatrix(true, false);
        const { width, height } = line.geometry.parameters;
        const lineY = line.getWorldPosition(new THREE.Vector3()).y;
        const front = new THREE.Vector3();
        let previousY: number | undefined;
        for (let index = 0; index < route.length; index++) {
            const point = route[index];
            const heading = this.recordedHeadings.get(point);
            if (heading === undefined) continue;
            front.set(
                point.x - Math.sin(heading) * FRONT_PROBE_OFFSET_M,
                lineY,
                point.z - Math.cos(heading) * FRONT_PROBE_OFFSET_M,
            );
            line.worldToLocal(front);
            const distanceToNearEdge = Math.abs(front.y) - height / 2;
            if (previousY !== undefined
                && Math.sign(front.y) === Math.sign(previousY)
                && Math.abs(front.y) < Math.abs(previousY)
                && Math.abs(front.x) <= width / 2
                && distanceToNearEdge >= 0
                && distanceToNearEdge <= RAILWAY_STOP_FRONT_GAP_M) {
                return index;
            }
            previousY = front.y;
        }
        return undefined;
    }

    stop(): void {
        this.continuousPauseRemaining = 0;
        this.pausedLesson = null;
        this.finishRightSignalOn = false;
        this.southExitLeftSignalOn = false;
        this.enabled = false;
        this.waitingForLesson = false;
        this.waitingForTrafficLight = false;
        this.trafficGreenCommitted = false;
        this.approachingStartLine = false;
        this.selectedApproachRoute = undefined;
        this.exam06ApproachStarted = false;
        this.exam07ApproachStarted = false;
        this.exam08ApproachStarted = false;
        this.exam09ApproachStarted = false;
        this.exam08DirectionChangeCursor = 0;
        this.exam08ShiftPauseRemaining = 0;
        this.isWaypointRecording = false;
        this.publishLesson(null);
    }

    /** Resume driving after the learner has read the current lesson. */
    continueLesson(): void {
        this.continuousPauseRemaining = 0;
        this.pausedLesson = null;
        if (this.enabled && this.waypointStopReady
            && (this.waypointStopKind === 'exam09' || this.waypointStopKind === 'exam10')) {
            this.waypointStopReady = false;
            this.exam08DirectionChangeCursor = 0;
            this.exam08ShiftPauseRemaining = 0;
            this.currentSpeed = 0;
            this.publishLesson(null);
            return;
        }
        if (this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam08'
            && this.exam09ApproachRoute?.length) {
            this.waypointStopReady = false;
            this.exam09ApproachStarted = true;
            this.waypointIndex = this.exam08PopupWaypointIndex! + 1;
            this.currentSpeed = 0;
            this.waitingForTrafficLight = false;
            this.trafficGreenCommitted = false;
            this.publishLesson(null);
            return;
        }
        if (this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam07'
            && this.exam08ApproachRoute?.length) {
            this.waypointStopReady = false;
            this.exam08ApproachStarted = true;
            this.exam08DirectionChangeCursor = 0;
            this.exam08ShiftPauseRemaining = 0;
            this.waypointIndex = 1;
            this.currentSpeed = 0;
            this.waitingForTrafficLight = false;
            this.trafficGreenCommitted = false;
            this.publishLesson(null);
            return;
        }
        if (this.enabled && this.waypointStopReady && this.waypointStopKind === 'exam05'
            && this.exam06ApproachRoute?.length) {
            this.waypointStopReady = false;
            this.exam06ApproachStarted = true;
            this.waypointIndex = 1;
            this.currentSpeed = 0;
            this.waitingForTrafficLight = false;
            this.trafficGreenCommitted = false;
            this.publishLesson(null);
            return;
        }
        if (!this.enabled || !this.waitingForLesson) return;
        if (this.exam09ApproachStarted && this.finishRightSignalOn) {
            this.waitingForLesson = false;
            this.publishLesson(null);
            return;
        }
        this.waitingForLesson = false;
        this.waitingForTrafficLight = false;
        this.trafficGreenCommitted = false;
        this.publishLesson(null);
        if (this.stopIndex >= this.stops.length - 1) {
            if (this.trafficStopWaypointIndex !== undefined && !this.exam05LessonShown) {
                this.exam05LessonShown = true;
                this.waypointIndex = this.trafficStopWaypointIndex + 1;
                return;
            }
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
        const cruiseSpeed = Math.min(AUTO_DRIVE_SPEED_MPS, vehicle.maxAllowedSpeedMps);
        this.currentSpeed = Math.min(this.currentSpeed, cruiseSpeed);

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

        if (this.continuousPauseRemaining > 0) {
            this.currentSpeed = this.approach(this.currentSpeed, 0, AUTO_DRIVE_BRAKING_MPS2 * dt);
            vehicle.updateAutomatic(dt, 0, this.currentSpeed);
            if (this.currentSpeed === 0) {
                this.continuousPauseRemaining = Math.max(0, this.continuousPauseRemaining - dt);
                if (this.continuousPauseRemaining <= 1e-6) this.continueLesson();
            }
            return;
        }

        if (this.waypointStopReady) {
            vehicle.updateAutomatic(dt, 0, 0);
            return;
        }

        if (this.approachingStartLine) {
            const target = this.stops[0].position;
            const distance = vehicle.root.position.distanceTo(target);
            const stoppingSpeed = Math.sqrt(2 * AUTO_DRIVE_BRAKING_MPS2 * Math.max(0, distance - .08));
            const targetSpeed = Math.min(cruiseSpeed, stoppingSpeed);
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

        if (this.selectedApproachRoute) {
            this.followSavedRoute(dt, vehicle, this.selectedApproachRoute);
            return;
        }

        if (this.exam06ApproachStarted) {
            this.followSavedRoute(dt, vehicle, this.exam06ApproachRoute!,
                this.eastTrafficStopWaypointIndex, undefined, 'exam06',
                this.eastTrafficLight, this.eastTrafficStopLineWorldX, 'x');
            return;
        }
        if (this.exam07ApproachStarted) {
            this.followSavedRoute(dt, vehicle, this.exam07ApproachRoute!,
                undefined, undefined, 'exam07');
            return;
        }
        if (this.exam08ApproachStarted) {
            this.followSavedRoute(dt, vehicle, this.exam08ApproachRoute!,
                undefined, undefined, this.hasExam08PopupWaypoint ? 'exam08' : 'routeEnd');
            return;
        }
        if (this.exam09ApproachStarted) {
            const beforeTurnEnd = this.southExitTurnEndIndex !== undefined
                && this.waypointIndex <= this.southExitTurnEndIndex;
            if (beforeTurnEnd && this.southExitTrafficLight?.isVehicleInTriggerZone(vehicle.root.position)) {
                this.southExitLeftSignalOn = true;
            }
            if (this.southExitLeftSignalOn) {
                vehicle.setSignal({ left: beforeTurnEnd, right: false, hazard: false });
                if (!beforeTurnEnd) this.southExitLeftSignalOn = false;
            }
            this.followSavedRoute(dt, vehicle, this.exam09ApproachRoute!,
                this.southExitStopIndex, undefined, 'routeEnd',
                this.southExitTrafficLight, this.southExitStopLineZ, 'z', 1);
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
            const targetSpeed = Math.min(cruiseSpeed, stoppingSpeed);
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
            this.followSavedRoute(dt, vehicle, route,
                this.stopIndex === 4 ? this.trafficStopWaypointIndex : undefined,
                this.stopIndex === 4 && !this.exam05LessonShown
                    ? this.trafficStopWaypointIndex : undefined,
                this.stopIndex === 4 && this.exam05LessonShown ? 'exam05' : undefined);
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
        const targetSpeed = Math.min(cruiseSpeed, stoppingSpeed);
        this.currentSpeed = this.approach(this.currentSpeed, targetSpeed,
            (targetSpeed < this.currentSpeed ? AUTO_DRIVE_BRAKING_MPS2 : AUTO_DRIVE_SPEED_MPS) * dt);
        vehicle.updateAutomatic(dt, steering, this.currentSpeed);
    }

    /** Replay the recorded vehicle path, including saved speeds after the lesson 8 popup. */
    private followSavedRoute(
        dt: number,
        vehicle: Vehicle,
        route: readonly THREE.Vector3[],
        trafficStopIndex?: number,
        lessonStopIndex?: number,
        waypointStopAtEnd?: SavedRouteStopKind,
        trafficLight: TrafficLight | undefined = this.southTrafficLight,
        stopLineWorld: number | undefined = this.trafficStopLineWorldZ,
        trafficAxis: 'x' | 'z' = 'z',
        trafficTravelSign: 1 | -1 = -1,
    ): void {
        const replayExam10 = waypointStopAtEnd === 'routeEnd' && this.waypointStopKind === 'exam10';
        if (replayExam10) {
            if (!this.finishRightSignalOn
                && this.finishTrafficLight?.isVehicleInTriggerZone(vehicle.root.position)) {
                this.finishRightSignalOn = true;
                vehicle.setSignal({ left: false, right: true, hazard: false });
                this.currentSpeed = 0;
                vehicle.updateAutomatic(dt, 0, 0);
                this.waitingForLesson = true;
                this.publishLesson(EXAM_11_LESSON);
                return;
            }
            if (this.finishRightSignalOn) {
                vehicle.setSignal({ left: false, right: true, hazard: false });
            }
        }
        const directionChanges = replayExam10 ? this.exam10DirectionChangeIndices : this.exam08DirectionChangeIndices;
        const replayDirections = waypointStopAtEnd === 'exam08' || replayExam10;
        if (replayDirections && this.exam08ShiftPauseRemaining > 0) {
            this.exam08ShiftPauseRemaining = Math.max(0, this.exam08ShiftPauseRemaining - dt);
            this.currentSpeed = 0;
            vehicle.updateAutomatic(dt,
                vehicle.steering / THREE.MathUtils.degToRad(steeringConfig.maxRoadWheelAngle), 0);
            if (this.exam08ShiftPauseRemaining === 0) {
                const changeIndex = directionChanges[this.exam08DirectionChangeCursor];
                vehicle.transmission.gear = this.directionForSegment(route, changeIndex);
                this.exam08DirectionChangeCursor++;
            }
            return;
        }

        const direction = replayDirections && this.waypointIndex < route.length
            ? this.directionForSegment(route, Math.max(0, this.waypointIndex - 1)) : 1;
        const replayRecordedSpeed = this.exam09ApproachStarted
            && (this.waypointStopKind === 'exam08' || this.waypointStopKind === 'exam09' || replayExam10);
        const speedIndex = Math.min(this.waypointIndex, route.length - 1);
        let recordedSpeed = replayRecordedSpeed ? this.recordedSpeeds.get(route[speedIndex]) : undefined;
        // Stationary samples mark checkpoints. The route limit handles the stop;
        // a zero cruise speed would strand the car before reaching the checkpoint.
        if (recordedSpeed === 0) {
            recordedSpeed = this.recordedSpeeds.get(route[speedIndex - 1]) || AUTO_DRIVE_SPEED_MPS;
        }
        const accelerationSpeed = replayRecordedSpeed && !replayExam10
            ? this.exam09AccelerationSpeed(vehicle.root.position.x
                - Math.sin(vehicle.root.rotation.y) * FRONT_PROBE_OFFSET_M,
                recordedSpeed ?? AUTO_DRIVE_SPEED_MPS)
            : undefined;
        const cruiseSpeed = Math.min(accelerationSpeed ?? recordedSpeed ?? AUTO_DRIVE_SPEED_MPS, vehicle.maxAllowedSpeedMps,
            direction < 0 && !(replayExam10 && recordedSpeed !== undefined)
                ? AUTO_DRIVE_REVERSE_SPEED_MPS : Infinity);
        const position = vehicle.root.position;
        const finish = route[route.length - 1];
        if (!finish) return;

        const frontCoordinate = trafficAxis === 'x'
            ? position.x - Math.sin(vehicle.root.rotation.y) * FRONT_PROBE_OFFSET_M
            : position.z - Math.cos(vehicle.root.rotation.y) * FRONT_PROBE_OFFSET_M;
        const light = trafficLight;
        const nearStop = trafficStopIndex !== undefined
            && position.distanceTo(route[trafficStopIndex]) < 1;
        if (light?.phase !== 'green') this.trafficGreenCommitted = false;
        if (nearStop && light?.phase === 'green'
            && light.remainingSeconds > TRAFFIC_GREEN_COMMIT_SEC) {
            this.trafficGreenCommitted = true;
        }
        const waitForGreen = lessonStopIndex === undefined
            && trafficStopIndex !== undefined
            // Later legs can return across the same world coordinate. Only
            // this approach may wait at the light (including a stopped car).
            && this.waypointIndex <= trafficStopIndex + 1
            && stopLineWorld !== undefined
            && (frontCoordinate - stopLineWorld) * trafficTravelSign < 0
            && (!light || light.phase !== 'green'
                || (!this.trafficGreenCommitted
                    && light.remainingSeconds <= TRAFFIC_GREEN_COMMIT_SEC));
        const exam08PopupIndex = waypointStopAtEnd === 'routeEnd'
            && this.waypointStopKind !== 'exam08' && this.waypointStopKind !== 'exam09'
            && this.waypointStopKind !== 'exam10'
            ? this.exam08PopupWaypointIndex : undefined;
        const exam09PopupIndex = waypointStopAtEnd === 'routeEnd'
            && this.waypointStopKind === 'exam08' ? this.exam09PopupWaypointIndex : undefined;
        const exam10PopupIndex = waypointStopAtEnd === 'routeEnd'
            && this.waypointStopKind === 'exam09' ? this.exam10PopupWaypointIndex : undefined;
        const popupIndex = exam08PopupIndex ?? exam09PopupIndex ?? exam10PopupIndex;
        const routeLimitIndex = Math.min(popupIndex ?? Infinity, lessonStopIndex ?? Infinity,
            waitForGreen ? trafficStopIndex! : route.length - 1);
        const directionChangeIndex = replayDirections
            ? directionChanges[this.exam08DirectionChangeCursor] : undefined;
        const lastIndex = directionChangeIndex === undefined
            ? routeLimitIndex : Math.min(routeLimitIndex, directionChangeIndex);
        const target = route[lastIndex];
        const continuesToExam07 = waypointStopAtEnd === 'exam06'
            && this.hasSavedExam07Approach;
        const continuesToExam08 = waypointStopAtEnd === 'exam08'
            && this.hasExam08PopupWaypoint;

        let remaining = this.waypointIndex <= lastIndex
            ? Math.hypot(position.x - route[this.waypointIndex].x,
                position.z - route[this.waypointIndex].z)
            : 0;
        for (let i = this.waypointIndex + 1; i <= lastIndex; i++) {
            remaining += Math.hypot(route[i].x - route[i - 1].x,
                route[i].z - route[i - 1].z);
        }
        this.waitingForTrafficLight = waitForGreen && remaining < .5;
        if (remaining < (waitForGreen ? .005 : .03) || this.waypointIndex > lastIndex) {
            if (directionChangeIndex !== undefined && lastIndex === directionChangeIndex && !waitForGreen) {
                position.x = target.x;
                position.z = target.z;
                vehicle.root.rotation.y = this.recordedHeadings.get(target) ?? vehicle.root.rotation.y;
                this.waypointIndex = directionChangeIndex + 1;
                this.currentSpeed = 0;
                vehicle.updateAutomatic(dt, 0, 0);
                vehicle.transmission.gear = 0;
                this.exam08ShiftPauseRemaining = GEAR_CHANGE_PAUSE_SEC;
                return;
            }
            if (continuesToExam07 && !waitForGreen) {
                position.x = finish.x;
                position.z = finish.z;
                vehicle.root.rotation.y = this.recordedHeadings.get(finish) ?? vehicle.root.rotation.y;
                this.exam06ApproachStarted = false;
                this.exam07ApproachStarted = true;
                this.waypointIndex = 1;
                this.waitingForTrafficLight = false;
                this.trafficGreenCommitted = false;
                return;
            }
            if (continuesToExam08 && !waitForGreen) {
                position.x = finish.x;
                position.z = finish.z;
                vehicle.root.rotation.y = this.recordedHeadings.get(finish) ?? vehicle.root.rotation.y;
                this.exam08ApproachStarted = false;
                this.exam09ApproachStarted = true;
                this.waypointIndex = 1;
                return;
            }
            this.currentSpeed = 0;
            vehicle.updateAutomatic(dt, 0, 0);
            if (popupIndex !== undefined && lastIndex === popupIndex) {
                position.x = target.x;
                position.z = target.z;
                vehicle.root.rotation.y = this.recordedHeadings.get(target) ?? vehicle.root.rotation.y;
                this.waypointIndex = popupIndex + 1;
                this.waypointStopKind = exam10PopupIndex !== undefined ? 'exam10'
                    : exam09PopupIndex !== undefined ? 'exam09' : 'exam08';
                this.waypointStopReady = true;
                this.onWaypointStop(this.waypointStopKind);
                return;
            }
            if (lessonStopIndex !== undefined && lastIndex === lessonStopIndex) {
                position.x = target.x;
                position.z = target.z;
                this.waypointIndex = lastIndex + 1;
                this.waitingForLesson = true;
                this.publishLesson(this.stops[this.stopIndex].lesson);
                return;
            }
            if (waitForGreen) {
                if (this.waypointIndex <= lastIndex) {
                    position.x = target.x;
                    position.z = target.z;
                }
                this.waypointIndex = Math.max(this.waypointIndex, lastIndex + 1);
                return;
            }
            position.x = finish.x;
            position.z = finish.z;
            this.waypointIndex = route.length;
            this.selectedApproachRoute = undefined;
            if (waypointStopAtEnd) {
                vehicle.root.rotation.y = this.recordedHeadings.get(finish) ?? vehicle.root.rotation.y;
                this.exam06ApproachStarted = false;
                this.exam07ApproachStarted = false;
                this.exam08ApproachStarted = false;
                this.exam09ApproachStarted = false;
                if (waypointStopAtEnd === 'routeEnd') {
                    this.enabled = false;
                    this.onComplete();
                    return;
                }
                this.waypointStopKind = waypointStopAtEnd;
                this.waypointStopReady = true;
                this.onWaypointStop(waypointStopAtEnd);
                return;
            }
            this.waitingForLesson = true;
            this.publishLesson(this.stops[this.stopIndex].lesson);
            return;
        }

        const stoppingSpeed = Math.sqrt(2 * AUTO_DRIVE_BRAKING_MPS2 * remaining);
        const targetSpeed = (continuesToExam07 || continuesToExam08) && !waitForGreen
            ? cruiseSpeed : Math.min(cruiseSpeed, stoppingSpeed);
        this.currentSpeed = recordedSpeed !== undefined || accelerationSpeed !== undefined ? targetSpeed
            : this.approach(this.currentSpeed, targetSpeed,
                (targetSpeed < this.currentSpeed ? AUTO_DRIVE_BRAKING_MPS2 : AUTO_DRIVE_SPEED_MPS) * dt);

        let travel = this.currentSpeed * dt;
        let x = position.x;
        let z = position.z;
        let heading = vehicle.root.rotation.y;
        const initialHeading = heading;
        while (travel > 0 && this.waypointIndex <= lastIndex) {
            const waypoint = route[this.waypointIndex];
            const dx = waypoint.x - x;
            const dz = waypoint.z - z;
            const distance = Math.hypot(dx, dz);
            if (distance < .0001) {
                this.waypointIndex++;
                continue;
            }
            const step = Math.min(travel, distance);
            x += dx * step / distance;
            z += dz * step / distance;
            const segmentHeading = this.recordedHeadings.get(waypoint) ?? Math.atan2(-dx, -dz);
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
            roadWheelAngle * direction / THREE.MathUtils.degToRad(steeringConfig.maxRoadWheelAngle),
            -1, 1,
        );
        if (waypointStopAtEnd === 'exam08' || waypointStopAtEnd === 'routeEnd') {
            vehicle.transmission.gear = direction > 0 && this.exam09ApproachStarted
                && this.waypointStopKind === 'exam09'
                ? this.exam09AccelerationGear(x - Math.sin(heading) * FRONT_PROBE_OFFSET_M)
                : direction;
        }
        vehicle.updateAutomatic(dt, steering, direction * this.currentSpeed);
        position.x = x;
        position.z = z;
        vehicle.root.rotation.y = heading;
    }

    /** Shift halfway between markers 1/2; hold second until the front reaches marker 3. */
    private exam09AccelerationGear(frontX: number): 1 | 2 {
        if (!this.exam09AccelerationPositions) return 1;
        const [position1X, position2X, position3X] = this.exam09AccelerationPositions;
        const shiftUpX = (position1X + position2X) / 2;
        return frontX <= shiftUpX && frontX > position3X ? 2 : 1;
    }

    /** Speed at the front probe: accelerate after marker 1, brake uniformly after marker 2. */
    private exam09AccelerationSpeed(frontX: number, approachSpeed = 20 / 3.6): number | undefined {
        if (!this.exam09AccelerationPositions) return undefined;
        const [position1X, position2X, position3X] = this.exam09AccelerationPositions;
        if (frontX > position1X) return Math.min(approachSpeed, 20 / 3.6);
        const entrySpeed = 20 / 3.6;
        const fastSpeed = 30 / 3.6;
        const exitSpeed = 9 / 3.6;
        if (frontX > position2X) {
            const accelerationDistanceM = Math.min(10, position1X - position2X);
            const fraction = Math.min(1, (position1X - frontX) / accelerationDistanceM);
            return Math.sqrt(entrySpeed ** 2 + (fastSpeed ** 2 - entrySpeed ** 2) * fraction);
        }
        if (frontX >= position3X) {
            const fraction = (frontX - position3X) / (position2X - position3X);
            return Math.sqrt(exitSpeed ** 2 + (fastSpeed ** 2 - exitSpeed ** 2) * fraction);
        }
        // Once past marker 3, follow the next section's saved speed again.
        return approachSpeed;
    }

    private directionForSegment(route: readonly THREE.Vector3[], fromIndex: number): 1 | -1 {
        const from = route[fromIndex];
        const to = route[fromIndex + 1];
        const heading = this.recordedHeadings.get(from)
            ?? Math.atan2(from.x - to.x, from.z - to.z);
        const forwardDistance = (to.x - from.x) * -Math.sin(heading)
            + (to.z - from.z) * -Math.cos(heading);
        return forwardDistance >= 0 ? 1 : -1;
    }

    private findDirectionChangeIndices(route: readonly THREE.Vector3[]): number[] {
        const indices: number[] = [];
        for (let index = 1; index < route.length - 1; index++) {
            if (this.directionForSegment(route, index) !== this.directionForSegment(route, index - 1)) {
                indices.push(index);
            }
        }
        return indices;
    }

    beginWaypointRecording(vehicle: Vehicle): boolean {
        const recordingFromExam05 = this.canRecordExam05Continuation;
        const recordingFromExam06 = this.canRecordExam06Completion;
        const recordingFromExam07 = this.waypointStopKind === 'exam07'
            && this.hasSavedExam07Approach;
        const recordingFromExam08 = this.canRecordExam08Continuation;
        const recordingFromExam09 = this.canRecordExam09Continuation;
        const recordingFromExam10 = this.canRecordExam10Continuation;
        if (!this.enabled || !this.waypointStopReady || this.isWaypointRecording) return false;
        if (!vehicle.transmission.running) vehicle.transmission.car.engine.start();
        vehicle.transmission.car.stalled = false;
        vehicle.transmission.status = 'Máy đang chạy';
        this.recordingRouteName = recordingFromExam10 ? 'exam10ToExam11Waypoints'
            : recordingFromExam09 ? 'exam09ContinuationWaypoints'
            : recordingFromExam08 ? 'exam08ToExam09Waypoints'
            : recordingFromExam07 ? 'exam07ToExam08Waypoints'
            : recordingFromExam06 ? 'exam06ToExam07Waypoints'
            : recordingFromExam05 ? 'exam05ToExam06Waypoints' : 'bridgeToExam05Waypoints';
        this.recordingWaypoints = [];
        this.lastRecordedPosition = undefined;
        if (recordingFromExam05) {
            const anchor = this.capturedRoute![this.capturedRoute!.length - 1];
            vehicle.root.position.x = anchor.x;
            vehicle.root.position.z = anchor.z;
            vehicle.root.rotation.y = anchor.heading;
        } else if (recordingFromExam06) {
            const anchor = this.exam06ApproachRoute![this.exam06ApproachRoute!.length - 1];
            vehicle.root.position.x = anchor.x;
            vehicle.root.position.z = anchor.z;
            vehicle.root.rotation.y = this.recordedHeadings.get(anchor)!;
        } else if (recordingFromExam07) {
            const anchor = this.exam07ApproachRoute![this.exam07ApproachRoute!.length - 1];
            vehicle.root.position.x = anchor.x;
            vehicle.root.position.z = anchor.z;
            vehicle.root.rotation.y = this.recordedHeadings.get(anchor)!;
        } else if (recordingFromExam08 || recordingFromExam09 || recordingFromExam10) {
            const anchorIndex = recordingFromExam10 ? this.exam10PopupWaypointIndex!
                : recordingFromExam09 ? this.exam09PopupWaypointIndex! : this.exam08PopupWaypointIndex!;
            const anchor = this.exam09ApproachRoute![anchorIndex];
            vehicle.root.position.x = anchor.x;
            vehicle.root.position.z = anchor.z;
            vehicle.root.rotation.y = this.recordedHeadings.get(anchor)!;
        }
        this.recordWaypoint(vehicle, true);
        this.isWaypointRecording = true;
        return true;
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
            speedMps: Number(Math.abs(vehicle.speed).toFixed(3)),
        });
        this.lastRecordedPosition = position.clone();
    }

    private formatRecordedRoute(): string {
        const lines = this.recordingWaypoints
            .map(point => `    { x: ${point.x}, z: ${point.z}, heading: ${point.heading}, speedMps: ${point.speedMps} },`);
        return `const ${this.recordingRouteName} = [\n${lines.join('\n')}\n];`;
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
        if (point.popupLessonId !== undefined) this.recordedPopupLessons.set(position, point.popupLessonId);
        if (point.speedMps !== undefined && Number.isFinite(point.speedMps) && point.speedMps >= 0) {
            this.recordedSpeeds.set(position, point.speedMps);
        }
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

    private addTrafficStopWaypoint(): void {
        const light = this.southTrafficLight;
        if (!light) return;
        light.root.updateWorldMatrix(true, false);
        const line = light.root.localToWorld(new THREE.Vector3(light.stopLineX, 0, light.stopLineZ));
        const stopRootZ = line.z + FRONT_PROBE_OFFSET_M + TRAFFIC_STOP_FRONT_GAP_M;
        const route = this.routes[3];
        for (let index = 1; index < route.length; index++) {
            const from = route[index - 1];
            const to = route[index];
            if (from.z < stopRootZ || to.z > stopRootZ || from.z - to.z < .001) continue;
            const fraction = (from.z - stopRootZ) / (from.z - to.z);
            const point = from.clone().lerp(to, fraction);
            if (point.distanceTo(from) < .05) {
                this.trafficStopWaypointIndex = index - 1;
            } else if (point.distanceTo(to) < .05) {
                this.trafficStopWaypointIndex = index;
            } else {
                const fromHeading = this.recordedHeadings.get(from);
                const toHeading = this.recordedHeadings.get(to);
                const tangentHeading = Math.atan2(from.x - to.x, from.z - to.z);
                const heading = fromHeading !== undefined && toHeading !== undefined
                    ? fromHeading + (THREE.MathUtils.euclideanModulo(
                        toHeading - fromHeading + Math.PI, Math.PI * 2,
                    ) - Math.PI) * fraction
                    : toHeading ?? fromHeading ?? tangentHeading;
                this.recordedHeadings.set(point, heading);
                route.splice(index, 0, point);
                this.trafficStopWaypointIndex = index;
            }
            this.trafficStopLineWorldZ = line.z;
            return;
        }
    }

    private addSouthExitTrafficStopWaypoint(): void {
        const light = this.southExitTrafficLight;
        const route = this.exam09ApproachRoute;
        if (!light || !route) return;
        light.root.updateWorldMatrix(true, false);
        // Use the light's dashed yellow line, 5 m before the pole, as at the other lights.
        const line = light.root.localToWorld(new THREE.Vector3(light.stopLineX, 0, light.stopLineZ));
        const stopZ = line.z - FRONT_PROBE_OFFSET_M - TRAFFIC_STOP_FRONT_GAP_M;
        for (let index = 1; index < route.length; index++) {
            const from = route[index - 1];
            const to = route[index];
            if (from.z > stopZ || to.z < stopZ || to.z - from.z < .001) continue;
            const fraction = (stopZ - from.z) / (to.z - from.z);
            const point = from.clone().lerp(to, fraction);
            if (Math.abs(point.x - line.x) > light.stopLineLength / 2 + .75) continue;
            if (point.distanceTo(from) < .05) {
                this.southExitStopIndex = index - 1;
            } else if (point.distanceTo(to) < .05) {
                this.southExitStopIndex = index;
            } else {
                const fromHeading = this.recordedHeadings.get(from);
                const toHeading = this.recordedHeadings.get(to);
                const heading = fromHeading !== undefined && toHeading !== undefined
                    ? fromHeading + (THREE.MathUtils.euclideanModulo(
                        toHeading - fromHeading + Math.PI, Math.PI * 2,
                    ) - Math.PI) * fraction
                    : toHeading ?? fromHeading ?? Math.atan2(from.x - to.x, from.z - to.z);
                this.recordedHeadings.set(point, heading);
                const fromSpeed = this.recordedSpeeds.get(from);
                const toSpeed = this.recordedSpeeds.get(to);
                if (fromSpeed !== undefined && toSpeed !== undefined) {
                    this.recordedSpeeds.set(point, THREE.MathUtils.lerp(fromSpeed, toSpeed, fraction));
                }
                route.splice(index, 0, point);
                this.southExitStopIndex = index;
            }
            this.southExitStopLineZ = line.z;
            for (let turnIndex = this.southExitStopIndex + 1; turnIndex < route.length; turnIndex++) {
                const heading = this.recordedHeadings.get(route[turnIndex]);
                if (heading !== undefined && -Math.sin(heading) > .98
                    && Math.abs(Math.cos(heading)) < .15 && route[turnIndex].x > line.x + 3) {
                    this.southExitTurnEndIndex = turnIndex;
                    break;
                }
            }
            return;
        }
    }

    private addEastTrafficStopWaypoint(): void {
        const light = this.eastTrafficLight;
        const route = this.exam06ApproachRoute;
        if (!light || !route) return;
        light.root.updateWorldMatrix(true, false);
        const line = light.root.localToWorld(new THREE.Vector3(light.stopLineX, 0, light.stopLineZ));
        const stopRootX = line.x + FRONT_PROBE_OFFSET_M + TRAFFIC_STOP_FRONT_GAP_M;
        for (let index = 1; index < route.length; index++) {
            const from = route[index - 1];
            const to = route[index];
            if (from.x < stopRootX || to.x > stopRootX || from.x - to.x < .001) continue;
            const fraction = (from.x - stopRootX) / (from.x - to.x);
            const point = from.clone().lerp(to, fraction);
            // The S curve crosses this X earlier; select the westbound lane at the light.
            if (Math.abs(point.z - line.z) > light.stopLineLength / 2 + .75) continue;
            if (point.distanceTo(from) < .05) {
                this.eastTrafficStopWaypointIndex = index - 1;
            } else if (point.distanceTo(to) < .05) {
                this.eastTrafficStopWaypointIndex = index;
            } else {
                const fromHeading = this.recordedHeadings.get(from);
                const toHeading = this.recordedHeadings.get(to);
                const tangentHeading = Math.atan2(from.x - to.x, from.z - to.z);
                const heading = fromHeading !== undefined && toHeading !== undefined
                    ? fromHeading + (THREE.MathUtils.euclideanModulo(
                        toHeading - fromHeading + Math.PI, Math.PI * 2,
                    ) - Math.PI) * fraction
                    : toHeading ?? fromHeading ?? tangentHeading;
                this.recordedHeadings.set(point, heading);
                route.splice(index, 0, point);
                this.eastTrafficStopWaypointIndex = index;
            }
            this.eastTrafficStopLineWorldX = line.x;
            return;
        }
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
