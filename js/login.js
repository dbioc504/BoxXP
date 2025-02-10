document.addEventListener("DOMContentLoaded", () => {
    const createAccountBtn = document.getElementById("create-account-btn");
    const signInBtn = document.getElementById("sign-in-btn");
    const confirmPasswordContainer = document.getElementById("confirm-password-container");

    let isCreatingAccount = false;

    createAccountBtn.addEventListener("click", () => {
        isCreatingAccount = !isCreatingAccount;

        if (isCreatingAccount) {
            confirmPasswordContainer.style.display = "block";
            createAccountBtn.textContent = "Submit Account";
            signInBtn.style.display = "none";
        } else {
            confirmPasswordContainer.style.display = "none";
            createAccountBtn.textContent = "Create Account";
            signInBtn.style.display = "block";
        }
    });

    createAccountBtn.addEventListener("click", () => {
        if (!isCreatingAccount) return;

        const email = document.getElementById("email").value.trim;
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (!email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password must match");
            return;
        }

        console.log("Creating account with: ", { email, password });
    });
});