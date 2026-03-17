import * as THREE from 'three';
import { scene } from './state.js';
import { player } from './player.js';

export let isInsideVehicle = false;
export let vehicle = null; 
let speed = 0;
let wheels = [];

const loader = new THREE.TextureLoader();
const carTex = loader.load('https://threejs.org/examples/textures/carbon/Carbon.png');

export function spawnCar(x, z) {
    vehicle = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 4), 
        new THREE.MeshStandardMaterial({ map: carTex, color: 0xff0000 })
    );
    vehicle.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
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
    if(e.code === 'KeyF' && player.position.distanceTo(vehicle.position) < 5) {
        isInsideVehicle = !isInsideVehicle;
        player.visible = !isInsideVehicle;
    }
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

export function updateVehicle() {
    if(!isInsideVehicle) return;

    if(keys['KeyW']) speed += 0.02; // Aumentei um pouco a aceleração
    if(keys['KeyS']) speed -= 0.01;
    speed *= 0.97; 

    if(keys['KeyA']) vehicle.rotation.y += 0.04;
    if(keys['KeyD']) vehicle.rotation.y -= 0.04;

    vehicle.translateZ(speed);
    
    // IMPORTANTE: Mantém o player na posição do carro para a câmera ler
    player.position.copy(vehicle.position);
    
    wheels.forEach(w => w.rotation.x += speed * 2); 
}
