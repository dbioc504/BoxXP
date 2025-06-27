let appData = {
    skills: [],
    workouts: [],
    combos: []
};

async function loadUserData() {
    try {
        const res = await fetch('sql_connection.php?whoami=1', { credentials: 'include' });
        const whoami = await res.json();
        appData.user = whoami.user || 'guestData';
        console.log('[LOAD] Current user:', appData.user);
    } catch (err) {
        console.warn('[LOAD] Failed to get user from session:', err);
        appData.user = 'guestData';
    }

    // Fetch from server if logged in
    if (appData.user !== 'guestData') {
        try {
            let res, json;

            res = await fetch('sql_connection.php?fetch_skills=1', { credentials: 'include' });
            json = await res.json();
            appData.skills = json.skills;

            res = await fetch('sql_connection.php?fetch_workouts=1', { credentials: 'include' });
            json = await res.json();
            appData.workouts = json.workouts;

            res = await fetch('sql_connection.php?fetch_combos=1', { credentials: 'include' });
            json = await res.json();
            appData.combos = json.combos;

            renderAllSections();
            return;
        } catch (err) {
            console.error('[LOAD] Server fetch error:', err);
        }
    }

    // Fallback to guestData
    const stored = localStorage.getItem('guestData');
    if (stored) {
        const parsed = JSON.parse(stored);
        appData.skills = parsed.skills || [];
        appData.workouts = parsed.workouts || [];
        appData.combos = parsed.combos || [];
    } else {
        appData = {
            user: 'guestData',
            skills: [
                { category: 'dogwork',    items: ['Combo-Angle-Combo', 'Left Hook(s)', 'Combo-Roll-Combo'] },
                { category: 'pressure',   items: ['Forward Shuffle', 'Cut Off Ring', 'Left Hand Up, Roll Head Inside'] },
                { category: 'boxing',     items: ['Shuffle and Tick', 'Stand Ground, Block Combo, Combo, Shuffle Out'] }
            ],
            workouts: [
                { category: 'upper-body', items: ['Pushups', 'Dips', 'Shoulder Press'] },
                { category: 'lower-body', items: ['Squats', 'Squat Jumps', 'Deadlifts'] },
                { category: 'core',       items: ['Russian Twists', 'Dumbell Rack Marches'] }
            ],
            combos: [
                { id: 1, combo: ['jab','jab','roll','flurry'] },
                { id: 2, combo: ['slip','jab','jab','fake','roll','hook','right hand'] }
            ]
        };
    }

    renderAllSections();
}


function renderAllSections() {
    if (document.getElementById('skills-container'))   displayCategories();
    if (document.getElementById('combos-container'))   displayCombos();
}

async function saveUserData() {
    console.log('[SAVE] saveUserData called');

    localStorage.setItem('guestData', JSON.stringify(appData));

    if (!appData.user || appData.user === 'guestData') {
        console.warn('[SAVE] No logged-in user, skipping server save');
        return;
    }

    try {
        const form = new FormData();
        form.append('appData', JSON.stringify(appData)); 

        const res = await fetch('sql_connection.php', {
            method: 'POST',
            body: form,
            credentials: 'include' 
        });

        const raw = await res.text();
        console.log('[SAVE] Server response:', raw);

        try {
            const json = JSON.parse(raw);
            if (json.status === 'success') {
                console.log('[SAVE] Data saved successfully');
            } else {
                console.error('[SAVE] Server error:', json.message);
            }
        } catch (err) {
            console.error('[SAVE] Invalid JSON response from server:', raw);
        }
    } catch (err) {
        console.error('[SAVE] Network or server error:', err);
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
    saveUserData();
}

function removeItem(category, item) {
    const pageType = getPageType();
    const catObj   = appData[pageType].find(c => c.category === category);
    if (!catObj) return;
    catObj.items = catObj.items.filter(i => i !== item);
    displayCategories(pageType);
    saveUserData();
}

function addItem(category) {
    const newVal = prompt('Enter a new item:');
    if (!newVal) return;
    const pageType = getPageType();
    const catObj   = appData[pageType].find(c => c.category === category);
    if (!catObj) return;
    catObj.items.push(newVal);
    displayCategories(pageType);
    saveUserData();
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

document.addEventListener('DOMContentLoaded', loadUserData);
