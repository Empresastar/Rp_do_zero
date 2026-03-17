import * as THREE from 'three';
import { scene } from './state.js';
import { camera, movePlayer } from './player.js';
import { updateVehicle, isInsideVehicle, spawnCar } from './vehicle.js';
import './world.js';
import './combat.js'; // ISSO ATIVA O SISTEMA DE ARMAS

// 1. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. ILUMINAÇÃO
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// 3. SPAWN DO CARRO
spawnCar(-10, -10);

// 4. LOOP PRINCIPAL (FRAME POR FRAME)
function animate() {
    requestAnimationFrame(animate);

    if (isInsideVehicle) {
        updateVehicle(); // Se estiver no carro
    } else {
        movePlayer();    // Se estiver a pé (inclui pulo e rolamento)
    }

    renderer.render(scene, camera);
}

animate();

// AJUSTE DE TELA
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
