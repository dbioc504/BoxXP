document.addEventListener("DOMContentLoaded", () => {
    loadComboPieces();
    setupDragAndDrop();

    if (isTouchDevice) {
        document.getElementById("instruction-text").textContent = "TAP PIECES ABOVE TO ADD TO COMBO";
    }
    console.log(JSON.parse(localStorage.getItem("guestData")));

});

const isTouchDevice = "ontouchsatart" in window || navigator.maxTouchPoints > 0;

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

function saveCombo() {
    if (userCombo.length === 0){
        alert("Your combo is empty!");
        return;
    }

    let storedData = JSON.parse(localStorage.getItem('guestData'));

    if (!storedData) {
        storedData = { user: "guestData", skills: [], workouts: [], combos: [] };
    }

    if (!storedData.combos) storedData.combos = [];

    const newCombo = {
        id: Date.now(),
        combo: [...userCombo]
    };

    storedData.combos.push(newCombo);

    localStorage.setItem('guestData', JSON.stringify(storedData));

    console.log("Updated guestData: ", storedData);

    window.location.href = "combos.html";
}

