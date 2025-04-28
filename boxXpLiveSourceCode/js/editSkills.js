document.addEventListener("DOMContentLoaded", () => {
    const modeRadios     = document.querySelectorAll('input[name="skillMode"]');
    const focusContainer = document.getElementById("focus-container");
    const saveBtn        = document.getElementById("save-btn");

    modeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            focusContainer.style.display = radio.value === "specialized" && radio.checked
                ? "block"
                : "none";
        });
    });

    saveBtn.addEventListener("click", () => {
        const mode = document.querySelector('input[name="skillMode"]:checked').value;
        localStorage.setItem("skillPlanType", mode);

        let focusSkill = null;
        if (mode === "specialized") {
            const focusInput = document.querySelector('input[name="focusSkill"]:checked');
            if (focusInput) focusSkill = focusInput.value.toLowerCase();
            localStorage.setItem("skillFocus", focusSkill);
        } else {
            localStorage.removeItem("skillFocus");
        }

        generateSkillPlan(mode, focusSkill);
        window.location.href = "timerSetup.html";
    });
});


function getSkillDict() {
    const guestData = JSON.parse(localStorage.getItem("guestData")) || {};
    const skillDict = {};
    (guestData.skills || []).forEach(cat => {
        skillDict[cat.category.toLowerCase()] = cat.items;
    });
    return skillDict;
}

function generateSkillPlan(mode, focusSkill) {
    const skillDict = getSkillDict();
    const totalRounds = parseInt(localStorage.getItem("rounds") || "12", 10);
    let plan;

    if (mode === "specialized" && focusSkill) {
        plan = specializedPlan(skillDict, focusSkill, totalRounds);
    } else {
        plan = balancedPlan(skillDict, totalRounds);
    }

    localStorage.setItem("skillPlan", JSON.stringify(plan));
}

function specializedPlan(skillDict, focusSkill, totalRounds) {
    const categories = Object.keys(skillDict);
    if (!categories.includes(focusSkill)) {
        return balancedPlan(skillDict, totalRounds);
    }

    const focusedRounds = Math.floor(totalRounds * 0.7);
    const otherRounds   = totalRounds - focusedRounds;
    const roundChoices  = Array(focusedRounds).fill(focusSkill);

    const otherCats = categories.filter(cat => cat !== focusSkill);
    for (let i = 0; i < otherRounds; i++) {
        const pick = otherCats[Math.floor(Math.random() * otherCats.length)];
        roundChoices.push(pick);
    }

    for (let i = roundChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roundChoices[i], roundChoices[j]] = [roundChoices[j], roundChoices[i]];
    }

    return roundChoices;
}

function balancedPlan(skillDict, totalRounds) {
    const categories = Object.keys(skillDict);
    const counts = categories.reduce((o, c) => { o[c] = 0; return o; }, {});
    const plan = [];

    for (let i = 0; i < totalRounds; i++) {
        const minCount = Math.min(...categories.map(c => counts[c]));
        const least = categories.filter(c => counts[c] === minCount);
        const pick  = least[Math.floor(Math.random() * least.length)];
        plan.push(pick);
        counts[pick]++;
    }

    return plan;
}
