const mongoose = require("mongoose");

const paymentSchema =
    new mongoose.Schema(
    {

        razorpayOrderId: {
            type: String,
            default: null
        },

        razorpayPaymentId: {
            type: String,
            default: null
        },

        razorpaySignature: {
            type: String,
            default: null
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            default: "INR"
        },

        status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "cod"
            ],
            default: "pending"
        },

        paymentMethod: {
            type: String,
            enum: [
                "razorpay",
                "cod"
            ],
            required: true
        },

        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        buyerName: String,
        buyerEmail: String,
        buyerPhone: String,

        deliveryAddress: {
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            pincode: String
        },

        cartItems: {
            type: Array,
            default: []
        },

        orderIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ],

        rentalIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Rental"
            }
        ],

        transactionAt: {
            type: Date,
            default: null
        }

    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Payment",
        paymentSchema
    );
