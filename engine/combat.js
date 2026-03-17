import * as THREE from 'three';
import { scene } from './state.js';
import { player, camera } from './player.js';

const loader = new THREE.TextureLoader();
const metalTex = loader.load('https://threejs.org/examples/textures/tri_pattern.jpg'); 

// CRIAR MODELO DA ARMA NA MÃO
const gunGeom = new THREE.BoxGeometry(0.2, 0.2, 0.7);
const gunMat = new THREE.MeshStandardMaterial({ map: metalTex, color: 0x555555 });
const armaVisual = new THREE.Mesh(gunGeom, gunMat);
armaVisual.position.set(0.6, 0.2, -0.5); 
player.add(armaVisual);

const armasConfig = {
    '1': { nome: 'Glock', cadencia: 400, vel: 2.0, cor: 0xffff00 },
    '2': { nome: 'M4A1', cadencia: 100, vel: 4.5, cor: 0x00ffff },
    '3': { nome: 'AK-47', cadencia: 150, vel: 3.8, cor: 0xff4400 }
};

let armaAtual = '1';
let podeAtirar = true;

window.addEventListener('keydown', (e) => {
    if (armasConfig[e.key]) {
        armaAtual = e.key;
        armaVisual.material.color.set(armasConfig[e.key].cor);
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
        document.getElementById(`slot-${e.key}`).classList.add('active');
    }
});

window.addEventListener('mousedown', (e) => { if (e.button === 0) atirar(); });

function atirar() {
    if (!podeAtirar) return;
    podeAtirar = false;

    // Recuo da arma
    armaVisual.position.z += 0.15;
    setTimeout(() => armaVisual.position.z -= 0.15, 40);

    const bala = new THREE.Mesh(
        new THREE.SphereGeometry(0.08),
        new THREE.MeshBasicMaterial({ color: armasConfig[armaAtual].cor })
    );

    const direcao = new THREE.Vector3();
    camera.getWorldDirection(direcao);
    
    bala.position.copy(player.position).add(direcao);
    scene.add(bala);

    const vel = armasConfig[armaAtual].vel;
    const loopBala = setInterval(() => {
        bala.position.addScaledVector(direcao, vel);
        direcao.y -= 0.0015; // Física da bala caindo
    }, 16);

    setTimeout(() => { clearInterval(loopBala); scene.remove(bala); }, 1200);
    setTimeout(() => { podeAtirar = true; }, armasConfig[armaAtual].cadencia);
}
