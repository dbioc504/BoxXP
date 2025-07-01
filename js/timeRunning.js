document.addEventListener('DOMContentLoaded', initTimer);

const boxingBell = new Audio("sounds/boxing-bell.mp3");
boxingBell.volume = 0.8;
const sticksClack = new Audio("sounds/hand-clap-106596.mp3");
sticksClack.volume = 0.5;

let audioReady = false;

const audioBtn = document.getElementById('audio-btn');
const icon = document.getElementById('audio-icon');

audioBtn.addEventListener("click", async () => {
    try{
        await boxingBell.play();
        boxingBell.pause();
        boxingBell.currentTime = 0;
        audioReady = true;

        icon.src = "images/sound_on.svg"
        audioBtn.style.pointerEvents = "none";

    }catch (err) {
        alert("Turn off silent mode to hear sound.");
    }
});

function initTimer() {
    const showSkill   = localStorage.getItem("skill-display") === "true";
    const showCombo   = localStorage.getItem("combo-display") === "true";
    const showWorkout = localStorage.getItem("workout-display") === "true";

    if (showSkill && !localStorage.getItem("skillPlan")) {
        alert("Please configure your Skill plan first.");
        return window.location.href = "editSkills.html";
    }
    if (showCombo && !localStorage.getItem("selectedCombos")) {
        alert("Please pick at least one Combo first.");
        return window.location.href = "editCombos.html";
    }
    if (showWorkout && !localStorage.getItem("selectedWorkouts")) {
        alert("Please pick your Workouts before starting.");
        return window.location.href = "editWorkouts.html";
    }

    const roundsSetting   = parseInt(localStorage.getItem("rounds"))     || 12;
    const roundTime       = parseTime(localStorage.getItem("round-time")  || "04:00");
    const restTime        = parseTime(localStorage.getItem("rest-time")   || "00:30");
    const getReadyTime    = parseTime(localStorage.getItem("get-ready-time") || "00:15");

    let currentPhase = "get-ready";
    let currentRound = 0;
    let timeLeft     = getReadyTime;
    let isPaused     = false;

    const phaseTitle   = document.getElementById("phase-title");
    const timerDisplay = document.getElementById("timer-display");
    const comboDisp    = document.getElementById("combo-display");
    const skillDisp    = document.getElementById("skill-display");
    const workoutDisp  = document.getElementById("workout-display");
    const pauseBtn     = document.getElementById("pause-resume");

    function updateBackground() {
        if (currentPhase === "round") {
            document.body.style.backgroundColor = "green";
        } else {
            document.body.style.backgroundColor = "red";
        }
        document.body.style.color = "white";
    }

    function updateDisplays() {
        timerDisplay.textContent = formatTime(timeLeft);
        if (currentPhase === "round") {
            phaseTitle.textContent = `ROUND ${currentRound} OF ${roundsSetting}`;
        } else {
            phaseTitle.textContent = currentPhase.toUpperCase();
        }
        updateBackground();
    }

    function updateExtras() {
        if (currentPhase !== "round") {
            comboDisp.textContent = skillDisp.textContent = workoutDisp.textContent = "";
            return;
        }

        // COMBO
        if (showCombo) {
            const combos = JSON.parse(localStorage.getItem("guestData") || "{}").combos || [];
            comboDisp.textContent = combos.length
                ? `COMBO: ${getRandom(combos).combo.map(m => m.toUpperCase()).join(" + ")}`
                : "";
        } else {
            comboDisp.textContent = "";
        }

        // SKILL
        if (showSkill) {
            const plan = JSON.parse(localStorage.getItem("skillPlan") || "[]");
            const cat = plan[currentRound - 1];
            if (cat) {
                const techs = getSkillDict()[cat];
                if (techs && techs.length) {
                    skillDisp.textContent = `SKILL: ${cat.toUpperCase()} – ${getRandom(techs).toUpperCase()}`;
                }
            }
        } else {
            skillDisp.textContent = "";
        }

        if (showWorkout) {
            const sel = JSON.parse(localStorage.getItem("selectedWorkouts") || "[]");
            const gd  = JSON.parse(localStorage.getItem("guestData") || "{}");
            const all = [];
            (gd.workouts||[]).forEach((c,i) =>
                c.items.forEach((w,j) =>
                    all.push({ id:`${i}-${j}`, category:c.category.toLowerCase(), name:w })
                )
            );
            const chosen = all.filter(w => sel.includes(w.id));
            const upper = chosen.filter(w => w.category==="upper-body");
            const lower = chosen.filter(w => w.category==="lower-body");
            const core  = chosen.filter(w => w.category==="core");

            let txt = "";
            if (roundsSetting===1 || (roundsSetting%2===1 && currentRound===roundsSetting)) {
                const u = getRandom(upper), o = getRandom(core), l = getRandom(lower);
                if (u&&o&&l) txt = `WORKOUT: ${u.name.toUpperCase()} & ${o.name.toUpperCase()} & ${l.name.toUpperCase()}`;
            }
            else if (currentRound%2===1) {
                const u = getRandom(upper), o = getRandom(core);
                if (u&&o) txt = `WORKOUT: ${u.name.toUpperCase()} & ${o.name.toUpperCase()}`;
            }
            else {
                const l = getRandom(lower), o = getRandom(core);
                if (l&&o) txt = `WORKOUT: ${l.name.toUpperCase()} & ${o.name.toUpperCase()}`;
            }

            workoutDisp.textContent = txt;
        } else {
            workoutDisp.textContent = "";
        }
    }

    function nextPhase() {
        const prev = currentPhase;
        switch (currentPhase) {
            case "get-ready":
                currentPhase = "round";
                currentRound = 1;
                timeLeft     = roundTime;
                break;
            case "round":
                if (currentRound < roundsSetting) {
                    currentPhase = "rest";
                    timeLeft     = restTime;
                } else {
                    currentPhase = "finished";
                    timeLeft     = 0;
                    clearInterval(timerInterval);
                }
                break;
            case "rest":
                currentRound++;
                currentPhase = "round";
                timeLeft     = roundTime;
                break;
        }

        if (prev !== "round" && currentPhase === "round") {
            if (audioReady) boxingBell.play();
        }
        updateExtras();
        updateDisplays();
    }

    const timerInterval = setInterval(() => {
        if (!isPaused) {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplays();
                if (timeLeft === 10 && currentPhase === "round") {
                   if (audioReady) sticksClack.play();
                }
            } else {
                if (audioReady) boxingBell.play();
                nextPhase();
            }
        }
    }, 1000);

    pauseBtn.addEventListener("click", () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "Resume" : "Pause";
        updateBackground();
    });

    updateExtras();
    updateDisplays();
}

function parseTime(timeStr) {
    const parts = timeStr.split(":");
    if (parts.length === 2) {
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return parseInt(timeStr, 10);
}
function formatTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

function getSkillDict() {
    const gd = JSON.parse(localStorage.getItem("guestData") || "{}");
    return (gd.skills || []).reduce((o, c) => {
        o[c.category.toLowerCase()] = c.items;
        return o;
    }, {});
}

function getRandom(arr) {
    return arr && arr.length
        ? arr[Math.floor(Math.random() * arr.length)]
        : "";
}

