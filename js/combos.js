document.addEventListener('DOMContentLoaded', () => {
    displayCombos();
});

// function displayCombos() {
//     const container = document.getElementById('combos-container');
//     container.innerHTML = "";
//
//     appData.combos.forEach(combo => {
//         const comboDiv = document.createElement('div');
//         comboDiv.className = "combo-item";
//         comboDiv.innerHTML = `
//             <span class="combo-text">${combo.combo.map(move => move.toUpperCase()).join(" + ")}</span>
//             <div class="menu-container">
//                 <button class="menu-btn" onclick="toggleMenu('${combo.id}')">⋮</button>
//                 <div class="menu" id="menu-${combo.id}">
//                     <button onclick="editCombo('${combo.id}')">EDIT</button>
//                     <button onclick="deleteCombo('${combo.id}')">DELETE</button>
//                 </div>
//             </div>
//         `;
//         container.appendChild(comboDiv);
//     });
// }
function displayCombos() {
    const container = document.getElementById('combos-container');
    container.innerHTML = "";

    fetch('sql_connection.php?fetch_combos=true')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                data.combos.forEach(combo => {
                    const comboDiv = document.createElement('div');
                    comboDiv.className = "combo-item";

                    const comboText = combo.combo
                        ? combo.combo.map(move => move.toUpperCase()).join(" + ")
                        : "NO COMBO DATA";

                    comboDiv.innerHTML = `
                        <span class="combo-text">${comboText}</span>
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
            } else {
                // container.innerHTML = "<p>Failed to load combos.</p>";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            container.innerHTML = "<p>Error fetching combos.</p>";
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

// function deleteCombo(comboId) {
//     appData.combos = appData.combos.filter(combo => combo.id !== parseInt(comboId));
//     saveData();
//     displayCombos();
// }

function deleteCombo(comboId) {
    // fetch('sql_connection.php?fetch_combos=true')
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.status === "success") {
    //             // Filter out the deleted combo
    //             appData.combos = data.combos.filter(combo => combo.id !== parseInt(comboId));
    //
    //             // Now display updated combos
    //             displayCombos();
    //         } else {
    //             console.error("Failed to fetch combos before deleting.");
    //         }
    //     })
    //     .catch(error => {
    //         console.error("Error fetching combos for deletion:", error);
    //     });

    // fetch('sql_connection.php', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: `overwrite_combos=${encodeURIComponent(JSON.stringify(combosToSend))}&email=user@example.com&password=password123`
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.status === "success") {
    //             console.log("Combos successfully saved to database!");
    //         } else {
    //             console.error("Failed to save combos:", data.message);
    //         }
    //     })
    //     .catch(error => console.error('Error:', error));

        fetch('sql_connection.php?read_only_combos=true')
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    // Save the full list first
                    appData.combos = data.combos;

                    appData.combos = appData.combos.filter(combo => combo.id !== parseInt(comboId));
                    displayCombos()


                    // appData.combos = appData.combos.filter(combo => combo.id !== parseInt(comboId));
                    // }
                    const formattedCombos = appData.combos.map(combo => ({
                        id: combo.id,
                        combo: combo.combo
                    }));

                    fetch('sql_connection.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: 'overwrite_combos=true&combos=' + encodeURIComponent(JSON.stringify(formattedCombos))
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === "success") {
                                console.log("Combos overwritten successfully.");
                                fetch('sql_connection.php?fetch_combos=true')
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.status === "success") {
                                            appData.combos = data.combos;

                                            displayCombos();
                                        } else {
                                            console.error("Error fetching updated combos:", data.message);
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Error fetching updated combos:", error);
                                    });
                            } else {
                                console.error("Error overwriting combos:", data.message);
                            }
                        })
                        .catch(error => {
                            console.error("Fetch error:", error);
                        });
                } else {
                    console.error("Failed to load combos:", data.message);
                    document.getElementById('combos-container').innerHTML = "<p>Failed to load combos.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching combos:", error);
                document.getElementById('combos-container').innerHTML = "<p>Error fetching combos.</p>";
            });
}
//                                 displayCombos()
//                             } else {
//                                 // displayCombos()
//                                 console.error("Error overwriting combos:", data.message);
//                             }
//                         })
//                         .catch(error => {
//                             // console.error("Fetch error:", error);
//                         });
//
//                     // displayCombos();
//                 } else {
//                     console.error("Failed to load combos:", data.message);
//                     document.getElementById('combos-container').innerHTML = "<p>Failed to load combos.</p>";
//                 }
//             })
//             .catch(error => {
//                 console.error("Error fetching combos:", error);
//                 document.getElementById('combos-container').innerHTML = "<p>Error fetching combos.</p>";
//             });
//         // displayCombos()
//
//
// }



function navigateToCreateCombo() {
    window.location.href = "createCombo.html";
}
