import * as THREE from 'three';
import { scene } from './state.js';

// LISTA DE COLISÃO
export const objetosColidiveis = [];

const loader = new THREE.TextureLoader();

// 1. CHÃO COM TEXTURA
const groundTex = loader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
groundTex.repeat.set(100, 100);

const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const groundMat = new THREE.MeshStandardMaterial({ map: groundTex });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 2. ESTRADA CENTRAL
const roadGeo = new THREE.PlaneGeometry(20, 1000);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.01; // Um pouco acima da grama
scene.add(road);

// 3. GERADOR DE PRÉDIOS COM COLISÃO
function criarPredio(x, z) {
    const h = 10 + Math.random() * 30;
    const w = 5 + Math.random() * 5;
    const geo = new THREE.BoxGeometry(w, h, w);
    
    // Material com cara de prédio (janelas reflexivas)
    const mat = new THREE.MeshStandardMaterial({ 
        color: 0x444466, 
        metalness: 0.5, 
        roughness: 0.1 
    });
    
    const predio = new THREE.Mesh(geo, mat);
    predio.position.set(x, h / 2, z);
    scene.add(predio);
    
    // Adiciona na lista para o player não atravessar
    objetosColidiveis.push(predio);
}

// Espalha prédios pela cidade (evitando a estrada central)
for (let i = 0; i < 60; i++) {
    let x = (Math.random() - 0.5) * 200;
    let z = (Math.random() - 0.5) * 200;
    
    if (Math.abs(x) > 15) { // Não spawna no meio da rua
        criarPredio(x, z);
    }
     }
      
