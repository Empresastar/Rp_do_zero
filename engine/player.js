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
let isRolling = false;
let rollDirection = new THREE.Vector3();
let velocityY = 0;
const gravity = -0.01;

window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

export function movePlayer() {
    // Se estiver rolando, o controle trava e o boneco faz o dash
    if (isRolling) {
        player.position.addScaledVector(rollDirection, 0.4);
        return;
    }

    const speed = 0.15;
    let nextPos = player.position.clone();

    // Movimentação WASD
    if (keys['KeyW']) nextPos.z -= speed;
    if (keys['KeyS']) nextPos.z += speed;
    if (keys['KeyA']) nextPos.x -= speed;
    if (keys['KeyD']) nextPos.x += speed;

    // SISTEMA DE ROLAMENTO (SHIFT)
    if (keys['ShiftLeft'] && !isRolling) {
        isRolling = true;
        // Pega a direção que você está tentando andar
        rollDirection.set(
            (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0),
            0,
            (keys['KeyS'] ? 1 : 0) - (keys['KeyW'] ? 1 : 0)
        ).normalize();
        
        // Se estiver parado, rola pra frente
        if (rollDirection.length() === 0) rollDirection.z = -1;
        
        setTimeout(() => { isRolling = false; }, 400); 
    }

    // SISTEMA DE PULO (ESPAÇO)
    if (keys['Space'] && player.position.y <= 1.5) velocityY = 0.2;
    player.position.y += velocityY;
    if (player.position.y > 1.5) velocityY += gravity;
    else { player.position.y = 1.5; velocityY = 0; }

    // COLISÃO COM PRÉDIOS
    let colidiu = false;
    for (let obj of objetosColidiveis) {
        if (nextPos.distanceTo(obj.position) < 2.5) { colidiu = true; break; }
    }
    
    if (!colidiu) {
        player.position.x = nextPos.x;
        player.position.z = nextPos.z;
    }

    // CÂMERA SEGUE O JOGADOR
    camera.position.set(player.position.x, player.position.y + 3, player.position.z + 7);
    camera.lookAt(player.position);
}
