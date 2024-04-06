import * as CANNON from "cannon";
import * as THREE from "three";
import { createParticle } from "./particle.js";

export default class Universe {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.particles = []; // Array to hold both visual and physical representations

    // Listen for collisions
    this.world.addEventListener("collide", (event) =>
      this.handleCollision(event)
    );
  }

  initializeBigBang(numberOfParticles) {
    const origin = { x: 0, y: 0, z: 0 }; // Central point of the Big Bang
    for (let i = 0; i < numberOfParticles; i++) {
      // Generate a random direction
      let direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      // Optional: Vary the speed
      const speed = Math.random() * 5 + 1; // Random speed between 1 and 6
      let velocity = {
        x: direction.x * speed,
        y: direction.y * speed,
        z: direction.z * speed,
      };

      // Create the particle at the origin with the computed velocity
      this.addParticle({
        position: origin,
        velocity: velocity,
        mass: 1, // Example mass
        radius: 0.1, // Example radius
        color: 0xff0000, // Example color
      });
    }
  }

  addParticle(options) {
    // Use the createParticle function to add a new particle
    const { mesh, body } = createParticle(this.scene, this.world, options);

    this.particles.push({ mesh, body });
  }

  handleCollision(event) {
    const { bodyA, bodyB } = event;

    // Example collision handling: log collisions
    console.log("Collision detected between", bodyA, "and", bodyB);

    // Implement logic for merging particles, splitting, or other interactions here
  }

  update() {
    // Iterate through all particles and update their mesh positions to match the body positions

    // Update mesh positions to match body positions
    this.particles.forEach(({ mesh, body }) => {
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
    });
  }

  updateForces() {
    const G = 6.6743e-11; // Gravitational constant
    const k = 8.9875517873681764 * Math.pow(10, 9); // Coulomb's constant

    this.particles.forEach(({ body: body1 }, index) => {
      for (let i = index + 1; i < this.particles.length; i++) {
        const { body: body2 } = this.particles[i];

        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const dz = body2.position.z - body1.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Gravitational force calculation
        const forceMagnitudeG =
          (G * body1.mass * body2.mass) / (distance * distance);

        // Electromagnetic force calculation (assuming charges are present on body1 and body2)
        const forceMagnitudeE =
          (k * (body1.charge * body2.charge)) / (distance * distance);

        // Combined force calculation
        const forceDirection = new CANNON.Vec3(
          dx / distance,
          dy / distance,
          dz / distance
        );
        const forceG = forceDirection.scale(forceMagnitudeG);
        const forceE = forceDirection.scale(forceMagnitudeE);
        const totalForce = forceG.vadd(forceE); // Vector addition of gravitational and electromagnetic forces

        body1.applyForce(totalForce, new CANNON.Vec3(0, 0, 0));
        body2.applyForce(totalForce.scale(-1), new CANNON.Vec3(0, 0, 0));
      }
    });
  }
}
