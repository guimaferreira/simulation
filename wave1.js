let random;
let input;
// const birthday = [0.6232269641761368, 0.18189242240200354, 0.15374882066499196];
// const birthday = [2024, 4, 14];
// const birthday = [1989, 12, 6];
// const multiplier = 0.0666;
// const matrix = [Math.random(), Math.random(), Math.random()];

const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");
let offsetX = 0,
  offsetY = 0,
  scale = 1;
let isDragging = false,
  lastX = 0,
  lastY = 0;

function calculateWavePoints(input) {
  const wavePoints = [];
  const step = (2 * Math.PI) / input.points;

  for (let i = 0; i < input.points; i++) {
    let random = (input.entropy * i * input.phase) / input.points / 100;
    const x = round(i * step);
    const y = round(
      input.amplitude * Math.sin(input.frequency * x + input.phase)
    );
    const a = Math.abs(round(1 - Math.abs(y) / input.amplitude));
    const r = round(255 * random * Math.random(), 0);
    const g = round(255 * random * Math.random(), 0);
    const b = round(255 * random * Math.random(), 0);
    wavePoints.push({ x, y, r, g, b, a });
  }

  return wavePoints;
}

function draw(input) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scaleFactor = canvas.width / (2 * Math.PI);
  const wavePoints = [];
  const step = (2 * Math.PI) / input.points;

  for (let i = 0; i < input.points; i++) {
    let random = (input.entropy * i * input.phase) / input.points / 100;
    const x = round(i * step);
    const y = round(
      input.amplitude * Math.sin(input.frequency * x + input.phase)
    );
    const a = Math.abs(round(1 - Math.abs(y) / input.amplitude));
    const r = round(255 * random * Math.random(), 0);
    const g = round(255 * random * Math.random(), 0);
    const b = round(255 * random * Math.random(), 0);
    wavePoints.push({ x, y, r, g, b, a });
  }

  wavePoints.forEach((point) => {
    const { x, y, r, g, b, a } = point;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${
      a * input.opacity * input.opacity
    })`;
    ctx.fillRect(
      (x * scaleFactor + offsetX) * scale,
      Math.round((y + canvas.height / 2 + offsetY) * scale),
      input.size * scale,
      input.size * scale
    );
  });
}

function round(value, p = precision) {
  const newValue = value + value * random;
  return parseFloat(newValue.toFixed(p));
}

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    offsetX += e.offsetX - lastX;
    offsetY += e.offsetY - lastY;
    lastX = e.offsetX;
    lastY = e.offsetY;
    draw(input);
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  scale *= e.deltaY > 0 ? 0.9 : 1.1;
  draw(input);
});

// Touch events for mobile users
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  isDragging = true;
  lastX = touch.pageX;
  lastY = touch.pageY;
  e.preventDefault();
});

canvas.addEventListener("touchmove", (e) => {
  if (isDragging && e.touches.length == 1) {
    // Single touch interaction
    const touch = e.touches[0];
    offsetX += touch.pageX - lastX;
    offsetY += touch.pageY - lastY;
    lastX = touch.pageX;
    lastY = touch.pageY;
    draw(input);
  }
  e.preventDefault();
});

canvas.addEventListener("touchend", () => {
  isDragging = false;
});

// Update all values from the sliders
function updateValues() {
  document.getElementById("amplitude-value").textContent =
    amplitudeSlider.value;
  document.getElementById("frequency-value").textContent =
    frequencySlider.value;
  document.getElementById("phase-value").textContent = phaseSlider.value;
  document.getElementById("points-value").textContent = pointsSlider.value;
  document.getElementById("size-value").textContent = sizeSlider.value;
  document.getElementById("opacity-value").textContent = opacitySlider.value;

  document.getElementById("precision-value").textContent =
    precisionSlider.value;
  document.getElementById("entropy-value").textContent = entropySlider.value;

  sessionStorage.setItem("amplitude", amplitudeSlider.value);
  sessionStorage.setItem("frequency", frequencySlider.value);
  sessionStorage.setItem("phase", phaseSlider.value);
  sessionStorage.setItem("points", pointsSlider.value);
  sessionStorage.setItem("size", sizeSlider.value);
  sessionStorage.setItem("opacity", opacitySlider.value);

  sessionStorage.setItem("precision", precisionSlider.value);
  sessionStorage.setItem("entropy", entropySlider.value);

  input = {
    amplitude: +amplitudeSlider.value,
    frequency: +frequencySlider.value,
    phase: +phaseSlider.value,
    points: +pointsSlider.value,
    size: +sizeSlider.value,
    opacity: +opacitySlider.value,
    precision: +precisionSlider.value,
    entropy: +entropySlider.value,
  };
}

// Initialize and add listeners to sliders
const amplitudeSlider = document.getElementById("amplitude");
const frequencySlider = document.getElementById("frequency");
const phaseSlider = document.getElementById("phase");
const pointsSlider = document.getElementById("points");
const sizeSlider = document.getElementById("size");
const opacitySlider = document.getElementById("opacity");

const precisionSlider = document.getElementById("precision");
const entropySlider = document.getElementById("entropy");

[
  amplitudeSlider,
  frequencySlider,
  phaseSlider,
  pointsSlider,
  sizeSlider,
  opacitySlider,

  precisionSlider,
  entropySlider,
].forEach((slider) => {
  slider.addEventListener("input", updateValues);
});

// Set initial values from session storage
function setSliderValues() {
  const sliderNames = [
    "amplitude",
    "frequency",
    "phase",
    "points",
    "size",
    "opacity",

    "precision",
    "entropy",
  ];
  sliderNames.forEach((name) => {
    let value = sessionStorage.getItem(name);
    if (value !== null) {
      let slider = document.getElementById(name);
      slider.value = value;
      document.getElementById(name + "-value").textContent = value;
    }
  });
}

window.onload = function () {
  setSliderValues();
  updateValues(); // Draw initial wave
  console.log(input);
  draw(input);
};
