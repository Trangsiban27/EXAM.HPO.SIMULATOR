import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';

export const PERPENDICULAR_PARKING_C = {
    id: 'PERPENDICULAR_PARKING_C',
    vehicleClass: 'C' as const,
    parking: {
        /** Khoảng thông thủy giữa hai mép trong của vạch đỏ hai bên chuồng. */
        widthM: 2.840,
        depthM: 8.630,
    },
    control: {
        leftLengthM: 9.156,
        rightLengthM: 9.156,
    },
    mainRoad: {
        /** Khoảng thông thủy giữa hai mép trong vạch đỏ ở hai bên đường cửa chuồng. */
        clearWidthM: 9.156,
        /** Bề rộng mặt đường thực tế, đo giữa hai mép ngoài. */
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
    /** Bán kính hai góc ở đầu đóng của đường chính (local -X). */
    mainRoadBottomRadiusM?: number;
    /** Bán kính hai góc ở đáy ô ghép (local +Z). */
    parkingBottomRadiusM?: number;
}

export interface PerpendicularParkingCGeometry {
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

export function derivePerpendicularParkingCGeometry(
    examBoundaryWidthM = 0.05,
    physicalEdgeOffsetM = 0.25,
): PerpendicularParkingCGeometry {
    const { widthM, depthM } = PERPENDICULAR_PARKING_C.parking;
    const { leftLengthM, rightLengthM } = PERPENDICULAR_PARKING_C.control;
    // Vạch đỏ nằm lùi vào từ mép chuồng; widthM đo giữa hai mép trong của vạch.
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

export class PerpendicularParkingBayC {
    readonly root = new THREE.Group();
    readonly surfaceGroup = new THREE.Group();
    readonly examBoundaryGroup = new THREE.Group();
    readonly physicalEdgeGroup = new THREE.Group();
    readonly logicGroup = new THREE.Group();
    readonly debugGroup = new THREE.Group();

    readonly geometry: PerpendicularParkingCGeometry;
    /** Khoảng thông thủy giữa hai mép trong vạch đỏ, không phải bề rộng mặt chuồng. */
    readonly parkingWidthM = PERPENDICULAR_PARKING_C.parking.widthM;
    readonly parkingDepthM = PERPENDICULAR_PARKING_C.parking.depthM;
    readonly clearRoadWidthM = PERPENDICULAR_PARKING_C.mainRoad.clearWidthM;
    readonly outerEnvelopeWidthM = PERPENDICULAR_PARKING_C.mainRoad.outerEnvelopeWidthM;
    readonly overallCadSpanM = PERPENDICULAR_PARKING_C.cadReference.overallSpanM;
    readonly examBoundaryWidthM: number;
    readonly physicalEdgeOffsetM: number;
    readonly roadBoundaryInsetM: number;
    readonly curbWidthM: number;
    readonly curbHeightM: number;
    readonly capStart: boolean;
    readonly capEnd: boolean;
    readonly mainRoadBottomRadiusM: number;
    readonly parkingBottomRadiusM: number;

    constructor(options: PerpendicularParkingBayCOptions) {
        const rotationY = options.rotationY ?? 0;
        this.examBoundaryWidthM = options.examBoundaryWidthM ?? 0.05;
        this.physicalEdgeOffsetM = options.physicalEdgeOffsetM ?? 0.25;
        this.curbWidthM = options.curbWidthM ?? 0.20;
        this.curbHeightM = options.curbHeightM ?? CURB_VISUAL_HEIGHT_M;
        this.capStart = options.capStart ?? true;
        this.capEnd = options.capEnd ?? true;
        this.mainRoadBottomRadiusM = options.mainRoadBottomRadiusM ?? 0;
        this.parkingBottomRadiusM = options.parkingBottomRadiusM ?? 0;

        if (this.examBoundaryWidthM <= 0) throw new Error('examBoundaryWidthM must be > 0');
        if (this.physicalEdgeOffsetM < 0) throw new Error('physicalEdgeOffsetM must be ≥ 0');
        if (this.curbWidthM <= 0 || this.curbHeightM <= 0) throw new Error('curb dimensions must be > 0');
        if (this.mainRoadBottomRadiusM < 0
            || this.mainRoadBottomRadiusM > this.outerEnvelopeWidthM / 2
            || (this.mainRoadBottomRadiusM > 0 && !this.capStart)) {
            throw new Error('mainRoadBottomRadiusM needs a closed road end and must fit its width');
        }
        this.roadBoundaryInsetM = (this.outerEnvelopeWidthM - this.clearRoadWidthM - this.examBoundaryWidthM) / 2;
        if (this.roadBoundaryInsetM < 0) throw new Error('main road is too narrow for its red boundaries');
        this.geometry = derivePerpendicularParkingCGeometry(
            this.examBoundaryWidthM,
            this.physicalEdgeOffsetM,
        );
        if (this.parkingBottomRadiusM < 0
            || this.parkingBottomRadiusM > this.geometry.openingHalfWidthM
            || this.parkingBottomRadiusM > this.parkingDepthM) {
            throw new Error('parkingBottomRadiusM must fit the parking pocket');
        }

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

        this.buildSurface(options.surfaceColor ?? ROAD_SURFACE_COLOR);
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
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const roadRadius = this.mainRoadBottomRadiusM;
        const roadShape = new THREE.Shape();
        roadShape.moveTo(controlStartX + roadRadius, this.outerEnvelopeWidthM);
        roadShape.lineTo(controlEndX, this.outerEnvelopeWidthM);
        roadShape.lineTo(controlEndX, 0);
        roadShape.lineTo(controlStartX + roadRadius, 0);
        if (roadRadius > 0) {
            this.addArcToShape(roadShape, controlStartX + roadRadius, -roadRadius,
                roadRadius, Math.PI / 2, Math.PI);
            roadShape.lineTo(controlStartX, this.outerEnvelopeWidthM - roadRadius);
            this.addArcToShape(roadShape, controlStartX + roadRadius,
                -this.outerEnvelopeWidthM + roadRadius,
                roadRadius, Math.PI, 3 * Math.PI / 2);
        } else {
            roadShape.lineTo(controlStartX, 0);
            roadShape.lineTo(controlStartX, this.outerEnvelopeWidthM);
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

    private buildExamBoundary(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX } = this.geometry;
        const y = 0.065;
        const inset = this.physicalEdgeOffsetM;
        const roadOuterZ = -this.outerEnvelopeWidthM + this.roadBoundaryInsetM;
        const roadInnerZ = -this.roadBoundaryInsetM;
        const roadRedRadius = Math.max(0, this.mainRoadBottomRadiusM - inset);
        const roadRedStartX = this.mainRoadBottomRadiusM > 0
            ? controlStartX + inset + roadRedRadius : controlStartX;
        const parkingRedRadius = Math.max(0, this.parkingBottomRadiusM - inset);
        const parkingRedBottomZ = this.parkingDepthM - inset;
        const parkingRedLeftX = openingLeftX + inset;
        const parkingRedRightX = openingRightX - inset;
        const parkingEntryEndZ = parkingRedBottomZ - parkingRedRadius;

        this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadOuter',
            (roadRedStartX + controlEndX) / 2, roadOuterZ,
            controlEndX - roadRedStartX, this.examBoundaryWidthM, y, 0xf6d34c);
        this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadInnerLeft',
            (roadRedStartX + parkingRedLeftX) / 2, roadInnerZ,
            parkingRedLeftX - roadRedStartX, this.examBoundaryWidthM, y, 0xf6d34c);
        this.addCenteredStrip(this.examBoundaryGroup, 'EntryLeft', parkingRedLeftX,
            (roadInnerZ + parkingEntryEndZ) / 2,
            this.examBoundaryWidthM, parkingEntryEndZ - roadInnerZ, y, 0xf6d34c);
        this.addCenteredStrip(this.examBoundaryGroup, 'ParkingBottom', 0,
            parkingRedBottomZ,
            parkingRedRightX - parkingRedLeftX - 2 * parkingRedRadius + this.examBoundaryWidthM,
            this.examBoundaryWidthM, y, 0xf6d34c);
        this.addCenteredStrip(this.examBoundaryGroup, 'EntryRight', parkingRedRightX,
            (roadInnerZ + parkingEntryEndZ) / 2,
            this.examBoundaryWidthM, parkingEntryEndZ - roadInnerZ, y, 0xf6d34c);
        this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadInnerRight',
            (parkingRedRightX + controlEndX) / 2, roadInnerZ,
            controlEndX - parkingRedRightX, this.examBoundaryWidthM, y, 0xf6d34c);
        if (this.capStart) this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadStartCapBoundary',
            controlStartX + inset, (roadOuterZ + roadInnerZ) / 2,
            this.examBoundaryWidthM,
            roadInnerZ - roadOuterZ - 2 * roadRedRadius, y, 0xf6d34c);
        if (this.capEnd) this.addCenteredStrip(this.examBoundaryGroup, 'MainRoadEndCapBoundary', controlEndX - inset, -this.outerEnvelopeWidthM / 2, this.examBoundaryWidthM, this.outerEnvelopeWidthM - 2 * this.roadBoundaryInsetM, y, 0xf6d34c);
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
        const leftX = openingLeftX;
        const rightX = openingRightX;
        const bottomZ = this.parkingDepthM;
        const roadOuterZ = -this.outerEnvelopeWidthM;
        const roadInnerZ = 0;
        const roadRadius = this.mainRoadBottomRadiusM;
        const parkingRadius = this.parkingBottomRadiusM;
        const curbWidth = Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M);

        this.addSegmentedCurb('MainRoadOuterCurb',
            (controlStartX + roadRadius + controlEndX) / 2, roadOuterZ,
            controlEndX - controlStartX - roadRadius, 'horizontal', y);
        this.addSegmentedCurb('MainRoadInnerLeftCurb',
            (controlStartX + roadRadius + openingLeftX) / 2, roadInnerZ,
            openingLeftX - controlStartX - roadRadius, 'horizontal', y);
        this.addSegmentedCurb('ParkingLeftCurb', leftX,
            (this.parkingDepthM - parkingRadius) / 2,
            this.parkingDepthM - parkingRadius, 'vertical', y);
        this.addSegmentedCurb('ParkingBottomCurb', 0, bottomZ,
            this.geometry.openingWidthM - 2 * parkingRadius,
            'horizontal', y);
        this.addSegmentedCurb('ParkingRightCurb', rightX,
            (this.parkingDepthM - parkingRadius) / 2,
            this.parkingDepthM - parkingRadius, 'vertical', y);
        this.addSegmentedCurb('MainRoadInnerRightCurb', (openingRightX + controlEndX) / 2, roadInnerZ, controlEndX - openingRightX, 'horizontal', y);
        if (this.capStart) this.addSegmentedCurb('MainRoadStartCap', controlStartX,
            -this.outerEnvelopeWidthM / 2,
            this.outerEnvelopeWidthM - 2 * roadRadius, 'vertical', y);
        if (this.capEnd) this.addSegmentedCurb('MainRoadEndCap', controlEndX, -this.outerEnvelopeWidthM / 2, this.outerEnvelopeWidthM, 'vertical', y);
        if (roadRadius > 0) {
            this.addArcStrip(this.physicalEdgeGroup, 'MainRoadOuterCurbCorner',
                controlStartX + roadRadius, roadOuterZ + roadRadius,
                roadRadius, Math.PI, 3 * Math.PI / 2,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
            this.addArcStrip(this.physicalEdgeGroup, 'MainRoadInnerCurbCorner',
                controlStartX + roadRadius, -roadRadius,
                roadRadius, Math.PI / 2, Math.PI,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
        }
        if (parkingRadius > 0) {
            this.addArcStrip(this.physicalEdgeGroup, 'ParkingLeftCurbCorner',
                leftX + parkingRadius, bottomZ - parkingRadius,
                parkingRadius, Math.PI / 2, Math.PI,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
            this.addArcStrip(this.physicalEdgeGroup, 'ParkingRightCurbCorner',
                rightX - parkingRadius, bottomZ - parkingRadius,
                parkingRadius, 0, Math.PI / 2,
                curbWidth, .06, this.curbHeightM, [0xffffff, 0xd83b3b]);
        }
    }

    private buildLogic(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX, redInnerLeftX, redInnerRightX } = this.geometry;
        const roadRedInnerOuterZ = -this.outerEnvelopeWidthM + this.roadBoundaryInsetM + this.examBoundaryWidthM / 2;
        const roadRedInnerNearZ = -this.roadBoundaryInsetM - this.examBoundaryWidthM / 2;
        const approachZone = new THREE.Box3(
            new THREE.Vector3(controlStartX, -1, roadRedInnerOuterZ),
            new THREE.Vector3(controlEndX, 3, roadRedInnerNearZ),
        );
        const parkingInteriorZone = new THREE.Box3(
            new THREE.Vector3(redInnerLeftX, -1, 0),
            new THREE.Vector3(redInnerRightX, 3, this.parkingDepthM),
        );
        const entryGate = new THREE.Box3(
            new THREE.Vector3(openingLeftX, -1, -0.02),
            new THREE.Vector3(openingRightX, 3, 0.02),
        );

        this.logicGroup.userData = { approachZone, parkingInteriorZone, entryGate };
        this.logicGroup.visible = false;
    }

    private buildDebug(): void {
        const { controlStartX, controlEndX, openingLeftX, openingRightX, redInnerLeftX, redInnerRightX } = this.geometry;
        const y = 0.12;
        this.addDimension('Dim_Ed_Left', new THREE.Vector3(controlStartX, y, -this.outerEnvelopeWidthM - 0.5), new THREE.Vector3(openingLeftX, y, -this.outerEnvelopeWidthM - 0.5));
        this.addDimension('Dim_Rd', new THREE.Vector3(redInnerLeftX, y, -0.35), new THREE.Vector3(redInnerRightX, y, -0.35));
        this.addDimension('Dim_Ed_Right', new THREE.Vector3(openingRightX, y, -this.outerEnvelopeWidthM - 0.5), new THREE.Vector3(controlEndX, y, -this.outerEnvelopeWidthM - 0.5));
        this.addDimension('Dim_Ld', new THREE.Vector3(openingRightX + 0.45, y, 0), new THREE.Vector3(openingRightX + 0.45, y, this.parkingDepthM));
        this.addDimension('Dim_MainRoadWidth', new THREE.Vector3(controlStartX - 0.45, y, -this.outerEnvelopeWidthM), new THREE.Vector3(controlStartX - 0.45, y, 0));
        const roadRedInnerOuterZ = -this.outerEnvelopeWidthM + this.roadBoundaryInsetM + this.examBoundaryWidthM / 2;
        const roadRedInnerNearZ = -this.roadBoundaryInsetM - this.examBoundaryWidthM / 2;
        this.addDimension('Dim_MainRoadRedClearWidth', new THREE.Vector3(controlStartX - 0.25, y, roadRedInnerOuterZ), new THREE.Vector3(controlStartX - 0.25, y, roadRedInnerNearZ));
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
            if (colors.length > 1) {
                // All bay outline arcs have grass outside the radius. Supplying
                // the actual edge avoids choosing the inside of short stripes.
                mesh.userData.roadEdgeGrassPath = Array.from({ length: 9 }, (_, j) => {
                    const angle = start + (end - start) * j / 8;
                    return [centerX + outerRadius * Math.cos(angle), heightM,
                        centerZ + outerRadius * Math.sin(angle)];
                });
            }
            mesh.castShadow = colors.length > 1;
            mesh.receiveShadow = true;
            group.add(mesh);
        }
        parent.add(group);
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
                    ? new THREE.BoxGeometry(segmentM, this.curbHeightM,
                        Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M))
                    : new THREE.BoxGeometry(Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M),
                        this.curbHeightM, segmentM),
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
            const width = Math.min(this.curbWidthM, CURB_VISUAL_WIDTH_M);
            const grassSide = name === 'ParkingLeftCurb' || name === 'MainRoadStartCap'
                || name === 'MainRoadOuterCurb' ? -1 : 1;
            // Explicit local paths keep every short end stripe on the same side.
            curb.userData.roadEdgeGrassPath = direction === 'horizontal'
                ? [[grassSide * segmentM / 2, this.curbHeightM / 2, grassSide * width / 2],
                    [-grassSide * segmentM / 2, this.curbHeightM / 2, grassSide * width / 2]]
                : [[grassSide * width / 2, this.curbHeightM / 2, -grassSide * segmentM / 2],
                    [grassSide * width / 2, this.curbHeightM / 2, grassSide * segmentM / 2]];
            // Meet the perpendicular grass-facing paths at one shared corner.
            // Their centre lines meet at z=0, but their outer edges are offset
            // by half the paint width; leaving those endpoints apart creates
            // two square curb caps protruding through each other.
            if (name === 'MainRoadInnerLeftCurb' || name === 'MainRoadInnerRightCurb'
                || name === 'ParkingLeftCurb' || name === 'ParkingRightCurb') {
                const left = name === 'MainRoadInnerLeftCurb' || name === 'ParkingLeftCurb';
                const cornerX = left ? this.geometry.openingLeftX : this.geometry.openingRightX;
                for (const point of curb.userData.roadEdgeGrassPath as number[][]) {
                    const px = point[0] + curb.position.x, pz = point[2] + curb.position.z;
                    if (Math.abs(px - cornerX) <= width / 2 + 1e-6
                        && Math.abs(pz) <= width / 2 + 1e-6) {
                        point[0] = cornerX + (left ? -1 : 1) * width / 2 - curb.position.x;
                        point[2] = width / 2 - curb.position.z;
                    }
                }
            }
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
