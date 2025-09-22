function createTiles(playerBoard) {
  const board = playerBoard;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const tile = document.createElement("div");
      tile.id = `tile-${y}-${x}`;
      tile.classList.add("tile");
      tile.dataset.x = x;
      tile.dataset.y = y;
      board.append(tile);
    }
  }
}

function fillPieces(DOMboard, x, y, length, orientation) {
  const board = DOMboard;

  if (orientation === "horizontal") {
    for (let i = 0; i < length; i++) {
      const tile = board.querySelector(`#tile-${y}-${x+i}`);
      tile.classList.add("filled-tile");
    }
  } else {
    for (let i = 0; i < length; i++) {
      const tile = board.querySelector(`#tile-${y+i}-${x}`);
      tile.classList.add("filled-tile");
    }
  }
}

function renderPlayerBoard(player, domBoard) {
  const dataBoard = player.board.shipGrid;

  dataBoard.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile !== null) {
        const domTile = domBoard.querySelector(`#tile-${y}-${x}`);
        if (player.type === "human" && domTile) {
          domTile.classList.add("filled-tile");
        }
      }
    });
  });
}

function displayWinner(winner) {
  const mainContainer = document.querySelector("#mainContainer");
  const winPop = document.createElement("div");
  winPop.id = "winPop";

  const winMsg = document.createElement("div");
  winMsg.id = "winMsg";
  winMsg.textContent = `${winner} wins!`;

  winPop.append(winMsg);
  mainContainer.append(winPop);
}

export { createTiles, fillPieces, renderPlayerBoard, displayWinner }