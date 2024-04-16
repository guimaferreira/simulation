import * as THREE from "three";
import { scene } from "./sceneSetup.js";
import { params } from "./gui.js";

// Define and add points geometry once
let geometry = new THREE.BufferGeometry();
let material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
let points = new THREE.Points(geometry, material);
scene.add(points);

// Initialize points geometry
export function initPoints() {
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
}

// Update the wave based on params
export function updateWave() {
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

initPoints();
