import * as THREE from 'three';
import {CabinView} from './CabinView';
import {InputManager} from './InputManager';
import {Vehicle} from './Vehicle';
import {Vehicle2} from './Vehicle2';
import {Vehicle3} from './Vehicle3';
import {Track} from './Track';
import {ExamEngine} from './ExamEngine';
import {CameraManager} from './CameraManager';
import {ProbeController} from './ProbeController';
import {FRONT_PROBE_OFFSET_M} from './startPosition';
import {AutoDriveController} from './autoDrive/AutoDriveController';
import {AUTO_DRIVE_LESSONS, EXAM_06_LESSON, EXAM_07_LESSON, EXAM_08_LESSON, EXAM_09_LESSON, EXAM_10_LESSON} from './autoDrive/autoDriveLessons';
import {Exam04SpeedZone} from './exam/Exam04SpeedZone';
import {ParkingBayBSpeedZone} from './exam/ParkingBayBSpeedZone';
import {configureSunShadows,ENABLE_SHADOWS} from './shadowStyle';
import {RedWhiteCurbContact} from './RedWhiteCurbContact';
import type { ExamVehicleClass } from './exam/examRules';
import {DevProbePanel} from '../ui/DevProbePanel';
import type {Hud} from '../ui/Hud';
import {StartApproachVoice} from '../ui/StartApproachVoice';

const EXAM_VEHICLE_CLASSES: ExamVehicleClass[] = ['A1', 'A2', 'B', 'C1', 'C', 'D1', 'D2', 'D', 'E', 'Fc'];
const EXAM_04_SPEED_LIMIT_KMH = 5;
const PARKING_BAY_B_SPEED_LIMIT_KMH = 2;
const EXAM_10_SPEED_LIMIT_KMH = 3;

function getAutoDriveVehicleClass(): ExamVehicleClass {
const requestedClass = new URLSearchParams(window.location.search).get('vehicleClass');
return EXAM_VEHICLE_CLASSES.find(vehicleClass => vehicleClass === requestedClass) ?? 'B';
}

export class DrivingGame{
private cabin:CabinView;
private scene=new THREE.Scene();
private renderer:THREE.WebGLRenderer;
private input=new InputManager();
private vehicle:Vehicle;
private track=new Track();
private redWhiteCurbContact=new RedWhiteCurbContact(this.track.root);
private exam=new ExamEngine();
private autoDrive!: AutoDriveController;
private exam04SpeedZone!: Exam04SpeedZone;
private sCurveSpeedZone!: Exam04SpeedZone;
private parkingBayBSpeedZone!: ParkingBayBSpeedZone;
private cameras!:CameraManager;
private devProbePanel=new DevProbePanel();
private probeCtrl?:ProbeController;
private clock=new THREE.Clock();
private animationId=0;
private stopped=false;
private lastCameraKey=false;
private probe=new THREE.Vector3();
private rearProbe=new THREE.Vector3();
private wheelTmp=new THREE.Vector3();
private startApproachVoice=new StartApproachVoice({
onInstructionsEnded:()=>this.exam.startExercise.instructionsEnded(),
onStartAnnouncement:()=>this.exam.startExercise.beginStartAnnouncement(),
onStartEnded:()=>{
if(!this.exam.completeStartAnnouncement())return;
this.track.startSignal?.goGreenNow();
if(this.exam.scoringMode==='normal')this.hud.flash('Bắt đầu thi','exam');
},
});
constructor(private host:HTMLDivElement,private hud:Hud,vehicle?:Vehicle,private develop=new URLSearchParams(window.location.search).get('develop')==='true'){
const vehicleParam=new URLSearchParams(window.location.search).get('vehicle');
this.vehicle=vehicle??(vehicleParam==='2'?new Vehicle2():vehicleParam==='1'?new Vehicle():new Vehicle3());
this.cameras=new CameraManager(this.develop);
this.cabin=new CabinView(this.host);
this.scene.background=new THREE.Color(0x9ec4e4);
this.scene.fog=new THREE.Fog(0x9ec4e4,55,135);
this.renderer=new THREE.WebGLRenderer({antialias:true});
this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
this.renderer.shadowMap.enabled=ENABLE_SHADOWS;
this.host.appendChild(this.renderer.domElement);
this.cameras.attach(this.renderer.domElement);
    this.scene.add(this.track.root,this.vehicle.root);
    this.scene.add(new THREE.HemisphereLight(0xddeeff,0x596347,2));
    // Wire up Exam04 sensors from the track (after buildExamGround ran in Track constructor)
    this.exam.wireExam04(this.track.wheelTrackCourseSensors);
    this.exam04SpeedZone = new Exam04SpeedZone(this.track.wheelTrackCourseSensors);
    this.sCurveSpeedZone = new Exam04SpeedZone(this.track.getWindingCourses().flatMap(({ course }) => {
        const entryGate = course.root.getObjectByName('s-curve-entry-approach-yellow-dashed-line');
        const exitGate = course.root.getObjectByName('s-curve-end-yellow-dashed-line');
        if (!entryGate || !exitGate) return [];
        course.root.updateWorldMatrix(true, true);
        const sensor = (gate: THREE.Object3D) => {
            const bounds = new THREE.Box3().setFromObject(gate);
            bounds.min.y = -2;
            bounds.max.y = 4;
            return bounds;
        };
        return [{
            startYellowSensor: sensor(entryGate),
            endYellowSensor: sensor(exitGate),
            exitForwardAxis: new THREE.Vector3(-1, 0, 0)
                .applyQuaternion(course.root.getWorldQuaternion(new THREE.Quaternion())).normalize(),
        }];
    }));
    this.parkingBayBSpeedZone = new ParkingBayBSpeedZone(this.track.root);
    // Gắn cùng bộ chấm bài 5 cho các cụm đèn chạy theo chu kỳ.
    this.exam.wireTrafficLights(this.track);
    const accelerationPositions = [
        'six-a-acceleration-position-1-yellow-dash',
        'six-a-acceleration-position-2-yellow-dash',
        'eight-a-acceleration-position-3-yellow-dash',
    ].map(name => {
        const marker = this.track.root.getObjectByName(name);
        if (!marker) throw new Error(`Missing acceleration marker: ${name}`);
        marker.updateWorldMatrix(true, false);
        return marker.getWorldPosition(new THREE.Vector3()).x;
    }) as [number, number, number];
    this.autoDrive = new AutoDriveController(
        AUTO_DRIVE_LESSONS,
        lesson => this.hud.showAutoDriveLesson(lesson, () => this.autoDrive.continueLesson(),
            this.autoDrive.canRecordExam05Continuation),
        () => {
            this.input.setAutomationEnabled(false);
            this.hud.setAutoDriveMode(false);
            this.hud.flash('Đã chạy hết lộ trình tự động', 'success');
        },
        kind => {
            if (kind === 'exam05') {
                this.hud.showAutoDriveLesson(EXAM_06_LESSON, () => this.autoDrive.continueLesson(),
                    this.autoDrive.canRecordExam05Continuation, this.autoDrive.hasSavedExam06Approach);
            } else if (kind === 'exam07') {
                this.hud.showAutoDriveLesson(EXAM_07_LESSON, () => this.autoDrive.continueLesson(),
                    this.autoDrive.canRecordExam07Continuation, this.autoDrive.hasSavedExam08Approach);
            } else if (kind === 'exam08') {
                this.hud.showAutoDriveLesson(EXAM_08_LESSON, () => this.autoDrive.continueLesson(),
                    this.autoDrive.canRecordExam08Continuation, this.autoDrive.hasSavedExam09Approach);
            } else if (kind === 'exam09') {
                this.hud.showAutoDriveLesson(EXAM_09_LESSON, () => this.autoDrive.continueLesson(),
                    this.autoDrive.canRecordExam09Continuation);
            } else if (kind === 'exam10') {
                this.hud.showAutoDriveLesson(EXAM_10_LESSON, () => this.autoDrive.continueLesson(),
                    this.autoDrive.canRecordExam10Continuation);
            } else {
                this.hud.showWaypointStopPrompt(kind);
            }
        },
        getAutoDriveVehicleClass(),
        this.track.wheelTrackCourseSensors[0].startYellowSensor,
        this.track.getTrafficLight('SOUTH'),
        this.track.getTrafficLight('EAST'),
        this.track.root.getObjectByName('road-11a-railway-white-line'),
        accelerationPositions,
        this.track.getTrafficLight('WEST'),
        this.track.getTrafficLight('SOUTH_EXIT'),
    );
    this.hud.setExam06Selectable(this.autoDrive.hasSavedExam06Approach);
    this.hud.setExam07Selectable(this.autoDrive.hasSavedExam07Approach);
    this.hud.setExam08Selectable(this.autoDrive.hasExam08PopupWaypoint);
    this.hud.setExam09Selectable(this.autoDrive.hasExam09PopupWaypoint);
    this.hud.setExam10Selectable(this.autoDrive.hasExam10PopupWaypoint);
    this.hud.setExam11Selectable(this.autoDrive.hasExam11PopupWaypoint);
if(this.develop){
this.probeCtrl=new ProbeController(this.cameras.camera,this.track,this.renderer.domElement,this.devProbePanel,true);
}
const sun=new THREE.DirectionalLight(0xffffff,2.3);
sun.position.set(-20,35,18);
sun.castShadow=ENABLE_SHADOWS;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-60;
sun.shadow.camera.right=60;
sun.shadow.camera.top=60;
sun.shadow.camera.bottom=-60;
configureSunShadows(sun);
this.scene.add(sun);
window.addEventListener('resize',this.resize);
this.resize();
this.hud.bind({onRestart:()=>this.restart(),onCamera:()=>{if(!this.develop)this.cameras.next()},onAnalog:(name,value)=>this.input.setAnalog(name,value),onVirtual:(c,a)=>this.input.setVirtual(c,a),onSignalChange:(state)=>this.vehicle.setSignal(state),onSeatBelt:(on)=>this.vehicle.seatBeltFastened=on,onAutoDriveToggle:()=>this.toggleAutoDrive(),onLessonSelect:(lessonId)=>this.selectAutoDriveLesson(lessonId),onWaypointRecordingStart:()=>this.startWaypointRecording(),onWaypointRecordingFinish:()=>this.finishWaypointRecording()})
}
start(){
this.stopped=false;
this.clock.start();
const loop=()=>{
if(this.stopped)return;
this.animationId=requestAnimationFrame(loop);
const dt=Math.min(this.clock.getDelta(),.033);
const ck=this.input.isDown('KeyC');
if(!this.develop&&ck&&!this.lastCameraKey)this.cameras.next();
this.lastCameraKey=ck;
this.vehicle.followSurface((x,z)=>this.track.getSurfaceHeight(x,z));
const frontBeforeMove=this.probe.set(0,0,-FRONT_PROBE_OFFSET_M).applyQuaternion(this.vehicle.root.quaternion).add(this.vehicle.root.position);
const rearBeforeMove=this.rearProbe.set(0,0,FRONT_PROBE_OFFSET_M).applyQuaternion(this.vehicle.root.quaternion).add(this.vehicle.root.position);
this.updateCourseSpeedLimits(frontBeforeMove,rearBeforeMove,Object.values(this.getWheelPositions()));
if(!this.develop||this.autoDrive.enabled){
this.vehicle.transmission.preventStall=this.autoDrive.enabled;
if(this.autoDrive.enabled&&this.autoDrive.isWaypointRecording){
this.vehicle.update(dt,this.input);
this.hud.setWaypointRecordingCount(this.autoDrive.captureWaypoint(this.vehicle));
}else if(this.autoDrive.enabled)this.autoDrive.update(
dt,
this.vehicle,
this.track.autoDriveWaypointStops,
);
else this.vehicle.update(dt,this.input);
}
this.vehicle.followSurface((x,z)=>this.track.getSurfaceHeight(x,z));
this.track.update(dt,this.vehicle.root.position);
const penaltyCount=this.exam.penalties.length;
const frontPosition=this.probe.set(0,0,-FRONT_PROBE_OFFSET_M).applyQuaternion(this.vehicle.root.quaternion).add(this.vehicle.root.position).clone();
const rearPosition=this.rearProbe.set(0,0,FRONT_PROBE_OFFSET_M).applyQuaternion(this.vehicle.root.quaternion).add(this.vehicle.root.position);
const wheelPositions = this.getWheelPositions();
if(!this.develop&&!this.autoDrive.enabled&&!this.exam.isFinished&&this.exam.activeIndex===0){
this.startApproachVoice.update(frontPosition,this.vehicle.signals.left&&!this.vehicle.signals.hazard);
}
this.updateCourseSpeedLimits(frontPosition,rearPosition,Object.values(wheelPositions));
if(this.autoDrive.enabled)this.redWhiteCurbContact.reset();
else if(this.exam.scoringMode==='normal'&&!this.exam.isFinished
    &&this.redWhiteCurbContact.touches(wheelPositions))this.exam.disqualifyForRedWhiteCurb();

const startToast=this.autoDrive.enabled ? undefined : this.exam.update({position:this.vehicle.root.position,frontPosition,wheelPositions,speedKmh:this.vehicle.getSpeedKmh(),rpm:this.vehicle.transmission.rpm,engineRunning:this.vehicle.transmission.running,stalled:this.vehicle.transmission.car.stalled,clutch:this.vehicle.transmission.clutch,leftSignal:this.vehicle.signals.left,seatBeltFastened:this.vehicle.seatBeltFastened},this.track.startSignal?.phase??'idle',dt);
const added=this.exam.penalties.slice(penaltyCount);
if(!this.autoDrive.enabled){
this.startApproachVoice.reportEvents(added,this.exam.disqualifyReason,this.exam.isFinished);
}
if(added.length)this.hud.flash(added.map(e=>e.reason+(e.points>0?' (−'+e.points+')':'')).join('. '),'penalty');
if(!this.autoDrive.enabled)this.handlePenalties();
const activeIndex=this.exam.activeIndex;

// === HUD updates ===
const isExam02=activeIndex===1 && !this.exam.isFinished;
this.hud.updatePedestrianHud(this.exam.pedestrianExercise,isExam02?frontPosition.x:null,isExam02&&!this.autoDrive.enabled);

// Update ground label (A distance)
if(activeIndex===1){
const A=this.exam.pedestrianExercise.stopLineX-frontPosition.x;
const status=A>=0&&A<=0.5?'VALID':A>0.5?'TOO_EARLY':'OVER';
this.track.setStopDistanceLabel(A,status,this.vehicle.root.position.x);
}else{
this.track.setStopDistanceLabel(0,'HIDDEN',0);
}

this.cameras.update(this.vehicle,dt,this.input);
const displaySteeringWheelAngle=this.autoDrive.enabled&&!this.autoDrive.isWaypointRecording
    ?0:this.vehicle.steeringSystem.steeringWheelAngle;
this.hud.update({speedKmh:this.vehicle.getSpeedKmh(),gasPedal:this.vehicle.transmission.pedals.gas,brakePedal:this.vehicle.transmission.pedals.brake,gearWarnings:this.vehicle.transmission.car.warnings,engineStatus:this.vehicle.transmission.status,gear:this.vehicle.transmission.gear,clutch:this.vehicle.transmission.clutch,rpm:this.vehicle.transmission.rpm,steeringWheelAngle:displaySteeringWheelAngle,steering:THREE.MathUtils.radToDeg(this.vehicle.steering),signals:{left:this.vehicle.signals.left,right:this.vehicle.signals.right,hazard:this.vehicle.signals.hazard},seatBelt:this.vehicle.seatBeltFastened,startLamp:this.exam.startLampOn,disqualified:this.exam.disqualified,disqualifyReason:this.exam.disqualifyReason,score:this.exam.score,elapsed:this.exam.elapsedSeconds,currentExercise:this.autoDrive.enabled?this.autoDrive.currentExerciseTitle:this.exam.currentExerciseTitle,penalties:this.exam.penalties,cameraMode:this.cameras.mode},this.exam.isFinished,this.exam.scoringMode);
this.hud.setSelectedLesson(this.autoDrive.enabled?this.autoDrive.currentExamNumber:this.exam.activeIndex+1);
if(startToast){
if(this.exam.scoringMode==='normal')this.hud.flash(startToast,startToast.startsWith('Chào mừng')?{kind:'exam',durationMs:7000}:'exam');
}
this.cabin.render(this.renderer,this.scene,this.cameras.camera,this.vehicle,
    !this.develop&&this.cameras.mode===2,displaySteeringWheelAngle)
};
loop()
}
private handlePenalties(){
if(this.exam.isFinished)return;
if(this.exam.approaching)return;
const now=performance.now(),p=this.vehicle.root.position;
this.vehicle.root.updateWorldMatrix(true,true);
const wheels=Object.values(this.getWheelPositions());
for(const boundary of this.track.curvedBoundaryChecks){
if(wheels.some(wheel=>boundary.touches(wheel))){
const evt=this.exam.applyLinePenalty(boundary.groupIndex,now);
if(evt)this.hud.flash(evt.reason,'penalty');
}}
const locals=[new THREE.Vector3(-.95,0,1.25),new THREE.Vector3(.95,0,1.25),new THREE.Vector3(-.95,0,-1.3),new THREE.Vector3(.95,0,-1.3)];
for(const local of locals){
this.probe.copy(local).applyQuaternion(this.vehicle.root.quaternion).add(p);
for(let i=0;i<this.track.penaltyZones.length;i++){
if(this.track.penaltyZones[i].containsPoint(this.probe)){
const evt=this.exam.applyLinePenalty(this.track.penaltyZoneGroupIndices[i] ?? i,now);
if(evt)this.hud.flash(evt.reason,'penalty')}}}}
restart(){
this.startApproachVoice.reset();
this.autoDrive?.stop();
this.redWhiteCurbContact.reset();
this.input.setAutomationEnabled(false);
this.hud.setAutoDriveMode(false);
this.vehicle.reset();
this.exam04SpeedZone.reset();
this.sCurveSpeedZone.reset();
this.parkingBayBSpeedZone.reset();
this.exam.reset();
this.track.reset();
this.input.clearVirtual();
this.hud.clearNotices();
if(this.exam.scoringMode==='normal')this.hud.flash('Đã bắt đầu lại bài thi','exam')
}
    private toggleAutoDrive(){
if(this.autoDrive.enabled){
const lessonId=this.autoDrive.currentExamNumber;
this.autoDrive.stop();
this.input.setAutomationEnabled(false);
this.input.clearVirtual();
this.vehicle.speed=0;
this.vehicle.transmission.stopInPlace(this.input);
if(this.exam.activeIndex!==lessonId-1)this.exam.startFromLesson(lessonId);
this.hud.setAutoDriveMode(false);
return;
}
this.startApproachVoice.reset();
this.redWhiteCurbContact.reset();
this.vehicle.reset();this.exam.reset();this.track.reset();this.input.clearVirtual();
this.exam04SpeedZone.reset();
this.sCurveSpeedZone.reset();
this.parkingBayBSpeedZone.reset();
this.vehicle.seatBeltFastened=true;
this.input.setAutomationEnabled(true);
this.autoDrive.start(this.vehicle);
this.hud.setAutoDriveMode(true);
}
private selectAutoDriveLesson(lessonId: number){
if(lessonId===6?!this.autoDrive.hasSavedExam06Approach:
    lessonId===7?!this.autoDrive.hasSavedExam07Approach:
    lessonId===8?!this.autoDrive.hasExam08PopupWaypoint:
    lessonId===9?!this.autoDrive.hasExam09PopupWaypoint:
    lessonId===10?!this.autoDrive.hasExam10PopupWaypoint:
    lessonId===11?!this.autoDrive.hasExam11PopupWaypoint:
    !AUTO_DRIVE_LESSONS.some(lesson=>lesson.id===lessonId))return;
this.startApproachVoice.reset();
this.redWhiteCurbContact.reset();
this.hud.setAutoDriveMode(false);
this.vehicle.reset();this.exam.reset();this.track.reset();this.input.clearVirtual();
this.exam04SpeedZone.reset();
this.sCurveSpeedZone.reset();
this.parkingBayBSpeedZone.reset();
this.vehicle.seatBeltFastened=true;
this.input.setAutomationEnabled(true);
this.autoDrive.start(this.vehicle);
this.hud.setAutoDriveMode(true);
this.autoDrive.jumpToLesson(lessonId,this.vehicle);
this.exam.startFromLesson(lessonId);
this.hud.setSelectedLesson(lessonId);
}
private startWaypointRecording(){
if(!this.autoDrive.beginWaypointRecording(this.vehicle))return false;
this.input.clearVirtual();
this.input.setAutomationEnabled(false);
this.hud.setWaypointRecordingCount(1);
return true;
}
private finishWaypointRecording(){
const route=this.autoDrive.finishWaypointRecording(this.vehicle);
this.input.setAutomationEnabled(true);
return route;
}
private getWheelPositions(): { FL: THREE.Vector3; FR: THREE.Vector3; RL: THREE.Vector3; RR: THREE.Vector3 } {
if(this.vehicle instanceof Vehicle3 && this.vehicle.wheelAssembly)return {
    FL:this.vehicle.wheelAssembly.getWheel('FL').getWorldPosition(this.wheelTmp).clone(),
    FR:this.vehicle.wheelAssembly.getWheel('FR').getWorldPosition(this.wheelTmp).clone(),
    RL:this.vehicle.wheelAssembly.getWheel('RL').getWorldPosition(this.wheelTmp).clone(),
    RR:this.vehicle.wheelAssembly.getWheel('RR').getWorldPosition(this.wheelTmp).clone(),
};
const wheel=(x:number,z:number)=>new THREE.Vector3(x,0,z)
    .applyQuaternion(this.vehicle.root.quaternion).add(this.vehicle.root.position);
return {FL:wheel(-.95,-1.3),FR:wheel(.95,-1.3),RL:wheel(-.95,1.25),RR:wheel(.95,1.25)};
}
private updateCourseSpeedLimits(front:THREE.Vector3,rear:THREE.Vector3,wheels:readonly THREE.Vector3[]){
const inExam04=this.exam04SpeedZone.update(front,rear);
const inSCurve=this.sCurveSpeedZone.update(front,rear);
const inParkingBayB=this.parkingBayBSpeedZone.update(wheels);
const inExam10=this.autoDrive.enabled&&this.autoDrive.currentExamNumber===10;
this.vehicle.setSpeedLimitKmh(inExam10
    ? this.autoDrive.isWaypointRecording ? EXAM_10_SPEED_LIMIT_KMH : undefined
    :
    inParkingBayB?PARKING_BAY_B_SPEED_LIMIT_KMH:
    inExam04||inSCurve?EXAM_04_SPEED_LIMIT_KMH:undefined);
}
private resize=()=>{
const w=this.host.clientWidth,h=this.host.clientHeight;
this.renderer.setSize(w,h,false);
this.cameras.resize(w,h)
}
public setTransmissionMode(mode: 'b-auto' | 'b-manual' | 'c1'){
    if (this.vehicle && this.vehicle.transmission) {
        this.vehicle.transmission.isAutomatic = (mode === 'b-auto');
        this.vehicle.transmission.preventStall = (mode === 'b-auto');
    }
}
}
