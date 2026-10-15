import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

let warningModel: THREE.Group | undefined;

/** W.219 warning sign at the start of the bridge descent. */
export class DownhillWarningSign {
    readonly root = new THREE.Group();

    static async preload(): Promise<void> {
        const url = new URL('bienbao/w.219_docxuongnguyhiem.glb', document.baseURI);
        warningModel = (await new GLTFLoader().loadAsync(url.href)).scene;
    }

    constructor(x: number, z: number, roadSurfaceHeightM: number) {
        if (!warningModel) throw new Error('Preload the W.219 sign before building the exam ground.');

        this.root.name = 'EX03_DOWNHILL_WARNING_SIGN';
        this.root.position.set(x, 0, z);
        // The model faces local +Z; approaching traffic drives toward world +X.
        this.root.rotation.y = -Math.PI / 2;

        const post = createStripedSignPost(roadSurfaceHeightM + 2.65, .043);
        post.name = 'road-sign-post';
        this.root.add(post);

        const face = warningModel.clone(true);
        face.name = 'W219_DOWNHILL';
        face.scale.setScalar(1.5);
        face.position.set(0, roadSurfaceHeightM + 2.95, .075);
        face.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        this.root.add(face);
    }
}
