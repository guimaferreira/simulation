const WaveFunction = require("./src/WaveFunction");

window.onload = function () {
  // console.log("Wave1_v0.js loaded");
  const pointsExp = 3;
  const zoomFactor = 0.05;
  let random;
  let particles = [];
  let input;
  const canvas = document.getElementById("waveCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  let offsetX = 0,
    offsetY = 0,
    scale = 1;

  let isDragging = false,
    lastX = 0,
    lastY = 0;
  const { width, height } = canvas;
  let center = [width / 2, height / 2];
  let currentCenter = center;
  let area = [0, 0, width, height];
  let matrixArea = Array.from(area);

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
      currentCenter = [center[0] + offsetX, center[1] + offsetY];
      setArea();
    }
  });

  function calculateArea(scale) {
    const [x, y] = currentCenter;

    // Calculate the width and height of the area based on the scale
    const scaledWidth = (width * scale) / 100;
    const scaledHeight = (height * scale) / 100;

    // Calculate the starting (top-left) and ending (bottom-right) points of the rectangle
    const fromX = x - scaledWidth / 2;
    const fromY = y - scaledHeight / 2;
    const toX = x + scaledWidth / 2;
    const toY = y + scaledHeight / 2;

    return [fromX, fromY, toX, toY];
  }

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  function setArea(matrix) {
    matrixArea = matrix;
    const [fromX, fromY, toX, toY] = calculateArea(input.scale);

    area = { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } };
    // console.log("Area", area);
    draw(particles, input, area);
  }

  function crop(particles) {
    const { from = { x: 0, y: 0 }, to = { x: 100, y: 100 } } = area;
    return particles.filter((point) => {
      return (
        point.x >= from.x &&
        point.x <= to.x &&
        point.y >= from.y &&
        point.y <= to.y
      );
    });
  }

  function draw(particles, input) {
    console.time("Drawing");
    const { size, opacity, scale } = input;

    const areaOfInterest = [
      0 + offsetX,
      0 + offsetY, // Adjust y-coordinate to be centered based on the height
      width + offsetX,
      height + offsetY,
    ];
    const fixedArea = [
      areaOfInterest[0] - offsetX,
      areaOfInterest[1] - offsetY,
      areaOfInterest[2] - offsetX,
      areaOfInterest[3] - offsetY,
    ];

    console.log("Area of interest", areaOfInterest);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let rendered = 0;

    // ctx.fillStyle = `rgba(0, 255, 0, 0.1)`;
    // ctx.fillRect(...fixedArea);

    let cluster = {};
    console.time("Draw");
    particles.forEach((point) => {
      const { x, y, r, g, b, a } = point;

      const newX = x + offsetX;
      const newY = y + offsetY + height / 2;

      function isInside() {
        return (
          x >= fixedArea[0] &&
          y >= fixedArea[1] - height / 2 &&
          x <= fixedArea[2] &&
          y <= fixedArea[3] - height / 2
        );
      }

      function isBlack(r, g, b) {
        return r === 0 && g === 0 && b === 0;
      }

      // Only draw particles within the area boundaries
      if (
        isInside() &&
        a > 0 && //  Don't calculate alpha 0 particles
        !isBlack(r, g, b) // Don't draw black particles
      ) {
        point.cluster = [Math.ceil(newX), Math.ceil(newY)];

        if (cluster[point.cluster[0]]) {
          cluster[point.cluster[0]][point.cluster[1]] =
            (cluster[point.cluster[0]][point.cluster[1]] || 0) + 1;

          return;
        } else {
          cluster[point.cluster[0]] = {
            [point.cluster[1]]: 1,
          };
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * opacity * opacity})`;
        ctx.fillRect(
          point.cluster[0], //translatedX + offsetX * scale,
          point.cluster[1], //translatedY + offsetY * scale + height / 2, // Adjust y-coordinate to be centered based on the height
          size,
          size
        );
        rendered++;
      }
    });
    console.timeEnd("Drawing");
    console.log("Rendered", rendered);
    console.timeEnd("Draw");
  }

  // Update all values from the sliders
  function updateValues() {
    document.getElementById("amplitude-value").textContent =
      amplitudeSlider.value;
    document.getElementById("frequency-value").textContent =
      frequencySlider.value;
    document.getElementById("phase-value").textContent = phaseSlider.value;
    document.getElementById("points-value").textContent =
      pointsSlider.value ** pointsExp;
    document.getElementById("size-value").textContent = sizeSlider.value;
    document.getElementById("opacity-value").textContent = opacitySlider.value;

    document.getElementById("precision-value").textContent =
      precisionSlider.value;
    document.getElementById("entropy-value").textContent = entropySlider.value;
    document.getElementById("scale-value").textContent = scaleSlider.value;

    sessionStorage.setItem("amplitude", amplitudeSlider.value);
    sessionStorage.setItem("frequency", frequencySlider.value);
    sessionStorage.setItem("phase", phaseSlider.value);
    sessionStorage.setItem("points", pointsSlider.value);
    sessionStorage.setItem("size", sizeSlider.value);
    sessionStorage.setItem("opacity", opacitySlider.value);

    sessionStorage.setItem("precision", precisionSlider.value);
    sessionStorage.setItem("entropy", entropySlider.value);
    sessionStorage.setItem("scale", scaleSlider.value);

    input = {
      amplitude: +amplitudeSlider.value,
      frequency: +frequencySlider.value,
      phase: +phaseSlider.value,
      points: +pointsSlider.value,
      size: +sizeSlider.value,
      opacity: +opacitySlider.value,
      precision: +precisionSlider.value,
      entropy: +entropySlider.value,
      scale: +scaleSlider.value,
    };

    particles = WaveFunction(input);

    const newArea = calculateArea(input.scale);
    // console.log("New Area", newArea);
    setArea(newArea);
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
  const scaleSlider = document.getElementById("scale");

  [
    amplitudeSlider,
    frequencySlider,
    phaseSlider,
    pointsSlider,
    sizeSlider,
    opacitySlider,
    precisionSlider,
    entropySlider,
    scaleSlider,
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
      "scale",
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
  setSliderValues();
  updateValues(); // Draw initial wave

  // canvas.addEventListener("wheel", (e) => {
  //   e.preventDefault();
  //   scale *= e.deltaY > 0 ? 0.9 : 1.1;
  //   console.log("wheel", scale);
  //   draw(particles, input);
  // });

  // Helper function to calculate new area based on zoom
  // canvas.addEventListener("wheel", (e) => {
  //   e.preventDefault();
  //   console.log("Current scale before adjustment:", scale, "deltaY:", e.deltaY);

  //   if (e.deltaY < 0) {
  //     // Zoom in: Decrease the scale
  //     scale *= -1 + zoomFactor;
  //   } else {
  //     // Zoom out: Increase the scale
  //     scale *= 1 + zoomFactor;
  //   }

  //   console.log("New scale after adjustment:", scale);

  //   const newArea = calculateArea(scale);
  //   setArea(newArea);
  // });

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
      draw(particles, input);
    }
    e.preventDefault();
  });

  canvas.addEventListener("touchend", () => {
    isDragging = false;
  });
};
