import { Player, Gameboard } from "./battleship-data.js";
import { generatePlacementScreen } from "./placement-screen.js";

function setupGame() {
  const humanPlayer = new Player("human");
  const cpuPlayer = new Player("cpu");

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

function takeTurn(player, opponent) {
  if (player.type === "cpu") {
    if (player.compAttack(opponent.board)) {
      console.log("Fire!");
    } else {
      console.log("Did not fire.");
    }
  } /* else {

  } */
}

function gameLoop(p1, p2) {
  let turnOrder = 0;
  let endGame = false;
  do {
    if (turnOrder === 0) {
      takeTurn(p1, p2);
      endGame = p2.board.areAllShipsSunk();
      turnOrder++;

    } else {
      takeTurn(p2, p1);
      endGame = p1.board.areAllShipsSunk();
      turnOrder--;
    }
  } while (endGame === false);

  if (p1.board.areAllShipsSunk()) {
    console.log('Player 2 wins!');
  } else {
    console.log('Player 1 Wins!');
  }
  return;
}

// gameLoop(trialP1, trialP2);

export { handleHumanShipPlacement, setupGame };