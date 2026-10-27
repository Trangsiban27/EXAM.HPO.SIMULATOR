import assert from 'node:assert/strict';
import { build } from 'esbuild';

const output = await build({ stdin: { contents: `export * as THREE from 'three';
export { buildSidewalks } from './src/game/buildSidewalks';
export { TrackObjects } from './src/game/TrackObjects';
export { ROAD_SURFACE_COLOR } from './src/game/roadStyle';
export * from './src/game/curbStyle';`, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'cjs' });
const module = { exports: {} };
new Function('module', 'exports', output.outputFiles[0].text)(module, module.exports);
const { THREE, buildSidewalks, TrackObjects, ROAD_SURFACE_COLOR, CURB_VISUAL_HEIGHT_M,
    SIDEWALK_CURB_HEIGHT_M, SIDEWALK_CURB_WIDTH_M, SIDEWALK_PAINT_GAP_M } = module.exports;
const failures = [];
const check = (label, action) => {
    try { action(); } catch (error) { failures.push(`${label}: ${error.message}`); }
};
const close = (actual, expected, tolerance = 1e-5) => assert.ok(Math.abs(actual - expected) < tolerance,
    `expected ${actual} to equal ${expected} ± ${tolerance}`);
const asphaltMaterial = new THREE.MeshStandardMaterial({ color: ROAD_SURFACE_COLOR });
const red = new THREE.MeshStandardMaterial({ color: 0xd83b3b });
const white = new THREE.MeshStandardMaterial({ color: 0xffffff });

function straight(parent, length = 8, tagged = false) {
    const road = new THREE.Mesh(new THREE.BoxGeometry(8, .08, length), asphaltMaterial);
    road.position.y = .02; parent.add(road);
    const sources = [];
    for (const side of [-1, 1]) for (let i = 0; i < length / .8; i++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(.1, CURB_VISUAL_HEIGHT_M, .8), i % 2 ? red : white);
        mesh.position.set(side * 3.95, .06 + CURB_VISUAL_HEIGHT_M / 2, -length / 2 + (i + .5) * .8);
        if (tagged) { mesh.name = `legacy-curb-${side}-${i}`; mesh.userData.roadEdgeStrip = true; }
        else mesh.name = 'red-white-curb';
        parent.add(mesh); sources.push(mesh);
    }
    return { road, sources };
}

function vertices(mesh) {
    const positions = mesh.geometry.getAttribute('position');
    return Array.from({ length: positions.count }, (_, i) => new THREE.Vector3().fromBufferAttribute(positions, i));
}

function inspect(root, sources, label) {
    const result = buildSidewalks(root);
    const paint = result.children.filter(mesh => mesh.name.startsWith('white-road-edge-line'));
    const curbs = result.children.filter(mesh => mesh.userData.sidewalkCurb === true);
    check(`${label} converted every visible legacy border`, () => {
        assert.equal(result.userData.edgeStripCount, sources.length);
        assert.ok(sources.every(mesh => !mesh.visible && mesh.userData.replacedRoadEdge));
        assert.ok(paint.length && curbs.length);
    });
    check(`${label} white paint is excluded from disqualification geometry`, () => {
        assert.ok(paint.every(mesh => !mesh.userData.sidewalkCurb && !mesh.name.endsWith('red-white-curb')));
        assert.ok(paint.every(mesh => mesh.material.color.getHex() === 0xffffff));
    });
    check(`${label} bounded draw calls and shared materials`, () => {
        assert.ok(result.children.length <= 12, `too many batches: ${result.children.length}`);
        assert.equal(new Set(paint.map(mesh => mesh.material)).size, 1);
        assert.equal(new Set(curbs.map(mesh => mesh.material)).size, 1);
        assert.ok(result.children.every(mesh => !mesh.castShadow && !mesh.receiveShadow));
    });
    check(`${label} upward top-face normals`, () => {
        let tops = 0;
        for (const mesh of curbs) {
            const ps = vertices(mesh), normal = mesh.geometry.getAttribute('normal');
            for (let i = 0; i < ps.length; i += 3) {
                const a = ps[i], b = ps[i + 1], c = ps[i + 2];
                const geometric = b.clone().sub(a).cross(c.clone().sub(a));
                if (Math.abs(geometric.y) < 1e-8 || Math.abs(geometric.y) / geometric.length() < .95) continue;
                // Roof and base share a near-horizontal plane; roof is above the source's reference road.
                if ((a.y + b.y + c.y) / 3 < .06 + SIDEWALK_CURB_HEIGHT_M - .01 && label !== 'slope') continue;
                if (label === 'slope') {
                    const y = (a.y + b.y + c.y) / 3, z = (a.z + b.z + c.z) / 3;
                    if (y - (.06 / Math.cos(-.12) - z * Math.tan(-.12)) < SIDEWALK_CURB_HEIGHT_M - .01) continue;
                }
                tops++;
                assert.ok(geometric.y > 0 && normal.getY(i) > .9, `raised top triangle faces downward at ${a.toArray()}`);
            }
        }
        assert.ok(tops > 0, 'no curb top faces inspected');
    });
    return { result, paint, curbs };
}

for (const tagged of [false, true]) {
    const root = new THREE.Group();
    const { sources } = straight(root, 8, tagged);
    const { paint, curbs } = inspect(root, sources, tagged ? 'tagged' : 'straight');
    check(`straight ${tagged} exact height, width and grass-side placement`, () => {
        const all = curbs.flatMap(vertices);
        const distances = all.map(p => Math.abs(p.x));
        close(Math.min(...all.map(p => p.y)), .06);
        close(Math.max(...all.map(p => p.y)), .06 + SIDEWALK_CURB_HEIGHT_M);
        close(Math.min(...distances), 4 + SIDEWALK_PAINT_GAP_M);
        close(Math.max(...distances), 4 + SIDEWALK_PAINT_GAP_M + SIDEWALK_CURB_WIDTH_M);
        assert.ok(all.every(p => Math.abs(p.x) > 4), 'new curb intrudes into driveable asphalt');
        for (const mesh of paint) for (const p of vertices(mesh)) close(p.y, .065);
    });
}

{
    const root = new THREE.Group();
    const road = new THREE.Mesh(new THREE.BoxGeometry(8, .08, 8), asphaltMaterial);
    road.position.y = .02; root.add(road);
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(.1, .8), red);
    strip.rotation.x = Math.PI / 2;
    strip.position.set(3.95, .11, 0);
    strip.userData.roadEdgeStrip = true;
    root.add(strip);
    const { paint, curbs } = inspect(root, [strip], 'reverse-wound top-only strip');
    check('reverse-wound source emits upward white paint at road level', () => {
        for (const mesh of paint) {
            for (const p of vertices(mesh)) close(p.y, .065);
            const normals = mesh.geometry.getAttribute('normal');
            for (let i = 0; i < normals.count; i++) assert.ok(normals.getY(i) > .99);
        }
        const ps = curbs.flatMap(vertices);
        close(Math.max(...ps.map(p => p.y)), .06 + SIDEWALK_CURB_HEIGHT_M);
        assert.ok(ps.every(p => p.x >= 4 + SIDEWALK_PAINT_GAP_M - 1e-5));
    });
}

{
    const root = new THREE.Group(), transformed = new THREE.Group();
    transformed.position.set(18, 0, -21); transformed.rotation.y = .63; root.add(transformed);
    const { sources } = straight(transformed);
    const { curbs } = inspect(root, sources, 'rotated');
    check('rotated local road width is retained', () => {
        const inverse = transformed.matrixWorld.clone().invert();
        for (const mesh of curbs) for (const p of vertices(mesh)) {
            p.applyMatrix4(inverse);
            assert.ok(Math.abs(p.x) >= 4 + SIDEWALK_PAINT_GAP_M - 1e-5);
            assert.ok(Math.abs(p.x) <= 4 + SIDEWALK_PAINT_GAP_M + SIDEWALK_CURB_WIDTH_M + 1e-5);
        }
    });
}

function arcMesh(inner, outer, start, end, height, material) {
    const points = [];
    for (let i = 0; i <= 12; i++) {
        const angle = start + (end - start) * i / 12;
        points.push(new THREE.Vector2(outer * Math.cos(angle), -outer * Math.sin(angle)));
    }
    for (let i = 12; i >= 0; i--) {
        const angle = start + (end - start) * i / 12;
        points.push(new THREE.Vector2(inner * Math.cos(angle), -inner * Math.sin(angle)));
    }
    const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(points), { depth: height, bevelEnabled: false });
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, material); mesh.position.y = .06; return mesh;
}

{
    const root = new THREE.Group();
    const road = arcMesh(3, 7, 0, Math.PI / 2, .001, asphaltMaterial); root.add(road);
    const sources = [];
    for (const [inner, outer] of [[3, 3.1], [6.9, 7]]) for (let i = 0; i < 6; i++) {
        const mesh = arcMesh(inner, outer, i * Math.PI / 12, (i + 1) * Math.PI / 12, CURB_VISUAL_HEIGHT_M, i % 2 ? red : white);
        mesh.name = 'red-white-curb'; root.add(mesh); sources.push(mesh);
    }
    const { curbs } = inspect(root, sources, 'curved');
    check('curved inner and outer curbs follow grass side of annular road', () => {
        const radii = curbs.flatMap(vertices).map(p => Math.hypot(p.x, p.z));
        assert.ok(radii.every(r => r < 3 - SIDEWALK_PAINT_GAP_M + .005 || r > 7 + SIDEWALK_PAINT_GAP_M - .005));
        close(Math.min(...radii), 3 - SIDEWALK_PAINT_GAP_M - SIDEWALK_CURB_WIDTH_M, .01);
        close(Math.max(...radii), 7 + SIDEWALK_PAINT_GAP_M + SIDEWALK_CURB_WIDTH_M, .01);
    });
}

{
    const root = new THREE.Group(), ramp = new THREE.Group();
    ramp.rotation.x = -.12; root.add(ramp);
    const { sources } = straight(ramp);
    const { curbs } = inspect(root, sources, 'slope');
    check('sloping curb tracks bridge road elevation', () => {
        const heights = curbs.flatMap(vertices).map(p => p.y - (.06 / Math.cos(-.12) - p.z * Math.tan(-.12)));
        close(Math.min(...heights), 0, .003);
        close(Math.max(...heights), SIDEWALK_CURB_HEIGHT_M, .003);
    });
}

{
    const root = new THREE.Group();
    const road = new THREE.Mesh(new THREE.BoxGeometry(8, .08, 4), asphaltMaterial);
    road.position.y = .02; root.add(road);
    const sources = [-1, 1].map(side => {
        const edge = new THREE.Mesh(new THREE.BoxGeometry(.1, CURB_VISUAL_HEIGHT_M, 3.2), white);
        edge.position.set(side * 3.95, .06 + CURB_VISUAL_HEIGHT_M / 2, 0);
        edge.name = 'red-white-curb'; root.add(edge); return edge;
    });
    const { curbs } = inspect(root, sources, 'long');
    check('long single-colour source strips become alternating sidewalk blocks', () => {
        let redCount = 0, whiteCount = 0;
        for (const mesh of curbs) {
            const colors = mesh.geometry.getAttribute('color');
            for (let i = 0; i < colors.count; i++) {
                if (colors.getX(i) > colors.getY(i) * 1.5) redCount++;
                else whiteCount++;
            }
        }
        assert.ok(redCount > 0 && whiteCount > 0);
    });
}

{
    const track = new TrackObjects();
    const roadEdge = 105.4, upperWidth = 2.2 * 2.241 + .4, lowerWidth = 4.58 + .4;
    const zMin = -19 + lowerWidth / 2, zMax = -11.5 - upperWidth / 2;
    const mainRoad = new THREE.Mesh(new THREE.BoxGeometry(7.4, .08, 20), asphaltMaterial);
    mainRoad.position.set(109.1, .02, -15.25); track.root.add(mainRoad);
    for (const [z, width] of [[-11.5, upperWidth], [-19, lowerWidth]]) {
        const road = new THREE.Mesh(new THREE.BoxGeometry(20, .08, width), asphaltMaterial);
        road.position.set(95.4, .02, z); track.root.add(road);
    }
    const upperRoot = new THREE.Group(), lowerRoot = new THREE.Group();
    track.root.add(upperRoot, lowerRoot);
    const tangentX = roadEdge - .75;
    for (const [parent, z, side] of [[upperRoot, zMax, -1], [lowerRoot, zMin, 1]]) {
        const tail = new THREE.Mesh(new THREE.BoxGeometry(1, CURB_VISUAL_HEIGHT_M, .1), white);
        tail.name = 'red-white-curb';
        tail.position.set(tangentX - .54, .085, z + side * .05);
        parent.add(tail);
    }
    track.addWheelTrackEntryIslandCaps([
        { entryWorld: new THREE.Vector3(roadEdge, 0, -11.5), roadWidthM: upperWidth, courseRoot: upperRoot },
        { entryWorld: new THREE.Vector3(roadEdge, 0, -19), roadWidthM: lowerWidth, courseRoot: lowerRoot },
    ], roadEdge, [.75]);
    const caps = track.root.getObjectByName('wheel-track-entry-island-caps');
    const sources = [];
    track.root.traverse(mesh => { if (mesh.name === 'red-white-curb') sources.push(mesh); });
    assert.equal(caps.children.filter(mesh => mesh.geometry?.type === 'BoxGeometry'
        && mesh.userData.roadEdgeGrassPath).length, 2, 'short straight-to-arc connectors retain their true direction');
    assert.ok(sources.length > 2);
    const { curbs } = inspect(track.root, sources, 'C1/D island');
    check('tight C1/D head stays inside the island without projecting into either entrance', () => {
        for (const mesh of curbs) for (const p of vertices(mesh)) {
            assert.ok(p.x <= roadEdge + 1e-5, 'curb projects into the main approach road');
            assert.ok(p.z >= zMin + .10 - 1e-5 && p.z <= zMax - .10 + 1e-5,
                'curb projects sideways into a C1/D entrance');
        }
    });
}

{
    const track = new TrackObjects();
    const road = track.addRoad(0, 0, 8, 4.1, 'vertical', 'none', 'white-dashed', 2);
    const sources = road.children.filter(mesh => mesh.name === 'red-white-curb');
    check('10 cm square end blocks retain the road construction direction', () => {
        const squares = sources.filter(mesh => mesh.geometry.parameters.depth < .101);
        assert.equal(squares.length, 2);
        assert.ok(squares.every(mesh => Math.abs(mesh.userData.roadEdgeGrassSide) === 1));
    });
    const { curbs } = inspect(track.root, sources, 'square end');
    check('short end blocks stay flush with the adjacent raised curb', () => {
        for (const mesh of curbs) for (const p of vertices(mesh)) {
            assert.ok(Math.abs(p.x) >= 4 + SIDEWALK_PAINT_GAP_M - 1e-5);
            assert.ok(Math.abs(p.x) <= 4 + SIDEWALK_PAINT_GAP_M + SIDEWALK_CURB_WIDTH_M + 1e-5);
            assert.ok(Math.abs(p.z) <= 2.05 + 1e-5, 'end block rotates sideways beyond road end');
        }
    });
}

{
    const root = new THREE.Group();
    const road = new THREE.Mesh(new THREE.BoxGeometry(20, .08, 20), asphaltMaterial);
    road.position.y = .02; root.add(road);
    const sources = [-1, 1].map(side => {
        const edge = new THREE.Mesh(new THREE.BoxGeometry(.8, CURB_VISUAL_HEIGHT_M, .1), white);
        edge.name = 'red-white-curb'; edge.position.set(0, .085, side);
        const grassSide = -side;
        edge.userData.roadEdgeGrassPath = [
            [grassSide * .4, .025, grassSide * .05],
            [-grassSide * .4, .025, grassSide * .05],
        ];
        root.add(edge); return edge;
    });
    const { curbs } = inspect(root, sources, 'hatched island');
    check('hatched island borders face inward even when surrounded by asphalt', () => {
        for (const mesh of curbs) for (const p of vertices(mesh)) {
            assert.ok(Math.abs(p.z) <= .95 - SIDEWALK_PAINT_GAP_M + 1e-5);
            assert.ok(Math.abs(p.z) >= .95 - SIDEWALK_PAINT_GAP_M - SIDEWALK_CURB_WIDTH_M - 1e-5);
        }
    });
}

{
    const track = new TrackObjects();
    const road = new THREE.Mesh(new THREE.BoxGeometry(8, .08, 8), asphaltMaterial);
    road.position.y = .02; track.root.add(road);
    const old = [[.7, -.65], [.25, -.175], [.8, .6]].map(([length, z]) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(.1, CURB_VISUAL_HEIGHT_M, length), white);
        mesh.name = 'red-white-curb'; mesh.position.set(z < 0 ? 3.93 : 3.95, .085, z);
        track.root.add(mesh); return mesh;
    });
    const stub = new THREE.Mesh(new THREE.BoxGeometry(.03, CURB_VISUAL_HEIGHT_M, .1), white);
    stub.name = 'red-white-curb'; stub.position.set(4.015, .085, .15); track.root.add(stub); old.push(stub);
    track.straightRoadEdgeReplacements.push({ name: 'S-B continuous edge', x: 4, fromZ: -1, toZ: 1, grassSide: 1 });
    track.rebuildStraightRoadEdges();
    assert.ok(old.every(mesh => mesh.parent === null), 'remove old misaligned strips and perpendicular stub');
    const sources = track.root.getObjectByName('S-B continuous edge').children;
    assert.equal(sources.length, 3);
    const { curbs, paint } = inspect(track.root, sources, 'rebuilt S-B tangent');
    check('S-B tangent has a constant width without a patch or side protrusion', () => {
        for (const mesh of curbs) for (const p of vertices(mesh)) {
            assert.ok(p.x >= 4 + SIDEWALK_PAINT_GAP_M - 1e-5);
            assert.ok(p.x <= 4 + SIDEWALK_PAINT_GAP_M + SIDEWALK_CURB_WIDTH_M + 1e-5);
        }
        for (const mesh of paint) for (const p of vertices(mesh)) {
            assert.ok(p.x >= 3.9 - 1e-5 && p.x <= 4 + 1e-5);
        }
        track.root.updateMatrixWorld(true);
        for (const z of [-.95, -.65, -.35, -.05, .15, .3, .55, .95]) {
            const ray = new THREE.Raycaster(new THREE.Vector3(4.15, 1, z), new THREE.Vector3(0, -1, 0));
            assert.ok(ray.intersectObjects(curbs).length, `hole in rebuilt tangent at z=${z}`);
        }
    });
}

for (const side of ['west', 'east']) {
    const track = new TrackObjects(), radius = .45;
    const road = new THREE.Mesh(new THREE.BoxGeometry(20, .08, 20), asphaltMaterial);
    road.position.y = .02; track.root.add(road);
    const corner = track.addAngledRoadJunctionCorner(new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(.8, 0, 5), radius, side);
    const group = track.root.getObjectByName(`road-junction-angled-${side}-r${radius}-corner`);
    const sources = group.children.filter(mesh => mesh.name === 'red-white-curb');
    assert.ok(sources.every(mesh => mesh.userData.roadEdgeGrassPath?.length >= 9));
    const { curbs } = inspect(track.root, sources, `small ${side} E corner`);
    check(`small ${side} E corner stays inside its arc without folding back`, () => {
        for (const mesh of curbs) for (const p of vertices(mesh)) {
            const distance = Math.hypot(p.x - corner.horizontalTangent.x, p.z - radius);
            assert.ok(distance >= radius - SIDEWALK_PAINT_GAP_M - SIDEWALK_CURB_WIDTH_M - .01,
                'curb crosses the centre of its corner');
            assert.ok(distance <= radius - SIDEWALK_PAINT_GAP_M + .01,
                'curb protrudes outside the grass-facing arc');
        }
    });
}

{
    const track = new TrackObjects(), dx = .6, dz = 6, length = Math.hypot(dx, dz);
    const tx = dx / length, tz = dz / length;
    const road = new THREE.Mesh(new THREE.BoxGeometry(16, .08, 16), asphaltMaterial);
    road.position.y = .02; track.root.add(road);
    const shape = new THREE.Shape([
        new THREE.Vector2(4, 3), new THREE.Vector2(4.6, -3),
        new THREE.Vector2(4.6 - tz * .1, -(3 + tx * .1)),
        new THREE.Vector2(4 - tz * .1, -(-3 + tx * .1)),
    ]);
    const oldGeometry = new THREE.ExtrudeGeometry(shape, { depth: CURB_VISUAL_HEIGHT_M, bevelEnabled: false });
    oldGeometry.rotateX(-Math.PI / 2);
    const old = new THREE.Mesh(oldGeometry, red); old.name = 'red-white-curb'; old.position.y = .06;
    track.root.add(old);
    track.straightRoadEdgeReplacements.push({ name: 'E sloped edge', x: 4, fromZ: -3, toX: 4.6, toZ: 3, grassSide: 1 });
    track.rebuildStraightRoadEdges();
    assert.equal(old.parent, null, 'remove old extruded connector strips as well as boxes');
    const sources = track.root.getObjectByName('E sloped edge').children;
    const { curbs } = inspect(track.root, sources, 'rebuilt E sloped edge');
    check('rebuilt E edge follows one inclined line with constant curb width', () => {
        for (const mesh of curbs) for (const p of vertices(mesh)) {
            const across = (p.x - 4) * tz - (p.z + 3) * tx;
            assert.ok(across >= SIDEWALK_PAINT_GAP_M - 1e-5);
            assert.ok(across <= SIDEWALK_PAINT_GAP_M + SIDEWALK_CURB_WIDTH_M + 1e-5);
        }
    });
}

check('R8/R9 straight seam retains the part of a stripe outside the joining road', () => {
    const track = new TrackObjects();
    track.addRoad(-2, .3, 1, 10, 'horizontal', 'none', 'white-dashed', 2);
    track.addRoadCornerCurveR8R9({ x: 0, z: 0, segmentLengthsM: [10, 10],
        bends: [{ sweepDeg: 90, innerEdgeRadiusM: 2, dashedLineRadiusM: 3,
            centerLineRadiusM: 4, outerEdgeRadiusM: 5 }] });
    track.root.updateMatrixWorld(true);
    track.connectRoadIntersections();
    track.root.updateMatrixWorld(true);
    const point = new THREE.Vector3(-.05, .085, -.3);
    let covered = false;
    track.root.traverse(mesh => {
        if (mesh instanceof THREE.Mesh && mesh.name === 'red-white-curb'
            && new THREE.Box3().setFromObject(mesh).containsPoint(point)) covered = true;
    });
    assert.ok(covered, 'the surviving seam must not lose a whole 0.8 m stripe');
});

check('flat white paint remains above the higher asphalt at a road seam', () => {
    const root = new THREE.Group();
    straight(root, .8);
    const higherRoad = new THREE.Mesh(new THREE.BoxGeometry(8, .08, .4), asphaltMaterial);
    higherRoad.position.set(0, .04, .2);
    root.add(higherRoad);
    root.updateMatrixWorld(true);
    const result = buildSidewalks(root);
    for (const mesh of result.children.filter(mesh => mesh.name.startsWith('white-road-edge-line'))) {
        for (const p of vertices(mesh)) assert.ok(p.y >= .085 - 1e-6,
            'paint must stay above the higher road instead of sloping into it');
    }
});

check('restoring the B entrance removes all earlier R8/R9 cut fragments', () => {
    const track = new TrackObjects();
    track.addRoad(6, -8, 2, 6, 'vertical', 'none', 'white-dashed', 2);
    const curve = track.addRoadCornerCurveR8R9({ x: 0, z: 0, segmentLengthsM: [10, 10],
        bends: [{ sweepDeg: 90, innerEdgeRadiusM: 2, dashedLineRadiusM: 3,
            centerLineRadiusM: 4, outerEdgeRadiusM: 5 }] });
    curve.setInnerCurbOpenings([[4, 8]]);
    track.root.updateMatrixWorld(true);
    track.connectRoadIntersections();
    track.root.updateMatrixWorld(true);
    for (let x = 4.1; x < 7.9; x += .1) {
        const point = new THREE.Vector3(x, .085, -10.05);
        track.root.traverse(mesh => {
            if (mesh instanceof THREE.Mesh && mesh.name === 'red-white-curb'
                && mesh.parent !== track.roads[0].group)
                assert.ok(!new THREE.Box3().setFromObject(mesh).containsPoint(point),
                    `entrance blocked by a leftover fragment at x=${x}`);
        });
    }
});

for (const type of ['B', 'C']) check(`perpendicular ${type} mouth has shared miter endpoints`, () => {
    const track = new TrackObjects();
    const bay = track[`addPerpendicularParkingBay${type}`]({ x: 0, z: 0, showDebug: false });
    track.root.updateMatrixWorld(true);
    for (const side of ['Left', 'Right']) {
        const endpoints = name => {
            const result = [];
            bay.root.getObjectByName(name).traverse(mesh => {
                if (!(mesh instanceof THREE.Mesh)) return;
                for (const p of mesh.userData.roadEdgeGrassPath ?? [])
                    result.push(new THREE.Vector3(...p).applyMatrix4(mesh.matrixWorld));
            });
            return result;
        };
        const horizontal = endpoints(`MainRoadInner${side}Curb`);
        const vertical = endpoints(`Parking${side}Curb`);
        assert.ok(horizontal.some(a => vertical.some(b => a.distanceTo(b) < 1e-6)),
            `${side} mouth edges must meet at exactly one point`);
    }
});

check('mirrored explicit grass paths remain outside the road', () => {
    const root = new THREE.Group(), mirrored = new THREE.Group();
    mirrored.scale.x = -1; root.add(mirrored);
    const { sources } = straight(mirrored);
    for (const source of sources) source.userData.roadEdgeGrassSide = Math.sign(source.position.x);
    root.updateMatrixWorld(true);
    const result = buildSidewalks(root);
    for (const mesh of result.children.filter(mesh => mesh.userData.sidewalkCurb)) {
        for (const p of vertices(mesh)) assert.ok(Math.abs(p.x) >= 4 + SIDEWALK_PAINT_GAP_M - 1e-5,
            'mirroring must not move the raised curb onto the asphalt');
    }
});

assert.equal(failures.length, 0, `Sidewalk geometry failures:\n${failures.join('\n')}`);
console.log('PASS: straight/tagged/reverse-wound/curved/rotated/sloping edge conversion, grass-side width, 20 cm height, upward normals, paint/curb metadata and bounded shared-material batches');
