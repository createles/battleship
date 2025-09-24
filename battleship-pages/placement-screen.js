import { createTiles, fillPieces } from "./page-elements.js";
import { handleHumanShipPlacement, startBattlePhase } from "../battleship-game-controller.js";

const mainContainer = document.querySelector("#mainContainer");
let currentPiece;
let placed = 0;

// populates the page with the ship placement screen
function generatePlacementScreen(player) {
  const placementContainer = document.createElement("div");
  placementContainer.id = "placementContainer";

  const instructions = document.createElement("div");
  instructions.id = "instructions";
  const text = document.createElement("div");
  text.id = "insText";
  text.textContent = "Place your ship pieces on the board. Click on a piece before dragging to rotate."

  const board = document.createElement("div");
  board.classList.add("board");
  createTiles(board); // create board for placing ship pieces

  const shipMenu = document.createElement("div");
  shipMenu.id = "shipMenu";

  const confirmBtn = document.createElement("button");
  confirmBtn.id = "confirm-btn";
  confirmBtn.textContent = "confirm";
  confirmBtn.addEventListener("click", () => {
    if (placed === 5) {
      startBattlePhase();
    } else {
      showPlacementWarning();
    }
  });

  instructions.append(text);
  placementContainer.append(board, shipMenu);
  mainContainer.append(instructions, placementContainer, confirmBtn);

  createPieces(); // generate pieces for ship menu
  makeDraggable(player); // allow pieces to be draggable
}

function showPlacementWarning() {
  const warningPop = document.createElement("div");
  warningPop.id = "warningPop";

  const warningMsg = document.createElement("div");
  warningMsg.id = "warningMsg";

  const msgText = document.createElement("p");
  msgText.textContent = "Please place all 5 ships before proceeding.";

  const okBtn = document.createElement("button");
  okBtn.textContent = "OK";
  okBtn.id = "againBtn"; // We can reuse the existing button style

  // When the "OK" button is clicked, remove the pop-up
  okBtn.addEventListener("click", () => {
    warningPop.remove();
  });

  warningMsg.append(msgText, okBtn);
  warningPop.append(warningMsg);
  document.body.append(warningPop);
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
    const shipFrame = document.createElement("div");
    shipFrame.classList.add("ship-frame");

    const hPiece = document.createElement("div");
    hPiece.classList.add("h-piece");
    const vPiece = document.createElement("div");
    vPiece.classList.add("v-piece");

    function buildShip(piece) {
      for (let i = 0; i < ship.length; i++) {
        const part = document.createElement("div");
        part.classList.add("ship-part");
        piece.append(part);
      }
    }

    buildShip(hPiece);
    buildShip(vPiece);

    const shipName = document.createElement("div");
    shipName.classList.add("ship-name");
    shipName.textContent = ship.type;

    shipSelect.classList.add("shipSelect");
    shipSelect.dataset.length = ship.length;
    shipSelect.dataset.orientation = "horizontal";
    shipSelect.id = `${ship.type}`;

    shipFrame.append(hPiece, vPiece);
    shipSelect.append(shipFrame, shipName);
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
    let lastHoveredTile = null;
    let ghostShip = null;

    function onMouseDown(e) {
      currentPiece = draggable; // set piece as current piece when held
      offsetX = e.clientX - draggable.getBoundingClientRect().left; // e.client x & y identify the position of the mouse
      offsetY = e.clientY - draggable.getBoundingClientRect().top; // relative to the viewport, used to smooth out movement

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      // handles smooth moving of element in the DOM, updates position dynamically
      if (!isDragging) {
        isDragging = true; // switches to true when moving
        let pieceToClone;

        if (draggable.dataset.orientation === "horizontal") {
          pieceToClone = draggable.querySelector(".h-piece");
        } else {
          pieceToClone = draggable.querySelector(".v-piece");
        }

        ghostShip = pieceToClone.cloneNode(true);
        ghostShip.classList.add('ghost-ship');
        document.body.append(ghostShip);

        draggable.classList.add("is-dragging-source");
      }

      const newX = e.clientX - offsetX; // update top an left style (position)
      const newY = e.clientY - offsetY; // to create dragging effect,
      ghostShip.style.left = `${newX}px`; // offset maintains spacing between mouse and element corner
      ghostShip.style.top = `${newY}px`;

      currentPiece.style.pointerEvents = "none";
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      currentPiece.style.pointerEvents = "auto";

      let currentTile = null;
      if (elementBelow && elementBelow.classList.contains("tile")) {
        currentTile = elementBelow;
      }

      if (currentTile !== lastHoveredTile) {
        if (currentTile) {
          clearPreviews();
          previewPlacement(currentTile, player);
        } else {
          clearPreviews();
        }

        lastHoveredTile = currentTile;
      }
    }

    // drop behavior (placing ship pieces on gameboard)
    function onMouseUp(e) {
      currentPiece = null; // clear piece when let go
      document.removeEventListener("mousemove", onMouseMove); // remove eventListeners after dropped *IF successful
      document.removeEventListener("mouseup", onMouseUp);

      if (ghostShip) {
        ghostShip.remove();
        ghostShip = null;
      }

      draggable.classList.remove("is-dragging-source");

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
            const DOMboard = document.querySelector(".board")
            console.log(`Placement successful.`);
            console.log(player.board);
            fillPieces(DOMboard, x, y, length, orientation);
            draggable.style.opacity = "0.4";
            draggable.removeEventListener("mousedown", onMouseDown);
            draggable.removeEventListener("click", handleRotation);
            placed++;
          } else { // on fail (tile already occupied), return piece to menu
            console.log("Invalid placement. Returning ship.");
            draggable.style.position = "static";
            draggable.style.left = "";
            draggable.style.top = "";
          }
        } else {
          console.log("Invalid drop location. Returning ship.");
          draggable.style.position = "static"; // Or relative, depending on your CSS
          draggable.style.left = "";
          draggable.style.top = "";
        }
      }

      isDragging = false;
      clearPreviews();
    }

    // handles click event to rotate piece orientation
    function handleRotation(e) {
      if (draggable.dataset.orientation === "horizontal") {
        draggable.dataset.orientation = "vertical";
      } else {
        draggable.dataset.orientation = "horizontal";
      }

      draggable.classList.toggle("vertical");
    }

    draggable.addEventListener("click", handleRotation);
    draggable.addEventListener("mousedown", onMouseDown);
  });
}

function previewPlacement(tile, player) {
  console.log("--- Preview Fired ---")
  if (!currentPiece) return;

  const length = parseInt(currentPiece.dataset.length, 10);
  const orientation = currentPiece.dataset.orientation;
  const startX = parseInt(tile.dataset.x, 10);
  const startY = parseInt(tile.dataset.y, 10);

  const isValid = player.board.placeValidation(length, { x: startX, y: startY}, orientation);
  const previewClass = isValid? 'preview-valid' : 'preview-invalid';

  for (let i = 0; i < length; i++) {
    let tile;
    if (orientation === 'horizontal') {
      tile = document.querySelector(`#tile-${startY}-${startX + i}`);
    } else {
      tile = document.querySelector(`#tile-${startY + i}-${startX}`);
    }

    if (tile) {
      tile.classList.add(previewClass);
    }
  }
}

function clearPreviews() {
  const tiles = document.querySelectorAll("#placementContainer .tile");
  tiles.forEach(tile => {
    tile.classList.remove('preview-valid', 'preview-invalid');
  });
}

export { generatePlacementScreen };
