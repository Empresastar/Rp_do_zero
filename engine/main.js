import * as THREE from 'three';

// 1. O CENÁRIO (Onde tudo existe)
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); // Fundo escuro inicial

// 2. A CÂMERA (Seus olhos no mundo)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// 3. O RENDERIZADOR (O motor que desenha)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 4. LUZES (Sem isso tudo fica preto)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz geral
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1); // Luz como a do sol
sunLight.position.set(5, 10, 7.5);
scene.add(sunLight);

// 5. AJUSTE DE TELA (Se você esticar o navegador, o jogo se ajusta)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. O LOOP DE ANIMAÇÃO (Roda 60 vezes por segundo)
function animate() {
    requestAnimationFrame(animate);
    
    // Aqui é onde o jogo "pulsa"
    renderer.render(scene, camera);
}

console.log("Motor gráfico iniciado com sucesso!");
animate();

// Exportamos a câmera para o arquivo do jogador poder usar depois
export { camera };
