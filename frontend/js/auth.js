const API_BASE_URL = "http://localhost:5000/api/v1";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    errorMessage.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Login failed"
            );
        }

        const user = result.data.user;
        const token = result.data.token;

        // Store authentication information
        localStorage.setItem("token", token);
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        // Redirect according to role
        if (user.role === "ADMIN") {

            window.location.href =
                "../pages/admin-dashboard.html";

        } else if (user.role === "AUTHORITY") {

            window.location.href =
                "../pages/authority-dashboard.html";

        } else if (user.role === "STUDENT") {

            window.location.href =
                "../pages/student-dashboard.html";

        } else {

            throw new Error("Unknown user role");
        }

    } catch (error) {

        console.error("Login error:", error);

        errorMessage.textContent =
            error.message || "Unable to login";

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});