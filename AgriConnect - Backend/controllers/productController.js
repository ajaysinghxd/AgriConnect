const Product = require("../models/product");

// GET PRODUCTS

const getProducts = async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// CREATE PRODUCT

const createProduct = async (req, res) => {

  try {

    const newProduct = new Product({

      name: req.body.name,

      category: req.body.category,

      price: req.body.price,

      quantity: req.body.quantity,

      location: req.body.location,

      image: req.body.image,

      farmerName: req.body.farmerName
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      product: newProduct
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE PRODUCT

const deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  deleteProduct
};