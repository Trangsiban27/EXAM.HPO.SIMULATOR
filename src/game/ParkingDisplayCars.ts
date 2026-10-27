import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

/** Camera 0 renders the yard; layer 1 adds decorations excluded from all mirrors. */
export const DISPLAY_CAR_LAYER = 1;
/** Two close-spaced rows in the left apron; noses face -Z. Metres, radians. */
export const PARKING_DISPLAY_POSITIONS = [
{ x: 7, z: -10, heading: 0 },
{ x: 9.7, z: -10, heading: 0 },
{ x: 12.4, z: -10, heading: 0 },
{ x: 15.1, z: -10, heading: 0 },
{ x: 7, z: -4, heading: 0 },
{ x: 9.7, z: -4, heading: 0 },
{ x: 12.4, z: -4, heading: 0 },
{ x: 15.1, z: -4, heading: 0 },
] as const;
let asset: Promise<THREE.Group> | undefined;

/** Decoration only: no Vehicle instances, animation, collision or scoring sensors. */
export async function addParkingDisplayCars(parent: THREE.Object3D): Promise<THREE.Group> {
    const group = new THREE.Group();
    group.name = 'parking-display-cars';
    group.userData.displayOnly = true;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    asset ??= loader.loadAsync(new URL('models/hiepphat_toyota_vios.meshopt.glb', document.baseURI).href)
        .then(gltf => gltf.scene);
    const source = await asset;
    source.updateMatrixWorld(true);
    source.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
            if (material.transparent) material.forceSinglePass = true;
        }
        const instances = new THREE.InstancedMesh(object.geometry, object.material, PARKING_DISPLAY_POSITIONS.length);
        instances.name = `parking-display-${object.name}`;
        instances.layers.set(DISPLAY_CAR_LAYER);
        instances.castShadow = false;
        instances.receiveShadow = false;
        instances.instanceMatrix.setUsage(THREE.StaticDrawUsage);
        PARKING_DISPLAY_POSITIONS.forEach((position, index) => {
            const matrix = new THREE.Matrix4().makeRotationY(position.heading);
            matrix.setPosition(position.x, .065, position.z);
            matrix.multiply(object.matrixWorld);
            instances.setMatrixAt(index, matrix);
        });
        instances.instanceMatrix.needsUpdate = true;
        instances.computeBoundingBox(); instances.computeBoundingSphere();
        instances.updateMatrix(); instances.matrixAutoUpdate = false;
        group.add(instances);
    });
    parent.add(group);
    return group;
}
