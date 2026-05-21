/* =========================================================
   CART PAGE
========================================================= */

const cartListEl =
    document.getElementById(
        "cart-items-list"
    );

const cartEmptyEl =
    document.getElementById(
        "cart-empty"
    );

const cartContentEl =
    document.getElementById(
        "cart-content"
    );

const subtotalEl =
    document.getElementById(
        "cart-subtotal"
    );

const totalEl =
    document.getElementById(
        "cart-total"
    );

const itemCountEl =
    document.getElementById(
        "cart-item-count"
    );

const checkoutBtn =
    document.getElementById(
        "cart-checkout-btn"
    );

function renderCart() {

    const items =
        Cart.getItems();

    const count =
        Cart.getCount();

    const subtotal =
        Cart.getSubtotal();

    if (
        itemCountEl
    ) {

        itemCountEl.textContent =
            `${count} item${count === 1 ? "" : "s"}`;

    }

    if (
        subtotalEl
    ) {

        subtotalEl.textContent =
            formatCurrency(subtotal);

    }

    if (
        totalEl
    ) {

        totalEl.textContent =
            formatCurrency(subtotal);

    }

    if (
        !items.length
    ) {

        if (
            cartContentEl
        ) {
            cartContentEl.hidden = true;
        }

        if (
            cartEmptyEl
        ) {
            cartEmptyEl.hidden = false;
        }

        if (
            checkoutBtn
        ) {
            checkoutBtn.disabled = true;
        }

        return;

    }

    if (
        cartContentEl
    ) {
        cartContentEl.hidden = false;
    }

    if (
        cartEmptyEl
    ) {
        cartEmptyEl.hidden = true;
    }

    if (
        checkoutBtn
    ) {
        checkoutBtn.disabled = false;
    }

    cartListEl.innerHTML =
        items
            .map(
                (item) => {

                    const lineTotal =
                        Cart.getLineTotal(item);

                    const isRent =
                        item.mode === "rent";

                    return `

                    <article
                        class="cart-item"
                        data-key="${escapeHtml(item.key)}"
                    >

                        <div
                            class="cart-item-image"
                            style="background-image:url('${escapeHtml(item.image)}')"
                        ></div>

                        <div class="cart-item-details">

                            <span class="cart-item-type">
                                ${escapeHtml(getCartItemLabel(item))}
                            </span>

                            <h3>
                                ${escapeHtml(item.name)}
                            </h3>

                            <p class="cart-item-meta">
                                ${escapeHtml(item.sellerName)} · ${escapeHtml(item.location)}
                            </p>

                            ${isRent ? `

                                <div class="cart-rental-days">

                                    <label>
                                        Rental days
                                    </label>

                                    <input
                                        type="number"
                                        class="rental-days-input"
                                        data-key="${escapeHtml(item.key)}"
                                        min="1"
                                        value="${Number(item.rentalDays || 1)}"
                                    />

                                </div>

                            ` : ""}

                            <p class="cart-item-price">
                                ${isRent
                                    ? `${formatCurrency(item.rentalPricePerDay || item.price)}/day`
                                    : `${formatCurrency(item.price)} each`}
                            </p>

                        </div>

                        <div class="cart-item-actions">

                            <div class="qty-control">

                                <button
                                    type="button"
                                    class="qty-btn qty-decrease"
                                    data-key="${escapeHtml(item.key)}"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>

                                <span class="qty-value">
                                    ${Number(item.quantity || 1)}
                                </span>

                                <button
                                    type="button"
                                    class="qty-btn qty-increase"
                                    data-key="${escapeHtml(item.key)}"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>

                            </div>

                            <p class="cart-line-total">
                                ${formatCurrency(lineTotal)}
                            </p>

                            <button
                                type="button"
                                class="cart-remove-btn"
                                data-key="${escapeHtml(item.key)}"
                            >
                                Remove
                            </button>

                        </div>

                    </article>

                    `;

                }
            )
            .join("");

}

function goToCheckout() {

    const items =
        Cart.getItems();

    if (
        !items.length
    ) {

        showToast(
            "Your cart is empty",
            "error"
        );

        return;

    }

    const user =
        JSON.parse(
            localStorage.getItem(
                "user"
            )
        );

    const authToken =
        localStorage.getItem(
            "token"
        );

    if (
        !user ||
        !authToken
    ) {

        showToast(
            "Please login to checkout",
            "error"
        );

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1200);

        return;

    }

    window.location.href =
        "checkout.html";

}

function handleCartInteraction(
    event
) {

    const key =
        event.target.dataset?.key;

    if (
        event.target.classList.contains(
            "qty-decrease"
        )
    ) {

        const item =
            Cart.getItems().find(
                (entry) =>
                    entry.key === key
            );

        if (
            item
        ) {

            Cart.updateQuantity(
                key,
                Number(item.quantity) - 1
            );

            renderCart();

        }

    }

    if (
        event.target.classList.contains(
            "qty-increase"
        )
    ) {

        const item =
            Cart.getItems().find(
                (entry) =>
                    entry.key === key
            );

        if (
            item
        ) {

            Cart.updateQuantity(
                key,
                Number(item.quantity) + 1
            );

            renderCart();

        }

    }

    if (
        event.target.classList.contains(
            "cart-remove-btn"
        )
    ) {

        Cart.removeItem(key);

        showToast(
            "Item removed from cart",
            "info"
        );

        renderCart();

    }

}

function handleRentalDaysChange(
    event
) {

    if (
        !event.target.classList.contains(
            "rental-days-input"
        )
    ) {
        return;
    }

    Cart.updateRentalDays(
        event.target.dataset.key,
        event.target.value
    );

    renderCart();

}

if (
    cartListEl
) {

    cartListEl.addEventListener(
        "click",
        handleCartInteraction
    );

    cartListEl.addEventListener(
        "change",
        handleRentalDaysChange
    );

}

if (
    checkoutBtn
) {

    checkoutBtn.addEventListener(
        "click",
        goToCheckout
    );

}

window.addEventListener(
    "cart-updated",
    renderCart
);

renderCart();
