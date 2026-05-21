const express = require("express");

const router = express.Router();

const {
    protect
} = require(
    "../middleware/authMiddleware"
);

const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    processCodCheckout
} = require(
    "../controllers/paymentController"
);

router.post(
    "/razorpay/create-order",
    protect,
    createRazorpayOrder
);

router.post(
    "/razorpay/verify",
    protect,
    verifyRazorpayPayment
);

router.post(
    "/cod",
    protect,
    processCodCheckout
);

module.exports = router;
