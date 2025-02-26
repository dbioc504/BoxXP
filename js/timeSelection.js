document.addEventListener("DOMContentLoaded", function() {
    loadTimeOptions();
});

function loadTimeOptions() {
    const selectionType = sessionStorage.getItem("time-selection-type");
    const title = document.getElementById("selection-title");
    const timeOptionsContainer = document.getElementById("time-options");

    let timeOptions = [];

    switch (selectionType) {
        case "rounds":
            title.textContent = "ROUNDS";
            timeOptions = [...Array(50).keys()].map(i => i+1);
            break;
        case "round-time":
        case "rest-time":
        case "get-ready-time":
            title.textContent = selectionType.replace("-", " ").toUpperCase();
            timeOptions = [0,15,30,45,60,90,120,180,240];
            break;
        default:
            console.error("Unknown selection type");
            return;
    }

    timeOptions.forEach(time =>{
        const timeElement = document.createElement("div");
        timeElement.className = "time-option";
        timeElement.textContent = selectionType === "rounds" ? time : formatTime(time);
        timeElement.onclick = () => saveSelection(selectionType, time);
        timeOptionsContainer.appendChild(timeElement);
    });
}

function formatTime(seconds) {
    if (seconds >= 60) {
        var minutes = Math.floor(seconds / 60);
        var newSeconds = seconds % 60;
        if (newSeconds === 0) {newSeconds = "00"}
        return `0${minutes}:${newSeconds}`;
    }
    return `${seconds} sec.`;
}

function saveSelection(type, value) {
    const storedValue = type === "rounds" ? value : formatTime(parseInt(value));

    sessionStorage.setItem(type, storedValue);
    window.location.href = "timerSetup.html";
}