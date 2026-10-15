import * as THREE from 'three';
import type { VehicleClass } from '../ParallelParkingBayB';
import { createStripedSignPost } from './StripedSignPost';

export interface ParkingBaySignOptions {
    pBoardRotationY?: number;
    classBoardRotationY?: number;
    pBoardShiftM?: { x: number; y: number; z: number };
    classBoardShiftM?: { x: number; y: number; z: number };
}

/** Biển P / HẠNG B, C, D hoặc E trên cột sọc đỏ trắng. */
export class ParkingBayBSign {
    readonly root = new THREE.Group();

    constructor(vehicleClass: VehicleClass | 'C' = 'B', options: ParkingBaySignOptions = {}) {
        this.root.name = `PARKING_BAY_${vehicleClass}_SIGN`;

        const post = createStripedSignPost(3.12, .045);
        post.name = `parking-bay-${vehicleClass.toLowerCase()}-striped-post`;
        this.root.add(post);

        const pBoardMount = new THREE.Group();
        pBoardMount.rotation.y = options.pBoardRotationY ?? 0;
        if (options.pBoardShiftM) {
            const { x, y, z } = options.pBoardShiftM;
            pBoardMount.position.set(x, y, z);
        }
        this.root.add(pBoardMount);
        const classBoardMount = new THREE.Group();
        classBoardMount.rotation.y = options.classBoardRotationY ?? 0;
        if (options.classBoardShiftM) {
            const { x, y, z } = options.classBoardShiftM;
            classBoardMount.position.set(x, y, z);
        }
        this.root.add(classBoardMount);

        const addBoard = (
            mount: THREE.Group,
            name: string, widthM: number, heightM: number, centerY: number,
            canvasWidth: number, canvasHeight: number, text: string, font: string,
        ) => {
            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#07509c';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = '#ffffff';
            ctx.font = font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, canvasWidth / 2, canvasHeight / 2, canvasWidth * .9);

            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 4;

            const backing = new THREE.Mesh(
                new THREE.BoxGeometry(widthM + .025, heightM + .025, .035),
                new THREE.MeshStandardMaterial({ color: 0x0b356a, roughness: .6 }),
            );
            backing.name = `${name}-backing`;
            backing.position.set(0, centerY, .075);
            backing.castShadow = true;
            mount.add(backing);

            const face = new THREE.Mesh(
                new THREE.PlaneGeometry(widthM, heightM),
                new THREE.MeshBasicMaterial({ map: texture }),
            );
            face.name = name;
            face.position.set(0, centerY, .095);
            mount.add(face);
        };

        addBoard(pBoardMount, 'PARKING_P_BOARD', .78, .8, 2.7, 512, 512, 'P', 'bold 390px Arial, sans-serif');
        addBoard(classBoardMount, `PARKING_CLASS_${vehicleClass}_BOARD`, .88, .36, 2.05, 768, 256,
            `HẠNG ${vehicleClass}`, 'bold 142px Arial, sans-serif');
    }
}
