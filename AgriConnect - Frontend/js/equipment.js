/* =========================================================
   API URL
========================================================= */

const API_URL =
    "http://https://agriconnect-backend-3yti.onrender.com/api/equipment";

/* =========================================================
   GLOBAL STATE
========================================================= */

let allEquipment = [];

let currentCategory =
    "all";

/* =========================================================
   EQUIPMENT CONTAINER
========================================================= */

const equipmentContainer =
    document.getElementById(
        "equipment-container"
    );

/* =========================================================
   LOAD EQUIPMENT
========================================================= */

async function loadEquipment() {

    try {

        equipmentContainer.innerHTML =
            `
            <h2 style="color:white;">
                Loading equipment...
            </h2>
            `;

        const response =
            await fetch(API_URL);

        const equipment =
            await response.json();

        allEquipment = equipment;

        renderEquipment(equipment);

        initializeSearch();

        initializeFilters();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Unable to load equipment ❌",
            "error"
        );

    }

}

/* =========================================================
   RENDER EQUIPMENT
========================================================= */

function renderEquipment(equipment) {

    equipmentContainer.innerHTML = "";

    if (equipment.length === 0) {

        equipmentContainer.innerHTML =
            `
            <h2 style="color:white;">
                No equipment found
            </h2>
            `;

        return;

    }

    equipment.forEach((item) => {

        let badgeClass = "";

        if (item.type === "buy") {

            badgeClass =
                "equipment-buy";

        }

        else if (
            item.type === "rent"
        ) {

            badgeClass =
                "equipment-rent";

        }

        else {

            badgeClass =
                "equipment-both";

        }

        equipmentContainer.innerHTML += `

        <div
            class="product-card equipment-card"
        >

            <div
                class="
                    equipment-type
                    ${badgeClass}
                "
            >
                ${item.type}
            </div>

            <div
                class="product-image"
                style="
                    background-image:
                    url('${item.image}');
                "
            >
            </div>

            <div class="product-content">

                <span class="product-category">
                    ${item.category}
                </span>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${item.description}
                </p>

                <div class="product-meta">

                    <span>
                        ${item.location}
                    </span>

                    <span>
                        ${item.ownerName}
                    </span>

                </div>

                <div class="rental-price">

                    Rental:
                    <span>
                        ₹${item.rentalPricePerDay}/day
                    </span>

                </div>

                <div class="equipment-status">

                    <div class="
                        status-dot
                        ${item.availability
                            ? "status-available"
                            : "status-unavailable"}
                    ">
                    </div>

                    ${item.availability
                        ? "Available"
                        : "Unavailable"}

                </div>

                <div class="equipment-actions product-actions">

                    <button
                        type="button"
                        class="product-view-btn add-cart-btn"
                        data-type="equipment"
                        data-mode="buy"
                        data-id="${item._id}"
                        data-name="${item.name}"
                        data-price="${item.price}"
                        data-seller="${item.ownerName}"
                        data-seller-id="${item.ownerId || ''}"
                        data-location="${item.location}"
                        data-image="${item.image}"
                    >
                        + Cart
                    </button>

                    <button
                        type="button"
                        class="product-view-btn add-cart-btn"
                        data-type="equipment"
                        data-mode="rent"
                        data-id="${item._id}"
                        data-name="${item.name}"
                        data-price="${item.rentalPricePerDay}"
                        data-rental-price="${item.rentalPricePerDay}"
                        data-rental-days="1"
                        data-seller="${item.ownerName}"
                        data-seller-id="${item.ownerId || ''}"
                        data-location="${item.location}"
                        data-image="${item.image}"
                    >
                        + Rent
                    </button>

                    <button
                        type="button"
                        class="product-view-btn buy-equipment-btn"
                    >
                        Buy
                    </button>

                    <button
                        type="button"
                        class="product-view-btn rent-btn"
                    >
                        Rent
                    </button>

                </div>

            </div>

        </div>

        `;

    });

    initializeTiltEffect();

}

/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const searchInput =
        document.querySelector(
            '.market-search input'
        );

    if (!searchInput) return;

    searchInput.addEventListener(
        'keyup',
        () => {

            applyFilters();

        }
    );

}

/* =========================================================
   FILTERS
========================================================= */

function initializeFilters() {

    const filterButtons =
        document.querySelectorAll(
            '.filter-list button'
        );

    filterButtons.forEach((button) => {

        button.addEventListener(
            'click',
            () => {

                filterButtons.forEach((btn) => {

                    btn.classList.remove(
                        'active'
                    );

                });

                button.classList.add(
                    'active'
                );

                currentCategory =
                    button.dataset.category ||
                    "all";

                applyFilters();

            }
        );

    });

}

/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    const searchInput =
        document.querySelector(
            '.market-search input'
        );

    const searchValue =
        searchInput.value
        .toLowerCase();

    const filteredEquipment =
        allEquipment.filter(
            (item) => {

                const matchesSearch =

                    item.name
                    .toLowerCase()
                    .includes(searchValue)

                    ||

                    item.category
                    .toLowerCase()
                    .includes(searchValue);

                const matchesCategory =

                    currentCategory === "all"

                    ||

                    item.category
                    .toLowerCase()

                    ===

                    currentCategory
                    .toLowerCase();

                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );

    renderEquipment(
        filteredEquipment
    );

}

/* =========================================================
   TILT EFFECT
========================================================= */

function initializeTiltEffect() {

    const cards =
        document.querySelectorAll(
            '.product-card'
        );

    cards.forEach((card) => {

        card.addEventListener(
            'mousemove',
            (e) => {

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

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-10px)
                `;

            }
        );

        card.addEventListener(
            'mouseleave',
            () => {

                card.style.transform = `
                    perspective(1000px)
                    rotateX(0deg)
                    rotateY(0deg)
                    translateY(0px)
                `;

            }
        );

    });

}

/* =========================================================
   BUTTON ACTIONS
========================================================= */

document.addEventListener(
    "click",
    async (e) => {

        /* ======================
           RENT EQUIPMENT
        ====================== */

        if (
            e.target.classList.contains(
                "rent-btn"
            )
        ) {

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                );

            if (!user) {

                showToast(
                    "Please login first",
                    "error"
                );

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1200);

                return;
            }

            const card =
                e.target.closest(
                    ".equipment-card"
                );

            const equipmentName =
                card.querySelector("h3")
                .innerText;

            const rentalPrice =
                card.querySelector(
                    ".rental-price span"
                )
                .innerText
                .replace("₹", "")
                .replace("/day", "");

            const ownerName =
                card.querySelectorAll(
                    ".product-meta span"
                )[1]
                .innerText;

            const location =
                card.querySelectorAll(
                    ".product-meta span"
                )[0]
                .innerText;

            const image =
                card.querySelector(
                    ".product-image"
                )
                .style.backgroundImage
                .slice(5, -2);

            const totalDays =
                prompt(
                    "Enter rental days:"
                );

            if (!totalDays) return;

            const totalAmount =
                Number(rentalPrice) *
                Number(totalDays);

            const startDate =
                new Date();

            const endDate =
                new Date();

            endDate.setDate(
                endDate.getDate() +
                Number(totalDays)
            );

            const rentalData = {

                equipmentName,

                equipmentId:
                    "000000000000000000000000",

                renterName:
                    user.name,

                renterId:
                    user._id,

                ownerName,

                ownerId:
                    "000000000000000000000000",

                rentalPricePerDay:
                    rentalPrice,

                totalDays,

                totalAmount,

                startDate,

                endDate,

                location,

                image

            };

            try {

                const response =
                    await fetch(
                        "http://https://agriconnect-backend-3yti.onrender.com/api/rentals",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${localStorage.getItem("token")}`
                            },

                            body:
                                JSON.stringify(
                                    rentalData
                                )
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    showToast(
                        data.message ||
                        "Rental booking failed ❌",
                        "error"
                    );

                    return;
                }

                showToast(
                    "Equipment booked successfully 🚜",
                    "success"
                );

            }

            catch (error) {

                console.log(error);

                showToast(
                    "Server error ❌",
                    "error"
                );

            }

        }

        /* ======================
           BUY EQUIPMENT
        ====================== */

        if (
            e.target.classList.contains(
                "buy-equipment-btn"
            )
        ) {

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                );

            if (!user) {

                showToast(
                    "Please login first",
                    "error"
                );

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1200);

                return;
            }

            const card =
                e.target.closest(
                    ".equipment-card"
                );

            const productName =
                card.querySelector("h3")
                .innerText;

            const quantity =
                Number(
                    prompt(
                        "Enter quantity:"
                    )
                );
            const equipment =
    allEquipment.find(
        (item) =>
            item.name === productName
    );

const price =
    equipment.price * quantity;

            if (!quantity) return;

            const farmerName =
                card.querySelectorAll(
                    ".product-meta span"
                )[1]
                .innerText;

            const location =
                card.querySelectorAll(
                    ".product-meta span"
                )[0]
                .innerText;

            const image =
                card.querySelector(
                    ".product-image"
                )
                .style.backgroundImage
                .slice(5, -2);

            const orderData = {

                productName,

                price,

                quantity,

                buyerName:
                    user.name,

                buyerId:
                    user._id,

                farmerName,

                farmerId:
                    "000000000000000000000000",

                location,

                image

            };

            try {

                const response =
                    await fetch(
                        "http://https://agriconnect-backend-3yti.onrender.com/api/orders",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    showToast(
                        data.message ||
                        "Purchase failed ❌",
                        "error"
                    );

                    return;
                }

                showToast(
                    "Equipment purchased successfully 🛒",
                    "success"
                );

            }

            catch (error) {

                console.log(error);

                showToast(
                    "Server error ❌",
                    "error"
                );

            }

        }

    }
);

/* =========================================================
   INITIALIZE
========================================================= */

loadEquipment();
