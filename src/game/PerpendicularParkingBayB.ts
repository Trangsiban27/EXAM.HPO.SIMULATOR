import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';

export const PERPENDICULAR_PARKING_BAY_B = {
    id: 'PERPENDICULAR_PARKING_BAY_B',
    vehicleClass: 'B' as const,
    parking: {
        /** Khoảng thông thủy giữa hai mép trong của vạch đỏ hai bên chuồng. */
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
    /** Bán kính hai góc ở đầu đóng của đường chính (local -X). Mặc định 1 m. */
    mainRoadBottomRadiusM?: number;
    /** Bán kính hai góc ở đáy ô ghép (local +Z). Mặc định 0,5 m. */
    parkingBottomRadiusM?: number;
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
    openingWidthM: number;
    openingHalfWidthM: number;
    openingLeftX: number;
    openingRightX: number;
    redInnerLeftX: number;
    redInnerRightX: number;
    controlStartX: number;
    controlEndX: number;
    controlLengthM: number;
    parkingDepthM: number;
}

export function derivePerpendicularParkingBGeometry(
    examBoundaryWidthM = 0.05,
    physicalEdgeOffsetM = 0.25,
): PerpendicularParkingBGeometry {
    const { widthM, depthM } = PERPENDICULAR_PARKING_BAY_B.parking;
    const { leftLengthM, rightLengthM } = PERPENDICULAR_PARKING_BAY_B.control;
    const openingWidthM = widthM + 2 * physicalEdgeOffsetM + examBoundaryWidthM;
    const openingHalfWidthM = openingWidthM / 2;
    return {
        openingWidthM,
        openingHalfWidthM,
        openingLeftX: -openingHalfWidthM,
        openingRightX: openingHalfWidthM,
        redInnerLeftX: -widthM / 2,
        redInnerRightX: widthM / 2,
        controlStartX: -(openingHalfWidthM + leftLengthM),
        controlEndX: openingHalfWidthM + rightLengthM,
        controlLengthM: leftLengthM + openingWidthM + rightLengthM,
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

    readonly geometry: PerpendicularParkingBGeometry;
    /** Khoảng thông thủy giữa hai mép trong vạch đỏ, không phải bề rộng mặt chuồng. */
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
    readonly mainRoadBottomRadiusM: number;
    readonly parkingBottomRadiusM: number;

    constructor(options: PerpendicularParkingBayBOptions) {
        validatePerpendicularParkingBayB();
        this.examBoundaryWidthM = options.examBoundaryWidthM ?? 0.05;
        this.physicalEdgeOffsetM = options.physicalEdgeOffsetM ?? 0.25;
        this.curbWidthM = options.curbWidthM ?? 0.20;
        this.curbHeightM = options.curbHeightM ?? CURB_VISUAL_HEIGHT_M;
        this.capStart = options.capStart ?? true;
        this.capEnd = options.capEnd ?? true;
        this.mainRoadBottomRadiusM = options.mainRoadBottomRadiusM ?? 1;
        this.parkingBottomRadiusM = options.parkingBottomRadiusM ?? 0.5;
        this.radii = options.radii ?? {};

        if (this.examBoundaryWidthM <= 0) throw new Error('examBoundaryWidthM must be > 0');
        if (this.physicalEdgeOffsetM < 0) throw new Error('physicalEdgeOffsetM must be ≥ 0');
        if (this.curbWidthM <= 0 || this.curbHeightM <= 0) throw new Error('curb dimensions must be > 0');
        if (this.mainRoadBottomRadiusM < 0
            || this.mainRoadBottomRadiusM > this.clearRoadWidthM / 2
            || (this.mainRoadBottomRadiusM > 0 && !this.capStart)) {
            throw new Error('mainRoadBottomRadiusM needs a closed road end and must fit its width');
        }
        this.geometry = derivePerpendicularParkingBGeometry(
            this.examBoundaryWidthM,
            this.physicalEdgeOffsetM,
        );
        if (this.parkingBottomRadiusM < 0
            || this.parkingBottomRadiusM > this.geometry.openingHalfWidthM
            || this.parkingBottomRadiusM > this.parkingDepthM) {
            throw new Error('parkingBottomRadiusM must fit the parking pocket');
        }

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

        this.buildSurface(options.surfaceColor ?? ROAD_SURFACE_COLOR);
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
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const roadRadius = this.mainRoadBottomRadiusM;
        const roadShape = new THREE.Shape();
        roadShape.moveTo(controlStartX + roadRadius, this.clearRoadWidthM);
        roadShape.lineTo(controlEndX, this.clearRoadWidthM);
        roadShape.lineTo(controlEndX, 0);
        roadShape.lineTo(controlStartX + roadRadius, 0);
        if (roadRadius > 0) {
            this.addArcToShape(roadShape, controlStartX + roadRadius, -roadRadius,
                roadRadius, Math.PI / 2, Math.PI);
            roadShape.lineTo(controlStartX, this.clearRoadWidthM - roadRadius);
            this.addArcToShape(roadShape, controlStartX + roadRadius,
                -this.clearRoadWidthM + roadRadius,
                roadRadius, Math.PI, 3 * Math.PI / 2);
        } else {
            roadShape.lineTo(controlStartX, 0);
            roadShape.lineTo(controlStartX, this.clearRoadWidthM);
        }
        const roadGeometry = new THREE.ExtrudeGeometry(roadShape, {
            depth: 0.08, bevelEnabled: false,
        });
        roadGeometry.rotateX(-Math.PI / 2);
        const road = new THREE.Mesh(roadGeometry, material);
        road.name = 'MainRoadSurface';
        road.position.y = -0.02;
        road.receiveShadow = true;

        const parkingRadius = this.parkingBottomRadiusM;
        const pocketShape = new THREE.Shape();
        pocketShape.moveTo(openingLeftX, 0);
        pocketShape.lineTo(openingRightX, 0);
        pocketShape.lineTo(openingRightX, -(this.parkingDepthM - parkingRadius));
        if (parkingRadius > 0) {
            this.addArcToShape(pocketShape, openingRightX - parkingRadius,
                this.parkingDepthM - parkingRadius,
                parkingRadius, 0, Math.PI / 2);
            pocketShape.lineTo(openingLeftX + parkingRadius, -this.parkingDepthM);
            this.addArcToShape(pocketShape, openingLeftX + parkingRadius,
                this.parkingDepthM - parkingRadius,
                parkingRadius, Math.PI / 2, Math.PI);
        } else {
            pocketShape.lineTo(openingRightX, -this.parkingDepthM);
            pocketShape.lineTo(openingLeftX, -this.parkingDepthM);
        }
        pocketShape.lineTo(openingLeftX, 0);
        const pocketGeometry = new THREE.ExtrudeGeometry(pocketShape, {
            depth: 0.08, bevelEnabled: false,
        });
        pocketGeometry.rotateX(-Math.PI / 2);
        const pocket = new THREE.Mesh(pocketGeometry, material);
        pocket.name = 'ParkingPocketSurface';
        pocket.position.y = -0.02;
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
        const roadOuterZ = -this.clearRoadWidthM + inset;
        const roadInnerZ = -inset;
        const roadRedRadius = Math.max(0, this.mainRoadBottomRadiusM - inset);
        const roadRedStartX = this.mainRoadBottomRadiusM > 0
            ? controlStartX + inset + roadRedRadius : controlStartX;
        const parkingRedRadius = Math.max(0, this.parkingBottomRadiusM - inset);
        const parkingRedBottomZ = this.parkingDepthM - inset;
        const parkingRedLeftX = openingLeftX + inset;
        const parkingRedRightX = openingRightX - inset;
        const parkingEntryEndZ = parkingRedBottomZ - parkingRedRadius;

        this.addStrip('MainRoadOuterSegment',
            (roadRedStartX + controlEndX) / 2, roadOuterZ,
            controlEndX - roadRedStartX, this.examBoundaryWidthM, y);
        this.addStrip('MainRoadInnerLeftSegment',
            (roadRedStartX + parkingRedLeftX) / 2, roadInnerZ,
            parkingRedLeftX - roadRedStartX, this.examBoundaryWidthM, y);
        this.addStrip('EntryLeftTransition', parkingRedLeftX,
            (roadInnerZ + parkingEntryEndZ) / 2,
            this.examBoundaryWidthM, parkingEntryEndZ - roadInnerZ, y);
        this.addStrip('ParkingBottom', 0, parkingRedBottomZ,
            parkingRedRightX - parkingRedLeftX - 2 * parkingRedRadius + this.examBoundaryWidthM,
            this.examBoundaryWidthM, y);
        this.addStrip('EntryRightTransition', parkingRedRightX,
            (roadInnerZ + parkingEntryEndZ) / 2,
            this.examBoundaryWidthM, parkingEntryEndZ - roadInnerZ, y);
        this.addStrip('MainRoadInnerRightSegment',
            (parkingRedRightX + controlEndX) / 2, roadInnerZ,
            controlEndX - parkingRedRightX, this.examBoundaryWidthM, y);
        if (this.capStart) this.addStrip('MainRoadStartCapBoundary',
            controlStartX + inset, (roadOuterZ + roadInnerZ) / 2,
            this.examBoundaryWidthM,
            roadInnerZ - roadOuterZ - 2 * roadRedRadius, y);
        if (this.capEnd) this.addStrip('MainRoadEndCapBoundary', controlEndX - inset, -this.clearRoadWidthM / 2, this.examBoundaryWidthM, this.clearRoadWidthM - 2 * inset, y);
        if (roadRedRadius > 0) {
            this.addArcStrip(this.examBoundaryGroup, 'MainRoadOuterRedCorner',
                roadRedStartX, roadOuterZ + roadRedRadius, roadRedRadius,
                Math.PI, 3 * Math.PI / 2, this.examBoundaryWidthM, y - .005, .01, [0xf6d34c]);
            this.addArcStrip(this.examBoundaryGroup, 'MainRoadInnerRedCorner',
                roadRedStartX, roadInnerZ - roadRedRadius, roadRedRadius,
                Math.PI / 2, Math.PI, this.examBoundaryWidthM, y - .005, .01, [0xf6d34c]);
        }
        if (parkingRedRadius > 0) {
            this.addArcStrip(this.examBoundaryGroup, 'ParkingLeftRedCorner',
                parkingRedLeftX + parkingRedRadius, parkingRedBottomZ - parkingRedRadius,
                parkingRedRadius, Math.PI / 2, Math.PI,
                this.examBoundaryWidthM, y - .005, .01, [0xf6d34c]);
            this.addArcStrip(this.examBoundaryGroup, 'ParkingRightRedCorner',
                parkingRedRightX - parkingRedRadius, parkingRedBottomZ - parkingRedRadius,
                parkingRedRadius, 0, Math.PI / 2,
                this.examBoundaryWidthM, y - .005, .01, [0xf6d34c]);
        }
    }

    private buildPhysicalEdges(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const y = 0.06 + this.curbHeightM / 2;
        const rightRoadLength = controlEndX - openingRightX;
        const roadRadius = this.mainRoadBottomRadiusM;
        const parkingRadius = this.parkingBottomRadiusM;
        const curbWidth = Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M);
        this.addSegmentedCurb('MainRoadOuterCurb',
            (controlStartX + roadRadius + controlEndX) / 2, -this.clearRoadWidthM,
            controlEndX - controlStartX - roadRadius, 'horizontal', y);
        this.addSegmentedCurb('MainRoadInnerLeftCurb',
            (controlStartX + roadRadius + openingLeftX) / 2, 0,
            openingLeftX - controlStartX - roadRadius, 'horizontal', y);
        this.addSegmentedCurb('ParkingLeftCurb', openingLeftX,
            (this.parkingDepthM - parkingRadius) / 2,
            this.parkingDepthM - parkingRadius, 'vertical', y);
        this.addSegmentedCurb('ParkingBottomCurb', 0, this.parkingDepthM,
            this.geometry.openingWidthM - 2 * parkingRadius + this.curbWidthM,
            'horizontal', y);
        this.addSegmentedCurb('ParkingRightCurb', openingRightX,
            (this.parkingDepthM - parkingRadius) / 2,
            this.parkingDepthM - parkingRadius, 'vertical', y);
        this.addSegmentedCurb('MainRoadInnerRightCurb', (openingRightX + controlEndX) / 2, 0, rightRoadLength, 'horizontal', y);
        if (this.capStart) this.addSegmentedCurb('MainRoadStartCap', controlStartX,
            -this.clearRoadWidthM / 2,
            this.clearRoadWidthM - 2 * roadRadius, 'vertical', y);
        if (this.capEnd) this.addSegmentedCurb('MainRoadEndCap', controlEndX, -this.clearRoadWidthM / 2, this.clearRoadWidthM, 'vertical', y);
        if (roadRadius > 0) {
            this.addArcStrip(this.physicalEdgeGroup, 'MainRoadOuterCurbCorner',
                controlStartX + roadRadius, -this.clearRoadWidthM + roadRadius,
                roadRadius, Math.PI, 3 * Math.PI / 2,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
            this.addArcStrip(this.physicalEdgeGroup, 'MainRoadInnerCurbCorner',
                controlStartX + roadRadius, -roadRadius,
                roadRadius, Math.PI / 2, Math.PI,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
        }
        if (parkingRadius > 0) {
            this.addArcStrip(this.physicalEdgeGroup, 'ParkingLeftCurbCorner',
                openingLeftX + parkingRadius, this.parkingDepthM - parkingRadius,
                parkingRadius, Math.PI / 2, Math.PI,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
            this.addArcStrip(this.physicalEdgeGroup, 'ParkingRightCurbCorner',
                openingRightX - parkingRadius, this.parkingDepthM - parkingRadius,
                parkingRadius, 0, Math.PI / 2,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
        }
    }

    private buildLogic(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX, redInnerLeftX, redInnerRightX } = this.geometry;
        this.logicGroup.userData = {
            ApproachZone: new THREE.Box3(
                new THREE.Vector3(controlStartX, -1, -this.clearRoadWidthM),
                new THREE.Vector3(controlEndX, 3, 0),
            ),
            ParkingInteriorZone: new THREE.Box3(
                new THREE.Vector3(redInnerLeftX, -1, 0),
                new THREE.Vector3(redInnerRightX, 3, this.parkingDepthM),
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
        const { controlStartX, controlEndX, openingLeftX, openingRightX, redInnerLeftX, redInnerRightX } = this.geometry;
        const y = 0.12;
        this.addDimension('Dim_Ed_Left', new THREE.Vector3(controlStartX, y, -this.clearRoadWidthM - 0.5), new THREE.Vector3(openingLeftX, y, -this.clearRoadWidthM - 0.5));
        this.addDimension('Dim_Rd', new THREE.Vector3(redInnerLeftX, y, -0.3), new THREE.Vector3(redInnerRightX, y, -0.3));
        this.addDimension('Dim_Ed_Right', new THREE.Vector3(openingRightX, y, -this.clearRoadWidthM - 0.5), new THREE.Vector3(controlEndX, y, -this.clearRoadWidthM - 0.5));
        this.addDimension('Dim_Ld', new THREE.Vector3(openingRightX + 0.4, y, 0), new THREE.Vector3(openingRightX + 0.4, y, this.parkingDepthM));
        this.addDimension('Dim_RoadWidth', new THREE.Vector3(controlStartX - 0.4, y, -this.clearRoadWidthM), new THREE.Vector3(controlStartX - 0.4, y, 0));
    }

    private addArcToShape(
        shape: THREE.Shape, centerX: number, centerZ: number,
        radiusM: number, startAngle: number, endAngle: number,
    ): void {
        for (let i = 1; i <= 16; i++) {
            const angle = startAngle + (endAngle - startAngle) * i / 16;
            shape.lineTo(centerX + radiusM * Math.cos(angle),
                -(centerZ + radiusM * Math.sin(angle)));
        }
    }

    private addArcStrip(
        parent: THREE.Group, name: string,
        centerX: number, centerZ: number, radiusM: number,
        startAngle: number, endAngle: number,
        widthM: number, baseY: number, heightM: number,
        colors: number[],
    ): void {
        const group = new THREE.Group();
        group.name = name;
        const count = colors.length === 1 ? 1
            : Math.ceil(radiusM * Math.abs(endAngle - startAngle) / .8);
        const materials = colors.map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        for (let i = 0; i < count; i++) {
            const start = startAngle + (endAngle - startAngle) * i / count;
            const end = startAngle + (endAngle - startAngle) * (i + 1) / count;
            const shape = new THREE.Shape();
            const innerRadius = radiusM - widthM / 2;
            const outerRadius = radiusM + widthM / 2;
            for (let j = 0; j <= 8; j++) {
                const angle = start + (end - start) * j / 8;
                const x = centerX + innerRadius * Math.cos(angle);
                const z = centerZ + innerRadius * Math.sin(angle);
                if (j === 0) shape.moveTo(x, -z);
                else shape.lineTo(x, -z);
            }
            for (let j = 8; j >= 0; j--) {
                const angle = start + (end - start) * j / 8;
                shape.lineTo(centerX + outerRadius * Math.cos(angle),
                    -(centerZ + outerRadius * Math.sin(angle)));
            }
            shape.closePath();
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: heightM, bevelEnabled: false,
            });
            geometry.rotateX(-Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, materials[i % materials.length]);
            mesh.name = colors.length === 1 ? name : 'red-white-curb';
            mesh.position.y = baseY;
            mesh.castShadow = colors.length > 1;
            mesh.receiveShadow = true;
            group.add(mesh);
        }
        parent.add(group);
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
            new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: 0.65 }),
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
                    ? new THREE.BoxGeometry(segmentM, this.curbHeightM,
                        Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M))
                    : new THREE.BoxGeometry(Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M),
                        this.curbHeightM, segmentM),
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
