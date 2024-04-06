import * as CANNON from "cannon";
import { createParticle } from "./particle.js";

export default class Universe {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.particles = []; // Array to hold both visual and physical representations
  }

  addParticle(options) {
    // Use the createParticle function to add a new particle
    const { mesh, body } = createParticle(this.scene, this.world, options);
    this.particles.push({ mesh, body });
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
    this.particles.forEach(({ body: body1 }, index) => {
      for (let i = index + 1; i < this.particles.length; i++) {
        const { body: body2 } = this.particles[i];
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const dz = body2.position.z - body1.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const forceMagnitude =
          (G * body1.mass * body2.mass) / (distance * distance);
        const forceDirection = new CANNON.Vec3(
          dx / distance,
          dy / distance,
          dz / distance
        );
        const force = forceDirection.scale(forceMagnitude);
        body1.applyForce(force, new CANNON.Vec3(0, 0, 0));
        body2.applyForce(force.scale(-1), new CANNON.Vec3(0, 0, 0));
      }
    });
  }
}
