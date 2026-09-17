import * as THREE from 'three';
import type { PenaltyEvent } from '../types';
import { EXAM_02_PEDESTRIAN_RULES, EXAM_VEHICLE_CLASS } from '../exam/examRules';

/**
 * Bài sát hạch số 2 — Giảm tốc và dừng trước vạch sang đường có người đi bộ (2A).
 * The vehicle must slow down inside the approach zone, come to a complete stop on
 * the stop line, and only proceed once the exam window releases it.
 */
export type PedestrianState =
    | 'INACTIVE'
    | 'APPROACHING'
    | 'STOPPED_ON_LINE'
    | 'WAITING_FOR_GO'
    | 'CROSSING'
    | 'COMPLETED'
    | 'DISQUALIFIED';

export interface Exam02Input {
    position: THREE.Vector3;
    frontPosition: THREE.Vector3;
    speedKmh: number;
    rpm: number;
    engineRunning: boolean;
    stalled: boolean;
    clutch: number;
    dt: number;
}

export interface Exam02Result {
    toast?: string;
    penalties: PenaltyEvent[];
    completed: boolean;
    disqualified: boolean;
}

const rules = EXAM_02_PEDESTRIAN_RULES;
const approachSpeed = rules.approachSpeedKmh[EXAM_VEHICLE_CLASS];
const stopSpeedKmh = .6;
const waitHoldSec = 1.2;

export class PedestrianExercise {
    readonly id = 'EXAM_02_PEDESTRIAN';
    state: PedestrianState = 'INACTIVE';
    readonly stopLine: THREE.Box3;
    readonly approachZone: THREE.Box3;
    startLampOn = false;

    private stoppedSince = 0;
    private waitToastAt = -Infinity;
    private speedToastAt = -Infinity;
    private activatedAt = 0;

    constructor(opts: { stopLineX: number; roadZ: number; roadWidth: number }) {
        const { stopLineX, roadZ, roadWidth } = opts;
        this.stopLine = new THREE.Box3(
            new THREE.Vector3(stopLineX - .15, -1, roadZ - roadWidth / 2),
            new THREE.Vector3(stopLineX + .15, 3, roadZ + roadWidth / 2)
        );
        this.approachZone = new THREE.Box3(
            new THREE.Vector3(stopLineX - rules.approachZoneM, -1, roadZ - roadWidth / 2),
            new THREE.Vector3(stopLineX, 3, roadZ + roadWidth / 2)
        );
    }

    get title() {
        switch (this.state) {
            case 'INACTIVE': return 'Đường thẳng hẹp';
            case 'APPROACHING': return 'Đường thẳng hẹp · Giảm tốc';
            case 'STOPPED_ON_LINE': return 'Đường thẳng hẹp · Dừng chờ';
            case 'WAITING_FOR_GO': return 'Đường thẳng hẹp · Chờ hiệu lệnh';
            case 'CROSSING': return 'Đường thẳng hẹp · Qua vạch';
            case 'COMPLETED': return 'Đường thẳng hẹp';
            case 'DISQUALIFIED': return 'Đường thẳng hẹp · Đình chỉ';
        }
    }

    reset() {
        this.state = 'INACTIVE';
        this.startLampOn = false;
        this.stoppedSince = 0;
        this.waitToastAt = -Infinity;
        this.speedToastAt = -Infinity;
        this.activatedAt = 0;
    }

    activate() {
        this.state = 'APPROACHING';
        this.startLampOn = true;
        this.activatedAt = performance.now();
    }

    update(input: Exam02Input, examStartedAt: number): Exam02Result {
        if (this.state === 'INACTIVE' || this.state === 'COMPLETED' || this.state === 'DISQUALIFIED') {
            return { penalties: [], completed: this.state === 'COMPLETED', disqualified: this.state === 'DISQUALIFIED' };
        }
        const penalties: PenaltyEvent[] = [];
        const now = performance.now();
        const add = (points: number, reason: string) => {
            penalties.push({ at: now, points, reason });
        };
        const stopped = Math.abs(input.speedKmh) < stopSpeedKmh;
        const onLine = this.stopLine.containsPoint(input.frontPosition);

        if (this.state === 'APPROACHING') {
            // Enforce speed cap inside the approach zone.
            if (this.approachZone.containsPoint(input.frontPosition) && input.speedKmh > approachSpeed) {
                add(rules.stopLinePenalty, 'Không giảm tốc trước vạch sang đường');
            }
            if (input.frontPosition.x >= this.stopLine.max.x) {
                this.state = 'COMPLETED';
                this.startLampOn = false;
                return { toast: 'Hoàn thành bài 2', penalties, completed: true, disqualified: false };
            }
            if (onLine && stopped) {
                if (this.stoppedSince === 0) this.stoppedSince = now;
                const dwell = (now - this.stoppedSince) / 1000;
                if (dwell >= waitHoldSec) {
                    this.state = 'WAITING_FOR_GO';
                    this.startLampOn = true;
                    return { toast: 'Đã dừng đúng vạch', penalties, completed: false, disqualified: false };
                }
            } else {
                this.stoppedSince = 0;
            }
            return { penalties, completed: false, disqualified: false };
        }

        if (this.state === 'WAITING_FOR_GO') {
            // Release after a short hold so the player has time to re-engage the clutch.
            const dwell = (now - this.stoppedSince) / 1000;
            if (dwell >= waitHoldSec + 1) {
                this.state = 'CROSSING';
                this.startLampOn = true;
            }
            return { penalties, completed: false, disqualified: false };
        }

        if (this.state === 'CROSSING') {
            if (input.frontPosition.x >= this.stopLine.max.x) {
                this.state = 'COMPLETED';
                this.startLampOn = false;
                return { toast: 'Hoàn thành bài 2', penalties, completed: true, disqualified: false };
            }
            return { penalties, completed: false, disqualified: false };
        }

        return { penalties, completed: false, disqualified: false };
    }
}
