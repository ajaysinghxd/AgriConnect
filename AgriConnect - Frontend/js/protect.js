/* =========================================================
   AUTH PROTECTION
========================================================= */

const authToken =
    localStorage.getItem(
        'token'
    );

const authUser =
    JSON.parse(
        localStorage.getItem(
            'user'
        )
    );

/* =========================================================
   NOT LOGGED IN
========================================================= */

if (
    !authToken ||
    !authUser
) {

    window.location.href =
        'login.html';
}

/* =========================================================
   ROLE PROTECTION
========================================================= */

if (
    window.location.pathname.includes(
        'farmer-dashboard.html'
    )
) {

    if (
        authUser.role !==
        'farmer'
    ) {

        alert(
            'Access denied'
        );

        window.location.href =
            'login.html';
    }
}

if (
    window.location.pathname.includes(
        'buyer-dashboard.html'
    )
) {

    if (
        authUser.role !==
        'buyer'
    ) {

        alert(
            'Access denied'
        );

        window.location.href =
            'login.html';
    }
}

/* =========================================================
   USER NAME
========================================================= */

const welcomeUser =
    document.querySelector(
        '#welcome-user'
    );

if (
    welcomeUser &&
    authUser?.name
) {

    welcomeUser.innerText =
        `Welcome Back, ${authUser.name}`;
}