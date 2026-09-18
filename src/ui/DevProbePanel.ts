import './dev-probe.css';

/**
 * Corner HUD panel that displays the last dev-probe sample (x, y, z).
 *
 * Lives directly under <body> with position: fixed so it never affects
 * layout. The element is created lazily on first show() and persists for
 * the lifetime of the page (matches the Notify singleton pattern).
 */
export class DevProbePanel {
    private el: HTMLDivElement | null = null;
    private rows: { x: HTMLElement; y: HTMLElement; z: HTMLElement } | null = null;

    show(x: number, y: number, z: number): void {
        if (!this.el) this.mount();
        if (!this.el || !this.rows) return;
        this.rows.x.textContent = format(x);
        this.rows.y.textContent = format(y);
        this.rows.z.textContent = format(z);
        this.el.style.display = 'block';
    }

    hide(): void {
        if (this.el) this.el.style.display = 'none';
    }

    private mount(): void {
        const root = document.createElement('div');
        root.id = 'dev-probe-panel';
        root.setAttribute('role', 'status');
        root.setAttribute('aria-label', 'Dev probe toạ độ');
        root.innerHTML = `
            <header>PROBE</header>
            <dl>
                <dt>X</dt><dd data-axis="x">—</dd>
                <dt>Y</dt><dd data-axis="y">—</dd>
                <dt>Z</dt><dd data-axis="z">—</dd>
            </dl>
            <footer>Đơn vị: m</footer>
        `;
        document.body.appendChild(root);
        this.el = root;
        this.rows = {
            x: root.querySelector<HTMLElement>('[data-axis="x"]')!,
            y: root.querySelector<HTMLElement>('[data-axis="y"]')!,
            z: root.querySelector<HTMLElement>('[data-axis="z"]')!,
        };
    }
}

function format(n: number): string {
    return n.toFixed(2);
}
