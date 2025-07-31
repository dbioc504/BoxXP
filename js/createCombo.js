import { saveUserData } from "./firestoreHelpers.js";
import {appData} from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
    loadComboPieces();
    setupDragAndDrop();

    if (isTouchDevice) {
        document.getElementById("instruction-text").textContent = "TAP PIECES ABOVE TO ADD TO COMBO";
    }
    console.log(JSON.parse(localStorage.getItem("guestData")));

});

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

const comboPieces = [
    "JAB", "(BODY) JAB", "STRAIGHT", "(BODY) STRAIGHT", "LEFT HOOK", "(BODY) LEFT HOOK",
    "RIGHT HOOK", "(BODY) RIGHT HOOK", "UPPERCUT", "SLIP", "BLOCK", "PARRY", "ROLL",
    "STEP BACK",
];

let userCombo = [];

function loadComboPieces() {
    const piecesContainer = document.getElementById("combo-pieces");
    piecesContainer.innerHTML = "";

    comboPieces.forEach(move => {
        const moveElement = document.createElement("div");
        moveElement.className = "combo-piece";
        moveElement.textContent = move;
        moveElement.setAttribute("data-move", move);

        if (isTouchDevice) {
            moveElement.addEventListener("click", () => addMoveToCombo(move));
        } else {
            moveElement.draggable = true
            moveElement.addEventListener("dragstart", handleDragStart);
        }

        piecesContainer.appendChild(moveElement);
    });
}

function setupDragAndDrop() {
    const dropZone = document.getElementById("your-combo");

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault()
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        const move = event.dataTransfer.getData("text");
        addMoveToCombo(move);
    });
}

function handleDragStart(event) {
    event.dataTransfer.setData("text", event.target.getAttribute("data-move"));
}

function addMoveToCombo(move) {
    const comboContainer = document.getElementById("your-combo");
    document.getElementById("instruction-text").style.display = "none";

    const moveElement = document.createElement("div");
    moveElement.className = "combo-move";
    moveElement.textContent = move;

    const removeBtn = document.createElement("div");
    removeBtn.textContent = "X";
    removeBtn.className = "remove-move";
    removeBtn.addEventListener("click", () => removeMove(moveElement));

    moveElement.appendChild(removeBtn);
    comboContainer.appendChild(moveElement);

    userCombo.push(move);
}

function removeMove(element) {
    const comboContainer = document.getElementById("your-combo");
    const moveText = element.firstChild.textContent;
    userCombo = userCombo.filter(move => move !== moveText);
    comboContainer.removeChild(element)

    if (userCombo.length == 0) {
        document.getElementById("instruction-text").style.display = "block";
    }
}

async function saveCombo() {
    if (userCombo.length === 0) {
        alert("Your combo is empty!");
        return;
    }

    const newCombo = {
        id: Date.now(),
        combo: [...userCombo]
    };

    appData.combos = [...(appData.combos || []), newCombo];

    await saveUserData(appData);

    window.location.href = "combos.html";
}

window.saveCombo = saveCombo;