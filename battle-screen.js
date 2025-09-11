import { createTiles } from "./page-elements.js";

const body = document.querySelector("body");
const mainContainer = document.querySelector("#mainContainer");

function generateBattleScreen() {
  const gridsContainer = document.createElement("div");
  gridsContainer.id = "gridsContainer"

  const playerGrid = document.createElement("div");
  playerGrid.id = "playerGrid";
  playerGrid.classList.add("gameboard")
  createTiles(playerGrid);

  const cpuGrid = document.createElement("div");
  cpuGrid.id = "cpuGrid";
  cpuGrid.classList.add("gameboard")
  createTiles(cpuGrid);

  gridsContainer.append(playerGrid, cpuGrid);
  mainContainer.append(gridsContainer);
}

// FIGURE OUT TILE DISPLAYING ON BATTLE SCREEN

export { generateBattleScreen }