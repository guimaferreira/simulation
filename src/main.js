import { initScene } from "./render/sceneManager.js";
import { initPhysics } from "./physics/physicsEngine.js";
import Universe from "./core/universe.js"; // Ensure this path is correct
import "../assets/styles/style.css";

const particleCount = 500;

document.addEventListener("DOMContentLoaded", () => {
  // Globals
  let scene, camera, renderer, world;
  let lastTime;
  let universe;
  let controls; // Add this near your other global declarations

  const init = () => {
    // Initialize the scene and physics world
    ({ scene, camera, renderer, controls } = initScene());
    world = initPhysics();

    // Create the Universe instance
    universe = new Universe(scene, world); // Assuming Universe takes scene and world as args

    // Create an initial particle to start the simulation
    // Assuming createParticle is now a method of Universe class or managed internally by Universe
    // universe.addParticle({
    //   mass: 1,
    //   position: { x: 0, y: 0, z: 0 },
    //   radius: 1,
    //   color: 0xff0000,
    // });

    // Start the animation loop
    lastTime = new Date().getTime();
    animate();
  };

  const animate = () => {
    requestAnimationFrame(animate);

    let time = new Date().getTime();
    let delta = (time - lastTime) / 1000;
    lastTime = time;

    // Update physics through the universe instance
    universe.updateForces(delta); // Assuming you have or will add this method

    world.step(delta);
    universe.update();

    // Render scene
    renderer.setPixelRatio(window.devicePixelRatio);

    // Update the controls each frame
    controls.update();

    renderer.render(scene, camera);
  };

  init();
  document.querySelector("#startSimulation").addEventListener("click", () => {
    universe.initializeBigBang(particleCount); // Initialize with 100 particles, for example
  });
});
