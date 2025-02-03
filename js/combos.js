document.addEventListener('DOMContentLoaded', () => {
    displayCombos();
});

function displayCombos() {
    const container = document.getElementById('combos-container');
    container.innerHTML = "";

    appData.combos.forEach(combo => {
        const comboDiv = document.createElement('div');
        comboDiv.className = "combo-item";
        comboDiv.innerHTML = `
            <span class="combo-text">${combo.combo}</span>
            <div class="menu-container">
                <button class="menu-btn" onclick="toggleMenu('${combo.id}')">⋮</button>
                <div class="menu" id="menu-${combo.id}">
                    <button onclick="editCombo('${combo.id}')">EDIT</button>
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
    appData.combos = appData.combos.filter(combo => combo.id !== comboId);
    saveData();
    displayCombos();
}

function navigateToCreateCombo() {
    window.location.href = "createCombo.html";
}
