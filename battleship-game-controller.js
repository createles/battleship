import { generateBattleScreen } from "./battle-screen.js";
import { Player, Gameboard } from "./battleship-data.js";
import { clearPage } from "./main.js";
import { renderPlayerBoard } from "./page-elements.js";
import { generatePlacementScreen } from "./placement-screen.js";

let humanPlayer, cpuPlayer, playerGrid, cpuGrid;

function setupGame() {
  humanPlayer = new Player("human");
  cpuPlayer = new Player("cpu");

  populateCpuBoard(cpuPlayer);

  generatePlacementScreen(humanPlayer);
}

function handleHumanShipPlacement(player, length, x, y, orientation) {
  const placementSuccessful = player.board.placeShip(length, { x, y }, orientation);

  return placementSuccessful;
}

function populateCpuBoard(cpu) {
  const shipList = [5, 4, 3, 3, 2];
  for (const shipLength of shipList) {
    // Attempt placing ship piece until valid placement is found
    let isPlaced;
    do {
      const position = generatePosition();
      const orientation = generateOrientation();

      // returns true or false
      isPlaced = cpu.board.placeShip(shipLength, position, orientation);
    } while (!isPlaced);
  }
}

// CPU POSITION LOGIC
function generatePosition() { // generate random position for ship placement
  const x = Math.floor(Math.random() * 10); // random x coordinate
  const y = Math.floor(Math.random() * 10); // random y coordinate

  return { x, y };
}

// CPU ORIENTATION LOGIC
function generateOrientation() { // generate random orientation
  const orientation = Math.random() < 0.5 ? "vertical" : "horizontal"; // random orientation
  return orientation;
}

function startBattlePhase() {
  clearPage();
  generateBattleScreen();
  playerGrid = document.querySelector("#playerGrid") 
  cpuGrid = document.querySelector("#cpuGrid")
  renderPlayerBoard(humanPlayer, playerGrid);

  preparePlayerTurn();
}

function preparePlayerTurn() {
  console.log("Your turn to attack!");
  cpuGrid.addEventListener("click", handlePlayerAttack);
  // cpuGrid.classList.add("active-turn");
}

function handlePlayerAttack(event) {
  cpuGrid.classList.remove("active-turn");
  cpuGrid.removeEventListener("click", handlePlayerAttack);

  const tile = event.target;
  if (!tile.dataset.x || tile.classList.contains("hit") || tile.classList.contains("miss")) {
    preparePlayerTurn();
    return;
  }

  const x = parseInt(tile.dataset.x, 10);
  const y = parseInt(tile.dataset.y, 10);
  const pos = { y, x };

  console.log(`Fired at {${y}, ${x}}...`);

  const result = cpuPlayer.board.receiveAttack(pos);

  result ? console.log("It's a hit!") : console.log("Player missed.");
  tile.classList.add(result ? "hit" : "miss");

  if (cpuPlayer.board.areAllShipsSunk()) {
    endGame("Player");
    return;
  }

  console.log("CPU player's turn.")
  setTimeout(handleComputerTurn, 1000);
}

function handleComputerTurn() {
  const attackData = cpuPlayer.compAttack(humanPlayer.board);

  if (attackData) {
    const { result, position } = attackData; // Destructure return object for simpler access
    console.log(`Fired at {${position.y}, ${position.x}}...`);
    const tile = playerGrid.querySelector(`#tile-${position.y}-${position.x}`);
    tile.classList.add(result ? "hit" : "miss");

    result ? console.log("It's a hit!") : console.log("CPU missed.");

    if (humanPlayer.board.areAllShipsSunk()) {
      endGame("CPU");
      return;
    }
  }

  preparePlayerTurn();
}

function endGame(winner) {
  console.log(`Game over! ${winner} wins!`);
}

export { handleHumanShipPlacement, setupGame, startBattlePhase };