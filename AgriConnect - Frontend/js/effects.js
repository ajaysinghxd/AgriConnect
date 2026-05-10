/* =========================
   CURSOR GLOW
========================= */

const cursorGlow =
    document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {

    cursorGlow.style.left =
        e.clientX + 'px';

    cursorGlow.style.top =
        e.clientY + 'px';

});

/* =========================
   NAVBAR SCROLL EFFECT
========================= */

const navbar =
    document.querySelector('.navbar');

window.addEventListener('scroll', () => {

    if(window.scrollY > 40){

        navbar.classList.add('scrolled');

    }else{

        navbar.classList.remove('scrolled');

    }

});