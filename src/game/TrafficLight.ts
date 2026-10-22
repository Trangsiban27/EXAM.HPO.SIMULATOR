import * as THREE from 'three';

export interface IntersectionScoringGeometry {
    stopBar: THREE.Object3D;
    exitBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

/** Configuration for {@link TrafficLight}. Optional fields fall back to the legacy defaults
 *  (yellow line at local Z = 7, trigger from Z = 0 to 7, no marker). */
export interface TrafficLightOptions {
    /** Local Z of the yellow stop line (pole sits at local Z = 0). Default `7`. */
    stopLineZ?: number;
    /** Local Z where the trigger zone starts (vehicle crossing this point activates the signal). Default `0`. */
    triggerStart?: number;
    /** Length of the trigger window along local Z. Default `stopLineZ - triggerStart`. */
    triggerLength?: number;
    /** Local X of the yellow stop-line center. Default `-width + 1`. */
    stopLineX?: number;
    /** Length of the yellow stop line along local X. Default `4`. */
    stopLineLength?: number;
    /** Draw the yellow stop line as separate dashes. Default `false`. */
    stopLineDashed?: boolean;
    /** Show the stop-line mesh. Default `true`. */
    showStopLine?: boolean;
    /** Show the debug mesh for the trigger area. Detection stays active. Default `false`. */
    showTriggerZone?: boolean;
    /** Local X where the trigger zone starts. Default `stopLineX - stopLineHalfWidth`. */
    triggerStartX?: number;
    /** Length of the trigger window along local X. Default `2 * stopLineHalfWidth`. */
    triggerLengthX?: number | any;
    /** Road-side boundary of a curved trigger zone, expressed as local X for each local Z. */
    triggerMaxXAtZ?: (localZ: number) => number;
    /** Move only the physical pole and signal head along local X. */
    poleOffsetX?: number;
    /** Move only the physical pole and signal head along local Z. */
    poleOffsetZ?: number;
    /** Compact three-lens housing with a countdown display. */
    realisticHead?: boolean;
    /** Marker ID surfaced to {@link TrafficLight.onMarkerTriggered} (e.g. `'A'`, `'START'`). Default `undefined`. */
    markerId?: string;
    /** Giữ đèn xanh suốt, không chờ trigger và không quay lại đỏ. */
    alwaysGreen?: boolean;
    scoring?: IntersectionScoringGeometry;
}

/** Vehicle-triggered signal. Local -Z points toward the intersection. */
export class TrafficLight {
    readonly root = new THREE.Group();
    private elapsed = 0;
    private active = false;
    /** Marker ID surfaced to {@link TrafficLight.onMarkerTriggered} (e.g. `'A'`, `'START'`, `'SOUTH'`). Default `undefined`. */
    readonly markerId?: string;
    /** Local Z of the yellow stop line (pole sits at local Z = 0). Exposed for Exam05South to compute world-space stop line. */
    readonly stopLineZ: number;
    private readonly triggerStart: number;
    private readonly triggerLength: number;
    /** Local X of the yellow stop-line center (matches the box() drawn in the constructor). */
    readonly stopLineX: number;
    /** Half-width of the yellow stop line along local X (matches the box() drawn in the constructor). */
    readonly stopLineHalfWidth: number;
    /** Local X where the trigger zone starts (vehicle crossing this point activates the signal). */
    private readonly triggerStartX: number;
    /** Length of the trigger window along local X. */
    private readonly triggerLengthX: number | any;
    private readonly triggerMaxXAtZ?: (localZ: number) => number;
    private readonly realisticHead: boolean;
    readonly alwaysGreen: boolean;
    readonly scoring?: IntersectionScoringGeometry;
    /** Length of the yellow stop line along local X (matches the box() drawn in the constructor). */
    readonly stopLineLength: number;
    /** Optional callback fired the first time a vehicle enters the trigger zone. Receives the marker ID. */
    onMarkerTriggered?: (id: string) => void;
    // The signal is viewed from both camera modes, so its flat lenses must
    // render from either side of the plane.
    private readonly red = new THREE.MeshStandardMaterial({
        color: 0x431013,
        emissive: 0xff1824,
        side: THREE.DoubleSide
    });
    private readonly green = new THREE.MeshStandardMaterial({
        color: 0x103823,
        emissive: 0x16ff68,
        side: THREE.DoubleSide
    });
    private readonly yellow = new THREE.MeshStandardMaterial({
        color: 0x392c0b,
        emissive: 0xffbf00,
        roughness: .5,
        side: THREE.DoubleSide,
    });
    private readonly canvas = document.createElement('canvas');
    private readonly texture: THREE.CanvasTexture;
    private display = '';
    private readonly probe = new THREE.Vector3();

    /** Red phase length (s). Vehicle-triggered signal stays red this long then goes green. */
    static readonly RED_DURATION_SEC = 15;
    /** Green phase length (s). */
    static readonly GREEN_DURATION_SEC = 10;
    static readonly YELLOW_DURATION_SEC = 3;
    /** Total cycle length (s) = RED + GREEN + YELLOW. */
    static get CYCLE_SEC(): number {
        return TrafficLight.RED_DURATION_SEC + TrafficLight.GREEN_DURATION_SEC + TrafficLight.YELLOW_DURATION_SEC;
    }

    get phase(): 'idle' | 'red' | 'green' | 'yellow' {
        if (!this.active) return 'idle';
        if (this.elapsed < TrafficLight.RED_DURATION_SEC) return 'red';
        if (this.elapsed < TrafficLight.RED_DURATION_SEC + TrafficLight.GREEN_DURATION_SEC) return 'green';
        return 'yellow';
    }

    get remainingSeconds() {
        if (!this.active) return 0;
        const phaseEnd = this.phase === 'red' ? TrafficLight.RED_DURATION_SEC
            : this.phase === 'green' ? TrafficLight.RED_DURATION_SEC + TrafficLight.GREEN_DURATION_SEC
                : TrafficLight.CYCLE_SEC;
        return Math.ceil(phaseEnd - this.elapsed);
    }

    constructor(x: number, z: number, private readonly width = 8, direction: 'vertical' | 'horizontal' | number = 'vertical', options: TrafficLightOptions = {}) {
        this.root.name = 'vehicle-triggered-traffic-light';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = typeof direction === 'number' ? direction : direction === 'horizontal' ? -Math.PI / 2 : 0;

        const stopLineZ = options.stopLineZ ?? 7;
        const triggerStart = options.triggerStart ?? 0;
        // Caller may pin the trigger window to the stop line (stopLineZ === triggerStart).
        // In that case widen the window back to the pole (local Z = 0) so vehicles crossing
        // the lane on their way to the line still trip the sensor. Explicit triggerLength
        // always wins.
        const defaultLength = stopLineZ === triggerStart
            ? stopLineZ              // [triggerStart, stopLineZ] covers pole → yellow line
            : (stopLineZ - triggerStart);
        this.markerId = options.markerId;
        this.stopLineZ = stopLineZ;
        this.triggerStart = triggerStart;
        this.triggerLength = options.triggerLength ?? 2;
        // Mirror the geometry of the yellow box(stopLineLength, .012, .12, -stopLineX, .09, stopLineZ, ...)
        // drawn below so the trigger zone in update() lines up with the visible line.
        const stopLineLength = options.stopLineLength ?? 4;
        this.stopLineLength = stopLineLength;
        this.stopLineHalfWidth = stopLineLength / 2;
        this.stopLineX = options.stopLineX ?? -width + 1;
        // Default trigger window along local X spans the full stop line. Caller can pin
        // triggerStartX/triggerLengthX for non-rectangular footprints.
        this.triggerStartX = options.triggerStartX ?? (this.stopLineX - this.stopLineHalfWidth);
        this.triggerLengthX = options.triggerLengthX ?? (this.stopLineHalfWidth * 2);
        this.triggerMaxXAtZ = options.triggerMaxXAtZ;
        this.realisticHead = options.realisticHead ?? false;
        this.alwaysGreen = options.alwaysGreen ?? false;
        this.scoring = options.scoring;
        if (this.realisticHead) {
            this.green.color.setHex(0x124943);
            this.green.emissive.setHex(0x19ffe1);
        }

        const dark = new THREE.MeshStandardMaterial({ color: 0x20272d, roughness: .6 });
        const metal = new THREE.MeshStandardMaterial({ color: 0x9da8b0, metalness: .6, roughness: .4 });

        const signalVisual = new THREE.Group();
        signalVisual.name = 'traffic-light-visual';
        signalVisual.position.z = options.poleOffsetZ ?? 0;
        this.root.add(signalVisual);

        const box = (w: number, h: number, d: number, px: number, y: number, pz: number,
            material: THREE.Material, parent: THREE.Object3D = this.root) => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
            mesh.position.set(px, y, pz);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            parent.add(mesh);
        };

        // Road arrows place incoming traffic on local -X; keep the post outside that lane.
        const poleX = -width / 2 - .55 + (options.poleOffsetX ?? 0);

        // The side panel faces inward from the roadside post toward the lane.
        const faces = [
            { offsetX: 0, offsetZ: .211, rotationY: 0, lensRadius: .25, timerSize: [.85, .425] },
            { offsetX: 0, offsetZ: -.211, rotationY: Math.PI, lensRadius: .25, timerSize: [.85, .425] },
            { offsetX: .411, offsetZ: 0, rotationY: Math.PI / 2, lensRadius: .18, timerSize: [.4, .2] }
        ] as const;
        
        if (this.realisticHead) {
            box(.12, 3.7, .12, poleX, 1.85, 0, metal, signalVisual);
            box(.48, 1.2, .32, poleX, 3.58, 0, dark, signalVisual);
            const bezel = new THREE.MeshStandardMaterial({ color: 0x080d0e, roughness: .6 });
            for (const [y, material] of [[3.94, this.red], [3.58, this.yellow], [3.22, this.green]] as const) {
                const rim = new THREE.Mesh(new THREE.CircleGeometry(.185, 40), bezel);
                rim.position.set(poleX, y, .169);
                signalVisual.add(rim);
                const lens = new THREE.Mesh(new THREE.SphereGeometry(.15, 32, 16), material);
                lens.scale.z = .2;
                lens.position.set(poleX, y, .176);
                signalVisual.add(lens);
                box(.38, .025, .16, poleX, y + .19, .23, dark, signalVisual);
            }
        } else {
            box(.16, 3.6, .16, poleX, 1.8, 0, metal, signalVisual);
            box(.8, 1.6, .4, poleX, 3.45, 0, dark, signalVisual);
            for (const face of faces) {
                for (const [y, material] of [[3.98, this.red], [3.45, this.yellow], [2.92, this.green]] as const) {
                    const lens = new THREE.Mesh(new THREE.CircleGeometry(face.lensRadius, 32), material);
                    lens.position.set(poleX + face.offsetX, y, face.offsetZ);
                    lens.rotation.y = face.rotationY;
                    signalVisual.add(lens);
                }
            }
        }
        
        // Keep every dash inside the requested stop-line span. Other signals
        // retain their original solid marking unless explicitly configured.
        if (options.showStopLine ?? true) {
            const stopLineMaterial = new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: .8 });
            if (options.stopLineDashed) {
                const dashLength = .45;
                const dashGap = .25;
                const dashCount = Math.max(1, Math.floor((stopLineLength + dashGap) / (dashLength + dashGap)));
                const actualDashLength = Math.min(dashLength, stopLineLength / dashCount);
                const paintedLength = dashCount * actualDashLength + (dashCount - 1) * dashGap;
                const firstDashX = this.stopLineX - paintedLength / 2 + actualDashLength / 2;
                for (let i = 0; i < dashCount; i++) {
                    box(actualDashLength, .012, .12,
                        firstDashX + i * (actualDashLength + dashGap), .09, stopLineZ,
                        stopLineMaterial);
                }
            } else {
                box(stopLineLength, .012, .12, this.stopLineX, .09, stopLineZ, stopLineMaterial);
            }
        }

        // Debug marker: paint the trigger zone in semi-transparent red so the
        // trigger footprint is visible in the scene. The X extent is the full
        // trigger window (triggerLengthX); the Z extent matches triggerStart..triggerLength.
        // When either axis collapses to 0 we still draw a thin slab so the
        // marker stays visible (helps spot mis-configured sensors).
        if (options.showTriggerZone ?? false) {
            const triggerWidth = Math.max(this.triggerLengthX, .5);
            const triggerDepth = Math.max(this.triggerLength, .5);
            const triggerMaterial = new THREE.MeshBasicMaterial({
                color: 0xff2030,
                transparent: true,
                opacity: .35,
                depthWrite: false,
                side: THREE.DoubleSide,
            });
            let triggerMarker: THREE.Mesh;
            if (this.triggerMaxXAtZ) {
                // Follow the same curb edge used by hit detection, so the visible
                // zone reaches the bend without extending beneath the grass.
                const outline = new THREE.Shape();
                outline.moveTo(this.triggerStartX, -this.triggerStart);
                const steps = 32;
                for (let i = 0; i <= steps; i++) {
                    const localZ = this.triggerStart + this.triggerLength * i / steps;
                    outline.lineTo(this.triggerMaxXAtZ(localZ), -localZ);
                }
                outline.lineTo(this.triggerStartX, -(this.triggerStart + this.triggerLength));
                outline.closePath();
                const geometry = new THREE.ShapeGeometry(outline);
                geometry.rotateX(-Math.PI / 2);
                triggerMarker = new THREE.Mesh(geometry, triggerMaterial);
                triggerMarker.position.y = .091;
            } else {
                triggerMarker = new THREE.Mesh(
                    new THREE.BoxGeometry(triggerWidth, .04, triggerDepth),
                    triggerMaterial,
                );
                triggerMarker.position.set(
                    this.triggerStartX + this.triggerLengthX / 2,
                    .07,
                    this.triggerStart + this.triggerLength / 2
                );
            }
            triggerMarker.name = 'traffic-light-trigger-zone';
            this.root.add(triggerMarker);
        }

        this.canvas.width = 256; this.canvas.height = 128;
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.colorSpace = THREE.SRGBColorSpace;

        if (this.realisticHead) {
            box(.52, .34, .3, poleX, 4.36, 0, dark, signalVisual);
            const timer = new THREE.Mesh(new THREE.PlaneGeometry(.44, .26),
                new THREE.MeshBasicMaterial({ map: this.texture }));
            timer.position.set(poleX, 4.36, .156);
            signalVisual.add(timer);
        } else {
            for (const face of faces) {
                const timer = new THREE.Mesh(new THREE.PlaneGeometry(face.timerSize[0], face.timerSize[1]),
                    new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide }));
                timer.position.set(poleX + face.offsetX, 4.55, face.offsetZ * (face.offsetX === 0 ? 1.04 : 0));
                timer.rotation.y = face.rotationY;
                signalVisual.add(timer);
            }
        }

        this.refresh();
        if (this.alwaysGreen) this.goGreenNow();
    }

    /** Query the sensor footprint independently of the current light phase. */
    isVehicleInTriggerZone(vehiclePosition: THREE.Vector3): boolean {
        this.root.updateWorldMatrix(true, false);
        this.probe.copy(vehiclePosition);
        this.root.worldToLocal(this.probe);
        return this.probe.x >= this.triggerStartX
            && this.probe.x < (this.triggerMaxXAtZ?.(this.probe.z)
                ?? this.triggerStartX + this.triggerLengthX)
            && this.probe.z >= this.triggerStart
            && this.probe.z < this.triggerStart + this.triggerLength;
    }

    update(dt: number, vehiclePosition: THREE.Vector3) {
        if (this.alwaysGreen) {
            this.goGreenNow();
            return;
        }
        if (!this.active) {
            // Trigger zone is a 2D rectangle in local XZ. X extent comes from
            // triggerStartX/triggerLengthX (defaults mirror the yellow stop line);
            // Z extent comes from triggerStart/triggerLength. Caller can shrink
            // either axis for non-rectangular detection footprints.
            if (this.isVehicleInTriggerZone(vehiclePosition)) {
                this.active = true;
                this.elapsed = 0;
                if (this.markerId) this.onMarkerTriggered?.(this.markerId);
            }
        } else {
            this.elapsed = (this.elapsed + Math.max(0, dt)) % TrafficLight.CYCLE_SEC;
        }
        this.refresh();
    }

    reset() {
        if (this.alwaysGreen) {
            this.goGreenNow();
            return;
        }
        this.active = false;
        this.elapsed = 0;
        this.refresh();
    }

    /** Snap the signal directly to the green phase, skipping the red countdown. */
    goGreenNow() {
        this.active = true;
        // The `phase` getter treats elapsed < RED_DURATION_SEC as red, so jump
        // past that threshold to immediately expose the green lens.
        // refresh() updates the canvas timer.
        this.elapsed = TrafficLight.RED_DURATION_SEC;
        this.refresh();
    }

    private refresh() {
        this.red.emissiveIntensity = this.phase === 'red' ? 2 : 0;
        this.green.emissiveIntensity = this.phase === 'green' ? 2 : 0;
        this.yellow.emissiveIntensity = this.phase === 'yellow' ? 2 : 0;
        const display = this.phase === 'idle' ? '--' : String(this.remainingSeconds);
        const key = `${this.phase}:${display}`;
        if (key === this.display) return;
        this.display = key;
        const ctx = this.canvas.getContext('2d')!;
        ctx.fillStyle = this.realisticHead ? '#050b0d' : '#111820';
        ctx.fillRect(0, 0, 256, 128);
        ctx.fillStyle = this.phase === 'red' ? '#ff3542'
            : this.phase === 'green' ? (this.realisticHead ? '#30ffe1' : '#24ff78')
                : this.phase === 'yellow' ? '#ffbf00'
                : (this.realisticHead ? '#22575a' : '#85929e');
        if (this.realisticHead) {
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 18;
        }
        ctx.font = this.realisticHead ? 'bold 100px monospace' : 'bold 100px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(display, 128, 68);
        this.texture.needsUpdate = true;
    }
}
