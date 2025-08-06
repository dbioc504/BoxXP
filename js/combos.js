function displayCombos() {
    const container = document.getElementById('combos-container');
    container.innerHTML = "";

    const list = window.appData.combos || [];

    list.forEach(combo => {
        const comboDiv = document.createElement('div');
        comboDiv.className = "combo-item";
        comboDiv.innerHTML = `
            <span class="combo-text">${combo.combo.map(move => move.toUpperCase()).join(" + ")}</span>
            <div class="menu-container">
                <button class="menu-btn" onclick="toggleMenu('${combo.id}')">⋮</button>
                <div class="menu" id="menu-${combo.id}">
                    <button onclick="deleteCombo('${combo.id}')">DELETE</button>                
                </div>
            </div>
        `;
        container.appendChild(comboDiv);
    });
}

function toggleMenu(comboId) {
    const menu = document.getElementById(`menu-${comboId}`);
    if (menu) {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    } else {
        console.error(`Menu with ID 'menu-${comboId}' not found.`);
    }
}

function deleteCombo(comboId) {
    console.log("Deleting combo with id:", comboId);
    console.log("Before deletion appData.combos:", appData ? appData.combos : "undefined");
    appData.combos = appData.combos.filter(combo => combo.id !== parseInt(comboId));
    saveUserData(appData);
    displayCombos();
}

function navigateToCreateCombo() {
    window.location.href = "createCombo.html";
}
