/* =========================
   API URL
========================= */

const API_URL =
    "http://localhost:5000/api/products";


/* =========================
   GLOBAL STATE
========================= */

let allProducts = [];

let currentCategory =
    "all";


/* =========================
   PRODUCT CONTAINER
========================= */

const productsContainer =
    document.getElementById(
        "market-products"
    );


/* =========================
   PREMIUM TOAST SYSTEM
========================= */

function showToast(
    message,
    type = "info"
) {

    let toastContainer =
        document.querySelector(
            ".toast-container"
        );

    if (!toastContainer) {

        toastContainer =
            document.createElement(
                "div"
            );

        toastContainer.className =
            "toast-container";

        document.body.appendChild(
            toastContainer
        );

    }

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.innerHTML = `

        <span>
            ${message}
        </span>

        <span class="toast-close">
            ✕
        </span>

    `;

    toastContainer.appendChild(
        toast
    );

    toast
        .querySelector(".toast-close")
        .addEventListener(
            "click",
            () => {

                toast.remove();

            }
        );

    setTimeout(() => {

        toast.remove();

    }, 4000);

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    try {

        productsContainer.innerHTML =
            `<h2 style="color:white;">Loading products...</h2>`;

        const response =
            await fetch(API_URL);

        const products =
            await response.json();

        allProducts = products;

        renderProducts(products);

        initializeSearch();

        initializeFilters();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Unable to load products ❌",
            "error"
        );

    }

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(products) {

    productsContainer.innerHTML = "";

    if (products.length === 0) {

        productsContainer.innerHTML = `

            <h2 style="color:white;">
                No products found
            </h2>

        `;

        return;

    }

    products.forEach((product) => {

        productsContainer.innerHTML += `

        <div
            class="product-card"
            data-category="${product.category.toLowerCase()}"
        >

            <div
                class="product-image"
                style="
                    background-image:
                    url('${product.image}');
                ">
            </div>

            <div class="product-content">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    Fresh agricultural product
                    directly from farmers.
                </p>

                <div class="product-meta">

                    <span>
                        ${product.location}
                    </span>

                    <span>
                        ${product.farmerName}
                    </span>

                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        ₹${product.price}
                    </span>

                    <button
                        class="product-view-btn buy-btn"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-farmer="${product.farmerName}"
                        data-location="${product.location}"
                        data-image="${product.image}"
                    >
                        Buy Now
                    </button>

                </div>

            </div>

        </div>

        `;

    });

    initializeTiltEffect();

}


/* =========================
   SEARCH
========================= */

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


/* =========================
   FILTER BUTTONS
========================= */

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


/* =========================
   APPLY FILTERS
========================= */

function applyFilters() {

    const searchInput =
        document.querySelector(
            '.market-search input'
        );

    const searchValue =
        searchInput.value
        .toLowerCase();

    const filteredProducts =
        allProducts.filter(
            (product) => {

                const matchesSearch =

                    product.name
                    .toLowerCase()
                    .includes(searchValue)

                    ||

                    product.category
                    .toLowerCase()
                    .includes(searchValue);

                const matchesCategory =

                    currentCategory === "all"

                    ||

                    product.category
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

    renderProducts(
        filteredProducts
    );

}


/* =========================
   CARD TILT EFFECT
========================= */

function initializeTiltEffect() {

    const productCards =
        document.querySelectorAll(
            '.product-card'
        );

    productCards.forEach((card) => {

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


/* =========================
   BUY PRODUCT
========================= */

document.addEventListener(
    "click",
    async (e) => {

        if (
            e.target.classList.contains(
                "buy-btn"
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

            const orderData = {

                productName:
                    e.target.dataset.name,

                price:
                    e.target.dataset.price,

                quantity: 1,

                buyerName:
                    user.name,

                buyerId:
                    user._id,

                farmerName:
                    e.target.dataset.farmer,

                location:
                    e.target.dataset.location,

                image:
                    e.target.dataset.image

            };

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/orders",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${localStorage.getItem("token")}`
                            },

                            body: JSON.stringify(
                                orderData
                            )
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    showToast(
                        data.message ||
                        "Order failed ❌",
                        "error"
                    );

                    return;

                }

                showToast(
                    "Order placed successfully ✅",
                    "success"
                );

                console.log(data);

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


/* =========================
   INITIALIZE
========================= */

loadProducts();