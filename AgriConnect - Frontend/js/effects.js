/* =========================
   CURSOR GLOW
========================= */

const cursorGlow =
    document.querySelector(
        '.cursor-glow'
    );

if (cursorGlow) {

    document.addEventListener(
        'mousemove',
        (e) => {

            cursorGlow.style.left =
                e.clientX + 'px';

            cursorGlow.style.top =
                e.clientY + 'px';

        }
    );

}


/* =========================
   NAVBAR SCROLL EFFECT
========================= */

const navbar =
    document.querySelector(
        '.navbar'
    );

if (navbar) {

    window.addEventListener(
        'scroll',
        () => {

            if (
                window.scrollY > 40
            ) {

                navbar.classList.add(
                    'scrolled'
                );

            }

            else {

                navbar.classList.remove(
                    'scrolled'
                );

            }

        }
    );

}