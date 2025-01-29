let appData = JSON.parse(sessionStorage.getItem('guestData')) || {
    user: "guestData",
    skills: [
        {
            category: "dogwork",
            items: ["Combo-Angle-Combo", "Left Hook(s)", "Combo-Roll-Combo"]
        },
        {
            category: "pressure",
            items: ["Forward Shuffle", "Cut Off Ring"]
        },
        {
            category: "boxing",
            items: ["Shuffle & Tick", "Footwork"]
        }
    ]
};

if (!sessionStorage.getItem('guestData')) {
    sessionStorage.setItem('guestData', JSON.stringify(appData));
}

function saveData() {
    sessionStorage.setItem('guestData', JSON.stringify(appData));
}

function toggleEdit(categoryId) {
    console.log(`toggleEdit called with categoryId: ${categoryId}`);

    const categoryHeader = document.querySelector(`[data-category="${categoryId}"]`);

    if (!categoryHeader) {
        console.error(`No category found for: ${categoryId}`);
        return;
    }

    const editButton = categoryHeader.querySelector(".btn-edit");
    const doneButton = categoryHeader.querySelector(".btn-done");
    const skillsText = document.getElementById(`${categoryId}-skills`);

    const category = appData.skills.find(skill => skill.category.toLowerCase() === categoryId.toLowerCase());

    if (!category) {
        console.error(`Category '${categoryId}' not found.`);
        return;
    }

    if (skillsText.dataset.editMode === "true") {
        skillsText.innerHTML = category.items.join(", ");
        skillsText.dataset.editMode = "false";

        editButton.style.display = "inline-block";
        doneButton.style.display = "none";
        saveData();
    } else {
        renderEditMode(skillsText, category);
        skillsText.dataset.editMode = "true";

        editButton.style.display = "none";
        doneButton.style.display = "inline-block";
    }
}

function renderEditMode(skillsText, category) {
    skillsText.innerHTML = `
        <ul class="skills-list">
            ${category.items
        .map(
            item => `
                    <li class="skills-item">
                        <span>${item}</span>
                        <button class="btn btn-danger btn-sm" onclick="removeSkill('${category.category}', '${item}')">Remove</button>
                    </li>
                `
        )
        .join("")}
        </ul>
        <button class="btn btn-warning btn-sm mt-2" onclick="addSkill('${category.category}')">ADD +</button>
    `;
}


function removeSkill(category, skill) {
    const categoryObj = appData.skills.find(cat => cat.category === category);
    if (categoryObj) {
        categoryObj.items = categoryObj.items.filter(item => item !== skill);
        const skillsText = document.getElementById(`${category.toLowerCase()}-skills`);
        renderEditMode(skillsText, categoryObj);
        saveData();
    }
}

function addSkill(category) {
    const newSkill = prompt("Enter a new skill:");
    if (!newSkill) return;

    const categoryObj = appData.skills.find(cat => cat.category === category);
    if (categoryObj) {
        categoryObj.items.push(newSkill);
        const skillsText = document.getElementById(`${category.toLowerCase()}-skills`);
        renderEditMode(skillsText, categoryObj);
        saveData();
    }
}

function displaySkills() {
    const container = document.getElementById("skills-container");
    container.innerHTML = "";

    appData.skills.forEach(skillCategory => {
        const section = document.createElement("div");
        section.className = "category-container";
        section.innerHTML = `
            <div class="category-header" data-category="${skillCategory.category.toLowerCase()}">
                <h2>${skillCategory.category.toUpperCase()}</h2>
                <div class="category-buttons">
                    <button class="btn btn-edit" onclick="toggleEdit('${skillCategory.category.toLowerCase()}')">EDIT</button>
                    <button class="btn btn-done" style="display: none;" onclick="toggleEdit('${skillCategory.category.toLowerCase()}')">DONE</button>
                </div>
            </div>
            <p class="skills-text" id="${skillCategory.category.toLowerCase()}-skills">
                ${skillCategory.items.join(", ")}
            </p>
        `;
        container.appendChild(section);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displaySkills();
});
