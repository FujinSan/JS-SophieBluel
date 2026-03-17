console.log("login.js chargé");
const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Erreur login");
        }

        const data = await response.json();

        // 🔐 stockage du token
        localStorage.setItem("token", data.token);

        // 🔁 redirection
        window.location.href = "index.html";

    } catch (error) {
        errorMessage.textContent = "Email ou mot de passe incorrect";
    }
});