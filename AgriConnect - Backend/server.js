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
// ROUTES
// =========================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
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
  "mongodb+srv://agriconnect_admin:AgriConnect2026@cluster0.lekxaxh.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=Cluster0"
)

.then(async () => {

  console.log(
    "MongoDB Connected ✅"
  );

  // INSERT PRODUCTS ONLY FIRST TIME

  await insertProducts();

  app.listen(5000, () => {

    console.log(
      "Server running on port 5000 🚀"
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

      // ====================================
      // VEGETABLES
      // ====================================

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

      // =========================
      // EXTRA GRAINS
      // =========================

 

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
        name: "Cabbage",
        price: 25,
        quantity: 110,
        location: "Shimla",
        farmerName: "Ajay Thakur",
        category: "Vegetables",
        image:
          "https://images.pexels.com/photos/257259/pexels-photo-257259.jpeg"
      },

      {
        name: "Cauliflower",
        price: 38,
        quantity: 140,
        location: "Meerut",
        farmerName: "Naresh Kumar",
        category: "Vegetables",
        image:
          "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=700"
      },

      {
        name: "Brinjal",
        price: 32,
        quantity: 170,
        location: "Patna",
        farmerName: "Ravi Verma",
        category: "Vegetables",
        image:
          "https://images.pexels.com/photos/321551/pexels-photo-321551.jpeg"
      },

      {
        name: "Capsicum",
        price: 65,
        quantity: 90,
        location: "Bangalore",
        farmerName: "Sanjay Rao",
        category: "Vegetables",
        image:
          "https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg"
      },

      {
        name: "Cucumber",
        price: 28,
        quantity: 160,
        location: "Indore",
        farmerName: "Lokesh Sharma",
        category: "Vegetables",
        image:
          "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=700"
      },

      {
        name: "Pumpkin",
        price: 45,
        quantity: 110,
        location: "Kanpur",
        farmerName: "Dinesh Gupta",
        category: "Vegetables",
        image:
          "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=700"
      },

      {
        name: "Spinach",
        price: 22,
        quantity: 95,
        location: "Surat",
        farmerName: "Nitin Shah",
        category: "Vegetables",
        image:
          "https://images.pexels.com/photos/2255925/pexels-photo-2255925.jpeg"
      },

      // ====================================
      // FRUITS
      // ====================================

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
        name: "Banana",
        price: 60,
        quantity: 140,
        location: "Kerala",
        farmerName: "Arun Kumar",
        category: "Fruits",
        image:
          "https://images.pexels.com/photos/47305/bananas-banana-shrub-fruits-yellow-47305.jpeg"
      },

      {
        name: "Orange",
        price: 90,
        quantity: 100,
        location: "Nagpur",
        farmerName: "Rahul Deshmukh",
        category: "Fruits",
        image:
          "https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg"
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
      },

      {
        name: "Grapes",
        price: 95,
        quantity: 75,
        location: "Sangli",
        farmerName: "Deepak More",
        category: "Fruits",
        image:
          "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg"
      },

      {
        name: "Strawberry",
        price: 220,
        quantity: 60,
        location: "Mahabaleshwar",
        farmerName: "Aakash Patil",
        category: "Fruits",
        image:
          "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=700"
      },

      {
        name: "Pomegranate",
        price: 160,
        quantity: 85,
        location: "Solapur",
        farmerName: "Vikas Shinde",
        category: "Fruits",
        image:
          "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=700"
      },

      {
        name: "Guava",
        price: 70,
        quantity: 150,
        location: "Allahabad",
        farmerName: "Ashok Mishra",
        category: "Fruits",
        image:
          "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=700"
      },

      {
        name: "Litchi",
        price: 190,
        quantity: 75,
        location: "Muzaffarpur",
        farmerName: "Ritesh Jha",
        category: "Fruits",
        image:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=700"
      },

      {
        name: "Pear",
        price: 140,
        quantity: 95,
        location: "Kashmir",
        farmerName: "Imran Sheikh",
        category: "Fruits",
        image:
          "https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg"
      }

    ]);

    console.log(
      "Sample Products Inserted ✅"
    );

  } catch (error) {

    console.log(
      "Insert Products Error ❌"
    );

    console.log(error);
  }
}


