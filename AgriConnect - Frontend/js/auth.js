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