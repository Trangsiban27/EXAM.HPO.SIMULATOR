import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

const loader = new GLTFLoader();
let trafficSignalWarningModel: THREE.Group | undefined;
let intersectionWarningModel: THREE.Group | undefined;
let keepDirectionModel: THREE.Group | undefined;

/** W.209, W.205a and R.301e stacked beside the south road approach. */
export class Exam05TurnJunctionSigns {
    readonly root = new THREE.Group();

    static async preload(): Promise<void> {
        const [trafficSignal, intersection, keepDirection] = await Promise.all([
            loader.loadAsync(new URL('bienbao/w.209_giaonhaucotinhieuden.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/w.205a_duonggiaonhau.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/r.301e_huongdiphaitheo.glb', document.baseURI).href),
        ]);
        trafficSignalWarningModel = trafficSignal.scene;
        intersectionWarningModel = intersection.scene;
        keepDirectionModel = keepDirection.scene;
    }

    constructor(x: number, z: number) {
        if (!trafficSignalWarningModel || !intersectionWarningModel || !keepDirectionModel) {
            throw new Error('Preload the Exam 05 turn-junction signs before building the exam ground.');
        }

        this.root.name = 'EX05_TURN_JUNCTION_SIGNS';
        this.root.position.set(x, 0, z);
        // The GLBs face local +Z; this group faces approaching traffic toward -Z.
        this.root.rotation.y = Math.PI;

        const warningTopY = 3.4;
        const post = createStripedSignPost(warningTopY + .08, .043);
        post.name = 'road-sign-post';
        this.root.add(post);

        const addFace = (source: THREE.Group, name: string, topY: number, widthM: number) => {
            const face = source.clone(true);
            face.name = name;
            face.updateMatrixWorld(true);
            const bounds = new THREE.Box3().setFromObject(face);
            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            const scale = widthM / size.x;
            face.scale.setScalar(scale);
            face.position.set(-center.x * scale, topY - bounds.max.y * scale, .075 - center.z * scale);
            face.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.root.add(face);
            return topY - size.y * scale;
        };

        const signGapM = .05;
        const trafficSignalBottomY = addFace(
            trafficSignalWarningModel, 'W209_TRAFFIC_SIGNAL_AHEAD', warningTopY, .82,
        );
        const intersectionBottomY = addFace(
            intersectionWarningModel, 'W205A_INTERSECTION_AHEAD', trafficSignalBottomY - signGapM, .82,
        );
        addFace(keepDirectionModel, 'R301E_MANDATORY_DIRECTION', intersectionBottomY - signGapM, .72);
    }
}
