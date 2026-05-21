const Payment =
    require("../models/payment");

const {
    calculateCartTotals,
    getRazorpayConfig,
    verifyRazorpaySignature,
    createRazorpayOrderOnGateway,
    extractRazorpayError
} = require("../services/paymentService");

const {
    fulfillCartItems
} = require("../services/orderFulfillment");

/* =========================
   CREATE RAZORPAY ORDER
========================= */

const createRazorpayOrder =
    async (req, res) => {

    try {

        console.log(
            "[Payment] create-order request received"
        );

        const razorpayConfig =
            getRazorpayConfig();

        if (
            !razorpayConfig.ok
        ) {

            console.error(
                "[Payment] Razorpay config error:",
                razorpayConfig.message
            );

            return res.status(503).json({
                message:
                    razorpayConfig.message
            });

        }

        if (
            !req.user?._id
        ) {

            console.error(
                "[Payment] Missing authenticated user"
            );

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }

        const {
            items,
            buyerDetails,
            deliveryAddress
        } = req.body;

        if (
            !items?.length
        ) {

            return res.status(400).json({
                message:
                    "Cart items are required"
            });

        }

        const totals =
            calculateCartTotals(items);

        console.log(
            "[Payment] Cart totals:",
            totals
        );

        if (
            totals.amountPaise < 100
        ) {

            return res.status(400).json({
                message:
                    "Minimum order amount is ₹1"
            });

        }

        const razorpayOrder =
            await createRazorpayOrderOnGateway(
                totals.amountPaise,
                req.user._id
            );

        const payment =
            await Payment.create({

                razorpayOrderId:
                    razorpayOrder.id,

                amount:
                    totals.amountPaise,

                currency: "INR",

                status: "pending",

                paymentMethod:
                    "razorpay",

                buyerId:
                    req.user._id,

                buyerName:
                    buyerDetails?.buyerName ||
                    req.user.name,

                buyerEmail:
                    buyerDetails?.buyerEmail ||
                    req.user.email,

                buyerPhone:
                    buyerDetails?.buyerPhone,

                deliveryAddress,

                cartItems: items

            });

        console.log(
            "[Payment] MongoDB payment record saved ✅",
            payment._id
        );

        res.status(201).json({

            success: true,

            keyId:
                razorpayConfig.keyId,

            orderId:
                razorpayOrder.id,

            amount:
                Number(razorpayOrder.amount),

            currency:
                razorpayOrder.currency,

            paymentRecordId:
                payment._id,

            totals

        });

    }

    catch (error) {

        console.error(
            "[Payment] create-order failed ❌",
            error
        );

        const message =
            extractRazorpayError(error) ||
            error.message ||
            "Failed to create payment order";

        const statusCode =
            message.includes("Authentication") ||
            message.includes("Invalid Razorpay") ||
            message.includes("Razorpay keys")
                ? 503
                : 500;

        res.status(statusCode).json({
            message,
            success: false
        });

    }

};

/* =========================
   VERIFY RAZORPAY PAYMENT
========================= */

const verifyRazorpayPayment =
    async (req, res) => {

    try {

        console.log(
            "[Payment] verify request received"
        );

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({
                message:
                    "Missing payment verification fields"
            });

        }

        if (
            !req.user?._id
        ) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }

        const payment =
            await Payment.findOne({

                razorpayOrderId:
                    razorpay_order_id,

                buyerId:
                    req.user._id

            });

        if (
            !payment
        ) {

            return res.status(404).json({
                message:
                    "Payment record not found"
            });

        }

        if (
            payment.status === "paid"
        ) {

            return res.json({

                success: true,

                message:
                    "Payment already verified",

                successCount:
                    payment.orderIds.length +
                    payment.rentalIds.length,

                errors: [],

                paymentId:
                    payment.razorpayPaymentId,

                payment

            });

        }

        if (
            payment.status !== "pending"
        ) {

            return res.status(400).json({
                message:
                    "Invalid payment state"
            });

        }

        const isValid =
            verifyRazorpaySignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

        if (
            !isValid
        ) {

            payment.status = "failed";

            await payment.save();

            console.error(
                "[Payment] Signature verification failed ❌"
            );

            return res.status(400).json({
                message:
                    "Payment verification failed. Invalid signature."
            });

        }

        const result =
            await fulfillCartItems(
                payment.cartItems,
                req.user,
                payment._id
            );

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.razorpaySignature =
            razorpay_signature;

        payment.status = "paid";

        payment.transactionAt =
            new Date();

        payment.orderIds =
            result.orderIds;

        payment.rentalIds =
            result.rentalIds;

        await payment.save();

        console.log(
            "[Payment] Verified and fulfilled ✅",
            {
                paymentId:
                    razorpay_payment_id,
                successCount:
                    result.successCount
            }
        );

        res.json({

            success: true,

            message:
                "Payment verified successfully",

            successCount:
                result.successCount,

            errors:
                result.errors,

            paymentId:
                razorpay_payment_id,

            orderId:
                razorpay_order_id,

            payment

        });

    }

    catch (error) {

        console.error(
            "[Payment] verify failed ❌",
            error
        );

        res.status(500).json({
            message:
                error.message ||
                "Payment verification failed",
            success: false
        });

    }

};

/* =========================
   COD CHECKOUT
========================= */

const processCodCheckout =
    async (req, res) => {

    try {

        console.log(
            "[Payment] COD checkout request received"
        );

        if (
            !req.user?._id
        ) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }

        const {
            items,
            buyerDetails,
            deliveryAddress
        } = req.body;

        if (
            !items?.length
        ) {

            return res.status(400).json({
                message:
                    "Cart items are required"
            });

        }

        const totals =
            calculateCartTotals(items);

        const payment =
            await Payment.create({

                amount:
                    totals.amountPaise,

                currency: "INR",

                status: "cod",

                paymentMethod: "cod",

                buyerId:
                    req.user._id,

                buyerName:
                    buyerDetails?.buyerName ||
                    req.user.name,

                buyerEmail:
                    buyerDetails?.buyerEmail ||
                    req.user.email,

                buyerPhone:
                    buyerDetails?.buyerPhone,

                deliveryAddress,

                cartItems: items,

                transactionAt:
                    new Date()

            });

        const result =
            await fulfillCartItems(
                items,
                req.user,
                payment._id
            );

        payment.orderIds =
            result.orderIds;

        payment.rentalIds =
            result.rentalIds;

        await payment.save();

        console.log(
            "[Payment] COD fulfilled ✅",
            result.successCount
        );

        res.status(201).json({

            success: true,

            message:
                "COD order placed successfully",

            successCount:
                result.successCount,

            errors:
                result.errors,

            paymentMethod: "cod",

            payment

        });

    }

    catch (error) {

        console.error(
            "[Payment] COD failed ❌",
            error
        );

        res.status(500).json({
            message:
                error.message ||
                "COD checkout failed",
            success: false
        });

    }

};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    processCodCheckout
};
