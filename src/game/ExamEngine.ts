import * as THREE from 'three';
import type {PenaltyEvent} from './types';
import { StartExercise, type StartSignalPhase } from './exercises/StartExercise';
import { PedestrianExercise, type Exam02Input } from './exercises/PedestrianExercise';
import { startPosition } from './startPosition';

/** 2A stop line: 60 m sau vạch xuất phát, cùng corridor Z = -2 với 1A. */
const PEDESTRIAN_DISTANCE_FROM_START_M = 60;
const PEDESTRIAN_STOP_LINE_X = startPosition.lineX + PEDESTRIAN_DISTANCE_FROM_START_M;

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
}

export class ExamEngine{
    score=100;
    readonly penalties:PenaltyEvent[]=[];
    activeIndex=0;
    startedAt=performance.now();
    readonly startExercise = new StartExercise();
    readonly pedestrianExercise = new PedestrianExercise({
        stopLineX: PEDESTRIAN_STOP_LINE_X,
        roadZ: startPosition.lineZ,
        roadWidth: 8
    });
    disqualified=false;
    disqualifyReason='';
    private cooldown=new Map<number,number>();
    private finished=false;
    private pedestrianCompleted = false;
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
        this.startExercise.reset();
        this.pedestrianExercise.reset();
    }
    update(vehicle: ExamVehicleSnapshot, startSignal: StartSignalPhase, dt: number): string | undefined {
        if(this.finished) return;
        if (this.activeIndex === 0) {
            const result = this.startExercise.update({ ...vehicle, startSignal, dt });
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                this.disqualified = true;
                this.finished = true;
                this.disqualifyReason = result.toast?.replace(/^Đình chỉ sát hạch — /, '') ?? 'Đình chỉ sát hạch';
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
            const input: Exam02Input = {
                position: vehicle.position,
                frontPosition: vehicle.frontPosition,
                speedKmh: vehicle.speedKmh,
                rpm: vehicle.rpm,
                engineRunning: vehicle.engineRunning,
                stalled: vehicle.stalled,
                clutch: vehicle.clutch ?? 1,
                dt,
            };
            const result = this.pedestrianExercise.update(input, this.startedAt);
            for (const evt of result.penalties) this.applyPenaltyEvent(evt);
            if (result.disqualified) {
                this.disqualified = true;
                this.finished = true;
                this.disqualifyReason = result.toast?.replace(/^Đình chỉ sát hạch — /, '') ?? 'Đình chỉ sát hạch';
            }
            if (result.completed) {
                this.pedestrianCompleted = true;
                this.activeIndex = 2;
            }
            return result.toast;
        }

        // After 2A, the rest of the route is still under construction.
        if (!this.finished) this.finished = this.pedestrianCompleted;
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
    get startLampOn() { return this.startExercise.startLampOn; }
    get elapsedSeconds(){
        return(performance.now()-this.startedAt)/1000;
    }
    get currentExerciseTitle(){
        if (this.finished) return 'Hoàn thành bài thi';
        if (this.activeIndex === 0) return this.startExercise.title;
        if (this.activeIndex === 1) return this.pedestrianExercise.title;
        return 'Hoàn thành';
    }
    get isFinished(){
        return this.finished;
    }
}
