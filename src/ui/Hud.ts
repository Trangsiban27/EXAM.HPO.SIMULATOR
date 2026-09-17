import type { GameTelemetry } from '../game/types';
import './manual-controls.css';
import './cabin.css';
import './pedestrian-hud.css';
import { EngineAudio } from './EngineAudio';
import { notify, type NotifyKind, type NotifyOptions } from './Notify';
import { pedestrianHud } from './PedestrianHud';
import type { Exam02Pedestrian } from '../game/exercises/Exam02Pedestrian';

type Bindings = { onAnalog: (name: string, value: number) => void; onRestart: () => void; onCamera: () => void; onVirtual: (code: string, active: boolean) => void; onSignalChange: (state: { left: boolean; right: boolean; hazard: boolean }) => void; onSeatBelt: (fastened: boolean) => void };

export class Hud {
    private audio: EngineAudio;
    private restart = () => {};
    private lastGear = '';
    private lastExercise = '';
    private status = '';
    private finishedShown = false;
    private clutchDragging = false;
    private signalState = { left: false, right: false, hazard: false };
    private elements = new Map<string, HTMLElement>();
    constructor(private host: HTMLDivElement, private options: { develop?: boolean } = {}) {
        this.audio = new EngineAudio(host);
        if (options.develop) host.classList.add('develop-mode');
        this.host.innerHTML = `
            <header class="telemetry">
                ${options.develop ? '<section class="pill develop-pill">DEVELOP</section>' : ''}
                <section class="pill"><span class="mint icon">♢</span><strong id="score">100</strong><i></i><span class="mint">◴</span><b class="mint mono" id="time">00:00</b></section>
                <section class="pill exercise"><span class="blue">◎</span><b id="exercise">Xuất phát</b><small id="penalty">0 lỗi</small><span id="startLamp" class="start-lamp" title="Đèn lệnh xuất phát">GO</span></section>
                <section class="pill"><strong id="speed">0</strong><small class="blue">KM/H</small><i></i><span class="amber">ϟ</span><b class="amber" id="rpm">0</b><small class="amber">RPM</small><i></i><button id="engine" data-key="Enter" class="engine" aria-label="Bật hoặc tắt động cơ">ENGINE</button></section>
            </header>
            <details class="settings"><summary>⚙ &nbsp; CÀI ĐẶT & GÓC NHÌN</summary><div class="settings-body">
                <button id="cameraBtn">Đổi camera</button><button id="restartBtn">Thi lại</button>
                <p>Enter: bật/tắt máy<br>Shift: đạp côn · F: nhả nhanh · N/R/1–5: số<br>W/↑: ga · S/↓: phanh<br>A/D: lái · Space: thắng · C: camera${options.develop ? '<br>Develop: chuột phải kéo nhìn · WASD di chuyển · Q/E lên xuống · Shift nhanh' : ''}</p>
            </div></details>
            <div class="cockpit">
                <div class="clutch-column"><button id="quickCamera" class="camera-toggle" aria-label="Đổi camera">▣ <span id="camera">1</span></button>
                    <div class="pedal clutch"><b>CÔN</b><span class="clutch-scale"><input class="analog-clutch" type="range" min="0" max="1" step="0.01" value="1" aria-label="Mức nhả côn" aria-describedby="clutchHelp" data-analog="clutch"></span><small id="clutchHelp">Giữ <kbd>Shift</kbd> để đạp</small></div>
                </div>
                <div class="signal-cluster" role="group" aria-label="Xi nhan và đèn cảnh báo nguy hiểm">
                    <div class="signal-readout" aria-hidden="true">
                        <div class="signal-led signal-led-left"></div>
                        <div class="signal-led signal-led-hazard"></div>
                        <div class="signal-led signal-led-right"></div>
                    </div>
                    <button id="seatBelt" class="seat-belt" aria-label="Dây an toàn (phím B)" aria-pressed="false">DÂY B</button>
                    <div class="signal-stalks">
                        <button id="signalLeft" class="signal-stalk signal-stalk-left" data-signal="left" aria-label="Xi nhan trái (phím Q)" aria-pressed="false"><span class="signal-arrow">⟵</span><kbd>Q</kbd></button>
                        <button id="signalHazard" class="signal-stalk signal-stalk-hazard" data-signal="hazard" aria-label="Cảnh báo nguy hiểm (phím H)" aria-pressed="false"><span class="signal-tri">△</span><kbd>H</kbd></button>
                        <button id="signalRight" class="signal-stalk signal-stalk-right" data-signal="right" aria-label="Xi nhan phải (phím E)" aria-pressed="false"><span class="signal-arrow">⟶</span><kbd>E</kbd></button>
                    </div>
                </div>
                <div class="wheel-control"><div id="wheel" class="steering-wheel" role="slider" tabindex="0" aria-label="Vô lăng — kéo để lái, phím trái phải để điều chỉnh" aria-valuemin="-540" aria-valuemax="540" aria-valuenow="0"><svg id="wheelFace" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="99" fill="none" stroke="#111820" stroke-width="27"/><circle cx="120" cy="120" r="99" fill="none" stroke="#87909c" stroke-width="2"/><path d="M29 95 L99 107 L105 133 L39 132 M211 95 L141 107 L135 133 L201 132 M107 137 L103 214 L137 214 L133 137" fill="#47515f" stroke="#a2aab6" stroke-width="2"/><circle cx="120" cy="120" r="34" fill="#202b38" stroke="#697786" stroke-width="2"/><path d="M112 120h16" stroke="#a7bccd" stroke-width="3"/><path d="M120 12v18" stroke="#edc864" stroke-width="6"/></svg></div><small id="steering">0°</small></div>
                <div class="drive-column"><details class="gear-selector"><summary><span id="gear">N</span> ⌃</summary><div class="gear-options">${[['KeyR','R'],['KeyN','N'],...Array.from({length:5},(_,i)=>['Digit'+(i+1),String(i+1)])].map(([code,label])=>`<button data-key="${code}" aria-label="Chọn số ${label}">${label}</button>`).join('')}<small>Giữ côn để sang số</small></div></details>
                    <label class="fine-gas">Chỉnh mức ga <input type="range" min="0" max="1" step="0.01" value="0" data-analog="gas" aria-label="Mức ga"></label><div class="pedals"><button data-key="ArrowDown" class="pedal brake" aria-label="Giữ để phanh"><b>PHANH</b><span class="pedal-meter"><span id="brakeFill"></span></span><small id="brakeValue">0%</small><kbd>S / ↓</kbd></button><button data-key="ArrowUp" class="pedal gas" aria-label="Giữ để đạp ga"><b>⌃ GA</b><span class="pedal-meter gas-meter"><span id="gasFill"></span></span><small id="gasValue">Nhả ga</small><kbd>W / ↑</kbd></button></div>
                </div>
            </div>`;
        this.host.querySelectorAll<HTMLElement>('[id]').forEach(el => this.elements.set(el.id, el));
    }
    private el(id: string) { return this.elements.get(id)!; }
    bind(b: Bindings) {
        this.restart = b.onRestart;
        const wheel = this.el('wheel');
        let pointer: number | null = null;
        let lastAngle = 0;
        let turn = 0;
        const angle = (e: PointerEvent) => {
            const rect = wheel.getBoundingClientRect();
            return Math.atan2(e.clientY - rect.top - rect.height / 2, e.clientX - rect.left - rect.width / 2);
        };
        const steer = () => { b.onAnalog('steeringActive', 1); b.onAnalog('steering', .5 + turn / (Math.PI * 6)); };
        const releaseWheel = () => { pointer = null; b.onAnalog('steeringActive', 0); };
        wheel.addEventListener('pointerdown', e => {
            if (pointer !== null) return;
            e.preventDefault(); pointer = e.pointerId; lastAngle = angle(e);
            turn = Number(wheel.getAttribute('aria-valuenow')) * Math.PI / 180;
            steer();
            wheel.setPointerCapture(e.pointerId);
        });
        wheel.addEventListener('pointermove', e => {
            if (pointer !== e.pointerId) return;
            const next = angle(e);
            const delta = Math.atan2(Math.sin(next - lastAngle), Math.cos(next - lastAngle));
            turn = Math.max(-3 * Math.PI, Math.min(3 * Math.PI, turn + delta)); lastAngle = next; steer();
        });
        wheel.addEventListener('pointerup', e => { if (pointer === e.pointerId) releaseWheel(); });
        wheel.addEventListener('pointercancel', releaseWheel);
        wheel.addEventListener('lostpointercapture', releaseWheel);
        wheel.addEventListener('keydown', e => {
            if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(e.code)) return;
            e.preventDefault(); turn = e.code === 'Home' ? 0 : Math.max(-3 * Math.PI, Math.min(3 * Math.PI, turn + (e.code === 'ArrowLeft' ? -.2 : .2)));
            steer();
        });
        wheel.addEventListener('keyup', releaseWheel);
        wheel.addEventListener('blur', releaseWheel);
        window.addEventListener('blur', releaseWheel);
        this.host.querySelectorAll<HTMLInputElement>('[data-analog]').forEach(el => {
            el.addEventListener('input', () => b.onAnalog(el.dataset.analog!, el.dataset.analog === 'clutch' ? 1 - Number(el.value) : Number(el.value)));
            if (el.dataset.analog === 'clutch') {
                const release = () => {
                    this.clutchDragging = false;
                    b.onAnalog('clutch', 0);
                };
                el.addEventListener('pointerdown', e => {
                    this.clutchDragging = true;
                    el.setPointerCapture(e.pointerId);
                });
                el.addEventListener('pointerup', release);
                el.addEventListener('pointercancel', release);
                el.addEventListener('lostpointercapture', release);
                el.addEventListener('keydown', () => { this.clutchDragging = true; });
                el.addEventListener('keyup', release);
                el.addEventListener('blur', release);
                window.addEventListener('blur', release);
            }
            window.addEventListener('blur', () => { el.value = el.dataset.analog === 'clutch' ? '1' : '0'; b.onAnalog(el.dataset.analog!, 0); });
        });
        this.el('restartBtn').addEventListener('click', b.onRestart);
        this.el('cameraBtn').addEventListener('click', b.onCamera);
        this.el('quickCamera').addEventListener('click', b.onCamera);
        this.host.querySelectorAll<HTMLButtonElement>('[data-key]').forEach(btn => {
            const code = btn.dataset.key!;
            const release = () => { b.onVirtual(code, false); btn.classList.remove('pressed'); };
            btn.addEventListener('pointerdown', e => {
                e.preventDefault(); btn.setPointerCapture(e.pointerId);
                b.onVirtual(code, true); btn.classList.add('pressed');
            });
            btn.addEventListener('pointerup', release);
            btn.addEventListener('pointercancel', release);
            btn.addEventListener('lostpointercapture', release);
            btn.addEventListener('keydown', e => {
                if (e.code === 'Space') { e.preventDefault(); b.onVirtual(code, true); btn.classList.add('pressed'); }
            });
            btn.addEventListener('keyup', e => { if (e.code === 'Space') { e.preventDefault(); release(); } });
            btn.addEventListener('blur', release);
            window.addEventListener('blur', release);
        });

        // Signal stalk buttons (Q/E/H). Clicking toggles the same state the
        // keyboard shortcut would produce.
        const signalKeys: Record<string, 'left' | 'right' | 'hazard'> = {
            KeyQ: 'left', KeyE: 'right', KeyH: 'hazard',
        };
        const applySignal = (next: typeof this.signalState) => {
            this.signalState = next;
            this.el('signalLeft').classList.toggle('active', next.left);
            this.el('signalLeft').setAttribute('aria-pressed', String(next.left));
            this.el('signalRight').classList.toggle('active', next.right);
            this.el('signalRight').setAttribute('aria-pressed', String(next.right));
            this.el('signalHazard').classList.toggle('active', next.hazard);
            this.el('signalHazard').setAttribute('aria-pressed', String(next.hazard));
            b.onSignalChange({ ...next });
        };
        const toggleSignal = (side: 'left' | 'right' | 'hazard') => {
            const next = { ...this.signalState };
            if (side === 'hazard') {
                // Hazard overrides everything; pressing again turns it off.
                next.hazard = !next.hazard;
                if (next.hazard) { next.left = false; next.right = false; }
            } else {
                // Selecting a turn signal disables hazard and the opposite side.
                next.hazard = false;
                if (side === 'left') {
                    next.left = !next.left;
                    if (next.left) next.right = false;
                } else {
                    next.right = !next.right;
                    if (next.right) next.left = false;
                }
            }
            applySignal(next);
        };
        this.host.querySelectorAll<HTMLButtonElement>('[data-signal]').forEach(btn => {
            const side = btn.dataset.signal as 'left' | 'right' | 'hazard';
            btn.addEventListener('click', e => { e.preventDefault(); toggleSignal(side); });
        });
        const applySeatBelt = (fastened: boolean) => {
            this.el('seatBelt').classList.toggle('active', fastened);
            this.el('seatBelt').setAttribute('aria-pressed', String(fastened));
            b.onSeatBelt(fastened);
        };
        this.el('seatBelt').addEventListener('click', e => {
            e.preventDefault();
            applySeatBelt(this.el('seatBelt').getAttribute('aria-pressed') !== 'true');
        });
        window.addEventListener('keydown', e => {
            if (e.repeat) return;
            const side = signalKeys[e.code];
            if (!side) return;
            // Only swallow the key when our own UI isn't focused on a text input.
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
            e.preventDefault();
            toggleSignal(side);
        });
        window.addEventListener('keydown', e => {
            if (e.repeat || e.code !== 'KeyB') return;
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
            e.preventDefault();
            applySeatBelt(this.el('seatBelt').getAttribute('aria-pressed') !== 'true');
        });
    }
    update(t: GameTelemetry, finished: boolean) {
        this.audio.update(t.rpm);
        this.el('gasFill').style.height = (t.gasPedal * 100) + '%';
        this.el('brakeFill').style.height = (t.brakePedal * 100) + '%';
        this.el('gasValue').textContent = t.gasPedal < .001 ? 'Nhả ga' : t.gasPedal <= 1/3 ? 'Ga nhẹ' : t.gasPedal <= 2/3 ? 'Ga vừa' : 'Ga mạnh';
        this.el('brakeValue').textContent = Math.round(t.brakePedal * 100) + '%';
        const warnings = t.gearWarnings;
        const feedbackText = warnings.includes('RECOMMEND_SHIFT_DOWN')
            ? 'Số cao, tốc độ thấp — nên về số ' + Math.max(1, t.gear - 1)
            : warnings.includes('RECOMMEND_SHIFT_UP') ? 'Nên chuyển số ' + (t.gear + 1)
            : warnings.includes('LOW_GEAR_HIGH_SPEED') ? 'Vòng tua cao — giảm ga' : '';
        if (feedbackText && feedbackText !== this.lastGear) this.flash(feedbackText, 'warning');
        this.lastGear = feedbackText;

        this.el('speed').textContent = String(Math.round(t.speedKmh));
        this.el('score').textContent = String(t.score);
        this.el('time').textContent = `${Math.floor(t.elapsed / 60).toString().padStart(2,'0')}:${Math.floor(t.elapsed % 60).toString().padStart(2,'0')}`;
        this.el('exercise').textContent = t.currentExercise;
        const examName = t.currentExercise.split(' · ')[0];
        if (examName && examName !== this.lastExercise) {
            this.lastExercise = examName;
            if (examName !== 'Chuẩn bị') this.flash(`Vào bài: ${examName}`, 'exam');
        }
        this.el('penalty').textContent = `${t.penalties.length} lỗi`;
        this.el('rpm').textContent = String(t.rpm);
        this.el('engine').classList.toggle('running', t.rpm > 0);
        this.el('engine').setAttribute('aria-pressed', String(t.rpm > 0));
        this.el('engine').title = t.engineStatus + ' · Enter';
        this.el('gear').textContent = t.gear === 0 ? 'N' : t.gear === -1 ? 'R' : String(t.gear);
        if (!this.clutchDragging) {
            this.host.querySelector<HTMLInputElement>('[data-analog="clutch"]')!.value = String(1 - t.clutch);
        }
        this.el('steering').textContent = `${Math.round(t.steering)}°`;
        this.el('wheelFace').style.transform = `rotate(${t.steeringWheelAngle}deg)`;
        this.el('wheel').setAttribute('aria-valuenow', String(Math.round(t.steeringWheelAngle)));
        this.el('camera').textContent = this.options.develop ? 'Dev' : t.cameraMode === 2 ? 'Cabin' : String(t.cameraMode + 1);
        this.el('cameraBtn').textContent = this.options.develop ? 'Camera tự do' : 'Đổi camera · ' + ['Chéo', 'Trên cao', 'Cabin'][t.cameraMode];
        const signals = t.signals ?? { left: false, right: false, hazard: false };
        this.host.querySelector('.signal-led-left')!.classList.toggle('led-on', signals.left);
        this.host.querySelector('.signal-led-right')!.classList.toggle('led-on', signals.right);
        this.host.querySelector('.signal-led-hazard')!.classList.toggle('led-on', signals.hazard);
        this.el('seatBelt').classList.toggle('active', t.seatBelt);
        this.el('seatBelt').setAttribute('aria-pressed', String(t.seatBelt));
        this.el('startLamp').classList.toggle('on', t.startLamp);
        if (this.status !== t.engineStatus) { this.status = t.engineStatus; this.flash(t.engineStatus, 'info'); }
        if (finished) {
            if (!this.finishedShown) {
                this.finishedShown = true;
                if (t.disqualified) {
                    notify.showDisqualify(t.score, t.disqualifyReason || 'Đình chỉ sát hạch', this.restart);
                } else {
                    this.flash(`Hoàn thành · ${t.score} điểm`, { kind: 'success', persist: true });
                }
            }
        } else {
            this.finishedShown = false;
        }
    }
    flash(text: string, kind: NotifyKind | NotifyOptions = 'info') {
        notify.show(text, typeof kind === 'string' ? { kind } : kind);
    }
    /**
     * Cập nhật widget bài 2 — chỉ hiển thị khi visible=true.
     * DrivingGame gọi mỗi frame với dữ liệu từ Exam02Pedestrian và front bumper.
     */
    updatePedestrianHud(exercise: Exam02Pedestrian | undefined, frontX: number | null, visible: boolean) {
        pedestrianHud.update(this.host, exercise, frontX, visible);
    }
    clearNotices() {
        this.finishedShown = false;
        this.lastGear = '';
        this.lastExercise = '';
        this.status = '';
        notify.clear();
    }
}
