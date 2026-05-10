const mongoose = require("mongoose");

const productSchema =
    new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        location: {
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

        farmerName: {
            type: String,
            required: true
        },

        farmerId: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Product",
        productSchema
    );