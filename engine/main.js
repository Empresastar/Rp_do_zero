import * as THREE from 'three';

// 1. PRIMEIRO: Criamos a cena e a câmera (a base de tudo)
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Céu azul

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// 2. SEGUNDO: Configuramos o renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('canvas-container');
if (container) {
    container.appendChild(renderer.domElement);
}

// 3. TERCEIRO: Agora que a scene existe, chamamos os outros arquivos
// Importamos o mundo e o player DEPOIS de criar a scene
import('./world.js'); 
import { movePlayer } from './player.js';

// 4. LUZES
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 7.5);
scene.add(sunLight);

// 5. AJUSTE DE TELA
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. LOOP DE ANIMAÇÃO
function animate() {
    requestAnimationFrame(animate);
    
    // Só move o player se a função já tiver sido carregada
    if (typeof movePlayer === 'function') {
        movePlayer();
    }
    
    renderer.render(scene, camera);
}

animate();

console.log("Motor corrigido e rodando!");
