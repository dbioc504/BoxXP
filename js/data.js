let storedData = localStorage.getItem('guestData');
if (storedData) {
    appData = JSON.parse(storedData);
} else {
    appData = {
        user: "guestData",
        skills: [
            { category: "dogwork", items: ["Combo-Angle-Combo", "Left Hook(s)", "Combo-Roll-Combo"]},
            { category: "pressure", items: ["Forward Shuffle", "Cut Off Ring", "Left Hand Up, Roll Head Inside"] },
            { category: "boxing", items: ["Shuffle and Tick", "Stand Ground, Block Combo, Combo, Shuffle Out"]}
        ],
        workouts: [
            { category: "upper-body", items: ["Pushups", "Dips", "Shoulder Press"] },
            { category: "lower-body", items: ["Squats", "Squat Jumps", "Deadlifts"] },
            { category: "core", items: ["Russian Twists", "Dumbell Rack Marches"] }
        ],
        combos: [
            { id: 1, combo: ["jab", "jab", "roll", "flurry"]},
            { id: 2, combo: ["slip", "jab", "jab", "fake", "roll", "hook", "right hand"]}
        ]
    };
    localStorage.setItem('guestData', JSON.stringify(appData));
}

function saveData() {
    localStorage.setItem('guestData', JSON.stringify(appData));
    console.log("guestData saved:", appData)

    const storedData = localStorage.getItem('guestData');
    const appDataToSend = storedData ? JSON.parse(storedData) : {};

    fetch('sql_connection.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `appData=${encodeURIComponent(JSON.stringify(appDataToSend))}&email=user@example.com&password=password123` // URL-encode the data
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                console.log("Data successfully saved to database!");
            } else {
                console.error("Failed to save data:", data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function getPageType() {
    const path = window.location.pathname;
    if (path.includes('workouts')) return 'workouts';
    if (path.includes('skillset')) return 'skills';
    console.error('Page not found, defaulting to skills');
    return 'skills';
}

function toggleEdit(categoryId) {
    // if (pageType === "workouts") {
    //     window.location.href = "editWorkouts.html";
    //     return;
    // }
    // if (!appData[pageType]) {
    //     setTimeout(() => toggleEdit(categoryId), 300);
    //     return;
    // }

    const categoryHeader = document.querySelector(`[data-category="${categoryId}"]`);
    if (!categoryHeader) {
        console.error('category not found');
        return;
    }

    const pageType = getPageType();
    const category = appData[pageType].find(cat => cat.category.replaceAll(/-/g, "").toLowerCase() === categoryId.replace(/-/g, "").toLowerCase());
    if (!category) {
        console.error('category not found');
        return;
    }

    const editButton = categoryHeader.querySelector(".btn-edit");
    const doneButton = categoryHeader.querySelector(".btn-done");
    // const skillsText = document.getElementById(`${categoryId}-skills`);
    const skillsText = document.getElementById(`${categoryId}-skills`) || document.getElementById(`${categoryId}-workouts`);

    if (skillsText.dataset.editMode === "true") {
        exitEditMode(skillsText, category, editButton, doneButton);
    } else {
        enterEditMode(skillsText, category, editButton, doneButton);
    }
}

function enterEditMode(skillsText, category, editButton, doneButton) {
    skillsText.innerHTML = `
        <ul class = "skills-list">
            ${category.items.map(item => `
                <li class ="skills-item">
                    <span>${item}</span>
                    <button class="btn btn-danger btn-sm" onclick="removeSkill('${category.category}', '${item}')">Remove</button>
                </li>
            `).join("")}
        </ul>
        <button class="btn btn-warning btn-sm mt-2" onclick="addSkill('${category.category}')">ADD +</button>
    `;
    skillsText.dataset.editMode = "true";
    editButton.style.display = "none";
    doneButton.style.display = "inline-block";
}

function exitEditMode(skillsText, category, editButton, doneButton) {
    skillsText.innerHTML = category.items.join(", ");
    skillsText.dataset.editMode = "false";
    editButton.style.display = "inline-block";
    doneButton.style.display = "none";
    console.log("HERE", "here");
    saveData();
    displaySkills();
}

function removeSkill(category, skill) {
    const pageType = getPageType();
    const categoryObj = appData[pageType].find(cat => cat.category === category);
    if (categoryObj) {
        categoryObj.items = categoryObj.items.filter(item => item !== skill);
        saveData();
        // displaySkills();
    }
    displaySkills()
}

function addSkill(category) {
    const newSkill = prompt("Enter a new skill:");
    if (!newSkill) return;

    const pageType = getPageType();
    const categoryObj = appData[pageType].find(cat => cat.category === category);
    if (categoryObj) {
        categoryObj.items.push(newSkill);
        saveData();
        displaySkills();
    }
    // displaySkills();
}

// function displaySkills() {
//     const container = document.getElementById("skills-container");
//     if (!container) {
//         console.error('No skills found');
//         return;
//     }
//
//     container.innerHTML = "";
//     const pageType = getPageType();
//     appData[pageType].forEach((category) => {
//         const section = document.createElement("div");
//         section.className = "category-container";
//         section.innerHTML = `
//             <div class="category-header" data-category="${category.category.toLowerCase()}">
//                 <h2>${category.category.toUpperCase()}</h2>
//                 <div class="category-buttons">
//                     <button class="btn btn-edit" onclick="toggleEdit('${category.category.toLowerCase()}')">EDIT</button>
//                     <button class="btn btn-done" style="display: none;" onclick="toggleEdit('${category.category.toLowerCase()}')">DONE</button>
//                 </div>
//             </div>
//             <p class="skills-text" id="${category.category.toLowerCase()}-skills">
//                 ${category.items.join(", ")}
//             </p>
//         `;
//         container.appendChild(section);
//     })
// }

function displaySkills() {
    const container = document.getElementById("skills-container");
    if (!container) {
        console.error('No skills container found');
        return;
    }


    //get the user and if user == guestUser@guestUser then

    container.innerHTML = ""; // Clear any existing content in the container

    const pageType = getPageType();

    if(pageType == 'skills') {


        fetch('sql_connection.php?fetch_skills=true', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data);

                if (data.status === "error") {
                    console.error('Error fetching skills:', data.message);
                    return;
                }

                if (data.skills && data.skills.length > 0) {
                    // const updatedAppData = { skills: data.skills };
                    // localStorage.setItem("guestData", JSON.stringify(updatedAppData));

                    appData.skills = data.skills;
                    localStorage.setItem("guestData", JSON.stringify(appData));

                    data.skills.forEach(category => {
                        const section = document.createElement("div");
                        section.className = "category-container";

                        section.innerHTML = `
                    <div class="category-header" data-category="${category.category.toLowerCase()}">
                        <h2>${category.category.toUpperCase()}</h2>
                        <div class="category-buttons">
                            <button class="btn btn-edit" onclick="toggleEdit('${category.category.toLowerCase()}')">EDIT</button>
                            <button class="btn btn-done" style="display: none;" onclick="toggleEdit('${category.category.toLowerCase()}')">DONE</button>
                        </div>
                    </div>
                    <p class="skills-text" id="${category.category.toLowerCase()}-skills">
                        ${category.items.join(", ")}
                    </p>
                `;

                        container.appendChild(section);
                    });
                } else {
                    // container.innerHTML = "<p>No skills data found.</p>";
                }
            })
            .catch(error => console.error('Error fetching skills:', error));
    }
    if(pageType == 'workouts') {

        // displayWorkouts();
        fetch('sql_connection.php?fetch_workouts=true', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data);

                if (data.status === "error") {
                    console.error('Error fetching workouts:', data.message);
                    return;
                }

                if (data.workouts && data.workouts.length > 0) {
                    // const updatedAppData = { workouts: data.workouts };
                    // localStorage.setItem("guestData", JSON.stringify(updatedAppData));

                    appData.workouts = data.workouts;
                    localStorage.setItem("guestData", JSON.stringify(appData));

                    data.workouts.forEach(category => {
                        const section = document.createElement("div");
                        section.className = "category-container";

                        section.innerHTML = `
                    <div class="category-header" data-category="${category.category.toLowerCase()}">
                        <h2>${category.category.toUpperCase()}</h2>
                        <div class="category-buttons">
                            <button class="btn btn-edit" onclick="toggleEdit('${category.category.toLowerCase()}')">EDIT</button>
                            <button class="btn btn-done" style="display: none;" onclick="toggleEdit('${category.category.toLowerCase()}')">DONE</button>
                        </div>
                    </div>
                    <p class="workouts-text" id="${category.category.toLowerCase()}-workouts">
                        ${category.items.join(", ")}
                    </p>
                `;

                        container.appendChild(section);
                    });
                } else {
                    // container.innerHTML = "<p>No skills data found.</p>";
                }
            })
            .catch(error => console.error('Error fetching workouts:', error));

    }
}


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("skills-container")) {
        displaySkills();
    }
})

if (!localStorage.getItem('guestData')) {
    localStorage.setItem('guestData', JSON.stringify(appData));
}