window.onload = function () {
  const zoomFactor = 0.05;
  let random;
  let particles = [];
  let input;
  let area;
  let partcilesOfInterst = [];
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
  console.log({ width, height });

  function setArea(matrix) {
    const [fromX, fromY, toX, toY] = matrix;
    console.log("Area", matrix);
    area = { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } };
    // if (scale !== input.scale) {
    //   scale = input.scale;
    //   const scaleFactor = 1 + input.scale * zoomFactor;
    //   area = newArea = calculateArea(scaleFactor);
    // }
    draw(particles, input, area);
  }

  function waveFunction(input) {
    const {
      amplitude,
      frequency,
      phase,
      points,
      size,
      opacity,
      precision,
      entropy,
    } = input;
    function round(value, p = precision) {
      const newValue = value + value * random;
      return parseFloat(newValue.toFixed(p));
    }

    const particles = [];
    const step = ((2 * Math.PI) / points) * (width - 100);
    // console.log({ entropy, random, precision });
    for (let i = 0; i < points; i++) {
      random = (entropy * i * phase) / points / 100 + 1;

      const x = round(i * step);
      const y =
        round(amplitude * Math.sin(frequency * x + phase)) + amplitude * 2;
      const a = Math.abs(round(1 - Math.abs(y) / amplitude)); // Alpha value based on amplitude
      const r = round(255 * random * Math.random(), 0);
      const g = round(255 * random * Math.random(), 0);
      const b = round(255 * random * Math.random(), 0);
      const particle = { x, y, r, g, b, a };
      particles.push(particle);
    }
    console.log("Last Random", random, particles[particles.length - 1]);
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

  function calculateArea(scale) {
    const centerX = (area.from.x + area.to.x) / 2;
    const centerY = (area.from.y + area.to.y) / 2;
    const width = (area.to.x - area.from.x) / scale;
    const height = (area.to.y - area.from.y) / scale;
    return [
      centerX - width / 2,
      centerY - height / 2,
      centerX + width / 2,
      centerY + height / 2,
    ];
  }

  function draw(particles, input) {
    const { size, opacity, scale } = input;
    if (!area) {
      setArea([0, 0, canvas.width, canvas.height]);
    }

    // particles = crop(particles, area);

    const { from, to } = area;
    const areaWidth = to.x - from.x;
    const areaHeight = to.y - from.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleFactorX = canvas.width / areaWidth; // Adjust scale factor based on area width
    const scaleFactorY = canvas.height / areaHeight; // Adjust scale factor based on area height

    let rendered = 0;

    particles.forEach((point) => {
      const { x, y, r, g, b, a } = point;
      // Translate and scale particle positions relative to the area area
      const translatedX = (x - from.x) * scaleFactorX;
      const translatedY = (y - from.y) * scaleFactorY;

      // Only draw particles within the area boundaries
      if (x >= from.x && x <= to.x && y >= from.y && y <= to.y) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * opacity})`;
        ctx.fillRect(
          translatedX + offsetX * scale,
          translatedY + offsetY * scale + height / 2, // Adjust y-coordinate to be centered based on the height
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
    document.getElementById("points-value").textContent = pointsSlider.value;
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

    draw(particles, input);
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
      draw(particles, input);
    }
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

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
