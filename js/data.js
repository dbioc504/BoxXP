let appData = JSON.parse(sessionStorage.getItem('guestData')) || {
    user: "guestData",
    skills: [
        { category: "dogwork", items: ["Combo-Angle-Combo", "Left Hook(s)", "Combo-Roll-Combo"] },
        { category: "pressure", items: ["Forward Shuffle", "Cut Off Ring"] },
        { category: "boxing", items: ["Shuffle & Tick", "Footwork"] }
    ],
    workouts: [
        { category: "upper-body", items: ["Pushups", "Dips", "Shoulder Press", "Lateral Raises"] },
        { category: "lower-body", items: ["Squats", "Lunges", "Kettlebell Swings", "RDLs"] },
        { category: "core", items: ["Russian Twists", "Situps", "Bear Crawls"] }
    ],
    combos: [
        { id: 1, combo: ["jab", "jab", "slip", "jab", "right hand"] },
        { id: 2, combo: ["tick-tick", "boom", "hook", "uppercut"] }
    ]
};

function saveData() {
    sessionStorage.setItem('guestData', JSON.stringify(appData));
}

function getPageType() {
    const path = window.location.pathname;

    if (path.includes('workouts')) {
        return 'workouts';
    } else if (path.includes('skillset')) {
        return 'skills';
    }
    console.error('Page not found, defaulting to skills.');
    return "skills";
}

function toggleEdit(categoryId) {
    console.log(`toggleEdit called with categoryId: ${categoryId}`);

    const categoryHeader = document.querySelector(`[data-category="${categoryId}"]`);
    if (!categoryHeader) {
        console.error(`No category found for: ${categoryId}`);
        return;
    }

    const pageType = getPageType();
    const category = appData[pageType].find(cat => cat.category.replace(/-/g, "").toLowerCase() === categoryId.replace(/-/g, "").toLowerCase());

    if (!category) {
        console.error(`Category '${categoryId}' not found.`);
        return;
    }

    const editButton = categoryHeader.querySelector(".btn-edit");
    const doneButton = categoryHeader.querySelector(".btn-done");
    const skillsText = document.getElementById(`${categoryId}-skills`);

    if (skillsText.dataset.editMode === "true") {
        exitEditMode(skillsText, category, editButton, doneButton);
    } else {
        enterEditMode(skillsText, category, editButton, doneButton);
    }
}

function enterEditMode(skillsText, category, editButton, doneButton) {
    skillsText.innerHTML = `
        <ul class="skills-list">
            ${category.items.map(item => `
                <li class="skills-item">
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
    saveData();
}

function removeSkill(category, skill) {
    const pageType = getPageType();
    const categoryObj = appData[pageType].find(cat => cat.category === category);

    if (categoryObj) {
        categoryObj.items = categoryObj.items.filter(item => item !== skill);
        const skillsText = document.getElementById(`${category.toLowerCase()}-skills`);
        enterEditMode(skillsText, categoryObj);
        saveData();
    }
}

function addSkill(category) {
    const newSkill = prompt("Enter a new skill:");
    if (!newSkill) return;

    const pageType = getPageType();
    const categoryObj = appData[pageType].find(cat => cat.category === category);

    if (categoryObj) {
        categoryObj.items.push(newSkill);
        const skillsText = document.getElementById(`${category.toLowerCase()}-skills`);
        enterEditMode(skillsText, categoryObj);
        saveData();
    }
}

function displaySkills() {
    const container = document.getElementById("skills-container");
    container.innerHTML = "";
    const pageType = getPageType();

    appData[pageType].forEach(category => {
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
}

document.addEventListener("DOMContentLoaded", () => {
    displaySkills();
});
