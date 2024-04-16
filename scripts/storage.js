// storage.js

export function saveSettings(camera, params) {
  const cameraSettings = {
    position: camera.position.toArray(),
    rotation: camera.rotation.toArray(),
  };
  localStorage.setItem("cameraSettings", JSON.stringify(cameraSettings));
  localStorage.setItem("waveParams", JSON.stringify(params));
}

export function loadSettings(camera, params) {
  const savedCamera = localStorage.getItem("cameraSettings");
  const savedParams = localStorage.getItem("waveParams");

  if (savedCamera) {
    const cameraSettings = JSON.parse(savedCamera);
    camera.position.fromArray(cameraSettings.position);
    camera.rotation.fromArray(cameraSettings.rotation);
  }

  if (savedParams) {
    const loadedParams = JSON.parse(savedParams);
    Object.assign(params, loadedParams); // Update params with loaded values
  }
}
