// editCombosDisplay.js

function displayCombos() {
    const combos   = window.appData?.combos   || [];
    let selected   = JSON.parse(localStorage.getItem("selectedCombos") || "[]");
    const container = document.getElementById("combos-container");
    container.innerHTML = "";

    if (!combos.length) {
        container.innerHTML = "<p>No combos found.</p>";
        return;
    }

    combos.forEach(combo => {
        const div = document.createElement("div");
        div.classList.add("selectable-item");
        div.textContent = combo.combo.join(" + ");

        if (selected.includes(combo.id)) {
            div.classList.add("selected");
        }

        div.addEventListener("click", () => {
            if (div.classList.toggle("selected")) {
                selected.push(combo.id);
            } else {
                selected = selected.filter(id => id !== combo.id);
            }
            localStorage.setItem("selectedCombos", JSON.stringify(selected));
        });

        container.appendChild(div);
    });
}

function saveCombos() {
    // selections are already in localStorage; just go back to timer setup
    window.location.href = "timerSetup.html";
}

// wire it up
document.addEventListener("DOMContentLoaded", () => {
    displayCombos();
    document.querySelector(".save-btn")
        .addEventListener("click", saveCombos);
});
