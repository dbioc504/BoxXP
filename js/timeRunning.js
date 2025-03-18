function parseTime(timeStr) {
    const parts = timeStr.split(":");
    if (parts.length === 2) {
        const minutes = parseInt(parts[0],10);
        const seconds = parseInt(parts[1],10);
        return minutes * 60 + seconds;
    }
    return parseInt(timeStr, 10);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

document.addEventListener("DOMContentLoaded", function() {
    const roundsSetting = parseInt(sessionStorage.getItem("rounds")) || 12;
    const roundTimeStr = sessionStorage.getItem("round-time") || "04:00";
    const restTimeStr = sessionStorage.getItem("rest-time") || "00:30";
    const getReadyTimeStr = sessionStorage.getItem("get-ready-time") || "00:15";

    const roundTime = parseTime(roundTimeStr);
    const restTime = parseTime(restTimeStr);
    const getReadyTime = parseTime(getReadyTimeStr);

    const showSkill = sessionStorage.getItem("skill-display") === "true";
    const showCombo = sessionStorage.getItem("combo-display") === "true";
    const showWorkout = sessionStorage.getItem("workout-display") === "true";

    let currentPhase = "get-ready";
    let currentRound = 0;
    let timeLeft = getReadyTime;
    let isPaused = false;

    const phaseTitle = document.getElementById("phase-title");
    const timerDisplay = document.getElementById("timer-display");
    const roundDisplay = document.getElementById("round-display");

    const comboDisplay = document.getElementById("combo-display");
    const skillDisplay = document.getElementById("skill-display");
    const workoutDisplay = document.getElementById("workout-display");


    function updateDisplays() {
        timerDisplay.textContent = formatTime(timeLeft);
        if (currentPhase === "round") {
            roundDisplay.textContent = `ROUND ${currentRound} OF ${roundsSetting}`;
        } else {
            roundDisplay.textContent = "";
        }
    }

    function getRandomFromArray(arr) {
        if (!arr || arr.length === 0) return "";
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }



    function updateExtras() {
        if (currentPhase === "round") {
            if (showCombo) {
                const guestData = JSON.parse(sessionStorage.getItem("guestData"));
                if (guestData && guestData.combos && guestData.combos.length > 0) {
                    const randomCombo = getRandomFromArray(guestData.combos);
                    comboDisplay.textContent = `Combo: ${randomCombo.combo.join(" + ")}`;
                } else {
                    comboDisplay.textContent = "";
                }
            } else {
                comboDisplay.textContent = "";
            }

            if (showSkill) {
                const guestData = JSON.parse(sessionStorage.getItem("guestData"));
                if (guestData && guestData.skills && guestData.skills.length > 0) {
                    const allSkills = guestData.skills.flatMap(cat => cat.items);
                    const randomSkill = getRandomFromArray(allSkills);
                    skillDisplay.textContent = `Skill: ${randomSkill}`;
                } else {
                    skillDisplay.textContent = "";
                }
            } else {
                skillDisplay.textContent = "";
            }

            if (showWorkout) {
                const selectedIDs = JSON.parse(sessionStorage.getItem("selectedWorkouts")) || [];
                const guestData = JSON.parse(sessionStorage.getItem("guestData"));
                let allWorkouts = [];
                guestData.workouts.forEach((catObj, catIndex) => {
                    catObj.items.forEach((workout, workoutIndex) => {
                        allWorkouts.push({
                            id: `${catIndex}-${workoutIndex}`,
                            category: catObj.category.toLowerCase(), // ensure lowercase for comparison
                            name: workout
                        });
                    });
                });
                const selectedWorkouts = allWorkouts.filter(w => selectedIDs.includes(w.id));
                const upperBody = selectedWorkouts.filter(w => w.category === "upper-body");
                const lowerBody = selectedWorkouts.filter(w => w.category === "lower-body");
                const core = selectedWorkouts.filter(w => w.category === "core");

                let displayText = "";
                if (currentRound % 2 === 1) {
                    const randomUpper = getRandomFromArray(upperBody);
                    const randomCore = getRandomFromArray(core);
                    if (randomUpper && randomCore) {
                        displayText = `WORKOUT: ${randomUpper.name.toUpperCase()} & ${randomCore.name.toUpperCase()}`;
                    }
                } else {
                    const randomLower = getRandomFromArray(lowerBody);
                    const randomCore = getRandomFromArray(core);
                    if (randomLower && randomCore) {
                        displayText = `WORKOUT: ${randomLower.name.toUpperCase()} & ${randomCore.name.toUpperCase()}`;
                    }
                }
                workoutDisplay.textContent = displayText;
            } else {
                workoutDisplay.textContent = "";
            }
        } else {
            comboDisplay.textContent = "";
            skillDisplay.textContent = "";
            workoutDisplay.textContent = "";
        }
    }








    function nextPhase() {
        switch (currentPhase) {
            case "get-ready":
                currentPhase = "round";
                currentRound = 1;
                timeLeft = roundTime;
                phaseTitle.textContent = `ROUND ${currentRound}`;
                updateExtras();
                break;

            case "round":
                if (currentRound < roundsSetting) {
                    currentPhase = "rest";
                    timeLeft = restTime;
                    phaseTitle.textContent = "REST";
                    comboDisplay.textContent ="";
                    skillDisplay.textContent ="";
                    workoutDisplay.textContent ="";
                } else {
                    currentPhase = "finished";
                    phaseTitle.textContent = "WORKOUT COMPLETE!";
                    timeLeft = 0;
                    clearInterval(timerInterval);
                    timerDisplay.textContent = formatTime(timeLeft);
                    return;
                }
                break;

            case "rest":
                currentRound++;
                currentPhase = "round";
                timeLeft = roundTime;
                phaseTitle.textContent = `ROUND ${currentRound}`;
                updateExtras();
                break;

            default:
                console.error("Unexpected phase: ", currentPhase);
        }
        updateDisplays();
    }

    function timerTick() {
        if (!isPaused) {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplays();
            } else {
                nextPhase();
            }
        }
    }

    timerInterval = setInterval(timerTick, 1000);

    const pauseResumeButton = document.getElementById("pause-resume");
    pauseResumeButton.addEventListener("click", function() {
        isPaused = !isPaused;
        pauseResumeButton.textContent = isPaused ? "Resume" : "Pause";
    });

    updateDisplays();
})