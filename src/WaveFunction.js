const pointsExp = 3.5;

module.exports = function waveFunction(input) {
  const {
    amplitude,
    frequency,
    phase,
    points,
    precision,
    entropy,
    width,
    height,
  } = input;
  let random = 1;

  function round(value, p = precision) {
    const newValue = value + value * random;
    return newValue;
    return parseFloat(newValue.toFixed(p));
  }

  function normalize({ value, min = 0, max = 1 }) {
    if (max === min) {
      // Handle the case where the range is zero to prevent division by zero
      console.error("Maximum and minimum values cannot be the same.");
      return NaN; // Not a Number (error state)
    }
    return (value - min) / (max - min);
  }

  const totalPoints = points ** pointsExp;

  const particles = [];
  const step = (2 * Math.PI) / totalPoints; // * (width - 100);
  console.log({ step });
  // console.log({ entropy, random, precision });
  for (let i = 0; i < totalPoints; i++) {
    random = (entropy * phase * i) / totalPoints / +1;

    const x = round(i * step * random * Math.random());
    const y = round(amplitude * Math.sin(frequency * x + phase));
    const a = 1 - Math.abs(y) / 2 / amplitude / 10000; // Alpha value based on amplitude
    const r = round((255 * Math.random()) / random, 0);
    const g = round((255 * Math.random()) / random, 0);
    const b = round((255 * Math.random()) / random, 0);
    const particle = { x, y, r, g, b, a };
    particles.push(particle);
  }
  console.log("Last Random", random, particles[particles.length - 1]);
  return particles;
};
