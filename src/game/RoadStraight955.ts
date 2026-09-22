import * as THREE from 'three';

export interface RoadStraight955Options {
    x: number;
    z: number;
    widthM: number;
    lengthM: number;
    rotationY?: number;
    grassWidthM?: number;
    placementLabel?: string;
    showDebug?: boolean;
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

    constructor(options: RoadStraight955Options) {
        validateRoadStraight955(options);
        this.geometry = deriveRoadStraight955Geometry(options.widthM, options.lengthM);
        this.grassWidthM = options.grassWidthM ?? options.widthM / 2;

        this.root.name = 'RoadStraight955';
        this.root.position.set(options.x, 0, options.z);
        this.root.rotation.y = options.rotationY ?? 0;
        this.root.userData = {
            usage: 'SHARED_MULTI_CLASS',
            widthM: options.widthM,
            lengthM: options.lengthM,
            placementLabel: options.placementLabel,
            edge: options.edge ?? {},
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
        this.buildEdges();
        this.buildGrass();
        this.buildLogic();
        this.buildCollision();
        this.buildDebug(options.placementLabel);
    }

    setDebug(visible: boolean): void {
        this.debugGroup.visible = visible;
    }

    private buildSurface(): void {
        const surface = new THREE.Mesh(
            new THREE.BoxGeometry(this.geometry.lengthM, 0.08, this.geometry.widthM),
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 }),
        );
        surface.name = 'AsphaltRoad';
        surface.position.y = 0.02;
        surface.receiveShadow = true;
        this.surfaceGroup.add(surface);
    }

    private buildEdges(): void {
        const curbWidthM = 0.20;
        const curbHeightM = 0.05;
        const segmentLengthM = 0.8;
        const segmentCount = Math.ceil(this.geometry.lengthM / segmentLengthM);
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });

        for (const [name, z] of [
            ['RoadEdge_NegZ', this.geometry.edgeNegZ],
            ['RoadEdge_PosZ', this.geometry.edgePosZ],
        ] as const) {
            const edgeGroup = new THREE.Group();
            edgeGroup.name = name;
            for (let index = 0; index < segmentCount; index++) {
                const lengthM = Math.min(
                    segmentLengthM,
                    this.geometry.lengthM - index * segmentLengthM,
                );
                const curb = new THREE.Mesh(
                    new THREE.BoxGeometry(lengthM, curbHeightM, curbWidthM),
                    index % 2 === 0 ? whiteMaterial : redMaterial,
                );
                curb.name = 'red-white-curb';
                curb.position.set(
                    -this.geometry.lengthM / 2 + index * segmentLengthM + lengthM / 2,
                    0.085,
                    z,
                );
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

    private buildDebug(placementLabel?: string): void {
        this.addDebugLine(
            'WidthDimension',
            new THREE.Vector3(-this.geometry.lengthM / 2 - 0.4, 0.12, this.geometry.edgeNegZ),
            new THREE.Vector3(-this.geometry.lengthM / 2 - 0.4, 0.12, this.geometry.edgePosZ),
            0x00e5ff,
        );

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
