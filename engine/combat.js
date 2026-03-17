import * as THREE from 'three';
import { scene } from './state.js';
import { player, camera } from './player.js';

const armas = {
    '1': { nome: 'Glock', cadencia: 400, vel: 2.0, cor: 0xffff00 },
    '2': { nome: 'M4A1', cadencia: 120, vel: 4.0, cor: 0x00ffff },
    '3': { nome: 'AK-47', cadencia: 180, vel: 3.5, cor: 0xffaa00 }
};

let armaAtual = '1';
let podeAtirar = true;

window.addEventListener('keydown', (e) => {
    if (armas[e.key]) {
        armaAtual = e.key;
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
        document.getElementById(`slot-${e.key}`).classList.add('active');
    }
});

window.addEventListener('mousedown', (e) => { if (e.button === 0) atirar(); });

function atirar() {
    if (!podeAtirar) return;
    podeAtirar = false;

    const bala = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: armas[armaAtual].cor })
    );

    const direcao = new THREE.Vector3();
    camera.getWorldDirection(direcao);
    
    bala.position.copy(player.position).add(direcao);
    scene.add(bala);

    const vel = armas[armaAtual].vel;
    const loopBala = setInterval(() => {
        bala.position.addScaledVector(direcao, vel);
        direcao.y -= 0.002; // Gravidade na bala
    }, 16);

    setTimeout(() => { clearInterval(loopBala); scene.remove(bala); }, 1500);
    setTimeout(() => { podeAtirar = true; }, armas[armaAtual].cadencia);
}
