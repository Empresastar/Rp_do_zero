import * as THREE from 'three';
import { scene } from './state.js';
import { camera, movePlayer, player } from './player.js';
import { updateVehicle, isInsideVehicle, spawnCar } from './vehicle.js';
import './world.js';

// 1. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('canvas-container');
if (container) container.appendChild(renderer.domElement);

// 2. ILUMINAÇÃO
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(5, 10, 7.5);
scene.add(sun);

// 3. CRIAR UM CARRO NO MAPA
spawnCar(-10, -10); // Cria o carro na posição X:-10 Z:-10

// 4. CONTROLE DO INVENTÁRIO (TECLA I)
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'i') {
        const inv = document.getElementById('inv-frame');
        if (inv) {
            const isHidden = inv.style.display === 'none' || inv.style.display === '';
            inv.style.display = isHidden ? 'block' : 'none';
            inv.contentWindow.postMessage('toggleInventory', '*');
        }
    }
});

// 5. LOOP DE ANIMAÇÃO (O CORAÇÃO DO JOGO)
function animate() {
    requestAnimationFrame(animate);

    if (isInsideVehicle) {
        updateVehicle(); // Se estiver no carro, a lógica é do carro
    } else {
        movePlayer();    // Se estiver fora, a lógica é do boneco (pulo/rolagem)
    }

    renderer.render(scene, camera);
}

// AJUSTE DE TELA
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
console.log("Sistema RP Completo e Rodando!");
