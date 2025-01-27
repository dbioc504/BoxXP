// Default data structure for guest mode
let appData = JSON.parse(sessionStorage.getItem('guestData')) || {
    user: "guestData",
    skills: [
        {
            category: "Dogwork",
            items: ["Combo-Angle-Combo", "Left Hook(s)", "Combo-Roll-Combo"]
        },
        {
            category: "Pressure",
            items: ["Forward Shuffle", "Cut Off Ring"]
        },
        {
            category: "Boxing",
            items: ["Shuffle & Tick", "Footwork"]
        }
    ]
};

//Save initial data to sessionStorage if not already present
if (!sessionStorage.getItem('guestData')) {
    sessionStorage.setItem('guestData', JSON.stringify(appData));
}

function saveData() {
    sessionStorage.setItem('guestData', JSON.stringify(appData));
}

function toggleEdit(categoryId) {
    const skillsText = document.getElementById(`${categoryId}-skills`);
    const category = appData.skills.find(skill => skill.category.toLowerCase() === categoryId);

    if (!skillsText) {
        console.error(`Element with ID '${categoryId}-skills' not found.`);
        return;
    }

    // Check if already in Edit mode
    if (skillsText.dataset.editMode === "true") {
        // Exit Edit Mode: Revert to plain text
        skillsText.innerHTML = category.items.join(", ");
        skillsText.dataset.editMode = "false";
    } else {
        // Enter Edit Mode: Show editable skill items
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
      <button class="btn btn-warning btn-sm mt-2" onclick="addSkill('${category.category}')">+ Add</button>
    `;
        skillsText.dataset.editMode = "true";
    }
}


function removeSkill(category, skill) {
    const categoryObj = appData.skills.find(cat => cat.category === category);
    if (categoryObj) {
        categoryObj.items = categoryObj.items.filter(item => item !== skill);
        displaySkills();
    }
}

function addSkill(category) {
    const newSkill = prompt("Enter a new skill:");
    if (!newSkill) return;

    const categoryObj = appData.skills.find(cat => cat.category === category);
    if (categoryObj) {
        categoryObj.items.push(newSkill);
        displaySkills();
    }
}



// Display all skills dynamically
function displaySkills() {
    const container = document.getElementById("skills-container");
    container.innerHTML = "";

    appData.skills.forEach(skillCategory => {
        const section = document.createElement("div");
        section.className = "category-container";
        section.innerHTML = `
      <div class="category-header">
        <h2>${skillCategory.category.toUpperCase()}</h2>
        <div class="category-buttons">
        <button class="btn" onclick="toggleEdit('${skillCategory.category.toLowerCase()}')">Edit</button>
        </div>
      </div>
      <p class="skills-text" id="${skillCategory.category.toLowerCase()}-skills">
        ${skillCategory.items.join(", ")}
      </p>
    `;
        container.appendChild(section);
    });
}

// Load data on page load
document.addEventListener("DOMContentLoaded", () => {
    displaySkills();
});