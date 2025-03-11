document.addEventListener("DOMContentLoaded", () => {
    loadTimerSettings();
    const savedWorkouts = JSON.parse(localStorage.getItem("selectedWorkouts"));
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
    sessionStorage.setItem("workout-display", e.target.checked);
});

function startTimer() {
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