import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

const modelFile = 'W.220_Dốc lên nguy hiểm - 10%.glb';
let warningModel: THREE.Group | undefined;

/** W.220 warning sign placed before the uphill entrance. */
export class UphillWarningSign {
    readonly root = new THREE.Group();

    static async preload(): Promise<void> {
        const url = new URL(`bienbao/${encodeURIComponent(modelFile)}`, document.baseURI);
        warningModel = (await new GLTFLoader().loadAsync(url.href)).scene;
    }

    constructor(x: number, z: number) {
        if (!warningModel) throw new Error('Preload the W.220 sign before building the exam ground.');

        this.root.name = 'EX03_UPHILL_GRADE_WARNING_SIGN';
        this.root.position.set(x, 0, z);
        // The model faces local +Z; approaching traffic drives toward world +X.
        this.root.rotation.y = -Math.PI / 2;

        const post = createStripedSignPost(2.65, .043);
        post.name = 'road-sign-post';
        this.root.add(post);

        const face = warningModel.clone(true);
        face.name = 'W220_UPHILL_10_PERCENT';
        face.scale.setScalar(1.5);
        face.position.set(0, 2.95, .075);
        face.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        this.root.add(face);
    }
}
