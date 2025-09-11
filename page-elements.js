function createTiles(playerBoard) {
  const board = playerBoard;
  for (let y = 0; y < 10; y++) {
    const row = document.createElement("div");
    row.id = `row-${y}`;
    row.classList.add("row-container");
    for (let x = 0; x < 10; x++) {
      const tile = document.createElement("div");
      tile.id = `tile-${y}-${x}`;
      tile.classList.add("tile");
      tile.dataset.x = x;
      tile.dataset.y = y;
      row.append(tile);
    }
    board.append(row);
  }
}

export { createTiles }