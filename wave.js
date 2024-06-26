function simulateWaveFunction(amplitude, frequency, phase, points) {
  const wavePoints = [];
  const step = (2 * Math.PI) / points;
  console.log(amplitude);
  for (let i = 0; i < points; i++) {
    const x = i * step;
    const y = amplitude * Math.sin(frequency * x + phase);
    wavePoints.push({ x: x, y: y });
  }
  console.log(wavePoints);
  return wavePoints;
}

function draw(
  amplitude,
  frequency,
  phase,
  points,
  size,
  opacity,
  red = 0,
  green = 0,
  blue = 0
) {
  const canvas = document.getElementById("waveCanvas");
  const ctx = canvas.getContext("2d");
  const waveData = simulateWaveFunction(amplitude, frequency, phase, points);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`;

  const scaleFactor = canvas.width / (2 * Math.PI); // Scale factor based on canvas width

  waveData.forEach((point) => {
    const x = point.x * scaleFactor;
    const y = point.y + canvas.height / 2; // Center the wave vertically
    ctx.fillRect(x, y, size, size);
  });
}

// Update all values from the sliders

const controlsConfig = [
  { id: "amplitude", min: 0, max: 10000, step: 100, value: 470 },
  { id: "frequency", min: 0, max: 9770, step: 50, value: 2 },
  { id: "phase", min: 0, max: 6.283, step: 0.1, value: 0, unit: " rad" },
  { id: "points", min: 100, max: 10000, step: 100, value: 2000 },
  { id: "size", min: 1, max: 100, step: 1, value: 10, unit: " px" },
  { id: "opacity", min: 1, max: 100, step: 1, value: 33, unit: "%" },
  { id: "red", min: 0, max: 100, step: 1, value: 100, unit: "%" },
  { id: "green", min: 0, max: 100, step: 1, value: 100, unit: "%" },
  { id: "blue", min: 0, max: 100, step: 1, value: 100, unit: "%" },
];

window.onload = function () {
  const controlsContainer = document.getElementById("controls");
  controlsConfig.forEach((config) => {
    const control = new Control(config);
    control.init(controlsContainer);
  });
  updateWave(); // Draw initial wave
};

function updateWave() {
  // Use the current values in session storage or sliders to redraw the wave
  draw(
    +sessionStorage.getItem("amplitude"),
    +sessionStorage.getItem("frequency"),
    +sessionStorage.getItem("phase"),
    +sessionStorage.getItem("points"),
    +sessionStorage.getItem("size"),
    +sessionStorage.getItem("opacity"),
    Math.round(sessionStorage.getItem("red") * 2.55),
    Math.round(sessionStorage.getItem("green") * 2.55),
    Math.round(sessionStorage.getItem("blue") * 2.55)
  );
}

class Control {
  constructor({ id, min, max, step, value, unit = "", type = "range" }) {
    this.id = id;
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = value;
    this.unit = unit;
    this.type = type;
    this.slider = null;
    this.valueDisplay = null;
  }

  init(container) {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.htmlFor = this.id;
    label.textContent = `${
      this.id.charAt(0).toUpperCase() + this.id.slice(1)
    }: `;

    this.valueDisplay = document.createElement("span");
    this.valueDisplay.id = `${this.id}-value`;
    this.valueDisplay.textContent = this.value + this.unit;

    this.slider = document.createElement("input");
    this.slider.type = this.type;
    this.slider.id = this.id;
    this.slider.min = this.min;
    this.slider.max = this.max;
    this.slider.step = this.step;
    this.slider.value = this.value;

    wrapper.appendChild(label);
    label.appendChild(this.valueDisplay);
    wrapper.appendChild(this.slider);
    container.appendChild(wrapper);

    this.slider.addEventListener("input", () => {
      this.updateValue();
    });
  }

  updateValue() {
    const value = this.slider.value;
    this.valueDisplay.textContent = value + this.unit;
    sessionStorage.setItem(this.id, value);
    updateWave(); // Assuming a global function to update the canvas
  }
}
