import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({
    stdin: {
        contents: `export { StartApproachVoice } from './src/ui/StartApproachVoice';
            export { ExamEngine } from './src/game/ExamEngine';
            export { startPosition, startWaitingLine, FRONT_PROBE_OFFSET_M } from './src/game/startPosition';
            export { EXAM_02_APPROACH_VOICE_LINE, EXAM_02_CROSSWALK, EXAM_03_ENTRY_CHIME_LINE } from './src/game/exam/examCourseGeometry';
            export { Vector3 } from 'three';`,
        resolveDir: process.cwd(),
    },
    bundle: true, write: false, platform: 'node', format: 'cjs',
});
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { StartApproachVoice, ExamEngine, startPosition, startWaitingLine, FRONT_PROBE_OFFSET_M, EXAM_02_APPROACH_VOICE_LINE, EXAM_02_CROSSWALK, EXAM_03_ENTRY_CHIME_LINE, Vector3 } = module.exports;
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
let activeVoice;
let blockNext = false;
globalThis.Audio = class {
    onended = null;
    onerror = null;
    onplaying = null;
    paused = false;
    plays = 0;
    constructor(src) { this.src = src; audio.push(this); }
    play() {
        this.plays++;
        if (blockNext) {
            blockNext = false;
            return Promise.reject(new DOMException('Gesture required', 'NotAllowedError'));
        }
        this.onplaying?.();
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
const latest = file => assert.ok(activeVoice.audio?.src.endsWith(file), `Expected ${file}, got ${activeVoice.audio?.src}`);
const endClip = () => activeVoice.audio?.onended?.();
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
    activeVoice = voice;
    const tick = (distance = .5, overrides = {}) => {
        const frontPosition = new Vector3(startPosition.lineX - distance, 0,
            startPosition.lineZ + startPosition.laneOffset);
        const before = exam.penalties.length;
        if (!exam.isFinished) voice.update(frontPosition, overrides.leftSignal ?? false);
        if (!exam.isFinished && exam.activeIndex <= 1) voice.updatePedestrianApproach(frontPosition);
        if (!exam.isFinished && exam.activeIndex <= 2) voice.updateHillApproach(frontPosition,
            frontPosition.clone().add(new Vector3(-2 * FRONT_PROBE_OFFSET_M, 0, 0)));
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
    endClip(); latest('chuongbingbong.mp3');
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
    // The post-start chime uses the front bumper and fires once at 3 m.
    const chime = attempt(); chime.authorize();
    chime.tick(-.1, { leftSignal: true });
    chime.tick(-2.999, { leftSignal: true });
    assert.equal(count('chuongbingbong.mp3'), 0, 'No chime before the 3 m mark');
    chime.tick(-3, { leftSignal: true });
    latest('chuongbingbong.mp3');
    endClip();
    chime.tick(-3.2, { leftSignal: true });
    chime.tick(-2.9, { leftSignal: true });
    chime.tick(-3.1, { leftSignal: true });
    assert.equal(count('chuongbingbong.mp3'), 1, 'Reversing across the mark cannot repeat the chime');
    chime.voice.reset(); chime.exam.reset(); chime.authorize();
    chime.tick(-.1, { leftSignal: true });
    chime.tick(-2.9, { leftSignal: true });
    chime.tick(-3.2, { leftSignal: true });
    assert.equal(count('chuongbingbong.mp3'), 2, 'A new attempt rearms the chime and catches crossing between frames');
    chime.voice.reset();

    // The visible dashed line introduces lesson 2 after start scoring is complete.
    const intro = attempt(); intro.authorize();
    intro.tick(-.1, { leftSignal: true }); intro.tick(-1, { leftSignal: true });
    intro.tick(-5.1, { leftSignal: false }); endClip();
    assert.equal(intro.exam.activeIndex, 1);
    const nearEdgeX = EXAM_02_APPROACH_VOICE_LINE.x - EXAM_02_APPROACH_VOICE_LINE.thicknessM / 2;
    const gateZ = EXAM_02_APPROACH_VOICE_LINE.z;
    intro.voice.updatePedestrianApproach({ x: nearEdgeX - .001, z: gateZ });
    const introFile = 'baithitieptheo_dungxenhuongduongchonguoidibo.mp3';
    assert.equal(count(introFile), 0, 'Wait until the bumper touches the near edge of the paint');
    const chimesBeforeIntro = count('chuongbingbong.mp3');
    intro.voice.updatePedestrianApproach({ x: nearEdgeX, z: gateZ }); latest(introFile);
    assert.equal(count('chuongbingbong.mp3'), chimesBeforeIntro + 1, 'The introduction starts with its own parallel chime');
    endClip();
    intro.voice.updatePedestrianApproach({ x: nearEdgeX + .3, z: gateZ });
    intro.voice.updatePedestrianApproach({ x: nearEdgeX - .1, z: gateZ });
    intro.voice.updatePedestrianApproach({ x: nearEdgeX + .1, z: gateZ });
    assert.equal(count(introFile), 1, 'Re-crossing cannot repeat the introduction');
    intro.voice.reset();
    intro.voice.updatePedestrianApproach({ x: nearEdgeX - .2, z: gateZ });
    intro.voice.updatePedestrianApproach({ x: nearEdgeX + .3, z: gateZ });
    assert.equal(count(introFile), 2, 'Restart rearms the introduction, including crossings between frames');
    intro.voice.reset();

    const skippedIntro = attempt();
    skippedIntro.voice.updatePedestrianApproach({ x: nearEdgeX + 1, z: gateZ });
    assert.equal(count(introFile), 0, 'Starting beyond the line does not invent a crossing');
    skippedIntro.voice.reset();
    const outsideZ = gateZ + EXAM_02_APPROACH_VOICE_LINE.widthM / 2 + .2;
    skippedIntro.voice.updatePedestrianApproach({ x: nearEdgeX - .1, z: outsideZ });
    skippedIntro.voice.updatePedestrianApproach({ x: nearEdgeX + .1, z: outsideZ });
    assert.equal(count(introFile), 0, 'Crossing outside the road cannot trigger the introduction');
    skippedIntro.voice.reset();

    // A queued introduction must wait to start its chime until speech plays.
    const paired = attempt();
    paired.voice.reportEvents([{ at: now, points: 5, reason: 'Chết máy' }]);
    paired.voice.updatePedestrianApproach({ x: nearEdgeX - .1, z: gateZ });
    paired.voice.updatePedestrianApproach({ x: nearEdgeX + .1, z: gateZ });
    assert.equal(count(introFile), 0);
    assert.equal(count('chuongbingbong.mp3'), 0, 'Do not play the chime while speech is still queued');
    endClip(); latest(introFile);
    assert.equal(count('chuongbingbong.mp3'), 1);
    const speech = paired.voice.audio, companion = audio.at(-1);
    assert.equal(speech.paused, false); assert.equal(companion.paused, false);
    speech.onplaying();
    assert.equal(count('chuongbingbong.mp3'), 1, 'Buffering/resuming the speech cannot repeat the chime');
    paired.voice.reset();
    assert.equal(speech.paused, true); assert.equal(companion.paused, true, 'Reset stops both recordings');

    const blockedPair = attempt(); blockNext = true;
    blockedPair.voice.updatePedestrianApproach({ x: nearEdgeX - .1, z: gateZ });
    blockedPair.voice.updatePedestrianApproach({ x: nearEdgeX + .1, z: gateZ });
    await Promise.resolve();
    assert.equal(count('chuongbingbong.mp3'), 0, 'Autoplay rejection must not play a lone chime');
    window.dispatchEvent(new Event('pointerdown'));
    latest(introFile); assert.equal(count('chuongbingbong.mp3'), 1);
    blockedPair.voice.reset();

    // Introduce the hill only once the rear clears the pedestrian crossing.
    const hill = attempt();
    const hillFile = 'baithitieptheo_dungvakhoihanhxengangdoc.mp3';
    const crossingExitX = EXAM_02_CROSSWALK.x + EXAM_02_CROSSWALK.depthM / 2;
    const hillLineX = EXAM_03_ENTRY_CHIME_LINE.x - EXAM_03_ENTRY_CHIME_LINE.thicknessM / 2;
    const hillZ = EXAM_03_ENTRY_CHIME_LINE.z + startPosition.laneOffset;
    const hillAtRear = x => hill.voice.updateHillApproach({ x: x + 2 * FRONT_PROBE_OFFSET_M, z: hillZ }, { x, z: hillZ });
    const hillAtFront = x => hill.voice.updateHillApproach({ x, z: hillZ }, { x: x - 2 * FRONT_PROBE_OFFSET_M, z: hillZ });
    hillAtRear(crossingExitX - .001);
    assert.equal(count(hillFile), 0, 'Front bumper crossing is insufficient while the rear is still on the crosswalk');
    hillAtRear(crossingExitX); latest(hillFile);
    assert.equal(count('chuongbingbong.mp3'), 0, 'The introduction alone does not play the hill-entry bell');
    hillAtFront(hillLineX - .001);
    assert.equal(count('chuongbingbong.mp3'), 0, 'Do not ring before contact with the yellow paint');
    hillAtFront(hillLineX);
    latest(hillFile);
    assert.equal(count('chuongbingbong.mp3'), 1, 'Ring immediately at the line while hill speech is still playing');
    const hillSpeech = hill.voice.audio, hillBell = audio.at(-1);
    assert.equal(hillSpeech.paused, false); assert.equal(hillBell.paused, false);
    hillAtFront(hillLineX + .5); hillAtFront(hillLineX - .2); hillAtFront(hillLineX + .2);
    assert.equal(count(hillFile), 1); assert.equal(count('chuongbingbong.mp3'), 1);
    hill.voice.reset();
    assert.equal(hillSpeech.paused, true); assert.equal(hillBell.paused, true);
    hillAtRear(crossingExitX - .2); hillAtRear(crossingExitX + .2);
    hillAtFront(hillLineX + .2);
    assert.equal(count(hillFile), 2); assert.equal(count('chuongbingbong.mp3'), 2, 'Restart rearms both hill cues');
    hill.voice.reset();

    const skippedHill = attempt();
    skippedHill.voice.updateHillApproach({ x: hillLineX + 1, z: hillZ }, { x: hillLineX - 3, z: hillZ });
    assert.equal(count(hillFile), 0); assert.equal(count('chuongbingbong.mp3'), 0, 'Starting beyond a marker is not a crossing');
    skippedHill.voice.reset();
    const offRoadZ = hillZ + 10;
    skippedHill.voice.updateHillApproach({ x: crossingExitX, z: offRoadZ }, { x: crossingExitX - 1, z: offRoadZ });
    skippedHill.voice.updateHillApproach({ x: hillLineX + 1, z: offRoadZ }, { x: hillLineX - 3, z: offRoadZ });
    assert.equal(count(hillFile), 0); assert.equal(count('chuongbingbong.mp3'), 0, 'Other roads cannot trigger hill cues');
    skippedHill.voice.reset();
    skippedHill.voice.reportEvents([], undefined, true);
    skippedHill.voice.updateHillApproach({ x: crossingExitX, z: hillZ }, { x: crossingExitX - 1, z: hillZ });
    skippedHill.voice.updateHillApproach({ x: hillLineX + 1, z: hillZ }, { x: hillLineX - 3, z: hillZ });
    assert.equal(count(hillFile), 0); assert.equal(count('chuongbingbong.mp3'), 0, 'Finished attempts cannot trigger hill cues');
    skippedHill.voice.reset();

    console.log('PASS: hill introduction after rear clears crosswalk and bell at yellow line; parallel lesson 2 speech/chime, queue/autoplay/reset; dashed lesson 2 entry introduction; 3 m post-start chime once per attempt; both instructions plus 5 s of continuous left signal; off resets wait; scoring after voice ends; timeout/failure voices; reset and autoplay');
} finally {
    Object.defineProperty(globalThis, 'performance', originalPerformance);
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    if (originalAudio === undefined) delete globalThis.Audio; else globalThis.Audio = originalAudio;
    if (originalWindow === undefined) delete globalThis.window; else globalThis.window = originalWindow;
}
