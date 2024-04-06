import * as THREE from "three";
import * as CANNON from "cannon";

export const createParticle = (scene, world, options = {}) => {
  const {
    mass = 1, // Default mass of 1
    position = { x: 0, y: 0, z: 0 }, // Default position at the origin
    velocity = { x: 0, y: 0, z: 0 }, // Default velocity
    radius = 1, // Default radius of the particle
    color = 0xff0000, // Default color red
  } = options;

  // Three.js visual representation
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshLambertMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  scene.add(mesh);

  // Cannon.js physical representation
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({ mass: mass });
  body.addShape(shape);

  body.position.set(position.x, position.y, position.z);
  body.velocity.set(velocity.x, velocity.y, velocity.z);
  world.addBody(body);

  // Return both representations for further use
  return { mesh, body };
};
