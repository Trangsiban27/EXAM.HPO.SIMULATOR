import * as THREE from 'three';

export const PERPENDICULAR_PARKING_BAY_B = {
    id: 'PERPENDICULAR_PARKING_BAY_B',
    vehicleClass: 'B' as const,
    parking: {
        widthM: 2.300,
        depthM: 5.410,
    },
    control: {
        leftLengthM: 5.292,
        rightLengthM: 5.292,
    },
    mainRoad: {
        clearWidthM: 5.292,
        outerEnvelopeWidthM: 5.700,
    },
} as const;

export interface PerpendicularParkingBayBOptions {
    x: number;
    z: number;
    rotationY?: number;
    /** Viền ngang ở đầu local -X của đường chính. Mặc định true. */
    capStart?: boolean;
    /** Viền ngang ở đầu local +X của đường chính. Mặc định true. */
    capEnd?: boolean;
    showDebug?: boolean;
    surfaceColor?: string;
    grassColor?: string;
    examBoundaryWidthM?: number;
    physicalEdgeOffsetM?: number;
    curbWidthM?: number;
    curbHeightM?: number;
    radii?: {
        mainRoadOuterLeftM?: number;
        entryLeftM?: number;
        entryRightM?: number;
        parkingBottomLeftM?: number;
        parkingBottomRightM?: number;
        outerRightM?: number;
    };
}

export interface PerpendicularParkingBGeometry {
    openingHalfWidthM: number;
    openingLeftX: number;
    openingRightX: number;
    controlStartX: number;
    controlEndX: number;
    controlLengthM: number;
    parkingDepthM: number;
}

export function derivePerpendicularParkingBGeometry(): PerpendicularParkingBGeometry {
    const { widthM, depthM } = PERPENDICULAR_PARKING_BAY_B.parking;
    const { leftLengthM, rightLengthM } = PERPENDICULAR_PARKING_BAY_B.control;
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

export function validatePerpendicularParkingBayB(): void {
    const eps = 0.001;
    const { parking, control } = PERPENDICULAR_PARKING_BAY_B;
    if (Math.abs(parking.widthM - 2.300) > eps) throw new Error('Rd must be 2.300 m');
    if (Math.abs(parking.depthM - 5.410) > eps) throw new Error('Ld must be 5.410 m');
    if (Math.abs(control.leftLengthM - 5.292) > eps) throw new Error('Left Ed must be 5.292 m');
    if (Math.abs(control.rightLengthM - 5.292) > eps) throw new Error('Right Ed must be 5.292 m');
}

export class PerpendicularParkingBayB {
    readonly root = new THREE.Group();
    readonly surfaceGroup = new THREE.Group();
    readonly grassGroup = new THREE.Group();
    readonly examBoundaryGroup = new THREE.Group();
    readonly physicalEdgeGroup = new THREE.Group();
    readonly logicGroup = new THREE.Group();
    readonly collisionGroup = new THREE.Group();
    readonly debugGroup = new THREE.Group();

    readonly geometry = derivePerpendicularParkingBGeometry();
    readonly parkingWidthM = PERPENDICULAR_PARKING_BAY_B.parking.widthM;
    readonly parkingDepthM = PERPENDICULAR_PARKING_BAY_B.parking.depthM;
    readonly clearRoadWidthM = PERPENDICULAR_PARKING_BAY_B.mainRoad.clearWidthM;
    readonly outerEnvelopeWidthM = PERPENDICULAR_PARKING_BAY_B.mainRoad.outerEnvelopeWidthM;
    readonly radii: NonNullable<PerpendicularParkingBayBOptions['radii']>;
    readonly examBoundaryWidthM: number;
    readonly physicalEdgeOffsetM: number;
    readonly curbWidthM: number;
    readonly curbHeightM: number;
    readonly capStart: boolean;
    readonly capEnd: boolean;

    constructor(options: PerpendicularParkingBayBOptions) {
        validatePerpendicularParkingBayB();
        this.examBoundaryWidthM = options.examBoundaryWidthM ?? 0.10;
        this.physicalEdgeOffsetM = options.physicalEdgeOffsetM ?? 0.25;
        this.curbWidthM = options.curbWidthM ?? 0.20;
        this.curbHeightM = options.curbHeightM ?? 0.05;
        this.capStart = options.capStart ?? true;
        this.capEnd = options.capEnd ?? true;
        this.radii = options.radii ?? {};

        if (this.examBoundaryWidthM <= 0) throw new Error('examBoundaryWidthM must be > 0');
        if (this.physicalEdgeOffsetM < 0) throw new Error('physicalEdgeOffsetM must be ≥ 0');
        if (this.curbWidthM <= 0 || this.curbHeightM <= 0) throw new Error('curb dimensions must be > 0');

        this.root.name = 'perpendicular-parking-bay-b';
        this.root.position.set(options.x, 0, options.z);
        this.root.rotation.y = options.rotationY ?? 0;
        this.root.userData = {
            id: PERPENDICULAR_PARKING_BAY_B.id,
            vehicleClass: PERPENDICULAR_PARKING_BAY_B.vehicleClass,
            outerEnvelopeWidthM: this.outerEnvelopeWidthM,
            radii: this.radii,
        };

        this.surfaceGroup.name = 'Surface';
        this.grassGroup.name = 'Grass';
        this.examBoundaryGroup.name = 'ExamBoundaryRed';
        this.physicalEdgeGroup.name = 'PhysicalEdge';
        this.logicGroup.name = 'Logic';
        this.collisionGroup.name = 'Collision';
        this.debugGroup.name = 'Debug';
        this.debugGroup.visible = options.showDebug ?? false;
        this.root.add(
            this.surfaceGroup,
            this.grassGroup,
            this.examBoundaryGroup,
            this.physicalEdgeGroup,
            this.logicGroup,
            this.collisionGroup,
            this.debugGroup,
        );

        this.buildSurface(options.surfaceColor ?? '#2a2a2a');
        this.buildGrass(options.grassColor ?? '#4f7c45');
        this.buildExamBoundary();
        this.buildPhysicalEdges();
        this.buildLogic();
        this.buildCollision();
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

    private buildGrass(color: string): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const material = new THREE.MeshStandardMaterial({ color, roughness: 1 });
        this.addGroundMesh('GrassMeshLeft', (controlStartX + openingLeftX) / 2, this.parkingDepthM / 2, openingLeftX - controlStartX, this.parkingDepthM, material);
        this.addGroundMesh('GrassMeshRight', (openingRightX + controlEndX) / 2, this.parkingDepthM / 2, controlEndX - openingRightX, this.parkingDepthM, material);
    }

    private buildExamBoundary(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const inset = this.physicalEdgeOffsetM;
        const y = 0.065;
        const leftRoadLength = openingLeftX - controlStartX;
        const rightRoadLength = controlEndX - openingRightX;

        this.addStrip('MainRoadOuterSegment', (controlStartX + controlEndX) / 2, -this.clearRoadWidthM + inset, controlEndX - controlStartX, this.examBoundaryWidthM, y);
        this.addStrip('MainRoadInnerLeftSegment', (controlStartX + openingLeftX) / 2, -inset, leftRoadLength, this.examBoundaryWidthM, y);
        this.addStrip('EntryLeftTransition', openingLeftX + inset, this.parkingDepthM / 2, this.examBoundaryWidthM, this.parkingDepthM, y);
        this.addStrip('ParkingBottom', 0, this.parkingDepthM - inset, this.parkingWidthM, this.examBoundaryWidthM, y);
        this.addStrip('EntryRightTransition', openingRightX - inset, this.parkingDepthM / 2, this.examBoundaryWidthM, this.parkingDepthM, y);
        this.addStrip('MainRoadInnerRightSegment', (openingRightX + controlEndX) / 2, -inset, rightRoadLength, this.examBoundaryWidthM, y);
        if (this.capStart) this.addStrip('MainRoadStartCapBoundary', controlStartX + inset, -this.clearRoadWidthM / 2, this.examBoundaryWidthM, this.clearRoadWidthM - 2 * inset, y);
        if (this.capEnd) this.addStrip('MainRoadEndCapBoundary', controlEndX - inset, -this.clearRoadWidthM / 2, this.examBoundaryWidthM, this.clearRoadWidthM - 2 * inset, y);
    }

    private buildPhysicalEdges(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const y = 0.06 + this.curbHeightM / 2;
        const leftRoadLength = openingLeftX - controlStartX;
        const rightRoadLength = controlEndX - openingRightX;
        this.addSegmentedCurb('MainRoadOuterCurb', (controlStartX + controlEndX) / 2, -this.clearRoadWidthM, controlEndX - controlStartX, 'horizontal', y);
        this.addSegmentedCurb('MainRoadInnerLeftCurb', (controlStartX + openingLeftX) / 2, 0, leftRoadLength, 'horizontal', y);
        this.addSegmentedCurb('ParkingLeftCurb', openingLeftX, this.parkingDepthM / 2, this.parkingDepthM, 'vertical', y);
        this.addSegmentedCurb('ParkingBottomCurb', 0, this.parkingDepthM, this.parkingWidthM, 'horizontal', y);
        this.addSegmentedCurb('ParkingRightCurb', openingRightX, this.parkingDepthM / 2, this.parkingDepthM, 'vertical', y);
        this.addSegmentedCurb('MainRoadInnerRightCurb', (openingRightX + controlEndX) / 2, 0, rightRoadLength, 'horizontal', y);
        if (this.capStart) this.addSegmentedCurb('MainRoadStartCap', controlStartX, -this.clearRoadWidthM / 2, this.clearRoadWidthM, 'vertical', y);
        if (this.capEnd) this.addSegmentedCurb('MainRoadEndCap', controlEndX, -this.clearRoadWidthM / 2, this.clearRoadWidthM, 'vertical', y);
    }

    private buildLogic(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        this.logicGroup.userData = {
            ApproachZone: new THREE.Box3(
                new THREE.Vector3(controlStartX, -1, -this.clearRoadWidthM),
                new THREE.Vector3(controlEndX, 3, 0),
            ),
            ParkingInteriorZone: new THREE.Box3(
                new THREE.Vector3(openingLeftX, -1, 0),
                new THREE.Vector3(openingRightX, 3, this.parkingDepthM),
            ),
            EntryGate: new THREE.Box3(
                new THREE.Vector3(openingLeftX, -1, -0.02),
                new THREE.Vector3(openingRightX, 3, 0.02),
            ),
            ExitGate: new THREE.Box3(
                new THREE.Vector3(openingLeftX, -1, this.parkingDepthM - 0.02),
                new THREE.Vector3(openingRightX, 3, this.parkingDepthM + 0.02),
            ),
        };
        this.logicGroup.visible = false;
    }

    private buildCollision(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        this.collisionGroup.userData = {
            GrassColliderLeft: new THREE.Box3(
                new THREE.Vector3(controlStartX, -1, 0),
                new THREE.Vector3(openingLeftX, 3, this.parkingDepthM),
            ),
            GrassColliderRight: new THREE.Box3(
                new THREE.Vector3(openingRightX, -1, 0),
                new THREE.Vector3(controlEndX, 3, this.parkingDepthM),
            ),
        };
        this.collisionGroup.visible = false;
    }

    private buildDebug(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const y = 0.12;
        this.addDimension('Dim_Ed_Left', new THREE.Vector3(controlStartX, y, -this.clearRoadWidthM - 0.5), new THREE.Vector3(openingLeftX, y, -this.clearRoadWidthM - 0.5));
        this.addDimension('Dim_Rd', new THREE.Vector3(openingLeftX, y, -0.3), new THREE.Vector3(openingRightX, y, -0.3));
        this.addDimension('Dim_Ed_Right', new THREE.Vector3(openingRightX, y, -this.clearRoadWidthM - 0.5), new THREE.Vector3(controlEndX, y, -this.clearRoadWidthM - 0.5));
        this.addDimension('Dim_Ld', new THREE.Vector3(openingRightX + 0.4, y, 0), new THREE.Vector3(openingRightX + 0.4, y, this.parkingDepthM));
        this.addDimension('Dim_RoadWidth', new THREE.Vector3(controlStartX - 0.4, y, -this.clearRoadWidthM), new THREE.Vector3(controlStartX - 0.4, y, 0));
    }

    private addGroundMesh(
        name: string,
        x: number,
        z: number,
        width: number,
        depth: number,
        material: THREE.Material,
    ): void {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.02, depth), material);
        mesh.name = name;
        mesh.position.set(x, 0, z);
        mesh.receiveShadow = true;
        this.grassGroup.add(mesh);
    }

    private addStrip(name: string, x: number, z: number, width: number, depth: number, y: number): void {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.01, depth),
            new THREE.MeshStandardMaterial({ color: 0xe52521, roughness: 0.65 }),
        );
        mesh.name = name;
        mesh.position.set(x, y, z);
        mesh.receiveShadow = true;
        this.examBoundaryGroup.add(mesh);
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
                direction === 'horizontal' ? x - lengthM / 2 + index * segmentLengthM + segmentM / 2 : x,
                y,
                direction === 'horizontal' ? z : z - lengthM / 2 + index * segmentLengthM + segmentM / 2,
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

export function createPerpendicularParkingBayB(
    options: PerpendicularParkingBayBOptions,
): THREE.Group {
    return new PerpendicularParkingBayB(options).root;
}
