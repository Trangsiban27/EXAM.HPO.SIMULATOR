import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';

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
    /** Giới hạn chiều dài curb mép -local Z, tính từ đầu connector. */
    lowerCurbLengthM?: number;
    /** Giới hạn chiều dài curb mép +local Z, tính từ đầu connector. */
    upperCurbLengthM?: number;
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
        topLeftRadiusM?: number;
        topRightRadiusM?: number;
        bottomLeftRadiusM?: number;
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
    if (options.lowerCurbLengthM !== undefined && options.lowerCurbLengthM < 0) {
        throw new Error('RoadStraight955: curb lengths must be >= 0');
    }
    if (options.upperCurbLengthM !== undefined && options.upperCurbLengthM < 0) {
        throw new Error('RoadStraight955: curb lengths must be >= 0');
    }
    if (options.grassWidthM !== undefined && options.grassWidthM <= 0) {
        throw new Error('RoadStraight955: grassWidthM must be > 0');
    }
    for (const radius of Object.values(options.edge ?? {})) {
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
    readonly lowerCurbLengthM?: number;
    readonly upperCurbLengthM?: number;
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
        this.lowerCurbLengthM = options.lowerCurbLengthM;
        this.upperCurbLengthM = options.upperCurbLengthM;
        this.startUpperOffsetM = this.taperDirection === 'right-to-left'
            ? options.startUpperOffsetM ?? taperLengthM - upperLengthM
            : options.startUpperOffsetM ?? 0;
        this.startLowerOffsetM = this.taperDirection === 'right-to-left'
            ? options.startLowerOffsetM ?? taperLengthM - lowerLengthM
            : options.startLowerOffsetM ?? 0;
        this.curbWidthM = Math.min(options.curbWidthM ?? CURB_VISUAL_WIDTH_M, CURB_VISUAL_WIDTH_M);
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

        this.buildSurface(options.edge);
        if (options.showEdges ?? true) this.buildEdges();
        this.buildGrass();
        this.buildLogic();
        this.buildCollision();
        this.buildDebug(options.placementLabel, options.showWidthDimension ?? true);
    }

    setDebug(visible: boolean): void {
        this.debugGroup.visible = visible;
    }

    private buildSurface(edge?: RoadStraight955Options['edge']): void {
        const halfLength = this.geometry.lengthM / 2;
        const upperEndX = -halfLength + this.upperLengthM;
        const lowerEndX = -halfLength + this.lowerLengthM;
        const upperStartX = -halfLength + this.startUpperOffsetM;
        const lowerStartX = -halfLength + this.startLowerOffsetM;
        const corners = [
            new THREE.Vector2(lowerStartX, this.startLowerWidthM),
            new THREE.Vector2(lowerEndX, this.endLowerWidthM),
            new THREE.Vector2(upperEndX, -this.endUpperWidthM),
            new THREE.Vector2(upperStartX, -this.startUpperWidthM),
        ];
        const radii = [
            edge?.topLeftRadiusM ?? 0,
            edge?.topRightRadiusM ?? 0,
            edge?.bottomRightRadiusM ?? 0,
            edge?.bottomLeftRadiusM ?? 0,
        ];
        const shape = new THREE.Shape();
        corners.forEach((corner, index) => {
            const previous = corners[(index + corners.length - 1) % corners.length];
            const next = corners[(index + 1) % corners.length];
            const toPrevious = previous.clone().sub(corner);
            const toNext = next.clone().sub(corner);
            const previousLength = toPrevious.length();
            const nextLength = toNext.length();
            if (!radii[index] || previousLength < .001 || nextLength < .001) {
                if (index === 0) shape.moveTo(corner.x, corner.y);
                else shape.lineTo(corner.x, corner.y);
                return;
            }
            toPrevious.normalize();
            toNext.normalize();
            const halfAngle = Math.acos(THREE.MathUtils.clamp(
                toPrevious.dot(toNext), -1, 1,
            )) / 2;
            const tangent = Math.min(
                radii[index] / Math.tan(halfAngle), previousLength / 2, nextLength / 2,
            );
            const radius = tangent * Math.tan(halfAngle);
            const start = corner.clone().addScaledVector(toPrevious, tangent);
            const end = corner.clone().addScaledVector(toNext, tangent);
            const center = corner.clone().addScaledVector(
                toPrevious.add(toNext).normalize(), radius / Math.sin(halfAngle),
            );
            if (index === 0) shape.moveTo(start.x, start.y);
            else shape.lineTo(start.x, start.y);
            shape.absarc(
                center.x, center.y, radius,
                Math.atan2(start.y - center.y, start.x - center.x),
                Math.atan2(end.y - center.y, end.x - center.x), true,
            );
        });
        shape.closePath();

        const surface = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape, {
                depth: 0.08,
                bevelEnabled: false,
            }),
            new THREE.MeshStandardMaterial({
                color: this.highlighted ? '#f2b84b' : ROAD_SURFACE_COLOR,
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
        const curbHeightM = CURB_VISUAL_HEIGHT_M;
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
            const fullEdgeLengthM = edge.endX - edge.startX;
            const curbLengthM = edge.name === 'RoadEdge_NegZ'
                ? this.lowerCurbLengthM : this.upperCurbLengthM;
            const edgeLengthM = Math.min(fullEdgeLengthM, curbLengthM ?? fullEdgeLengthM);
            const segmentCount = Math.ceil(edgeLengthM / segmentLengthM);
            for (let index = 0; index < segmentCount; index++) {
                const x0 = edge.startX + index * segmentLengthM;
                const x1 = Math.min(x0 + segmentLengthM, edge.startX + edgeLengthM);
                const t0 = fullEdgeLengthM <= 0 ? 0 : (x0 - edge.startX) / fullEdgeLengthM;
                const t1 = fullEdgeLengthM <= 0 ? 0 : (x1 - edge.startX) / fullEdgeLengthM;
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
