/* =========================
   DASHBOARD NAV ACTIVE
========================= */

const dashboardLinks =
    document.querySelectorAll('.dashboard-nav a');

dashboardLinks.forEach((link) => {

    link.addEventListener('click', () => {

        dashboardLinks.forEach((item) => {
            item.classList.remove('active');
        });

        link.classList.add('active');

    });

});

/* =========================
   STAT CARD HOVER EFFECT
========================= */

const statCards =
    document.querySelectorAll('.stat-card');

statCards.forEach((card) => {

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
            ((y - centerY) / 25);

        const rotateY =
            ((centerX - x) / 25);

        card.style.transform =
            `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-6px)
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