import * as THREE from 'three';
import { scene } from './state.js';
import { camera, movePlayer } from './player.js';
import './world.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(5, 10, 7.5);
scene.add(sun);

function animate() {
    requestAnimationFrame(animate);
    movePlayer();
    renderer.render(scene, camera);
}
animate();
