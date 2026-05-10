const express = require("express");

const router = express.Router();

const {
    getOrders,
    createOrder
} = require(
    "../controllers/orderController"
);


/* =========================
   GET ORDERS
========================= */

router.get(
    "/",
    getOrders
);


/* =========================
   CREATE ORDER
========================= */

router.post(
    "/",
    createOrder
);

module.exports = router;