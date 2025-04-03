document.addEventListener("DOMContentLoaded", () => {
    loadTimerSettings();
    const savedWorkouts = JSON.parse(sessionStorage.getItem("selectedWorkouts"));
    console.log("Saved Workouts:", savedWorkouts);

    const savedCombos = JSON.parse(sessionStorage.getItem("selectedCombos"));
    console.log("Saved Combos:", savedCombos);
})

function loadTimerSettings() {
    document.getElementById("rounds-value").textContent = sessionStorage.getItem("rounds") || 12;
    document.getElementById("round-time-value").textContent = sessionStorage.getItem("round-time") || "4:00";
    document.getElementById("rest-time-value").textContent = sessionStorage.getItem("rest-time") || "0:30";
    document.getElementById("get-ready-time-value").textContent = sessionStorage.getItem("get-ready-time") || "0:15";

    document.getElementById("skill-toggle").checked = sessionStorage.getItem("skill-display") === "true";
    document.getElementById("combo-toggle").checked = sessionStorage.getItem("combo-display") === "true";
    document.getElementById("workout-toggle").checked = sessionStorage.getItem("workout-display") === "true";
}

function navigateToSelection(type) {
    sessionStorage.setItem("time-selection-type", type);
    window.location.href = "timeSelection.html";
}

document.getElementById("skill-toggle").addEventListener("change", (e) => {
    sessionStorage.setItem("skill-display", e.target.checked);
});

document.getElementById("combo-toggle").addEventListener("change", (e) => {
    sessionStorage.setItem("combo-display", e.target.checked);
});

document.getElementById("workout-toggle").addEventListener("change", (e) => {
    if (e.target.checked) {
        document.getElementById("skill-toggle").checked = false;
        document.getElementById("combo-toggle").checked = false;
        sessionStorage.setItem("skill-display", "false");
        sessionStorage.setItem("combo-display", "false");
        sessionStorage.setItem("workout-display", "true");
    } else {
        sessionStorage.setItem("workout-display", "false");
    }
});

function startTimer() {
    let message = "";
    if (sessionStorage.getItem("skill-display") === "true" && !sessionStorage.getItem("skillPlan")) {
        message += "Please visit the Edit Skills page to configure your skill display.\n";
    }
    if (sessionStorage.getItem("combo-display") === "true" && !sessionStorage.getItem("selectedCombos")) {
        message += "Please visit the Edit Combos page to configure your combo display.\n";
    }
    if (sessionStorage.getItem("workout-display") === "true" && !sessionStorage.getItem("selectedWorkouts")) {
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
        sessionStorage.setItem("workout-display", "false");
    }
    sessionStorage.setItem("combo-display", e.target.checked);
});

document.getElementById("workout-toggle").addEventListener("change", (e) => {
    if (e.target.checked) {
        document.getElementById("combo-toggle").checked = false;
        sessionStorage.setItem("combo-display", "false");
    }
    sessionStorage.setItem("workout-display", e.target.checked);
});
