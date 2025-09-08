import { createTiles } from "./page-elements.js";

const mainContainer = document.querySelector("#mainContainer");

function generatePlacementScreen() {
  const placementContainer = document.createElement("div");
  placementContainer.id = "placementContainer";

  const instructions = document.createElement("div");
  instructions.id = "instructions";
  instructions.textContent = "instructions to follow";

  const board = document.createElement("div");
  board.classList.add("board");
  createTiles(board);

  placementContainer.append(board);
  mainContainer.append(instructions, placementContainer);
}



export {generatePlacementScreen}
