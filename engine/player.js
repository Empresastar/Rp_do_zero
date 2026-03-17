import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './state.js';
import { isInsideVehicle, vehicle } from './vehicle.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const player = new THREE.Group(); 
scene.add(player); // Adicionamos o grupo do player à cena

// --- CARREGAMENTO DO MODELO 3D GLTF ---
const loader = new GLTFLoader();
const modelUrl = 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb'; // EX: robô
// VOCÊ PODE TROCAR POR UM MODELO REALISTA DE HUMANO:
// const modelUrl = 'SUA_URL_DO_MODELO_3D_HUMANO_GLTF.glb'; 

let characterModel;

loader.load(modelUrl, (gltf) => {
    characterModel = gltf.scene;
    characterModel.scale.set(1.5, 1.5, 1.5); // Ajuste a escala conforme o tamanho do seu modelo
    characterModel.position.y = -1; // Ajuste para o modelo ficar "no chão"
    player.add(characterModel);

    // Remove o boneco cápsula antigo, se ainda existisse
    player.remove(playerBody); 
    console.log("Modelo 3D do personagem carregado!");
});

// Mantém o playerBody como referência para a colisão e posição (invisível se o modelo carregar)
const playerBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1, 4, 8),
    new THREE.MeshStandardMaterial({ visible: false }) // Invisível, usado para colisão
);
player.add(playerBody);
player.position.y = 1.5;

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

        // Lógica de Rolamento (agora gira o modelo 3D se carregado)
        if (keys['ShiftLeft'] && moveDir.length() > 0 && !isRolling) {
            isRolling = true;
            rollTimer = 0;
        }

        if (isRolling) {
            rollTimer += 0.15;
            if (characterModel) characterModel.rotation.x += 0.4; // Gira o modelo 3D
            player.position.addScaledVector(moveDir, 0.3);
            if (rollTimer > Math.PI * 2) { 
                isRolling = false; 
                if (characterModel) characterModel.rotation.x = 0; 
            }
        } else {
            player.position.addScaledVector(moveDir, 0.15);
        }

        if (keys['Space'] && player.position.y <= 1.5) velocityY = 0.2;
        player.position.y += velocityY;
        if (player.position.y > 1.5) velocityY -= 0.01;
        else { player.position.y = 1.5; velocityY = 0; }

        player.rotation.y = yaw;
    }

    const camDistance = isInsideVehicle ? 12 : 5; 
    const camHeight = isInsideVehicle ? 4 : 2.5;
    const shoulderOffset = isInsideVehicle ? 0 : 1.2; 
    
    const rotY = isInsideVehicle ? vehicle.rotation.y + yaw : yaw;

    const cameraX = target.position.x + Math.sin(rotY) * camDistance + Math.cos(rotY) * shoulderOffset;
    const cameraZ = target.position.z + Math.cos(rotY) * camDistance - Math.sin(rotY) * shoulderOffset;
    const cameraY = target.position.y + camHeight + Math.sin(pitch) * 3;

    camera.position.set(cameraX, cameraY, cameraZ);
    
    const lookTarget = new THREE.Vector3(
        target.position.x + Math.cos(rotY) * (shoulderOffset * 0.5), 
        target.position.y + 1.5, 
        target.position.z - Math.sin(rotY) * (shoulderOffset * 0.5)
    );
    
    camera.lookAt(lookTarget);
}
