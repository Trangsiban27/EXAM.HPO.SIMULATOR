/**
 * HUD widget cho bài sát hạch số 3 — Dừng và khởi hành xe ngang dốc (3A).
 *
 * Hiển thị khi `ExamEngine.activeIndex === 2` và bài đang hoạt động. Cung cấp:
 * - Tiêu đề + subtitle của bài
 * - Trạng thái state machine (APPROACHING → HILL_STARTING → COMPLETED/DISQUALIFIED)
 * - Khoảng cách A từ thanh cản trước đến vạch dừng (HARD_CONSTRAINT 0 ≤ A ≤ 0.5 m)
 * - Rollback hiện tại (m)
 * - Timer 30 giây (thời gian còn lại)
 * - Stop classification: VALID_STOP / STOP_TOO_EARLY / STOP_OVER_LINE / NO_REQUIRED_STOP
 *
 * Spec: spec/exam/exam_03_hill_stop_and_start.md §10, §11, §12.
 */

import type { Exam03Hill } from '../game/exercises/Exam03Hill';

const ROOT_ID = 'hill-hud';

type Status =
    | 'IDLE'
    | 'APPROACHING'
    | 'STOP_EVAL'
    | 'VALID'
    | 'TOO_EARLY'
    | 'OVER_LINE'
    | 'HILL_STARTING'
    | 'DQ'
    | 'DONE';

const STATE_HINT: Record<string, string> = {
    IDLE: 'Đang chờ kích hoạt',
    APPROACHING: 'Lên dốc · dừng tại vạch · tối đa 0.5 m',
    STOP_EVAL: 'Đang đánh giá vị trí dừng',
    VALID: 'Vị trí dừng hợp lệ · chuẩn bị khởi hành',
    TOO_EARLY: 'Dừng quá xa vạch',
    OVER_LINE: 'Đã vượt vạch dừng',
    HILL_STARTING: 'Khởi hành lên dốc · không tụt quá 0.5 m',
    DQ: 'Đình chỉ sát hạch',
    DONE: 'Hoàn thành bài 3',
};

const VALID_LABEL = 'VỊ TRÍ HỢP LỆ (0 ≤ A ≤ 0.5 m)';
const TOO_EARLY_LABEL = 'DỪNG QUÁ XA (−5 điểm)';
const OVER_LABEL = 'VƯỢT VẠCH';
const NO_STOP_LABEL = 'KHÔNG DỪNG TẠI VẠCH';
const ROLLBACK_LABEL = 'TỤT DỐC';
const TIMEOUT_LABEL = 'QUÁ 30 GIÂY';

interface HudRefs {
    root: HTMLDivElement;
    title: HTMLDivElement;
    hint: HTMLDivElement;
    dist: HTMLDivElement;
    distLabel: HTMLDivElement;
    rollback: HTMLDivElement;
    rollbackLabel: HTMLDivElement;
    timer: HTMLDivElement;
    timerLabel: HTMLDivElement;
    badge: HTMLDivElement;
    badgeText: HTMLDivElement;
}

function ensureRoot(host: HTMLElement): HudRefs {
    let root = document.getElementById(ROOT_ID) as HTMLDivElement | null;
    if (!root) {
        root = document.createElement('div');
        root.id = ROOT_ID;
        root.innerHTML = `
            <div class="ped-card-title">
                <span class="ped-card-marker">3A</span>
                <div class="ped-card-titles">
                    <b class="ped-card-headline">Dừng và khởi hành xe ngang dốc</b>
                    <small class="ped-card-sub" id="hillHint">Đang chờ kích hoạt</small>
                </div>
            </div>
            <div class="ped-card-row">
                <div class="ped-dist" id="hillDist">—</div>
                <div class="ped-dist-label" id="hillDistLabel">Chưa đo</div>
            </div>
            <div class="hill-card-row">
                <div class="hill-rollback" id="hillRollback">0.00 m</div>
                <div class="hill-rollback-label">Tụt dốc</div>
                <div class="hill-timer" id="hillTimer">—</div>
                <div class="hill-timer-label">Giây còn lại</div>
            </div>
            <div class="ped-badge" id="hillBadge">
                <span class="ped-badge-dot"></span>
                <span id="hillBadgeText">—</span>
            </div>
        `;
        host.appendChild(root);
    }
    return {
        root,
        title: root.querySelector('.ped-card-headline') as HTMLDivElement,
        hint: root.querySelector('#hillHint') as HTMLDivElement,
        dist: root.querySelector('#hillDist') as HTMLDivElement,
        distLabel: root.querySelector('#hillDistLabel') as HTMLDivElement,
        rollback: root.querySelector('#hillRollback') as HTMLDivElement,
        rollbackLabel: root.querySelector('.hill-rollback-label') as HTMLDivElement,
        timer: root.querySelector('#hillTimer') as HTMLDivElement,
        timerLabel: root.querySelector('.hill-timer-label') as HTMLDivElement,
        badge: root.querySelector('#hillBadge') as HTMLDivElement,
        badgeText: root.querySelector('#hillBadgeText') as HTMLDivElement,
    };
}

function distanceText(a: number): string {
    const sign = a >= 0 ? '+' : '−';
    return `A = ${sign}${Math.abs(a).toFixed(2)} m`;
}

function rollbackText(m: number): string {
    return `${m.toFixed(2)} m`;
}

function timerText(sec: number | undefined): string {
    if (sec === undefined) return '—';
    return `${Math.ceil(sec)} s`;
}

export const hillHud = {
    /**
     * Cập nhật nội dung widget mỗi frame.
     * @param exercise instance Exam03Hill (undefined → ẩn widget)
     * @param stopDistanceA khoảng cách A hiện tại
     * @param rollbackM rollback hiện tại (m)
     * @param timeRemainingSec thời gian còn lại để khởi hành (undefined nếu chưa bắt đầu timer)
     * @param visible hiển thị widget hay không
     */
    update(
        host: HTMLElement,
        exercise: Exam03Hill | undefined,
        stopDistanceA: number | undefined,
        rollbackM: number,
        timeRemainingSec: number | undefined,
        visible: boolean
    ): void {
        const refs = ensureRoot(host);

        if (!visible || !exercise) {
            refs.root.style.display = 'none';
            return;
        }
        refs.root.style.display = '';

        // State machine mapping.
        let baseStatus: Status;
        if (exercise.state === 'INACTIVE') baseStatus = 'IDLE';
        else if (exercise.state === 'APPROACHING_STOP_LINE') baseStatus = 'APPROACHING';
        else if (exercise.state === 'STOP_EVALUATION') baseStatus = 'STOP_EVAL';
        else if (exercise.state === 'HILL_STARTING' || exercise.state === 'START_COMPLETED' || exercise.state === 'LEAVE_HILL') baseStatus = 'HILL_STARTING';
        else if (exercise.state === 'DISQUALIFIED') baseStatus = 'DQ';
        else if (exercise.state === 'COMPLETED') baseStatus = 'DONE';
        else baseStatus = 'IDLE';

        // Badge text và kind.
        let badgeText = '—';
        let badgeKind: 'none' | 'valid' | 'early' | 'over' | 'no-stop' | 'done' | 'dq' = 'none';
        if (exercise.stopClassification) {
            switch (exercise.stopClassification) {
                case 'VALID_STOP':
                    badgeText = VALID_LABEL;
                    badgeKind = 'valid';
                    baseStatus = 'VALID';
                    break;
                case 'STOP_TOO_EARLY':
                    badgeText = TOO_EARLY_LABEL;
                    badgeKind = 'early';
                    baseStatus = 'TOO_EARLY';
                    break;
                case 'STOP_OVER_LINE':
                    badgeText = OVER_LABEL;
                    badgeKind = 'over';
                    baseStatus = 'OVER_LINE';
                    break;
                case 'NO_REQUIRED_STOP':
                    badgeText = NO_STOP_LABEL;
                    badgeKind = 'no-stop';
                    baseStatus = 'OVER_LINE';
                    break;
            }
        } else if (baseStatus === 'DQ') {
            badgeText = 'ĐÌNH CHỈ SÁT HẠCH';
            badgeKind = 'dq';
        } else if (baseStatus === 'DONE') {
            badgeText = 'HOÀN THÀNH';
            badgeKind = 'done';
        } else if (baseStatus === 'HILL_STARTING') {
            badgeText = 'ĐANG KHỞI HÀNH';
            badgeKind = 'valid';
        }

        refs.hint.textContent = STATE_HINT[baseStatus] ?? '';

        // Khoảng cách A.
        if (stopDistanceA === undefined || baseStatus === 'IDLE') {
            refs.dist.textContent = '—';
            refs.distLabel.textContent = 'Chưa đo';
            refs.dist.dataset.kind = '';
        } else {
            refs.dist.textContent = distanceText(stopDistanceA);
            const status = stopDistanceA >= 0 && stopDistanceA <= 0.5 ? 'VALID' :
                stopDistanceA > 0.5 ? 'TOO_EARLY' : 'OVER_LINE';
            const kindByStatus: Record<string, string> = {
                VALID: 'valid',
                TOO_EARLY: 'early',
                OVER_LINE: 'over',
            };
            refs.dist.dataset.kind = kindByStatus[status] ?? '';
            refs.distLabel.textContent = status === 'VALID' ? 'Cách vạch hợp lệ' :
                status === 'TOO_EARLY' ? 'Cần tiến gần hơn' :
                    status === 'OVER_LINE' ? 'Đã qua vạch' : '';
        }

        // Rollback.
        refs.rollback.textContent = rollbackText(rollbackM);
        const rollbackKind = rollbackM > 0.5 ? 'early' : rollbackM > 0.2 ? 'approach' : '';
        refs.rollback.dataset.kind = rollbackKind;

        // Timer.
        refs.timer.textContent = timerText(timeRemainingSec);
        if (timeRemainingSec !== undefined) {
            const timerKind = timeRemainingSec <= 5 ? 'early' : timeRemainingSec <= 10 ? 'approach' : '';
            refs.timer.dataset.kind = timerKind;
        } else {
            refs.timer.dataset.kind = '';
        }

        // Badge.
        refs.badge.dataset.kind = badgeKind;
        refs.badgeText.textContent = badgeText;

        // Tiêu đề.
        refs.title.textContent = exercise.title ?? 'Bài 3A';
    },
};
