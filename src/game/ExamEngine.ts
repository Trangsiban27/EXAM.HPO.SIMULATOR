import * as THREE from 'three';
import type {PenaltyEvent} from './types';
import { StartExercise, type StartSignalPhase } from './exercises/StartExercise';
import { Exam02Pedestrian } from './exercises/Exam02Pedestrian';
import { Exam03Hill } from './exercises/Exam03Hill';
import { Exam04WheelTrack, type Exam04CourseSensors } from './exercises/Exam04WheelTrack';
import { Exam05South } from './exercises/Exam05South';
import type { TrafficLight } from './TrafficLight';
import type { TrackObjects } from './TrackObjects';
import { startPosition } from './startPosition';
import { EXAM_SCORING_MODE, type ExamScoringMode } from './exam/examScoringMode';
import {
    EXAM_02_STOP_LINE_X,
    EXAM_03_STOP_LINE_X,
    EXAM_03_YELLOW_LINE_X,
    EXAM_05_FINISH_CROSSWALK_X,
    EXAM_05_FINISH_CROSSWALK_Z,
    EXAM_05_FINISH_CROSSWALK_WIDTH_M,
    EXAM_05_FINISH_CROSSWALK_DEPTH_M,
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
     * (xem wireExam05South() và `light.onMarkerTriggered`).
     */
    readonly intersectionExercise = new Exam05South();
    /** Tham chiếu tới South traffic light (set bởi wireExam05South). */
    private southLight: TrafficLight | null = null;
    /** Đã gọi wireExam05South chưa — chỉ subscribe markerTriggered một lần. */
    private exam05Wired = false;
    disqualified=false;
    disqualifyReason='';
    private cooldown=new Map<number,number>();
    private finished=false;
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
        this.disqualified=false;
        this.disqualifyReason='';
        this.pedestrianCompleted = false;
        this.lockedCourseIndex = null;
        this.awaitingExam05 = false;
        this.exam04ActiveDisqualification = null;
        this.startExercise.reset();
        this.pedestrianExercise.reset();
        this.hillExercise.reset();
        this.wheelTrackExercise.reset();
        // Bài 5 — reset cả exercise và South light để light quay lại 'idle'
        // cho lần thi kế tiếp.
        this.intersectionExercise.reset();
        this.southLight?.reset();
    }

    /**
     * Wire up Exam04 sensors from the track. Call this after Track (and thus
     * buildExamGround) has been constructed so wheelTrackCourseSensors is populated.
     */
    wireExam04(
        trackSensors: {
            startYellowSensor: THREE.Box3;
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
                startYellowSensor: s.startYellowSensor,
                endYellowSensor: s.endYellowSensor,
                wheelTrackZone: s.wheelTrackZone,
                boundarySensors: s.boundarySensors,
                entryWorld: s.entryWorld,
                exitForwardAxis: s.exitForwardAxis,
            });
        }
    }

    /**
     * Wire Exam05South với trafficLight South đã có sẵn trong track.
     * Gọi sau `wireExam04()` từ DrivingGame.
     *
     * - Tìm `track.getTrafficLight('SOUTH')` rồi inject vào intersectionExercise.
     * - Khi bài 4 đã hoàn thành, trigger SOUTH chuyển sang bài 5.
     * - Idempotent: gọi nhiều lần chỉ subscribe một lần.
     *
     * Tham số `roadZ` là tâm lane world (X-axis của lane dọc, mặc định 21 theo
     * `buildExamGround.ts`). Sensors Box3 được tính trong Exam05South từ world
     * transform của light — không hard-code.
     */
    wireExam05South(track: TrackObjects, roadZ = 21, roadWidth = 8): void {
        if (this.exam05Wired) return;
        const light = track.getTrafficLight('SOUTH');
        if (!light) {
            console.warn('[ExamEngine] wireExam05South: track has no trafficLight with markerId="SOUTH"');
            return;
        }
        const stopBar = track.root.getObjectByName('exam-05-stop-bar');
        if (!stopBar) throw new Error('Exam 5 stop bar is missing');
        const stopBarBounds = new THREE.Box3().setFromObject(stopBar);
        this.southLight = light;
        this.intersectionExercise.attach({
            light,
            roadWidth,
            roadZ,
            stopBar: {
                minX: stopBarBounds.min.x,
                maxX: stopBarBounds.max.x,
                nearZ: stopBarBounds.max.z,
            },
            finishLine: {
                x: EXAM_05_FINISH_CROSSWALK_X,
                z: EXAM_05_FINISH_CROSSWALK_Z,
                widthM: EXAM_05_FINISH_CROSSWALK_WIDTH_M,
                depthM: EXAM_05_FINISH_CROSSWALK_DEPTH_M,
            },
        });

        // Chỉ vào bài 5 sau khi bài 4 hoàn thành.
        light.onMarkerTriggered = (id: string) => {
            if (id !== 'SOUTH' || this.disqualified) return;
            if (this.activeIndex === 3 && this.awaitingExam05) {
                this.activeIndex = 4;
                this.awaitingExam05 = false;
                this.intersectionExercise.activate();
            }
        };
        this.exam05Wired = true;
    }

    update(vehicle: ExamVehicleSnapshot, startSignal: StartSignalPhase, dt: number): string | undefined {
        if(this.finished) return;

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
            if (result.toast === 'Bắt đầu thi') this.startedAt = performance.now();
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
            const ex04State = this.wheelTrackExercise.state;

            // State INACTIVE: tìm course mà xe vừa chạm startYellowSensor.
            // Player chỉ được chọn 1 course (lockedCourseIndex). Nếu xe chạm
            // vào sensor của course khác trong khi đã lock → bỏ qua.
            if (ex04State === 'INACTIVE') {
                if (this.lockedCourseIndex === null) {
                    const idx = this.wheelTrackExercise.findEnteredCourse(
                        vehicle.frontPosition,
                        this.wheelTrackSensors
                    );
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

        // ── Bài 05 — Qua ngã tư có tín hiệu (chỉ áp dụng cho trafficLight South) ─
        // Được kích hoạt tự động khi xe chạm trigger zone South (xem wireExam05South).
        // Lúc đó activeIndex chuyển từ 3 (WheelTrack) sang 4 (Intersection).
        if (this.activeIndex === 4) {
            const input = {
                position: vehicle.position,
                frontPosition: vehicle.frontPosition,
                speedKmh: vehicle.speedKmh,
                rpm: vehicle.rpm,
                engineRunning: vehicle.engineRunning,
                stalled: vehicle.stalled,
                clutch: vehicle.clutch ?? 1,
                dt,
            };
            const result = this.intersectionExercise.update(input);
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                const reason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ sát hạch — /, '')
                    ?? 'Đình chỉ sát hạch';
                return this.handleDisqualification(4, reason, result.toast, true);
            }
            if (result.completed) {
                this.finished = true;
                return result.toast ?? 'Hoàn thành bài 5';
            }
            return result.toast;
        }

        // After all known exercises, the rest of the route is still under construction.
        return;
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
            this.activeIndex = 5;
        }
        return undefined;
    }
    /** A curb touch ends the current normal-mode attempt, once. */
    disqualifyForRedWhiteCurb(): boolean {
        if (this.scoringMode !== 'normal' || this.finished) return false;
        this.handleDisqualification(this.activeIndex, 'Chạm vạch đỏ trắng');
        return true;
    }
    applyLinePenalty(zoneIndex:number,now:number){
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
        this.penalties.push(evt);
        this.score = Math.max(0, this.score - evt.points);
    }
    get approaching() {
        return this.activeIndex === 0 &&
            (this.startExercise.state === 'PRE_START' ||
             this.startExercise.state === 'COUNTDOWN_5S');
    }
    get startLampOn() {
        if (this.activeIndex === 0) return this.startExercise.startLampOn;
        if (this.activeIndex === 1) return this.pedestrianExercise.startLampOn;
        return false;
    }
    get elapsedSeconds(){
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
        return 'Hoàn thành';
    }
    get isFinished(){
        return this.finished;
    }
}
