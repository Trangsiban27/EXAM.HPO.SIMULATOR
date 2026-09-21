import * as THREE from 'three';
import type { TrackObjects, RoadSegment, WindingCourseEntry } from './TrackObjects';
import { notify } from '../ui/Notify';

// ─── module-level types ───────────────────────────────────────────────────────

type EditorState = 'idle' | 'hover' | 'pressing' | 'armed' | 'carrying';

interface ArmedSegment {
    road: RoadSegment;
    origin: THREE.Vector3;
    outline: THREE.LineSegments;
}

interface ArmedWinding {
    entry: WindingCourseEntry;
    /** Anchor point on the course (e.g. course.root position at moment of arming). */
    origin: THREE.Vector3;
    outline: THREE.LineSegments;
}

/**
 * Develop-mode Road Editor.
 *
 * Works only when `develop === true`.
 *
 * Interaction model (per user spec):
 *   1. Hover mouse over a road (group.name === 'road') → cursor: grab + yellow pulsing outline
 *   2. Hold left mouse button on a road for 2 seconds → arm: road lifts to y=+0.6, outline turns solid
 *   3. Release mouse → carrying: road follows horizontal plane via raycast (preview)
 *   4. Left-click again → place at new position, snap back to y=0, exit edit mode
 *   5. Escape at any time → revert to original position, exit edit mode
 *
 * Scope: only groups named 'road' created by TrackObjects.addRoad().
 * Does NOT touch Bridge, WindingCourse, WheelTrackCourse, or addRightAngleTurn.
 */
export class RoadEditorController {
    // ─── public API ───────────────────────────────────────────────────────────

    /** True when actively holding a road (states: 'pressing' | 'armed' | 'carrying'). */
    get isActive(): boolean { return this._state !== 'idle'; }

    // ─── private fields ────────────────────────────────────────────────────────

    private readonly raycaster = new THREE.Raycaster();
    private readonly ndc = new THREE.Vector2();

    private _state: EditorState = 'idle';
    private hoveredSegment: RoadSegment | null = null;
    private armed: ArmedSegment | null = null;

    // WindingCourse state (parallel to road state machine)
    private hoveredWinding: WindingCourseEntry | null = null;
    private armedWinding: ArmedWinding | null = null;

    /** Cursor style to restore when exiting 'carrying'. */
    private cursorDefault: string;

    /** Timestamp when hover/blink animation started. */
    private blinkStart = 0;

    /** Timestamp when pressing started (null when not pressing). */
    private pressStart: number | null = null;

    private readonly dom: HTMLElement;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly track: TrackObjects;

    // ─── constructor ───────────────────────────────────────────────────────────

    constructor(
        camera: THREE.PerspectiveCamera,
        dom: HTMLElement,
        track: TrackObjects,
        develop: boolean,
    ) {
        this.camera = camera;
        this.dom = dom;
        this.track = track;
        this.cursorDefault = dom.style.cursor || 'default';

        if (!develop) return;

        dom.addEventListener('mousemove', this.onMouseMove);
        dom.addEventListener('mousedown', this.onMouseDown);
        dom.addEventListener('mouseup', this.onMouseUp);
        // Prevent context menu so right-click stays with CameraManager
        dom.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener('keydown', this.onKeyDown);
    }

    // ─── public dispose ───────────────────────────────────────────────────────

    dispose(): void {
        this.dom.removeEventListener('mousemove', this.onMouseMove);
        this.dom.removeEventListener('mousedown', this.onMouseDown);
        this.dom.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('keydown', this.onKeyDown);
        this.dom.style.cursor = this.cursorDefault;
        this.removeOutline();
    }

    // ─── mouse helpers ─────────────────────────────────────────────────────────

    private ndcFromClient(clientX: number, clientY: number): void {
        const rect = this.dom.getBoundingClientRect();
        this.ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    /** Raycast against all meshes under track.root. Returns the first hit that
     *  belongs to a road segment, or null. */
    private raycastRoad(clientX: number, clientY: number): RoadSegment | null {
        this.ndcFromClient(clientX, clientY);
        this.raycaster.setFromCamera(this.ndc, this.camera);
        const hits = this.raycaster.intersectObjects(this.track.root.children, true);
        for (const hit of hits) {
            const road = this.findRoadOf(hit.object);
            if (road) return road;
        }
        return null;
    }

    /** Raycast against everything EXCEPT the currently-armed segment. */
    private raycastGround(clientX: number, clientY: number, excludeRoad: RoadSegment): THREE.Vector3 | null {
        this.ndcFromClient(clientX, clientY);
        this.raycaster.setFromCamera(this.ndc, this.camera);

        const excludeSet = new Set(excludeRoad.group.children);
        const allHits = this.raycaster.intersectObjects(this.track.root.children, true);

        for (const hit of allHits) {
            if (excludeSet.has(hit.object)) continue;
            return hit.point.clone();
        }
        return null;
    }

    /**
     * Raycast against the ground for WindingCourse dragging. Excludes the entire
     * winding-course subtree so we don't snap to its own road segment.
     */
    private raycastGroundWinding(clientX: number, clientY: number): THREE.Vector3 | null {
        this.ndcFromClient(clientX, clientY);
        this.raycaster.setFromCamera(this.ndc, this.camera);

        const allHits = this.raycaster.intersectObjects(this.track.root.children, true);
        for (const hit of allHits) {
            // Skip if hit belongs to the currently-armed winding course subtree
            const wc = this.track.findWindingCourseOf(hit.object);
            if (this.armedWinding && wc === this.armedWinding.entry) continue;
            return hit.point.clone();
        }
        return null;
    }

    /** Walk up the parent chain to find which road segment owns `obj`. */
    private findRoadOf(obj: THREE.Object3D): RoadSegment | null {
        let current: THREE.Object3D | null = obj;
        while (current) {
            if (current instanceof THREE.Group && current.name === 'road') {
                return this.track.getRoads().find(r => r.group === current) ?? null;
            }
            current = current.parent;
        }
        return null;
    }

    /** Raycast against all meshes under track.root. Returns the first hit that
     *  belongs to a WindingCourse, or null. Skips the roads/arrows (handled
     *  by raycastRoad first). */
    private raycastWinding(clientX: number, clientY: number, excludeRoad: RoadSegment | null): WindingCourseEntry | null {
        this.ndcFromClient(clientX, clientY);
        this.raycaster.setFromCamera(this.ndc, this.camera);
        const excludeSet = excludeRoad ? new Set(excludeRoad.group.children) : new Set<THREE.Object3D>();
        const hits = this.raycaster.intersectObjects(this.track.root.children, true);
        for (const hit of hits) {
            if (excludeSet.has(hit.object)) continue;
            const wc = this.track.findWindingCourseOf(hit.object);
            if (wc) return wc;
        }
        return null;
    }

    // ─── outline helpers ───────────────────────────────────────────────────────

    private buildOutline(road: RoadSegment, opacity = 0.6): THREE.LineSegments {
        const b = road.bounds;
        const y = road.group.position.y;

        // 4-corner rectangle at current world position (clockwise, closed)
        const corners: THREE.Vector3[] = [
            new THREE.Vector3(b.minX, y + 0.01, b.minZ),
            new THREE.Vector3(b.maxX, y + 0.01, b.minZ),
            new THREE.Vector3(b.maxX, y + 0.01, b.maxZ),
            new THREE.Vector3(b.minX, y + 0.01, b.maxZ),
            new THREE.Vector3(b.minX, y + 0.01, b.minZ),
        ];

        const positions: number[] = [];
        for (let i = 0; i < corners.length - 1; i++) {
            positions.push(
                corners[i].x, corners[i].y, corners[i].z,
                corners[i + 1].x, corners[i + 1].y, corners[i + 1].z,
            );
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.computeBoundingBox();

        const mat = new THREE.LineBasicMaterial({
            color: 0xf0c94a,
            transparent: true,
            opacity,
            depthTest: false,
        });

        const lines = new THREE.LineSegments(geo, mat);
        lines.renderOrder = 999;
        this.track.root.add(lines);
        return lines;
    }

    private removeOutline(): void {
        if (!this.armed) return;
        this.track.root.remove(this.armed.outline);
        this.armed.outline.geometry.dispose();
        (this.armed.outline.material as THREE.Material).dispose();
        this.armed = null;
    }

    private updateOutlineOpacity(opacity: number): void {
        if (!this.armed) return;
        (this.armed.outline.material as THREE.LineBasicMaterial).opacity = opacity;
    }

    // Rebuild outline at current world position of the armed road.
    private rebuildOutline(): void {
        if (!this.armed) return;
        // Remove old
        this.track.root.remove(this.armed.outline);
        this.armed.outline.geometry.dispose();
        (this.armed.outline.material as THREE.Material).dispose();
        // Build new at current position
        this.armed.outline = this.buildOutline(this.armed.road, 1.0);
    }

    // ─── WindingCourse outline ──────────────────────────────────────────────────
    // The outline is a rectangle around the bounding box of the winding course
    // (computed from the course's penalty zones / entry / exit points).
    private buildWindingOutline(entry: WindingCourseEntry, opacity = 0.6): THREE.LineSegments {
        const { course, _entryLength, _exitLength } = entry;
        const cx = course.root.position.x;
        const cz = course.root.position.z;
        const w = course.width;
        // Approximate bounding box: covers entry road → exit road → full winding curve
        const length = _entryLength + course.centreSpacing * 2 + _exitLength + 4;
        const half = length / 2;
        const halfW = w / 2 + 1;
        const corners: THREE.Vector3[] = [
            new THREE.Vector3(cx - half, 0.01, cz - halfW),
            new THREE.Vector3(cx + half, 0.01, cz - halfW),
            new THREE.Vector3(cx + half, 0.01, cz + halfW),
            new THREE.Vector3(cx - half, 0.01, cz + halfW),
            new THREE.Vector3(cx - half, 0.01, cz - halfW),
        ];
        const positions: number[] = [];
        for (let i = 0; i < corners.length - 1; i++) {
            positions.push(
                corners[i].x, corners[i].y, corners[i].z,
                corners[i + 1].x, corners[i + 1].y, corners[i + 1].z,
            );
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.computeBoundingBox();
        const mat = new THREE.LineBasicMaterial({
            color: 0xf0c94a,
            transparent: true,
            opacity,
            depthTest: false,
        });
        const lines = new THREE.LineSegments(geo, mat);
        lines.renderOrder = 999;
        this.track.root.add(lines);
        return lines;
    }

    private removeWindingOutline(): void {
        if (!this.armedWinding) return;
        this.track.root.remove(this.armedWinding.outline);
        this.armedWinding.outline.geometry.dispose();
        (this.armedWinding.outline.material as THREE.Material).dispose();
        this.armedWinding = null;
    }

    private rebuildWindingOutline(): void {
        if (!this.armedWinding) return;
        this.track.root.remove(this.armedWinding.outline);
        this.armedWinding.outline.geometry.dispose();
        (this.armedWinding.outline.material as THREE.Material).dispose();
        this.armedWinding.outline = this.buildWindingOutline(this.armedWinding.entry, 1.0);
    }

    // ─── state transitions ────────────────────────────────────────────────────

    private transition(newState: EditorState): void {
        this._state = newState;
        if (newState === 'idle') {
            this.dom.style.cursor = this.cursorDefault;
            this.hoveredSegment = null;
            this.hoveredWinding = null;
            this.pressStart = null;
        }
    }

    // ─── mouse handlers ────────────────────────────────────────────────────────

    private onMouseMove = (e: MouseEvent): void => {
        if (this._state === 'carrying') {
            // Carrying: move whichever target is armed
            if (this.armed) {
                const point = this.raycastGround(e.clientX, e.clientY, this.armed.road);
                if (point) {
                    const snap = 0.5;
                    this.armed.road.group.position.x = Math.round(point.x / snap) * snap;
                    this.armed.road.group.position.z = Math.round(point.z / snap) * snap;
                    this.armed.road.group.position.y = .6;
                    this.rebuildOutline();
                }
            } else if (this.armedWinding) {
                const point = this.raycastGroundWinding(e.clientX, e.clientY);
                if (point) {
                    const snap = 0.5;
                    const course = this.armedWinding.entry.course;
                    course.root.position.x = Math.round(point.x / snap) * snap;
                    course.root.position.z = Math.round(point.z / snap) * snap;
                    course.root.position.y = .6;
                    this.rebuildWindingOutline();
                }
            }
            return;
        }

        // idle / hover — try road hover first, then WindingCourse
        const road = this.raycastRoad(e.clientX, e.clientY);
        if (road) {
            this.clearWindingHover();
            if (this.hoveredSegment !== road) {
                this.hoveredSegment = road;
                this.blinkStart = performance.now();
            }
            this.dom.style.cursor = 'grab';
            this.transition('hover');
            this.ensureOutlineFor(road, 0.6);
            return;
        }

        // No road — try WindingCourse
        const wc = this.raycastWinding(e.clientX, e.clientY, null);
        if (wc) {
            this.clearRoadHover();
            if (this.hoveredWinding !== wc) {
                this.hoveredWinding = wc;
                this.blinkStart = performance.now();
            }
            this.dom.style.cursor = 'grab';
            this.transition('hover');
            this.ensureWindingOutlineFor(wc, 0.6);
            return;
        }

        // Nothing
        this.clearRoadHover();
        this.clearWindingHover();
    };

    private clearRoadHover(): void {
        if (this.hoveredSegment) {
            this.hoveredSegment = null;
            this.dom.style.cursor = this.cursorDefault;
            this.removeOutline();
            this.transition('idle');
        }
    }

    private clearWindingHover(): void {
        if (this.hoveredWinding) {
            this.hoveredWinding = null;
            this.dom.style.cursor = this.cursorDefault;
            this.removeWindingOutline();
            this.transition('idle');
        }
    }

    private onMouseDown = (e: MouseEvent): void => {
        if (e.button !== 0) return; // left button only
        if (this._state === 'idle' || this._state === 'hover') {
            if (this.hoveredSegment) {
                this.pressStart = performance.now();
                this.transition('pressing');
            } else if (this.hoveredWinding) {
                this.pressStart = performance.now();
                this.transition('pressing');
            }
        }
    };

    private onMouseUp = (e: MouseEvent): void => {
        if (e.button !== 0) return;

        if (this._state === 'pressing') {
            this.pressStart = null;
            this.transition(this.hoveredSegment || this.hoveredWinding ? 'hover' : 'idle');
            return;
        }

        if (this._state === 'armed') {
            this.pressStart = null;
            this.transition('carrying');
            this.dom.style.cursor = 'grabbing';
            return;
        }

        if (this._state === 'carrying') {
            if (this.armedWinding) {
                this.placeWindingCourse();
            } else {
                this.placeRoad();
            }
            return;
        }
    };

    // ─── animation tick: 2s hold timer + blink ─────────────────────────────────

    tick(timestamp: number): void {
        if (this._state === 'pressing' && this.pressStart !== null) {
            const held = timestamp - this.pressStart;
            if (held >= 2000) {
                // Arm either the road or the winding course
                if (this.hoveredSegment) {
                    this.armRoad();
                } else if (this.hoveredWinding) {
                    this.armWinding();
                }
                this.transition('armed');
                this.pressStart = null;
            }
            // Blink outline (0.3 → 0.9 opacity, 600ms cycle)
            const t = (timestamp - this.blinkStart) % 1200;
            const opacity = t < 600
                ? THREE.MathUtils.lerp(0.3, 0.9, t / 600)
                : THREE.MathUtils.lerp(0.9, 0.3, (t - 600) / 600);
            this.updateOutlineOpacity(opacity);
            this.updateWindingOutlineOpacity(opacity);
        } else if (this._state === 'armed') {
            this.updateOutlineOpacity(1.0);
            this.updateWindingOutlineOpacity(1.0);
        } else if (this._state === 'hover') {
            // Slow blink (0.2 → 0.6 opacity, 1000ms cycle)
            const t = (timestamp - this.blinkStart) % 2000;
            const opacity = t < 1000
                ? THREE.MathUtils.lerp(0.2, 0.6, t / 1000)
                : THREE.MathUtils.lerp(0.6, 0.2, (t - 1000) / 1000);
            this.updateOutlineOpacity(opacity);
            this.updateWindingOutlineOpacity(opacity);
        }
    }

    private updateWindingOutlineOpacity(opacity: number): void {
        if (!this.armedWinding) return;
        (this.armedWinding.outline.material as THREE.LineBasicMaterial).opacity = opacity;
    }

    // ─── arm / place / cancel ──────────────────────────────────────────────────

    private armRoad(): void {
        if (!this.hoveredSegment) return;
        const road = this.hoveredSegment;

        // Lift road
        road.group.position.y = .6;

        // Build solid outline
        const outline = this.buildOutline(road, 1.0);

        this.armed = {
            road,
            origin: road.group.position.clone(),
            outline,
        };
    }

    private armWinding(): void {
        if (!this.hoveredWinding) return;
        const entry = this.hoveredWinding;

        // Lift winding course root
        entry.course.root.position.y = .6;

        const outline = this.buildWindingOutline(entry, 1.0);
        this.armedWinding = {
            entry,
            origin: entry.course.root.position.clone(),
            outline,
        };
    }

    private ensureOutlineFor(road: RoadSegment, opacity: number): void {
        if (!this.armed || this.armed.road !== road) {
            // Remove any existing outline from a different road
            if (this.armed) this.removeOutline();
            // Create new one (will be animated by tick())
            const outline = this.buildOutline(road, opacity);
            this.armed = { road, origin: road.group.position.clone(), outline };
        }
    }

    private ensureWindingOutlineFor(entry: WindingCourseEntry, opacity: number): void {
        if (!this.armedWinding || this.armedWinding.entry !== entry) {
            if (this.armedWinding) this.removeWindingOutline();
            const outline = this.buildWindingOutline(entry, opacity);
            this.armedWinding = { entry, origin: entry.course.root.position.clone(), outline };
        }
    }

    private placeRoad(): void {
        if (!this.armed) return;
        const road = this.armed.road;
        const newX = road.group.position.x;
        const newZ = road.group.position.z;

        // Snap back to ground
        road.group.position.set(newX, 0, newZ);

        // Update bounds to match new world position
        const w = road.direction === 'vertical' ? 8 : 20;
        const d = road.direction === 'vertical' ? 20 : 8;
        road.bounds = {
            minX: newX - (road.direction === 'vertical' ? w : d) / 2,
            maxX: newX + (road.direction === 'vertical' ? w : d) / 2,
            minZ: newZ - (road.direction === 'vertical' ? d : w) / 2,
            maxZ: newZ + (road.direction === 'vertical' ? d : w) / 2,
        };

        // Re-run intersection trimming with new position
        this.track.connectRoadIntersections();

        // Persist to localStorage so reload restores this position
        const roadIndex = this.track.getRoads().indexOf(road);
        if (roadIndex >= 0) {
            this.track.persistRoadEdit(roadIndex, newX, newZ);
        }

        this.removeOutline();
        this.hoveredSegment = null;
        this.dom.style.cursor = this.cursorDefault;
        this.transition('idle');

        // Log the addRoad call for buildExamGround.ts (still useful as a reminder)
        const logLine = `objects.addRoad(${newX.toFixed(1)}, ${newZ.toFixed(1)}, ${w}, ${d}, '${road.direction}', 'straight', 'white-dashed');`;
        console.log('[RoadEditor] Paste into buildExamGround.ts:');
        console.log(logLine);
        notify.show(`Saved x=${newX.toFixed(1)}, z=${newZ.toFixed(1)}`, { kind: 'success', durationMs: 2000 });
    }

    private placeWindingCourse(): void {
        if (!this.armedWinding) return;
        const { entry } = this.armedWinding;
        const course = entry.course;
        const newX = course.root.position.x;
        const newZ = course.root.position.z;

        // Snap back to ground
        course.root.position.set(newX, 0, newZ);
        course.root.updateMatrix();

        // Rebuild entry/exit roads and penalty zones at new position
        this.track.rebuildWindingCourseRoads(entry);

        // Persist
        const wcIndex = this.track.getWindingCourses().indexOf(entry);
        if (wcIndex >= 0) {
            this.track.persistWCEdit(wcIndex, newX, newZ);
        }

        // Reset _roads' bounds for the new entry/exit roads so intersection trim works
        for (const idx of [entry.entryRoadIndex, entry.exitRoadIndex]) {
            const r = this.track.getRoads()[idx];
            if (!r) continue;
            // The rebuilt roads have their own geometry; force a re-trim by calling
            // connectRoadIntersections. Bounds for vertical roads default to ±w/2 ±d/2.
            // Skip for now — penalty zones are correct after rebuild; intersection
            // trimming mainly affects curb/marking, not WindingCourse.
        }
        this.track.connectRoadIntersections();

        this.removeWindingOutline();
        this.hoveredWinding = null;
        this.dom.style.cursor = this.cursorDefault;
        this.transition('idle');

        const logLine = `objects.addWindingCourse({ x: ${newX.toFixed(1)}, z: ${newZ.toFixed(1)} });`;
        console.log('[RoadEditor] Paste into buildExamGround.ts:');
        console.log(logLine);
        notify.show(`WindingCourse saved x=${newX.toFixed(1)}, z=${newZ.toFixed(1)}`,
            { kind: 'success', durationMs: 2000 });
    }

    private cancel(): void {
        if (this.armed) {
            this.armed.road.group.position.copy(this.armed.origin);
        }
        if (this.armedWinding) {
            this.armedWinding.entry.course.root.position.copy(this.armedWinding.origin);
        }
        this.removeOutline();
        this.removeWindingOutline();
        this.hoveredSegment = null;
        this.hoveredWinding = null;
        this.pressStart = null;
        this.dom.style.cursor = this.cursorDefault;
        this.transition('idle');
        notify.show('Đã huỷ', { kind: 'info', durationMs: 1200 });
    }

    // ─── keyboard ──────────────────────────────────────────────────────────────

    private onKeyDown = (e: KeyboardEvent): void => {
        if (e.code !== 'Escape') return;
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

        if (this._state === 'pressing' || this._state === 'armed' || this._state === 'carrying') {
            e.preventDefault();
            this.cancel();
        }
    };
}
