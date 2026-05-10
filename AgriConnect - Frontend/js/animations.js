const reveals = document.querySelectorAll('.reveal');

function revealElements(){

    reveals.forEach((element) => {

        const windowHeight = window.innerHeight;

        const revealTop =
            element.getBoundingClientRect().top;

        const revealPoint = 100;

        if(revealTop < windowHeight - revealPoint){

            element.classList.add('active');

        }

    });

}

window.addEventListener('scroll', revealElements);

revealElements();