import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({ stdin: { contents: `export * as THREE from 'three';
export { ExamEngine } from './src/game/ExamEngine';`, resolveDir: process.cwd() },
 bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module','exports',bundle.outputFiles[0].text)(module,module.exports);
const { THREE, ExamEngine } = module.exports;
const snapshot = { position: new THREE.Vector3(0,0,0), frontPosition: new THREE.Vector3(2.1,0,0),
 speedKmh:0, rpm:800, engineRunning:true, stalled:false, leftSignal:false, seatBeltFastened:true };
for(let lesson=2;lesson<=11;lesson++) {
 const engine=new ExamEngine('normal');
 engine.startFromLesson(lesson);
 assert.equal(engine.activeIndex,lesson-1);
 assert.equal(engine.approaching,false);
 assert.equal(engine.score,100);
 const previous=[engine.startExercise,engine.pedestrianExercise,engine.hillExercise,engine.wheelTrackExercise];
 for(let i=0;i<Math.min(lesson-1,previous.length);i++) previous[i].update=()=>{throw Error(`Lesson ${lesson} invoked previous lesson ${i+1}`)};
 engine.update(snapshot,'idle',.016);
 assert.equal(engine.disqualified,false,`Selected lesson ${lesson} was disqualified`);
}
const engine=new ExamEngine('normal');
engine.startFromLesson(5); engine.reset();
assert.equal(engine.activeIndex,0); assert.equal(engine.approaching,true);
engine.startFromLesson(1);
assert.equal(engine.activeIndex,0); assert.equal(engine.approaching,true);
console.log('Selected lesson scoring checks passed (2–11, reset, lesson 1)');
