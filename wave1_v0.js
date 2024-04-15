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

  function waveFunction(input) {
    const { amplitude, frequency, phase, points, precision, entropy } = input;
    function round(value, p = precision) {
      const newValue = value + value * random;
      return parseFloat(newValue.toFixed(p));
    }

    const totalPoints = points ** pointsExp;

    const particles = [];
    const step = (2 * Math.PI) / totalPoints; // * (width - 100);
    // console.log({ entropy, random, precision });
    for (let i = 0; i < totalPoints; i++) {
      random = (entropy * phase * i) / totalPoints + 1;

      const x = round(i * step * random);
      const y = round(amplitude * Math.sin(frequency * x + phase));
      const a = 1 - Math.abs(y) / 2 / amplitude / 100; // Alpha value based on amplitude
      const r = round((255 * Math.random()) / random, 0);
      const g = round((255 * Math.random()) / random, 0);
      const b = round((255 * Math.random()) / random, 0);
      const particle = { x, y, r, g, b, a };
      particles.push(particle);
    }
    // console.log("Last Random", random, particles[particles.length - 1]);
    return particles;
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
    const { size, opacity, scale } = input;

    const { from, to } = area;
    const areaWidth = to.x - from.x;
    const areaHeight = to.y - from.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleFactorX = canvas.width / areaWidth; // Adjust scale factor based on area width
    const scaleFactorY = canvas.height / areaHeight; // Adjust scale factor based on area height

    let rendered = 0;

    const centerSize = 1 * scale;
    const centerHalf = centerSize / 2;

    ctx.fillStyle = `rgba(0, 255, 0, 0.1)`;
    ctx.fillRect(
      currentCenter[0] - centerHalf,
      currentCenter[1] - centerHalf, // Adjust y-coordinate to be centered based on the height
      centerSize,
      centerSize
    );

    let cluster = {};

    particles.forEach((point) => {
      const { x, y, r, g, b, a } = point;

      // Translate and scale particle positions relative to the area area
      const translatedX = (x - from.x) * scaleFactorX;
      const translatedY = (y - from.y) * scaleFactorY;

      const newX = translatedX + offsetX;
      const newY = translatedY + offsetY + height / 2;
      // ctx.globalCompositeOperation = "soft-light";

      // console.log({ newX, newY, x, y, from, to, areaWidth, areaHeight });

      function isInside(x, y, from, to) {
        return x >= from.x && x <= to.x && y >= from.y && y <= to.y;
      }

      function isBlack(r, g, b) {
        return r === 0 && g === 0 && b === 0;
      }

      // Only draw particles within the area boundaries
      if (
        isInside(x, y, from, to) &&
        a > 0 && //  Don't calculate alpha 0 particles
        !isBlack(r, g, b) // Don't draw black particles
      ) {
        point.cluster = [Math.round(newX), Math.round(newY)];

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
    console.log("Rendered", rendered);
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

    particles = waveFunction(input);

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
