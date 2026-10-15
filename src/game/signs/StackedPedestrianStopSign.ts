import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

const loader = new GLTFLoader();
let stopModel: THREE.Group | undefined;
let crossingModel: THREE.Group | undefined;

/** One roadside pole with W.224 above R.122, facing approaching traffic. */
export class StackedPedestrianStopSign {
    readonly root = new THREE.Group();

    static async preload(): Promise<void> {
        const [stop, crossing] = await Promise.all([
            loader.loadAsync(new URL('bienbao/r.122_dunglai.glb', document.baseURI).href),
            loader.loadAsync(new URL('bienbao/w.224_duongnguoidibocatngang.glb', document.baseURI).href),
        ]);
        stopModel = stop.scene;
        crossingModel = crossing.scene;
    }

    constructor(x: number, z: number) {
        if (!stopModel || !crossingModel) {
            throw new Error('Preload the roadside sign models before building the exam ground.');
        }

        this.root.name = 'EX02_STACKED_PEDESTRIAN_STOP_SIGN';
        this.root.position.set(x, 0, z);
        // The GLBs face local +Z; traffic approaches along world +X.
        this.root.rotation.y = -Math.PI / 2;

        const post = createStripedSignPost(3.22, 0.043);
        post.name = 'road-sign-post';
        this.root.add(post);

        const addFace = (source: THREE.Group, name: string, y: number, scale: number) => {
            const face = source.clone(true);
            face.name = name;
            face.scale.setScalar(scale);
            face.position.set(0, y, 0.075);
            face.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.root.add(face);
        };

        addFace(stopModel, 'R122_STOP', 1.92, 1.2);
        addFace(crossingModel, 'W224_PEDESTRIAN_CROSSING', 2.87, 1.28);
    }
}
