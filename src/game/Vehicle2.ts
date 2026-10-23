import * as THREE from 'three';
import { Vehicle } from './Vehicle';

/** Alternative exam sedan. Inherits the original drivetrain, steering and controls. */
export class Vehicle2 extends Vehicle {
    protected override build() {
        this.root.name = 'vehicle2-exam-sedan';
        const paint = new THREE.MeshStandardMaterial({ color: 0xf3f4f1, metalness: .35, roughness: .23 });
        const glass = new THREE.MeshStandardMaterial({ color: 0x243438, metalness: .45, roughness: .14 });
        const black = new THREE.MeshStandardMaterial({ color: 0x131719, roughness: .7 });
        const chrome = new THREE.MeshStandardMaterial({ color: 0xbcc5cb, metalness: .85, roughness: .22 });
        const lamp = new THREE.MeshStandardMaterial({ color: 0xe4efff, emissive: 0x819cb5, emissiveIntensity: .4 });
        const tail = new THREE.MeshStandardMaterial({ color: 0xae111b, emissive: 0x690510, emissiveIntensity: .3 });
        const mesh = (name: string, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = this.root) => {
            const item = new THREE.Mesh(geometry, material); item.name=name; item.position.set(x,y,z);
            item.castShadow=true; item.receiveShadow=true; parent.add(item); return item;
        };
        const box = (name: string, w: number,h: number,d: number,x: number,y: number,z: number, material: THREE.Material=paint, parent: THREE.Object3D=this.root) => mesh(name,new THREE.BoxGeometry(w,h,d),material,x,y,z,parent);
        const panel = (name: string, points: number[][], material: THREE.MeshStandardMaterial) => {
            const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();
            const m=material.clone();m.side=THREE.DoubleSide;return mesh(name,g,m,0,0,0);
        };
        const label = (name: string,text: string,w: number,h: number,x: number,y: number,z: number,rotation=0,circle=false) => {
            const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
            const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,512,256);
            ctx.fillStyle=circle?'#1244bc':'#f4f5f2';
            if(circle){ctx.beginPath();ctx.ellipse(256,128,124,124,0,0,Math.PI*2);ctx.fill();}
            else ctx.fillRect(0,0,512,256);
            ctx.fillStyle=circle?'#fff':name.includes('Plate')?'#111':'#123aa1';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${circle?170:70}px Arial`;ctx.fillText(text,256,135,490);
            const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
            const item=mesh(name,new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:texture,transparent:circle,roughness:.5}),x,y,z);item.rotation.y=rotation;return item;
        };
        // Sculpted side outline with open arches at the original wheel contact points.
        const outline=new THREE.Shape();
        outline.moveTo(-2.2,.42);outline.lineTo(-2.2,.69);outline.quadraticCurveTo(-2.12,.91,-1.75,.96);
        outline.lineTo(-.85,1.02);outline.lineTo(.95,1.01);outline.lineTo(1.8,.97);outline.quadraticCurveTo(2.21,.94,2.21,.68);
        outline.lineTo(2.21,.42);outline.lineTo(1.68,.42);outline.absarc(1.25,.42,.43,0,Math.PI,false);
        outline.lineTo(-.87,.42);outline.absarc(-1.3,.42,.43,0,Math.PI,false);outline.lineTo(-2.2,.42);
        const body=new THREE.ExtrudeGeometry(outline,{depth:1.74,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:3,curveSegments:24,steps:1});
        body.translate(0,0,-.87);body.rotateY(-Math.PI/2);mesh('SedanBody',body,paint,0,0,0);
        panel('Windshield',[[-.83,1.02,-.86],[.83,1.02,-.86],[.65,1.45,-.25],[-.65,1.45,-.25]],glass);
        panel('RearWindow',[[-.65,1.45,.61],[.65,1.45,.61],[.81,1.01,1.35],[-.81,1.01,1.35]],glass);
        box('Roof',1.32,.05,.91,0,1.45,.18);
        for(const side of [-1,1]) {
            panel('CabinFrame',[[side*.84,1,-.85],[side*.66,1.45,-.25],[side*.66,1.45,.62],[side*.84,1,1.36]],paint);
            panel('FrontSideGlass',[[side*.849,1.04,-.74],[side*.679,1.41,-.23],[side*.679,1.41,.17],[side*.849,1.04,.17]],glass);
            panel('RearSideGlass',[[side*.849,1.04,.24],[side*.679,1.41,.24],[side*.679,1.41,.59],[side*.849,1.04,1.19]],glass);
            box('WindowTrim',.022,.022,1.85,side*.88,1.025,.14,chrome);
            for(const z of [.05,.93]) box('DoorHandle',.045,.036,.18,side*.903,.92,z);
            for(const z of [.23,1.22]) box('DoorSeam',.008,.43,.008,side*.894,.72,z,black);
            box('Sill',.03,.055,1.6,side*.89,.43,.03);
            const mirror=mesh('WingMirror',new THREE.SphereGeometry(1,16,10),paint,side*1.04,1.09,-.62);mirror.scale.set(.16,.085,.12);
            box('MirrorMount',.13,.04,.08,side*.92,1.06,-.62,black);
            label('DoorNumber','01',.66,.44,side*.901,.73,-.25,side*Math.PI/2,true);
            const head=box('Headlight',.48,.14,.08,side*.59,.88,-2.08,lamp);head.rotation.y=side*.18;
            mesh('Projector',new THREE.SphereGeometry(.057,16,10),chrome,side*.62,.89,-2.137).scale.z=.35;
            box('FogRecess',.19,.17,.035,side*.72,.52,-2.2,black);
            mesh('FogLamp',new THREE.SphereGeometry(.045,12,8),lamp,side*.72,.52,-2.225).scale.z=.3;
            box('TailLight',.44,.17,.065,side*.63,.87,2.16,tail);
            box('RearReflector',.22,.04,.025,side*.68,.46,2.22,tail);
        }
        box('UpperGrille',.95,.08,.04,0,.9,-2.18,black);
        box('GrilleChrome',1.1,.017,.03,0,.945,-2.19,chrome);
        box('LowerGrille',1.22,.26,.045,0,.55,-2.205,black);
        for(let i=0;i<5;i++)box('GrilleSlat',1.13,.012,.01,0,.45+i*.044,-2.235,chrome);
        label('FrontPlate','HIỆP PHÁT',.49,.16,0,.64,-2.24,Math.PI);
        label('RearPlate','HIỆP PHÁT',.49,.16,0,.73,2.225);
        const hood=label('HoodNumber','01',.65,.43,0,1.007,-1.4,0,true);hood.rotation.x=-Math.PI/2;
        box('RoofSign',.95,.19,.25,0,1.585,.15);
        label('RoofTitleFront','XE SÁT HẠCH',.92,.17,0,1.585,.018,Math.PI);
        label('RoofTitleRear','XE SÁT HẠCH',.92,.17,0,1.585,.282);
        for(const [i,color] of [0xf51c27,0xffc20b,0x1655ff].entries()) {
            box('BeaconBase',.17,.025,.17,(i-1)*.27,1.7,.15,black);
            const beacon=mesh('RoofBeacon',new THREE.SphereGeometry(.077,16,12),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.5,roughness:.2}),(i-1)*.27,1.77,.15);beacon.scale.y=1.1;
        }
        // Preserve wheel centres/radius to match inherited steering and collision probes.
        for(const x of [-.94,.94])for(const z of [-1.3,1.25]) {
            const pivot=new THREE.Group();pivot.name=z<0?'FrontSteeringPivot':'RearWheelPivot';pivot.position.set(x,.36,z);this.root.add(pivot);
            const tire=new THREE.CylinderGeometry(.36,.36,.22,32);tire.rotateZ(Math.PI/2);
            const wheel=mesh('Tire',tire,black,0,0,0,pivot);this.wheels.push(wheel);if(z<0)this.frontPivots.push(pivot);
            const rim=new THREE.CylinderGeometry(.25,.25,.025,24);rim.rotateZ(Math.PI/2);mesh('AlloyRim',rim,chrome,Math.sign(x)*.12,0,0,wheel);
            for(let i=0;i<10;i++) {
                const a=i*Math.PI/5;
                const spoke=box('AlloySpoke',.025,.025,.22,Math.sign(x)*.14,Math.sin(a)*.115,Math.cos(a)*.115,chrome,wheel);spoke.rotation.x=-a;
            }
        }
        const turns: THREE.MeshStandardMaterial[]=[];
        for(const side of [-1,1])for(const z of [-2.21,2.21]) {
            const material=new THREE.MeshStandardMaterial({color:0x6a4a08});
            box('TurnSignal',.14,.065,.025,side*.79,.83,z,material);turns.push(material);
        }
        this.signalMaterials={turn:turns,hazard:[]};
    }
    protected override updateSignalBlink() {
        const on=performance.now()%700<350;
        this.updateSignalTick(this.signals.left || this.signals.right || this.signals.hazard, on);
        this.signalMaterials.turn.forEach((material,index)=>{
            const active=this.signals.hazard||(index<2?this.signals.left:this.signals.right);
            material.color.setHex(active&&on?0xffd24a:0x6a4a08);
            material.emissive.setHex(active&&on?0xffa000:0);
        });
    }
    override reset() {
        super.reset();
        this.signalMaterials.turn.forEach(material=>material.emissive.setHex(0));
    }
}
