const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 4; // Size of the cells

// Ensure canvas dimensions are multiples of cellSize to avoid partial cells
canvas.width = Math.floor(window.innerWidth / cellSize) * cellSize;
canvas.height = Math.floor(window.innerHeight / cellSize) * cellSize;

const gridWidth = canvas.width / cellSize;
const gridHeight = canvas.height / cellSize;

// Initialize grid with 0s
let grid = Array.from({ length: gridHeight }, () =>
  Array.from({ length: gridWidth }, () => 0)
);

// Optionally seed the grid with some initial live cells
for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
    grid[y][x] = Math.random() > 0.9 ? 1 : 0; // Adjust probability as needed
  }
}

function countNeighbors(x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue; // Skip the cell itself

      let nx = x + dx,
        ny = y + dy;
      // Check boundaries before accessing the grid
      if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
        count += grid[ny][nx];
      }
    }
  }
  return count;
}

// The rest of the update and draw functions remain largely the same

function update() {
  // Game logic for updating the grid
  let newGrid = grid.map((arr) => [...arr]);

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const neighbors = countNeighbors(x, y);
      if (grid[y][x] === 1) {
        if (neighbors < 2 || neighbors > 3) {
          newGrid[y][x] = 0;
        }
      } else {
        if (neighbors === 3) {
          newGrid[y][x] = 1;
        }
      }
    }
  }

  grid = newGrid;
  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = "lime";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

// Start the game loop
update();
