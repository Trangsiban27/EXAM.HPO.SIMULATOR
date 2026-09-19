import * as THREE from 'three';
import { Bridge } from './Bridge';
import { TrafficLight } from './TrafficLight';
import { ExerciseSign } from './ExerciseSign';
import { PedestrianSign, type PedestrianSignOptions } from './PedestrianSign';
import { StopSign, type StopSignOptions } from './StopSign';
import { WindingCourse } from './WindingCourse';
import { WheelTrackCourse } from './WheelTrackCourse';
import { startPosition } from './startPosition';

type ArrowType = 'straight' | 'left' | 'right' | 'none';
type RoadDirection = 'vertical' | 'horizontal';
type LaneCount = 1 | 2;
type CenterLineType = 'white-dashed' | 'white-solid' | 'yellow-dashed' | 'yellow-solid';
type RoadRect = { minX: number; maxX: number; minZ: number; maxZ: number };
type RoadSegment = { group: THREE.Group; x: number; z: number; direction: RoadDirection; bounds: RoadRect };

export class TrackObjects{
    readonly root=new THREE.Group();
    readonly penaltyZones:THREE.Box3[]=[];
    private readonly bridges: Bridge[] = [];
    private readonly trafficLights: TrafficLight[] = [];
    startSignal: TrafficLight | null = null;
    /**
     * Exam04 course sensors for all 4 wheel-track courses.
     * Populated by buildExamGround after addWheelTrackCourse() calls.
     */
    wheelTrackCourseSensors: ReturnType<TrackObjects['addWheelTrackCourse']>[] = [];

    update(dt: number, vehiclePosition: THREE.Vector3) {
        for (const light of this.trafficLights) light.update(dt, vehiclePosition);
    }

    reset() {
        for (const light of this.trafficLights) light.reset();
        if (this.startSignal) this.startSignal.reset();
    }
    addTrafficLight(x: number, z: number, width = 8, rotation = 0) {
        const signal = new TrafficLight(x, z, width, rotation);
        this.trafficLights.push(signal);
        this.root.add(signal.root);
        return signal;
    }

    private readonly roads: RoadSegment[] = [];

    getSurfaceHeight(x: number, z: number) {
        for (const bridge of this.bridges) {
            const height = bridge.surfaceHeight(x, z);
            if (height !== undefined) return height;
        }
        return .06;
    }

    addBridge(x: number, z: number, direction: RoadDirection = 'vertical') {
        const bridge = new Bridge(x, z, direction);
        this.bridges.push(bridge);
        this.root.add(bridge.root);
        return bridge;
    }


    private createArrowTexture(type: 'straight' | 'left' | 'right') {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;

        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 28;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const cx = canvas.width / 2;

        if (type === 'straight') {
            // thân mũi tên
            ctx.beginPath();
            ctx.moveTo(cx, 420);
            ctx.lineTo(cx, 140);
            ctx.stroke();

            // đầu mũi tên
            ctx.beginPath();
            ctx.moveTo(cx, 90);
            ctx.lineTo(cx - 55, 165);
            ctx.lineTo(cx - 20, 165);
            ctx.lineTo(cx - 20, 250);
            ctx.lineTo(cx + 20, 250);
            ctx.lineTo(cx + 20, 165);
            ctx.lineTo(cx + 55, 165);
            ctx.closePath();
            ctx.fill();
        }

        if (type === 'left' || type === 'right') {
            // Solid, square elbow and broad arrowhead, matching the road marking reference.
            ctx.save();
            if (type === 'left') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.beginPath();
            ctx.moveTo(55, 430);
            ctx.lineTo(115, 430);
            ctx.lineTo(115, 205);
            ctx.lineTo(165, 205);
            ctx.lineTo(165, 270);
            ctx.lineTo(240, 165);
            ctx.lineTo(165, 60);
            ctx.lineTo(165, 125);
            ctx.lineTo(55, 125);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    private addRoadArrow(
        x: number,
        z: number,
        w: number,
        d: number,
        type: 'straight' | 'left' | 'right',
        parent: THREE.Group
    ) {
        const texture = this.createArrowTexture(type);

        const arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(Math.min(w * 0.32, type === 'straight' ? 1.2 : 1.9), Math.min(d * 0.35, 3.4)),
            new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
            })
        );

        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(x, 0.081, z); // nhấc nhẹ lên để tránh z-fighting
        parent.add(arrow);
        return arrow;
    }

    private addRoadEdgePattern(
        x: number,
        z: number,
        w: number,
        d: number,
        side: 'left' | 'right',
        parent: THREE.Group
    ) {
        const curbWidth = 0.20;     // bề ngang line viền
        const curbHeight = 0.05;
        const segmentLen = 0.8;     // độ dài mỗi đoạn đỏ/trắng
        const gap = 0.0;

        const count = Math.ceil(d / segmentLen);

        for (let i = 0; i < count; i++) {
            const length = Math.min(segmentLen, d - i * segmentLen);
            const color = i % 2 === 0 ? 0xffffff : 0xd83b3b;

            const curb = new THREE.Mesh(
            new THREE.BoxGeometry(curbWidth, curbHeight, length - gap),
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.85
            })
            );

            const offsetX = side === 'left'
            ? x - w / 2 + curbWidth / 2
            : x + w / 2 - curbWidth / 2;

            curb.position.set(
                offsetX,
                0.08 / 2 + curbHeight / 2 + 0.02,
                z - d / 2 + i * segmentLen + length / 2
            );

            curb.castShadow = true;
            curb.receiveShadow = true;
            parent.add(curb);
        }
    }

    private centerLineSegments(length: number, type: CenterLineType, lanes: LaneCount = 2) {
        const material = new THREE.MeshStandardMaterial({
            color: type.startsWith('yellow') ? 0xf6d34c : 0xffffff,
            roughness: .85
        });
        const dashed = type.endsWith('dashed');
        const spans: [number, number][] = [];
        if (lanes === 1) return { material, spans };
        const dashLength = 1.5;
        const gapLength = 1;
        if (dashed) {
            for (let start = 0; start < length; start += dashLength + gapLength) {
                spans.push([start, Math.min(start + dashLength, length)]);
            }
        } else {
            spans.push([0, length]);
        }
        return { material, spans };
    }

    addRoad(
        x: number, // Tọa độ X của tâm đoạn đường trong scene
        z: number, // Tọa độ Z của tâm đoạn đường trong scene
        w: number, // Chiều rộng của đoạn đường
        d: number, // Chiều dài / chiều sâu của đoạn đường
        direction: RoadDirection = 'vertical', // Dọc theo Z hoặc ngang theo X
        arrowType: ArrowType = 'straight', // Loại mũi tên chỉ hướng: thẳng / trái / phải / không có
        centerLine: CenterLineType = 'white-dashed',
        lanes: LaneCount = 2 // w remains the total road width, regardless of lane count.
    ) {
        // Dựng theo trục Z rồi xoay cả đoạn, bao gồm viền và mũi tên.
        const segment = new THREE.Group();
        segment.name = 'road';
        segment.position.set(x, 0, z);
        segment.rotation.y = direction === 'horizontal' ? -Math.PI / 2 : 0;
        this.root.add(segment);
        this.roads.push({ group: segment, x, z, direction, bounds: {
            minX: x - (direction === 'vertical' ? w : d) / 2,
            maxX: x + (direction === 'vertical' ? w : d) / 2,
            minZ: z - (direction === 'vertical' ? d : w) / 2,
            maxZ: z + (direction === 'vertical' ? d : w) / 2
        } });

        // 1. Thân đường
        const road = new THREE.Mesh(
            new THREE.BoxGeometry(w, 0.08, d),
            new THREE.MeshStandardMaterial({
                color: '#2a2a2a',   // xám mặt đường
                roughness: 0.95
            })
        );

        road.position.set(0, 0.02, 0);
        road.name = 'road-surface';
        road.receiveShadow = true;
        segment.add(road);

        // 2. Viền đỏ trắng hai bên
        this.addRoadEdgePattern(0, 0, w, d, 'left', segment);
        this.addRoadEdgePattern(0, 0, w, d, 'right', segment);

        // 3. Vạch giữa chia đường thành hai làn bằng nhau.
        const { material, spans } = this.centerLineSegments(d, centerLine, lanes);
        for (const [from, to] of spans) {
            const line = new THREE.Mesh(new THREE.BoxGeometry(.15, .008, to - from), material);
            line.position.set(0, .067, -d / 2 + (from + to) / 2);
            line.receiveShadow = true;
            segment.add(line);
        }

        // 4. Đặt mũi tên trong từng làn, tránh đè lên vạch giữa.
        if (arrowType !== 'none') {
            for (const laneX of lanes === 1 ? [0] : [-w / 4, w / 4]) {
                const arrow = this.addRoadArrow(laneX, 0, w / lanes, d, arrowType, segment);
                if (centerLine === 'yellow-dashed' && lanes === 2 && laneX < 0) {
                    // Làn phải (local X < 0) đi ngược chiều xe → xoay 180°.
                    arrow.rotateZ(Math.PI);
                }
            }
        }
        return segment;
    }

    connectRoadIntersections() {
        const overlap = (a: RoadRect, b: RoadRect) =>
            Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX) > .00001 &&
            Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ) > .00001;
        const subtract = (rect: RoadRect, cut: RoadRect): RoadRect[] => {
            if (!overlap(rect, cut)) return [rect];
            const x1 = Math.max(rect.minX, cut.minX), x2 = Math.min(rect.maxX, cut.maxX);
            const z1 = Math.max(rect.minZ, cut.minZ), z2 = Math.min(rect.maxZ, cut.maxZ);
            return [
                { ...rect, maxX: x1 }, { ...rect, minX: x2 },
                { minX: x1, maxX: x2, minZ: rect.minZ, maxZ: z1 },
                { minX: x1, maxX: x2, minZ: z2, maxZ: rect.maxZ }
            ].filter(r => r.maxX - r.minX > .00001 && r.maxZ - r.minZ > .00001);
        };
        for (const [index, road] of this.roads.entries()) {
            const intersecting = this.roads.filter(other => other !== road && overlap(road.bounds, other.bounds));
            const localRect = (other: RoadSegment): RoadRect => {
                road.group.updateMatrix();
                const box = new THREE.Box3(
                    new THREE.Vector3(other.bounds.minX, 0, other.bounds.minZ),
                    new THREE.Vector3(other.bounds.maxX, 0, other.bounds.maxZ)
                ).applyMatrix4(road.group.matrix.clone().invert());
                return { minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z };
            };
            for (const child of [...road.group.children]) {
                if (!(child instanceof THREE.Mesh)) continue;
                // Only crossing roads open curbs/markings. Later surfaces are trimmed against
                // all earlier roads as well, eliminating coplanar overlapping asphalt.
                const cuts = intersecting.filter(other => child.name === 'road-surface'
                    ? this.roads.indexOf(other) < index : other.direction !== road.direction).map(localRect);
                if (!cuts.length) continue;
                child.geometry.computeBoundingBox();
                child.updateMatrix();
                const bounds = child.geometry.boundingBox!.clone().applyMatrix4(child.matrix);
                const rect = { minX: bounds.min.x, maxX: bounds.max.x, minZ: bounds.min.z, maxZ: bounds.max.z };
                if (!cuts.some(cut => overlap(rect, cut))) continue;
                if (child.geometry instanceof THREE.PlaneGeometry) {
                    // Omit arrows inside the junction so they do not prescribe a conflicting turn.
                    road.group.remove(child);
                    child.geometry.dispose();
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    for (const material of materials) {
                        if (material instanceof THREE.MeshBasicMaterial) material.map?.dispose();
                        material.dispose();
                    }
                    continue;
                }
                let pieces = [rect];
                for (const cut of cuts) pieces = pieces.flatMap(piece => subtract(piece, cut));
                for (const piece of pieces) {
                    const mesh = new THREE.Mesh(new THREE.BoxGeometry(piece.maxX - piece.minX,
                        bounds.max.y - bounds.min.y, piece.maxZ - piece.minZ), child.material);
                    mesh.name = child.name;
                    mesh.position.set((piece.minX + piece.maxX) / 2, child.position.y, (piece.minZ + piece.maxZ) / 2);
                    mesh.castShadow = child.castShadow;
                    mesh.receiveShadow = child.receiveShadow;
                    road.group.add(mesh);
                }
                road.group.remove(child);
                child.geometry.dispose();
            }
        }
    }

    addRightAngleTurn(
        x: number,
        z: number,
        width = 8,
        direction: RoadDirection = 'vertical',
        turn: 'left' | 'right' = 'right',
        centerLine: CenterLineType = 'white-solid',
        lanes: LaneCount = 2
    ) {
        // Local entry is the south edge (+Z), with the exit on the right (+X).
        const corner = new THREE.Group();
        corner.name = 'right-angle-turn';
        corner.position.set(x, 0, z);
        corner.rotation.y = direction === 'horizontal' ? -Math.PI / 2 : 0;
        corner.scale.x = turn === 'left' ? -1 : 1;
        const road = new THREE.Mesh(new THREE.BoxGeometry(width, .08, width),
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 }));
        road.position.y = .02;
        road.receiveShadow = true;
        corner.add(road);

        // Only the two outside edges have curbs; the entry and exit remain open.
        this.addRoadEdgePattern(0, 0, width, width, 'left', corner);
        const farEdge = new THREE.Group();
        farEdge.rotation.y = -Math.PI / 2;
        corner.add(farEdge);
        this.addRoadEdgePattern(0, 0, width, width - .4, 'left', farEdge);

        const half = width / 2;
        const { material, spans } = this.centerLineSegments(width, centerLine, lanes);
        const line = (w: number, d: number, px: number, pz: number) => {
            const marking = new THREE.Mesh(new THREE.BoxGeometry(w, .008, d), material);
            marking.position.set(px, .067, pz);
            marking.receiveShadow = true;
            corner.add(marking);
        };
        for (const [from, to] of spans) {
            if (from < half) {
                const end = Math.min(to, half);
                line(.15, end - from, 0, half - (from + end) / 2);
            }
            if (to > half) {
                const begin = Math.max(from, half);
                line(to - begin, .15, (begin + to) / 2 - half, 0);
            }
        }
        for (const laneX of lanes === 1 ? [0] : [-width / 4, width / 4]) {
            // The group mirror also turns the right-arrow graphic into a left arrow.
            this.addRoadArrow(laneX, width / 4, width / lanes, width / 2, 'right', corner);
        }
        this.root.add(corner);
        return corner;
    }

    addRoadCurve(x: number, z: number, width: number, radius: number,
        centerLine: CenterLineType = 'white-dashed', lanes: LaneCount = 2) {
        const innerRadius = radius - width / 2;
        const outerRadius = radius + width / 2;
        if (innerRadius <= 0) throw new Error('Road curve radius must exceed half its width');

        // Quarter-circle from the northbound road (-Z) into the eastbound road (+X).
        const start = Math.PI;
        const end = Math.PI * 1.5;
        const sector = (inner: number, outer: number, from: number, to: number,
            height: number, top: number, material: THREE.Material) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, outer, from, to, false);
            shape.lineTo(inner * Math.cos(to), inner * Math.sin(to));
            shape.absarc(0, 0, inner, to, from, true);
            shape.closePath();
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: height, bevelEnabled: false, curveSegments: 64
            });
            geometry.rotateX(Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, top, z);
            mesh.receiveShadow = true;
            this.root.add(mesh);
            return mesh;
        };

        sector(innerRadius, outerRadius, start, end, .08, .06,
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 }));

        // Measure dashes along the arc so their length matches straight-road markings.
        const { material, spans } = this.centerLineSegments(radius * (end - start), centerLine, lanes);
        for (const [from, to] of spans) {
            sector(radius - .075, radius + .075, start + from / radius,
                start + to / radius, .008, .071, material);
        }

        const curbMaterials = [0xffffff, 0xd83b3b].map(color =>
            new THREE.MeshStandardMaterial({ color, roughness: .85 }));
        for (const [inner, outer] of [[innerRadius, innerRadius + .2], [outerRadius - .2, outerRadius]]) {
            const count = Math.ceil((end - start) * (inner + outer) / 2 / .8);
            for (let i = 0; i < count; i++) {
                const from = start + (end - start) * i / count;
                const to = start + (end - start) * (i + 1) / count;
                sector(inner, outer, from, to, .05, .11, curbMaterials[i % 2]).castShadow = true;
            }
        }

        const angle = (start + end) / 2;
        for (const laneRadius of lanes === 1 ? [radius] : [radius - width / 4, radius + width / 4]) {
            const arrowGroup = new THREE.Group();
            arrowGroup.position.set(x + laneRadius * Math.cos(angle), 0, z + laneRadius * Math.sin(angle));
            arrowGroup.rotation.y = -(angle - start);
            this.root.add(arrowGroup);
            this.addRoadArrow(0, 0, width / lanes, laneRadius * (end - start), 'right', arrowGroup);
        }
    }

    addLine(
        x:number,
        z:number,
        w:number,
        d:number,
        color=0xf0cc3e,
        penalty=false
    ){
        const m=new THREE.Mesh(new THREE.BoxGeometry(w,.03,d),
        new THREE.MeshStandardMaterial({color,roughness:.7}));

        m.position.set(x,.075,z);this.root.add(m);
        
        if(penalty) 
            this.penaltyZones.push(new THREE.Box3()
            .setFromCenterAndSize(new THREE.Vector3(x,.5,z),
            new THREE.Vector3(w+.15,1,d+.15)))
    }

    addCone(x:number,z:number){
        const c=new THREE.Mesh(new THREE.ConeGeometry(.18,.5,20),
        new THREE.MeshStandardMaterial({color:0xff7a22}));
        
        c.position.set(x,.25,z);
        c.castShadow=true;this.root.add(c)
    }

    // Vạch kẻ đường dành cho người đi bộ
    addPedestrianCrossing( 
        x: number,
        z: number,
        direction: RoadDirection = 'vertical',
        roadWidth = 8,
        crossingDepth = 3
    ) {
        const crossing = new THREE.Group();
        crossing.name = 'pedestrian-crossing';
        crossing.position.set(x, 0, z);
        crossing.rotation.y = direction === 'horizontal' ? -Math.PI / 2 : 0;

        // Cover center markings within the crossing, leaving both curbs visible.
        const usableWidth = roadWidth - .4;
        const surface = new THREE.Mesh(new THREE.PlaneGeometry(usableWidth, crossingDepth),
            new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: .95 }));
        surface.rotation.x = -Math.PI / 2;
        surface.position.y = .083;
        surface.receiveShadow = true;
        crossing.add(surface);

        const stripeWidth = .45;
        const gap = .4;
        const count = Math.max(1, Math.floor((usableWidth + gap) / (stripeWidth + gap)));
        const totalWidth = count * stripeWidth + (count - 1) * gap;
        const geometry = new THREE.PlaneGeometry(stripeWidth, crossingDepth);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 });
        for (let i = 0; i < count; i++) {
            const stripe = new THREE.Mesh(geometry, material);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(-totalWidth / 2 + stripeWidth / 2 + i * (stripeWidth + gap), .087, 0);
            stripe.receiveShadow = true;
            crossing.add(stripe);
        }
        this.root.add(crossing);
        return crossing;
    }

    addStartLine(
        x = 0,
        z = -2.5,
        direction: RoadDirection = 'vertical',
        roadWidth = 8
    ){
        const canvas=document.createElement('canvas');

        canvas.width=1536;
        canvas.height=512;

        const context=canvas.getContext('2d')!;

        context.fillStyle='#159447';
        context.fillRect(0,0,canvas.width,canvas.height);
        context.fillStyle='#ffffff';
        context.fillRect(0,0,canvas.width,28);
        context.fillRect(0,canvas.height-28,canvas.width,28);
        context.font='bold 190px Arial, sans-serif';
        context.textAlign='center';
        context.textBaseline='middle';
        
        context.fillText('Xuất phát',canvas.width/2,canvas.height/2,canvas.width-120);

        const texture=new THREE.CanvasTexture(canvas);
        texture.colorSpace=THREE.SRGBColorSpace;

        const marking=new THREE.Mesh(new THREE.PlaneGeometry(roadWidth-.2,2.6),
            new THREE.MeshStandardMaterial({map:texture,roughness:.85}));

        // Use the same world-space orientation as addRoad, including the text and borders.
        marking.rotation.x=-Math.PI/2;
        marking.rotateOnWorldAxis(new THREE.Vector3(0,1,0),
            direction==='horizontal' ? -Math.PI/2 : 0);
        marking.position.set(x,.095,z);
        marking.receiveShadow=true;
        marking.name = 'START_LINE';
        this.root.add(marking);
        return marking;
    }

    /**
     * Bài 04 — Qua vệt bánh xe và đường vòng vuông góc.
     *
     * Spec: spec/threejs_exam_yard_specification_v2.md §9
     *
     * Delegates geometry to `WheelTrackCourse` (mirrors pattern of `WindingCourse`).
     * The course geometry is built at local origin (x = 0, z = 0), then translated
     * and rotated into place via a single Matrix4 transform so that entry/exit
     * stay consistent with the visual layout.
     */
    addWheelTrackCourse({ x = 58, z = -20, direction = 'vertical', entryLength = 13.2 }: {
        x?: number;
        z?: number;
        direction?: RoadDirection;
        entryLength?: number;
    } = {}) {
        // Build the course at local origin (entry at (0, 0, 0)).
        const course = new WheelTrackCourse(0, 0, entryLength);

        // Rotate + translate the whole subtree into world placement.
        const transform = new THREE.Matrix4().makeTranslation(x, 0, z)
            .multiply(new THREE.Matrix4().makeRotationY(direction === 'horizontal' ? Math.PI / 2 : 0));

        course.root.applyMatrix4(transform);
        this.root.add(course.root);

        // Merge penalty zones (wheel probes) after transform so they remain valid.
        for (const zone of course.penaltyZones) {
            this.penaltyZones.push(zone.clone().applyMatrix4(transform));
        }

        // Expose world-space entry/exit so callers can place connecting roads.
        const entryWorld = new THREE.Vector3(x, 0, z);
        const exitLocal = new THREE.Vector3(-course.Lv, 0,
            -entryLength + course.Bv / 2 - course.Sv);
        const exitWorld = exitLocal.applyMatrix4(transform);

        // World-space forward axis (unit) — hướng xe chạy khi ra khỏi course
        // sau khi đảo hướng start/end (xe ra về phía start ban đầu).
        //   'horizontal' → (1, 0, 0)  — xe chạy về world +X (hướng start)
        //   'vertical'   → (0, 0, 1)  — xe chạy về world +Z (hướng start)
        const exitForwardAxis = direction === 'horizontal'
            ? new THREE.Vector3(1, 0, 0)
            : new THREE.Vector3(0, 0, 1);

        // Transform all sensors to world space and return for Exam04 use.
        const startYellowSensor = course.startYellowSensorLocal.clone().applyMatrix4(transform);
        const endYellowSensor = course.endYellowSensorLocal.clone().applyMatrix4(transform);
        const wheelTrackZone = course.wheelTrackZoneLocal.clone().applyMatrix4(transform);
        const boundarySensors = course.boundarySensorsLocal.map(b => b.clone().applyMatrix4(transform));

        return {
            entryWorld,
            exitWorld,
            exitForwardAxis,
            startYellowLine: course.startYellowLine,
            endYellowLine: course.endYellowLine,
            startYellowSensor,
            endYellowSensor,
            wheelTrackZone,
            boundarySensors,
        };
    }



    /** Complete exercise branching toward +Z, including registered road connections. */
    addWindingCourse({ x, z, entryLength = 30, exitLength = 6 }: {
        x: number;
        z: number;
        entryLength?: number;
        exitLength?: number;
    }) {
        const winding = new WindingCourse(0, 0);
        const entryArrowZ = z + Math.min(7, entryLength / 2);
        this.addRoad(x, z + entryLength / 2, winding.width, entryLength,
            'vertical', 'none', 'white-solid', 1);
        this.addRoadArrow(x, entryArrowZ, winding.width, 6, 'straight', this.root).rotateZ(Math.PI);
        winding.root.position.set(x, 0, z + entryLength);
        winding.root.rotation.y = Math.PI / 2;
        winding.root.updateMatrix();
        this.root.add(winding.root);
        for (const zone of winding.penaltyZones) {
            this.penaltyZones.push(zone.clone().applyMatrix4(winding.root.matrix));
        }
        const windingExit = winding.exit.clone().applyMatrix4(winding.root.matrix);
        this.addRoad(windingExit.x, windingExit.z + exitLength / 2, winding.width, exitLength,
            'vertical', 'none', 'white-solid', 1);
        this.addRoadArrow(windingExit.x, windingExit.z + exitLength / 2, winding.width, exitLength,
            'straight', this.root).rotateZ(Math.PI);
        this.root.add(new ExerciseSign({
            title: 'QUA ĐƯỜNG\nVÒNG QUANH CO',
            subtitle: 'Đi chậm, giữ bánh xe trong vạch giới hạn',
            x: x + 4, z: entryArrowZ, rotation: Math.PI
        }).root);
    }

    /**
     * ZONE_01_START: start marking (EX01_START_LINE), road text "XUẤT PHẤT",
     * 1A roadside board, optional GO signal, route marker, and a separate set of
     * gameplay sensors (wait/start/signalOff) stored on `zone.userData`.
     *
     * Implements spec/exam/exam_01_start.md §8 (Sensors cần có trong Three.js) and
     * spec/threejs_exam_yard_specification_v2.md §6.2 + §17 (visual vs sensor).
     */
    addStartZone(x: number, z: number, direction: RoadDirection = 'horizontal', roadWidth = 8, opts: {
        withSignal?: boolean;
        signalRotation?: number;
    } = {}) {
        const zone = new THREE.Group();
        zone.name = 'ZONE_01_START';
        this.root.add(zone);

        // ---- Visual geometry (per spec §6.2 object names) ----
        const startLine = this.addStartLine(x, z, direction, roadWidth);
        // addStartLine auto-adds to this.root; rename the most-recent START_LINE marking.
        const lastStart = this.root.children[this.root.children.length - 1];
        if (lastStart && lastStart.name === 'START_LINE') {
            lastStart.name = 'EX01_START_LINE';
        }
        zone.attach(startLine);

        const startText = this.addRoadText('XUẤT PHÁT', x, z, direction, roadWidth);
        startText.name = 'EX01_START_TEXT';
        zone.attach(startText);

        if (opts.withSignal) {
            const rotation = opts.signalRotation ?? startPosition.heading;
            const signal = this.addTrafficLight(x, z, roadWidth, rotation);
            signal.root.name = 'START_SIGNAL';
            this.startSignal = signal;
            zone.attach(signal.root);
        } else {
            this.startSignal = null;
        }

        // ---- Sensor (logic only, separated from visual per spec §17) ----
        const halfWidth = roadWidth / 2;
        // Wait zone: chassis must rest inside this box before countdown begins.
        const waitZone = new THREE.Box3(
            new THREE.Vector3(x - 4, -1, z - halfWidth),
            new THREE.Vector3(x - .15, 3, z + halfWidth)
        );
        // Start line trigger: very thin slab straddling x.
        const startTrigger = new THREE.Box3(
            new THREE.Vector3(x - .15, -1, z - halfWidth),
            new THREE.Vector3(x + .15, 3, z + halfWidth)
        );
        // 5 m gate (HARD_CONSTRAINT từ spec §4.4 LEFT_SIGNAL_OFF_GATE).
        const signalOffX = x + 5;
        const signalOffGate = new THREE.Box3(
            new THREE.Vector3(signalOffX - .4, -1, z - halfWidth),
            new THREE.Vector3(signalOffX + .4, 3, z + halfWidth)
        );

        zone.userData = {
            sensors: {
                waitZone,
                startTrigger,
                signalOffGate,
            },
            metadata: {
                lineX: x,
                lineZ: z,
                direction,
                roadWidth,
                markerId: '1A',
            },
        };
        return zone;
    }

    /**
     * Render the road text (spec §6.2 EX01_*_TEXT). The text is painted into a
     * canvas, sampled as a CanvasTexture, and laid onto a thin plane in the road.
     * `direction` controls whether the text runs along world +X (horizontal) or +Z.
     */
    addRoadText(text: string, x: number, z: number, direction: RoadDirection, roadWidth = 8): THREE.Mesh {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f5f5f5';
        ctx.font = 'bold 168px "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;

        const width = Math.max(2, roadWidth - .4);
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, width / 4),
            new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                roughness: .95,
                depthWrite: false,
            })
        );
        // Plane mặc định nằm trong mặt phẳng XY; xoay xuống mặt đất.
        mesh.rotation.x = -Math.PI / 2;
        // Rotate around world-up so the text reads along the lane direction.
        mesh.rotateOnWorldAxis(
            new THREE.Vector3(0, 1, 0),
            direction === 'horizontal' ? -Math.PI / 2 : 0
        );
        // Sit just above the asphalt to avoid z-fighting (spec §22).
        mesh.position.set(x, .012, z);
        mesh.receiveShadow = true;
        return mesh;
    }

    /**
     * Vạch dừng quy định cho bài 2A (spec/exam/exam_02_pedestrian_stop.md §5.1).
     * Vạch trắng đơn dày hơn vạch giữa, vuông góc trục di chuyển của xe.
     * Đặt tại (x, 0, z) — x là tọa độ X của vạch dừng trên corridor.
     */
    addPedestrianStopLine(z: number, roadWidth = 8, x = 0): THREE.Mesh {
        const marking = new THREE.Mesh(
            new THREE.BoxGeometry(.2, .01, roadWidth),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 })
        );
        marking.position.set(x, .085, z);
        marking.receiveShadow = true;
        marking.name = 'EX02_STOP_LINE';
        this.root.add(marking);
        return marking;
    }

    /**
     * Stop-bar cảnh báo cho bài 2A — vạch trắng phụ, đặt giữa vạch dừng sensor và
     * crosswalk. Học viên dừng TRƯỚC vạch này = không trừ điểm; vượt qua = bị trừ.
     * Không có sensor gameplay; chỉ mang tính thị giác để cảnh báo ranh giới an
     * toàn. Vạch kéo dài toàn bộ chiều rộng đường để nổi bật trên mặt đường.
     */
    addStopBarWarning(x: number, z: number, roadWidth = 8): THREE.Mesh {
        const marking = new THREE.Mesh(
            // Vạch nằm ngang đường (vuông góc hướng xe chạy): 0.5m dày theo trục X,
            // 8m rộng theo trục Z (curb trái → curb phải).
            new THREE.BoxGeometry(.2, .01, roadWidth),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 })
        );
        marking.position.set(x, .085, z);
        marking.receiveShadow = true;
        marking.name = 'EX02_STOP_BAR_WARNING';
        this.root.add(marking);
        return marking;
    }

    addStopSign(opts: StopSignOptions) {
        this.root.add(new StopSign(opts).root);
    }

    addPedestrianSign(opts: PedestrianSignOptions) {
        this.root.add(new PedestrianSign(opts).root);
    }

    async loadStopSignGLB(): Promise<void> {
        return StopSign.preload();
    }

    /**
     * ZONE_02_PEDESTRIAN — bundle cho bài 2A (Dừng xe nhường đường người đi bộ).
     *
     * Tách **visual geometry** (stop line, crosswalk, biển báo, marker) khỏi
     **gameplay sensors** theo spec/threejs_exam_yard_specification_v2.md §17.
     *
     * Crosswalk được tạo trước (ngoài zone) vì nó có thể chia sẻ với cả bài 02
     * và các bài khác (đếm người đi bộ, etc.). Hàm này chỉ `attach` crosswalk đó
     * vào zone và đặt sensor liên quan.
     *
     * Tham khảo:
     * - spec/threejs_exam_yard_specification_v2.md §7.1, §7.2 (EX02_STOP_LINE /
     *   EX02_CROSSWALK / EX02_SIGN_STOP / EX02_SIGN_PEDESTRIAN / EX02_STOP_SENSOR).
     * - spec/exam/exam_02_pedestrian_stop.md §5, §9 (các sensor gameplay).
     */
    addPedestrianZone(opts: {
        stopLineX: number;
        crosswalkX: number;
        roadZ: number;
        roadWidth?: number;
        direction?: RoadDirection;
    }): THREE.Group {
        const roadWidth = opts.roadWidth ?? 8;
        const direction = opts.direction ?? 'horizontal';
        const stopLineX = opts.stopLineX;
        const crosswalkX = opts.crosswalkX;
        const z = opts.roadZ;

        const zone = new THREE.Group();
        zone.name = 'ZONE_02_PEDESTRIAN';
        this.root.add(zone);

        // ---- Visual geometry (spec §7.2 object names) ----
        // Vạch dừng (EX02_STOP_LINE).
        const stopLine = this.addPedestrianStopLine(z, roadWidth, -7.5);
        zone.attach(stopLine);

        // Crosswalk (EX02_CROSSWALK). addPedestrianCrossing auto-add this.root và
        // tạo group riêng; nếu crosswalk chưa tồn tại thì tạo mới đúng vị trí,
        // nếu đã có (như ở X=-5) thì attach object đã tồn tại vào zone.
        let crosswalk = this.root.children.find(
            child => child.name === 'pedestrian-crossing'
        ) as THREE.Group | undefined;
        if (!crosswalk) {
            crosswalk = this.addPedestrianCrossing(crosswalkX, z, direction, roadWidth, 3);
        }
        crosswalk.name = 'EX02_CROSSWALK';
        zone.attach(crosswalk);

        // Biển "Dừng lại" — stop_sign_road_sign.glb (bên phải đường).
        const signStop = new StopSign({ x: stopLineX, z, roadWidth, scale: 0.012 });
        zone.attach(signStop.root);

        // Marker 2A — bảng tên bài thi.
        // const marker2A = this.addRouteMarkerFor(
        //     '2A', z, roadWidth,
        //     'DỪNG XE NHƯỜNG ĐƯỜNG NGƯỜI ĐI BỘ',
        //     4.2
        // );
        // marker2A.position.x = stopLineX;
        // marker2A.position.z = z - roadWidth / 2 - 1.6;
        // // marker2A.rotation.y = Math.PI / 2;   // ← thêm dòng này
        // zone.attach(marker2A);

        // Tham chiếu "0.5 m" — vạch nhỏ đánh dấu ngưỡng A tối đa trên mặt đường
        // (chỉ là visual hint, không ảnh hưởng rule MAX_FRONT_BUMPER_TO_STOP_LINE_M).
        const halfWidth = roadWidth / 2;
        const ref05 = new THREE.Mesh(
            new THREE.BoxGeometry(roadWidth, .008, .05),
            new THREE.MeshStandardMaterial({ color: 0xf6d34c, roughness: .85 })
        );
        ref05.position.set(stopLineX + .5, .07, z);
        ref05.receiveShadow = true;
        ref05.name = 'EX02_REFERENCE_0_5M';
        zone.add(ref05);

        // Chữ "0.5 m" in trên mặt đất bên cạnh vạch tham chiếu (ngoài làn đường).
        const ref05Label = this.makeGroundLabel('0.5 m', stopLineX + .5, z + roadWidth / 2 + .4, roadWidth, .55);
        ref05Label.name = 'EX02_REFERENCE_0_5M_TEXT';
        zone.add(ref05Label);

        // Sprite world-space dùng để hiển thị "A = X.XX m" động phía trước xe.
        // Ban đầu ẩn; DrivingGame sẽ gọi setStopDistanceLabel() mỗi frame.
        const labelSprite = this.makeStopDistanceSprite();
        labelSprite.visible = false;
        labelSprite.name = 'EX02_LIVE_DISTANCE_LABEL';
        zone.add(labelSprite);

        // ---- Sensor (logic only, separated from visual per spec §17) ----
        // Approach zone — vùng tiếp cận trước vạch dừng 15 m.
        const approachStartX = stopLineX - 15;
        const approachZone = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, approachStartX),
            new THREE.Vector3(z + halfWidth, 3, stopLineX)
        );

        // Stop line trigger — dải mỏng để chấm vị trí dừng.
        const stopLineTrigger = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, stopLineX - .15),
            new THREE.Vector3(z + halfWidth, 3, stopLineX + .15)
        );

        // Over-line sensor — phát hiện thanh cản trước đã vượt vạch.
        const overLineTrigger = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, stopLineX + .15),
            new THREE.Vector3(z + halfWidth, 3, stopLineX + 1)
        );

        // Exit sensor — sau vạch dừng 3 m, báo hoàn thành bài 2.
        const exitX = stopLineX + 3;
        const exitSensor = new THREE.Box3(
            new THREE.Vector3(z - halfWidth, -1, exitX - .4),
            new THREE.Vector3(z + halfWidth, 3, exitX + .4)
        );

        // Curb collider — dải rìa làn đường (mỗi bên 0.4 m) từ X spawn đến hết
        // bài 2 dùng cho DQ "Lái xe lên vỉa hè" (spec §7 Lỗi 04).
        const curbThickness = .4;
        const curbHeight = .25;
        const curbStartX = stopLineX - 16;
        const curbEndX = stopLineX + 4;
        const curbZLeft = new THREE.Box3(
            new THREE.Vector3(z - halfWidth - curbThickness, -1, curbStartX),
            new THREE.Vector3(z - halfWidth, curbHeight, curbEndX)
        );
        const curbZRight = new THREE.Box3(
            new THREE.Vector3(z + halfWidth, -1, curbStartX),
            new THREE.Vector3(z + halfWidth + curbThickness, curbHeight, curbEndX)
        );

        zone.userData = {
            sensors: {
                approachZone,
                stopLine: stopLineTrigger,
                overLine: overLineTrigger,
                exitSensor,
                curbCollider: [curbZLeft, curbZRight],
            },
            metadata: {
                stopLineX,
                crosswalkX,
                roadZ: z,
                roadWidth,
                direction,
                markerId: '2A',
            },
            // Truy cập nội bộ cho setStopDistanceLabel().
            handle: {
                updateLabel: (a: number, status: 'VALID' | 'TOO_EARLY' | 'OVER' | 'APPROACHING' | 'HIDDEN', anchorX: number) =>
                    this.updateStopDistanceLabel(labelSprite, a, status, anchorX),
            },
        };
        return zone;
    }

    /** Tạo một Sprite nhãn "A = X.XX m" đặt phía trước xe (hidden mặc định). */
    private makeStopDistanceSprite(): THREE.Sprite {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 192;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(canvas),
            transparent: true,
            depthTest: false,
            depthWrite: false,
        }));
        sprite.scale.set(4, 1.5, 1);
        sprite.renderOrder = 999;
        return sprite;
    }

    /** Cập nhật texture + vị trí của sprite khoảng cách A. */
    private updateStopDistanceLabel(
        sprite: THREE.Sprite,
        a: number,
        status: 'VALID' | 'TOO_EARLY' | 'OVER' | 'APPROACHING' | 'HIDDEN',
        anchorX: number,
    ): void {
        if (status === 'HIDDEN') {
            sprite.visible = false;
            return;
        }
        sprite.visible = true;
        sprite.position.set(anchorX + 6, 1.8, 0);
        const material = sprite.material as THREE.SpriteMaterial;
        const canvas = (material.map as THREE.CanvasTexture).image as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colorMap = {
            VALID: '#36c66a',
            TOO_EARLY: '#f6d34c',
            OVER: '#e15252',
            APPROACHING: '#5b9bdb',
        } as const;
        const statusText = {
            VALID: 'VỊ TRÍ HỢP LỆ',
            TOO_EARLY: 'DỪNG QUÁ XA',
            OVER: 'ĐÃ VƯỢT VẠCH',
            APPROACHING: 'ĐANG TIẾP CẬN',
        } as const;
        ctx.fillStyle = 'rgba(8, 14, 22, .78)';
        roundRect(ctx, 0, 0, canvas.width, canvas.height, 18);
        ctx.fill();
        ctx.strokeStyle = colorMap[status as Exclude<typeof status, 'HIDDEN'>];
        ctx.lineWidth = 6;
        roundRect(ctx, 3, 3, canvas.width - 6, canvas.height - 6, 15);
        ctx.stroke();
        ctx.fillStyle = colorMap[status as Exclude<typeof status, 'HIDDEN'>];
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`A = ${a.toFixed(2)} m`, canvas.width / 2, canvas.height / 2 - 8);
        ctx.font = '28px Arial';
        ctx.fillText(statusText[status as Exclude<typeof status, 'HIDDEN'>], canvas.width / 2, canvas.height / 2 + 50);
        (material.map as THREE.CanvasTexture).needsUpdate = true;
    }

    /**
     * API công khai: DrivingGame gọi mỗi frame để cập nhật nhãn khoảng cách A
     * trong bài 02. Tự tìm zone 2A đã tạo và gọi handle.updateLabel.
     * Trả về true nếu có zone hoạt động.
     */
    setStopDistanceLabel(a: number, status: 'VALID' | 'TOO_EARLY' | 'OVER' | 'APPROACHING' | 'HIDDEN', anchorX: number): boolean {
        const zone = this.root.children.find(
            child => child.name === 'ZONE_02_PEDESTRIAN'
        ) as THREE.Group | undefined;
        if (!zone || !zone.userData?.handle) return false;
        zone.userData.handle.updateLabel(a, status, anchorX);
        return true;
    }

    /** Tạo chữ in trên mặt đất dùng canvas texture (dùng cho nhãn "0.5 m"). */
    makeGroundLabel(text: string, x: number, z: number, roadWidth: number, heightWorld: number): THREE.Mesh {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f6d34c';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const aspect = canvas.width / canvas.height;
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(heightWorld * aspect, heightWorld),
            new THREE.MeshStandardMaterial({
                map: texture, transparent: true, roughness: .95, depthWrite: false,
            })
        );
        mesh.rotation.x = -Math.PI / 2;
        // Vạch 0.5 m đặt bên trái so với hướng xe (xe đi theo +X); chữ chạy ngược
        // để thí sinh đọc được khi tiến đến.
        mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
        mesh.position.set(x, .012, z + roadWidth / 4);
        mesh.receiveShadow = true;
        return mesh;
    }

}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
