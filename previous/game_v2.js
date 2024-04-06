const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cellSize = 2; // Decreased cell size for more 'particles'
const gridWidth = Math.floor(canvas.width / cellSize);
const gridHeight = Math.floor(canvas.height / cellSize);

// Grid initialization with 'particles' having mass and charge
let grid = Array.from({ length: gridHeight }, () =>
  Array.from({ length: gridWidth }, () => {
    return { mass: 0, charge: 0 };
  })
);

// Big Bang: A single 'particle' with mass and a neutral charge
grid[Math.floor(gridHeight / 2)][Math.floor(gridWidth / 2)] = {
  mass: 1,
  charge: 0,
};

function applyPhysics() {
  // This function will loop through each cell and apply a simplified gravitational force
  // by checking the density of neighboring cells and simulating attraction.

  let newGrid = grid.map((arr) => arr.map((cell) => ({ ...cell }))); // Copy the grid to a new one

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      // Count the total mass around the current cell
      let massAround = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue; // Skip the current cell
          let nx = x + dx,
            ny = y + dy;
          if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            massAround += grid[ny][nx].mass;
          }
        }
      }

      // Simplified gravity effect: if there is mass around the cell, increase its mass
      if (massAround > 0 && grid[y][x].mass === 0) {
        newGrid[y][x].mass = 1; // Simulate attracting mass to empty space
      }

      // Simplified electromagnetic effect: randomly assign charge and simulate repulsion
      if (grid[y][x].mass > 0) {
        newGrid[y][x].charge = Math.random() < 0.5 ? 1 : -1; // Assign a random charge
        // Check for adjacent cells with the same charge and 'push away' by reducing mass
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            let nx = x + dx,
              ny = y + dy;
            if (
              (dx === 0 && dy === 0) ||
              nx < 0 ||
              nx >= gridWidth ||
              ny < 0 ||
              ny >= gridHeight
            ) {
              continue;
            }
            if (
              grid[ny][nx].mass > 0 &&
              grid[ny][nx].charge === newGrid[y][x].charge
            ) {
              // Decrease mass to simulate repulsion
              newGrid[y][x].mass = 0;
            }
          }
        }
      }
    }
  }

  grid = newGrid; // Update the main grid with the new values
}

function update() {
  applyPhysics();

  let newGrid = grid.map((arr) =>
    arr.map((cell) => {
      // Placeholder for new cell state based on physics
      return { ...cell };
    })
  );

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      // Basic expansion rule: if a cell has mass, it might 'replicate' to an adjacent space
      if (cell.mass > 0) {
        let directions = [
          [0, 1],
          [1, 0],
          [0, -1],
          [-1, 0],
        ]; // 4-neighbor expansion
        directions.forEach((dir) => {
          let nx = x + dir[0];
          let ny = y + dir[1];
          if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            if (grid[ny][nx].mass === 0) {
              newGrid[ny][nx].mass = 1; // Create new 'particle' representing expansion
            }
          }
        });
      }
    });
  });

  grid = newGrid;
  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.mass > 0) {
        ctx.fillStyle = "lime";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    });
  });
}

update();
