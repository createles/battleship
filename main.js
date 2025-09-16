import { generateSplash } from "./battleship-pages/splash-screen.js";

const mainContainer = document.querySelector("#mainContainer");

function clearPage() {
  mainContainer.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", generateSplash);

export { clearPage }