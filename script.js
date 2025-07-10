const game = document.getElementById("game");
const statusText = document.getElementById("status");
const rows = 10;
const cols = 10;
const totalBombs = 15;
let cells = [];
let gameOver = false;

function createBoard() {
  game.innerHTML = "";
  cells = [];
  gameOver = false;
  statusText.textContent = "";

  // Gera o grid
  for (let i = 0; i < rows * cols; i++) {
    const button = document.createElement("button");
    button.classList.add("cell");
    button.dataset.index = i;
    game.appendChild(button);
    cells.push({
      element: button,
      hasBomb: false,
      revealed: false,
      neighborBombs: 0
    });

    button.addEventListener("click", () => handleClick(i));
  }

  placeBombs();
  calculateNeighborBombs();
}

function placeBombs() {
  let placed = 0;
  while (placed < totalBombs) {
    const index = Math.floor(Math.random() * cells.length);
    if (!cells[index].hasBomb) {
      cells[index].hasBomb = true;
      placed++;
    }
  }
}

function calculateNeighborBombs() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].hasBomb) continue;

    const neighbors = getNeighbors(i);
    let count = 0;
    for (const neighbor of neighbors) {
      if (cells[neighbor].hasBomb) count++;
    }
    cells[i].neighborBombs = count;
  }
}

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / cols);
  const col = index % cols;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const newRow = row + r;
      const newCol = col + c;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        neighbors.push(newRow * cols + newCol);
      }
    }
  }

  return neighbors;
}

function handleClick(index) {
  if (gameOver || cells[index].revealed) return;

  const cell = cells[index];

  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.hasBomb) {
    cell.element.textContent = "💣";
    cell.element.classList.add("bomb");
    endGame(false);
    return;
  }
if (cell.neighborBombs > 0) {
  cell.element.textContent = cell.neighborBombs;
}

   else {
    const neighbors = getNeighbors(index);
    for (const neighbor of neighbors) {
      if (!cells[neighbor].revealed) {
        handleClick(neighbor);
      }
    }
  }

  checkWin();
}

function endGame(won) {
  gameOver = true;
  statusText.textContent = won ? "🎉 Você venceu!" : "💥 Fim de jogo!";
  cells.forEach((cell, i) => {
    if (cell.hasBomb) {
      cell.element.textContent = "💣";
      cell.element.classList.add("bomb", "revealed");
    }
    cell.element.disabled = true;
  });
}

function checkWin() {
  const revealedCount = cells.filter(cell => cell.revealed).length;
  if (revealedCount === cells.length - totalBombs) {
    endGame(true);
  }
}
document.getElementById("restart").addEventListener("click", createBoard);

createBoard();
