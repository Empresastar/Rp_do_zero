import * as THREE from 'three';
import { scene } from './state.js';
import { camera, movePlayer, player } from './player.js';
import { updateVehicle, isInsideVehicle, spawnCar } from './vehicle.js';
import './world.js';

// --- INICIO DA ADIÇÃO PARA O INVENTÁRIO ---
// Lista de itens que o jogador carrega
export const inventory = [];

// Função para criar itens que podem ser pegos (Ex: 🍔 no chão)
export function spawnPickup(x, z, name, icon) {
    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.5, z);
    mesh.userData = { name, icon };
    scene.add(mesh);
    return mesh;
}

// Criando alguns itens de teste no mapa
const item1 = spawnPickup(5, 5, "Lanche", "🍔");
const item2 = spawnPickup(-3, 8, "Água", "💧");

// Tecla 'E' para pegar os itens
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') {
        [item1, item2].forEach(item => {
            if (item.parent && player.position.distanceTo(item.position) < 2) {
                inventory.push({ name: item.userData.name, icon: item.userData.icon });
                scene.remove(item);
                console.log("Pegou: " + item.userData.name);
            }
        });
    }
});
// --- FIM DA ADIÇÃO ---

// 1. CONFIGURAÇÃO DO RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. LUZES
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(5, 10, 7.5);
scene.add(sun);

// 3. CRIAR O CARRO (Posição X, Z)
spawnCar(-10, -10);

// 4. LOOP DE ANIMAÇÃO
function animate() {
    requestAnimationFrame(animate);

    if (isInsideVehicle) {
        updateVehicle(); // Se estiver no carro, controla o carro
    } else {
        movePlayer();    // Se estiver fora, controla o boneco (pulo/rolagem)
    }

    renderer.render(scene, camera);
}

animate();

// Ajuste de tela caso o jogador redimensione o navegador
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
