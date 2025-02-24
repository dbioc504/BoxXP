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
            title.textContent = "Rounds";
            timeOptions = [...Array(20).keys()].map(i => i+1);
            break;
        case "round-time":
        case "rest-time":
        case "get-ready-time":
            title.textContent = selectionType.replace("-", " ").toUpperCase();
            timeOptions = [15,30,45,60,90,120,180,240];
            break;
        default:
            console.error("Unknown selection type");
            return;
    }

    timeOptions.forEach(time =>{
        const timeElement = document.createElement("div");
        timeElement.className = "time-option";
        timeElement.textContent = formatTime(time);
        timeElement.onclick = () => saveSelection(selectionType, time);
        timeOptionsContainer.appendChild(timeElement);
    });
}

function formatTime(seconds) {
    if (seconds >= 60) {
        return `${Math.floor(seconds / 60)} min. ${seconds % 60} sec.`;
    }
    return `${seconds} sec.`;
}

function saveSelection(type, value) {
    sessionStorage.setItem(type, value);
    window.location.href = "timerSetup.html";
}