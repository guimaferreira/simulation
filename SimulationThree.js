import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load camera position from localStorage
const savedCameraPosition = JSON.parse(localStorage.getItem("cameraPosition"));
if (savedCameraPosition) {
  camera.position.set(
    savedCameraPosition.x,
    savedCameraPosition.y,
    savedCameraPosition.z
  );
} else {
  camera.position.set(50, 50, 80);
}
camera.lookAt(new THREE.Vector3(25, 0, 25));

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Save camera position on movement
controls.addEventListener("change", () => {
  localStorage.setItem("cameraPosition", JSON.stringify(camera.position));
});

// Grid and wave parameters
let gridX = 50;
let gridY = 50;
const spacing = 1;
let geometry = new THREE.BufferGeometry();
const material = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: parseFloat(localStorage.getItem("pointSize") || 1),
});
let points = new THREE.Points(geometry, material);
scene.add(points);

const params = {
  amplitude: parseFloat(localStorage.getItem("amplitude") || 5),
  frequency: parseFloat(localStorage.getItem("frequency") || 0.2),
  phase: parseFloat(localStorage.getItem("phase") || 0),
  points: parseInt(localStorage.getItem("points") || 50),
  pointSize: parseFloat(localStorage.getItem("pointSize") || 1),
  entropy: parseFloat(localStorage.getItem("entropy") || 0),
};

function updatePoints() {
  let vertices = [];
  for (let i = 0; i < gridX; i++) {
    for (let j = 0; j < gridY; j++) {
      vertices.push(i * spacing, 0, j * spacing);
    }
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry = geometry.clone(); // This is necessary to force update
  scene.remove(points);
  points = new THREE.Points(geometry, material);
  scene.add(points);
  updateWave(); // Update the wave immediately after updating points
}

function updateWave() {
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 2];
    positions[i + 1] =
      params.amplitude *
      Math.sin(
        params.frequency * (x + z) +
          params.phase +
          Math.random() * params.entropy
      );
  }
  geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

// GUI setup
const gui = new GUI();
gui.add(params, "amplitude", 1, 10).onChange((value) => {
  params.amplitude = value;
  localStorage.setItem("amplitude", value);
  updateWave();
});
gui.add(params, "frequency", 0.05, 1).onChange((value) => {
  params.frequency = value;
  localStorage.setItem("frequency", value);
  updateWave();
});
gui.add(params, "phase", 0, Math.PI * 2).onChange((value) => {
  params.phase = value;
  localStorage.setItem("phase", value);
  updateWave();
});
gui
  .add(params, "points", 0, 100)
  .step(1)
  .onChange((value) => {
    value = value * value;
    gridX = value;
    gridY = value;
    localStorage.setItem("points", value);
    updatePoints();
  });
gui.add(params, "pointSize", 0.01, 1).onChange((value) => {
  material.size = value;
  localStorage.setItem("pointSize", value);
  updateWave();
});
gui.add(params, "entropy", 0, 5).onChange((value) => {
  params.entropy = value;
  localStorage.setItem("entropy", value);
  updateWave();
});

// Initial rendering of the scene
updatePoints();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
