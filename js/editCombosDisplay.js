document.addEventListener("DOMContentLoaded", () => {
    displayCombos();
});

function displayCombos() {
    const container = document.getElementById("combos-container");
    container.innerHTML = "";

    const guestData = JSON.parse(localStorage.getItem("guestData"));
    console.log("guestDataFirstLoad:", guestData);

    if (!guestData || !guestData.combos) {
        container.innerHTML += "<p>No combos found.</p>";
        return;
    }

    let selectedCombos = JSON.parse(localStorage.getItem("selectedCombos")) || [];

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
                console.log(selectedCombos);
                selectedCombos.push(combo.id);
            } else {
                console.log(selectedCombos);
                selectedCombos = selectedCombos.filter(id => id !== combo.id);
            }
        });

        container.appendChild(comboDiv);
    });
}

// function displayCombos() {
//     const container = document.getElementById("combos-container");
//     container.innerHTML = "";
//
//     const guestData = JSON.parse(localStorage.getItem("guestData"));
//     console.log("guestDataFirstLoad:", guestData);
//
//     if (guestData && guestData.combos) {
//         let selectedCombos = JSON.parse(localStorage.getItem("selectedCombos")) || [];
//
//         guestData.combos.forEach(combo => {
//             const comboDiv = document.createElement("div");
//             comboDiv.classList.add("selectable-item");
//             if (selectedCombos.includes(combo.id)) {
//                 comboDiv.classList.add("selected");
//             }
//
//             comboDiv.textContent = combo.combo.join(" + ");
//
//             comboDiv.addEventListener("click", () => {
//                 comboDiv.classList.toggle("selected");
//                 if (comboDiv.classList.contains("selected")) {
//                     selectedCombos.push(combo.id);
//                 } else {
//                     selectedCombos = selectedCombos.filter(id => id !== combo.id);
//                 }
//             });
//
//             container.appendChild(comboDiv);
//         });
//     }
//
//     fetch('sql_connection.php?fetch_combos=true')
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === "success") {
//                 data.combos.forEach(combo => {
//                     const comboDiv = document.createElement('div');
//                     comboDiv.className = "combo-item";
//
//                     const comboText = combo.combo
//                         ? combo.combo.map(move => move.toUpperCase()).join(" + ")
//                         : "NO COMBO DATA";
//
//                     comboDiv.innerHTML = `
//                         <span class="combo-text">${comboText}</span>
//                         <div class="menu-container">
//                             <button class="menu-btn" onclick="toggleMenu('${combo.id}')">⋮</button>
//                             <div class="menu" id="menu-${combo.id}">
//                                 <button onclick="editCombo('${combo.id}')">EDIT</button>
//                                 <button onclick="deleteCombo('${combo.id}')">DELETE</button>
//                             </div>
//                         </div>
//                     `;
//
//                     container.appendChild(comboDiv);
//                 });
//             }
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             container.innerHTML += "<p>Error fetching combos from database.</p>";
//         });
// }


function saveCombos() {
    const container = document.getElementById("combos-container");
    const allItems = container.querySelectorAll(".selectable-item");

    let newSelected = [];
    const guestData = JSON.parse(localStorage.getItem("guestData"));

    allItems.forEach((item, index) => {
        if (item.classList.contains("selected")) {
            const comboId = guestData.combos[index].id;
            newSelected.push(comboId);
        }
    });

    localStorage.setItem("selectedCombos", JSON.stringify(newSelected));

    console.log(newSelected);

    window.location.href = "timerSetup.html";
}

// function saveCombos() {
//     const container = document.getElementById("combos-container");
//     const allItems = container.querySelectorAll(".selectable-item");
//
//     let newSelected = [];
//     const guestData = JSON.parse(localStorage.getItem("guestData"));
//
//     allItems.forEach((item, index) => {
//         if (item.classList.contains("selected")) {
//             const comboId = guestData.combos[index].id;
//             newSelected.push(comboId);
//         }
//     });
//
//     localStorage.setItem("selectedCombos", JSON.stringify(newSelected));
//
//     fetch('sql_connection.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: `combos=${encodeURIComponent(JSON.stringify([newSelected]))}`
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === "success") {
//                 console.log("Combos successfully saved to database!");
//             } else {
//                 console.error("Failed to save combos:", data.message);
//             }
//         })
//         .catch(error => console.error('Error:', error));
//
//     // Redirect to the next page
//     window.location.href = "timerSetup.html";
// }
