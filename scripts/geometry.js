import * as THREE from "three";

export function createPoints(material) {
  let geometry = new THREE.BufferGeometry();
  updatePoints(geometry); // Initially populate geometry
  return new THREE.Points(geometry, material);
}

export function updatePoints(geometry) {
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
