import * as THREE from 'three';
import { scene } from './state.js';
import { camera, movePlayer, player } from './player.js';
import { updateVehicle, isInsideVehicle, spawnCar } from './vehicle.js';
import './world.js';

// 1. CONFIGURAÇÃO DO RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. LUZES
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(5, 10, 7.5);
scene.add(sun);

// 3. CRIAR O CARRO
spawnCar(-10, -10);

// 4. SISTEMA DE ITENS (TECLA E PARA PEGAR)
const itensNoChao = [];
function criarItem(x, z, nome) {
    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.5, z);
    mesh.userData = { nome };
    scene.add(mesh);
    itensNoChao.push(mesh);
}
criarItem(5, 5, "Kit Médico");

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') {
        itensNoChao.forEach((item, index) => {
            if (player.position.distanceTo(item.position) < 2) {
                console.log("Você pegou: " + item.userData.nome);
                scene.remove(item);
                itensNoChao.splice(index, 1);
            }
        });
    }
});

// 5. LOOP DE ANIMAÇÃO
function animate() {
    requestAnimationFrame(animate);
    if (isInsideVehicle) {
        updateVehicle();
    } else {
        movePlayer();
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
