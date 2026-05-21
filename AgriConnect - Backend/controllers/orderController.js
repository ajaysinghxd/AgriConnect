const Order =
    require("../models/order");

/* =========================
   GET ORDERS
========================= */

const getOrders =
    async (req, res) => {

    try {

        const orders =
            await Order.find()
            .sort({
                createdAt: -1
            });

        res.json(orders);

    }

    catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};

/* =========================
   CREATE ORDER
========================= */

const createOrder =
    async (req, res) => {

    try {

        console.log(
            "Incoming Order:",
            req.body
        );

        const newOrder =
            new Order({

                productName:
                    req.body.productName,

                price:
                    req.body.price,

                quantity:
                    req.body.quantity,

                buyerName:
                    req.body.buyerName,

                buyerId:
                    req.body.buyerId,

                farmerName:
                    req.body.farmerName,

                farmerId:
                    req.body.farmerId,

                location:
                    req.body.location,

                image:
                    req.body.image

            });

        await newOrder.save();

        res.status(201).json({

            success: true,

            message:
                "Order placed successfully",

            order:
                newOrder

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                error.message
        });

    }

};

module.exports = {

    getOrders,

    createOrder

};