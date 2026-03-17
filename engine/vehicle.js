import * as THREE from 'three';
import { scene } from './state.js';
import { player } from './player.js';
import { objetosColidiveis } from './world.js';

export let isInsideVehicle = false;
let vehicle = null;
let vehicleVel = 0;

export function spawnCar(x, z) {
    const group = new THREE.Group();
    
    // Corpo do Carro
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8 })
    );
    group.add(body);

    // Rodas (Para ficar bonito)
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    const positions = [[1.1, -0.4, 1.5], [-1.1, -0.4, 1.5], [1.1, -0.4, -1.5], [-1.1, -0.4, -1.5]];
    positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
    });

    group.position.set(x, 1, z);
    scene.add(group);
    vehicle = group;
}

export function updateVehicle() {
    if (!isInsideVehicle) return;

    const keys = {}; // Note: Idealmente usar o listener global
    // (Simplificado para o exemplo)

    // Movimentação básica do carro
    vehicle.translateZ(-vehicleVel);
    
    // Colisão do Carro com Prédios
    for (let obj of objetosColidiveis) {
        const vBox = new THREE.Box3().setFromObject(vehicle);
        const oBox = new THREE.Box3().setFromObject(obj);
        if (vBox.intersectsBox(oBox)) {
            vehicle.translateZ(vehicleVel + 0.5); // "Rebota" pra trás
            vehicleVel = 0;
        }
    }

    player.position.copy(vehicle.position); // Player fica "dentro" do carro
}

// Tecla F para entrar/sair
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        const dist = player.position.distanceTo(vehicle.position);
        if (dist < 4) isInsideVehicle = !isInsideVehicle;
    }
});
