/**
 * Global notification component.
 *
 * Renders every in-game notice (toasts, penalty flashes, exam start/stop banners,
 * the disqualified / success screen) into a single DOM container stacked just below
 * the top edge of the viewport so that all callers — HUD, exam engine, penalty
 * tracker — share the same presentation layer.
 *
 * Styles are in notify.css (imported via Vite):
 *   - translucent backdrop (backdrop-filter + rgba alpha) for a polished glass look
 *   - subtle entrance / exit animations
 *   - a thin progress strip that drains while the notice is visible
 *   - optional action button (used by the disqualify banner)
 *   - severity icons (✓, ✕, ⚠, ℹ, ◎)
 *
 * The module is a singleton; `notify.show(...)` is the only public entrypoint.
 */

import './notify.css';

export type NotifyKind = 'info' | 'exam' | 'penalty' | 'success' | 'disqualify' | 'warning';

export interface NotifyAction {
    label: string;
    onClick: () => void;
}

export interface NotifyOptions {
    kind?: NotifyKind;
    durationMs?: number;
    /** If true, the notice stays on screen until `dismiss()` is called. */
    persist?: boolean;
    /** Optional CTA button rendered on the right of the banner. */
    action?: NotifyAction;
    /** Optional secondary copy rendered below the main text. */
    subtitle?: string;
}

interface NotifyEntry {
    el: HTMLElement;
    progress?: HTMLElement;
    kind: NotifyKind;
    persist: boolean;
    dismissTimer?: number;
    startedAt: number;
    durationMs: number;
    onDismiss: () => void;
}

const ROOT_ID = 'notify-root';

function ensureRoot(): HTMLDivElement {
    let root = document.getElementById(ROOT_ID) as HTMLDivElement | null;
    if (!root) {
        root = document.createElement('div');
        root.id = ROOT_ID;
        document.body.appendChild(root);
    }
    return root;
}

const entries: NotifyEntry[] = [];

function iconFor(kind: NotifyKind): string {
    switch (kind) {
        case 'exam': return '◎';
        case 'penalty': return '!';
        case 'success': return '✓';
        case 'disqualify': return '✕';
        case 'warning': return '⚠';
        default: return 'ℹ';
    }
}

function dismiss(entry: NotifyEntry, immediate = false): void {
    const idx = entries.indexOf(entry);
    if (idx === -1) return;
    entries.splice(idx, 1);
    if (entry.dismissTimer) window.clearTimeout(entry.dismissTimer);
    const finish = () => {
        if (entry.el.parentNode) entry.el.remove();
        entry.onDismiss();
    };
    if (immediate) {
        finish();
        return;
    }
    entry.el.classList.remove('notify-show');
    entry.el.classList.add('notify-hide');
    window.setTimeout(finish, 240);
}

function buildCard(
    text: string,
    kind: NotifyKind,
    subtitle: string | undefined,
    action: NotifyAction | undefined,
    durationMs: number
): { card: HTMLElement; progress: HTMLElement | null; body: HTMLElement } {
    const card = document.createElement('div');
    card.className = 'notify-card';
    card.dataset.kind = kind;
    card.setAttribute('role', kind === 'penalty' || kind === 'disqualify' ? 'alert' : 'status');

    const icon = document.createElement('div');
    icon.className = 'notify-icon';
    icon.textContent = iconFor(kind);
    icon.setAttribute('aria-hidden', 'true');

    const body = document.createElement('div');
    body.className = 'notify-body';

    const title = document.createElement('div');
    title.className = 'notify-title';
    title.textContent = text;
    body.appendChild(title);

    if (subtitle) {
        const sub = document.createElement('div');
        sub.className = 'notify-subtitle';
        sub.textContent = subtitle;
        body.appendChild(sub);
    }

    card.appendChild(icon);
    card.appendChild(body);

    let progress: HTMLElement | null = null;
    if (durationMs > 0 && Number.isFinite(durationMs)) {
        progress = document.createElement('div');
        progress.className = 'notify-progress';
        card.appendChild(progress);
    }

    if (action) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'notify-action';
        btn.textContent = action.label;
        btn.onclick = (ev) => {
            ev.stopPropagation();
            try { action.onClick(); } catch { /* swallow — UI only */ }
        };
        card.appendChild(btn);
    }

    return { card, progress, body };
}

/**
 * Public surface. Same call signature as the previous local Notify module so
 * callers in Hud.ts (notify.show, notify.showDisqualify, notify.clear) continue
 * to work without modification.
 */
export const notify = {
    show(text: string, options: NotifyOptions = {}) {
        const kind: NotifyKind = options.kind ?? 'info';
        const durationMs = options.persist
            ? 0
            : Math.max(800, options.durationMs ?? (kind === 'exam' ? 5000 : kind === 'penalty' ? 2400 : 3500));

        const root = ensureRoot();
        const { card, progress } = buildCard(text, kind, options.subtitle, options.action, durationMs);
        root.appendChild(card);

        const entry: NotifyEntry = {
            el: card,
            progress: progress ?? undefined,
            kind,
            persist: !!options.persist,
            startedAt: performance.now(),
            durationMs,
            onDismiss: () => { /* no-op; hook reserved for analytics */ },
        };
        entries.push(entry);

        // Force a reflow so the entrance transition fires reliably.
        void card.offsetWidth;
        card.classList.add('notify-show');

        if (!options.persist && durationMs > 0) {
            entry.dismissTimer = window.setTimeout(() => dismiss(entry), durationMs);
        }
        return {
            dismiss: () => dismiss(entry, true),
            el: card,
        };
    },

    showDisqualify(score: number, reason: string, restart: () => void) {
        this.show(
            `Đình chỉ · ${score} điểm · ${reason}`,
            {
                kind: 'disqualify',
                persist: true,
                subtitle: 'Chạm "Thử lại" để bắt đầu lại bài sát hạch.',
                action: { label: 'Thử lại', onClick: restart },
            }
        );
    },

    clear() {
        for (const entry of entries.slice()) dismiss(entry, true);
    },
};

export type NotifyHandle = ReturnType<typeof notify.show>;

export default notify;
