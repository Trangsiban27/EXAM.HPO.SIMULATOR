import * as THREE from 'three';

export const PERPENDICULAR_PARKING_C = {
    id: 'PERPENDICULAR_PARKING_C',
    vehicleClass: 'C' as const,
    parking: {
        widthM: 2.840,
        depthM: 8.630,
    },
    control: {
        leftLengthM: 9.156,
        rightLengthM: 9.156,
    },
    mainRoad: {
        clearWidthM: 9.156,
        outerEnvelopeWidthM: 9.550,
    },
    cadReference: {
        overallSpanM: 28.580,
    },
} as const;

export interface PerpendicularParkingBayCOptions {
    x: number;
    z: number;
    rotationY?: number;
    /** Viền ngang ở đầu local -X của đường chính. Mặc định true. */
    capStart?: boolean;
    /** Viền ngang ở đầu local +X của đường chính. Mặc định true. */
    capEnd?: boolean;
    showDebug?: boolean;
    surfaceColor?: string;
    examBoundaryWidthM?: number;
    physicalEdgeOffsetM?: number;
    curbWidthM?: number;
    curbHeightM?: number;
    curbColor?: string;
}

export interface PerpendicularParkingCGeometry {
    openingHalfWidthM: number;
    openingLeftX: number;
    openingRightX: number;
    controlStartX: number;
    controlEndX: number;
    controlLengthM: number;
    parkingDepthM: number;
}

export function derivePerpendicularParkingCGeometry(): PerpendicularParkingCGeometry {
    const { widthM, depthM } = PERPENDICULAR_PARKING_C.parking;
    const { leftLengthM, rightLengthM } = PERPENDICULAR_PARKING_C.control;
    const openingHalfWidthM = widthM / 2;

    return {
        openingHalfWidthM,
        openingLeftX: -openingHalfWidthM,
        openingRightX: openingHalfWidthM,
        controlStartX: -(openingHalfWidthM + leftLengthM),
        controlEndX: openingHalfWidthM + rightLengthM,
        controlLengthM: leftLengthM + widthM + rightLengthM,
        parkingDepthM: depthM,
    };
}

export class PerpendicularParkingBayC {
    readonly root = new THREE.Group();
    readonly surfaceGroup = new THREE.Group();
    readonly examBoundaryGroup = new THREE.Group();
    readonly physicalEdgeGroup = new THREE.Group();
    readonly logicGroup = new THREE.Group();
    readonly debugGroup = new THREE.Group();

    readonly geometry = derivePerpendicularParkingCGeometry();
    readonly parkingWidthM = PERPENDICULAR_PARKING_C.parking.widthM;
    readonly parkingDepthM = PERPENDICULAR_PARKING_C.parking.depthM;
    readonly clearRoadWidthM = PERPENDICULAR_PARKING_C.mainRoad.clearWidthM;
    readonly outerEnvelopeWidthM = PERPENDICULAR_PARKING_C.mainRoad.outerEnvelopeWidthM;
    readonly overallCadSpanM = PERPENDICULAR_PARKING_C.cadReference.overallSpanM;
    readonly examBoundaryWidthM: number;
    readonly physicalEdgeOffsetM: number;
    readonly curbWidthM: number;
    readonly curbHeightM: number;
    readonly capStart: boolean;
    readonly capEnd: boolean;

    constructor(options: PerpendicularParkingBayCOptions) {
        const rotationY = options.rotationY ?? 0;
        this.examBoundaryWidthM = options.examBoundaryWidthM ?? 0.10;
        this.physicalEdgeOffsetM = options.physicalEdgeOffsetM ?? 0.25;
        this.curbWidthM = options.curbWidthM ?? 0.20;
        this.curbHeightM = options.curbHeightM ?? 0.05;
        this.capStart = options.capStart ?? true;
        this.capEnd = options.capEnd ?? true;

        if (this.examBoundaryWidthM <= 0) throw new Error('examBoundaryWidthM must be > 0');
        if (this.physicalEdgeOffsetM < 0) throw new Error('physicalEdgeOffsetM must be ≥ 0');
        if (this.curbWidthM <= 0 || this.curbHeightM <= 0) throw new Error('curb dimensions must be > 0');

        this.root.name = 'perpendicular-parking-bay-c';
        this.root.position.set(options.x, 0, options.z);
        this.root.rotation.y = rotationY;
        this.root.userData = {
            id: PERPENDICULAR_PARKING_C.id,
            vehicleClass: PERPENDICULAR_PARKING_C.vehicleClass,
            outerEnvelopeWidthM: this.outerEnvelopeWidthM,
            overallCadSpanM: this.overallCadSpanM,
        };

        this.surfaceGroup.name = 'Surface';
        this.examBoundaryGroup.name = 'ExamBoundaryRed';
        this.physicalEdgeGroup.name = 'PhysicalEdgeBlack';
        this.logicGroup.name = 'Logic';
        this.debugGroup.name = 'Debug';
        this.debugGroup.visible = options.showDebug ?? false;
        this.root.add(
            this.surfaceGroup,
            this.examBoundaryGroup,
            this.physicalEdgeGroup,
            this.logicGroup,
            this.debugGroup,
        );

        this.buildSurface(options.surfaceColor ?? '#2a2a2a');
        this.buildExamBoundary();
        this.buildPhysicalEdges();
        this.buildLogic();
        this.buildDebug();
    }

    setDebug(visible: boolean): void {
        this.debugGroup.visible = visible;
    }

    private buildSurface(color: string): void {
        const material = new THREE.MeshStandardMaterial({ color, roughness: 0.95 });
        const road = new THREE.Mesh(
            new THREE.BoxGeometry(this.geometry.controlLengthM, 0.08, this.clearRoadWidthM),
            material,
        );
        road.name = 'MainRoadSurface';
        road.position.set(0, 0.02, -this.clearRoadWidthM / 2);
        road.receiveShadow = true;

        const pocket = new THREE.Mesh(
            new THREE.BoxGeometry(this.parkingWidthM, 0.08, this.parkingDepthM),
            material,
        );
        pocket.name = 'ParkingPocketSurface';
        pocket.position.set(0, 0.02, this.parkingDepthM / 2);
        pocket.receiveShadow = true;

        this.surfaceGroup.add(road, pocket);
    }

    private buildExamBoundary(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const y = 0.065;
        const inset = this.physicalEdgeOffsetM;
        const roadOuterZ = -this.clearRoadWidthM + inset;
        const roadInnerZ = -inset;
        const leftRoadLength = openingLeftX - controlStartX;
        const rightRoadLength = controlEndX - openingRightX;

        this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadOuter', (controlStartX + controlEndX) / 2, roadOuterZ, controlEndX - controlStartX, this.examBoundaryWidthM, y, 0xe52521);
        this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadInnerLeft', (controlStartX + openingLeftX) / 2, roadInnerZ, leftRoadLength, this.examBoundaryWidthM, y, 0xe52521);
        this.addCenteredStrip(this.examBoundaryGroup, 'EntryLeft', openingLeftX + inset, this.parkingDepthM / 2, this.examBoundaryWidthM, this.parkingDepthM, y, 0xe52521);
        this.addCenteredStrip(this.examBoundaryGroup, 'ParkingBottom', 0, this.parkingDepthM - inset, this.parkingWidthM, this.examBoundaryWidthM, y, 0xe52521);
        this.addCenteredStrip(this.examBoundaryGroup, 'EntryRight', openingRightX - inset, this.parkingDepthM / 2, this.examBoundaryWidthM, this.parkingDepthM, y, 0xe52521);
        this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadInnerRight', (openingRightX + controlEndX) / 2, roadInnerZ, rightRoadLength, this.examBoundaryWidthM, y, 0xe52521);
        if (this.capStart) this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadStartCapBoundary', controlStartX + inset, -this.clearRoadWidthM / 2, this.examBoundaryWidthM, this.clearRoadWidthM - 2 * inset, y, 0xe52521);
        if (this.capEnd) this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadEndCapBoundary', controlEndX - inset, -this.clearRoadWidthM / 2, this.examBoundaryWidthM, this.clearRoadWidthM - 2 * inset, y, 0xe52521);
    }

    private buildPhysicalEdges(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const y = 0.06 + this.curbHeightM / 2;
        const leftX = openingLeftX;
        const rightX = openingRightX;
        const bottomZ = this.parkingDepthM;
        const roadOuterZ = -this.clearRoadWidthM;
        const roadInnerZ = 0;

        this.addSegmentedCurb('MainRoadOuterCurb', (controlStartX + controlEndX) / 2, roadOuterZ, controlEndX - controlStartX, 'horizontal', y);
        this.addSegmentedCurb('MainRoadInnerLeftCurb', (controlStartX + openingLeftX) / 2, roadInnerZ, openingLeftX - controlStartX, 'horizontal', y);
        this.addSegmentedCurb('ParkingLeftCurb', leftX, this.parkingDepthM / 2, this.parkingDepthM, 'vertical', y);
        this.addSegmentedCurb('ParkingBottomCurb', 0, bottomZ, this.parkingWidthM + this.curbWidthM, 'horizontal', y);
        this.addSegmentedCurb('ParkingRightCurb', rightX, this.parkingDepthM / 2, this.parkingDepthM, 'vertical', y);
        this.addSegmentedCurb('MainRoadInnerRightCurb', (openingRightX + controlEndX) / 2, roadInnerZ, controlEndX - openingRightX, 'horizontal', y);
        if (this.capStart) this.addSegmentedCurb('MainRoadStartCap', controlStartX, -this.clearRoadWidthM / 2, this.clearRoadWidthM, 'vertical', y);
        if (this.capEnd) this.addSegmentedCurb('MainRoadEndCap', controlEndX, -this.clearRoadWidthM / 2, this.clearRoadWidthM, 'vertical', y);
    }

    private buildLogic(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const approachZone = new THREE.Box3(
            new THREE.Vector3(controlStartX, -1, -this.clearRoadWidthM),
            new THREE.Vector3(controlEndX, 3, 0),
        );
        const parkingInteriorZone = new THREE.Box3(
            new THREE.Vector3(openingLeftX, -1, 0),
            new THREE.Vector3(openingRightX, 3, this.parkingDepthM),
        );
        const entryGate = new THREE.Box3(
            new THREE.Vector3(openingLeftX, -1, -0.02),
            new THREE.Vector3(openingRightX, 3, 0.02),
        );

        this.logicGroup.userData = { approachZone, parkingInteriorZone, entryGate };
        this.logicGroup.visible = false;
    }

    private buildDebug(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const y = 0.12;
        this.addDimension('Dim_Ed_Left', new THREE.Vector3(controlStartX, y, -this.clearRoadWidthM - 0.5), new THREE.Vector3(openingLeftX, y, -this.clearRoadWidthM - 0.5));
        this.addDimension('Dim_Rd', new THREE.Vector3(openingLeftX, y, -0.35), new THREE.Vector3(openingRightX, y, -0.35));
        this.addDimension('Dim_Ed_Right', new THREE.Vector3(openingRightX, y, -this.clearRoadWidthM - 0.5), new THREE.Vector3(controlEndX, y, -this.clearRoadWidthM - 0.5));
        this.addDimension('Dim_Ld', new THREE.Vector3(openingRightX + 0.45, y, 0), new THREE.Vector3(openingRightX + 0.45, y, this.parkingDepthM));
        this.addDimension('Dim_MainRoadWidth', new THREE.Vector3(controlStartX - 0.45, y, -this.clearRoadWidthM), new THREE.Vector3(controlStartX - 0.45, y, 0));
    }

    private addCenteredStrip(
        parent: THREE.Group,
        name: string,
        x: number,
        z: number,
        width: number,
        depth: number,
        y: number,
        color: number,
    ): void {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.01, depth),
            new THREE.MeshStandardMaterial({ color, roughness: 0.65 }),
        );
        mesh.name = name;
        mesh.position.set(x, y, z);
        mesh.receiveShadow = true;
        parent.add(mesh);
    }

    private addSegmentedCurb(
        name: string,
        x: number,
        z: number,
        lengthM: number,
        direction: 'horizontal' | 'vertical',
        y: number,
    ): void {
        const group = new THREE.Group();
        group.name = name;
        const segmentLengthM = 0.8;
        const count = Math.ceil(lengthM / segmentLengthM);
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });

        for (let index = 0; index < count; index++) {
            const segmentM = Math.min(segmentLengthM, lengthM - index * segmentLengthM);
            const curb = new THREE.Mesh(
                direction === 'horizontal'
                    ? new THREE.BoxGeometry(segmentM, this.curbHeightM, this.curbWidthM)
                    : new THREE.BoxGeometry(this.curbWidthM, this.curbHeightM, segmentM),
                index % 2 === 0 ? whiteMaterial : redMaterial,
            );
            curb.name = 'red-white-curb';
            curb.position.set(
                direction === 'horizontal'
                    ? x - lengthM / 2 + index * segmentLengthM + segmentM / 2
                    : x,
                y,
                direction === 'horizontal'
                    ? z
                    : z - lengthM / 2 + index * segmentLengthM + segmentM / 2,
            );
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }
        this.physicalEdgeGroup.add(group);
    }

    private addDimension(name: string, start: THREE.Vector3, end: THREE.Vector3): void {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: 0x00e5ff, depthTest: false }),
        );
        line.name = name;
        this.debugGroup.add(line);
    }
}
