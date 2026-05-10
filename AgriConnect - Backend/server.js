const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const Product = require("./models/product");


// =========================
// ROUTES
// =========================

const productRoutes =
  require("./routes/productRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const authRoutes =
  require("./routes/authRoutes");


// =========================
// APP
// =========================

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors({
  origin: "*"
}));

app.use(express.json());


// =========================
// API ROUTES
// =========================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/auth",
  authRoutes
);


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {

  res.send(
    "AgriConnect Backend Running 🚀"
  );

});


// =========================
// MONGODB CONNECTION
// =========================

mongoose.connect(
  process.env.MONGO_URI
)

.then(async () => {

  console.log(
    "MongoDB Connected ✅"
  );

  // INSERT PRODUCTS ONLY FIRST TIME

  await insertProducts();

  app.listen(process.env.PORT || 5000, () => {

    console.log(
      `Server running on port ${process.env.PORT || 5000} 🚀`
    );

  });

})

.catch((error) => {

  console.log(
    "MongoDB Connection Error ❌"
  );

  console.log(error);

});


// =========================
// INSERT SAMPLE PRODUCTS
// =========================

async function insertProducts() {

  try {

    const existingProducts =
      await Product.countDocuments();

    if (existingProducts > 0) {

      console.log(
        "Products already exist ✅"
      );

      return;
    }

    await Product.insertMany([

      {
        name: "Tomato",
        price: 40,
        quantity: 120,
        location: "Nashik",
        farmerName: "Ramesh Patil",
        category: "Vegetables",
        image:
          "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg"
      },

      {
        name: "Bajra",
        price: 48,
        quantity: 320,
        location: "Jaipur",
        farmerName: "Mahavir Singh",
        category: "Grains",
        image:
          "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=700"
      },

      {
        name: "Ragi",
        price: 58,
        quantity: 240,
        location: "Mysore",
        farmerName: "Shivanna Gowda",
        category: "Grains",
        image:
          "https://images.unsplash.com/photo-1515543904379-3d757afe72e3?w=700"
      },

      {
        name: "Jowar",
        price: 52,
        quantity: 280,
        location: "Solapur",
        farmerName: "Baban Shinde",
        category: "Grains",
        image:
          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=700"
      },

      {
        name: "Onion",
        price: 35,
        quantity: 180,
        location: "Pune",
        farmerName: "Mahesh Kale",
        category: "Vegetables",
        image:
          "https://images.unsplash.com/photo-1508747703725-719777637510?w=700"
      },

      {
        name: "Carrot",
        price: 50,
        quantity: 90,
        location: "Ooty",
        farmerName: "Karan Singh",
        category: "Vegetables",
        image:
          "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg"
      },

      {
        name: "Apple",
        price: 150,
        quantity: 80,
        location: "Himachal",
        farmerName: "Vikram Negi",
        category: "Fruits",
        image:
          "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg"
      },

      {
        name: "Mango",
        price: 120,
        quantity: 130,
        location: "Ratnagiri",
        farmerName: "Ganesh Pawar",
        category: "Fruits",
        image:
          "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg"
      }

    ]);

    console.log(
      "Sample Products Inserted ✅"
    );

  }

  catch (error) {

    console.log(
      "Insert Products Error ❌"
    );

    console.log(error);

  }

}