import * as THREE from 'three'; 
import { InputManager } from './InputManager'; 
import { ManualTransmission } from './ManualTransmission';
import { startPosition } from './startPosition';
import { SteeringSystem, steeringConfig, advanceVehicle } from './drivetrain/SteeringSystem';

export class Vehicle { 
    readonly steeringSystem = new SteeringSystem();
    readonly transmission = new ManualTransmission();
    readonly root = new THREE.Group(); 
    protected readonly visual = new THREE.Group();
    protected wheels: THREE.Mesh[] = []; 
    protected frontPivots: THREE.Group[] = []; 
    speed = 0; steering = 0;
    private speedLimitMps = Infinity;
    get maxAllowedSpeedMps(): number { return this.speedLimitMps; }
    seatBeltFastened = false;
    private signalState = { left: false, right: false, hazard: false };
    get signals(): Readonly<{ left: boolean; right: boolean; hazard: boolean }> { return this.signalState; }
    protected signalMaterials: { turn: THREE.MeshStandardMaterial[]; hazard: THREE.MeshStandardMaterial[] } = { turn: [], hazard: [] };
    private readonly maxForward = 24 / 3.6; // Convert km/h to m/s.
    private readonly maxReverse = -5; 
    private readonly acceleration = 7; 
    private readonly braking = 12; 
    private readonly drag = 2.1; 
    protected slopeAngle = 0;
    private readonly gravity = 9.81;
    private readonly slopeRollingResistance = .2;
    private readonly wheelBase = 2.65; 
    private readonly maxSteer = THREE.MathUtils.degToRad(31); 

    constructor() { 
        this.build(); 
        if (this.root.children.length) this.visual.add(...this.root.children);
        this.root.add(this.visual);
        this.placeAtStart();
    } 

    protected build() {
        // Local -Z is the front, matching the driving direction.
        const paint = new THREE.MeshStandardMaterial({ color: 0xf4f5f5, roughness: .28, metalness: .22 });
        const glass = new THREE.MeshStandardMaterial({ color: 0x092638, roughness: .16, metalness: .35 });
        const rubber = new THREE.MeshStandardMaterial({ color: 0x151719, roughness: .9 });
        const trim = new THREE.MeshStandardMaterial({ color: 0x101820, roughness: .4 });
        const chrome = new THREE.MeshStandardMaterial({ color: 0xbac5cc, roughness: .24, metalness: .8 });
        const lamp = new THREE.MeshStandardMaterial({ color: 0xe6f5ff, emissive: 0x9ec4dd, emissiveIntensity: .35 });
        const signalOff = new THREE.MeshBasicMaterial({ color: 0x6a4a08, toneMapped: true });
        const signalOn = new THREE.MeshBasicMaterial({ color: 0xffd24a, toneMapped: false });
        const hazardOff = new THREE.MeshBasicMaterial({ color: 0x6a1010, toneMapped: true });
        const hazardOn = new THREE.MeshBasicMaterial({ color: 0xff5050, toneMapped: false });
        const red = new THREE.MeshStandardMaterial({ color: 0xa60919, roughness: .25 });
        const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material,
            x: number, y: number, z: number, parent: THREE.Object3D = this.root) => {
            const item = new THREE.Mesh(geometry, material);
            item.position.set(x, y, z);
            item.castShadow = true;
            item.receiveShadow = true;
            parent.add(item);
            return item;
        };
        const box = (w: number, h: number, d: number, material: THREE.Material,
            x: number, y: number, z: number) => mesh(new THREE.BoxGeometry(w, h, d), material, x, y, z);
        const panel = (points: number[][], material: THREE.Material) => {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
            geometry.setIndex([0, 1, 2, 0, 2, 3]);
            geometry.computeVertexNormals();
            const surface = material.clone();
            surface.side = THREE.DoubleSide;
            return mesh(geometry, surface, 0, 0, 0);
        };
        const decal = (text: string, width: number, height: number, x: number, y: number,
            z: number, rotation: number, background = '#ffffff', color = '#103979', circled = false) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = background; ctx.fillRect(0, 0, 512, 256);
            ctx.fillStyle = color; ctx.strokeStyle = color;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.font = `bold ${circled ? 176 : 70}px Arial`;
            if (circled) { ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(256, 128, 112, 119, 0, 0, Math.PI * 2); ctx.stroke(); }
            const lines = text.split('\n');
            lines.forEach((line, i) => ctx.fillText(line, 256, 128 + (i - (lines.length - 1) / 2) * 85, 480));
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            const item = mesh(new THREE.PlaneGeometry(width, height),
                new THREE.MeshStandardMaterial({ map: texture, roughness: .55 }), x, y, z);
            item.rotation.y = rotation;
        };

        // Extruded side profile includes open wheel arches rather than solid fenders.
        const profile = new THREE.Shape();
        profile.moveTo(-2.12, .4);
        profile.lineTo(-2.15, .73); profile.quadraticCurveTo(-2.06, .96, -1.8, 1.0);
        profile.lineTo(-.85, 1.08); profile.lineTo(.95, 1.08);
        profile.lineTo(1.85, .98); profile.quadraticCurveTo(2.13, .91, 2.13, .65);
        profile.lineTo(2.08, .4); profile.lineTo(1.73, .4);
        profile.absarc(1.25, .4, .48, 0, Math.PI, false);
        profile.lineTo(-.82, .4);
        profile.absarc(-1.3, .4, .48, 0, Math.PI, false);
        profile.lineTo(-2.12, .4);
        const body = new THREE.ExtrudeGeometry(profile, { depth: 1.74, bevelEnabled: true,
            bevelSegments: 3, steps: 1, bevelSize: .035, bevelThickness: .035, curveSegments: 20 });
        body.translate(0, 0, -.87); body.rotateY(-Math.PI / 2);
        mesh(body, paint, 0, 0, 0);

        // Sloping windshield, tapered roof, and separate rear screen.
        panel([[-.84, 1.08, -.85], [.84, 1.08, -.85], [.67, 1.62, -.22], [-.67, 1.62, -.22]], glass);
        panel([[-.67, 1.62, .72], [.67, 1.62, .72], [.83, 1.08, 1.38], [-.83, 1.08, 1.38]], glass);
        box(1.38, .07, .98, paint, 0, 1.64, .25);
        for (const side of [-1, 1]) {
            panel([[side * .85, 1.07, -.84], [side * .68, 1.61, -.21],
                [side * .68, 1.61, .72], [side * .85, 1.07, 1.37]], paint);
            panel([[side * .855, 1.12, -.68], [side * .705, 1.56, -.18],
                [side * .705, 1.56, .28], [side * .855, 1.12, .28]], glass);
            panel([[side * .855, 1.12, .36], [side * .705, 1.56, .36],
                [side * .705, 1.56, .68], [side * .855, 1.12, 1.2]], glass);
            box(.055, .04, 1.94, chrome, side * .887, 1.065, .28);
            box(.07, .055, .2, paint, side * .91, .94, .16);
            box(.07, .055, .2, paint, side * .91, .94, .99);
            box(.16, .065, .11, trim, side * .94, 1.11, -.65);
            const mirror = mesh(new THREE.SphereGeometry(1, 16, 10), paint, side * 1.04, 1.16, -.65);
            mirror.scale.set(.17, .09, .12);
            box(.035, .065, 1.5, trim, side * .9, .43, -.02);
            decal('TẬP LÁI', .44, .14, side * .908, 1.0, -.44, side * Math.PI / 2, '#123a88', '#ffffff');
            decal('HIỆP PHÁT\nĐÀO TẠO LÁI XE', .66, .26, side * .908, .73, -.3, side * Math.PI / 2);
            decal('29', .52, .43, side * .908, .78, .69, side * Math.PI / 2, '#f4f5f5', '#ae1020', true);
        }
        box(1.3, .31, .055, trim, 0, .6, -2.15);
        for (let i = 0; i < 4; i++) box(1.24 - i * .06, .018, .015, chrome, 0, .48 + i * .075, -2.185);
        box(1.25, .085, .05, trim, 0, .91, -2.12);
        for (const side of [-1, 1]) {
            const headlight = box(.47, .12, .11, lamp, side * .63, .92, -2.04);
            headlight.rotation.y = side * .18;
            box(.2, .19, .05, trim, side * .73, .57, -2.12);
            const fog = mesh(new THREE.SphereGeometry(.06, 12, 8), lamp, side * .73, .56, -2.155);
            fog.scale.z = .3;
            box(.43, .15, .09, red, side * .65, .87, 2.09);
        }
        // Corner turn-signal housings: amber lens inside a black bezel, mounted at the
        // outer corners of the front and rear bumpers — beside the headlights in
        // front and beside the tail-lights in back. This is where turn signals
        // sit on a real car, so the look reads correctly from every camera.
        const housingMat = new THREE.MeshStandardMaterial({ color: 0x06090c, roughness: .5, metalness: .3 });
// ── zSign makes the lens face outward from the car body at both ends ──
        const zOut = (z: number) => z + Math.sign(z) * .026;

        const buildCornerTurn = (x: number, y: number, z: number) => {
            // Black recessed bezel.
            mesh(new THREE.BoxGeometry(.3, .16, .05), housingMat, x, y, z);
            // Amber turn-signal lens: offset outward so it faces the camera/viewer.
            const lens = box(.24, .11, .035, signalOff.clone(), x, y, zOut(z));
            return lens.material as THREE.MeshStandardMaterial;
        };
        // Center hazard/DRL bar: 5 red LED segments across each bumper, also
        // offset outward so they're visible from behind the car.
        const buildHazardBar = (z: number): THREE.MeshStandardMaterial[] => {
            mesh(new THREE.BoxGeometry(.85, .075, .045), housingMat, 0, .95, z);
            const lenses: THREE.MeshStandardMaterial[] = [];
            for (let i = -2; i <= 2; i++) {
                const lens = box(.13, .055, .03, hazardOff.clone(), i * .155, .95, zOut(z));
                lenses.push(lens.material as THREE.MeshStandardMaterial);
            }
            return lenses;
        };

        const signalMats: THREE.MeshStandardMaterial[] = [];
        const hazardLenses: THREE.MeshStandardMaterial[] = [];
        // 4 corner turn-signal lenses: front-left, rear-left, front-right, rear-right.
        signalMats.push(buildCornerTurn(-.86, .92, -2.16));
        signalMats.push(buildCornerTurn(-.86, .92, 2.16));
        signalMats.push(buildCornerTurn(.86, .92, -2.16));
        signalMats.push(buildCornerTurn(.86, .92, 2.16));
        // 10 hazard LED segments: 5 at the front bumper, 5 at the rear.
        hazardLenses.push(...buildHazardBar(-2.185));
        hazardLenses.push(...buildHazardBar(2.185));
        this.signalMaterials = { turn: signalMats, hazard: hazardLenses };
        const badge = mesh(new THREE.TorusGeometry(.07, .012, 8, 24), chrome, 0, .91, -2.16);
        badge.scale.x = 1.35;
        decal('51K\n147.14', .3, .23, 0, .65, -2.19, Math.PI, '#ffffff', '#101820');
        decal('51K - 147.14', .48, .12, 0, .66, 2.145, 0, '#ffffff', '#101820');
        for (const x of [-.48, .48]) box(.09, .11, .27, trim, x, 1.72, .25);
        box(1.24, .22, .31, paint, 0, 1.85, .25);
        decal('HIỆP PHÁT', 1.1, .17, 0, 1.85, .089, Math.PI, '#8ec5e5');
        decal('TẬP LÁI', 1.1, .17, 0, 1.85, .411, 0, '#8ec5e5');
        for (const x of [-.44, 0, .44]) {
            mesh(new THREE.CylinderGeometry(.08, .09, .03, 16), chrome, x, 1.98, .25);
            const beacon = mesh(new THREE.SphereGeometry(.085, 16, 12),
                x === 0 ? new THREE.MeshStandardMaterial({ color: 0xffae08, roughness: .25 }) : red,
                x, 2.045, .25);
            beacon.scale.y = 1.2;
        }
        const wheelGeo = new THREE.CylinderGeometry(.36, .36, .22, 32);
        wheelGeo.rotateZ(Math.PI / 2);
        for (const x of [-.94, .94]) for (const z of [-1.3, 1.25]) {
            const pivot = new THREE.Group(); pivot.position.set(x, .36, z);
            const wheel = mesh(wheelGeo, rubber, 0, 0, 0, pivot);
            const rimGeo = new THREE.CylinderGeometry(.255, .255, .012, 24);
            rimGeo.rotateZ(Math.PI / 2);
            mesh(rimGeo, trim, Math.sign(x) * .117, 0, 0, wheel);
            const rim = mesh(new THREE.TorusGeometry(.245, .022, 8, 32), chrome, Math.sign(x) * .126, 0, 0, wheel);
            rim.rotation.y = Math.PI / 2;
            for (let i = 0; i < 8; i++) {
                const angle = i * Math.PI / 4;
                const spoke = mesh(new THREE.BoxGeometry(.018, .035, .41), chrome, Math.sign(x) * .13, 0, 0, wheel);
                spoke.rotation.x = angle;
            }
            const hubGeo = new THREE.CylinderGeometry(.07, .07, .025, 16);
            hubGeo.rotateZ(Math.PI / 2);
            mesh(hubGeo, chrome, Math.sign(x) * .14, 0, 0, wheel);
            this.root.add(pivot); this.wheels.push(wheel);
            if (z < 0) this.frontPivots.push(pivot);
        }
    }
        followSurface(heightAt: (x: number, z: number) => number) {
            const sample = (x: number, z: number) => {
                const point = new THREE.Vector3(x, 0, z).applyQuaternion(this.root.quaternion).add(this.root.position);
                return heightAt(point.x, point.z);
            };
            const front = sample(0, -1.3), rear = sample(0, 1.25);
            const left = sample(-.94, 0), right = sample(.94, 0);
            this.slopeAngle = Math.atan2(front - rear, 2.55);
            this.root.position.y = (front + rear) / 2;
            this.visual.rotation.set(this.slopeAngle + this.transmission.car.jolt * .12 + this.transmission.car.vibration, 0, Math.atan2(right - left, 1.88));
        }

    reset() {
        this.transmission.reset();
        this.steeringSystem.reset();
        this.placeAtStart();
        this.visual.rotation.set(0, 0, 0);
        this.slopeAngle = 0;
        this.speed = 0; this.steering = 0;
        this.speedLimitMps = Infinity;
        this.seatBeltFastened = false;
        this.signalState = { left: false, right: false, hazard: false };
        for (const m of this.signalMaterials.turn) m.color.setHex(0x6a4a08);
        for (const m of this.signalMaterials.hazard) m.color.setHex(0x6a1010);
    }
    private placeAtStart() {
        this.root.position.set(startPosition.lineX - startPosition.distance, 0,
            startPosition.lineZ + startPosition.laneOffset);
        this.root.rotation.set(0, startPosition.heading, 0);
    }
    setSignal(next: { left: boolean; right: boolean; hazard: boolean }) {
        this.signalState = { ...next };
    }
    setSpeedLimitKmh(limitKmh?: number): void {
        const limitMps = limitKmh === undefined ? Infinity : limitKmh / 3.6;
        if (this.speedLimitMps === limitMps) return;
        this.speedLimitMps = limitMps;
        this.speed = THREE.MathUtils.clamp(this.speed, -limitMps, limitMps);
        this.transmission.car.physics.speed = THREE.MathUtils.clamp(
            this.transmission.car.physics.speed, -limitMps, limitMps);
    }
    protected capManualSpeed(speed: number): number {
        const limited = THREE.MathUtils.clamp(speed, -this.speedLimitMps, this.speedLimitMps);
        this.transmission.car.physics.speed = limited;
        return limited;
    }
    // Standard automotive cadence: ~1.1 Hz blink (~550 ms on, ~550 ms off).
    protected updateSignalBlink() {
        const cycle = performance.now() % 1100;
        const on = cycle < 550;
        const onColor = on ? 0xffd24a : 0x6a4a08;
        const onHazard = on ? 0xff5050 : 0x6a1010;
        // signalMaterials.turn[0]=front-left, [1]=rear-left, [2]=front-right, [3]=rear-right
        if (this.signals.left) {
            this.signalMaterials.turn[0].color.setHex(onColor);
            this.signalMaterials.turn[1].color.setHex(onColor);
        } else {
            this.signalMaterials.turn[0].color.setHex(0x6a4a08);
            this.signalMaterials.turn[1].color.setHex(0x6a4a08);
        }
        if (this.signals.right) {
            this.signalMaterials.turn[2].color.setHex(onColor);
            this.signalMaterials.turn[3].color.setHex(onColor);
        } else {
            this.signalMaterials.turn[2].color.setHex(0x6a4a08);
            this.signalMaterials.turn[3].color.setHex(0x6a4a08);
        }
        // Hazard blinks all 4 hazard lenses simultaneously.
        const hazardColor = this.signals.hazard ? onHazard : 0x6a1010;
        for (const m of this.signalMaterials.hazard) m.color.setHex(hazardColor);
    }
    /** Direct movement used by the guided auto-drive mode; skips engine, gear and clutch simulation. */
    updateAutomatic(dt: number, steeringInput: number, speed: number) {
        this.updateAutomaticMotion(dt, steeringInput, speed);
        for (const wheel of this.wheels) wheel.rotation.x -= this.speed / steeringConfig.wheelRadius * dt;
    }
    protected updateAutomaticMotion(dt: number, steeringInput: number, speed: number) {
        this.steeringSystem.update(dt, 0, this.speed,
            THREE.MathUtils.clamp(steeringInput, -1, 1) * steeringConfig.maxSteeringWheelAngle);
        this.steering = this.steeringSystem.centerSteerAngle;
        this.speed = THREE.MathUtils.clamp(speed, -this.speedLimitMps, this.speedLimitMps);
        const pose = advanceVehicle(this.root.position.x, this.root.position.z, this.root.rotation.y, this.speed, this.steering, dt);
        this.root.position.x = pose.x; this.root.position.z = pose.z; this.root.rotation.y = pose.heading;
        for (const pivot of this.frontPivots) pivot.rotation.y = -(pivot.position.x < 0 ? this.steeringSystem.frontLeftAngle : this.steeringSystem.frontRightAngle);
        this.updateSignalBlink();
    }
    update(dt: number, input: InputManager) { 
            const left = input.isDown('KeyA') || input.isDown('ArrowLeft');
            const right = input.isDown('KeyD') || input.isDown('ArrowRight');
            const dragging = input.getAnalog('steeringActive') === 1;
            this.steeringSystem.update(dt, Number(right) - Number(left), this.speed,
                dragging ? ((input.getAnalog('steering') ?? .5) * 2 - 1) * steeringConfig.maxSteeringWheelAngle : undefined);
            this.steering = this.steeringSystem.centerSteerAngle;
            this.speed = this.capManualSpeed(this.transmission.update(dt, input, this.speed,
                this.slopeAngle, this.speedLimitMps));
            const pose = advanceVehicle(this.root.position.x, this.root.position.z, this.root.rotation.y, this.speed, this.steering, dt);
            this.root.position.x = pose.x; this.root.position.z = pose.z; this.root.rotation.y = pose.heading;
            for (const pivot of this.frontPivots) pivot.rotation.y = -(pivot.position.x < 0 ? this.steeringSystem.frontLeftAngle : this.steeringSystem.frontRightAngle);
            for (const wheel of this.wheels) wheel.rotation.x -= this.speed / steeringConfig.wheelRadius * dt;
            this.updateSignalBlink();
        }
                getSpeedKmh() { return Math.abs(this.speed) * 3.6 } }
