(() => {
    const ENDPOINT        = "./sql_connection.php";
    const createBtn       = document.getElementById("create-account-btn");
    const signInBtn       = document.getElementById("sign-in-btn");
    const confirmPassCont = document.getElementById("confirm-password-container");
    let isCreateMode      = false;

    async function postAuth(formData) {
        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const text = await res.text();
            console.log("[RAW RESPONSE]", text);

            const json = JSON.parse(text);
            console.log("[PARSED JSON]", json);
            return json;
        } catch (err) {
            console.error("[ERROR] Failed to parse or fetch:", err);
            return { status: "error", message: "Bad server response" };
        }
    }

    createBtn.addEventListener("click", async () => {
        if (!isCreateMode) {
            isCreateMode = true;
            confirmPassCont.style.display = "block";
            createBtn.textContent = "Submit Account";
            signInBtn.style.display = "none";
            return;
        }

        const email    = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirm  = document.getElementById("confirm-password").value.trim();

        if (!email || !password || !confirm) return alert("Fill in all fields.");
        if (password !== confirm) return alert("Passwords must match.");

        const form = new FormData();
        form.set("create_account", "1");
        form.set("email", email);
        form.set("password", password);

        const json = await postAuth(form);
        if (json.status === "success") {
            localStorage.setItem("currentUser", email);
            appData.user = email;
            console.log("[ACCOUNT CREATED] Redirecting to index.html...");
            window.location.href = "index.html";
        } else {
            alert(json.message);
        }
    });

    signInBtn.addEventListener("click", async () => {
        const email    = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) return alert("Enter both email and password.");

        const form = new FormData();
        form.set("sign_in", "1");
        form.set("email", email);
        form.set("password", password);

        const json = await postAuth(form);
        if (json.status === "success") {
            localStorage.setItem("currentUser", email);
            console.log("[LOGIN SUCCESS] Redirecting to index.html...");
            window.location.href = "index.html";
            appData.user = email
        } else {
            alert(json.message);
        }
    });
})();
