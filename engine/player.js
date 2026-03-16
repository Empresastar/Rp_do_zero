import * as THREE from 'three';
import { scene } from './state.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// CORPO DO JOGADOR
const geometry = new THREE.BoxGeometry(1, 2, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff4444 });
export const player = new THREE.Mesh(geometry, material);
player.position.y = 1;
scene.add(player);

// VARIÁVEIS DE MOVIMENTO
const keys = {};
let isRolling = false;
let rollTimer = 0;

// SISTEMA DE PULO
let velocityY = 0;
let isJumping = false;
const gravity = -0.015;
const jumpForce = 0.3;

window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

export function movePlayer() {
    let speed = 0.15;

    // 1. LÓGICA DE PULAR (Espaço)
    if (keys[' '] && !isJumping && !isRolling) {
        velocityY = jumpForce;
        isJumping = true;
    }

    // Aplica gravidade
    if (isJumping) {
        player.position.y += velocityY;
        velocityY += gravity;

        // Se tocar no chão (y=1)
        if (player.position.y <= 1) {
            player.position.y = 1;
            isJumping = false;
            velocityY = 0;
        }
    }

    // 2. LÓGICA DE ROLAGEM (Shift)
    if (keys['shift'] && !isRolling && !isJumping) {
        isRolling = true;
        rollTimer = 20; 
    }

    if (isRolling) {
        speed = 0.4; 
        rollTimer--;
        
        player.rotation.x += 0.3; 
        player.scale.y = 0.5; 
        
        if (rollTimer <= 0) {
            isRolling = false;
            player.rotation.x = 0; 
            player.scale.y = 1;   
        }
    }

    // MOVIMENTAÇÃO BÁSICA
    if (keys['w']) player.position.z -= speed;
    if (keys['s']) player.position.z += speed;
    if (keys['a']) player.position.x -= speed;
    if (keys['d']) player.position.x += speed;

    // CÂMERA SEGUINDO
    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 10);
    camera.lookAt(player.position);
}
