/* =========================================================
   CART STORE (localStorage)
========================================================= */

const CART_STORAGE_KEY =
    "agriconnect_cart";

const Cart = {

    getItems() {

        try {

            const raw =
                localStorage.getItem(
                    CART_STORAGE_KEY
                );

            return raw
                ? JSON.parse(raw)
                : [];

        }

        catch {

            return [];

        }

    },

    saveItems(
        items
    ) {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(items)
        );

        this.updateBadge();

        window.dispatchEvent(
            new CustomEvent(
                "cart-updated",
                {
                    detail: {
                        items
                    }
                }
            )
        );

    },

    buildKey(
        type,
        id,
        mode
    ) {

        if (
            type === "equipment"
        ) {

            return `equipment-${mode}-${id}`;

        }

        return `product-${id}`;

    },

    addItem(
        item
    ) {

        const items =
            this.getItems();

        const key =
            item.key ||
            this.buildKey(
                item.type,
                item.id,
                item.mode
            );

        const existing =
            items.find(
                (entry) =>
                    entry.key === key
            );

        if (existing) {

            existing.quantity +=
                Number(item.quantity || 1);

            if (
                item.rentalDays &&
                existing.mode === "rent"
            ) {

                existing.rentalDays =
                    item.rentalDays;

            }

        }

        else {

            items.push({
                ...item,
                key,
                quantity:
                    Number(item.quantity || 1)
            });

        }

        this.saveItems(items);

        return items;

    },

    updateQuantity(
        key,
        quantity
    ) {

        const qty =
            Number(quantity);

        if (
            qty < 1
        ) {

            return this.removeItem(key);

        }

        const items =
            this.getItems().map(
                (item) => {

                    if (
                        item.key === key
                    ) {

                        return {
                            ...item,
                            quantity: qty
                        };

                    }

                    return item;

                }
            );

        this.saveItems(items);

        return items;

    },

    updateRentalDays(
        key,
        days
    ) {

        const rentalDays =
            Math.max(
                1,
                Number(days) || 1
            );

        const items =
            this.getItems().map(
                (item) => {

                    if (
                        item.key === key
                    ) {

                        return {
                            ...item,
                            rentalDays
                        };

                    }

                    return item;

                }
            );

        this.saveItems(items);

        return items;

    },

    removeItem(
        key
    ) {

        const items =
            this.getItems().filter(
                (item) =>
                    item.key !== key
            );

        this.saveItems(items);

        return items;

    },

    clear() {

        this.saveItems([]);

    },

    getCount() {

        return this.getItems().reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );

    },

    getLineTotal(
        item
    ) {

        if (
            item.mode === "rent"
        ) {

            const days =
                Number(item.rentalDays || 1);

            return (
                Number(item.rentalPricePerDay || item.price || 0) *
                days *
                Number(item.quantity || 1)
            );

        }

        return (
            Number(item.price || 0) *
            Number(item.quantity || 1)
        );

    },

    getSubtotal() {

        return this.getItems().reduce(
            (sum, item) =>
                sum + this.getLineTotal(item),
            0
        );

    },

    updateBadge() {

        const count =
            this.getCount();

        document
            .querySelectorAll(
                "[data-cart-badge]"
            )
            .forEach(
                (badge) => {

                    badge.textContent =
                        count;

                    badge.hidden =
                        count === 0;

                }
            );

    },

    initNavCart() {

        document
            .querySelectorAll(
                ".nav-buttons"
            )
            .forEach(
                (navButtons) => {

                    if (
                        navButtons.querySelector(
                            ".nav-cart-btn"
                        )
                    ) {
                        return;
                    }

                    const cartBtn =
                        document.createElement(
                            "a"
                        );

                    cartBtn.href =
                        "cart.html";

                    cartBtn.className =
                        "nav-cart-btn";

                    cartBtn.setAttribute(
                        "aria-label",
                        "Shopping cart"
                    );

                    cartBtn.innerHTML = `

                        <span class="nav-cart-icon">
                            🛒
                        </span>

                        <span
                            class="cart-badge"
                            data-cart-badge
                            hidden
                        >
                            0
                        </span>

                    `;

                    navButtons.insertBefore(
                        cartBtn,
                        navButtons.firstChild
                    );

                }
            );

        this.updateBadge();

    }

};

window.Cart = Cart;

/* =========================================================
   ADD TO CART (delegated)
========================================================= */

function handleAddToCartClick(
    event
) {

    const button =
        event.target.closest(
            ".add-cart-btn"
        );

    if (!button) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const type =
        button.dataset.type ||
        "product";

    const mode =
        button.dataset.mode ||
        "buy";

    const item = {

        type,
        mode,
        id:
            button.dataset.id,
        name:
            button.dataset.name,
        price:
            Number(button.dataset.price),
        image:
            button.dataset.image,
        location:
            button.dataset.location,
        sellerName:
            button.dataset.seller,
        sellerId:
            button.dataset.sellerId || "",
        quantity: 1,
        rentalPricePerDay:
            Number(
                button.dataset.rentalPrice || 0
            ),
        rentalDays:
            Number(
                button.dataset.rentalDays || 1
            )

    };

    if (
        !item.id ||
        !item.name
    ) {

        if (
            typeof showToast === "function"
        ) {

            showToast(
                "Unable to add item ❌",
                "error"
            );

        }

        return;

    }

    Cart.addItem(item);

    if (
        typeof showToast === "function"
    ) {

        showToast(
            "Added to cart ✅",
            "success"
        );

    }

}

document.addEventListener(
    "click",
    handleAddToCartClick
);

/* =========================================================
   INIT
========================================================= */

function initCart() {

    Cart.initNavCart();

    Cart.updateBadge();

}

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initCart
    );

}

else {

    initCart();

}

window.addEventListener(
    "storage",
    (event) => {

        if (
            event.key ===
            CART_STORAGE_KEY
        ) {

            Cart.updateBadge();

        }

    }
);
