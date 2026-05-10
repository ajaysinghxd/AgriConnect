const express = require("express");

const router = express.Router();

const Product =
    require("../models/product");

const {
    protect
} = require(
    "../middleware/authMiddleware"
);


/* ==============================
   GET ALL PRODUCTS
============================== */

router.get(
    "/",
    async (req, res) => {

        try {

            const products =
                await Product.find();

            res.json(products);

        }

        catch (error) {

            res.status(500).json({
                error:
                    error.message
            });

        }

    }
);


/* ==============================
   ADD PRODUCT
============================== */

router.post(
    "/",
    protect,
    async (req, res) => {

        try {

            const product =
                new Product(req.body);

            const savedProduct =
                await product.save();

            res.status(201).json(
                savedProduct
            );

        }

        catch (error) {

            res.status(400).json({
                error:
                    error.message
            });

        }

    }
);


/* ==============================
   UPDATE PRODUCT
============================== */

router.put(
    "/:id",
    protect,
    async (req, res) => {

        try {

            const updatedProduct =
                await Product.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true
                    }
                );

            res.json(
                updatedProduct
            );

        }

        catch (error) {

            res.status(500).json({
                error:
                    error.message
            });

        }

    }
);


/* ==============================
   DELETE PRODUCT
============================== */

router.delete(
    "/:id",
    protect,
    async (req, res) => {

        try {

            await Product.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "Product deleted successfully"
            });

        }

        catch (error) {

            res.status(500).json({
                error:
                    error.message
            });

        }

    }
);

module.exports = router;