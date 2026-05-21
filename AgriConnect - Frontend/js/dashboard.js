/* =========================================================
   API URLS
========================================================= */

const PRODUCT_API =
    "http://localhost:5000/api/products";

const EQUIPMENT_API =
    "http://localhost:5000/api/equipment";

/* =========================================================
   USER
========================================================= */

const user =
    JSON.parse(
        localStorage.getItem("user")
    );

const token =
    localStorage.getItem("token");

if (!user || user.role !== "farmer") {

    window.location.href =
        "login.html";

}

/* =========================================================
   WELCOME
========================================================= */

document.getElementById(
    "welcome-user"
).innerText =
    `Welcome Back, ${user.name}`;

/* =========================================================
   MODAL
========================================================= */

const uploadModal =
    document.getElementById(
        "upload-modal"
    );

const openUploadBtn =
    document.getElementById(
        "open-upload-modal"
    );

openUploadBtn.addEventListener(
    "click",
    () => {

        uploadModal.style.display =
            "flex";

    }
);

uploadModal.addEventListener(
    "click",
    (e) => {

        if (
            e.target === uploadModal
        ) {

            uploadModal.style.display =
                "none";

        }

    }
);

/* =========================================================
   TABS
========================================================= */

const productTab =
    document.getElementById(
        "product-tab"
    );

const equipmentTab =
    document.getElementById(
        "equipment-tab"
    );

const productForm =
    document.getElementById(
        "upload-product-form"
    );

const equipmentForm =
    document.getElementById(
        "upload-equipment-form"
    );

/* INITIAL STATE */

productForm.classList.add(
    "active-form"
);

equipmentForm.classList.remove(
    "active-form"
);

/* PRODUCT TAB */

productTab.onclick = () => {

    productTab.classList.add(
        "active"
    );

    equipmentTab.classList.remove(
        "active"
    );

    productForm.classList.add(
        "active-form"
    );

    equipmentForm.classList.remove(
        "active-form"
    );
};

/* EQUIPMENT TAB */

equipmentTab.onclick = () => {

    equipmentTab.classList.add(
        "active"
    );

    productTab.classList.remove(
        "active"
    );

    equipmentForm.classList.add(
        "active-form"
    );

    productForm.classList.remove(
        "active-form"
    );
};
/* =========================================================
   PRODUCT UPLOAD
========================================================= */

productForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        try {

            const productData = {

                name:
                    document.getElementById(
                        "product-name"
                    ).value,

                price:
                    document.getElementById(
                        "product-price"
                    ).value,

                quantity:
                    document.getElementById(
                        "product-quantity"
                    ).value,

                location:
                    document.getElementById(
                        "product-location"
                    ).value,

                category:
                    document.getElementById(
                        "product-category"
                    ).value,

                image:
                    document.getElementById(
                        "product-image"
                    ).value,

                farmerName:
                    user.name,

                farmerId:
                    user._id

            };

            const response =
                await fetch(
                    PRODUCT_API,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify(
                                productData
                            )
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                console.log(data);

                throw new Error(
                    "Upload failed"
                );

            }

            alert(
                "Product uploaded successfully ✅"
            );

            productForm.reset();

            uploadModal.style.display =
                "none";

            loadFarmerProducts();

        }

        catch (error) {

            console.log(error);

            alert(
                "Product upload failed ❌"
            );

        }

    }
);

/* =========================================================
   EQUIPMENT UPLOAD
========================================================= */

equipmentForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        try {

            const equipmentData = {

                name:
                    document.getElementById(
                        "equipment-name"
                    ).value,

                description:
                    document.getElementById(
                        "equipment-description"
                    ).value,

                category:
                    document.getElementById(
                        "equipment-category"
                    ).value,

                image:
                    document.getElementById(
                        "equipment-image"
                    ).value,

                price:
                    document.getElementById(
                        "equipment-price"
                    ).value,

                rentalPricePerDay:
                    document.getElementById(
                        "equipment-rental-price"
                    ).value,

                quantity:
                    document.getElementById(
                        "equipment-quantity"
                    ).value,

                location:
                    document.getElementById(
                        "equipment-location"
                    ).value,

                ownerName:
                    user.name,

                ownerId:
                    user._id,

                type:
                    document.getElementById(
                        "equipment-type"
                    ).value

            };

            const response =
                await fetch(
                    EQUIPMENT_API,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify(
                                equipmentData
                            )
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                console.log(data);

                throw new Error(
                    "Equipment upload failed"
                );

            }

            alert(
                "Equipment uploaded successfully 🚜"
            );

            equipmentForm.reset();

            uploadModal.style.display =
                "none";

            loadFarmerEquipment();

        }

        catch (error) {

            console.log(error);

            alert(
                "Equipment upload failed ❌"
            );

        }

    }
);

/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadFarmerProducts() {

    try {

        const response =
            await fetch(
                PRODUCT_API
            );

        const products =
            await response.json();

        const farmerProducts =
            products.filter(
                (product) =>
                    product.farmerId?.toString() ===
                    user._id
            );

        const container =
            document.getElementById(
                "farmer-products-container"
            );

        container.innerHTML = "";

        farmerProducts.forEach(
            (product) => {

                container.innerHTML += `

                <div class="table-row">

                    <span>${product.name}</span>

                    <span>${product.category}</span>

                    <span>${product.quantity}</span>

                    <span>₹${product.price}</span>

                    <span>

                        <button
                            class="delete-btn"
                            onclick="deleteProduct('${product._id}')"
                        >
                            Delete
                        </button>

                    </span>

                </div>

                `;

            }
        );

        document.getElementById(
            "farmer-products"
        ).innerText =
            farmerProducts.length;

    }

    catch (error) {

        console.log(error);

    }

}

/* =========================================================
   LOAD EQUIPMENT
========================================================= */

async function loadFarmerEquipment() {

    try {

        const response =
            await fetch(
                EQUIPMENT_API
            );

        const equipment =
            await response.json();

        const farmerEquipment =
            equipment.filter(
                (item) =>
                    item.ownerId?.toString() ===
                    user._id
            );

        const container =
            document.getElementById(
                "farmer-equipment-container"
            );

        container.innerHTML = "";

        farmerEquipment.forEach(
            (item) => {

                container.innerHTML += `

                <div class="table-row">

                    <span>${item.name}</span>

                    <span>${item.type}</span>

                    <span>
                        ${item.availability
                            ? "Available"
                            : "Unavailable"}
                    </span>

                    <span>
                        ₹${item.rentalPricePerDay}
                    </span>

                    <span>

                        <button
                            class="delete-btn"
                            onclick="deleteEquipment('${item._id}')"
                        >
                            Delete
                        </button>

                    </span>

                </div>

                `;

            }
        );

        document.getElementById(
            "farmer-equipment"
        ).innerText =
            farmerEquipment.length;

    }

    catch (error) {

        console.log(error);

    }

}

/* =========================================================
   DELETE PRODUCT
========================================================= */

async function deleteProduct(
    id
) {

    try {

        await fetch(
            `${PRODUCT_API}/${id}`,
            {
                method: "DELETE",

                headers: {

                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        loadFarmerProducts();

    }

    catch (error) {

        console.log(error);

    }

}

/* =========================================================
   DELETE EQUIPMENT
========================================================= */

async function deleteEquipment(
    id
) {

    try {

        await fetch(
            `${EQUIPMENT_API}/${id}`,
            {
                method: "DELETE",

                headers: {

                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        loadFarmerEquipment();

    }

    catch (error) {

        console.log(error);

    }

}

/* =========================================================
   AI RECOMMENDATION
========================================================= */

document.getElementById(
    "predict-btn"
).addEventListener(
    "click",
    () => {

        const soil =
            document.getElementById(
                "soil-type"
            ).value;

        const season =
            document.getElementById(
                "season"
            ).value;

        const temperature =
            document.getElementById(
                "temperature"
            ).value;

        let recommendation =
            "Rice";

        if (
            soil === "black"
        ) {

            recommendation =
                "Cotton";

        }

        if (
            season === "winter"
        ) {

            recommendation =
                "Wheat";

        }

        if (
            temperature > 35
        ) {

            recommendation =
                "Millets";

        }

        document.getElementById(
            "crop-result"
        ).innerText =
            `Recommended Crop: ${recommendation}`;

    }
);

/* =========================================================
   INITIALIZE
========================================================= */

loadFarmerProducts();

loadFarmerEquipment();