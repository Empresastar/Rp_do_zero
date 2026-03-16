import * as THREE from 'three';
import './world.js'; 
import { movePlayer } from './player.js';

// 1. CONFIGURAÇÃO DA CENA
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Coloquei um azul céu para você saber que carregou

// 2. CONFIGURAÇÃO DA CÂMERA
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 4. ILUMINAÇÃO
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 7.5);
scene.add(sunLight);

// 5. AJUSTE DE TELA AUTOMÁTICO
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. LOOP DE ANIMAÇÃO (O JOGO RODANDO)
// Note que aqui só existe UMA função animate
function animate() {
    requestAnimationFrame(animate);
    
    // Chama a lógica de movimento do jogador
    movePlayer(); 
    
    // Desenha tudo na tela
    renderer.render(scene, camera);
}

// Inicia o loop
animate();

console.log("Motor 3D rodando sem erros!");
