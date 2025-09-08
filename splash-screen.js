import { generatePlacementScreen } from "./placement-screen.js";
import { clearPage } from "./main.js";

const mainContainer = document.querySelector("#mainContainer");

function generateSplash() {
  const titleBox = document.createElement("div");
  titleBox.id = "titleBox";

  const titleCard = document.createElement("div");
  titleCard.id = "titleCard";
  titleCard.textContent = "Battleship";

  const startGame = document.createElement("div");
  startGame.id = "startGame";
  startGame.textContent = "Start Game";
  startGame.addEventListener("click", () => {
    clearPage();
    generatePlacementScreen();
  });

  titleBox.append(titleCard, startGame);
  mainContainer.append(titleBox);
}

export { generateSplash }