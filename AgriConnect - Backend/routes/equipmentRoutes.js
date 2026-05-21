const express = require("express");

const router = express.Router();

const Equipment =
    require("../models/Equipment");

const {
    protect
} = require(
    "../middleware/authMiddleware"
);

/* ==============================
   GET ALL EQUIPMENT
============================== */

router.get(
    "/",
    async (req, res) => {

        try {

            const equipment =
                await Equipment.find();

            res.json(equipment);

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
   ADD EQUIPMENT
============================== */

router.post(
    "/",
    protect,
    async (req, res) => {

        try {

            const equipment =
                new Equipment(req.body);

            const savedEquipment =
                await equipment.save();

            res.status(201).json(
                savedEquipment
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
   UPDATE EQUIPMENT
============================== */

router.put(
    "/:id",
    protect,
    async (req, res) => {

        try {

            const updatedEquipment =
                await Equipment.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true
                    }
                );

            res.json(
                updatedEquipment
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
   DELETE EQUIPMENT
============================== */

router.delete(
    "/:id",
    protect,
    async (req, res) => {

        try {

            await Equipment.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "Equipment deleted successfully"
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