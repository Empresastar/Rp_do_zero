import * as THREE from 'three';
import { scene } from './state.js';
import { player, camera } from './player.js';

let armaAtual = 'pistola';
const armas = {
    'pistola': { dano: 20, cadencia: 400, cor: 0xffff00, velocidade: 1.5 },
    'fuzil': { dano: 35, cadencia: 100, cor: 0xff4400, velocidade: 2.0 }
};

let podeAtirar = true;

// ATIRAR COM O MOUSE (Botão Esquerdo)
window.addEventListener('mousedown', (e) => {
    if (e.button === 0) atirar();
});

// TROCAR ARMA NO TECLADO
window.addEventListener('keydown', (e) => {
    if (e.key === '1') { armaAtual = 'pistola'; console.log("🔫 Pistola Equipada"); }
    if (e.key === '2') { armaAtual = 'fuzil'; console.log("🔥 Fuzil Equipado"); }
});

function atirar() {
    if (!podeAtirar) return;
    podeAtirar = false;

    // Cria a bala (um pequeno ponto brilhante)
    const bala = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: armas[armaAtual].cor })
    );
    bala.position.copy(player.position);
    scene.add(bala);

    // Direção para onde a câmera está apontando
    const direcao = new THREE.Vector3();
    camera.getWorldDirection(direcao);

    // Faz a bala voar
    const intervaloBala = setInterval(() => {
        bala.position.addScaledVector(direcao, armas[armaAtual].velocidade);
    }, 16);

    // Remove a bala depois de um tempo para não pesar o jogo
    setTimeout(() => {
        scene.remove(bala);
        clearInterval(intervaloBala);
    }, 1000);

    // Cadência de tiro
    setTimeout(() => { podeAtirar = true; }, armas[armaAtual].cadencia);
}
