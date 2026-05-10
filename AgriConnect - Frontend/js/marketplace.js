/* =========================
   FILTER BUTTON ACTIVE STATE
========================= */

const filterButtons =
    document.querySelectorAll('.filter-list button');

filterButtons.forEach((button) => {

    button.addEventListener('click', () => {

        filterButtons.forEach((btn) => {
            btn.classList.remove('active');
        });

        button.classList.add('active');

    });

});

/* =========================
   SEARCH INTERACTION
========================= */

const searchInput =
    document.querySelector('.market-search input');

const productCards =
    document.querySelectorAll('.product-card');

searchInput.addEventListener('keyup', () => {

    const searchValue =
        searchInput.value.toLowerCase();

    productCards.forEach((card) => {

        const productName =
            card.querySelector('h3')
            .innerText
            .toLowerCase();

        const productCategory =
            card.querySelector('.product-category')
            .innerText
            .toLowerCase();

        if(
            productName.includes(searchValue) ||
            productCategory.includes(searchValue)
        ){

            card.style.display = 'block';

        }else{

            card.style.display = 'none';

        }

    });

});

/* =========================
   PRODUCT CARD HOVER TILT
========================= */

productCards.forEach((card) => {

    card.addEventListener('mousemove', (e) => {

        const rect =
            card.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const rotateX =
            ((y - centerY) / 20);

        const rotateY =
            ((centerX - x) / 20);

        card.style.transform =
            `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-10px)
            `;
    });

    card.addEventListener('mouseleave', () => {

        card.style.transform =
            `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0px)
            `;
    });

});