import type { GameTelemetry } from '../game/types';
import './manual-controls.css';
import './cabin.css';
import './pedestrian-hud.css';
import { EngineAudio } from './EngineAudio';
import { notify, type NotifyKind, type NotifyOptions } from './Notify';
import { pedestrianHud } from './PedestrianHud';
import type { Exam02Pedestrian } from '../game/exercises/Exam02Pedestrian';
import type { ExamScoringMode } from '../game/exam/examScoringMode';
import type { AutoDriveLesson } from '../game/autoDrive/autoDriveLessons';
import './auto-drive.css';

type Bindings = { onAnalog: (name: string, value: number) => void; onRestart: () => void; onCamera: () => void; onVirtual: (code: string, active: boolean) => void; onSignalChange: (state: { left: boolean; right: boolean; hazard: boolean }) => void; onSeatBelt: (fastened: boolean) => void; onAutoDriveToggle: () => void; onWaypointRecordingStart: () => void; onWaypointRecordingFinish: () => string };

export class Hud {
    private audio: EngineAudio;
    private restart = () => {};
    private lastGear = '';
    private lastExercise = '';
    private status = '';
    private finishedShown = false;
    private clutchDragging = false;
    private autoLessonContinue?: () => void;
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
                <button id="cameraBtn">Đổi camera</button><button id="restartBtn">Thi lại</button><button id="autoDriveBtn" aria-pressed="false">Bật tự chạy</button>
                <p>Enter: bật/tắt máy<br>Shift: đạp côn · F: nhả nhanh · N/R/1–5: số<br>W/↑: ga · S/↓: phanh<br>A/D: lái · Space: thắng · C: camera${options.develop ? '<br>Develop: chuột phải kéo nhìn · WASD di chuyển · Q/E lên xuống · Shift nhanh · P probe toạ độ · K lưu camera · Shift+K xoá camera đã lưu' : ''}</p>
            </div></details>
            <div class="cockpit">
                <div class="clutch-column"><button id="quickCamera" class="camera-toggle" aria-label="Đổi camera">▣ <span id="camera">1</span></button>
                    <div class="pedal clutch"><b>CÔN</b><span class="clutch-scale"><input class="analog-clutch" type="range" min="0" max="1" step="0.01" value="0" aria-label="Mức đạp côn" aria-describedby="clutchHelp" data-analog="clutch"></span><small id="clutchHelp">Giữ <kbd>Shift</kbd> để đạp</small></div>
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
            </div>
            <section id="autoLesson" class="auto-quiz" role="dialog" aria-modal="true" aria-labelledby="autoLessonTitle" hidden>
                <div class="auto-quiz-card auto-lesson-card">
                    <div class="auto-quiz-eyebrow">HƯỚNG DẪN BÀI SÁT HẠCH</div>
                    <h2 id="autoLessonTitle"></h2>
                    <ol id="autoLessonSteps" class="auto-lesson-steps"></ol>
                    <button id="autoLessonContinue" class="auto-quiz-choice auto-lesson-continue" type="button">Đã đọc, tiếp tục</button>
                    <button id="autoLessonStop" class="auto-quiz-stop" type="button">Dừng xe tự chạy</button>
                </div>
            </section>
            <section id="waypointPrompt" class="auto-quiz" role="dialog" aria-modal="true" aria-labelledby="waypointTitle" hidden>
                <div class="auto-quiz-card waypoint-card">
                    <div class="auto-quiz-eyebrow">GHI TUYẾN WAYPOINT</div>
                    <h2 id="waypointTitle">Xe đã dừng ở cuối cầu</h2>
                    <p id="waypointInstructions">Bật máy (Enter), vào số 1 hoặc R, giữ Shift để đạp côn; dùng W/↑ để ga, A/D để lái và S/↓ để phanh. Khi đỗ đúng vị trí, lưu tuyến.</p>
                    <textarea id="waypointRouteOutput" aria-label="Danh sách waypoint đã ghi" readonly hidden></textarea>
                    <div class="waypoint-actions">
                        <button id="waypointRecordStart" class="auto-quiz-choice" type="button">Bắt đầu ghi tuyến</button>
                        <button id="waypointCopy" class="auto-quiz-choice" type="button" hidden>Sao chép waypoint</button>
                        <button id="waypointDone" class="auto-quiz-stop" type="button" hidden>Đóng</button>
                    </div>
                </div>
            </section>
            <aside id="waypointRecordingBadge" class="waypoint-recording-badge" hidden>
                <span>ĐANG GHI WAYPOINT · <b id="waypointCount">0</b></span>
                <button id="waypointRecordFinish" type="button">Lưu tuyến</button>
            </aside>`;
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
            el.addEventListener('input', () => b.onAnalog(el.dataset.analog!, Number(el.value)));
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
            window.addEventListener('blur', () => { el.value = '0'; b.onAnalog(el.dataset.analog!, 0); });
        });
        this.el('restartBtn').addEventListener('click', b.onRestart);
        this.el('autoDriveBtn').addEventListener('click', b.onAutoDriveToggle);
        this.el('autoLessonContinue').addEventListener('click', () => this.autoLessonContinue?.());
        this.el('autoLessonStop').addEventListener('click', b.onAutoDriveToggle);
        this.el('waypointRecordStart').addEventListener('click', () => {
            b.onWaypointRecordingStart();
            this.host.classList.add('waypoint-recording-active');
            this.el('waypointPrompt').setAttribute('hidden', '');
            this.el('waypointRecordingBadge').removeAttribute('hidden');
        });
        this.el('waypointRecordFinish').addEventListener('click', () => {
            this.showWaypointRecordingResult(b.onWaypointRecordingFinish());
        });
        this.el('waypointCopy').addEventListener('click', () => {
            const output = this.el('waypointRouteOutput') as HTMLTextAreaElement;
            output.focus();
            output.select();
            void navigator.clipboard?.writeText(output.value).then(
                () => this.flash('Đã sao chép waypoint', 'success'),
                () => this.flash('Đã chọn waypoint — nhấn Ctrl+C để sao chép', 'info'),
            );
        });
        this.el('waypointDone').addEventListener('click', () => this.el('waypointPrompt').setAttribute('hidden', ''));
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

    setAutoDriveMode(enabled: boolean) {
        const button = this.el('autoDriveBtn') as HTMLButtonElement;
        button.textContent = enabled ? 'Tắt tự chạy' : 'Bật tự chạy';
        button.setAttribute('aria-pressed', String(enabled));
        button.classList.toggle('active', enabled);
        this.host.classList.toggle('auto-drive-active', enabled);
        if (!enabled) {
            this.host.classList.remove('waypoint-recording-active');
            this.showAutoDriveLesson(null, () => {});
            this.el('waypointPrompt').setAttribute('hidden', '');
            this.el('waypointRecordingBadge').setAttribute('hidden', '');
        }
    }

    showWaypointStopPrompt(_kind: 'bridge' = 'bridge'): void {
        this.el('autoLesson').setAttribute('hidden', '');
        this.el('waypointTitle').textContent = 'Xe đã dừng ở cuối cầu';
        this.el('waypointInstructions').textContent = 'Bấm “Bắt đầu ghi tuyến”, tự lái liên tục từ cuối cầu qua bài 4 đến gần bài 5 rồi bấm “Lưu tuyến”. Vị trí và hướng xe được ghi mỗi 0,4 m. Điều khiển bằng Enter, số 1/R, Shift, W/↑, A/D và S/↓.';
        (this.el('waypointRouteOutput') as HTMLTextAreaElement).value = '';
        this.el('waypointRouteOutput').setAttribute('hidden', '');
        this.el('waypointRecordStart').removeAttribute('hidden');
        this.el('waypointCopy').setAttribute('hidden', '');
        this.el('waypointDone').setAttribute('hidden', '');
        this.el('waypointPrompt').removeAttribute('hidden');
    }

    setWaypointRecordingCount(count: number): void {
        this.el('waypointCount').textContent = String(count);
    }

    private showWaypointRecordingResult(route: string): void {
        this.host.classList.remove('waypoint-recording-active');
        this.el('waypointRecordingBadge').setAttribute('hidden', '');
        this.el('waypointInstructions').textContent = 'Đã ghi một tuyến liên tục. Sao chép đoạn mã bên dưới và thêm vào autoDriveRoutes.ts để xe tự chạy theo tuyến mới.';
        const output = this.el('waypointRouteOutput') as HTMLTextAreaElement;
        output.value = route;
        output.removeAttribute('hidden');
        this.el('waypointRecordStart').setAttribute('hidden', '');
        this.el('waypointCopy').removeAttribute('hidden');
        this.el('waypointDone').removeAttribute('hidden');
        this.el('waypointPrompt').removeAttribute('hidden');
    }

    showAutoDriveLesson(lesson: AutoDriveLesson | null, onContinue: () => void) {
        const panel = this.el('autoLesson');
        this.autoLessonContinue = lesson ? onContinue : undefined;
        panel.toggleAttribute('hidden', !lesson);
        if (!lesson) return;

        this.el('autoLessonTitle').textContent = lesson.name;
        const steps = this.el('autoLessonSteps');
        steps.replaceChildren();
        for (const step of lesson.steps) {
            const item = document.createElement('li');
            if (typeof step === 'string') {
                item.textContent = step;
            } else {
                const title = document.createElement('strong');
                title.textContent = step.title;
                const details = document.createElement('ul');
                for (const detail of step.details) {
                    const detailItem = document.createElement('li');
                    detailItem.textContent = detail;
                    details.append(detailItem);
                }
                item.append(title, details);
            }
            steps.append(item);
        }
        const continueButton = this.el('autoLessonContinue') as HTMLButtonElement;
        continueButton.textContent = lesson.id === 5 ? 'Hoàn thành' : 'Đã đọc, tiếp tục';
        continueButton.focus();
    }

    update(t: GameTelemetry, finished: boolean, scoringMode: ExamScoringMode = 'normal') {
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
            if (scoringMode === 'normal' && examName !== 'Chuẩn bị') this.flash(`Vào bài: ${examName}`, 'exam');
        }
        this.el('penalty').textContent = `${t.penalties.length} lỗi`;
        this.el('rpm').textContent = String(t.rpm);
        this.el('engine').classList.toggle('running', t.rpm > 0);
        this.el('engine').setAttribute('aria-pressed', String(t.rpm > 0));
        this.el('engine').title = t.engineStatus + ' · Enter';
        this.el('gear').textContent = t.gear === 0 ? 'N' : t.gear === -1 ? 'R' : String(t.gear);
        if (!this.clutchDragging) {
            this.host.querySelector<HTMLInputElement>('[data-analog="clutch"]')!.value = String(t.clutch);
        }
        this.el('steering').textContent = `${Math.round(t.steering)}°`;
        this.el('wheelFace').style.transform = `rotate(${t.steeringWheelAngle}deg)`;
        this.el('wheel').setAttribute('aria-valuenow', String(Math.round(t.steeringWheelAngle)));
        this.el('camera').textContent = this.options.develop ? 'Dev' : t.cameraMode === 2 ? 'Cabin' : String(t.cameraMode + 1);
        this.el('cameraBtn').textContent = this.options.develop ? 'Camera tự do' : 'Đổi camera · ' + ['Chéo', 'Trên cao', 'Cabin'][t.cameraMode];
        const signals = t.signals ?? { left: false, right: false, hazard: false };
        if (this.signalState.left !== signals.left || this.signalState.right !== signals.right
            || this.signalState.hazard !== signals.hazard) {
            this.signalState = { ...signals };
            for (const side of ['left', 'right', 'hazard'] as const) {
                const button = this.el(`signal${side[0].toUpperCase()}${side.slice(1)}`);
                button.classList.toggle('active', signals[side]);
                button.setAttribute('aria-pressed', String(signals[side]));
            }
        }
        this.host.querySelector('.signal-led-left')!.classList.toggle('led-on', signals.left);
        this.host.querySelector('.signal-led-right')!.classList.toggle('led-on', signals.right);
        this.host.querySelector('.signal-led-hazard')!.classList.toggle('led-on', signals.hazard);
        this.el('seatBelt').classList.toggle('active', t.seatBelt);
        this.el('seatBelt').setAttribute('aria-pressed', String(t.seatBelt));
        this.el('startLamp').classList.toggle('on', t.startLamp);
        if (this.status !== t.engineStatus) { this.status = t.engineStatus; this.flash(t.engineStatus, 'info'); }
        if (finished && scoringMode === 'normal') {
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
