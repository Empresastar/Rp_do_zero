import * as THREE from 'three';
import { scene } from './state.js';

const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const boxGeo = new THREE.BoxGeometry(5, 15, 5);
const boxMat = new THREE.MeshStandardMaterial({ color: 0x5555ff });
const building = new THREE.Mesh(boxGeo, boxMat);
building.position.set(10, 7.5, 10);
scene.add(building);

scene.add(new THREE.GridHelper(200, 50));
