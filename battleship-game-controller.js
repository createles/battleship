import { Player, Gameboard } from "./battleship-framework";

function Game() {}

function populateBoard(player) {
  const shipList = [5, 4, 3, 2, 1];
  if (player.type === "human") {
    // to be determined after DOM is set up
  } else {
    for (const shipLength of shipList) {
      // Attempt placing ship piece until valid placement is found
      while (true) {
        const position = generatePosition();
        const orientation = generateOrientation();

        // returns true or false
        const isPlaced = player.board.placeShip(
          shipLength,
          position,
          orientation
        );

        if (isPlaced) {
          // if ship is placed, move to next piece
          break;
        }
      }
    }
  }
}

function generatePosition() {
  const posX = Math.floor(Math.random() * 10); // random x coordinate
  const posY = Math.floor(Math.random() * 10); // random y coordinate

  return { posX, posY };
}

function generateOrientation() {
  const orientation = Math.random() < 0.5 ? "vertical" : "horizontal"; // random orientation
  return orientation;
}
