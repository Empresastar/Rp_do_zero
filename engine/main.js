import * as THREE from 'three';
import { scene } from './state.js';
import { camera, movePlayer } from './player.js';
import { updateVehicle, isInsideVehicle, spawnCar } from './vehicle.js';
import './world.js';
import './combat.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

spawnCar(-10, -10);

function animate() {
    requestAnimationFrame(animate);
    if (isInsideVehicle) updateVehicle();
    else movePlayer();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
