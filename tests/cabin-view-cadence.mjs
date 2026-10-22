import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({ stdin: { contents: `export * as THREE from 'three';
export { CabinView, AUXILIARY_VIEW_FPS } from './src/game/CabinView';`, resolveDir: process.cwd() },
bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', bundle.outputFiles[0].text)(module, module.exports);
const { THREE, CabinView, AUXILIARY_VIEW_FPS } = module.exports;

class Element {
    hidden = false;
    style = {};
    clientWidth = 800;
    clientHeight = 600;
    width = 200;
    height = 125;
    appendChild() {}
    prepend() {}
    setAttribute() {}
    querySelector() { return new Element(); }
    querySelectorAll(selector) {
        return selector === '.mirror-frame' ? Array.from({ length: 4 }, () => new Element()) : [];
    }
    getBoundingClientRect() { return { left: 0, top: 0, bottom: this.height, width: this.width, height: this.height }; }
}
globalThis.document = { createElement: () => new Element() };
let now = 0;
const originalPerformance = globalThis.performance;
globalThis.performance = { now: () => now };
try {
    const cabin = new CabinView(new Element());
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera();
    const vehicle = { root: new THREE.Group(), transmission: { rpm: 800, gear: 0 }, getSpeedKmh: () => 0 };
    scene.add(vehicle.root);
    let target = null;
    const calls = [];
    const renderer = {
        autoClear: true, getPixelRatio: () => 2,
        setViewport() {}, setScissor() {}, setScissorTest() {}, clear() {},
        setRenderTarget(value) { target = value; },
        render(renderedScene, renderedCamera) {
            calls.push({ now, target, renderedScene, renderedCamera,
                geometry: cabin.viewScreen.geometry, texture: cabin.viewScreen.material.map });
        }
    };
    const draw = (time, active = false) => {
        now = time;
        calls.length = 0;
        cabin.render(renderer, scene, camera, vehicle, active, 0);
        assert.equal(calls.filter(call => call.renderedCamera === camera).length, 1, 'Main camera always renders');
        assert.equal(renderer.autoClear, true);
        assert.equal(target, null);
        return calls.filter(call => call.target);
    };

    assert.equal(AUXILIARY_VIEW_FPS, 30);
    assert.equal(draw(0).length, 2, 'Visible panes initialize immediately');
    assert.equal(new Set(cabin.viewTargets).size, 4, 'Each pane retains its own image');
    assert.equal(draw(16).length, 0, 'Intermediate frames reuse the cached images');
    const blits = calls.filter(call => call.renderedScene !== scene);
    assert.equal(blits.length, 2, 'Both panes remain displayed when no camera updates');
    assert.equal(blits[0].texture, cabin.viewTargets[0].texture);
    assert.equal(blits[0].geometry, cabin.mirrorGeometry, 'Mirrors stay horizontally flipped');
    assert.equal(blits[1].texture, cabin.viewTargets[2].texture);
    assert.equal(blits[1].geometry, cabin.screenGeometry, 'Shoulder view stays unflipped');
    assert.equal(draw(34).length, 2);
    assert.equal(draw(35, true).length, 2, 'Entering cabin initializes newly visible panes');
    assert.equal(calls.filter(call => call.renderedScene !== scene).length, 4);
    assert.equal(vehicle.root.visible, true);
    cabin.frames[2].width = 240;
    assert.equal(draw(36, true).length, 1, 'Resized pane refreshes immediately');
    assert.equal(cabin.viewTargets[2].width, 480, 'Shoulder resolution follows pixel density');
    assert.equal(cabin.viewTargets[0].width, 512, 'Mirror resolution stays unchanged');
    draw(37, false);
    assert.equal(draw(38, true).length, 2, 'Reopened panes never display stale images');
    assert.equal(draw(10000, true).length, 4, 'Long pauses update once, without catch-up renders');
    assert.equal(draw(10001, true).length, 0);

    const counts = [0, 0, 0, 0];
    for (let frame = 0; frame < 120; frame++) {
        for (const call of draw(11000 + frame * 1000 / 120, true)) {
            counts[cabin.viewTargets.indexOf(call.target)]++;
        }
    }
    assert.ok(counts.every(count => count >= 29 && count <= 31), `Expected about 30 updates at 120 main FPS: ${counts}`);
    console.log(`PASS: cached panes, camera changes, resize, pause recovery; updates per second: ${counts.join(', ')}`);
} finally {
    globalThis.performance = originalPerformance;
    delete globalThis.document;
}
