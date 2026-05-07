const Order = require("../models/order");

// GET ORDERS

const getOrders = async (req, res) => {

  try {

    const orders = await Order.find();

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// CREATE ORDER

const createOrder = async (req, res) => {

  try {

    console.log("Incoming Order:", req.body);

    const newOrder = new Order({

      productName: req.body.productName,

      price: req.body.price,

      quantity: req.body.quantity,

      buyerName: req.body.buyerName,

      farmerName: req.body.farmerName,

      location: req.body.location,

      image: req.body.image
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed",
      order: newOrder
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getOrders,
  createOrder
};