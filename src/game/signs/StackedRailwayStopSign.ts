import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

const loader = new GLTFLoader();
let warningModel: THREE.Group | undefined;
let crossingModel: THREE.Group | undefined;
let stopModel: THREE.Group | undefined;

/** W.211a above W.242a above R.122, beside the railway approach arrows. */
export class StackedRailwayStopSign {
    readonly root = new THREE.Group();

    static async preload(): Promise<void> {
        const [warning, crossing, stop] = await Promise.all([
            loader.loadAsync(new URL('bienbao/w.211a_giaonhauvoiduongsatkhongcoraochan.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/w.242a_noiduongsatgiaovuonggocvoiduongbo.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/r.122_dunglai.glb', document.baseURI).href),
        ]);
        warningModel = warning.scene;
        crossingModel = crossing.scene;
        stopModel = stop.scene;
    }

    constructor(x: number, z: number) {
        if (!warningModel || !crossingModel || !stopModel) {
            throw new Error('Preload the railway crossing signs before building the exam ground.');
        }

        this.root.name = 'ROAD_11A_RAILWAY_WARNING_STOP_SIGNS';
        this.root.position.set(x, 0, z);
        // The GLBs face local +Z; the approach arrows point toward local +Z.
        this.root.rotation.y = Math.PI;

        const warningTopY = 3.45;
        const post = createStripedSignPost(warningTopY + .05, .043);
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

        const gapM = .05;
        const warningBottomY = addFace(warningModel, 'W211A_RAILWAY_WARNING', warningTopY, .84);
        const crossingBottomY = addFace(crossingModel, 'W242A_RAILWAY_CROSSING', warningBottomY - gapM, .86);
        addFace(stopModel, 'R122_STOP', crossingBottomY - gapM, .72);
    }
}
