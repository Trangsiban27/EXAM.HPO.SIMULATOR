import * as THREE from 'three';
import {Vehicle} from './Vehicle';
export class CameraManager{mode=0;
    readonly camera=new THREE.PerspectiveCamera(60,1,.1,500);
    private readonly followFocus=new THREE.Vector3();
    private readonly followOffset=new THREE.Vector3();
    private previousMode=-1;
    constructor(_develop?: boolean) {}
    next(){
        this.mode=(this.mode+1)%3
    }
    attach(domElement: HTMLElement) {
        // Camera renders into the shared renderer DOM element; nothing extra to mount.
        this.resize(domElement.clientWidth, domElement.clientHeight);
    }
    update(vehicle:Vehicle,dt:number,_input?: unknown){
        const root=vehicle.root;
        let target=new THREE.Vector3(),look=root.position.clone();
        const modeChanged=this.previousMode!==this.mode;
        const fov=this.mode===0?35:60;
        if(this.camera.fov!==fov){
            this.camera.fov=fov;
            this.camera.updateProjectionMatrix();
        }
        if(this.mode===0){
            look.y+=.7;
            if(modeChanged) this.followFocus.copy(look);
            else this.followFocus.lerp(look,1-Math.exp(-5*dt));
            // Fixed world-space angle: turning the car does not rotate the view.
            // View the left side (-X at spawn), 36 degrees above the ground.
            const portraitExtra=Math.max(0,(16/9)/this.camera.aspect-1)*9;
            this.followOffset.setFromSphericalCoords(42+portraitExtra,Math.PI*.3,-Math.PI*.5);
            look.copy(this.followFocus);
            target.copy(look).add(this.followOffset);
        } else if(this.mode===2){
            root.updateWorldMatrix(true,true);
            const visual=root.children.find(child=>child.type==='Group');
            const frame=visual??root;
            target.copy(frame.localToWorld(new THREE.Vector3(-.43,1.45,-.1)));
            look.copy(frame.localToWorld(new THREE.Vector3(-.43,1.4,-20)));
        } else{
            target.copy(root.position)
            .add(new THREE.Vector3(0,18,2));
            look.copy(root.position)
        }
        if(this.mode===0||this.mode===2||modeChanged) this.camera.position.copy(target);
        else this.camera.position.lerp(target,1-Math.exp(-5*dt));
        this.camera.position.y += vehicle.transmission.car.jolt * .06;
        this.camera.lookAt(look);
        this.previousMode=this.mode;
    }
    resize(w:number,h:number){
        this.camera.aspect=w/Math.max(1,h);
        this.camera.updateProjectionMatrix()
    }
}
