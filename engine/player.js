import * as THREE from 'three';
import { scene } from './state.js';
import { objetosColidiveis } from './world.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const player = new THREE.Group(); 

// Corpo do personagem
const playerBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffcc00 })
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

    // LÓGICA DO ROLAMENTO (SHIFT)
    if (keys['ShiftLeft'] && moveDir.length() > 0 && !isRolling) {
        isRolling = true;
        rollTimer = 0;
    }

    if (isRolling) {
        rollTimer += 0.15;
        playerBody.rotation.x += 0.4; // Gira o corpo (Animação)
        player.position.addScaledVector(moveDir, 0.3);
        if (rollTimer > Math.PI * 2) {
            isRolling = false;
            playerBody.rotation.x = 0;
        }
    } else {
        player.position.addScaledVector(moveDir, 0.15);
    }

    // PULO
    if (keys['Space'] && player.position.y <= 1.5) velocityY = 0.2;
    player.position.y += velocityY;
    if (player.position.y > 1.5) velocityY -= 0.01;
    else { player.position.y = 1.5; velocityY = 0; }

    // CÂMERA
    const camOffset = new THREE.Vector3(player.position.x, player.position.y + 3, player.position.z + 6);
    camera.position.lerp(camOffset, 0.1);
    camera.lookAt(player.position);
}
