document.addEventListener("DOMContentLoaded", () => {
    loadTimerSettings();
    const savedWorkouts = JSON.parse(localStorage.getItem("selectedWorkouts"));
    console.log("Saved Workouts:", savedWorkouts);

    const savedCombos = JSON.parse(localStorage.getItem("selectedCombos"));
    console.log("Saved Combos:", savedCombos);
})

function loadTimerSettings() {
    document.getElementById("rounds-value").textContent = localStorage.getItem("rounds") || 12;
    document.getElementById("round-time-value").textContent = localStorage.getItem("round-time") || "4:00";
    document.getElementById("rest-time-value").textContent = localStorage.getItem("rest-time") || "0:30";
    document.getElementById("get-ready-time-value").textContent = localStorage.getItem("get-ready-time") || "0:15";

    document.getElementById("skill-toggle").checked = localStorage.getItem("skill-display") === "true";
    document.getElementById("combo-toggle").checked = localStorage.getItem("combo-display") === "true";
    document.getElementById("workout-toggle").checked = localStorage.getItem("workout-display") === "true";
}

function navigateToSelection(type) {
    localStorage.setItem("time-selection-type", type);
    window.location.href = "timeSelection.html";
}

document.getElementById("skill-toggle").addEventListener("change", (e) => {
    localStorage.setItem("skill-display", e.target.checked);
});

document.getElementById("combo-toggle").addEventListener("change", (e) => {
    localStorage.setItem("combo-display", e.target.checked);
});

document.getElementById("workout-toggle").addEventListener("change", (e) => {
    if (e.target.checked) {
        document.getElementById("skill-toggle").checked = false;
        document.getElementById("combo-toggle").checked = false;
        localStorage.setItem("skill-display", "false");
        localStorage.setItem("combo-display", "false");
        localStorage.setItem("workout-display", "true");
    } else {
        localStorage.setItem("workout-display", "false");
    }
});

function startTimer() {
    let message = "";
    if (localStorage.getItem("skill-display") === "true" && !localStorage.getItem("skillPlan")) {
        message += "Please visit the Edit Skills page to configure your skill display.\n";
    }
    if (localStorage.getItem("combo-display") === "true" && !localStorage.getItem("selectedCombos")) {
        message += "Please visit the Edit Combos page to configure your combo display.\n";
    }
    if (localStorage.getItem("workout-display") === "true" && !localStorage.getItem("selectedWorkouts")) {
        message += "PLease visit the Edit Workouts page to configure your workout display.\n";
    }

    if (message !== "") {
        alert(message);
        return;
    }
    window.location.href = "timeRunning.html";
}

function openSkillEditor() {
    window.location.href = "editSkills.html";
}

function openComboEditor() {
    window.location.href = "editCombos.html";
}

function openWorkoutEditor() {
    window.location.href = "editWorkouts.html";
}

document.getElementById("combo-toggle").addEventListener("change", (e) => {
    if (e.target.checked) {
        document.getElementById("workout-toggle").checked = false;
        localStorage.setItem("workout-display", "false");
    }
    localStorage.setItem("combo-display", e.target.checked);
});

document.getElementById("workout-toggle").addEventListener("change", (e) => {
    if (e.target.checked) {
        document.getElementById("combo-toggle").checked = false;
        localStorage.setItem("combo-display", "false");
    }
    localStorage.setItem("workout-display", e.target.checked);
});
