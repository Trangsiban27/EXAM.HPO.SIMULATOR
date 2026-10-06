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
import {AUTO_DRIVE_LESSONS} from './autoDrive/autoDriveLessons';
import type { ExamVehicleClass } from './exam/examRules';
import {DevProbePanel} from '../ui/DevProbePanel';
import type {Hud} from '../ui/Hud';

const EXAM_VEHICLE_CLASSES: ExamVehicleClass[] = ['A1', 'A2', 'B', 'C1', 'C', 'D1', 'D2', 'D', 'E', 'Fc'];

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
private exam=new ExamEngine();
private autoDrive!: AutoDriveController;
private cameras!:CameraManager;
private devProbePanel=new DevProbePanel();
private probeCtrl?:ProbeController;
private clock=new THREE.Clock();
private animationId=0;
private stopped=false;
private lastCameraKey=false;
private probe=new THREE.Vector3();
private wheelTmp=new THREE.Vector3();
constructor(private host:HTMLDivElement,private hud:Hud,vehicle?:Vehicle,private develop=new URLSearchParams(window.location.search).get('develop')==='true'){
const vehicleParam=new URLSearchParams(window.location.search).get('vehicle');
this.vehicle=vehicle??(vehicleParam==='2'?new Vehicle2():vehicleParam==='1'?new Vehicle():new Vehicle3());
this.cameras=new CameraManager(this.develop);
this.cabin=new CabinView(this.host);
this.scene.background=new THREE.Color(0x9ec4e4);
this.scene.fog=new THREE.Fog(0x9ec4e4,55,135);
this.renderer=new THREE.WebGLRenderer({antialias:true});
this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
this.renderer.shadowMap.enabled=true;
this.host.appendChild(this.renderer.domElement);
this.cameras.attach(this.renderer.domElement);
    this.scene.add(this.track.root,this.vehicle.root);
    this.scene.add(new THREE.HemisphereLight(0xddeeff,0x596347,2));
    // Wire up Exam04 sensors from the track (after buildExamGround ran in Track constructor)
    this.exam.wireExam04(this.track.wheelTrackCourseSensors);
    // Wire up Exam05South với trafficLight South đã có sẵn (xem buildExamGround.ts).
    this.exam.wireExam05South(this.track);
    this.autoDrive = new AutoDriveController(
        AUTO_DRIVE_LESSONS,
        lesson => this.hud.showAutoDriveLesson(lesson, () => this.autoDrive.continueLesson()),
        () => {
            this.input.setAutomationEnabled(false);
            this.hud.setAutoDriveMode(false);
            this.hud.flash('Đã chạy hết lộ trình tự động', 'success');
        },
        kind => this.hud.showWaypointStopPrompt(kind),
        getAutoDriveVehicleClass(),
        this.track.wheelTrackCourseSensors[0].startYellowSensor,
    );
if(this.develop){
this.probeCtrl=new ProbeController(this.cameras.camera,this.track,this.renderer.domElement,this.devProbePanel,true);
}
const sun=new THREE.DirectionalLight(0xffffff,2.3);
sun.position.set(-20,35,18);
sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-60;
sun.shadow.camera.right=60;
sun.shadow.camera.top=60;
sun.shadow.camera.bottom=-60;
this.scene.add(sun);
window.addEventListener('resize',this.resize);
this.resize();
this.hud.bind({onRestart:()=>this.restart(),onCamera:()=>{if(!this.develop)this.cameras.next()},onAnalog:(name,value)=>this.input.setAnalog(name,value),onVirtual:(c,a)=>this.input.setVirtual(c,a),onSignalChange:(state)=>this.vehicle.setSignal(state),onSeatBelt:(on)=>this.vehicle.seatBeltFastened=on,onAutoDriveToggle:()=>this.toggleAutoDrive(),onWaypointRecordingStart:()=>this.startWaypointRecording(),onWaypointRecordingFinish:()=>this.finishWaypointRecording()})
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
if(!this.develop||this.autoDrive.enabled){
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

// Populate wheel positions from Vehicle3.wheelAssembly if available
const wheelPositions = this.vehicle instanceof Vehicle3 && this.vehicle.wheelAssembly
    ? {
        FL: this.vehicle.wheelAssembly.getWheel('FL').getWorldPosition(this.wheelTmp).clone(),
        FR: this.vehicle.wheelAssembly.getWheel('FR').getWorldPosition(this.wheelTmp).clone(),
        RL: this.vehicle.wheelAssembly.getWheel('RL').getWorldPosition(this.wheelTmp).clone(),
        RR: this.vehicle.wheelAssembly.getWheel('RR').getWorldPosition(this.wheelTmp).clone(),
      }
    : undefined;

const startToast=this.autoDrive.enabled ? undefined : this.exam.update({position:this.vehicle.root.position,frontPosition,wheelPositions,speedKmh:this.vehicle.getSpeedKmh(),rpm:this.vehicle.transmission.rpm,engineRunning:this.vehicle.transmission.running,stalled:this.vehicle.transmission.car.stalled,leftSignal:this.vehicle.signals.left,seatBeltFastened:this.vehicle.seatBeltFastened},this.track.startSignal?.phase??'idle',dt);
const added=this.exam.penalties.slice(penaltyCount);
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
this.hud.update({speedKmh:this.vehicle.getSpeedKmh(),gasPedal:this.vehicle.transmission.pedals.gas,brakePedal:this.vehicle.transmission.pedals.brake,gearWarnings:this.vehicle.transmission.car.warnings,engineStatus:this.vehicle.transmission.status,gear:this.vehicle.transmission.gear,clutch:this.vehicle.transmission.clutch,rpm:this.vehicle.transmission.rpm,steeringWheelAngle:this.vehicle.steeringSystem.steeringWheelAngle,steering:THREE.MathUtils.radToDeg(this.vehicle.steering),signals:{left:this.vehicle.signals.left,right:this.vehicle.signals.right,hazard:this.vehicle.signals.hazard},seatBelt:this.vehicle.seatBeltFastened,startLamp:this.exam.startLampOn,disqualified:this.exam.disqualified,disqualifyReason:this.exam.disqualifyReason,score:this.exam.score,elapsed:this.exam.elapsedSeconds,currentExercise:this.autoDrive.enabled?this.autoDrive.currentExerciseTitle:this.exam.currentExerciseTitle,penalties:this.exam.penalties,cameraMode:this.cameras.mode},this.exam.isFinished,this.exam.scoringMode);
if(startToast){
if(startToast==='Bắt đầu thi')this.track.startSignal?.goGreenNow();
if(this.exam.scoringMode==='normal')this.hud.flash(startToast,startToast.startsWith('Chào mừng')?{kind:'exam',durationMs:7000}:'exam');
if(startToast==='Lệnh xuất phát')try{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance('Xuất phát'))}catch{}}
this.cabin.render(this.renderer,this.scene,this.cameras.camera,this.vehicle,!this.develop&&this.cameras.mode===2)
};
loop()
}
private handlePenalties(){
if(this.exam.approaching)return;
const now=performance.now(),p=this.vehicle.root.position;
const locals=[new THREE.Vector3(-.95,0,1.25),new THREE.Vector3(.95,0,1.25),new THREE.Vector3(-.95,0,-1.3),new THREE.Vector3(.95,0,-1.3)];
for(const local of locals){
this.probe.copy(local).applyQuaternion(this.vehicle.root.quaternion).add(p);
for(let i=0;i<this.track.penaltyZones.length;i++){
if(this.track.penaltyZones[i].containsPoint(this.probe)){
const evt=this.exam.applyLinePenalty(i,now);
if(evt)this.hud.flash(evt.reason,'penalty')}}}}
restart(){
this.autoDrive?.stop();
this.input.setAutomationEnabled(false);
this.hud.setAutoDriveMode(false);
this.vehicle.reset();
this.exam.reset();
this.track.reset();
this.input.clearVirtual();
this.hud.clearNotices();
if(this.exam.scoringMode==='normal')this.hud.flash('Đã bắt đầu lại bài thi','exam')
}
    private toggleAutoDrive(){
if(this.autoDrive.enabled){
this.autoDrive.stop();
this.input.setAutomationEnabled(false);
this.vehicle.reset();this.exam.reset();this.track.reset();this.input.clearVirtual();
this.hud.setAutoDriveMode(false);
return;
}
this.vehicle.reset();this.exam.reset();this.track.reset();this.input.clearVirtual();
this.vehicle.seatBeltFastened=true;
this.input.setAutomationEnabled(true);
this.autoDrive.start(this.vehicle);
this.hud.setAutoDriveMode(true);
}
private startWaypointRecording(){
this.input.clearVirtual();
this.input.setAutomationEnabled(false);
this.autoDrive.beginWaypointRecording(this.vehicle);
this.hud.setWaypointRecordingCount(1);
}
private finishWaypointRecording(){
const route=this.autoDrive.finishWaypointRecording(this.vehicle);
this.input.setAutomationEnabled(true);
return route;
}
private resize=()=>{
const w=this.host.clientWidth,h=this.host.clientHeight;
this.renderer.setSize(w,h,false);
this.cameras.resize(w,h)
}
}
