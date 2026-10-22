import { ROAD_SURFACE_COLOR } from './roadStyle';
import * as THREE from 'three';
import { CURB_VISUAL_HEIGHT_M, CURB_VISUAL_WIDTH_M } from './curbStyle';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** Cache cho railway track GLB — load một lần, clone cho mỗi placement */
let _railwayTrackCache: THREE.Group | null = null;
let _railwayLoader = new GLTFLoader();

/**
 * Railway Crossing Road — đường bộ giao cắt đường sắt
 * Theo UI mẫu từ ảnh CAD và spec/road/railway_crossing_road_spec.md
 *
 * Visual Elements (màu cyan #00d4ff):
 *   - STOP_LINE: vạch dừng ngang đường
 *   - RAILWAY_TRACK: model GLB đường ray (sử dụng /models/railway_track_v2.glb)
 *   - CENTER_LINE: vạch giữa đứt dọc theo hướng xe
 *
 * Geometry Convention:
 *   +Z = vehicle travel direction (road direction)
 *   +X = stop line / rail direction (perpendicular to road)
 *   +Y = up
 *
 * Key constraints:
 *   STOP_LINE ⟂ ROAD_DIRECTION
 *   RAILWAY_TRACK ⟂ ROAD_DIRECTION
 *   distance(STOP_LINE, approachSideOuterRail) = 5.0 m
 *   distance(approachSideOuterRail, exitRail) = 4.7 m
 */
export interface RailwayCrossingRoadOptions {
    /** Tọa độ tâm (world X) */
    x?: number;
    /** Tọa độ tâm (world Z) */
    z?: number;
    /** Chiều rộng đường bộ (m), mặc định 4.0 m */
    roadWidthM?: number;
    /** Chiều dài mặt đường (m), mặc định 30 m */
    roadLengthM?: number;
    /** Xoay module quanh trục Y (radian), mặc định 0 */
    rotationY?: number;
    /** Scale cho GLB railway track, mặc định 1.0 */
    railwayTrackScale?: number;
}

export class RailwayCrossingRoad {
    readonly root = new THREE.Group();
    readonly roadWidthM: number;
    readonly roadLengthM: number;
    readonly railwayTrackScale: number;

    // Vị trí các thành phần (local Z trong root)
    readonly stopLineLocalZ: number;           // Vạch dừng
    readonly approachOuterRailLocalZ: number;   // RAIL_01 (phía tiếp cận)
    readonly exitRailLocalZ: number;            // RAIL_02 (phía xa)

    // Sensors for gameplay (world space)
    private _approachSensor: THREE.Box3 | null = null;
    private _stopLineSensor: THREE.Box3 | null = null;
    private _outerRailSensor: THREE.Box3 | null = null;
    private _railwayExitSensor: THREE.Box3 | null = null;

    // Colors từ UI
    private static readonly CYAN = 0x00d4ff;

    constructor(options: RailwayCrossingRoadOptions = {}) {
        const {
            x = 0,
            z = 0,
            roadWidthM = 4.0,
            roadLengthM = 30,
            rotationY = 0,
            railwayTrackScale = .4,
        } = options;

        this.roadWidthM = roadWidthM;
        this.roadLengthM = roadLengthM;
        this.railwayTrackScale = railwayTrackScale;

        this.root.name = 'railway-crossing-road';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = rotationY;

        // Topology theo UI:
        // Xe đi theo +Z (xuống dưới trong ảnh)
        // STOP_LINE → [5.0m] → RAIL_01 (approach outer) → [4.7m] → RAIL_02 (exit)
        this.stopLineLocalZ = 0;
        this.approachOuterRailLocalZ = 5.0;  // 5.0m từ stop line
        this.exitRailLocalZ = 5.0 + 4.7;     // 4.7m từ RAIL_01

        this.build();
        this.root.updateMatrixWorld(true);
    }

    /**
     * Pre-load railway track GLB vào cache (gọi một lần khi khởi tạo scene).
     * @returns Promise resolve khi model đã sẵn sàng.
     */
    static async preload(): Promise<void> {
        if (_railwayTrackCache) return;
        try {
            const gltf = await _railwayLoader.loadAsync('/models/railway_track_v2.glb');
            _railwayTrackCache = gltf.scene;
        } catch (err) {
            console.error('Failed to load railway_track_v2.glb:', err);
        }
    }

    private build() {
        // this.buildRoadSurface();
        this.buildStopLine();
        this.buildRailwayTrack();
    }

    /**
     * Mặt đường bộ (asphalt)
     */
    private buildRoadSurface() {
        const asphalt = new THREE.MeshStandardMaterial({
            color: ROAD_SURFACE_COLOR,
            roughness: 0.95,
        });

        const road = new THREE.Mesh(
            new THREE.BoxGeometry(this.roadWidthM, 0.08, this.roadLengthM),
            asphalt
        );
        road.position.set(0, 0.02, 0);
        road.name = 'road-surface';
        road.receiveShadow = true;
        this.root.add(road);

        // Curb viền đường (màu trắng/đỏ thu nhỏ)
        this.buildCurb(-1);
        this.buildCurb(1);
    }

    /**
     * Curb viền đường một bên
     */
    private buildCurb(side: -1 | 1) {
        const segmentLen = 0.8;
        const curbWidth = CURB_VISUAL_WIDTH_M;
        const curbHeight = CURB_VISUAL_HEIGHT_M;

        const count = Math.ceil(this.roadLengthM / segmentLen);
        const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b, roughness: 0.85 });

        for (let i = 0; i < count; i++) {
            const length = Math.min(segmentLen, this.roadLengthM - i * segmentLen);
            const material = i % 2 === 0 ? white : red;

            const curb = new THREE.Mesh(
                new THREE.BoxGeometry(curbWidth, curbHeight, length),
                material
            );

            const offsetX = side * (this.roadWidthM / 2 - curbWidth / 2);
            curb.position.set(
                offsetX,
                0.08 / 2 + curbHeight / 2 + 0.02,
                -this.roadLengthM / 2 + i * segmentLen + length / 2
            );
            curb.castShadow = true;
            curb.receiveShadow = true;
            this.root.add(curb);
        }
    }

    /**
     * Vạch giữa đường (cyan, đứt) - chạy dọc theo hướng xe
     */
    private buildCenterLine() {
        const dashLength = 1.5;
        const gapLength = 1;
        const lineWidth = 0.15;
        const lineThickness = 0.01;

        const cyan = new THREE.MeshStandardMaterial({
            color: RailwayCrossingRoad.CYAN,
            roughness: 0.85,
        });

        // Vạch giữa chạy dọc theo hướng xe (+Z)
        // Gián đoạn ở vùng railway
        const railwayStartZ = this.approachOuterRailLocalZ - 1;
        const railwayEndZ = this.exitRailLocalZ + 1;
        const roadStartZ = -this.roadLengthM / 2;
        const roadEndZ = this.roadLengthM / 2;

        // Phía trước stop line: từ đầu đường đến stopLineLocalZ - 0.5
        const beforeStopLineEnd = this.stopLineLocalZ - 0.5;
        for (
            let start = roadStartZ;
            start < beforeStopLineEnd;
            start += dashLength + gapLength
        ) {
            const end = Math.min(start + dashLength, beforeStopLineEnd);
            if (end > start) {
                const line = new THREE.Mesh(
                    new THREE.BoxGeometry(lineWidth, lineThickness, end - start),
                    cyan
                );
                line.position.set(0, 0.072, (start + end) / 2);
                line.receiveShadow = true;
                line.name = 'center-line';
                this.root.add(line);
            }
        }

        // Phía sau railway (sau RAIL_02): từ railwayEndZ + 0.5 đến cuối đường
        const afterRailwayStart = railwayEndZ + 0.5;
        for (
            let start = afterRailwayStart;
            start < roadEndZ;
            start += dashLength + gapLength
        ) {
            const end = Math.min(start + dashLength, roadEndZ);
            if (end > start) {
                const line = new THREE.Mesh(
                    new THREE.BoxGeometry(lineWidth, lineThickness, end - start),
                    cyan
                );
                line.position.set(0, 0.072, (start + end) / 2);
                line.receiveShadow = true;
                line.name = 'center-line';
                this.root.add(line);
            }
        }
    }

    /**
     * Vạch dừng (STOP_LINE) - cyan, ngang đường, vuông góc hướng xe
     */
    private buildStopLine() {
        const white = new THREE.MeshStandardMaterial({
            color: '#fff',
            roughness: 0.85,
            emissive: RailwayCrossingRoad.CYAN,
            emissiveIntensity: 0.1,
        });

        // Vạch dừng chạy ngang đường (theo X), tại stopLineLocalZ
        const stopLine = new THREE.Mesh(
            new THREE.BoxGeometry(8, 0.012, 0.2),
            white
        );
        stopLine.position.set(0, 0.075, this.stopLineLocalZ);
        stopLine.receiveShadow = true;
        stopLine.name = 'stop-line';
        this.root.add(stopLine);
    }

    /**
     * Nhãn "DỪNG" bên cạnh đường
     */
    private buildStopLineLabel() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DỪNG', canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 0.5),
            new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                roughness: 0.85,
                depthWrite: false,
            })
        );

        // Đặt nhãn bên phải đường, trước stop line
        label.position.set(
            this.roadWidthM / 2 + 1,
            0.5,
            this.stopLineLocalZ - 1
        );
        label.rotation.y = Math.PI / 2;
        this.root.add(label);
    }

    /**
     * Đường ray xe lửa - sử dụng model GLB /models/railway_track_v2.glb
     * Model được clone từ cache, position tại approachOuterRailLocalZ
     */
    private buildRailwayTrack() {
        if (_railwayTrackCache) {
            // Clone model từ cache
            const trackModel = _railwayTrackCache.clone(true);

            // Scale model theo option
            trackModel.scale.setScalar(this.railwayTrackScale);

            // Enable shadows
            trackModel.traverse(obj => {
                if ((obj as THREE.Mesh).isMesh) {
                    const m = obj as THREE.Mesh;
                    m.castShadow = true;
                    m.receiveShadow = true;
                }
            });

            // Đo kích thước thực của model (bounding box)
            const box = new THREE.Box3().setFromObject(trackModel);

            // Position: RAIL_01 tại approachOuterRailLocalZ
            // Căn giữa model theo X, đặt bottom trên mặt đất (Y=0.08)
            trackModel.position.set(
                0,
                0.08 - box.min.y,
                this.approachOuterRailLocalZ
            );
            trackModel.name = 'railway-track-glb';
            this.root.add(trackModel);
        } else {
            // Fallback: tạo ray đơn giản nếu GLB chưa load
            console.warn('Railway track GLB not loaded, using fallback rails');
            this.buildRailwayTrackFallback();
        }
    }

    /**
     * Fallback: tạo ray đơn giản khi GLB không khả dụng
     */
    private buildRailwayTrackFallback() {
        const cyan = new THREE.MeshStandardMaterial({
            color: RailwayCrossingRoad.CYAN,
            roughness: 0.6,
            metalness: 0.8,
            emissive: RailwayCrossingRoad.CYAN,
            emissiveIntensity: 0.15,
        });

        const railLength = this.roadWidthM + 4;
        const railHeight = 0.08;
        const railWidth = 0.06;

        // RAIL_01 - approach outer rail
        const rail1 = new THREE.Mesh(
            new THREE.BoxGeometry(railLength, railHeight, railWidth),
            cyan
        );
        rail1.position.set(0, 0.04 + railHeight / 2, this.approachOuterRailLocalZ);
        rail1.castShadow = true;
        rail1.name = 'rail-01-fallback';
        this.root.add(rail1);

        // RAIL_02 - exit rail (4.7m từ RAIL_01)
        const rail2 = new THREE.Mesh(
            new THREE.BoxGeometry(railLength, railHeight, railWidth),
            cyan
        );
        rail2.position.set(0, 0.04 + railHeight / 2, this.exitRailLocalZ);
        rail2.castShadow = true;
        rail2.name = 'rail-02-fallback';
        this.root.add(rail2);

        // Sleepers fallback
        this.buildSleepersFallback();
    }

    /**
     * Fallback: tạo sleepers đơn giản
     */
    private buildSleepersFallback() {
        const sleeperColor = 0x8b6914;
        const sleeper = new THREE.MeshStandardMaterial({
            color: sleeperColor,
            roughness: 0.9,
        });

        const sleeperSpacing = 0.4;
        const sleeperLength = this.roadWidthM + 6;
        const sleeperHeight = 0.06;
        const sleeperWidth = 0.12;

        const railwayStartZ = this.approachOuterRailLocalZ - 0.5;
        const railwayEndZ = this.exitRailLocalZ + 0.5;
        const totalDepth = railwayEndZ - railwayStartZ;

        const sleeperCount = Math.ceil(totalDepth / sleeperSpacing);

        for (let i = 0; i < sleeperCount; i++) {
            const sleeperZ = railwayStartZ + i * sleeperSpacing + sleeperSpacing / 2;

            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(sleeperLength, sleeperHeight, sleeperWidth),
                sleeper
            );
            mesh.position.set(0, 0.03, sleeperZ);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            mesh.name = `sleeper-fallback-${String(i + 1).padStart(3, '0')}`;
            this.root.add(mesh);
        }
    }

    /**
     * Các marker đo kích thước (5.0m và 4.7m)
     */
    private buildDimensionMarkers() {
        // Màu cyan cho dimension markers
        const cyan = new THREE.MeshStandardMaterial({
            color: RailwayCrossingRoad.CYAN,
            roughness: 0.7,
            emissive: RailwayCrossingRoad.CYAN,
            emissiveIntensity: 0.2,
        });

        // Marker 5.0m: từ stop line đến RAIL_01
        this.buildDimensionLine(
            this.stopLineLocalZ,
            this.approachOuterRailLocalZ,
            '5.0',
            cyan
        );

        // Marker 4.7m: từ RAIL_01 đến RAIL_02
        this.buildDimensionLine(
            this.approachOuterRailLocalZ,
            this.exitRailLocalZ,
            '4.7',
            cyan
        );
    }

    /**
     * Vẽ đường đo kích thước với nhãn
     */
    private buildDimensionLine(startZ: number, endZ: number, label: string, material: THREE.Material) {
        // Vị trí dimension line bên phải đường
        const dimX = this.roadWidthM / 2 + 1.5;

        // Line dọc nối 2 điểm
        const lineLength = endZ - startZ;
        const lineMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.01, lineLength),
            material
        );
        lineMesh.position.set(dimX, 0.08, (startZ + endZ) / 2);
        this.root.add(lineMesh);

        // Marker ở 2 đầu (vuông góc)
        const markerLen = 0.3;
        for (const z of [startZ, endZ]) {
            const marker = new THREE.Mesh(
                new THREE.BoxGeometry(markerLen, 0.01, 0.03),
                material
            );
            marker.position.set(dimX, 0.08, z);
            this.root.add(marker);
        }

        // Nhãn kích thước
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const labelMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 0.5),
            new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
            })
        );
        labelMesh.position.set(dimX, 0.5, (startZ + endZ) / 2);
        this.root.add(labelMesh);
    }

    /**
     * Xây dựng sensors cho gameplay
     */
    private buildSensors() {
        const halfRoadWidth = this.roadWidthM / 2;
        const sensorHeight = 4;

        // Approach sensor: vùng tiếp cận trước stop line (15m)
        const approachStartZ = this.stopLineLocalZ - 15;
        this._approachSensor = new THREE.Box3(
            new THREE.Vector3(-halfRoadWidth, -1, approachStartZ),
            new THREE.Vector3(halfRoadWidth, sensorHeight, this.stopLineLocalZ + 0.2)
        );

        // Stop line sensor: dải mỏng tại vạch dừng
        this._stopLineSensor = new THREE.Box3(
            new THREE.Vector3(-halfRoadWidth, -1, this.stopLineLocalZ - 0.1),
            new THREE.Vector3(halfRoadWidth, sensorHeight, this.stopLineLocalZ + 0.1)
        );

        // Outer rail sensor: tại RAIL_01
        this._outerRailSensor = new THREE.Box3(
            new THREE.Vector3(-halfRoadWidth, -1, this.approachOuterRailLocalZ - 0.15),
            new THREE.Vector3(halfRoadWidth, sensorHeight, this.approachOuterRailLocalZ + 0.15)
        );

        // Railway exit sensor: tại RAIL_02
        this._railwayExitSensor = new THREE.Box3(
            new THREE.Vector3(-halfRoadWidth, -1, this.exitRailLocalZ - 0.15),
            new THREE.Vector3(halfRoadWidth, sensorHeight, this.exitRailLocalZ + 0.15)
        );
    }

    /**
     * Lấy sensor vùng tiếp cận (world space)
     */
    get approachSensor(): THREE.Box3 {
        if (!this._approachSensor) {
            this._approachSensor = new THREE.Box3();
        }
        return this._approachSensor.clone().applyMatrix4(this.root.matrixWorld);
    }

    /**
     * Lấy sensor vạch dừng (world space)
     */
    get stopLineSensor(): THREE.Box3 {
        if (!this._stopLineSensor) {
            this._stopLineSensor = new THREE.Box3();
        }
        return this._stopLineSensor.clone().applyMatrix4(this.root.matrixWorld);
    }

    /**
     * Lấy sensor RAIL_01 (world space)
     */
    get outerRailSensor(): THREE.Box3 {
        if (!this._outerRailSensor) {
            this._outerRailSensor = new THREE.Box3();
        }
        return this._outerRailSensor.clone().applyMatrix4(this.root.matrixWorld);
    }

    /**
     * Lấy sensor RAIL_02 (world space)
     */
    get railwayExitSensor(): THREE.Box3 {
        if (!this._railwayExitSensor) {
            this._railwayExitSensor = new THREE.Box3();
        }
        return this._railwayExitSensor.clone().applyMatrix4(this.root.matrixWorld);
    }

    /**
     * Validation: kiểm tra geometry theo spec
     */
    static validate(options: RailwayCrossingRoadOptions): boolean {
        const EPS = 1e-4;
        const roadDirection = new THREE.Vector3(0, 0, 1);
        const stopLineDirection = new THREE.Vector3(1, 0, 0);
        const railDirection = new THREE.Vector3(1, 0, 0);

        // Stop line ⟂ road direction
        if (Math.abs(roadDirection.dot(stopLineDirection)) > EPS) {
            console.error('STOP_LINE must be perpendicular to road direction');
            return false;
        }

        // Rail ⟂ road direction
        if (Math.abs(roadDirection.dot(railDirection)) > EPS) {
            console.error('RAILS must be perpendicular to road direction');
            return false;
        }

        // Rail ∥ stop line
        if (Math.abs(Math.abs(railDirection.dot(stopLineDirection)) - 1) > EPS) {
            console.error('STOP_LINE and RAILS must be parallel');
            return false;
        }

        return true;
    }
}
