import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  return controls;
}
