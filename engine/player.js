import * as THREE from 'three';
import { scene } from './state.js';
import { objetosColidiveis } from './world.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const player = new THREE.Group(); 

const loader = new THREE.TextureLoader();
// TEXTURA DO PERSONAGEM
const charTex = loader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg'); 

const playerBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ map: charTex })
);
player.add(playerBody);
player.position.y = 1.5;
scene.add(player);

const keys = {};
let isRolling = false;
let rollTimer = 0;
let velocityY = 0;

window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

export function movePlayer() {
    const moveDir = new THREE.Vector3();
    if (keys['KeyW']) moveDir.z -= 1;
    if (keys['KeyS']) moveDir.z += 1;
    if (keys['KeyA']) moveDir.x -= 1;
    if (keys['KeyD']) moveDir.x += 1;
    moveDir.normalize();

    if (keys['ShiftLeft'] && moveDir.length() > 0 && !isRolling) {
        isRolling = true;
        rollTimer = 0;
    }

    if (isRolling) {
        rollTimer += 0.15;
        playerBody.rotation.x += 0.4; 
        player.position.addScaledVector(moveDir, 0.3);
        if (rollTimer > Math.PI * 2) {
            isRolling = false;
            playerBody.rotation.x = 0;
        }
    } else {
        player.position.addScaledVector(moveDir, 0.15);
    }

    if (keys['Space'] && player.position.y <= 1.5) velocityY = 0.2;
    player.position.y += velocityY;
    if (player.position.y > 1.5) velocityY -= 0.01;
    else { player.position.y = 1.5; velocityY = 0; }

    const camOffset = new THREE.Vector3(player.position.x, player.position.y + 3, player.position.z + 6);
    camera.position.lerp(camOffset, 0.1);
    camera.lookAt(player.position);
}
