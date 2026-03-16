import * as THREE from 'three';
import { scene } from './state.js';
import { player, camera } from './player.js';

export let isInsideVehicle = false;
export let car;

// Objeto para monitorar as teclas pressionadas
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// FUNÇÃO QUE CRIA O CARRO NO MUNDO
export function spawnCar(x, z) {
    const geo = new THREE.BoxGeometry(2, 1, 4); // Largura, Altura, Comprimento
    const mat = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Azul
    car = new THREE.Mesh(geo, mat);
    car.position.set(x, 0.5, z);
    scene.add(car);
}

// LÓGICA DE ENTRAR E SAIR (TECLA F)
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        if (!car) return; // Se o carro não existir, não faz nada

        const distance = player.position.distanceTo(car.position);

        if (!isInsideVehicle && distance < 3) {
            // ENTRAR NO VEÍCULO
            isInsideVehicle = true;
            player.visible = false; // Esconde o boneco vermelho
            console.log("Entrou no veículo!");
        } else if (isInsideVehicle) {
            // SAIR DO VEÍCULO
            isInsideVehicle = false;
            player.visible = true; // Mostra o boneco de volta
            // Coloca o player do lado do carro ao sair
            player.position.set(car.position.x + 2, 1, car.position.z);
        }
    }
});

// LÓGICA DE DIREÇÃO (CHAMADA NO MAIN.JS)
export function updateVehicle() {
    if (!isInsideVehicle || !car) return;

    const speed = 0.25;
    const rotationSpeed = 0.04;

    if (keys['w']) car.translateZ(-speed); // Anda para frente
    if (keys['s']) car.translateZ(speed);  // Anda para trás
    if (keys['a']) car.rotation.y += rotationSpeed; // Gira para esquerda
    if (keys['d']) car.rotation.y -= rotationSpeed; // Gira para direita

    // Faz a câmera e o player (escondido) seguirem o carro
    camera.position.set(car.position.x, car.position.y + 7, car.position.z + 12);
    camera.lookAt(car.position);
    player.position.copy(car.position);
      }
