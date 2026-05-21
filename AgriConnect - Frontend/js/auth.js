console.log("AUTH JS LOADED");
/* =========================================================
   API URL
========================================================= */

const API_URL =
    "http://https://agriconnect-backend-3yti.onrender.com/api/auth";

/* =========================================================
   INPUT ANIMATION
========================================================= */

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

/* =========================================================
   LOGIN
========================================================= */

const loginForm =
    document.querySelector('#loginForm');

if (loginForm) {

    loginForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();

            const emailInput =
                document.querySelector('#email');

            const passwordInput =
                document.querySelector('#password');

            if (
                !emailInput ||
                !passwordInput
            ) {
                alert(
                    'Login inputs not found'
                );

                return;
            }

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();

            if (!email || !password) {

                alert(
                    'Please fill all fields'
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API_URL}/login`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
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
                        'Login failed'
                    );

                    return;
                }

                localStorage.setItem(
                    'token',
                    data.token
                );

                localStorage.setItem(
                    'user',
                    JSON.stringify(data)
                );

                alert(
                    'Login successful ✅'
                );

                setTimeout(() => {

                    if (data.role === 'farmer') {

                        window.location.href =
                            'farmer-dashboard.html';

                    } else {

                        window.location.href =
                            'buyer-dashboard.html';
                    }

                }, 800);

            }

            catch (error) {

                console.log(error);

                alert(
                    'Server error'
                );
            }
        }
    );
}

/* =========================================================
   SIGNUP
========================================================= */

const signupForm =
    document.querySelector('#signupForm');
console.log(signupForm);
if (signupForm) {

    signupForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();

            const nameInput =
                document.querySelector('#name');

            const emailInput =
                document.querySelector('#email');

            const passwordInput =
                document.querySelector('#password');

            const roleInput =
                document.querySelector('#role');

            if (
                !nameInput ||
                !emailInput ||
                !passwordInput ||
                !roleInput
            ) {
                alert(
                    'Signup inputs not found'
                );

                return;
            }

            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();

            const role =
                roleInput.value;

            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {

                alert(
                    'Please fill all fields'
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API_URL}/register`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
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
                        'Signup failed'
                    );

                    return;
                }

                localStorage.setItem(
                    'token',
                    data.token
                );

                localStorage.setItem(
                    'user',
                    JSON.stringify(data)
                );

                alert(
                    'Account created successfully ✅'
                );

                setTimeout(() => {

                    if (data.role === 'farmer') {

                        window.location.href =
                            'farmer-dashboard.html';

                    } else {

                        window.location.href =
                            'buyer-dashboard.html';
                    }

                }, 800);

            }

            catch (error) {

                console.log(error);

                alert(
                    'Server error'
                );
            }
        }
    );
}