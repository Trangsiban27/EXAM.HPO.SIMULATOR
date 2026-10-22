import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStripedSignPost } from './StripedSignPost';

let warningModel: THREE.Group | undefined;

export type WindingCourseVehicleClass = 'B' | 'C' | 'D' | 'E';

export interface WindingCourseClassSignOptions {
    warningRotationY?: number;
    boardRotationY?: number;
    boardClassLabel?: string;
    namePrefix?: string;
}

/** W.202a above a vehicle-class board on one striped post at a bay entrance. */
export class WindingCourseClassSign {
    readonly root = new THREE.Group();

    static async preload(): Promise<void> {
        const url = new URL('bienbao/w.202a_nhieuchongoatnguyhiemlientiep.glb', document.baseURI);
        warningModel = (await new GLTFLoader().loadAsync(url.href)).scene;
    }

    constructor(
        x: number,
        z: number,
        vehicleClass: WindingCourseVehicleClass,
        options: WindingCourseClassSignOptions = {},
    ) {
        if (!warningModel) throw new Error('Preload the W.202a sign before building the exam ground.');

        const namePrefix = options.namePrefix ?? 'EX04';
        this.root.name = `${namePrefix}_${vehicleClass}_WINDING_COURSE_ENTRY_SIGN`;
        this.root.position.set(x, 0, z);

        const post = createStripedSignPost(2.75, .043);
        post.name = 'road-sign-post';
        this.root.add(post);

        // The GLB faces local +Z; the mount sets its world-facing direction.
        const warningMount = new THREE.Group();
        warningMount.rotation.y = options.warningRotationY ?? Math.PI / 2;
        const warning = warningModel.clone(true);
        warning.name = 'W202A_CONSECUTIVE_DANGEROUS_BENDS';
        warning.scale.setScalar(1.5);
        warning.position.set(0, 3.03, .075);
        warning.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        warningMount.add(warning);
        this.root.add(warningMount);

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#1658ad';
        context.fillRect(0, 0, 512, 256);
        context.strokeStyle = '#ffffff';
        context.lineWidth = 18;
        context.strokeRect(14, 14, 484, 228);
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = 'bold 116px Arial';
        const classLabel = options.boardClassLabel ?? vehicleClass;
        context.fillText(`HẠNG ${classLabel === 'C' ? 'C1' : classLabel}`, 256, 136, 454);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        // Keep the original +Z face unless a course needs another approach direction.
        const classMount = new THREE.Group();
        classMount.rotation.y = options.boardRotationY ?? 0;
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.03, .49, .045),
            new THREE.MeshStandardMaterial({ color: 0xf7f7f3, roughness: .6 }),
        );
        frame.name = `${namePrefix}_CLASS_${vehicleClass}_BOARD_FRAME`;
        frame.position.set(0, 2.14, .08);
        frame.castShadow = true;
        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(.98, .44),
            new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, roughness: .6 }),
        );
        board.name = `${namePrefix}_CLASS_${vehicleClass}_BOARD`;
        board.position.set(0, 2.14, .11);
        board.castShadow = true;
        classMount.add(frame, board);
        this.root.add(classMount);
    }
}
