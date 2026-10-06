import * as THREE from 'three';

export interface RoadStraight955Options {
    x: number;
    z: number;
    widthM: number;
    lengthM: number;
    startWidthM?: number;
    endWidthM?: number;
    startUpperWidthM?: number;
    startLowerWidthM?: number;
    endUpperWidthM?: number;
    endLowerWidthM?: number;
    upperLengthM?: number;
    lowerLengthM?: number;
    startUpperOffsetM?: number;
    startLowerOffsetM?: number;
    /** Hướng phân bố phần vát theo trục local X. */
    taperDirection?: 'left-to-right' | 'right-to-left';
    rotationY?: number;
    grassWidthM?: number;
    curbWidthM?: number;
    curbPlacement?: 'centered' | 'inside';
    placementLabel?: string;
    /** Semantic marker that stops auto-drive and opens waypoint recording. */
    autoDriveWaypointStopId?: string;
    /** Offset along the marker from its centre to the desired lane centre. */
    autoDriveWaypointStopLaneOffsetM?: number;
    showDebug?: boolean;
    showWidthDimension?: boolean;
    highlight?: boolean;
    showEdges?: boolean;
    edge?: {
        topRightRadiusM?: number;
        bottomRightRadiusM?: number;
    };
}

export interface RoadStraight955Geometry {
    widthM: number;
    lengthM: number;
    halfWidthM: number;
    edgeNegZ: number;
    edgePosZ: number;
}

export function deriveRoadStraight955Geometry(
    widthM: number,
    lengthM: number,
): RoadStraight955Geometry {
    return {
        widthM,
        lengthM,
        halfWidthM: widthM / 2,
        edgeNegZ: -widthM / 2,
        edgePosZ: widthM / 2,
    };
}

export function validateRoadStraight955(options: RoadStraight955Options): void {
    if (options.widthM <= 0) throw new Error('RoadStraight955: widthM must be > 0');
    if (options.lengthM <= 0) throw new Error('RoadStraight955: lengthM must be > 0');
    if (options.taperDirection !== undefined
        && options.taperDirection !== 'left-to-right'
        && options.taperDirection !== 'right-to-left') {
        throw new Error('RoadStraight955: taperDirection is invalid');
    }
    if (options.curbWidthM !== undefined && options.curbWidthM <= 0) {
        throw new Error('RoadStraight955: curbWidthM must be > 0');
    }
    for (const width of [
        options.startWidthM,
        options.endWidthM,
        options.startUpperWidthM,
        options.startLowerWidthM,
        options.endUpperWidthM,
        options.endLowerWidthM,
        options.upperLengthM,
        options.lowerLengthM,
        options.startUpperOffsetM,
        options.startLowerOffsetM,
    ]) {
        if (width !== undefined && width <= 0) {
            throw new Error('RoadStraight955: taper widths must be > 0');
        }
    }
    if (options.grassWidthM !== undefined && options.grassWidthM <= 0) {
        throw new Error('RoadStraight955: grassWidthM must be > 0');
    }
    for (const radius of [options.edge?.topRightRadiusM, options.edge?.bottomRightRadiusM]) {
        if (radius !== undefined && radius <= 0) {
            throw new Error('RoadStraight955: edge radius must be > 0');
        }
    }
}

export class RoadStraight955 {
    readonly root = new THREE.Group();
    readonly surfaceGroup = new THREE.Group();
    readonly edgesGroup = new THREE.Group();
    readonly surroundingsGroup = new THREE.Group();
    readonly logicGroup = new THREE.Group();
    readonly collisionGroup = new THREE.Group();
    readonly debugGroup = new THREE.Group();

    readonly geometry: RoadStraight955Geometry;
    readonly grassWidthM: number;
    readonly highlighted: boolean;
    readonly startWidthM: number;
    readonly endWidthM: number;
    readonly startUpperWidthM: number;
    readonly startLowerWidthM: number;
    readonly endUpperWidthM: number;
    readonly endLowerWidthM: number;
    readonly upperLengthM: number;
    readonly lowerLengthM: number;
    readonly startUpperOffsetM: number;
    readonly startLowerOffsetM: number;
    readonly curbWidthM: number;
    readonly curbPlacement: 'centered' | 'inside';
    readonly taperDirection: 'left-to-right' | 'right-to-left';

    constructor(options: RoadStraight955Options) {
        validateRoadStraight955(options);
        this.taperDirection = options.taperDirection ?? 'left-to-right';
        const startWidthM = options.startWidthM ?? options.widthM;
        const endWidthM = options.endWidthM ?? options.widthM;
        const startUpperWidthM = options.startUpperWidthM ?? startWidthM / 2;
        const startLowerWidthM = options.startLowerWidthM ?? startWidthM / 2;
        const endUpperWidthM = options.endUpperWidthM ?? endWidthM / 2;
        const endLowerWidthM = options.endLowerWidthM ?? endWidthM / 2;
        this.startWidthM = startWidthM;
        this.endWidthM = endWidthM;
        this.startUpperWidthM = startUpperWidthM;
        this.startLowerWidthM = startLowerWidthM;
        this.endUpperWidthM = endUpperWidthM;
        this.endLowerWidthM = endLowerWidthM;
        const upperLengthM = options.upperLengthM ?? options.lengthM;
        const lowerLengthM = options.lowerLengthM ?? options.lengthM;
        const taperLengthM = Math.max(options.lengthM, upperLengthM, lowerLengthM);
        this.upperLengthM = this.taperDirection === 'right-to-left'
            ? taperLengthM
            : upperLengthM;
        this.lowerLengthM = this.taperDirection === 'right-to-left'
            ? taperLengthM
            : lowerLengthM;
        this.startUpperOffsetM = this.taperDirection === 'right-to-left'
            ? options.startUpperOffsetM ?? taperLengthM - upperLengthM
            : options.startUpperOffsetM ?? 0;
        this.startLowerOffsetM = this.taperDirection === 'right-to-left'
            ? options.startLowerOffsetM ?? taperLengthM - lowerLengthM
            : options.startLowerOffsetM ?? 0;
        this.curbWidthM = options.curbWidthM ?? 0.20;
        this.curbPlacement = options.curbPlacement ?? 'centered';
        const maximumLengthM = Math.max(options.lengthM, this.upperLengthM, this.lowerLengthM);
        const maximumWidthM = Math.max(
            options.widthM,
            this.startUpperWidthM + this.startLowerWidthM,
            this.endUpperWidthM + this.endLowerWidthM,
        );
        this.geometry = deriveRoadStraight955Geometry(maximumWidthM, maximumLengthM);
        this.grassWidthM = options.grassWidthM ?? options.widthM / 2;
        this.highlighted = options.highlight ?? false;

        this.root.name = 'RoadStraight955';
        this.root.position.set(options.x, 0, options.z);
        this.root.rotation.y = options.rotationY ?? 0;
        this.root.userData = {
            usage: 'SHARED_MULTI_CLASS',
            widthM: options.widthM,
            lengthM: options.lengthM,
            placementLabel: options.placementLabel,
            autoDriveWaypointStopId: options.autoDriveWaypointStopId,
            highlight: this.highlighted,
            edge: options.edge ?? {},
            taperDirection: this.taperDirection,
        };

        this.surfaceGroup.name = 'Surface';
        this.edgesGroup.name = 'Edges';
        this.surroundingsGroup.name = 'Surroundings';
        this.logicGroup.name = 'Logic';
        this.collisionGroup.name = 'Collision';
        this.debugGroup.name = 'Debug';
        this.debugGroup.visible = options.showDebug ?? false;
        this.root.add(
            this.surfaceGroup,
            this.edgesGroup,
            this.surroundingsGroup,
            this.logicGroup,
            this.collisionGroup,
            this.debugGroup,
        );

        this.buildSurface();
        if (options.showEdges ?? true) this.buildEdges();
        this.buildGrass();
        this.buildLogic();
        this.buildCollision();
        this.buildDebug(options.placementLabel, options.showWidthDimension ?? true);
    }

    setDebug(visible: boolean): void {
        this.debugGroup.visible = visible;
    }

    private buildSurface(): void {
        const halfLength = this.geometry.lengthM / 2;
        const upperEndX = -halfLength + this.upperLengthM;
        const lowerEndX = -halfLength + this.lowerLengthM;
        const upperStartX = -halfLength + this.startUpperOffsetM;
        const shape = new THREE.Shape();
        const lowerStartX = -halfLength + this.startLowerOffsetM;
        shape.moveTo(lowerStartX, this.startLowerWidthM);
        shape.lineTo(lowerEndX, this.endLowerWidthM);
        shape.lineTo(upperEndX, -this.endUpperWidthM);
        shape.lineTo(upperStartX, -this.startUpperWidthM);
        shape.closePath();

        const surface = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape, {
                depth: 0.08,
                bevelEnabled: false,
            }),
            new THREE.MeshStandardMaterial({
                color: this.highlighted ? '#f2b84b' : '#2a2a2a',
                roughness: 0.95,
            }),
        );
        surface.geometry.rotateX(-Math.PI / 2);
        surface.name = 'AsphaltRoad';
        surface.position.y = -0.02;
        surface.receiveShadow = true;
        this.surfaceGroup.add(surface);
    }

    private buildEdges(): void {
        const curbWidthM = this.curbWidthM;
        const curbHeightM = 0.05;
        const segmentLengthM = 0.8;
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });
        const halfLength = this.geometry.lengthM / 2;
        const edges = [
            {
                name: 'RoadEdge_NegZ',
                startX: -halfLength + this.startLowerOffsetM,
                endX: -halfLength + this.lowerLengthM,
                startZ: -this.startLowerWidthM,
                endZ: -this.endLowerWidthM,
            },
            {
                name: 'RoadEdge_PosZ',
                startX: -halfLength + this.startUpperOffsetM,
                endX: -halfLength + this.upperLengthM,
                startZ: this.startUpperWidthM,
                endZ: this.endUpperWidthM,
            },
        ] as const;

        for (const edge of edges) {
            const edgeGroup = new THREE.Group();
            edgeGroup.name = edge.name;
            const edgeLengthM = edge.endX - edge.startX;
            const segmentCount = Math.ceil(edgeLengthM / segmentLengthM);
            for (let index = 0; index < segmentCount; index++) {
                const x0 = edge.startX + index * segmentLengthM;
                const x1 = Math.min(x0 + segmentLengthM, edge.endX);
                const t0 = edgeLengthM <= 0 ? 0 : (x0 - edge.startX) / edgeLengthM;
                const t1 = edgeLengthM <= 0 ? 0 : (x1 - edge.startX) / edgeLengthM;
                const z0 = edge.startZ + (edge.endZ - edge.startZ) * t0;
                const z1 = edge.startZ + (edge.endZ - edge.startZ) * t1;
                const halfCurbWidthM = curbWidthM / 2;
                const shape = new THREE.Shape();
                if (this.curbPlacement === 'inside') {
                    const z0Inside = edge.name === 'RoadEdge_NegZ'
                        ? z0 + curbWidthM
                        : z0 - curbWidthM;
                    const z1Inside = edge.name === 'RoadEdge_NegZ'
                        ? z1 + curbWidthM
                        : z1 - curbWidthM;
                    shape.moveTo(x0, -z0);
                    shape.lineTo(x1, -z1);
                    shape.lineTo(x1, -z1Inside);
                    shape.lineTo(x0, -z0Inside);
                } else {
                    shape.moveTo(x0, -(z0 - halfCurbWidthM));
                    shape.lineTo(x1, -(z1 - halfCurbWidthM));
                    shape.lineTo(x1, -(z1 + halfCurbWidthM));
                    shape.lineTo(x0, -(z0 + halfCurbWidthM));
                }
                shape.closePath();

                const curb = new THREE.Mesh(
                    new THREE.ExtrudeGeometry(shape, {
                        depth: curbHeightM,
                        bevelEnabled: false,
                    }),
                    index % 2 === 0 ? whiteMaterial : redMaterial,
                );
                curb.geometry.rotateX(-Math.PI / 2);
                curb.name = 'red-white-curb';
                curb.position.y = 0.06;
                curb.castShadow = true;
                curb.receiveShadow = true;
                edgeGroup.add(curb);
            }
            this.edgesGroup.add(edgeGroup);
        }
    }

    private buildGrass(): void {
        const grassMaterial = new THREE.MeshStandardMaterial({ color: '#4f7c45', roughness: 1 });
        for (const [name, z] of [
            ['GrassZone_NegZ', this.geometry.edgeNegZ - this.grassWidthM / 2],
            ['GrassZone_PosZ', this.geometry.edgePosZ + this.grassWidthM / 2],
        ] as const) {
            const grass = new THREE.Mesh(
                new THREE.BoxGeometry(this.geometry.lengthM, 0.02, this.grassWidthM),
                grassMaterial,
            );
            grass.name = name;
            grass.position.set(0, 0, z);
            grass.receiveShadow = true;
            this.surroundingsGroup.add(grass);
        }
    }

    private buildLogic(): void {
        this.logicGroup.userData = {
            DrivableRoadZone: new THREE.Box3(
                new THREE.Vector3(-this.geometry.lengthM / 2, -1, this.geometry.edgeNegZ),
                new THREE.Vector3(this.geometry.lengthM / 2, 3, this.geometry.edgePosZ),
            ),
        };
        this.logicGroup.visible = false;
    }

    private buildCollision(): void {
        const { lengthM, edgeNegZ, edgePosZ } = this.geometry;
        this.collisionGroup.userData = {
            GrassCollider_NegZ: new THREE.Box3(
                new THREE.Vector3(-lengthM / 2, -1, edgeNegZ - this.grassWidthM),
                new THREE.Vector3(lengthM / 2, 3, edgeNegZ),
            ),
            GrassCollider_PosZ: new THREE.Box3(
                new THREE.Vector3(-lengthM / 2, -1, edgePosZ),
                new THREE.Vector3(lengthM / 2, 3, edgePosZ + this.grassWidthM),
            ),
        };
        this.collisionGroup.visible = false;
    }

    private buildDebug(placementLabel?: string, showWidthDimension = true): void {
        if (showWidthDimension) {
            this.addDebugLine(
                'WidthDimension',
                new THREE.Vector3(-this.geometry.lengthM / 2 - 0.4, 0.12, this.geometry.edgeNegZ),
                new THREE.Vector3(-this.geometry.lengthM / 2 - 0.4, 0.12, this.geometry.edgePosZ),
                0x00e5ff,
            );
        }

        if (placementLabel) {
            const label = this.createDebugLabel(placementLabel);
            label.name = 'PlacementLabel';
            label.position.set(0, 0.125, 0);
            this.debugGroup.add(label);
        }
    }

    private addDebugLine(
        name: string,
        start: THREE.Vector3,
        end: THREE.Vector3,
        color: number,
    ): void {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, depthTest: false }));
        line.name = name;
        this.debugGroup.add(line);
    }

    private createDebugLabel(text: string): THREE.Mesh {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#00e5ff';
        context.font = 'bold 72px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 1),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
        );
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    }
}

export function createRoadStraight955(options: RoadStraight955Options): THREE.Group {
    return new RoadStraight955(options).root;
}
