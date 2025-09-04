function createTiles(playerBoard) {
  const board = playerBoard;
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.id = `row-${i}`;
    row.classList.add("row-container");
    for (let j = 0; j < 10; j++) {
      const tile = document.createElement("div");
      tile.id = `${i}-tile-${j}`;
      tile.classList.add("tile");
      row.append(tile);
    }
    board.append(row);
  }

}

function drawPlayerBoard(playerBoard) {
  
}

const playerBoard = document.querySelector("#playerBoard");
const opponentBoard = document.querySelector("#opponentBoard")
createTiles(playerBoard);
createTiles(opponentBoard);