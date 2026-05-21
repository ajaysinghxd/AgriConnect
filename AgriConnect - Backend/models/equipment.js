const mongoose = require("mongoose");

const equipmentSchema =
    new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            default: 0
        },

        rentalPricePerDay: {
            type: Number,
            default: 0
        },

        availability: {
            type: Boolean,
            default: true
        },

        quantity: {
            type: Number,
            default: 1
        },

        location: {
            type: String,
            required: true
        },

        ownerName: {
            type: String,
            required: true
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true
        },

        type: {
            type: String,

            enum: [
                "buy",
                "rent",
                "both"
            ],

            default: "rent"
        }

    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Equipment",
        equipmentSchema
    );