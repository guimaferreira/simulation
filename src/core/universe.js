import * as CANNON from "cannon";
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
    const center = { x: 0, y: 0, z: 0 }; // Central point of the Big Bang
    for (let i = 0; i < numberOfParticles; i++) {
      // Generate random positions around the center
      let position = {
        x: (Math.random() - 0.5) * 10, // Spread particles around the center
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
      };

      // Calculate direction vector from the center to the particle's position
      let direction = {
        x: position.x - center.x,
        y: position.y - center.y,
        z: position.z - center.z,
      };

      // Normalize the direction
      let magnitude = Math.sqrt(
        direction.x ** 2 + direction.y ** 2 + direction.z ** 2
      );
      let normalizedDirection = {
        x: direction.x / magnitude,
        y: direction.y / magnitude,
        z: direction.z / magnitude,
      };

      // Assign velocity based on direction (magnitude can be based on distance from center or random)
      let velocity = {
        x: normalizedDirection.x * (Math.random() * 5 + 1), // Random velocity magnitude
        y: normalizedDirection.y * (Math.random() * 5 + 1),
        z: normalizedDirection.z * (Math.random() * 5 + 1),
      };

      // Create the particle with initial position and velocity
      this.addParticle({
        position: position,
        velocity: velocity, // Ensure your particle creation can handle velocity
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
