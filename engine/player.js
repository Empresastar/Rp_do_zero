import * as THREE from 'three';
import { scene } from './state.js';
import { objetosColidiveis } from './world.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const player = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffcc00 })
);
player.position.y = 1.5;
scene.add(player);

const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

let velocityY = 0;
const gravity = -0.01;

export function movePlayer() {
    const speed = keys['ShiftLeft'] ? 0.2 : 0.1;
    let nextPos = player.position.clone();

    if (keys['KeyW']) nextPos.z -= speed;
    if (keys['KeyS']) nextPos.z += speed;
    if (keys['KeyA']) nextPos.x -= speed;
    if (keys['KeyD']) nextPos.x += speed;

    // SISTEMA DE COLISÃO
    let colidiu = false;
    for (let obj of objetosColidiveis) {
        // Checa distância entre player e o prédio
        const box = new THREE.Box3().setFromObject(obj);
        const playerBox = new THREE.Box3().setFromCenterAndSize(nextPos, new THREE.Vector3(1, 2, 1));
        
        if (box.intersectsBox(playerBox)) {
            colidiu = true;
            break;
        }
    }

    if (!colidiu) {
        player.position.copy(nextPos);
    }

    // Pulo Simples
    if (keys['Space'] && player.position.y <= 1.5) velocityY = 0.2;
    
    player.position.y += velocityY;
    if (player.position.y > 1.5) velocityY += gravity;
    else {
        player.position.y = 1.5;
        velocityY = 0;
    }

    // Câmera segue o player
    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 10);
    camera.lookAt(player.position);
}
