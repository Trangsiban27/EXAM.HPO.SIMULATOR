/**
 * HUD widget cho bài sát hạch số 2 — Dừng xe nhường đường cho người đi bộ (2A).
 *
 * Hiển thị khi `ExamEngine.activeIndex === 1` và bài đang hoạt động. Cung cấp:
 * - Tiêu đề + subtitle của bài
 * - Trạng thái state machine (APPROACHING → STOP_EVALUATION → COMPLETED/DISQUALIFIED)
 * - Khoảng cách A từ thanh cản trước đến vạch dừng (HARD_CONSTRAINT 0 ≤ A ≤ 0.5 m)
 * - Stop classification: VALID_STOP / STOP_TOO_EARLY / STOP_OVER_LINE / NO_REQUIRED_STOP
 *
 * Spec: spec/exam/exam_02_pedestrian_stop.md §5, §9.
 */

import type { Exam02Pedestrian } from '../game/exercises/Exam02Pedestrian';

const ROOT_ID = 'pedestrian-hud';

type Status =
    | 'IDLE'
    | 'APPROACHING'
    | 'STOP_EVAL'
    | 'TOO_EARLY'
    | 'OVER_LINE'
    | 'VALID'
    | 'DQ'
    | 'DONE';

const STATE_HINT: Record<string, string> = {
    IDLE: 'Đang chờ kích hoạt',
    APPROACHING: 'Giảm tốc, dừng trước vạch · tối đa 0.5 m',
    STOP_EVAL: 'Đang đánh giá vị trí dừng',
    VALID: 'Vị trí dừng hợp lệ',
    TOO_EARLY: 'Dừng quá xa vạch',
    OVER_LINE: 'Đã vượt vạch dừng',
    DQ: 'Đình chỉ sát hạch',
    DONE: 'Hoàn thành bài 2',
};

const VALID_LABEL = 'VỊ TRÍ HỢP LỆ (0 ≤ A ≤ 0.5 m)';
const TOO_EARLY_LABEL = 'DỪNG QUÁ XA';
const OVER_LABEL = 'VƯỢT VẠCH';
const NO_STOP_LABEL = 'KHÔNG DỪNG TẠI VẠCH';

interface HudRefs {
    root: HTMLDivElement;
    title: HTMLDivElement;
    hint: HTMLDivElement;
    dist: HTMLDivElement;
    distLabel: HTMLDivElement;
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
                <span class="ped-card-marker">2A</span>
                <div class="ped-card-titles">
                    <b class="ped-card-headline">Dừng xe nhường đường người đi bộ</b>
                    <small class="ped-card-sub" id="pedHint">Đang chờ kích hoạt</small>
                </div>
            </div>
            <div class="ped-card-row">
                <div class="ped-dist" id="pedDist">—</div>
                <div class="ped-dist-label" id="pedDistLabel">Chưa đo</div>
            </div>
            <div class="ped-badge" id="pedBadge">
                <span class="ped-badge-dot"></span>
                <span id="pedBadgeText">—</span>
            </div>
        `;
        host.appendChild(root);
    }
    return {
        root,
        title: root.querySelector('.ped-card-headline') as HTMLDivElement,
        hint: root.querySelector('#pedHint') as HTMLDivElement,
        dist: root.querySelector('#pedDist') as HTMLDivElement,
        distLabel: root.querySelector('#pedDistLabel') as HTMLDivElement,
        badge: root.querySelector('#pedBadge') as HTMLDivElement,
        badgeText: root.querySelector('#pedBadgeText') as HTMLDivElement,
    };
}

function classify(frontX: number | null, stopLineX: number): Status {
    if (frontX === null) return 'IDLE';
    const a = stopLineX - frontX;
    if (a >= 0 && a <= 0.5) return 'VALID';
    if (a > 0.5) return 'TOO_EARLY';
    return 'OVER_LINE';
}

function distanceText(a: number): string {
    const sign = a >= 0 ? '+' : '−';
    return `A = ${sign}${Math.abs(a).toFixed(2)} m`;
}

export const pedestrianHud = {
    /**
     * Cập nhật nội dung widget mỗi frame.
     * @param exercise instance Exam02Pedestrian (undefined → ẩn widget)
     * @param frontX   world X của front bumper, hoặc null nếu chưa có
     */
    update(host: HTMLElement, exercise: Exam02Pedestrian | undefined, frontX: number | null, visible: boolean): void {
        const refs = ensureRoot(host);

        if (!visible || !exercise) {
            refs.root.style.display = 'none';
            return;
        }
        refs.root.style.display = '';

        // State machine mapping.
        let baseStatus: Status;
        if (exercise.state === 'INACTIVE') baseStatus = 'IDLE';
        else if (exercise.state === 'APPROACHING') baseStatus = 'APPROACHING';
        else if (exercise.state === 'DISQUALIFIED') baseStatus = 'DQ';
        else if (exercise.state === 'COMPLETED') baseStatus = 'DONE';
        else baseStatus = 'STOP_EVAL';

        // Nếu đã đánh giá stop position, ưu tiên hiển thị classification.
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
        }

        refs.hint.textContent = STATE_HINT[baseStatus] ?? '';

        // Khoảng cách A — chỉ hiển thị khi approach hoặc đang dừng.
        if (frontX === null || baseStatus === 'IDLE') {
            refs.dist.textContent = '—';
            refs.distLabel.textContent = 'Chưa đo';
            refs.dist.dataset.kind = '';
        } else {
            const a = exercise.stopLineX - frontX;
            refs.dist.textContent = distanceText(a);
            const status = classify(frontX, exercise.stopLineX);
            const kindByStatus: Record<Status, string> = {
                IDLE: '',
                APPROACHING: 'approach',
                STOP_EVAL: 'approach',
                TOO_EARLY: 'early',
                OVER_LINE: 'over',
                VALID: 'valid',
                DQ: 'over',
                DONE: 'done',
            };
            refs.dist.dataset.kind = kindByStatus[status];
            refs.distLabel.textContent = status === 'VALID'
                ? 'Cách vạch hợp lệ'
                : status === 'TOO_EARLY'
                    ? 'Cần tiến gần hơn'
                    : status === 'OVER_LINE'
                        ? 'Đã qua vạch'
                        : status === 'APPROACHING'
                            ? 'Đang tiếp cận vạch'
                            : '';
        }

        // Badge trạng thái.
        refs.badge.dataset.kind = badgeKind;
        refs.badgeText.textContent = badgeText;

        // Tiêu đề theo state hiện tại.
        refs.title.textContent = exercise.title ?? 'Bài 2A';
    },
};
