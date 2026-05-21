const mongoose = require("mongoose");

const rentalSchema =
    new mongoose.Schema(
    {

        equipmentName: {
            type: String,
            required: true
        },

        equipmentId: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Equipment",

            required: true
        },

        renterName: {
            type: String,
            required: true
        },

        renterId: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

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

        rentalPricePerDay: {
            type: Number,
            required: true
        },

        totalDays: {
            type: Number,
            required: true
        },

        totalAmount: {
            type: Number,
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        status: {
            type: String,

            enum: [
                "pending",
                "approved",
                "active",
                "completed",
                "cancelled"
            ],

            default: "pending"
        },

        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "cod",
                "failed"
            ],
            default: null
        }

    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Rental ||
    mongoose.model(
        "Rental",
        rentalSchema
    );