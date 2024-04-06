import * as CANNON from "cannon";

export const initPhysics = () => {
  // Create a new physics world
  const world = new CANNON.World();

  // Set the gravity for the world (e.g., Earth gravity in the negative y direction)
  world.gravity.set(0, 0, 0);

  // Use the NaiveBroadphase algorithm for collision detection
  world.broadphase = new CANNON.NaiveBroadphase();

  // Improve performance and realism of resting contacts
  world.solver.iterations = 10;
  world.solver.tolerance = 0.001;

  // Define a default material with friction and restitution (bounce)
  const defaultMaterial = new CANNON.Material("defaultMaterial");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7, // A bit bouncy
    }
  );

  // Apply the default contact material to the world
  world.addContactMaterial(defaultContactMaterial);
  world.defaultContactMaterial = defaultContactMaterial;

  return world;
};
