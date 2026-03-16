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

window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

export function movePlayer() {
    let speed = 0.15;

    // LÓGICA DE INICIAR O ROLAMENTO (Tecla Espaço)
    if (keys[' '] && !isRolling) {
        isRolling = true;
        rollTimer = 20; // Duração do rolamento (frames)
    }

    if (isRolling) {
        speed = 0.4; // Aumenta a velocidade no rolamento
        rollTimer--;
        
        // "Animação" de rolar: inclina o cubo enquanto rola
        player.rotation.x += 0.3; 
        player.scale.y = 0.5; // Fica "baixinho" para desviar
        
        if (rollTimer <= 0) {
            isRolling = false;
            player.rotation.x = 0; // Volta ao normal
            player.scale.y = 1;   // Volta ao tamanho real
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
