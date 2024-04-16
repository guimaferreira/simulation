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

// Camera initial setup
camera.position.set(50, 50, 80);
camera.lookAt(new THREE.Vector3(25, 0, 25));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Geometry and Material
let geometry = new THREE.BufferGeometry();
const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
let points = new THREE.Points(geometry, material);
scene.add(points);

// Simulation parameters
const params = {
  amplitude: 5,
  frequency: 0.2,
  phase: 0,
  time: 0,
  speed: 0.01,
  play: false,
};

function updatePoints() {
  let vertices = [];
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      vertices.push(i, 0, j);
    }
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry = geometry.clone();
  scene.remove(points);
  points = new THREE.Points(geometry, material);
  scene.add(points);
}

function updateWave() {
  if (geometry.attributes.position) {
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      positions[i + 1] =
        params.amplitude *
        Math.sin(params.frequency * (x + z + params.time) + params.phase);
    }
    geometry.attributes.position.needsUpdate = true;
  }
  renderer.render(scene, camera);
}

// GUI setup
const gui = new GUI();
gui.add(params, "amplitude", 1, 10).onChange(updateWave);
gui.add(params, "frequency", 0.05, 1).onChange(updateWave);
gui.add(params, "phase", 0, Math.PI * 2).onChange(updateWave);
gui.add(params, "time", 0, 1000).step(0.1).listen().onChange(updateWave);
gui.add(params, "speed", 0.001, 0.1);
gui.add(params, "play").name("Play/Pause");

function animate() {
  requestAnimationFrame(animate);
  if (params.play) {
    params.time += params.speed;
    updateWave();
  }
  controls.update();
  renderer.render(scene, camera);
}

updatePoints();
animate();
