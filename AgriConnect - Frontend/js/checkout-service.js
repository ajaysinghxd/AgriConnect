/* =========================================================
   CHECKOUT SERVICE (shared API logic)
========================================================= */

const DELIVERY_FEE =
    59;

function getDeliveryCharge(
    items
) {

    if (
        !items.length
    ) {
        return 0;
    }

    return DELIVERY_FEE;

}

function getCheckoutTotals(
    items
) {

    const subtotal =
        Cart.getSubtotal();

    const delivery =
        getDeliveryCharge(items);

    return {
        subtotal,
        delivery,
        total: subtotal + delivery
    };

}

async function processCheckout(
    items,
    formData,
    user,
    token
) {

    if (
        formData.paymentMethod === "cod"
    ) {

        return processCodCheckout(
            items,
            formData,
            token
        );

    }

    return processRazorpayCheckout(
        items,
        formData,
        user,
        token
    );

}
