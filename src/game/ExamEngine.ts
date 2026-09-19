import * as THREE from 'three';
import type {PenaltyEvent} from './types';
import { StartExercise, type StartSignalPhase } from './exercises/StartExercise';
import { Exam02Pedestrian } from './exercises/Exam02Pedestrian';
import { Exam03Hill } from './exercises/Exam03Hill';
import { Exam04WheelTrack, type Exam04CourseSensors } from './exercises/Exam04WheelTrack';
import { startPosition } from './startPosition';

/** 2A stop line: hardcoded tại X = -8 (giữ nguyên vị trí).
 *  Xe spawn tại X = lineX - distance = -35 - 15 = -50, heading -PI/2 (hướng +X).
 *  Vạch dừng 2A đặt tại X = -8 — đồng bộ với EX02_STOP_LINE_X
 *  trong buildExamGround.ts (3 m trước crosswalk tại X=-5, đúng spec §7.1).
 *  Khoảng cách spawn→2A = -8 - (-50) = 42 m. */
const PEDESTRIAN_DISTANCE_FROM_START_M = 42;
const PEDESTRIAN_STOP_LINE_X = -8;   // hardcode, không dùng công thức

/** 3A stop line: trên cầu (bridge).
 *  Bridge at X=31, Z=-2, direction='horizontal'.
 *  Sau rotation.y = -PI/2: local +Z → world -Z, mapping world_X = 31 - local_Z.
 *  Vạch trắng tại local Z = +5.5 → world X = 31 - 5.5 = 25.5 (xe đang lên dốc,
 *  trong ramp lên phía TÂY — trước đỉnh).
 *  Vạch vàng tại local Z = +9.5 → world X = 31 - 9.5 = 21.5 (4.0m trước vạch trắng,
 *  vẫn trong ramp lên phía TÂY).
 *  Đỉnh dốc tại local Z = 0 → world X = 31.
 *  Chân dốc phía TÂY (xe vào) tại world X = 31 - 13 = 18.
 *  Chân dốc phía ĐÔNG (xe ra) tại world X = 31 + 13 = 44. */
const HILL_STOP_LINE_X = 31 - 5.5;   // = 25.5 (matches Bridge.ts local Z=+5.5)
const HILL_YELLOW_LINE_X = 31 - 9.5;  // = 21.5 (matches Bridge.ts local Z=+9.5)

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
    score=100;
    readonly penalties:PenaltyEvent[]=[];
    activeIndex=0;
    startedAt=performance.now();
    readonly startExercise = new StartExercise();
    readonly pedestrianExercise = new Exam02Pedestrian({
        stopLineX: PEDESTRIAN_STOP_LINE_X,
        roadZ: startPosition.lineZ,
        roadWidth: 8,
        approachZoneM: 15,
        exitDistanceM: 3,
        stopSpeedKmh: .6,
        minStopDwellSec: .3,
    });
    readonly hillExercise = new Exam03Hill({
        stopLineX: HILL_STOP_LINE_X,
        yellowLineX: HILL_YELLOW_LINE_X,
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
    disqualified=false;
    disqualifyReason='';
    private cooldown=new Map<number,number>();
    private finished=false;
    private pedestrianCompleted = false;
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
        this.startExercise.reset();
        this.pedestrianExercise.reset();
        this.hillExercise.reset();
        this.wheelTrackExercise.reset();
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

    update(vehicle: ExamVehicleSnapshot, startSignal: StartSignalPhase, dt: number): string | undefined {
        if(this.finished) return;

        if (this.activeIndex === 0) {
            const result = this.startExercise.update({ ...vehicle, startSignal, dt });
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                this.disqualified = true;
                this.finished = true;
                this.disqualifyReason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ sát hạch — /, '')
                    ?? 'Đình chỉ sát hạch';
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
                this.disqualified = true;
                this.finished = true;
                this.disqualifyReason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ sát hạch — /, '')
                    ?? 'Đình chỉ sát hạch';
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
                this.disqualified = true;
                this.finished = true;
                this.disqualifyReason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ — /, '')
                    ?? 'Đình chỉ sát hạch';
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
                    if (idx >= 0) {
                        this.lockedCourseIndex = idx;
                        this.wheelTrackExercise.swapToCourse(this.wheelTrackSensors[idx]);
                        // Run one update to surface the "Bắt đầu" toast for this course
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
                        };
                        this.wheelTrackExercise.update(input);
                    }
                }
                return;
            }

            // Đang chạy course đã lock. Kết quả COMPLETED → toast "Hoàn thành
            // bài 4" + set finished=true (không DQ) → HUD flash success.
            // Kết quả DISQUALIFIED → set finished=true + disqualified=true
            // → HUD mở dialog Đình chỉ giống bài 01/02/03.
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
            };
            const result = this.wheelTrackExercise.update(input);
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                this.disqualified = true;
                this.finished = true;
                this.disqualifyReason = result.disqualifyReason
                    ?? result.toast?.replace(/^Đình chỉ sát hạch — /, '')
                    ?? 'Đình chỉ sát hạch';
                return result.toast;
            }
            if (result.completed) {
                // Course hoàn thành → toast "Hoàn thành bài 4" + kết thúc exam
                // (không DQ). HUD sẽ flash 'Hoàn thành · X điểm' nhờ finished=true.
                this.finished = true;
                return result.toast ?? 'Hoàn thành bài 4';
            }
            return result.toast;
        }

        // After all known exercises, the rest of the route is still under construction.
        return;
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
        if (this.finished) return 'Hoàn thành bài thi';
        if (this.activeIndex === 0) return this.startExercise.title;
        if (this.activeIndex === 1) return this.pedestrianExercise.title;
        if (this.activeIndex === 2) return this.hillExercise.title;
        if (this.activeIndex === 3) return this.wheelTrackExercise.title;
        return 'Hoàn thành';
    }
    get isFinished(){
        return this.finished;
    }
}
