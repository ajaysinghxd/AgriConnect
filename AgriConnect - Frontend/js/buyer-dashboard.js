/* =========================================================
   BUYER DASHBOARD
========================================================= */

const ORDER_API =
    `${API_BASE_URL}/orders`;

const RENTAL_API =
    `${API_BASE_URL}/rentals`;

const user =
    JSON.parse(
        localStorage.getItem("user")
    );

const token =
    localStorage.getItem("token");

if (
    !user ||
    user.role !== "buyer"
) {

    window.location.href =
        "login.html";

}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(
    amount
) {

    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;

}

function formatDate(
    dateString
) {

    if (!dateString) {
        return "—";
    }

    return new Date(dateString)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}

function orderTotal(
    order
) {

    return (
        Number(order.price) *
        Number(order.quantity || 1)
    );

}

function escapeHtml(
    value
) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}

function statusBadge(
    status,
    fallback
) {

    const label =
        (status || fallback || "confirmed")
            .toLowerCase();

    const safeClass =
        [
            "pending",
            "approved",
            "active",
            "completed",
            "cancelled",
            "confirmed"
        ].includes(label)
            ? label
            : "confirmed";

    return `<span class="status-badge status-badge--${safeClass}">${escapeHtml(label)}</span>`;

}

/* =========================================================
   FETCH DATA
========================================================= */

async function fetchBuyerOrders() {

    const response =
        await fetch(ORDER_API);

    if (!response.ok) {
        throw new Error(
            "Failed to load orders"
        );
    }

    const orders =
        await response.json();

    return orders.filter(
        (order) =>
            order.buyerId?.toString() ===
            user._id?.toString()
    );

}

async function fetchBuyerRentals() {

    const response =
        await fetch(
            RENTAL_API,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    if (!response.ok) {
        return [];
    }

    const rentals =
        await response.json();

    return rentals.filter(
        (rental) =>
            rental.renterId?.toString() ===
            user._id?.toString()
    );

}

/* =========================================================
   STATS
========================================================= */

function updateStats(
    orders,
    rentals
) {

    const totalSpending =
        orders.reduce(
            (sum, order) =>
                sum + orderTotal(order),
            0
        );

    const uniqueProducts =
        new Set(
            orders.map(
                (order) =>
                    `${order.productName}|${order.image}`
            )
        ).size;

    const activeRentals =
        rentals.filter(
            (rental) =>
                [
                    "pending",
                    "approved",
                    "active"
                ].includes(
                    rental.status
                )
        ).length;

    document.getElementById(
        "stat-total-orders"
    ).innerText =
        orders.length;

    document.getElementById(
        "stat-total-spending"
    ).innerText =
        formatCurrency(totalSpending);

    document.getElementById(
        "stat-products-purchased"
    ).innerText =
        uniqueProducts;

    document.getElementById(
        "stat-active-rentals"
    ).innerText =
        activeRentals;

}

/* =========================================================
   PURCHASED PRODUCTS
========================================================= */

function renderPurchasedProducts(
    orders
) {

    const container =
        document.getElementById(
            "purchased-products-grid"
        );

    if (!orders.length) {

        container.innerHTML = `
            <p class="buyer-empty buyer-empty--grid">
                No purchases yet. Explore the marketplace to place your first order.
            </p>
        `;

        return;

    }

    const productMap =
        new Map();

    orders.forEach(
        (order) => {

            const key =
                `${order.productName}|${order.image}`;

            const existing =
                productMap.get(key);

            if (existing) {

                existing.quantity +=
                    Number(order.quantity || 1);

                existing.spent +=
                    orderTotal(order);

                existing.orders += 1;

            }

            else {

                productMap.set(
                    key,
                    {
                        productName:
                            order.productName,
                        farmerName:
                            order.farmerName,
                        location:
                            order.location,
                        image:
                            order.image,
                        price:
                            order.price,
                        quantity:
                            Number(order.quantity || 1),
                        spent:
                            orderTotal(order),
                        orders: 1
                    }
                );

            }

        }
    );

    container.innerHTML =
        Array.from(productMap.values())
            .map(
                (item) => `

                <article class="buyer-product-card">

                    <div
                        class="buyer-card-image"
                        style="background-image:url('${escapeHtml(item.image)}')"
                        role="img"
                        aria-label="${escapeHtml(item.productName)}"
                    ></div>

                    <div class="buyer-card-body">

                        <h4>${escapeHtml(item.productName)}</h4>

                        <p class="buyer-card-meta">
                            Seller: ${escapeHtml(item.farmerName)}
                        </p>

                        <p class="buyer-card-meta">
                            ${escapeHtml(item.location)}
                        </p>

                        <p class="buyer-card-meta">
                            Qty: ${item.quantity} · ${item.orders} order${item.orders > 1 ? "s" : ""}
                        </p>

                        <p class="buyer-card-price">
                            ${formatCurrency(item.spent)}
                        </p>

                        <div class="buyer-card-footer">
                            ${statusBadge("confirmed")}
                            <span class="buyer-card-meta">
                                @ ${formatCurrency(item.price)}/unit
                            </span>
                        </div>

                    </div>

                </article>

                `
            )
            .join("");

}

/* =========================================================
   RENTED EQUIPMENT
========================================================= */

function renderRentedEquipment(
    rentals
) {

    const container =
        document.getElementById(
            "rented-equipment-grid"
        );

    if (!rentals.length) {

        container.innerHTML = `
            <p class="buyer-empty buyer-empty--grid">
                No equipment rentals yet. Browse equipment to book your first rental.
            </p>
        `;

        return;

    }

    container.innerHTML =
        rentals
            .map(
                (rental) => `

                <article class="buyer-rental-card">

                    <div
                        class="buyer-card-image"
                        style="background-image:url('${escapeHtml(rental.image)}')"
                        role="img"
                        aria-label="${escapeHtml(rental.equipmentName)}"
                    ></div>

                    <div class="buyer-card-body">

                        <h4>${escapeHtml(rental.equipmentName)}</h4>

                        <p class="buyer-card-meta">
                            Owner: ${escapeHtml(rental.ownerName)}
                        </p>

                        <p class="buyer-card-meta">
                            ${escapeHtml(rental.location)}
                        </p>

                        <p class="buyer-card-meta">
                            ${rental.totalDays} day${Number(rental.totalDays) > 1 ? "s" : ""} · ${formatDate(rental.startDate)} – ${formatDate(rental.endDate)}
                        </p>

                        <p class="buyer-card-price">
                            ${formatCurrency(rental.totalAmount)}
                        </p>

                        <div class="buyer-card-footer">
                            ${statusBadge(rental.status, "pending")}
                            <span class="buyer-card-meta">
                                ${formatCurrency(rental.rentalPricePerDay)}/day
                            </span>
                        </div>

                    </div>

                </article>

                `
            )
            .join("");

}

/* =========================================================
   RECENT ORDERS
========================================================= */

function renderRecentOrders(
    orders
) {

    const container =
        document.getElementById(
            "recent-orders-container"
        );

    if (!orders.length) {

        container.innerHTML = `
            <p class="buyer-empty">
                No orders yet. Head to the marketplace to start shopping.
            </p>
        `;

        return;

    }

    const recent =
        [...orders]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 10);

    container.innerHTML =
        recent
            .map(
                (order) => `

                <div class="table-row">

                    <span
                        class="buyer-order-product"
                        data-label="Product"
                    >

                        <span
                            class="buyer-order-thumb"
                            style="background-image:url('${escapeHtml(order.image)}')"
                        ></span>

                        <span class="buyer-order-name">
                            ${escapeHtml(order.productName)}
                        </span>

                    </span>

                    <span data-label="Seller">
                        ${escapeHtml(order.farmerName)}
                    </span>

                    <span data-label="Qty">
                        ${Number(order.quantity || 1)}
                    </span>

                    <span data-label="Total">
                        ${formatCurrency(orderTotal(order))}
                    </span>

                    <span data-label="Date">
                        ${formatDate(order.createdAt)}
                    </span>

                </div>

                `
            )
            .join("");

}

/* =========================================================
   SCROLL REVEAL
========================================================= */

function initReveal() {

    const sections =
        document.querySelectorAll(
            ".reveal"
        );

    if (!sections.length) {
        return;
    }

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "active"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );

    sections.forEach(
        (section) =>
            observer.observe(section)
    );

}

/* =========================================================
   LOAD DASHBOARD
========================================================= */

async function loadBuyerDashboard() {

    try {

        const [
            orders,
            rentals
        ] =
            await Promise.all([
                fetchBuyerOrders(),
                fetchBuyerRentals()
            ]);

        updateStats(
            orders,
            rentals
        );

        renderPurchasedProducts(
            orders
        );

        renderRentedEquipment(
            rentals
        );

        renderRecentOrders(
            orders
        );

    }

    catch (error) {

        console.error(error);

        document.getElementById(
            "purchased-products-grid"
        ).innerHTML = `
            <p class="buyer-empty buyer-empty--grid">
                Unable to load dashboard data. Please refresh the page.
            </p>
        `;

        document.getElementById(
            "rented-equipment-grid"
        ).innerHTML = `
            <p class="buyer-empty buyer-empty--grid">
                Unable to load rental data.
            </p>
        `;

        document.getElementById(
            "recent-orders-container"
        ).innerHTML = `
            <p class="buyer-empty">
                Unable to load orders.
            </p>
        `;

    }

}

/* =========================================================
   INITIALIZE
========================================================= */

initReveal();

loadBuyerDashboard();
