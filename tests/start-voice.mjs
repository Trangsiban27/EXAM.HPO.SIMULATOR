import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({
    stdin: {
        contents: `export { StartApproachVoice } from './src/ui/StartApproachVoice';
            export { ExamEngine } from './src/game/ExamEngine';
            export { startPosition, startWaitingLine, FRONT_PROBE_OFFSET_M } from './src/game/startPosition';
            export { Vector3 } from 'three';`,
        resolveDir: process.cwd(),
    },
    bundle: true, write: false, platform: 'node', format: 'cjs',
});
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { StartApproachVoice, ExamEngine, startPosition, startWaitingLine, FRONT_PROBE_OFFSET_M, Vector3 } = module.exports;
const waitingDistanceM = startPosition.lineX - (startWaitingLine.x - startWaitingLine.thicknessM / 2);

let now = 1000;
let timerId = 0;
const timers = new Map();
const originalPerformance = Object.getOwnPropertyDescriptor(globalThis, 'performance');
const originalSetTimeout = globalThis.setTimeout;
const originalClearTimeout = globalThis.clearTimeout;
const originalAudio = globalThis.Audio;
const originalWindow = globalThis.window;
Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });
globalThis.setTimeout = (callback, ms) => {
    timers.set(++timerId, { at: now + ms, callback });
    return timerId;
};
globalThis.clearTimeout = id => timers.delete(id);
globalThis.window = new EventTarget();
let audio = [];
let blockNext = false;
globalThis.Audio = class {
    onended = null;
    onerror = null;
    paused = false;
    plays = 0;
    constructor(src) { this.src = src; audio.push(this); }
    play() {
        this.plays++;
        if (blockNext) {
            blockNext = false;
            return Promise.reject(new DOMException('Gesture required', 'NotAllowedError'));
        }
        return Promise.resolve();
    }
    pause() { this.paused = true; }
};
const advance = ms => {
    now += ms;
    for (const [id, timer] of [...timers]) {
        if (timer.at <= now) {
            timers.delete(id);
            timer.callback();
        }
    }
};
const latest = file => assert.ok(audio.at(-1)?.src.endsWith(file), `Expected ${file}, got ${audio.at(-1)?.src}`);
const endClip = () => audio.at(-1).onended?.();
const count = file => audio.filter(clip => clip.src.endsWith(file)).length;
function attempt(mode = 'normal') {
    timers.clear();
    audio = [];
    const exam = new ExamEngine(mode);
    const voice = new StartApproachVoice({
        onInstructionsEnded: () => exam.startExercise.instructionsEnded(),
        onStartAnnouncement: () => exam.startExercise.beginStartAnnouncement(),
        onStartEnded: () => exam.completeStartAnnouncement(),
    });
    const tick = (distance = .5, overrides = {}) => {
        const frontPosition = new Vector3(startPosition.lineX - distance, 0,
            startPosition.lineZ + startPosition.laneOffset);
        const before = exam.penalties.length;
        if (!exam.isFinished) voice.update(frontPosition, overrides.leftSignal ?? false);
        exam.update({
            frontPosition,
            position: frontPosition.clone().add(new Vector3(-FRONT_PROBE_OFFSET_M, 0, 0)),
            speedKmh: 0, rpm: 800, engineRunning: true, stalled: false,
            leftSignal: false, seatBeltFastened: true, ...overrides,
        }, 'idle', .016);
        voice.reportEvents(exam.penalties.slice(before), exam.disqualifyReason, exam.isFinished);
    };
    const reachInstructions = () => {
        tick(15); tick(waitingDistanceM);
        latest('mungbandenvoibaithisathach.mp3');
        endClip(); latest('choxevaovitrixuatphat.mp3');
    };
    const signalForFiveSeconds = () => {
        tick(.5, { leftSignal: true });
        advance(5000);
        tick(.5, { leftSignal: true });
    };
    const authorize = () => {
        reachInstructions(); endClip(); signalForFiveSeconds(); endClip();
        assert.equal(exam.startExercise.state, 'COMMAND_RECEIVED');
    };
    return { exam, voice, tick, reachInstructions, authorize, signalForFiveSeconds };
}

try {
    // Long instructions and a long command recording cannot start scoring early.
    const timed = attempt();
    timed.tick(15, { rpm: 6000, stalled: true, speedKmh: 40 });
    assert.equal(timed.exam.disqualifyForRedWhiteCurb(), false);
    assert.equal(timed.exam.applyLinePenalty(0, now), null);
    timed.tick(waitingDistanceM + .01);
    assert.equal(audio.length, 0, 'Welcome must wait for contact with the yellow line');
    timed.tick(waitingDistanceM); endClip();
    advance(30000); timed.tick(.5, { rpm: 6000, stalled: true });
    assert.equal(timed.exam.score, 100);
    assert.equal(timed.exam.elapsedSeconds, 0);
    endClip();
    advance(60000); timed.tick(); assert.equal(count('batdauthi.mp3'), 0, 'Instructions alone must not start the exam');
    timed.tick(.5, { leftSignal: true });
    advance(4999); timed.tick(.5, { leftSignal: true }); assert.equal(count('batdauthi.mp3'), 0);
    advance(1); timed.tick(.5, { leftSignal: true }); latest('batdauthi.mp3');
    assert.equal(timed.exam.startExercise.state, 'START_ANNOUNCEMENT');
    advance(30000); timed.tick();
    assert.equal(timed.exam.score, 100);
    assert.equal(timed.exam.elapsedSeconds, 0);
    assert.equal(timed.exam.startLampOn, false);
    endClip();
    assert.equal(timed.exam.elapsedSeconds, 0);
    assert.equal(timed.exam.startLampOn, true);
    advance(19999); timed.tick(); assert.equal(timed.exam.score, 100);
    advance(1); timed.tick(); assert.equal(timed.exam.score, 95);
    latest('qua20giaykhongxuatphat_tru5diem.mp3');
    timed.tick(); assert.equal(count('qua20giaykhongxuatphat_tru5diem.mp3'), 1);
    endClip(); advance(10000); timed.tick();
    assert.equal(timed.exam.disqualified, true);
    latest('qua30giaykhongxuatphat_biloai.mp3');
    timed.tick(); assert.equal(audio.at(-1).paused, false, 'A later frame must not cancel the failure voice');
    assert.equal(count('qua30giaykhongxuatphat_biloai.mp3'), 1);
    timed.voice.reset();

    // Missing signal is still scored at the line, and voice messages queue in order.
    const signals = attempt(); signals.authorize(); signals.tick(.5);
    assert.equal(signals.exam.score, 100, 'Waiting without a signal is not a crossing penalty');
    signals.tick(-.1); assert.equal(signals.exam.score, 95);
    latest('khongbatxinhan_tru5diem.mp3');
    signals.tick(-1, { leftSignal: true });
    signals.tick(-5.1, { leftSignal: true });
    signals.tick(-5.2, { leftSignal: true });
    endClip(); latest('khongtatxinhansau5met_tru5diem.mp3');
    assert.equal(count('khongtatxinhansau5met_tru5diem.mp3'), 1);
    signals.voice.reset();
    const correct = attempt(); correct.authorize();
    correct.tick(-.1, { leftSignal: true }); correct.tick(-1, { leftSignal: true });
    correct.tick(-5.1, { leftSignal: false });
    assert.equal(correct.exam.score, 100);
    assert.equal(correct.exam.activeIndex, 1);
    correct.voice.reset();

    // Early crossings fail during the approach, waiting period, and command voice.
    for (const phase of ['approach', 'countdown', 'announcement']) {
        const early = attempt(); early.tick(15);
        if (phase !== 'approach') {
            early.reachInstructions(); endClip();
            if (phase === 'announcement') early.signalForFiveSeconds();
        }
        const oldEnd = audio.at(-1)?.onended;
        early.tick(-.1);
        assert.equal(early.exam.disqualified, true, phase);
        assert.equal(early.exam.score, 100);
        latest('xuatphatxekhichuacohieulenh_biloai.mp3');
        oldEnd?.(); advance(60000); early.tick(-.2);
        assert.equal(early.exam.elapsedSeconds, 0);
        assert.equal(early.exam.startLampOn, false);
        assert.equal(count('xuatphatxekhichuacohieulenh_biloai.mp3'), 1);
        assert.equal(audio.at(-1).paused, false);
        early.voice.reset();
    }

    // Reset cancels queued commands and stale callbacks from the previous attempt.
    const reset = attempt(); reset.reachInstructions();
    const oldEnd = audio.at(-1).onended;
    endClip(); reset.voice.reset(); reset.exam.reset(); oldEnd(); advance(60000);
    assert.equal(count('batdauthi.mp3'), 0);
    assert.equal(reset.exam.startExercise.state, 'PRE_START');
    reset.authorize(); reset.voice.reset();

    // An autoplay rejection or load error cannot authorize an exam.
    const blocked = attempt(); blocked.reachInstructions(); endClip();
    blockNext = true; blocked.signalForFiveSeconds(); await Promise.resolve();
    assert.equal(blocked.exam.elapsedSeconds, 0);
    window.dispatchEvent(new Event('keydown'));
    assert.equal(audio.at(-1).plays, 2);
    audio.at(-1).onerror(); advance(60000); blocked.tick();
    assert.equal(blocked.exam.startExercise.state, 'START_ANNOUNCEMENT');
    assert.equal(blocked.exam.score, 100);
    endClip(); assert.equal(blocked.exam.startLampOn, true);
    blocked.voice.reset();

    // Errors-only mode still logs early departure and waits for the recorded command.
    const practice = attempt('errors-only'); practice.reachInstructions(); practice.tick(-.1);
    assert.equal(practice.exam.isFinished, false);
    assert.equal(practice.exam.elapsedSeconds, 0);
    endClip(); endClip(); practice.signalForFiveSeconds(); latest('batdauthi.mp3'); endClip();
    advance(1000); assert.equal(practice.exam.elapsedSeconds, 1);
    practice.voice.reset();
    // Switching the indicator off restarts the full five-second wait.
    const interrupted = attempt(); interrupted.reachInstructions(); endClip();
    interrupted.tick(.5, { leftSignal: true }); advance(4000); interrupted.tick();
    advance(60000); interrupted.tick(); assert.equal(count('batdauthi.mp3'), 0);
    interrupted.tick(.5, { leftSignal: true }); advance(4999);
    interrupted.tick(.5, { leftSignal: true }); assert.equal(count('batdauthi.mp3'), 0);
    advance(1); interrupted.tick(.5, { leftSignal: true }); latest('batdauthi.mp3');
    interrupted.tick(.5, { leftSignal: true }); assert.equal(count('batdauthi.mp3'), 1);
    interrupted.voice.reset();

    // Time already spent signalling can count, but both instructions must finish first.
    const beforeInstructions = attempt(); beforeInstructions.reachInstructions();
    beforeInstructions.tick(.5, { leftSignal: true }); advance(5000);
    beforeInstructions.tick(.5, { leftSignal: true }); assert.equal(count('batdauthi.mp3'), 0);
    endClip(); latest('batdauthi.mp3');
    assert.equal(beforeInstructions.exam.startLampOn, false);
    endClip(); assert.equal(beforeInstructions.exam.startLampOn, true);
    beforeInstructions.voice.reset();
    console.log('PASS: both instructions plus 5 s of continuous left signal; off resets wait; scoring after voice ends; timeout/failure voices; reset and autoplay');
} finally {
    Object.defineProperty(globalThis, 'performance', originalPerformance);
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    if (originalAudio === undefined) delete globalThis.Audio; else globalThis.Audio = originalAudio;
    if (originalWindow === undefined) delete globalThis.window; else globalThis.window = originalWindow;
}
