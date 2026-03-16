import * as THREE from 'three';
import { scene } from './main.js';

// 1. CRIANDO O CHÃO (O asfalto da sua cidade)
const groundGeometry = new THREE.PlaneGeometry(200, 200); // Tamanho do mapa: 200x200
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333, // Cinza asfalto
    side: THREE.DoubleSide 
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);

// Deita o plano para ele virar um chão (ele nasce em pé por padrão)
ground.rotation.x = -Math.PI / 2; 
scene.add(ground);

// 2. CRIANDO UM PRÉDIO DE EXEMPLO
function criarPredio(x, z, largura, altura, profundidade) {
    const geometry = new THREE.BoxGeometry(largura, altura, profundidade);
    const material = new THREE.MeshStandardMaterial({ color: 0x5555ff }); // Prédio Azul
    const building = new THREE.Mesh(geometry, material);
    
    // Posiciona o prédio no mapa
    building.position.set(x, altura / 2, z); 
    scene.add(building);
}

// Vamos construir alguns "blocos" na nossa cidade do zero
criarPredio(10, 10, 5, 15, 5);  // Um prédio alto
criarPredio(-15, -5, 8, 10, 8); // Um prédio largo

// 3. ADICIONANDO UMA GRADE (Para ajudar a ver o movimento)
const grid = new THREE.GridHelper(200, 50, 0xffffff, 0x444444);
scene.add(grid);

console.log("Mapa carregado: Chão e prédios criados!");
