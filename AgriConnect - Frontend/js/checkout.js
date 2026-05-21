/* =========================================================
   CHECKOUT PAGE
========================================================= */

const CHECKOUT_DRAFT_KEY =
    "agriconnect_checkout_draft";

const checkoutFlow =
    document.getElementById(
        "checkout-flow"
    );

const checkoutSuccess =
    document.getElementById(
        "checkout-success"
    );

const checkoutFailure =
    document.getElementById(
        "checkout-failure"
    );

const checkoutForm =
    document.getElementById(
        "checkout-form"
    );

const checkoutItemsEl =
    document.getElementById(
        "checkout-items"
    );

const subtotalEl =
    document.getElementById(
        "checkout-subtotal"
    );

const deliveryEl =
    document.getElementById(
        "checkout-delivery"
    );

const totalEl =
    document.getElementById(
        "checkout-total"
    );

const submitBtn =
    document.getElementById(
        "checkout-submit-btn"
    );

const loader =
    document.getElementById(
        "checkout-loader"
    );

const retryBtn =
    document.getElementById(
        "retry-payment-btn"
    );

const user =
    JSON.parse(
        localStorage.getItem("user")
    );

const token =
    localStorage.getItem("token");

/* =========================================================
   AUTH & CART GUARD
========================================================= */

function canAccessCheckout() {

    if (
        !user ||
        !token
    ) {

        showToast(
            "Please login to checkout",
            "error"
        );

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1200);

        return false;

    }

    if (
        !Cart.getItems().length
    ) {

        window.location.href =
            "cart.html";

        return false;

    }

    return true;

}

/* =========================================================
   RENDER SUMMARY
========================================================= */

function renderOrderSummary() {

    const items =
        Cart.getItems();

    const totals =
        getCheckoutTotals(items);

    checkoutItemsEl.innerHTML =
        items
            .map(
                (item) => `

                <li class="checkout-item">

                    <div
                        class="checkout-item-thumb"
                        style="background-image:url('${escapeHtml(item.image)}')"
                    ></div>

                    <div class="checkout-item-info">

                        <span class="checkout-item-type">
                            ${escapeHtml(getCartItemLabel(item))}
                        </span>

                        <h4>
                            ${escapeHtml(item.name)}
                        </h4>

                        <p class="checkout-item-meta">
                            Qty ${Number(item.quantity || 1)}${item.mode === "rent" ? ` · ${Number(item.rentalDays || 1)} days` : ""}
                        </p>

                    </div>

                    <span class="checkout-item-price">
                        ${formatCurrency(Cart.getLineTotal(item))}
                    </span>

                </li>

                `
            )
            .join("");

    subtotalEl.textContent =
        formatCurrency(totals.subtotal);

    deliveryEl.textContent =
        formatCurrency(totals.delivery);

    totalEl.textContent =
        formatCurrency(totals.total);

    updateSubmitButtonLabel();

}

function updateSubmitButtonLabel() {

    if (
        !submitBtn ||
        !checkoutForm
    ) {
        return;
    }

    const method =
        checkoutForm.paymentMethod?.value ||
        "razorpay";

    submitBtn.textContent =
        method === "cod"
            ? "Place COD Order"
            : "Pay with Razorpay";

}

/* =========================================================
   PREFILL BUYER
========================================================= */

function prefillBuyerDetails() {

    if (!user) {
        return;
    }

    const nameInput =
        document.getElementById(
            "buyer-name"
        );

    const emailInput =
        document.getElementById(
            "buyer-email"
        );

    if (
        nameInput &&
        user.name
    ) {
        nameInput.value =
            user.name;
    }

    if (
        emailInput &&
        user.email
    ) {
        emailInput.value =
            user.email;
    }

    const draft =
        getCheckoutDraft();

    if (
        draft
    ) {

        Object.entries(draft).forEach(
            ([key, value]) => {

                const field =
                    checkoutForm?.elements[key];

                if (
                    field &&
                    value
                ) {

                    if (
                        field.type === "radio"
                    ) {

                        const radio =
                            checkoutForm.querySelector(
                                `[name="${key}"][value="${value}"]`
                            );

                        if (radio) {
                            radio.checked = true;
                        }

                    }

                    else {

                        field.value = value;

                    }

                }

            }
        );

    }

    updateSubmitButtonLabel();

}

function getCheckoutDraft() {

    try {

        const raw =
            localStorage.getItem(
                CHECKOUT_DRAFT_KEY
            );

        return raw
            ? JSON.parse(raw)
            : null;

    }

    catch {

        return null;

    }

}

function saveCheckoutDraft() {

    if (
        !checkoutForm
    ) {
        return;
    }

    const data = {

        buyerName:
            checkoutForm.buyerName?.value || "",
        buyerEmail:
            checkoutForm.buyerEmail?.value || "",
        buyerPhone:
            checkoutForm.buyerPhone?.value || "",
        addressLine1:
            checkoutForm.addressLine1?.value || "",
        addressLine2:
            checkoutForm.addressLine2?.value || "",
        city:
            checkoutForm.city?.value || "",
        state:
            checkoutForm.state?.value || "",
        pincode:
            checkoutForm.pincode?.value || "",
        paymentMethod:
            checkoutForm.paymentMethod?.value || "razorpay"

    };

    localStorage.setItem(
        CHECKOUT_DRAFT_KEY,
        JSON.stringify(data)
    );

    updateSubmitButtonLabel();

}

/* =========================================================
   UI STATES
========================================================= */

function setLoading(
    isLoading,
    message
) {

    if (loader) {

        loader.hidden = !isLoading;

        const loaderText =
            loader.querySelector("p");

        if (
            loaderText &&
            message
        ) {
            loaderText.textContent =
                message;
        }

    }

    if (submitBtn) {
        submitBtn.disabled = isLoading;
    }

}

function hideAllStates() {

    if (checkoutFlow) {
        checkoutFlow.hidden = false;
    }

    if (checkoutSuccess) {
        checkoutSuccess.hidden = true;
    }

    if (checkoutFailure) {
        checkoutFailure.hidden = true;
    }

}

function showSuccessState(
    result,
    formData
) {

    checkoutFlow.hidden = true;
    checkoutFailure.hidden = true;
    checkoutSuccess.hidden = false;

    const paymentLabels = {
        razorpay: "Razorpay (Online)",
        cod: "Cash on Delivery"
    };

    document.getElementById(
        "success-message"
    ).textContent =
        `${result.successCount} item${result.successCount > 1 ? "s" : ""} placed successfully. Your order is being processed.`;

    document.getElementById(
        "success-payment"
    ).textContent =
        `Payment method: ${paymentLabels[formData.paymentMethod] || formData.paymentMethod}`;

    const paymentIdEl =
        document.getElementById(
            "success-payment-id"
        );

    if (
        paymentIdEl
    ) {

        paymentIdEl.textContent =
            result.paymentId
                ? `Payment ID: ${result.paymentId}`
                : "";

        paymentIdEl.hidden =
            !result.paymentId;

    }

    document.getElementById(
        "success-address"
    ).textContent =
        `Delivering to: ${formData.addressLine1}, ${formData.city}, ${formData.state} – ${formData.pincode}`;

    localStorage.removeItem(
        CHECKOUT_DRAFT_KEY
    );

    showToast(
        "Order placed successfully ✅",
        "success"
    );

    setTimeout(() => {

        window.location.href =
            "buyer-dashboard.html";

    }, 4000);

}

function showFailureState(
    message
) {

    checkoutFlow.hidden = true;
    checkoutSuccess.hidden = true;
    checkoutFailure.hidden = false;

    document.getElementById(
        "failure-message"
    ).textContent =
        message ||
        "Payment could not be completed. Please try again.";

    showToast(
        message ||
        "Payment failed ❌",
        "error"
    );

}

/* =========================================================
   SUBMIT CHECKOUT
========================================================= */

async function handleCheckoutSubmit(
    event
) {

    event.preventDefault();

    hideAllStates();

    const items =
        Cart.getItems();

    if (
        !items.length
    ) {

        showToast(
            "Your cart is empty",
            "error"
        );

        window.location.href =
            "cart.html";

        return;

    }

    if (
        !checkoutForm.checkValidity()
    ) {

        showToast(
            "Please fill all required fields",
            "error"
        );

        checkoutForm.reportValidity();

        return;

    }

    saveCheckoutDraft();

    const formData = {
        buyerName:
            checkoutForm.buyerName.value.trim(),
        buyerEmail:
            checkoutForm.buyerEmail.value.trim(),
        buyerPhone:
            checkoutForm.buyerPhone.value.trim(),
        addressLine1:
            checkoutForm.addressLine1.value.trim(),
        addressLine2:
            checkoutForm.addressLine2.value.trim(),
        city:
            checkoutForm.city.value.trim(),
        state:
            checkoutForm.state.value.trim(),
        pincode:
            checkoutForm.pincode.value.trim(),
        paymentMethod:
            checkoutForm.paymentMethod.value
    };

    const isCod =
        formData.paymentMethod === "cod";

    try {

        setLoading(
            true,
            isCod
                ? "Placing your order..."
                : "Preparing secure payment..."
        );

        const result =
            await processCheckout(
                items,
                formData,
                user,
                token
            );

        setLoading(false);

        if (
            result.successCount > 0
        ) {

            Cart.clear();

            showSuccessState(
                result,
                formData
            );

        }

        if (
            result.errors?.length
        ) {

            showToast(
                `Some items failed: ${result.errors.join(", ")}`,
                "error"
            );

        }

        if (
            !result.successCount
        ) {

            showFailureState(
                "Checkout failed. Please try again."
            );

        }

    }

    catch (error) {

        console.error(error);

        setLoading(false);

        showFailureState(
            error.message ||
            "Payment failed. Please try again."
        );

    }

}

/* =========================================================
   INIT
========================================================= */

function initCheckoutPage() {

    if (
        checkoutForm
    ) {

        checkoutForm.addEventListener(
            "submit",
            handleCheckoutSubmit
        );

        checkoutForm.addEventListener(
            "input",
            saveCheckoutDraft
        );

        checkoutForm.addEventListener(
            "change",
            saveCheckoutDraft
        );

    }

    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            () => {

                hideAllStates();

                showToast(
                    "You can retry payment below",
                    "info"
                );

            }
        );

    }

    renderOrderSummary();

    prefillBuyerDetails();

    window.addEventListener(
        "cart-updated",
        () => {

            if (
                !Cart.getItems().length
            ) {

                window.location.href =
                    "cart.html";

                return;

            }

            renderOrderSummary();

        }
    );

}

if (
    canAccessCheckout()
) {

    initCheckoutPage();

}
