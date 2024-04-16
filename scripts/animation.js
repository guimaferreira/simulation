import * as THREE from "three";
import { scene, camera, renderer } from "./sceneSetup.js";
import { createPoints } from "./geometry.js";
import { setupGUI, loadParams } from "./gui.js";
import { createControls } from "./controls.js";
import { updateWave } from "./wave.js"; // Assuming wave update functions are also externalized
import { saveSettings, loadSettings } from "./storage.js";

export const points = createPoints(
  new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 })
);
scene.add(points);
const controls = createControls(camera, renderer);

let params = loadParams();
loadSettings(camera, params);
// Load settings

export function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

setupGUI(params, updateWave);
animate();
