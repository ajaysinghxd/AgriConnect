const express = require("express");

const router = express.Router();

const {
    getOrders,
    createOrder
} = require(
    "../controllers/orderController"
);

const {
    protect
} = require(
    "../middleware/authMiddleware"
);


/* =========================
   GET ORDERS
========================= */

router.get(
    "/",
    protect,
    getOrders
);


/* =========================
   CREATE ORDER
========================= */

router.post(
    "/",
    protect,
    createOrder
);

module.exports = router;