import * as THREE from 'three';
import { scene } from './state.js';
import { isInsideVehicle, vehicle } from './vehicle.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const player = new THREE.Group(); 

const loader = new THREE.TextureLoader();
const charTex = loader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg'); 

const playerBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ map: charTex })
);
player.add(playerBody);
player.position.y = 1.5;
scene.add(player);

let yaw = 0;   
let pitch = 0; 
const sensitivity = 0.002;

document.addEventListener('mousedown', () => {
    if (document.pointerLockElement !== document.body) document.body.requestPointerLock();
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        yaw -= e.movementX * sensitivity;
        pitch -= e.movementY * sensitivity;
        pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch)); 
    }
});

const keys = {};
let isRolling = false;
let rollTimer = 0;
let velocityY = 0;

window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

export function movePlayer() {
    const target = isInsideVehicle ? vehicle : player;

    if (!isInsideVehicle) {
        const moveDir = new THREE.Vector3();
        if (keys['KeyW']) moveDir.z -= 1;
        if (keys['KeyS']) moveDir.z += 1;
        if (keys['KeyA']) moveDir.x -= 1;
        if (keys['KeyD']) moveDir.x += 1;
        
        moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        moveDir.normalize();

        if (keys['ShiftLeft'] && moveDir.length() > 0 && !isRolling) {
            isRolling = true;
            rollTimer = 0;
        }

        if (isRolling) {
            rollTimer += 0.15;
            playerBody.rotation.x += 0.4; 
            player.position.addScaledVector(moveDir, 0.3);
            if (rollTimer > Math.PI * 2) { isRolling = false; playerBody.rotation.x = 0; }
        } else {
            player.position.addScaledVector(moveDir, 0.15);
        }

        if (keys['Space'] && player.position.y <= 1.5) velocityY = 0.2;
        player.position.y += velocityY;
        if (player.position.y > 1.5) velocityY -= 0.01;
        else { player.position.y = 1.5; velocityY = 0; }

        player.rotation.y = yaw;
    }

    const camDistance = isInsideVehicle ? 10 : 6;
    const camHeight = isInsideVehicle ? 4 : 3;
    const currentYaw = isInsideVehicle ? vehicle.rotation.y + yaw : yaw;

    camera.position.set(
        target.position.x + Math.sin(currentYaw) * camDistance,
        target.position.y + camHeight + Math.sin(pitch) * 2,
        target.position.z + Math.cos(currentYaw) * camDistance
    );
    camera.lookAt(target.position.x, target.position.y + 1, target.position.z);
}
