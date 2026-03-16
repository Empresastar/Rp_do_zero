import * as THREE from 'three';
import { scene, camera } from './main.js';

// 1. CRIANDO O CORPO DO JOGADOR
const geometry = new THREE.BoxGeometry(1, 2, 1); // Um boneco de 2 metros de altura
const material = new THREE.MeshStandardMaterial({ color: 0xff4444 }); // Vermelho
const player = new THREE.Mesh(geometry, material);
player.position.y = 1; // Garante que ele esteja em cima do chão
scene.add(player);

// 2. CONTROLE DE TECLADO
const keys = {
    w: false, a: false, s: false, d: false
};

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
});

// 3. LÓGICA DE MOVIMENTO (Roda dentro do loop de animação)
function movePlayer() {
    const speed = 0.15;

    if (keys.w) player.position.z -= speed;
    if (keys.s) player.position.z += speed;
    if (keys.a) player.position.x -= speed;
    if (keys.d) player.position.x += speed;

    // Faz a câmera seguir o jogador com um atraso suave
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10; // Fica 10 metros atrás
    camera.position.y = player.position.y + 5;  // Fica 5 metros acima
    camera.lookAt(player.position);
}

// Criamos uma função para ser chamada no arquivo principal
export { movePlayer };

console.log("Jogador criado e controles configurados!");
