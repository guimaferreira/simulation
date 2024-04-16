import { GUI } from "dat.gui";
import { updateWave } from "./wave.js";

export let params = {
  amplitude: 5,
  frequency: 0.2,
  phase: 0,
  time: 0,
  speed: 0.01,
  play: false,
};

function saveParams() {
  localStorage.setItem("waveParams", JSON.stringify(params));
  console.log("Parameters saved to localStorage.");
}

export function setupGUI() {
  const gui = new GUI();

  gui.add(params, "amplitude", 1, 10).onChange(() => {
    updateWave();
    saveParams();
  });
  gui.add(params, "frequency", 0.05, 1).onChange(() => {
    updateWave();
    saveParams();
  });
  gui.add(params, "phase", 0, Math.PI * 2).onChange(() => {
    updateWave();
    saveParams();
  });
  gui
    .add(params, "time", 0, 1000)
    .step(0.1)
    .listen()
    .onChange(() => {
      updateWave();
      saveParams();
    });
  gui.add(params, "speed", 0.001, 0.1).onChange(saveParams);
  gui
    .add(params, "play")
    .name("Play/Pause")
    .onChange(() => {
      updateWave(); // Assuming you might want to update the wave when toggling play/pause
      saveParams();
      console.log("Play/Pause toggled");
    });
}

// Load parameters from localStorage if available
export function loadParams() {
  const savedParams = localStorage.getItem("waveParams");
  if (savedParams) {
    Object.assign(params, JSON.parse(savedParams));
    console.log("Parameters loaded from localStorage.");
  }

  return params;
}
