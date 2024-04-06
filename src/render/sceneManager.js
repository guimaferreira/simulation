import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const initScene = () => {
  // Create the scene
  const scene = new THREE.Scene();

  // Add some ambient light
  const ambientLight = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambientLight);

  // Add a directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Create the camera
  const camera = new THREE.PerspectiveCamera(
    75, // FOV
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near plane
    1000 // Far plane
  );

  camera.position.z = 25; // Move the camera back a bit so we can see the scene

  // Create the renderer and attach it to our document
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("universeCanvas"),
    antialias: true, // Enable antialiasing for smoother edges
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create the controls and attach them to the camera and renderer
  const controls = new OrbitControls(camera, renderer.domElement);

  // Set up some sensible defaults for the controls.
  controls.enableDamping = true; // Enable inertia
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2; // Prevent the camera from going below the ground
  controls.touchZoom = true; // Enable zooming with pinch gesture
  controls.touchRotate = true; // Enable rotation with touch

  document.body.appendChild(renderer.domElement);

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, controls };
};
