const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  deleteProduct
} = require("../controllers/productController");

// GET all products
router.get("/", getProducts);

// CREATE product
router.post("/", createProduct);

// DELETE product
router.delete("/:id", deleteProduct);

module.exports = router;