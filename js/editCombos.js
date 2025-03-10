document.addEventListener("DOMContentLoaded", () => {
    displayCombos();
});

function displayCombos() {
    const container = document.getElementById("combos-container");
    container.innerHTML = "";

    const guestData = JSON.parse(sessionStorage.getItem("guestData"));
    if (!guestData || !guestData.combos) {
        container.innerHTML += "<p>No combos found.</p>";
        return;
    }

    let selectedCombos = JSON.parse(sessionStorage.getItem("selectedCombos")) || [];

    guestData.combos.forEach(combo => {
        const comboDiv = document.createElement("div");
        comboDiv.classList.add("selectable-item");
        if (selectedCombos.includes(combo.id)) {
            comboDiv.classList.add("selected");
        }

        comboDiv.textContent = combo.combo.join(" + ");

        comboDiv.addEventListener("click", () => {
            comboDiv.classList.toggle("selected");
            if (comboDiv.classList.contains("selected")) {
                selectedCombos.push(combo.id);
            } else {
                selectedCombos = selectedCombos.filter(id => id !== combo.id);
            }
        });

        container.appendChild(comboDiv);
    });
}

function saveCombos() {
    const container = document.getElementById("combos-container");
    const allItems = container.querySelectorAll(".selectable-item");

    let newSelected = [];
    const guestData = JSON.parse(sessionStorage.getItem("guestData"));

    allItems.forEach((item, index) => {
        if (item.classList.contains("selected")) {
            const comboId = guestData.combos[index].id;
            newSelected.push(comboId);
        }
    });

    sessionStorage.setItem("selectedCombos", JSON.stringify(newSelected));
    window.location.href = "timerSetup.html";
}