document.addEventListener("DOMContentLoaded", () => {
    const modeRadios = document.querySelectorAll('input[name="skillMode"]');
    const focusContainer = document.getElementById("focus-container");
    const saveBtn = document.getElementById("save-btn");

    modeRadios.forEach(radio => {
        radio.addEventListener("change", ()=> {
            if (radio.value === "specialized" && radio.checked) {
                focusContainer.style.display = "block";
            } else if (radio.value === "balanced" && radio.checked) {
                focusContainer.style.display = "none";
            }
        });
    });

    saveBtn.addEventListener("click", () => {
        const mode = document.querySelector('input[name="skillMode"]:checked').value;
        sessionStorage.setItem("skillPlanType", mode);

        let focusSkill = null;
        if (mode === "specialized") {
            focusSkill = document.querySelector('input[name="focusSkill"]:checked');
            sessionStorage.setItem("skillFocus", focusSkill);
        } else {
            sessionStorage.removeItem("skillFocus");
        }

        generateSkillPlan(mode, focusSkill);
        window.location.href = "timerSetup.html";
    });
});

function getSkillDict() {
    const guestData = JSON.parse(sessionStorage.getItem("guestData"));
    const skillDict = {};
    if (guestData && guestData.skills) {
        guestData.skills.forEach(catObj => {
            skillDict[catObj.category] = catObj.items;
        });
    }
    return skillDict;
}

function generateSkillPlan(mode, focusSkill) {
    const skillDict = getSkillDict();
    if (!skillDict) return;

    const totalRounds = parseInt(sessionStorage.getItem("rounds") || 12);

    let plan = [];
    if (mode === "specialized" && focusSkill) {
        plan = specializedPlan(skillDict, focusSkill, totalRounds);
    } else {
        plan = balancedPlan(skillDict, totalRounds);
    }
    sessionStorage.setItem("skillPlan", JSON.stringify(plan));
}

function specializedPlan(skillDict, focusSkill, totalRounds) {
    const categories = Object.keys(skillDict);
    if (!categories.includes(focusSkill)) {
        return balancedPlan(skillDict, totalRounds);
    }

    const focusedRounds = Math.floor(totalRounds * 0.7);
    const otherRounds = totalRounds - focusedRounds;

    let roundChoices = new Array(focusedRounds).fill(focusSkill);

    const otherCats = categories.filter(cat => cat !== focusSkill);
    for (let i = 0; i < otherROunds; i++) {
        const randomCat = otherCats[Math.floor(Math.random() * otherCats.length)];
        roundChoices.push(randomCat);
    }

    for (let i = roundChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roundChoices[i], roundChoices[j]] = [roundChoices[j], roundChoices[i]];
    }

    return roundChoices;
}

function balancedPlan(skillDict, totalRounds) {
    const categories = Object.keys(skillDict);
    const counts = {};
    categories.forEach(cat => counts[cat] = 0);

    const plan = [];
    for (let i=0; i < totalRounds; i++) {
        let minCount = Infinity;
        categories.forEach(cat => {
            if (counts[cat] < minCount) {
                minCount = counts[cat];
            }
        });
        const leastUsed = categories.filter(cat => counts[cat] === minCount);
        const chosenCat = leastUsed[Math.floor(Math.random() * leastUsed.length)];
        plan.push(chosenCat);
        counts[chosenCat]++;
    }

    return plan;
}
