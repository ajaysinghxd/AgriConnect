/* =========================================================
   SHARED UI UTILITIES
========================================================= */

function formatCurrency(
    amount
) {

    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;

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

function getCartItemLabel(
    item
) {

    if (
        item.type === "product"
    ) {
        return "Product";
    }

    if (
        item.mode === "rent"
    ) {
        return "Equipment Rental";
    }

    return "Equipment Purchase";

}

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
