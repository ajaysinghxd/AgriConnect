const mongoose = require("mongoose");

const orderSchema =
    new mongoose.Schema(
    {

        productName: {
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

        buyerName: {
            type: String,
            required: true
        },

        buyerId: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true
        },

        farmerName: {
            type: String,
            required: true
        },

        farmerId: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User"
        },

        location: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );