/**
 * Lightweight toast/banner service used by the HUD. Renders short notices (toasts),
 * penalty flashes, and the final disqualified/success banner into a single DOM
 * container so it can be layered above the rest of the UI.
 */

export type NotifyKind = 'info' | 'exam' | 'penalty' | 'success' | 'disqualify' | 'warning';

export interface NotifyOptions {
    kind?: NotifyKind;
    durationMs?: number;
    persist?: boolean;
    action?: { label: string; onClick: () => void };
}

interface NotifyEntry {
    el: HTMLElement;
    kind: NotifyKind;
    timeout?: number;
    persist: boolean;
}

const container = document.createElement('div');
container.id = 'notify-stack';
container.style.cssText = `
    position: fixed; left: 50%; top: 12%; transform: translateX(-50%);
    display: flex; flex-direction: column; gap: 8px; z-index: 1000;
    pointer-events: none; font-family: inherit;
`;
document.body.appendChild(container);

const entries: NotifyEntry[] = [];

function colorFor(kind: NotifyKind) {
    switch (kind) {
        case 'exam': return { bg: '#0d2c4d', fg: '#dde9ff' };
        case 'penalty': return { bg: '#3a0d0d', fg: '#ffd9d9' };
        case 'success': return { bg: '#0d3a1c', fg: '#d9ffe3' };
        case 'disqualify': return { bg: '#3a0d2a', fg: '#ffd6f0' };
        default: return { bg: '#1a1f2b', fg: '#e8edf5' };
    }
}

function dismiss(entry: NotifyEntry) {
    const idx = entries.indexOf(entry);
    if (idx === -1) return;
    entries.splice(idx, 1);
    entry.el.style.opacity = '0';
    entry.el.style.transform = 'translateY(-12px)';
    setTimeout(() => entry.el.remove(), 250);
    if (entry.timeout) clearTimeout(entry.timeout);
}

export const notify = {
    show(text: string, options: NotifyOptions = {}) {
        const kind: NotifyKind = options.kind ?? 'info';
        const { bg, fg } = colorFor(kind);
        const el = document.createElement('div');
        el.textContent = text;
        el.style.cssText = `
            background: ${bg}; color: ${fg};
            padding: 10px 16px; border-radius: 6px; font-size: 16px; font-weight: 600;
            box-shadow: 0 6px 18px rgba(0,0,0,.35); opacity: 1; transition: all .25s ease;
            pointer-events: ${options.action ? 'auto' : 'none'}; max-width: 80vw;
            text-align: center;
        `;
        if (options.action) {
            const btn = document.createElement('button');
            btn.textContent = options.action.label;
            btn.style.cssText = 'margin-left:12px;padding:4px 10px;border:0;border-radius:4px;background:#ffffff20;color:inherit;cursor:pointer;';
            btn.onclick = (ev) => { ev.stopPropagation(); options.action!.onClick(); };
            el.appendChild(btn);
        }
        container.appendChild(el);
        const entry: NotifyEntry = { el, kind, persist: !!options.persist };
        entries.push(entry);
        if (!options.persist) {
            const dur = options.durationMs ?? (kind === 'exam' ? 5000 : 3500);
            entry.timeout = window.setTimeout(() => dismiss(entry), dur);
        }
        return { dismiss: () => dismiss(entry) };
    },
    showDisqualify(score: number, reason: string, restart: () => void) {
        this.show(`Đình chỉ · ${score} điểm · ${reason}`, {
            kind: 'disqualify',
            persist: true,
            action: { label: 'Thử lại', onClick: restart }
        });
    },
    clear() {
        for (const entry of entries.slice()) dismiss(entry);
    }
};
