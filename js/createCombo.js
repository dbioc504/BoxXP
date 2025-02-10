document.addEventListener("DOMContentLoaded", () => {
    loadComboPieces();
    setupDragAndDrop();
});

const comboPieces = [
    "JAB", "CROSS", "HOOK", "UPPERCUT", "SLIP",
    "ROLL", "BLOCK", "PARRY", "WEAVE", "STEP BACK"
];

let userCombo = [];

function loadComboPieces() {
    const piecesContainer = document.getElementById("combo-pieces");
    piecesContainer.innerHTML = "";

    comboPieces.forEach(move => {
        const moveElement = document.createElement("div");
        moveElement.className = "combo-piece";
        moveElement.draggable = true;
        moveElement.textContent = move;
        moveElement.setAttribute("data-move", move);
        moveElement.addEventListener("dragstart", handleDragStart);
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
}

function saveCombo() {
    if (userCombo.length === 0){
        alert("Your combo is empty!");
        return;
    }

    let appData = JSON.parse(sessionStorage.getItem('guestData')) || { combos: []};

    const newCombo = {
        id: Date.now(),
        combo: [...userCombo]
    };

    appData.combos.push(newCombo);
    sessionStorage.setItem('guestData', JSON.stringify(appData));

    window.location.href = "combos.html";

}
