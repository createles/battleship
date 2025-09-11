import { createTiles, fillPieces } from "./page-elements.js";
import { handleHumanShipPlacement } from "./battleship-game-controller.js";
import { generateBattleScreen } from "./battle-screen.js";
import { clearPage } from "./main.js";

const mainContainer = document.querySelector("#mainContainer");

// populates the page with the ship placement screen
function generatePlacementScreen(player) {
  const placementContainer = document.createElement("div");
  placementContainer.id = "placementContainer";

  const instructions = document.createElement("div");
  instructions.id = "instructions";
  instructions.textContent = "instructions to follow";

  const board = document.createElement("div");
  board.classList.add("board");
  createTiles(board); // create board for placing ship pieces

  const shipMenu = document.createElement("div");
  shipMenu.id = "shipMenu";

  const confirmBtn = document.createElement("button");
  confirmBtn.id = "confirm-btn";
  confirmBtn.textContent = "confirm";
  confirmBtn.addEventListener("click", () => {
    clearPage();
    generateBattleScreen();
  });

  placementContainer.append(board, shipMenu);
  mainContainer.append(instructions, placementContainer, confirmBtn);

  createPieces(); // generate pieces for ship menu
  makeDraggable(player); // allow pieces to be draggable
}

// creates the ship piece DOM elements
function createPieces() {
  const ships = [
    { length: 5, type: "Carrier" },
    { length: 4, type: "Battleship" },
    { length: 3, type: "Cruiser" },
    { length: 3, type: "Submarine" },
    { length: 2, type: "Destroyer" },
  ];
  const shipMenu = document.querySelector("#shipMenu");

  for (const ship of ships) {
    const shipSelect = document.createElement("div");
    shipSelect.classList.add("shipSelect");
    shipSelect.textContent = `${ship.type}`;
    shipSelect.dataset.length = ship.length;
    shipSelect.dataset.orientation = "horizontal";
    shipSelect.id = `${ship.type}`;

    shipMenu.append(shipSelect);
  }
}

// ship piece dom elements drag and drop behavior
function makeDraggable(player) {
  const draggables = document.querySelectorAll(".shipSelect");

  draggables.forEach((draggable) => {
    let offsetX, offsetY; // used to identify where on the element it was clicked
    const originalParent = draggable.parentElement;
    let isDragging = false; // indicates if movement is detected

    function onMouseDown(e) {
      offsetX = e.clientX - draggable.getBoundingClientRect().left; // e.client x & y identify the position of the mouse
      offsetY = e.clientY - draggable.getBoundingClientRect().top; // relative to the viewport, used to smooth out movement

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      // handles smooth moving of element in the DOM, updates position dynamically
      if (!isDragging) {
        isDragging = true; // switches to true when moving
        draggable.style.position = "absolute"; // set element to absolute to enable 'left' 'top' position mod
        draggable.style.zIndex = 1000; // bring element to the front of the DOM
        draggable.style.cursor = "grabbing"; // show grabby hands
      }

      const newX = e.clientX - offsetX; // update top an left style (position)
      const newY = e.clientY - offsetY; // to create dragging effect,
      draggable.style.left = `${newX}px`; // offset maintains spacing between mouse and element corner
      draggable.style.top = `${newY}px`;
    }

    // drop behavior (placing ship pieces on gameboard)
    function onMouseUp(e) {
      document.removeEventListener("mousemove", onMouseMove); // remove eventListeners after dropped *IF successful
      document.removeEventListener("mouseup", onMouseUp);

      // only runs drop logic if element was dragged initially
      if (isDragging) {
        draggable.style.cursor = "auto"; // return mouse style to original, return element to original layer
        draggable.style.zIndex = "";

        draggable.style.pointerEvents = "none"; // disables pointer interactions
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY); // provides element underneath pointer
        draggable.style.pointerEvents = "auto"; // re-enables pointer interaction

        // handles updating data layer AND visual layer
        if (elementBelow && elementBelow.classList.contains("tile")) {
          const x = parseInt(elementBelow.dataset.x, 10);
          const y = parseInt(elementBelow.dataset.y, 10);
          const length = parseInt(draggable.dataset.length, 10);
          const orientation = draggable.dataset.orientation;

          // calls ship placement function with position on the gameboard
          const placementSuccessful = handleHumanShipPlacement(
            player,
            length,
            x,
            y,
            orientation
          );

          if (placementSuccessful) { // on success, populate gameboard AND place ship visual on DOM board
            console.log(`Placement successful.`);
            console.log(player.board);
            elementBelow.append(draggable);
            fillPieces(x, y, length, orientation);
            draggable.removeEventListener("mousedown", onMouseDown);
            draggable.removeEventListener("click", handleRotation);
          } else { // on fail (tile already occupied), return piece to menu
            console.log("Invalid placement rule. Returning ship.");
            originalParent.append(draggable);
            draggable.style.position = "static";
            draggable.style.left = "";
            draggable.style.top = "";
          }
        } else {
          console.log("Invalid drop location. Returning ship.");
          originalParent.append(draggable);
          draggable.style.position = "static"; // Or relative, depending on your CSS
          draggable.style.left = "";
          draggable.style.top = "";
        }
      }

      isDragging = false;
    }

    // handles click event to rotate piece orientation
    function handleRotation(e) {
      if (draggable.dataset.orientation === "horizontal") {
        draggable.dataset.orientation = "vertical";
        draggable.classList.add("vertical");
      } else {
        draggable.dataset.orientation = "horizontal";
        draggable.classList.remove("vertical");
      }
    }

    draggable.addEventListener("click", handleRotation);
    draggable.addEventListener("mousedown", onMouseDown);
  });
}

export { generatePlacementScreen };
