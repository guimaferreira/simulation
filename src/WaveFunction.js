const pointsExp = 3;

module.exports = function waveFunction(input) {
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
};
