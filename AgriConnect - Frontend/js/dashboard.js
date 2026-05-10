/* =========================
   AUTH PROTECTION
========================= */

const currentUser =
    JSON.parse(
        localStorage.getItem("user")
    );

const token =
    localStorage.getItem("token");

if (!currentUser || !token) {

    window.location.href =
        "login.html";

}


/* =========================
   ROLE PROTECTION
========================= */

const currentPage =
    window.location.pathname;

if (
    currentPage.includes(
        "buyer-dashboard"
    ) &&
    currentUser.role !== "buyer"
) {

    window.location.href =
        "login.html";

}

if (
    currentPage.includes(
        "farmer-dashboard"
    ) &&
    currentUser.role !== "farmer"
) {

    window.location.href =
        "login.html";

}


/* =========================
   DASHBOARD NAV ACTIVE
========================= */

const dashboardLinks =
    document.querySelectorAll(
        '.dashboard-nav a'
    );

dashboardLinks.forEach((link) => {

    link.addEventListener(
        'click',
        () => {

            dashboardLinks.forEach((item) => {

                item.classList.remove(
                    'active'
                );

            });

            link.classList.add(
                'active'
            );

        }
    );

});


/* =========================
   STAT CARD HOVER EFFECT
========================= */

const statCards =
    document.querySelectorAll(
        '.stat-card'
    );

statCards.forEach((card) => {

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
                ((y - centerY) / 25);

            const rotateY =
                ((centerX - x) / 25);

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
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


/* =========================
   LIVE USER INFO
========================= */

const welcomeUser =
    document.getElementById(
        "welcome-user"
    );

if (
    welcomeUser &&
    currentUser
) {

    welcomeUser.innerText =
        `Welcome Back, ${currentUser.name}`;

}


/* =========================
   LOGOUT BUTTON
========================= */

const sidebar =
    document.querySelector(
        ".dashboard-nav"
    );

if (sidebar) {

    const logoutButton =
        document.createElement("a");

    logoutButton.innerText =
        "Logout";

    logoutButton.href = "#";

    logoutButton.style.marginTop =
        "20px";

    logoutButton.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";

        }
    );

    sidebar.appendChild(
        logoutButton
    );

}


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
   LOAD BUYER ORDERS
========================= */

const ordersContainer =
    document.getElementById(
        "orders-container"
    );

async function loadOrders() {

    if (!ordersContainer) return;

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

        const allOrders =
            await response.json();

        const orders =
            allOrders.filter(
                (order) =>

                    order.buyerName ===
                    currentUser.name
            );

        ordersContainer.innerHTML = "";

        orders.forEach((order) => {

            ordersContainer.innerHTML += `

            <div class="table-row">

                <span>
                    ${order.productName}
                </span>

                <span>
                    ${order.farmerName}
                </span>

                <span>
                    Ordered
                </span>

                <span>
                    ₹${order.price}
                </span>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}


/* =========================
   BUYER ANALYTICS
========================= */

async function loadBuyerAnalytics() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

        const allOrders =
            await response.json();

        const orders =
            allOrders.filter(
                (order) =>

                    order.buyerName ===
                    currentUser.name
            );

        const totalOrders =
            orders.length;

        const totalSpending =
            orders.reduce(
                (sum, order) =>
                    sum + Number(order.price),
                0
            );

        const totalOrdersElement =
            document.getElementById(
                "total-orders"
            );

        if (totalOrdersElement) {

            totalOrdersElement.innerText =
                totalOrders;

        }

        const spendingElement =
            document.getElementById(
                "total-spending"
            );

        if (spendingElement) {

            spendingElement.innerText =
                `₹${totalSpending}`;

        }

        const activeOrdersElement =
            document.getElementById(
                "active-orders"
            );

        if (activeOrdersElement) {

            activeOrdersElement.innerText =
                totalOrders;

        }

        const marketOrders =
            document.getElementById(
                "market-orders"
            );

        if (marketOrders) {

            marketOrders.innerText =
                totalOrders;

        }

        const topProduct =
            document.getElementById(
                "top-product"
            );

        if (
            topProduct &&
            orders.length > 0
        ) {

            topProduct.innerText =
                orders[0].productName;

        }

    }

    catch (error) {

        console.log(error);

    }

}


/* =========================
   FARMER PRODUCTS
========================= */

const farmerProductsContainer =
    document.getElementById(
        "farmer-products-container"
    );

async function loadFarmerProducts() {

    if (!farmerProductsContainer) return;

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/products"
            );

        const allProducts =
            await response.json();

        const products =
            allProducts.filter(
                (product) =>

                    product.farmerName ===
                    currentUser.name
            );

        farmerProductsContainer.innerHTML =
            "";

        let revenue = 0;

        products.forEach((product) => {

            revenue +=
                Number(product.price);

            farmerProductsContainer.innerHTML += `

            <div class="table-row">

                <span>
                    ${product.name}
                </span>

                <span>
                    ${product.category}
                </span>

                <span>
                    ${product.quantity}
                </span>

                <span>
                    ₹${product.price}
                </span>

                <span>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct('${product._id}')"
                    >
                        Delete
                    </button>

                </span>

            </div>

            `;

        });

        const productCount =
            document.getElementById(
                "farmer-products"
            );

        if (productCount) {

            productCount.innerText =
                products.length;

        }

        const revenueElement =
            document.getElementById(
                "farmer-revenue"
            );

        if (revenueElement) {

            revenueElement.innerText =
                `₹${revenue}`;

        }

        const customerElement =
            document.getElementById(
                "farmer-customers"
            );

        if (customerElement) {

            customerElement.innerText =
                products.length * 3;

        }

    }

    catch (error) {

        console.log(error);

    }

}


/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Delete this product?"
        );

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }

        showToast(
            "Product deleted successfully ✅",
            "success"
        );

        loadFarmerProducts();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Unable to delete product ❌",
            "error"
        );

    }

}


/* =========================
   FARMER ORDERS
========================= */

async function loadFarmerOrders() {

    const farmerOrders =
        document.getElementById(
            "farmer-orders"
        );

    if (!farmerOrders) return;

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

        const allOrders =
            await response.json();

        const orders =
            allOrders.filter(
                (order) =>

                    order.farmerName ===
                    currentUser.name
            );

        farmerOrders.innerText =
            orders.length;

    }

    catch (error) {

        console.log(error);

    }

}


/* =========================
   PRODUCT UPLOAD MODAL
========================= */

const uploadModal =
    document.getElementById(
        "upload-modal"
    );

const openUploadModal =
    document.getElementById(
        "open-upload-modal"
    );

if (
    uploadModal &&
    openUploadModal
) {

    openUploadModal.addEventListener(
        "click",
        () => {

            uploadModal.classList.add(
                "active"
            );

        }
    );

    uploadModal.addEventListener(
        "click",
        (e) => {

            if (
                e.target === uploadModal
            ) {

                uploadModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================
   PRODUCT UPLOAD
========================= */

const uploadForm =
    document.getElementById(
        "upload-product-form"
    );

if (uploadForm) {

    uploadForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            try {

                /* =========================
                   IMAGE FILE
                ========================= */

                const imageFile =
                    document.getElementById(
                        "product-image"
                    ).files[0];

                if (!imageFile) {

                    showToast(
                        "Please select an image",
                        "error"
                    );

                    return;
                }

                /* =========================
                   CLOUDINARY UPLOAD
                ========================= */

                const cloudData =
                    new FormData();

                cloudData.append(
                    "file",
                    imageFile
                );

                cloudData.append(
                    "upload_preset",
                    "agriconnect"
                );

                const cloudResponse =
                    await fetch(
                        "https://api.cloudinary.com/v1_1/dcperleac/image/upload",
                        {
                            method: "POST",

                            body: cloudData
                        }
                    );

                const cloudResult =
                    await cloudResponse.json();

                if (!cloudResult.secure_url) {

                    showToast(
                        "Image upload failed",
                        "error"
                    );

                    return;
                }

                const imageUrl =
                    cloudResult.secure_url;

                /* =========================
                   PRODUCT DATA
                ========================= */

                const productData = {

                    name:
                        document.getElementById(
                            "product-name"
                        ).value,

                    price:
                        document.getElementById(
                            "product-price"
                        ).value,

                    quantity:
                        document.getElementById(
                            "product-quantity"
                        ).value,

                    location:
                        document.getElementById(
                            "product-location"
                        ).value,

                    farmerName:
                        currentUser.name,

                    farmerId:
                        currentUser._id,

                    category:
                        document.getElementById(
                            "product-category"
                        ).value,

                    image:
                        imageUrl
                };

                /* =========================
                   SAVE PRODUCT
                ========================= */

                const response =
                    await fetch(
                        "http://localhost:5000/api/products",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${localStorage.getItem("token")}`
                            },

                            body: JSON.stringify(
                                productData
                            )
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    showToast(
                        data.message ||
                        "Upload failed",
                        "error"
                    );

                    return;

                }

                showToast(
                    "Product uploaded successfully ✅",
                    "success"
                );

                uploadForm.reset();

                uploadModal.classList.remove(
                    "active"
                );

                loadFarmerProducts();

            }

            catch (error) {

                console.log(error);

                showToast(
                    "Server error ❌",
                    "error"
                );

            }

        }
    );

}
/* =========================
   LIVE CHART ANALYTICS
========================= */

async function loadOrdersChart() {

    const chartCanvas =
        document.getElementById(
            "ordersChart"
        );

    if (!chartCanvas) return;

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

        const allOrders =
            await response.json();

        const orders =
            allOrders.filter(
                (order) =>

                    order.buyerName ===
                    currentUser.name
            );

        const labels =
            orders.map(
                (order, index) =>
                    `Order ${index + 1}`
            );

        const prices =
            orders.map(
                (order) =>
                    Number(order.price)
            );

        new Chart(
            chartCanvas,
            {
                type: "line",

                data: {

                    labels,

                    datasets: [
                        {

                            label:
                                "Order Spending",

                            data: prices,

                            borderColor:
                                "#4ade80",

                            backgroundColor:
                                "rgba(74,222,128,0.15)",

                            borderWidth: 3,

                            tension: 0.4,

                            fill: true,

                            pointRadius: 5,

                            pointBackgroundColor:
                                "#ffffff"
                        }
                    ]
                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#ffffff"
                            }
                        }
                    },

                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "#cbd5e1"
                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"
                            }
                        },

                        y: {

                            ticks: {

                                color:
                                    "#cbd5e1"
                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"
                            }
                        }
                    }
                }
            }
        );

    }

    catch (error) {

        console.log(error);

    }

}
/* =========================
   LIVE WEATHER API
========================= */

async function loadWeather() {

    try {

        const response =
            await fetch(
                "https://api.openweathermap.org/data/2.5/weather?q=Bangalore&units=metric&appid=98a8af6932e2428ec3d6241791433167"
            );

        const data =
            await response.json();

        const temperature =
            Math.round(
                data.main.temp
            );

        const humidity =
            data.main.humidity;

        const wind =
            data.wind.speed;

        const condition =
            data.weather[0].main;

        document.getElementById(
            "weather-temp"
        ).innerText =
            `${temperature}°C`;

        document.getElementById(
            "weather-condition"
        ).innerText =
            condition;

        document.getElementById(
            "weather-humidity"
        ).innerText =
            `${humidity}%`;

        document.getElementById(
            "weather-wind"
        ).innerText =
            `${wind} km/h`;

    }

    catch (error) {

        console.log(error);

    }

}
/* =========================
   AI CROP RECOMMENDATION
========================= */

const predictBtn =
    document.getElementById(
        "predict-btn"
    );

if (predictBtn) {

    predictBtn.addEventListener(
        "click",
        () => {

            const soil =
                document.getElementById(
                    "soil-type"
                ).value;

            const season =
                document.getElementById(
                    "season"
                ).value;

            const temperature =
                Number(
                    document.getElementById(
                        "temperature"
                    ).value
                );

            const result =
                document.getElementById(
                    "crop-result"
                );

            if (
                !soil ||
                !season ||
                !temperature
            ) {

                result.innerText =
                    "Please fill all fields.";

                return;
            }

            let recommendation =
                "";

            if (
                soil === "black" &&
                season === "monsoon"
            ) {

                recommendation =
                    "Recommended Crops: Cotton, Soybean, Jowar";

            }

            else if (
                soil === "red" &&
                season === "summer"
            ) {

                recommendation =
                    "Recommended Crops: Groundnut, Millet, Pulses";

            }

            else if (
                soil === "clay" &&
                temperature < 25
            ) {

                recommendation =
                    "Recommended Crops: Rice, Broccoli, Cabbage";

            }

            else if (
                soil === "sandy"
            ) {

                recommendation =
                    "Recommended Crops: Watermelon, Coconut, Groundnut";

            }

            else {

                recommendation =
                    "Recommended Crops: Tomato, Onion, Maize";

            }

            result.innerText =
                recommendation;

        }
    );

}
/* =========================
   INITIALIZE
========================= */

loadOrders();

loadBuyerAnalytics();

loadFarmerProducts();

loadFarmerOrders();

loadOrdersChart();

loadWeather();