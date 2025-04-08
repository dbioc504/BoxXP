// let storedData = sessionStorage.getItem('guestData');
// if (storedData) {
//     appData = JSON.parse(storedData);
// } else {
//     appData = {
//         user: "guestData",
//         skills: [
//             { category: "dogwork", items: ["Combo-Angle-Combo", "Left Hook(s)", "Combo-Roll-Combo"]},
//             { category: "pressure", items: ["Forward Shuffle", "Cut Off Ring", "Left Hand Up, Roll Head Inside"] },
//             { category: "boxing", items: ["Shuffle and Tick", "Stand Ground, Block Combo, Combo, Shuffle Out"]}
//         ],
//         workouts: [
//             { category: "upper-body", items: ["Pushups", "Dips", "Shoulder Press"] },
//             { category: "lower-body", items: ["Squats", "Squat Jumps", "Deadlifts"] },
//             { category: "core", items: ["Russian Twists", "Dumbell Rack Marches"] }
//         ],
//         combos: [
//             { id: 1, combo: ["jab", "jab", "roll", "flurry"]},
//             { id: 2, combo: ["slip", "jab", "jab", "fake", "roll", "hook", "right hand"]}
//         ]
//     };
//     sessionStorage.setItem('guestData', JSON.stringify(appData));
// }

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

    const guestData = JSON.parse(sessionStorage.getItem("guestData"));
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

    let selectedByCategory = {};
    newSelected.forEach(id => {
        const workout = allWorkouts.find(w => w.id === id);
        if (workout) {
            if (!selectedByCategory[workout.category]) {
                selectedByCategory[workout.category] = [];
            }
            selectedByCategory[workout.category].push(workout);
        }
    });

    const requiredCategories = ["upper-body", "lower-body", "core"];
    for (const category of requiredCategories) {
        if (!selectedByCategory[category] || selectedByCategory[category].length === 0) {
            alert("Please select at least one workout from each category: upper-body, lower-body, and core.");
            return;
        }}

    sessionStorage.setItem("selectedWorkouts", JSON.stringify(newSelected));
    console.log("Selected workouts saved:", newSelected);
    window.location.href = "timerSetup.html";
}