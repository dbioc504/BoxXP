import { auth, onAuth } from "./firebaseAuth.js";
import { fetchUserData, saveUserData } from "./firestoreHelpers.js";

function arrayHasRealItems(arr = []) {
    return arr.some(cat => Array.isArray(cat.items) && cat.items.length > 0);
}

export const STARTER_DATA = {
    skills: [
        { category: 'Pressure', items: [] },
        { category: 'Dogwork', items: [] },
        { category: 'Boxing', items: [] },
    ],
    workouts: [
        { category: 'Upper', items: [] },
        { category: 'Lower', items: [] },
        { category: 'Core', items: [] },
    ],
    combos: []
}
export let appData = structuredClone(STARTER_DATA)


async function startApp(user){
    if (user) {
        const guest = loadGuestData();
        const cloud = await fetchUserData();
        appData = {
            skills: arrayHasRealItems(cloud.skills) ? cloud.skills : guest.skills,
            workouts: arrayHasRealItems(cloud.workouts) ? cloud.workouts : guest.workouts,
            combos: cloud.combos?.length ? cloud.combos : guest.combos
        };

        const cloudString = JSON.stringify(cloud);
        const mergedString = JSON.stringify(appData);

        if (mergedString !== cloudString) {
            await saveUserData(appData);
        }
        localStorage.removeItem("guestData");
    } else {
        appData = loadGuestData();
    }
    renderAllSections();
}

// load on startup
export function loadGuestData() {
    const stored = JSON.parse(localStorage.getItem('guestData') || 'null');

    // Nothing stored? → seed and return fresh copy
    if (!stored) {
        localStorage.setItem('guestData', JSON.stringify(STARTER_DATA));
        return structuredClone(STARTER_DATA);
    }

    // merge: if any array is missing or empty, use starter version
    const merged = {
        skills:   Array.isArray(stored.skills)   && stored.skills.length   ? stored.skills   : structuredClone(STARTER_DATA.skills),
        workouts: Array.isArray(stored.workouts) && stored.workouts.length ? stored.workouts : structuredClone(STARTER_DATA.workouts),
        combos:   Array.isArray(stored.combos)   && stored.combos.length   ? stored.combos   : structuredClone(STARTER_DATA.combos)
    };

    // persist merged version for next time
    localStorage.setItem('guestData', JSON.stringify(merged));
    return merged;
}

export function saveAll () {
    console.log("saveAll called. appData is now:", appData);
    if (auth.currentUser) return saveUserData(appData);
    localStorage.setItem('guestData', JSON.stringify(appData));
}

export function renderAllSections() {
    if (document.getElementById('skills-container')) displayCategories();
    if (typeof displayCombos === 'function' &&
        document.getElementById('combos-container')) {
        displayCombos();
    }
}


function getPageType() {
    const path = window.location.pathname;
    if (path.includes('workouts')) return 'workouts';
    if (path.includes('skillset')) return 'skills';
    console.error('Unknown page type, defaulting to skills');
    return 'skills';
}

function toggleEdit(categoryId) {
    const header = document.querySelector(`[data-category="${categoryId}"]`);
    if (!header) return console.error('Category not found:', categoryId);
    const pageType = getPageType();
    const categoryObj = appData[pageType].find(c => c.category.toLowerCase() === categoryId);
    if (!categoryObj) return console.error('Category data missing:', categoryId);

    const editBtn = header.querySelector('.btn-edit');
    const doneBtn = header.querySelector('.btn-done');
    const textEl  = document.getElementById(`${categoryId}-${pageType}`);

    if (textEl.dataset.editMode === 'true') {
        exitEditMode(textEl, categoryObj, editBtn, doneBtn);
    } else {
        enterEditMode(textEl, categoryObj, editBtn, doneBtn);
    }
}

function enterEditMode(textEl, catObj, editBtn, doneBtn) {
    textEl.innerHTML = `
    <ul class="skills-list">
      ${catObj.items.map(it => `
        <li class="skills-item">
          <span>${it}</span>
          <button class="btn btn-danger btn-sm"
                  onclick="removeItem('${catObj.category}','${it}')">
            Remove
          </button>
        </li>
      `).join('')}
    </ul>
    <button class="btn btn-warning btn-sm mt-2"
            onclick="addItem('${catObj.category}')">
      ADD +
    </button>
  `;
    textEl.dataset.editMode = 'true';
    editBtn.style.display = 'none';
    doneBtn.style.display = 'inline-block';
}

function exitEditMode(textEl, catObj, editBtn, doneBtn) {
    textEl.innerHTML = catObj.items.join(', ');
    textEl.dataset.editMode = 'false';
    editBtn.style.display = 'inline-block';
    doneBtn.style.display = 'none';
    saveAll();
}

function removeItem(category, item) {
    const pageType = getPageType();
    const catObj   = appData[pageType].find(c => c.category === category);
    if (!catObj) return;
    catObj.items = catObj.items.filter(i => i !== item);
    displayCategories(pageType);
    saveAll();
}

function addItem(category) {
    const newVal = prompt('Enter a new item:');
    if (!newVal) return;
    const pageType = getPageType();
    const catObj   = appData[pageType].find(c => c.category === category);
    if (!catObj) return;
    catObj.items.push(newVal);
    displayCategories(pageType);
    saveAll();
}

function displayCategories() {
    const container = document.getElementById('skills-container') || document.getElementById('workouts-container');
    if (!container) return;

    const pageType = getPageType();
    container.innerHTML = '';

    appData[pageType].forEach(catObj => {
        const id = catObj.category.toLowerCase();
        const section = document.createElement('div');
        section.className = 'category-container';
        section.innerHTML = `
      <div class="category-header" data-category="${id}">
        <h2>${catObj.category.toUpperCase()}</h2>
        <div class="category-buttons">
          <button class="btn btn-edit" onclick="toggleEdit('${id}')">EDIT</button>
          <button class="btn btn-done" style="display:none;"
                  onclick="toggleEdit('${id}')">DONE</button>
        </div>
      </div>
      <p class="skills-text" id="${id}-${pageType}">
        ${catObj.items.join(', ')}
      </p>
    `;
        container.appendChild(section);
    });
}

export async function boot() {
    console.log("Boot loaded appData:", appData);
    if (auth.currentUser) {
        appData = await fetchUserData();
    } else {
        appData = loadGuestData();
    }
    renderAllSections();
}

document.addEventListener('DOMContentLoaded', () => {
    onAuth(startApp);
});

window.toggleEdit = toggleEdit;
window.removeItem = removeItem;
window.addItem = addItem;
window.saveAll = saveAll;