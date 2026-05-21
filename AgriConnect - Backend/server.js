const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const Product = require("./models/product");
const Equipment =
  require("./models/Equipment");

// =========================
// ROUTES
// =========================

const productRoutes =
  require("./routes/productRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const authRoutes =
  require("./routes/authRoutes");

const equipmentRoutes =
  require("./routes/equipmentRoutes");

const rentalRoutes =
  require("./routes/rentalRoutes");

const paymentRoutes =
  require("./routes/paymentRoutes");

const aiRoutes =
  require("./routes/aiRoutes");


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

app.use(
  "/api/equipment",
  equipmentRoutes
);

app.use(
  "/api/rentals",
  rentalRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/ai",
  aiRoutes
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
  await insertEquipment();

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
/* =========================
   INSERT SAMPLE EQUIPMENT
========================= */

async function insertEquipment() {

  try {

    const existingEquipment =
      await Equipment.countDocuments();

    if (existingEquipment > 0) {

      console.log(
        "Equipment already exists ✅"
      );

      return;
    }

    await Equipment.insertMany([

      {
        name: "Mahindra Tractor 575",

        description:
          "Heavy-duty farming tractor suitable for large agricultural operations.",

        category: "Tractor",

        image:
          "https://img.magnific.com/free-psd/powerful-green-john-deere-tractor-modern-agricultural-machinery_191095-82167.jpg?semt=ais_hybrid&w=740&q=80",

        price: 780000,

        rentalPricePerDay: 5500,

        availability: true,

        quantity: 3,

        location: "Punjab",

        ownerName: "AgriConnect Rentals",

        ownerId:
          new mongoose.Types.ObjectId(),

        type: "both"
      },

      {
        name: "Smart Irrigation System",

        description:
          "AI-enabled irrigation control system with moisture sensors.",

        category: "Irrigation",

        image:
          "https://arborjet.com/wp-content/uploads/2024/07/smart-irrigation-month-scaled.jpeg",

        price: 45000,

        rentalPricePerDay: 900,

        availability: true,

        quantity: 8,

        location: "Bangalore",

        ownerName: "AgriTech Solutions",

        ownerId:
          new mongoose.Types.ObjectId(),

        type: "buy"
      },

      {
        name: "Drone Crop Sprayer",

        description:
          "Automated pesticide spraying drone for smart farming.",

        category: "Drone",

        image:
          "https://images.squarespace-cdn.com/content/v1/66516db72ee91d03743a8d60/4c0019a0-1784-4725-abca-b78db1b9fda9/2-T25+Corn+%282%29.jpeg",

        price: 220000,

        rentalPricePerDay: 3200,

        availability: true,

        quantity: 4,

        location: "Hyderabad",

        ownerName: "SkyFarm Technologies",

        ownerId:
          new mongoose.Types.ObjectId(),

        type: "both"
      },

      {
        name: "Combine Harvester",

        description:
          "Industrial-grade harvesting machine for wheat and rice fields.",

        category: "Harvester",

        image:
          "https://res.cloudinary.com/jerrick/image/upload/c_scale,f_jpg,q_auto/67cad4ddc108d5001d4167ae.jpg",

        price: 1500000,

        rentalPricePerDay: 8500,

        availability: true,

        quantity: 2,

        location: "Haryana",

        ownerName: "Harvest Corp",

        ownerId:
          new mongoose.Types.ObjectId(),

        type: "rent"
      },

      {
        name: "Mini Rotavator",

        description:
          "Compact soil preparation machine for small farms.",

        category: "Rotavator",

        image:
          "https://toolz4industry.com/wp-content/uploads/2023/02/drizzle-nc-52t-tiller-1.jpg",

        price: 95000,

        rentalPricePerDay: 1200,

        availability: true,

        quantity: 5,

        location: "Maharashtra",

        ownerName: "Village Equipment Hub",

        ownerId:
          new mongoose.Types.ObjectId(),

        type: "both"
      }

    ]);

    console.log(
      "Sample Equipment Inserted ✅"
    );

  }

  catch (error) {

    console.log(
      "Insert Equipment Error ❌"
    );

    console.log(error);

  }

}