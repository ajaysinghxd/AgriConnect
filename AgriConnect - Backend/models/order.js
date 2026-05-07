const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  productName: {
    type: String
  },

  price: {
    type: Number
  },

  quantity: {
    type: Number
  },

  buyerName: {
    type: String
  },

  farmerName: {
    type: String
  },

  location: {
    type: String
  },

  image: {
    type: String
  }

});

module.exports =
  mongoose.model("Order", orderSchema);