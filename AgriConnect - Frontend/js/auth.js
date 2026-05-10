/* =========================
   AUTH INPUT ANIMATION
========================= */

const authInputs =
    document.querySelectorAll(
        '.input-group input, .input-group select'
    );

authInputs.forEach((input) => {

    input.addEventListener('focus', () => {

        input.parentElement.style.transform =
            'translateY(-2px)';

    });

    input.addEventListener('blur', () => {

        input.parentElement.style.transform =
            'translateY(0px)';

    });

});


/* =========================
   API URL
========================= */

const API_URL =
    "http://localhost:5000/api/auth";


/* =========================
   SIGNUP
========================= */

const signupForm =
    document.querySelector(".signup-form");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const name =
                document.querySelector("#signup-name").value;

            const email =
                document.querySelector("#signup-email").value;

            const password =
                document.querySelector("#signup-password").value;

            const role =
                document.querySelector("#signup-role").value;

            try {

                const response =
                    await fetch(
                        `${API_URL}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password,
                                role
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Signup failed"
                    );

                    return;
                }

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );

                alert(
                    "Account created successfully ✅"
                );

                if (data.role === "farmer") {

                    window.location.href =
                        "farmer-dashboard.html";

                }

                else {

                    window.location.href =
                        "buyer-dashboard.html";

                }

            }

            catch (error) {

                console.log(error);

                alert(
                    "Server error"
                );

            }

        }
    );

}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.querySelector(".login-form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
                document.querySelector("#login-email").value;

            const password =
                document.querySelector("#login-password").value;

            try {

                const response =
                    await fetch(
                        `${API_URL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Login failed"
                    );

                    return;
                }

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );

                alert(
                    "Login successful ✅"
                );

                if (data.role === "farmer") {

                    window.location.href =
                        "farmer-dashboard.html";

                }

                else {

                    window.location.href =
                        "buyer-dashboard.html";

                }

            }

            catch (error) {

                console.log(error);

                alert(
                    "Server error"
                );

            }

        }
    );

}