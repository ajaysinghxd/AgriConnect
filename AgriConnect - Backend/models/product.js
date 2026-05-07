const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  location: String,
  category: String,
  image: String,
  farmerName: String
});

module.exports = mongoose.model("Product", productSchema);