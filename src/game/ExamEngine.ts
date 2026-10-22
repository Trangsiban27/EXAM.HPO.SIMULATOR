import * as THREE from 'three';
import type {PenaltyEvent} from './types';
import { StartExercise, type StartSignalPhase } from './exercises/StartExercise';
import { Exam02Pedestrian } from './exercises/Exam02Pedestrian';
import { Exam03Hill } from './exercises/Exam03Hill';
import { Exam04WheelTrack, EXAM_04_WRONG_LAYOUT_REASON, type Exam04CourseSensors } from './exercises/Exam04WheelTrack';
import { EXAM_VEHICLE_CLASS, type ExamVehicleClass } from './exam/examRules';
import { Exam05South } from './exercises/Exam05South';
import { TrafficLightScoring } from './exercises/TrafficLightScoring';
import { Exam06ApproachLane } from './exercises/Exam06ApproachLane';
import { Exam06SCurveTimer, touchesWindingGate } from './exercises/Exam06SCurveTimer';
import type { TrafficLight } from './TrafficLight';
import type { TrackObjects, WindingCourseEntry, ParkingClassZone } from './TrackObjects';
import { ParkingClassCheck } from './exercises/ParkingClassCheck';
import { Exam07ParkingTimer, type ParkingTimerGate } from './exercises/Exam07ParkingTimer';
import { ExamLateProgression } from './exam/ExamLateProgression';
import { ParkingBoundaryScoring } from './exercises/ParkingBoundaryScoring';
import { startPosition } from './startPosition';
import { EXAM_SCORING_MODE, type ExamScoringMode } from './exam/examScoringMode';
import {
    EXAM_02_STOP_LINE_X,
    EXAM_03_STOP_LINE_X,
    EXAM_03_YELLOW_LINE_X,
} from './exam/examCourseGeometry';

export interface ExamVehicleSnapshot {
    position: THREE.Vector3;
    frontPosition: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    leftSignal: boolean;
    seatBeltFastened: boolean;
    clutch?: number;
    /**
     * World-space positions of 4 wheels. Used by Exam04.
     * Populated by DrivingGame from Vehicle3.wheelAssy.getWheel(...).getWorldPosition().
     */
    wheelPositions?: { FL: THREE.Vector3; FR: THREE.Vector3; RL: THREE.Vector3; RR: THREE.Vector3 };
    /** True nếu vehicle vừa va chạm (collision). E04-07, E02-07. */
    accident?: boolean;
    /** True nếu vehicle đang đi sai layout bài thi. E04-01. */
    wrongLayout?: boolean;
}

export class ExamEngine{
    constructor(readonly scoringMode: ExamScoringMode = EXAM_SCORING_MODE) {}
    score=100;
    readonly penalties:PenaltyEvent[]=[];
    activeIndex=0;
    startedAt=performance.now();
    readonly startExercise = new StartExercise();
    readonly pedestrianExercise = new Exam02Pedestrian({
        stopLineX: EXAM_02_STOP_LINE_X,
        roadZ: startPosition.lineZ,
        roadWidth: 8,
        approachZoneM: 15,
        exitDistanceM: 3,
        stopSpeedKmh: .6,
        minStopDwellSec: .3,
    });
    readonly hillExercise = new Exam03Hill({
        stopLineX: EXAM_03_STOP_LINE_X,
        yellowLineX: EXAM_03_YELLOW_LINE_X,
        roadZ: startPosition.lineZ,
        roadWidth: 8,
        hillForwardAxis: new THREE.Vector3(1, 0, 0),
        exitDistanceM: 3,
        stopSpeedKmh: .6,
        minStopDwellSec: .3,
    });
    /**
     * 4 course sensors for Exam04 (populated after buildExamGround via
     * wireExam04() call). Each entry contains the world-space sensors for one
     * wheel-track course.
     */
    readonly wheelTrackSensors: Exam04CourseSensors[] = [];
    /** Single Exam04 exercise instance. State reset after each course completion. */
    readonly wheelTrackExercise = new Exam04WheelTrack();
    /**
     * Exam05South — chấm điểm bài 5 (ngã tư có tín hiệu) cho trafficLight South.
     * Được kích hoạt tự động khi xe chạm trigger zone của South light
     * (xem wireTrafficLights() và `light.onMarkerTriggered`).
     */
    readonly intersectionExercise = new Exam05South();
    /** Tham chiếu tới South traffic light, được gắn trong wireTrafficLights(). */
    private southLight: TrafficLight | null = null;
    /** Chỉ gắn bộ chấm và callback đèn một lần. */
    private trafficLightsWired = false;
    private trafficLightScorers: TrafficLightScoring[] = [];
    private exam05To06LaneRule?: TrackObjects['exam05To06LaneRule'];
    private readonly exam06ApproachLane = new Exam06ApproachLane();
    private wrongApproachLaneReported = false;
    private windingCourses: WindingCourseEntry[] = [];
    private previousWindingFront: THREE.Vector3 | null = null;
    private wrongWindingReported = false;
    private readonly sCurveTimer = new Exam06SCurveTimer();
    private parkingClassZones: readonly ParkingClassZone[] = [];
    private readonly parkingClassCheck = new ParkingClassCheck();
    private parkingTimerGates: readonly ParkingTimerGate[] = [];
    private readonly parkingTimer = new Exam07ParkingTimer();
    private parkingBoundaryScoring = new ParkingBoundaryScoring([]);
    private lateProgression = new ExamLateProgression();
    private approachingLateLesson = false;
    private entryLessonId = 1;
    disqualified=false;
    disqualifyReason='';
    private cooldown=new Map<number,number>();
    private finished=false;
    private scoringStarted = false;
    private pedestrianCompleted = false;
    /**
     * True giữa lúc E04 đã hoàn thành và xe chưa chạm trigger South light.
     * Trong khoảng này `activeIndex` vẫn = 3, nhưng HUD đổi title sang
     * "Chờ vào bài 5" và E04 không còn chạy update nữa.
     */
    private awaitingExam05 = false;
    /** Tránh báo cùng một lỗi đình chỉ của bài 4 ở mọi frame. */
    private exam04ActiveDisqualification: string | null = null;
    /**
     * Bài 04 có 4 course, player chỉ được chọn 1 và lock cho cả lần thi.
     * `null` = chưa chạm course nào. Khi xe chạm `startYellowSensor` của
     * course nào đầu tiên, ta set index đó và KHÔNG cho phép swap sang
     * course khác. Reset về `null` khi `reset()` exam.
     */
    private lockedCourseIndex: number | null = null;

    reset(){
        this.score=100;
        this.penalties.length=0;
        this.activeIndex=0;
        this.startedAt=performance.now();
        this.cooldown.clear();
        this.finished=false;
        this.scoringStarted = false;
        this.disqualified=false;
        this.disqualifyReason='';
        this.pedestrianCompleted = false;
        this.lockedCourseIndex = null;
        this.awaitingExam05 = false;
        this.exam04ActiveDisqualification = null;
        this.exam06ApproachLane.reset();
        this.wrongApproachLaneReported = false;
        this.previousWindingFront = null;
        this.wrongWindingReported = false;
        this.sCurveTimer.reset();
        this.parkingClassCheck.reset();
        this.parkingTimer.reset();
        this.parkingBoundaryScoring.reset();
        this.lateProgression.reset();
        this.approachingLateLesson = false;
        this.entryLessonId = 1;
        this.startExercise.reset();
        this.pedestrianExercise.reset();
        this.hillExercise.reset();
        this.wheelTrackExercise.reset();
        // Bài 5 — reset cả exercise và South light để light quay lại 'idle'
        // cho lần thi kế tiếp.
        this.intersectionExercise.reset();
        for (const scorer of this.trafficLightScorers) scorer.reset();
        this.southLight?.reset();
    }

    /** Selecting a lesson skips all earlier exercise checks and start-command gating. */
    startFromLesson(lessonId: number): void {
        if (!Number.isInteger(lessonId) || lessonId < 1 || lessonId > 11) return;
        this.reset();
        this.entryLessonId = lessonId;
        if (lessonId === 1) return;
        this.activeIndex = lessonId - 1;
        this.pedestrianCompleted = lessonId > 2;
        this.scoringStarted = true;
        this.startedAt = performance.now();
        this.approachingLateLesson = lessonId >= 6;
        if (lessonId === 2) this.pedestrianExercise.activate();
        if (lessonId === 3) this.hillExercise.activate();
    }

    /**
     * Wire up Exam04 sensors from the track. Call this after Track (and thus
     * buildExamGround) has been constructed so wheelTrackCourseSensors is populated.
     */
    wireExam04(
        trackSensors: {
            vehicleClass: ExamVehicleClass;
            startYellowSensor: THREE.Box3;
            timerStartSensor: THREE.Box3;
            endYellowSensor: THREE.Box3;
            wheelTrackZone: THREE.Box3;
            boundarySensors: THREE.Box3[];
            entryWorld: THREE.Vector3;
            exitForwardAxis: THREE.Vector3;
        }[]
    ): void {
        this.wheelTrackSensors.length = 0;
        for (let i = 0; i < trackSensors.length; i++) {
            const s = trackSensors[i];
            this.wheelTrackSensors.push({
                index: i,
                vehicleClass: s.vehicleClass,
                startYellowSensor: s.startYellowSensor,
                timerStartSensor: s.timerStartSensor,
                endYellowSensor: s.endYellowSensor,
                wheelTrackZone: s.wheelTrackZone,
                boundarySensors: s.boundarySensors,
                entryWorld: s.entryWorld,
                exitForwardAxis: s.exitForwardAxis,
            });
        }
    }

    /** Apply the lesson 5 scoring rules to each configured cycling signal. */
    wireTrafficLights(track: TrackObjects): void {
        if (this.trafficLightsWired) return;
        this.exam05To06LaneRule = track.exam05To06LaneRule;
        this.windingCourses = track.getWindingCourses?.() ?? [];
        this.parkingClassZones = track.parkingClassZones ?? [];
        this.parkingTimerGates = track.parkingTimerGates ?? [];
        this.parkingBoundaryScoring = new ParkingBoundaryScoring(track.perpendicularParkingBoundaryGroups ?? []);
        this.lateProgression = new ExamLateProgression(track.root, track.getTrafficLight('WEST'));
        for (const light of track.trafficLights) {
            if (light.alwaysGreen || !light.scoring) continue;
            this.trafficLightScorers.push(new TrafficLightScoring(light,
                light.markerId === 'SOUTH' ? this.intersectionExercise : undefined));
        }
        const light = track.getTrafficLight('SOUTH');
        this.southLight = light ?? null;
        // Chỉ vào bài 5 sau khi bài 4 hoàn thành.
        if (light) light.onMarkerTriggered = (id: string) => {
            if (id !== 'SOUTH' || this.disqualified) return;
            if (this.activeIndex === 3 && this.awaitingExam05) {
                this.activeIndex = 4;
                this.awaitingExam05 = false;
            }
        };
        this.trafficLightsWired = true;
    }

    update(vehicle: ExamVehicleSnapshot, startSignal: StartSignalPhase, dt: number): string | undefined {
        if(this.finished) return;
        let sCurveToast: string | undefined;
        let parkingToast: string | undefined;
        if (this.scoringStarted) {
            for (const event of this.parkingBoundaryScoring.update(Object.values(vehicle.wheelPositions ?? {}))) {
                this.applyPenaltyEvent(event);
                parkingToast = event.reason;
            }
            const rear = vehicle.position.clone().multiplyScalar(2).sub(vehicle.frontPosition);
            if (this.parkingClassCheck.update(this.parkingClassZones,
                [vehicle.frontPosition, rear, vehicle.position, ...Object.values(vehicle.wheelPositions ?? {})])) {
                return this.handleDisqualification(6, EXAM_04_WRONG_LAYOUT_REASON,
                    `Đình chỉ sát hạch — ${EXAM_04_WRONG_LAYOUT_REASON}`);
            }
            const previous = this.previousWindingFront;
            this.previousWindingFront = vehicle.frontPosition.clone();
            if (!this.wrongWindingReported && this.windingCourses.some(entry => {
                if (entry.vehicleClass === EXAM_VEHICLE_CLASS) return false;
                return touchesWindingGate(entry.course, 's-curve-start-yellow-dashed-line', vehicle.frontPosition, previous);
            })) {
                this.wrongWindingReported = true;
                return this.handleDisqualification(this.activeIndex, EXAM_04_WRONG_LAYOUT_REASON,
                    `Đình chỉ sát hạch — ${EXAM_04_WRONG_LAYOUT_REASON}`);
            }
            if (this.activeIndex === 5) {
                for (const event of this.sCurveTimer.update(vehicle.frontPosition, this.windingCourses)) {
                    this.applyPenaltyEvent(event);
                    sCurveToast = event.reason;
                }
                if (this.sCurveTimer.isActive) this.approachingLateLesson = false;
                if (this.sCurveTimer.isCompleted) {
                    this.activeIndex = 6;
                    this.approachingLateLesson = true;
                    sCurveToast ??= 'Hoàn thành bài 6';
                }
            }
            if (this.activeIndex === 6) {
                for (const event of this.parkingTimer.update(vehicle.frontPosition, this.parkingTimerGates)) {
                    this.applyPenaltyEvent(event);
                    parkingToast = event.reason;
                }
                if (this.parkingTimer.isActive) this.approachingLateLesson = false;
                if (this.parkingTimer.isCompleted) {
                    this.activeIndex = 7;
                    this.approachingLateLesson = true;
                    parkingToast ??= 'Hoàn thành bài 7';
                }
            }
        }
        let intersectionToast: string | undefined;
        if (this.scoringStarted) {
            for (const scorer of this.trafficLightScorers) {
                const result = scorer.update({ ...vehicle, clutch: vehicle.clutch ?? 1, dt });
                if (!result) continue;
                for (const event of result.penalties) this.applyPenaltyEvent(event);
                if (result.disqualified) {
                    return this.handleDisqualification(this.activeIndex,
                        result.disqualifyReason ?? 'Đình chỉ sát hạch', result.toast, true);
                }
                if (result.toast) intersectionToast = result.toast;
                if (result.completed && scorer.light.markerId === 'SOUTH' && this.activeIndex === 4) {
                    this.activeIndex = 5;
                    this.approachingLateLesson = true;
                }
            }
        }

        const laneRule = this.exam05To06LaneRule;
        if (this.scoringStarted && this.entryLessonId <= 6 && (this.activeIndex === 4 || this.activeIndex === 5)
            && laneRule && !this.wrongApproachLaneReported
            && this.exam06ApproachLane.update(laneRule.road, laneRule.widthM, laneRule.lengthM,
                vehicle.position, vehicle.frontPosition)) {
            this.wrongApproachLaneReported = true;
            const reason = 'đi không đúng làn đường quy định';
            return this.handleDisqualification(this.activeIndex, reason, `Đình chỉ sát hạch — ${reason}`);
        }

        if (this.scoringStarted && this.activeIndex >= 5) {
            const progress = this.lateProgression.update(this.activeIndex + 1, this.approachingLateLesson,
                vehicle.position, vehicle.frontPosition);
            if (progress.entered) {
                this.activeIndex = progress.entered - 1;
                this.approachingLateLesson = false;
            }
            if (progress.finished) {
                this.finished = true;
                return 'Hoàn thành bài thi';
            }
        }

        if (this.activeIndex === 0) {
            const result = this.startExercise.update({ ...vehicle, startSignal, dt });
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                const reason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ sát hạch — /, '')
                    ?? 'Đình chỉ sát hạch';
                return this.handleDisqualification(0, reason, result.toast);
            }
            if (result.completed) {
                this.activeIndex = 1;
                this.startedAt = performance.now();
                this.pedestrianExercise.activate();
            }
            return result.toast;
        }

        if (this.activeIndex === 1) {
            const input = {
                position: vehicle.position,
                frontPosition: vehicle.frontPosition,
                speedKmh: vehicle.speedKmh,
                rpm: vehicle.rpm,
                engineRunning: vehicle.engineRunning,
                stalled: vehicle.stalled,
                seatBeltFastened: vehicle.seatBeltFastened,
                leftSignal: vehicle.leftSignal,
                clutch: vehicle.clutch ?? 1,
                dt,
            };
            const result = this.pedestrianExercise.update(input);
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                const reason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ sát hạch — /, '')
                    ?? 'Đình chỉ sát hạch';
                return this.handleDisqualification(1, reason, result.toast);
            }
            if (result.completed) {
                this.pedestrianCompleted = true;
                this.activeIndex = 2;
                this.startedAt = performance.now();
                this.hillExercise.activate();
            }
            return result.toast;
        }

        // Bài 03 — Dừng và khởi hành ngang dốc
        if (this.activeIndex === 2) {
            // rearWheelX: bánh xe sau nằm ở phía đối diện của frontPosition
            const rearWheelX = 2 * vehicle.position.x - vehicle.frontPosition.x;
            const input = {
                position: vehicle.position,
                frontPosition: vehicle.frontPosition,
                rearWheelX,
                hillForwardAxis: new THREE.Vector3(1, 0, 0),
                speedKmh: vehicle.speedKmh,
                rpm: vehicle.rpm,
                engineRunning: vehicle.engineRunning,
                stalled: vehicle.stalled,
                clutch: vehicle.clutch ?? 1,
                dt,
            };
            const result = this.hillExercise.update(input);
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                const reason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ — /, '')
                    ?? 'Đình chỉ sát hạch';
                return this.handleDisqualification(2, reason, result.toast);
            }
            if (result.completed) {
                this.activeIndex = 3;
            }
            // Phát tiếng "Tút" khi nhận được flag readyBeep
            if (result.readyBeep) {
                this.hillExercise.playReadyBeep();
            }
            return result.toast;
        }

        // ── Bài 04 — Wheel Track + Right Angle ─────────────────────────────────
        if (this.activeIndex === 3) {
            if (this.awaitingExam05) return;
            const enteredCourse = this.wheelTrackExercise.findEnteredCourse(
                vehicle.frontPosition, this.wheelTrackSensors);
            if (enteredCourse >= 0
                && this.wheelTrackSensors[enteredCourse].vehicleClass !== EXAM_VEHICLE_CLASS) {
                return this.handleDisqualification(3, EXAM_04_WRONG_LAYOUT_REASON,
                    `Đình chỉ sát hạch — ${EXAM_04_WRONG_LAYOUT_REASON}`);
            }
            const ex04State = this.wheelTrackExercise.state;

            // State INACTIVE: tìm course mà xe vừa chạm startYellowSensor.
            // Player chỉ được chọn 1 course (lockedCourseIndex). Nếu xe chạm
            // vào sensor của course khác trong khi đã lock → bỏ qua.
            if (ex04State === 'INACTIVE') {
                if (this.lockedCourseIndex === null) {
                    const idx = enteredCourse;
                    if (idx < 0) return;
                    this.lockedCourseIndex = idx;
                    this.wheelTrackExercise.swapToCourse(this.wheelTrackSensors[idx]);
                }
            }

            // Kể cả frame vừa vào course, xử lý kết quả để không bỏ sót lỗi.
            // Chỉ khi COMPLETED mới chuyển sang chờ bài 5.
            const input = {
                position: vehicle.position,
                frontPosition: vehicle.frontPosition,
                wheelPositions: vehicle.wheelPositions ?? {
                    FL: vehicle.position.clone(), FR: vehicle.position.clone(),
                    RL: vehicle.position.clone(), RR: vehicle.position.clone(),
                },
                speedKmh: vehicle.speedKmh,
                rpm: vehicle.rpm,
                engineRunning: vehicle.engineRunning,
                stalled: vehicle.stalled,
                clutch: vehicle.clutch ?? 1,
                dt,
                accident: vehicle.accident ?? false,
                wrongLayout: vehicle.wrongLayout ?? false,
                continueAfterDisqualification: this.scoringMode === 'errors-only',
            };
            const result = this.wheelTrackExercise.update(input);
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                const reason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ sát hạch — /, '')
                    ?? 'Đình chỉ sát hạch';
                return this.handleDisqualification(3, reason, result.toast);
            }
            this.exam04ActiveDisqualification = null;
            if (result.completed) {
                // Bài 4 hoàn thành — KHÔNG kết thúc exam. Chuyển sang trạng thái
                // chờ xe chạm trigger South light để kích hoạt bài 5.
                // Lưu ý: result.toast chỉ có ở frame chuyển trạng thái (sau đó E04
                // early-return không kèm toast), nên HUD chỉ flash một lần.
                if (!this.awaitingExam05) {
                    this.awaitingExam05 = true;
                    // Nếu đèn đã bị kích hoạt quá sớm, mở lại cảm biến cho bài 5.
                    this.southLight?.reset();
                    return result.toast ?? 'Hoàn thành bài 4';
                }
                return; // suppress toast lặp lại mỗi frame
            }
            return result.toast;
        }

        // Cycling signals keep being scored after the first intersection is completed.
        return intersectionToast ?? sCurveToast ?? parkingToast;
    }
    private handleDisqualification(index: number, reason: string, toast?: string, force = false): string | undefined {
        if (force || this.scoringMode === 'normal') {
            this.disqualified = true;
            this.finished = true;
            this.disqualifyReason = reason;
            return toast;
        }

        if (index === 3) {
            if (this.exam04ActiveDisqualification !== reason) {
                this.applyPenaltyEvent({ at: performance.now(), points: 0, reason: `Bài 4: ${reason}` });
                this.exam04ActiveDisqualification = reason;
            }
            return undefined;
        }

        // Lỗi đình chỉ không có số điểm trừ riêng: ghi nhận một lỗi để HUD
        // hiện thông báo, rồi chuyển bài để các cảm biến tiếp tục chấm điểm.
        this.applyPenaltyEvent({ at: performance.now(), points: 0, reason: `Bài ${index + 1}: ${reason}` });
        this.startedAt = performance.now();
        if (index === 0) {
            this.activeIndex = 1;
            this.pedestrianExercise.activate();
        } else if (index === 1) {
            this.pedestrianCompleted = true;
            this.activeIndex = 2;
            this.hillExercise.activate();
        } else if (index === 2) {
            this.activeIndex = 3;
        } else {
            this.activeIndex = Math.max(this.activeIndex, 5);
        }
        return undefined;
    }
    /** A curb touch ends the current normal-mode attempt, once. */
    disqualifyForRedWhiteCurb(): boolean {
        if (!this.scoringStarted || this.scoringMode !== 'normal' || this.finished) return false;
        this.handleDisqualification(this.activeIndex, 'Chạm vạch đỏ trắng');
        return true;
    }
    applyLinePenalty(zoneIndex:number,now:number){
        if (!this.scoringStarted || this.finished) return null;
        const last=this.cooldown.get(zoneIndex)??-Infinity;
        if(now-last<3000)return null;
        this.cooldown.set(zoneIndex,now);
        const evt:PenaltyEvent={
            at:now,points:5,reason:'Chạm vạch giới hạn'
        };
        this.penalties.push(evt);
        this.score=Math.max(0,this.score-5);
        return evt;
    }
    private applyPenaltyEvent(evt: PenaltyEvent) {
        if (!this.scoringStarted && evt.points > 0) return;
        this.penalties.push(evt);
        this.score = Math.max(0, this.score - evt.points);
    }
    get approaching() {
        return !this.scoringStarted;
    }

    /** Called only after the start-command recording finishes successfully. */
    completeStartAnnouncement(): boolean {
        if (this.finished || this.scoringStarted) return false;
        if (this.activeIndex === 0 && !this.startExercise.receiveStartCommand()) return false;
        this.scoringStarted = true;
        this.startedAt = performance.now();
        return true;
    }
    get startLampOn() {
        if (this.activeIndex === 0) return this.startExercise.startLampOn;
        if (this.activeIndex === 1) return this.pedestrianExercise.startLampOn;
        return false;
    }
    get elapsedSeconds(){
        if (!this.scoringStarted) return 0;
        return(performance.now()-this.startedAt)/1000;
    }
    get currentExerciseTitle(){
        if (this.disqualified) return 'Đình chỉ sát hạch';
        if (this.finished) return 'Hoàn thành bài thi';
        if (this.awaitingExam05) return 'Chờ vào bài 5';
        if (this.activeIndex === 0) return this.startExercise.title;
        if (this.activeIndex === 1) return this.pedestrianExercise.title;
        if (this.activeIndex === 2) return this.hillExercise.title;
        if (this.activeIndex === 3) return this.wheelTrackExercise.title;
        if (this.activeIndex === 4) return this.intersectionExercise.title;
        const lateTitles = ['Qua đường vòng quanh co', 'Ghép xe dọc vào nơi đỗ',
            'Tạm dừng ở chỗ có đường sắt chạy qua', 'Thay đổi số trên đường bằng',
            'Ghép xe ngang vào nơi đỗ', 'Kết thúc'];
        if (this.activeIndex >= 5 && this.activeIndex <= 10) {
            return this.approachingLateLesson ? `Đang đến bài ${this.activeIndex + 1}`
                : `Bài ${this.activeIndex + 1}: ${lateTitles[this.activeIndex - 5]}`;
        }
        return 'Đang di chuyển trong sân';
    }
    get isFinished(){
        return this.finished;
    }
}
