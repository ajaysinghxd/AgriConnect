const crypto = require("crypto");

const DELIVERY_FEE =
    59;

let razorpayInstance =
    null;

function getLineTotal(
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

}

function calculateCartTotals(
    items
) {

    if (
        !Array.isArray(items) ||
        !items.length
    ) {

        return {
            subtotal: 0,
            delivery: 0,
            total: 0,
            amountPaise: 0
        };

    }

    const subtotal =
        items.reduce(
            (sum, item) =>
                sum + getLineTotal(item),
            0
        );

    const delivery =
        DELIVERY_FEE;

    const total =
        subtotal + delivery;

    const amountPaise =
        Math.max(
            0,
            Math.round(
                Number(total) * 100
            )
        );

    return {
        subtotal,
        delivery,
        total,
        amountPaise
    };

}

function getRazorpayConfig() {

    const keyId =
        process.env.RAZORPAY_KEY_ID?.trim();

    const keySecret =
        process.env.RAZORPAY_KEY_SECRET?.trim();

    if (
        !keyId ||
        !keySecret
    ) {

        return {
            ok: false,
            message:
                "Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env"
        };

    }

    const isPlaceholder =

        keyId.includes("xxxx") ||
        keyId.includes("your_") ||
        keySecret.includes("your_") ||
        keySecret.includes("xxxxxxxx");

    if (
        isPlaceholder ||
        !keyId.startsWith("rzp_")
    ) {

        return {
            ok: false,
            message:
                "Invalid Razorpay keys. Use real test keys from https://dashboard.razorpay.com/app/keys"
        };

    }

    return {
        ok: true,
        keyId,
        keySecret
    };

}

function getRazorpayInstance() {

    const config =
        getRazorpayConfig();

    if (
        !config.ok
    ) {
        return null;
    }

    if (
        !razorpayInstance
    ) {

        const Razorpay =
            require("razorpay");

        razorpayInstance =
            new Razorpay({
                key_id:
                    config.keyId,
                key_secret:
                    config.keySecret
            });

        console.log(
            "[Razorpay] Client initialized ✅"
        );

    }

    return razorpayInstance;

}

function buildReceiptId() {

    const receipt =
        `agri_${Date.now()}`;

    return receipt.slice(
        0,
        40
    );

}

function extractRazorpayError(
    error
) {

    if (
        error?.error?.description
    ) {
        return error.error.description;
    }

    if (
        error?.description
    ) {
        return error.description;
    }

    if (
        error?.message
    ) {
        return error.message;
    }

    return "Razorpay request failed";

}

async function createRazorpayOrderOnGateway(
    amountPaise,
    buyerId
) {

    const razorpay =
        getRazorpayInstance();

    if (
        !razorpay
    ) {

        const config =
            getRazorpayConfig();

        throw new Error(
            config.message ||
            "Razorpay is not configured"
        );

    }

    const amount =
        parseInt(
            amountPaise,
            10
        );

    if (
        !Number.isFinite(amount) ||
        amount < 100
    ) {

        throw new Error(
            "Order amount must be at least ₹1 (100 paise)"
        );

    }

    console.log(
        "[Razorpay] Creating order:",
        {
            amountPaise: amount,
            amountInr: amount / 100,
            buyerId
        }
    );

    try {

        const order =
            await razorpay.orders.create({
                amount,
                currency: "INR",
                receipt:
                    buildReceiptId(),
                notes: {
                    buyerId:
                        String(buyerId)
                }
            });

        console.log(
            "[Razorpay] Order created ✅",
            order.id
        );

        return order;

    }

    catch (error) {

        const message =
            extractRazorpayError(error);

        console.error(
            "[Razorpay] Order creation failed ❌",
            message,
            error?.error || error
        );

        throw new Error(message);

    }

}

function verifyRazorpaySignature(
    orderId,
    paymentId,
    signature
) {

    const config =
        getRazorpayConfig();

    if (
        !config.ok
    ) {
        return false;
    }

    const body =
        `${orderId}|${paymentId}`;

    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                config.keySecret
            )
            .update(body)
            .digest("hex");

    return (
        expectedSignature ===
        signature
    );

}

module.exports = {
    DELIVERY_FEE,
    getLineTotal,
    calculateCartTotals,
    getRazorpayConfig,
    verifyRazorpaySignature,
    getRazorpayInstance,
    createRazorpayOrderOnGateway,
    extractRazorpayError
};
