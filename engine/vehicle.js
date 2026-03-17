import * as THREE from 'three';
import { scene } from './state.js';
import { player } from './player.js';

export let isInsideVehicle = false;
let vehicle = null;
let speed = 0;
let wheels = [];

export function spawnCar(x, z) {
    vehicle = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 4), new THREE.MeshStandardMaterial({color: 0xff0000}));
    vehicle.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4);
    const wheelMat = new THREE.MeshStandardMaterial({color: 0x111111});
    
    for(let i=0; i<4; i++) {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.z = Math.PI/2;
        w.position.set(i%2==0 ? 1.1 : -1.1, -0.4, i<2 ? 1.4 : -1.4);
        wheels.push(w);
        vehicle.add(w);
    }
    vehicle.position.set(x, 1, z);
    scene.add(vehicle);
}

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if(e.code === 'KeyF' && player.position.distanceTo(vehicle.position) < 4) {
        isInsideVehicle = !isInsideVehicle;
    }
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

export function updateVehicle() {
    if(!isInsideVehicle) return;

    if(keys['KeyW']) speed += 0.015;
    if(keys['KeyS']) speed -= 0.01;
    speed *= 0.96; // Fricção

    if(keys['KeyA']) vehicle.rotation.y += 0.04 * (speed >= 0 ? 1 : -1);
    if(keys['KeyD']) vehicle.rotation.y -= 0.04 * (speed >= 0 ? 1 : -1);

    vehicle.translateZ(speed);
    player.position.copy(vehicle.position);
    
    wheels.forEach(w => w.rotation.x += speed); // Animação das rodas
}
