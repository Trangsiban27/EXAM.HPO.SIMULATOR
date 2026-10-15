import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

const loader = new GLTFLoader();
let trafficSignalWarningModel: THREE.Group | undefined;
let intersectionWarningModel: THREE.Group | undefined;
let straightAheadModel: THREE.Group | undefined;
let keepRightModel: THREE.Group | undefined;

/** W.209, W.205a and a mandatory-direction sign stacked at the Exam 05 junction approach. */
export class Exam05JunctionSigns {
    readonly root = new THREE.Group();

    static cloneKeepRightModel(): THREE.Group {
        if (!keepRightModel) throw new Error('Preload the R.301d sign before building the exam ground.');
        return keepRightModel.clone(true);
    }

    static async preload(): Promise<void> {
        const [trafficSignal, intersection, straightAhead, keepRight] = await Promise.all([
            loader.loadAsync(new URL('bienbao/w.209_giaonhaucotinhieuden.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/w.205a_duonggiaonhau.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/r.301a_huongdiphaitheo.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/r.301d_huongdiphaitheo.glb', document.baseURI).href),
        ]);
        trafficSignalWarningModel = trafficSignal.scene;
        intersectionWarningModel = intersection.scene;
        straightAheadModel = straightAhead.scene;
        keepRightModel = keepRight.scene;
    }

    constructor(x: number, z: number, rotationY = 0, direction: 'straight' | 'right' = 'straight') {
        if (!trafficSignalWarningModel || !intersectionWarningModel || !straightAheadModel || !keepRightModel) {
            throw new Error('Preload the Exam 05 junction signs before building the exam ground.');
        }

        this.root.name = 'EX05_JUNCTION_SIGNS';
        this.root.position.set(x, 0, z);
        this.root.rotation.y = rotationY;

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

        // The GLBs face local +Z. The vehicle approaches from the south (+Z).
        const signGapM = .05;
        const warningBottomY = addFace(trafficSignalWarningModel, 'W209_TRAFFIC_SIGNAL_AHEAD', warningTopY, .82);
        const intersectionBottomY = addFace(intersectionWarningModel, 'W205A_INTERSECTION_AHEAD',
            warningBottomY - signGapM, .82);
        addFace(direction === 'right' ? keepRightModel : straightAheadModel,
            direction === 'right' ? 'R301D_KEEP_RIGHT' : 'R301A_STRAIGHT_AHEAD',
            intersectionBottomY - signGapM, .72);
    }
}
