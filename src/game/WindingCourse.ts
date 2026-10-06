import * as THREE from 'three';
import type { WindingCourseSpec } from './WindingCourseSpec';

export interface SCurveTrackOptions {
    x: number;
    z: number;
    rotationY: number;
    innerRadiusM: number;
    outerRadiusM: number;
    constructionDiagonalM: number;
    topConstructionWidthM: number;
    bottomConstructionWidthM: number;
    curbWidthM: number;
    debug?: boolean;
    topTangentLengthM?: number;
    bottomTangentLengthM?: number;
    /**
     * Góc nghiêng φ của đường nối hai tâm cung so với trục vuông góc với
     * hai đoạn thẳng (rad). φ = 0 → hai tâm thẳng hàng (chữ S "hai nửa vòng
     * tròn", KHÔNG đúng bản vẽ). Bản vẽ CAD: cos φ = (H - Sqc) / Sqc, với H
     * là kích thước dọc tổng.
     */
    centerTiltRad?: number;
}

export interface WindingCourseOptions {
    spec: WindingCourseSpec;
}

type ArcDefinition = {
    centerX: number;
    centerZ: number;
    from: number;
    to: number;
};

const EPSILON_M = 0.005;
const ARC_STEPS_PER_RADIAN = 64;
const CURB_VISUAL_WIDTH_M = 0.10;
/** Đo từ bản vẽ hạng B: dz = 5.55, Sqc = 8.86 → φ ≈ 51.2°. Dùng khi spec không có verticalSpanM. */
const DEFAULT_CENTER_TILT_RAD = Math.acos(5.55 / 8.86);

/**
 * One parametric S-curve generator. Radii are the primary constraints.
 * The centre radius and centre separation are derived from those radii.
 */
export class SCurveTrack {
    readonly root = new THREE.Group();
    readonly penaltyZones: THREE.Box3[] = [];
    readonly cadLabel: string = 'S-CURVE';
    readonly width: number;
    readonly envelopeWidth: number;
    readonly outerRadius: number;
    readonly innerRadius: number;
    readonly centreSpacing: number;
    readonly radius: number;
    readonly edgeMargin: number;
    readonly roadWidthM: number;
    readonly constructionDiagonalM: number;
    readonly topConstructionWidthM: number;
    readonly bottomConstructionWidthM: number;
    readonly curbWidthM: number;
    readonly arcCenters: readonly THREE.Vector3[];
    readonly tangentPoints: readonly THREE.Vector3[];
    readonly exit: THREE.Vector3;
    readonly centerTiltRad: number;

    constructor(options: SCurveTrackOptions) {
        validateGeometryOptions(options);
        const {
            x,
            z,
            rotationY,
            innerRadiusM,
            outerRadiusM,
            constructionDiagonalM,
            topConstructionWidthM,
            bottomConstructionWidthM,
            curbWidthM,
            debug = false,
            topTangentLengthM,
            bottomTangentLengthM,
            centerTiltRad = DEFAULT_CENTER_TILT_RAD,
        } = options;
        this.centerTiltRad = centerTiltRad;

        this.innerRadius = innerRadiusM;
        this.outerRadius = outerRadiusM;
        this.roadWidthM = outerRadiusM - innerRadiusM;
        this.radius = (innerRadiusM + outerRadiusM) / 2;
        this.centreSpacing = innerRadiusM + outerRadiusM;
        this.constructionDiagonalM = constructionDiagonalM;
        this.topConstructionWidthM = topConstructionWidthM;
        this.bottomConstructionWidthM = bottomConstructionWidthM;
        this.curbWidthM = curbWidthM;
        this.envelopeWidth = Math.max(topConstructionWidthM, bottomConstructionWidthM);
        this.edgeMargin = Math.min(
            (topConstructionWidthM - this.roadWidthM) / 2,
            (bottomConstructionWidthM - this.roadWidthM) / 2,
        );
        this.width = this.envelopeWidth;

        this.root.name = `s-curve-track-${this.roadWidthM.toFixed(3)}`;
        this.root.position.set(x, 0, z);
        this.root.rotation.y = rotationY;
        this.root.updateMatrix();

        // Hai tâm nằm trên đường chéo dài Sqc, nghiêng φ so với trục z.
        // Cung 1 (bulge -x) tâm A; cung 2 (bulge +x) tâm B = A + Sqc·(-sinφ, cosφ).
        const dx = this.centreSpacing * Math.sin(centerTiltRad);
        const dz = this.centreSpacing * Math.cos(centerTiltRad);
        const firstCenterX = 0;
        const firstCenterZ = this.radius;
        const secondCenterX = -dx;
        const secondCenterZ = firstCenterZ + dz;
        const topTangentZ = 0;
        const bottomTangentX = secondCenterX;
        const bottomTangentZ = secondCenterZ + this.radius;
        this.arcCenters = [
            new THREE.Vector3(firstCenterX, 0, firstCenterZ),
            new THREE.Vector3(secondCenterX, 0, secondCenterZ),
        ];
        this.tangentPoints = [
            new THREE.Vector3(0, 0, topTangentZ),
            new THREE.Vector3((firstCenterX + secondCenterX) / 2, 0, (firstCenterZ + secondCenterZ) / 2),
            new THREE.Vector3(bottomTangentX, 0, bottomTangentZ),
        ];
        const arcs: ArcDefinition[] = [
            { centerX: firstCenterX, centerZ: firstCenterZ, from: -Math.PI / 2, to: -3 * Math.PI / 2 + centerTiltRad },
            { centerX: secondCenterX, centerZ: secondCenterZ, from: -Math.PI / 2 + centerTiltRad, to: Math.PI / 2 },
        ];

        const asphalt = new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 });
        const curbWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 });
        const curbRed = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: .85 });
        const boundaryRed = new THREE.MeshStandardMaterial({ color: 0xe52521, roughness: .65 });

        for (const arc of arcs) {
            this.addArcBand(
                arc,
                innerRadiusM - curbWidthM,
                outerRadiusM + curbWidthM,
                .08,
                .06,
                asphalt,
            );
            this.addBoundaryLine(arc, innerRadiusM, boundaryRed, 'inner-red-boundary');
            this.addBoundaryLine(arc, outerRadiusM, boundaryRed, 'outer-red-boundary');
            const curbGapM = Math.max(0, curbWidthM - CURB_VISUAL_WIDTH_M);
            this.addCurb(
                arc,
                innerRadiusM - curbWidthM,
                innerRadiusM - curbGapM,
                curbWhite,
                curbRed,
            );
            this.addCurb(
                arc,
                outerRadiusM + curbGapM,
                outerRadiusM + curbWidthM,
                curbWhite,
                curbRed,
            );
            this.addArcPenaltyZones(arc, innerRadiusM - curbWidthM, outerRadiusM + curbWidthM);
        }

        this.addTangent(
            0,
            topTangentZ,
            topTangentLengthM ?? this.roadWidthM,
            topConstructionWidthM,
            1,
            asphalt,
            curbWhite,
            curbRed,
            boundaryRed,
        );
        this.addTangent(
            bottomTangentX,
            bottomTangentZ,
            bottomTangentLengthM ?? this.roadWidthM,
            bottomConstructionWidthM,
            -1,
            asphalt,
            curbWhite,
            curbRed,
            boundaryRed,
        );

        this.exit = new THREE.Vector3(bottomTangentX, .06, bottomTangentZ);
        if (debug) {
            this.addDebugGeometry(arcs, firstCenterZ, secondCenterZ, topTangentZ, bottomTangentZ);
        }
    }

    private addArcBand(
        arc: ArcDefinition,
        innerRadiusM: number,
        outerRadiusM: number,
        height: number,
        top: number,
        material: THREE.Material,
    ): THREE.Mesh {
        const geometry = new THREE.ExtrudeGeometry(
            this.createArcShape(arc, innerRadiusM, outerRadiusM),
            { depth: height, bevelEnabled: false },
        );
        geometry.translate(0, 0, -height);
        geometry.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = top;
        mesh.receiveShadow = true;
        this.root.add(mesh);
        return mesh;
    }

    private addCurb(
        arc: ArcDefinition,
        innerRadiusM: number,
        outerRadiusM: number,
        white: THREE.Material,
        red: THREE.Material,
    ): void {
        const meanRadius = (innerRadiusM + outerRadiusM) / 2;
        const count = Math.max(2, Math.ceil(Math.abs(arc.to - arc.from) * meanRadius / .8));
        for (let i = 0; i < count; i++) {
            const start = arc.from + (arc.to - arc.from) * i / count;
            const end = arc.from + (arc.to - arc.from) * (i + 1) / count;
            const segmentGeometry = new THREE.ExtrudeGeometry(
                this.createArcShape({ ...arc, from: start, to: end }, innerRadiusM, outerRadiusM),
                { depth: .05, bevelEnabled: false },
            );
            segmentGeometry.translate(0, 0, -.05);
            segmentGeometry.rotateX(-Math.PI / 2);
            const segment = new THREE.Mesh(segmentGeometry, i % 2 ? red : white);
            segment.position.y = .11;
            segment.castShadow = true;
            segment.receiveShadow = true;
            this.root.add(segment);
        }
    }

    private addTangent(
        tangentX: number,
        tangentZ: number,
        length: number,
        constructionWidth: number,
        direction: 1 | -1,
        asphalt: THREE.Material,
        white: THREE.Material,
        red: THREE.Material,
        boundaryRed: THREE.Material,
    ): void {
        if (length <= EPSILON_M) return;

        const group = new THREE.Group();
        group.name = direction > 0 ? 'top-tangent-straight' : 'bottom-tangent-straight';
        group.position.set(tangentX + direction * length / 2, .06, tangentZ);

        const envelope = new THREE.Mesh(
            new THREE.BoxGeometry(length, .08, constructionWidth),
            asphalt,
        );
        envelope.receiveShadow = true;
        group.add(envelope);

        const clearRoad = new THREE.Mesh(
            new THREE.BoxGeometry(length, .006, constructionWidth),
            asphalt,
        );
        clearRoad.position.y = .044;
        clearRoad.receiveShadow = true;
        group.add(clearRoad);

        for (const side of [-1, 1] as const) {
            const boundary = new THREE.Mesh(
                new THREE.BoxGeometry(length, .008, .04),
                boundaryRed,
            );
            const boundaryOffset = constructionWidth / 2
                - (constructionWidth - this.roadWidthM) / 2;
            boundary.position.set(0, .055, side * boundaryOffset);
            boundary.name = side < 0 ? 'inner-red-boundary' : 'outer-red-boundary';
            boundary.receiveShadow = true;
            group.add(boundary);
        }

        const curbDepth = Math.min(
            this.curbWidthM,
            Math.max(0, (constructionWidth - this.roadWidthM) / 2),
        );
        if (curbDepth > EPSILON_M) {
            const visualCurbDepth = Math.min(CURB_VISUAL_WIDTH_M, curbDepth);
            const curbGap = curbDepth - visualCurbDepth;
            for (const side of [-1, 1] as const) {
                const curb = new THREE.Mesh(
                    new THREE.BoxGeometry(length, .05, visualCurbDepth),
                    side === -1 ? white : red,
                );
                curb.position.set(
                    0,
                    .055,
                    side * (this.roadWidthM / 2 + curbGap + visualCurbDepth / 2),
                );
                curb.receiveShadow = true;
                group.add(curb);
            }
        }

        this.root.add(group);
    }

    private addBoundaryLine(
        arc: ArcDefinition,
        radius: number,
        material: THREE.Material,
        name: string,
    ): void {
        const geometry = new THREE.ExtrudeGeometry(
            this.createArcShape(arc, radius - .02, radius + .02),
            { depth: .008, bevelEnabled: false },
        );
        geometry.translate(0, 0, -.008);
        geometry.rotateX(-Math.PI / 2);
        const line = new THREE.Mesh(geometry, material);
        line.name = name;
        line.position.y = .085;
        line.receiveShadow = true;
        this.root.add(line);
    }

    private createArcShape(arc: ArcDefinition, innerRadiusM: number, outerRadiusM: number): THREE.Shape {
        const shape = new THREE.Shape();
        const steps = Math.max(2, Math.ceil(Math.abs(arc.to - arc.from) * ARC_STEPS_PER_RADIAN));
        for (let i = 0; i <= steps; i++) {
            const angle = arc.from + (arc.to - arc.from) * i / steps;
            const x = arc.centerX + outerRadiusM * Math.cos(angle);
            const z = arc.centerZ + outerRadiusM * Math.sin(angle);
            if (i === 0) shape.moveTo(x, -z);
            else shape.lineTo(x, -z);
        }
        for (let i = steps; i >= 0; i--) {
            const angle = arc.from + (arc.to - arc.from) * i / steps;
            const x = arc.centerX + innerRadiusM * Math.cos(angle);
            const z = arc.centerZ + innerRadiusM * Math.sin(angle);
            shape.lineTo(x, -z);
        }
        shape.closePath();
        return shape;
    }

    private addArcPenaltyZones(arc: ArcDefinition, innerRadiusM: number, outerRadiusM: number): void {
        const samples = Math.max(2, Math.ceil(Math.abs(arc.to - arc.from) * outerRadiusM / .15));
        for (let i = 0; i < samples; i++) {
            const start = arc.from + (arc.to - arc.from) * i / samples;
            const end = arc.from + (arc.to - arc.from) * (i + 1) / samples;
            const points = [
                this.arcPoint(arc, innerRadiusM, start),
                this.arcPoint(arc, outerRadiusM, start),
                this.arcPoint(arc, innerRadiusM, end),
                this.arcPoint(arc, outerRadiusM, end),
            ];
            const zone = new THREE.Box3().setFromPoints(points);
            zone.expandByVector(new THREE.Vector3(.125, .1, .125));
            this.penaltyZones.push(zone);
        }
    }

    private arcPoint(arc: ArcDefinition, radius: number, angle: number): THREE.Vector3 {
        return new THREE.Vector3(
            arc.centerX + radius * Math.cos(angle),
            .1,
            arc.centerZ + radius * Math.sin(angle),
        );
    }

    private addDebugGeometry(
        arcs: ArcDefinition[],
        firstCenterZ: number,
        secondCenterZ: number,
        topTangentZ: number,
        bottomTangentZ: number,
    ): void {
        const debug = new THREE.Group();
        debug.name = 's-curve-debug';

        const addLine = (points: THREE.Vector3[], color: number, name: string) => {
            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(points),
                new THREE.LineBasicMaterial({ color, depthTest: false }),
            );
            line.name = name;
            line.renderOrder = 10;
            debug.add(line);
        };

        const centerA = this.arcCenters[0].clone().setY(.22);
        const centerB = this.arcCenters[1].clone().setY(.22);
        const tangentBottom = this.tangentPoints[0].clone().setY(.22);
        const tangentMiddle = this.tangentPoints[1].clone().setY(.22);
        const tangentTop = this.tangentPoints[2].clone().setY(.22);

        const centerMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, depthTest: false });
        for (const [name, center] of [['upper-arc-center', centerA], ['lower-arc-center', centerB]] as const) {
            const marker = new THREE.Mesh(new THREE.SphereGeometry(.15, 12, 8), centerMarkerMaterial);
            marker.name = name;
            marker.position.copy(center);
            marker.renderOrder = 11;
            debug.add(marker);
        }

        addLine([centerA, centerB], 0xff00ff, 'construction-diagonal');
        addLine([tangentBottom, tangentMiddle, tangentTop], 0xffff00, 'tangent-points');

        for (const [arc, center, angle] of [
            [arcs[0], centerA, -Math.PI / 2],
            [arcs[1], centerB, Math.PI / 2],
        ] as const) {
            const innerPoint = this.arcPoint(arc, this.innerRadius, angle);
            const outerPoint = this.arcPoint(arc, this.outerRadius, angle);
            innerPoint.y = .22;
            outerPoint.y = .22;
            addLine([center, innerPoint], 0x42a5f5, 'inner-radius-line');
            addLine([center, outerPoint], 0xff7043, 'outer-radius-line');
        }

        this.addDebugLabel(debug, `inner R = ${this.innerRadius.toFixed(3)} m`, new THREE.Vector3(.3, .25, firstCenterZ));
        this.addDebugLabel(debug, `outer R = ${this.outerRadius.toFixed(3)} m`, new THREE.Vector3(.3, .25, secondCenterZ));
        this.addDebugLabel(debug, `width = ${this.roadWidthM.toFixed(3)} m`, new THREE.Vector3(.3, .25, tangentMiddle.z));
        this.root.add(debug);
    }

    private addDebugLabel(parent: THREE.Group, text: string, position: THREE.Vector3): void {
        if (typeof document === 'undefined') return;

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.font = '28px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(text, 4, 42);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const label = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture,
            depthTest: false,
            transparent: true,
        }));
        label.name = `debug-${text}`;
        label.position.copy(position);
        label.scale.set(4, .5, 1);
        label.renderOrder = 12;
        parent.add(label);
    }
}

/**
 * Compatibility wrapper for the exam-specific spec and editor APIs.
 * It delegates all geometry to SCurveTrack.
 */
export class WindingCourse extends SCurveTrack {
    readonly cadLabel: string;

    constructor(x: number, z: number, opts: WindingCourseOptions) {
        const { spec } = opts;
        super({
            x,
            z,
            rotationY: 0,
            innerRadiusM: spec.innerRadiusM,
            outerRadiusM: spec.outerRadiusM,
            constructionDiagonalM: spec.centerDistanceM,
            topConstructionWidthM: spec.constructionEnvelopeWidthM,
            bottomConstructionWidthM: spec.constructionEnvelopeWidthM,
            curbWidthM: (spec.constructionEnvelopeWidthM - spec.clearRoadWidthM) / 2,
            topTangentLengthM: spec.clearRoadWidthM,
            bottomTangentLengthM: spec.clearRoadWidthM,
            centerTiltRad: spec.verticalSpanM === undefined
                ? undefined
                : Math.acos((spec.verticalSpanM - spec.centerDistanceM) / spec.centerDistanceM),
        });
        this.cadLabel = spec.cadLabel;
        this.root.name = `winding-course-${spec.cadLabel}`;
    }
}

function validateGeometryOptions(options: SCurveTrackOptions): void {
    const {
        innerRadiusM,
        outerRadiusM,
        constructionDiagonalM,
        topConstructionWidthM,
        bottomConstructionWidthM,
        curbWidthM,
    } = options;

    if (innerRadiusM <= 0) throw new Error('SCurveTrack: innerRadiusM must be > 0');
    if (outerRadiusM <= innerRadiusM) {
        throw new Error('SCurveTrack: outerRadiusM must be greater than innerRadiusM');
    }
    if (constructionDiagonalM <= 0) {
        throw new Error('SCurveTrack: constructionDiagonalM must be > 0');
    }
    if (Math.abs(constructionDiagonalM - (innerRadiusM + outerRadiusM)) > EPSILON_M) {
        throw new Error(
            `SCurveTrack: constructionDiagonalM (${constructionDiagonalM}) must equal innerRadiusM + outerRadiusM (${innerRadiusM + outerRadiusM})`,
        );
    }
    if (topConstructionWidthM < outerRadiusM - innerRadiusM) {
        throw new Error('SCurveTrack: topConstructionWidthM must cover the calculated road width');
    }
    if (bottomConstructionWidthM < outerRadiusM - innerRadiusM) {
        throw new Error('SCurveTrack: bottomConstructionWidthM must cover the calculated road width');
    }
    const tilt = options.centerTiltRad ?? DEFAULT_CENTER_TILT_RAD;
    if (!(tilt > 0 && tilt < Math.PI / 2)) {
        throw new Error('SCurveTrack: centerTiltRad must be in (0, PI/2)');
    }
    if (curbWidthM < 0) throw new Error('SCurveTrack: curbWidthM must be >= 0');
    const roadWidthM = outerRadiusM - innerRadiusM;
    if (2 * curbWidthM > topConstructionWidthM - roadWidthM + EPSILON_M) {
        throw new Error('SCurveTrack: top construction width cannot contain both curbs');
    }
    if (2 * curbWidthM > bottomConstructionWidthM - roadWidthM + EPSILON_M) {
        throw new Error('SCurveTrack: bottom construction width cannot contain both curbs');
    }
}