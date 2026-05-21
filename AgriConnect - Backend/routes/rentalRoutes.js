const express = require("express");

const router = express.Router();

const Rental =
    require("../models/Rental");

const {
    protect
} = require(
    "../middleware/authMiddleware"
);

/* =========================
   GET ALL RENTALS
========================= */

router.get(
    "/",
    protect,
    async (req, res) => {

        try {

            const rentals =
                await Rental.find()
                .sort({
                    createdAt: -1
                });

            res.json(rentals);

        }

        catch (error) {

            res.status(500).json({
                error:
                    error.message
            });

        }

    }
);

/* =========================
   CREATE RENTAL BOOKING
========================= */

router.post(
    "/",
    protect,
    async (req, res) => {

        try {

            const rental =
                new Rental(req.body);

            const savedRental =
                await rental.save();

            res.status(201).json(
                savedRental
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

/* =========================
   UPDATE RENTAL STATUS
========================= */

router.put(
    "/:id",
    protect,
    async (req, res) => {

        try {

            const updatedRental =
                await Rental.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true
                    }
                );

            res.json(
                updatedRental
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

/* =========================
   DELETE RENTAL
========================= */

router.delete(
    "/:id",
    protect,
    async (req, res) => {

        try {

            await Rental.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "Rental deleted successfully"
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