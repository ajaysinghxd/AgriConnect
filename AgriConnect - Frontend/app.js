let generatedOTP = "";
let selectedCategory = "All";

const defaultImage =
  "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=700";

let sampleCrops = [];

// ========================================
// FETCH PRODUCTS FROM BACKEND
// ========================================

async function fetchProducts() {

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/api/products"
    );

    sampleCrops = await response.json();

    console.log(
      "Products Loaded:",
      sampleCrops
    );

    renderBuyerProducts();

    renderFarmerProducts();

  } catch (error) {

    console.log(
      "Error fetching products:",
      error
    );
  }
}

// ========================================
// SAMPLE EQUIPMENT
// ========================================

const sampleEquipment = [

  {
    id: 201,
    name: "Tractor",
    rent: 1500,
    location: "Ghazipur",
    availability: "Available",
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=700"
  },

  {
    id: 202,
    name: "Harvester",
    rent: 3000,
    location: "Varanasi",
    availability: "Available",
    image:
      "https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=700"
  },

  {
    id: 203,
    name: "Water Pump",
    rent: 500,
    location: "Lucknow",
    availability: "Not Available",
    image:
      "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=700"
  }
];

// ========================================
// COMMON FUNCTIONS
// ========================================

function toggleMenu() {

  const navLinks =
    document.getElementById("navLinks");

  if (navLinks) {
    navLinks.classList.toggle("active");
  }
}

function getData(key, fallback) {

  return JSON.parse(
    localStorage.getItem(key)
  ) || fallback;
}

function setData(key, value) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

function getLoggedInUser() {

  return getData(
    "loggedInUser",
    null
  );
}

function showUserDetails() {

  const userDetails =
    document.getElementById(
      "userDetails"
    );

  const user =
    getLoggedInUser();

  if (!userDetails) return;

  if (user) {

    userDetails.innerText =
      `${user.name} | ${user.method}: ${user.contact} | Role: ${user.role}`;

  } else {

    userDetails.innerText =
      "Demo User";
  }
}

// ========================================
// LOGIN PAGE
// ========================================

function changeLoginPlaceholder() {

  const method =
    document.getElementById(
      "loginMethod"
    ).value;

  const loginInput =
    document.getElementById(
      "loginInput"
    );

  if (method === "mobile") {

    loginInput.placeholder =
      "Enter mobile number";

  } else {

    loginInput.placeholder =
      "Enter email";
  }
}

function sendOTP() {

  generatedOTP =
    Math.floor(
      1000 + Math.random() * 9000
    ).toString();

  localStorage.setItem(
    "demoOTP",
    generatedOTP
  );

  alert(
    "Demo OTP is " +
    generatedOTP
  );
}

function loginUser() {

  const role =
    document.getElementById(
      "role"
    ).value;

  const method =
    document.getElementById(
      "loginMethod"
    ).value;

  const name =
    document.getElementById(
      "userName"
    ).value.trim();

  const contact =
    document.getElementById(
      "loginInput"
    ).value.trim();

  const password =
    document.getElementById(
      "password"
    ).value.trim();

  const otp =
    document.getElementById(
      "otpInput"
    ).value.trim();

  const savedOTP =
    localStorage.getItem(
      "demoOTP"
    );

  if (
    !role ||
    !name ||
    !contact ||
    !password ||
    !otp
  ) {

    alert(
      "Please fill all details."
    );

    return;
  }

  if (otp !== savedOTP) {

    alert("Wrong OTP");

    return;
  }

  const user = {
    role,
    method,
    name,
    contact
  };

  setData(
    "loggedInUser",
    user
  );

  if (role === "farmer") {

    window.location.href =
      "farmer.html";

  } else if (role === "buyer") {

    window.location.href =
      "buyer.html";

  } else {

    window.location.href =
      "equipment.html";
  }
}

function logout() {

  localStorage.removeItem(
    "loggedInUser"
  );

  alert(
    "Logged out successfully"
  );

  window.location.href =
    "login.html";
}

// ========================================
// FARMER PAGE
// ========================================

async function initFarmerPage() {

  showUserDetails();

  await fetchProducts();
}

async function saveCrop(event) {

  event.preventDefault();

  const user =
    getLoggedInUser();

  const cropData = {

    name:
      document.getElementById(
        "cropName"
      ).value.trim(),

    category:
      document.getElementById(
        "cropCategory"
      ).value,

    price: Number(
      document.getElementById(
        "cropPrice"
      ).value
    ),

    quantity: Number(
      document.getElementById(
        "cropQuantity"
      ).value
    ),

    location:
      document.getElementById(
        "cropLocation"
      ).value.trim(),

    image:
      document.getElementById(
        "cropImage"
      ).value.trim() ||
      defaultImage,

    farmerName:
      user
        ? user.name
        : "Demo Farmer"
  };

  try {

    const response =
      await fetch(
        "http://127.0.0.1:5000/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            cropData
          )
        }
      );

    const data =
      await response.json();

    console.log(
      "Crop Saved:",
      data
    );

    alert(
      "Crop added successfully"
    );

    document.getElementById(
      "cropForm"
    ).reset();

    await fetchProducts();

  } catch (error) {

    console.log(error);

    alert(
      "Error saving crop"
    );
  }
}

function renderFarmerProducts() {

  const container =
    document.getElementById(
      "farmerProducts"
    );

  const totalProducts =
    document.getElementById(
      "totalProducts"
    );

  if (!container) return;

  const user =
    getLoggedInUser();

  const farmerProducts =
    sampleCrops.filter(
      crop =>
        crop.farmerName ===
        user?.name
    );

  if (totalProducts) {

    totalProducts.innerText =
      farmerProducts.length;
  }

  if (
    farmerProducts.length === 0
  ) {

    container.innerHTML =
      `<p class="muted">
        No crops added yet.
      </p>`;

    return;
  }

  container.innerHTML =
    farmerProducts.map(crop => `

      <div class="product-card">

        <img
          src="${crop.image || defaultImage}"
          alt="${crop.name}"
        />

        <h3>${crop.name}</h3>

        <p>
          Category:
          ${crop.category}
        </p>

        <p>
          ₹${crop.price}/kg |
          ${crop.quantity} kg
        </p>

        <p>
          Location:
          ${crop.location}
        </p>

      </div>

    `).join("");
}

function predictPrice() {

  const crop =
    document.getElementById(
      "priceCrop"
    ).value;

  const box =
    document.getElementById(
      "predictionBox"
    );

  const prices = {

    Tomato:
      "₹25 - ₹40 per kg",

    Potato:
      "₹20 - ₹32 per kg",

    Onion:
      "₹30 - ₹55 per kg",

    Wheat:
      "₹24 - ₹32 per kg",

    Rice:
      "₹35 - ₹55 per kg"
  };

  if (!crop) {

    box.innerText =
      "Please select a crop.";

    return;
  }

  box.innerText =
    `${crop} suggested price range: ${prices[crop]}`;
}

// ========================================
// BUYER PAGE
// ========================================

async function initBuyerPage() {

  showUserDetails();

  await fetchProducts();

  renderCart();

  renderOrders();
}

function getAllCropsForBuyer() {

  return sampleCrops;
}

function setCategory(category) {

  selectedCategory =
    category;

  renderBuyerProducts();
}

function renderBuyerProducts() {

  const container =
    document.getElementById(
      "buyerProducts"
    );

  const searchInput =
    document.getElementById(
      "searchInput"
    );

  if (!container) return;

  const searchText =
    searchInput
      ? searchInput.value.toLowerCase()
      : "";

  let products =
    getAllCropsForBuyer();

  if (
    selectedCategory !== "All"
  ) {

    products =
      products.filter(
        product =>
          product.category ===
          selectedCategory
      );
  }

  if (searchText) {

    products =
      products.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(searchText) ||

          product.location
            .toLowerCase()
            .includes(searchText)
      );
  }

  if (products.length === 0) {

    container.innerHTML =
      `<p class="muted">
        No products found.
      </p>`;

    return;
  }

  container.innerHTML =
    products.map(product => `

      <div class="product-card">

        <img
          src="${product.image || defaultImage}"
          alt="${product.name}"
        />

        <h3>${product.name}</h3>

        <p>
          Farmer:
          ${product.farmerName}
        </p>

        <p>
          ₹${product.price}/kg |
          ${product.quantity} kg
        </p>

        <p>
          Location:
          ${product.location}
        </p>

        <button
          onclick="addToCart('${product._id}')">

          Add to Cart

        </button>

      </div>

    `).join("");
}

async function addToCart(id) {

  const products =
    getAllCropsForBuyer();

  const product =
    products.find(
      item =>
        String(item._id) ===
        String(id)
    );

  if (!product) {

    alert(
      "Product not found"
    );

    return;
  }

  const cart =
    getData("cart", []);

  cart.push(product);

  setData(
    "cart",
    cart
  );

  const user =
    getLoggedInUser();

  const orderData = {

    productName:
      product.name,

    price:
      product.price,

    quantity:
      product.quantity,

    buyerName:
      user
        ? user.name
        : "Demo Buyer",

    farmerName:
      product.farmerName,

    location:
      product.location,

    image:
      product.image
  };

  try {

    await fetch(
      "http://127.0.0.1:5000/api/orders",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify(
          orderData
        )
      }
    );

  } catch (error) {

    console.log(error);
  }

  alert(
    `${product.name} added to cart`
  );

  renderCart();

  renderOrders();
}

function renderCart() {

  const cartItems =
    document.getElementById(
      "cartItems"
    );

  const cartCount =
    document.getElementById(
      "cartCount"
    );

  const cartTotal =
    document.getElementById(
      "cartTotal"
    );

  if (!cartItems) return;

  const cart =
    getData(
      "cart",
      []
    );

  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0),
      0
    );

  if (cartCount) {

    cartCount.innerText =
      cart.length;
  }

  if (cartTotal) {

    cartTotal.innerText =
      total;
  }

  if (cart.length === 0) {

    cartItems.innerHTML =
      `<p class="muted">
        Cart is empty.
      </p>`;

    return;
  }

  cartItems.innerHTML =
    cart.map(
      (item, index) => `

      <div class="cart-item">

        <img
          src="${item.image || defaultImage}"
          alt="${item.name}"
          style="
            width:80px;
            height:80px;
            object-fit:cover;
            border-radius:10px;
            margin-bottom:10px;
          "
        />

        <h4>${item.name}</h4>

        <p>
          ₹${item.price}/kg
        </p>

        <p>
          Quantity:
          ${item.quantity} kg
        </p>

        <p>
          Farmer:
          ${item.farmerName}
        </p>

        <p>
          Location:
          ${item.location}
        </p>

        <button
          onclick="removeFromCart(${index})">

          Remove

        </button>

      </div>

    `
    ).join("");
}

async function renderOrders() {

  const ordersContainer =
    document.getElementById(
      "ordersContainer"
    );

  if (!ordersContainer) return;

  try {

    const response =
      await fetch(
        "http://127.0.0.1:5000/api/orders"
      );

    const orders =
      await response.json();

    if (
      !orders ||
      orders.length === 0
    ) {

      ordersContainer.innerHTML =
        `<p class="muted">
          No orders yet.
        </p>`;

      return;
    }

    ordersContainer.innerHTML =
      orders.map(order => `

      <div class="product-card">

        <img
          src="${order.image || defaultImage}"
          alt="${order.productName}"
        />

        <h3>
          ${order.productName}
        </h3>

        <p>
          ₹${order.price}/kg
        </p>

        <p>
          Quantity:
          ${order.quantity}
        </p>

        <p>
          Buyer:
          ${order.buyerName}
        </p>

        <p>
          Farmer:
          ${order.farmerName}
        </p>

        <p>
          Location:
          ${order.location}
        </p>

      </div>

    `).join("");

  } catch (error) {

    console.log(
      "Order Fetch Error:",
      error
    );
  }
}

function removeFromCart(index) {

  const cart =
    getData(
      "cart",
      []
    );

  cart.splice(index, 1);

  setData(
    "cart",
    cart
  );

  renderCart();
}

function checkout() {

  const cart =
    getData(
      "cart",
      []
    );

  if (cart.length === 0) {

    alert(
      "Cart is empty."
    );

    return;
  }

  alert(
    "Order placed successfully! 🎉"
  );

  localStorage.removeItem(
    "cart"
  );

  renderCart();
}

// ========================================
// EQUIPMENT PAGE
// ========================================

function initEquipmentPage() {

  showUserDetails();

  const equipment =
    getData(
      "equipment",
      []
    );

  if (
    equipment.length === 0
  ) {

    setData(
      "equipment",
      sampleEquipment
    );
  }

  renderEquipment();
}

function saveEquipment(event) {

  event.preventDefault();

  const equipmentList =
    getData(
      "equipment",
      []
    );

  const equipment = {

    id: Date.now(),

    name:
      document.getElementById(
        "equipmentName"
      ).value.trim(),

    rent: Number(
      document.getElementById(
        "equipmentRent"
      ).value
    ),

    location:
      document.getElementById(
        "equipmentLocation"
      ).value.trim(),

    availability:
      document.getElementById(
        "equipmentAvailability"
      ).value,

    image:
      document.getElementById(
        "equipmentImage"
      ).value.trim() ||
      defaultImage
  };

  equipmentList.push(
    equipment
  );

  setData(
    "equipment",
    equipmentList
  );

  alert(
    "Equipment listed successfully"
  );

  event.target.reset();

  renderEquipment();
}

function renderEquipment() {

  const container =
    document.getElementById(
      "equipmentList"
    );

  if (!container) return;

  const equipment =
    getData(
      "equipment",
      []
    );

  container.innerHTML =
    equipment.map(item => `

      <div class="product-card">

        <img
          src="${item.image || defaultImage}"
          alt="${item.name}"
        />

        <h3>${item.name}</h3>

        <p>
          Rent:
          ₹${item.rent}/day
        </p>

        <p>
          Location:
          ${item.location}
        </p>

        <p>
          Status:
          ${item.availability}
        </p>

      </div>

    `).join("");
}