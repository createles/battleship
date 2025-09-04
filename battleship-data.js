class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunken = false;
  }

  hit() {
    // increments hit property
    this.hits++;
  }

  isSunken() {
    // updates sunken property if ship is sunk
    if (this.hits >= this.length) {
      this.sunken = true;
    }
  }
}

class Gameboard {
  constructor() {
    this.shipGrid = this.#createGrid(); // grid for placing ships
    this.attackGrid = this.#createGrid(); // grid for record-keeping of moves
    this.ships = [];
  }

  #createGrid() {
    const grid = [];
    for (let i = 0; i < 10; i++) {
      grid[i] = [];
      for (let j = 0; j < 10; j++) {
        grid[i].push(null);
      }
    }
    return grid;
  }

  placeShip(length, startPos, orientation) {
    // places ships in .shipGrid array
    if (this.#placeValidation(length, startPos, orientation)) {
      // validate placement
      const newShip = new Ship(length); // create ship object with length
      this.ships.push(newShip);
      if (orientation === "vertical") {
        // populate vertically
        for (let i = 0; i < length; i++) {
          this.shipGrid[startPos.x + i][startPos.y] = newShip;
        }
      } else if (orientation === "horizontal") {
        // populate horizontally
        for (let i = 0; i < length; i++) {
          this.shipGrid[startPos.x][startPos.y + i] = newShip;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  #placeValidation(length, startPos, orientation) {
    // fail-first approach (helpful for validation)
    const xPos = startPos.x;
    const yPos = startPos.y;

    if (typeof length !== "number" || length < 2 || length > 5) return false; // if ship length is not valid, exit

    if (
      // if startPos is off-board, exit
      xPos < 0 ||
      xPos > 9 ||
      yPos < 0 ||
      yPos > 9 ||
      this.shipGrid[xPos][yPos] !== null
    )
      return false;

    if (orientation !== "vertical" && orientation !== "horizontal")
      return false;

    // if move exceeds board due to ship length, exit
    if (
      (orientation === "vertical" && xPos + length > 10) ||
      (orientation === "horizontal" && yPos + length > 10)
    ) {
      return false;
    }

    // check if consecutive spaces are available for placement
    for (let i = 0; i < length; i++) {
      if (orientation === "vertical") {
        if (this.shipGrid[xPos + i][yPos] !== null) {
          return false;
        }
      } else if (orientation === "horizontal") {
        if (this.shipGrid[xPos][yPos + i] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  receiveAttack(pos) {
    // records and updates attack result
    const target = this.shipGrid[pos.x][pos.y];
    if (this.attackGrid[pos.x][pos.y] !== null) return false; // position already attacked (either a 'hit!' or 'miss!' element at index)

    if (target !== null) {
      // if position is occupied
      target.hit(); // update ship health
      target.isSunken(); // check and update sunken status
      this.attackGrid[pos.x][pos.y] = "hit!"; // record hit on position
      return true;
    } else if (target === null) {
      // if empty position
      this.attackGrid[pos.x][pos.y] = "miss!"; // record miss on position
      return false;
    }
  }

  areAllShipsSunk() { // end condition check for when all ships are sunk
    // check if all ships on board are sunk
    for (let ship of this.ships) {
      if (ship.sunken === false) {
        return false; // immediately exit check if at least one is still standing
      }
    }
    return true;
  }
}

class Player {
  constructor(type) {
    this.type = type; // types are: "human", "cpu"
    this.board = new Gameboard();
  }

  attack(opponentBoard, pos) { // calls an attack on specified coordinate, and returns true/false to signal success/fail
    return opponentBoard.receiveAttack(pos)
  }

  compAttack(opponentBoard) { // computer's (random) attack logic
    const movesList = this.#getAvailableMoves(opponentBoard);

    if (movesList.length > 0) {
      const randomIndex = Math.floor(Math.random() * movesList.length);
      const chosenPos = movesList[randomIndex];

      return (opponentBoard.receiveAttack(chosenPos));

    } else {
      return false; // no moves to be made
    }
  }

  #getAvailableMoves(opponentBoard) {
    const availableMoves = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const tile = opponentBoard.attackGrid[i][j];
        if (tile === null) {
          availableMoves.push({ i, j });
        }
      }
    }
    return availableMoves;
  }
}

export { Gameboard, Player };
