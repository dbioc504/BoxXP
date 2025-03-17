document.addEventListener("DOMContentLoaded", () => {
    displayWorkouts();
});

function displayWorkouts() {
    const container = document.getElementById("workouts-container");
    container.innerHTML = "";

    const guestData = JSON.parse(sessionStorage.getItem("guestData"));
    console.log("guesData (workouts):", guestData);

    if(!guestData || !guestData.workouts) {
        container.innerHTML += "<p>No workouts found.</p>";
        return;
    }

    let allWorkouts = [];
    guestData.workouts.forEach((catObj, catIndex) => {
        catObj.items.forEach((workout, workoutIndex) => {
            allWorkouts.push({
                id: `${catIndex}-${workoutIndex}`,
                category: catObj.category,
                name: workout
            });
        });
    });

    let selectedWorkouts = JSON.parse(sessionStorage.getItem("selectedWorkouts")) || [];

    allWorkouts.forEach(workoutObj => {
        const workoutDiv = document.createElement("div");
        workoutDiv.classList.add("selectable-item");
        workoutDiv.dataset.workoutId = workoutObj.id;

        if (selectedWorkouts.includes(workoutObj.id)) {
            workoutDiv.classList.add("selected");
        }

        workoutDiv.textContent = `${workoutObj.name} (${workoutObj.category})`;

        workoutDiv.addEventListener("click", () => {
            workoutDiv.classList.toggle("selected");
            let currentlySelected = [];
            container.querySelectorAll(".selectable-item.selected").forEach(item => {
                currentlySelected.push(item.dataset.workoutId);
            });
            console.log("Selected workouts so far:", currentlySelected);
        });

        container.appendChild(workoutDiv);
    });
}

function saveWorkouts() {
    const container = document.getElementById("workouts-container");
    const selectedElements = container.querySelectorAll(".selectable-item.selected");
    let newSelected = [];
    selectedElements.forEach(item => {
        newSelected.push(item.dataset.workoutId);
    });

    sessionStorage.setItem("selectedWorkouts", JSON.stringify(newSelected));
    console.log("Selected workouts saved:",newSelected);
    window.location.href = "timerSetup.html"
}


