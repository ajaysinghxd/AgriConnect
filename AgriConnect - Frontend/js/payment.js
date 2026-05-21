/* =========================================================
   PAYMENT UTILITIES (Razorpay + COD)
========================================================= */

const PAYMENT_API =
    typeof API_BASE_URL !== "undefined"
        ? `${API_BASE_URL}/payments`
        : "https://agriconnect-backend-3yti.onrender.com/api/payments";

function getAuthHeaders(
    token
) {

    return {
        "Content-Type":
            "application/json",
        Authorization:
            `Bearer ${token}`
    };

}

function getCheckoutPayload(
    items,
    formData
) {

    return {
        items,
        buyerDetails: {
            buyerName:
                formData.buyerName,
            buyerEmail:
                formData.buyerEmail,
            buyerPhone:
                formData.buyerPhone
        },
        deliveryAddress: {
            addressLine1:
                formData.addressLine1,
            addressLine2:
                formData.addressLine2,
            city:
                formData.city,
            state:
                formData.state,
            pincode:
                formData.pincode
        }
    };

}

async function processCodCheckout(
    items,
    formData,
    token
) {

    const response =
        await fetch(
            `${PAYMENT_API}/cod`,
            {
                method: "POST",
                headers:
                    getAuthHeaders(token),
                body: JSON.stringify(
                    getCheckoutPayload(
                        items,
                        formData
                    )
                )
            }
        );

    const data =
        await response.json();

    if (
        !response.ok
    ) {
        throw new Error(
            data.message ||
            "COD checkout failed"
        );
    }

    return {
        successCount:
            data.successCount,
        errors:
            data.errors || [],
        paymentId:
            data.payment?._id,
        paymentMethod: "cod"
    };

}

async function createRazorpayOrder(
    items,
    formData,
    token
) {

    const response =
        await fetch(
            `${PAYMENT_API}/razorpay/create-order`,
            {
                method: "POST",
                headers:
                    getAuthHeaders(token),
                body: JSON.stringify(
                    getCheckoutPayload(
                        items,
                        formData
                    )
                )
            }
        );

    const data =
        await response.json();

    if (
        !response.ok
    ) {

        console.error(
            "[Payment] create-order failed:",
            response.status,
            data
        );

        throw new Error(
            data.message ||
            "Failed to create payment order"
        );

    }

    if (
        !data.orderId ||
        !data.keyId ||
        !data.amount
    ) {

        console.error(
            "[Payment] Invalid create-order response:",
            data
        );

        throw new Error(
            "Invalid payment order response from server"
        );

    }

    console.log(
        "[Payment] Razorpay order ready:",
        data.orderId
    );

    return data;

}

async function verifyRazorpayPayment(
    paymentResponse,
    token
) {

    const response =
        await fetch(
            `${PAYMENT_API}/razorpay/verify`,
            {
                method: "POST",
                headers:
                    getAuthHeaders(token),
                body: JSON.stringify({
                    razorpay_order_id:
                        paymentResponse.razorpay_order_id,
                    razorpay_payment_id:
                        paymentResponse.razorpay_payment_id,
                    razorpay_signature:
                        paymentResponse.razorpay_signature
                })
            }
        );

    const data =
        await response.json();

    if (
        !response.ok
    ) {
        throw new Error(
            data.message ||
            "Payment verification failed"
        );
    }

    return {
        successCount:
            data.successCount,
        errors:
            data.errors || [],
        paymentId:
            data.paymentId,
        orderId:
            data.orderId,
        paymentMethod: "razorpay"
    };

}

function openRazorpayCheckout(
    orderData,
    formData,
    user
) {

    return new Promise(
        (resolve, reject) => {

            if (
                typeof Razorpay === "undefined"
            ) {
                reject(
                    new Error(
                        "Razorpay SDK failed to load"
                    )
                );
                return;
            }

            const options = {

                key:
                    orderData.keyId,

                amount:
                    orderData.amount,

                currency:
                    orderData.currency || "INR",

                name: "AgriConnect",

                description:
                    "Agricultural marketplace order",

                order_id:
                    orderData.orderId,

                handler(
                    response
                ) {
                    resolve(response);
                },

                prefill: {
                    name:
                        formData.buyerName ||
                        user?.name,
                    email:
                        formData.buyerEmail ||
                        user?.email,
                    contact:
                        formData.buyerPhone
                },

                theme: {
                    color: "#22c55e"
                },

                modal: {
                    ondismiss() {
                        reject(
                            new Error(
                                "Payment cancelled"
                            )
                        );
                    }
                }

            };

            const rzp =
                new Razorpay(options);

            rzp.on(
                "payment.failed",
                function (
                    response
                ) {

                    reject(
                        new Error(
                            response.error?.description ||
                            "Payment failed"
                        )
                    );

                }
            );

            rzp.open();

        }
    );

}

async function processRazorpayCheckout(
    items,
    formData,
    user,
    token
) {

    let orderData;

    try {

        orderData =
            await createRazorpayOrder(
                items,
                formData,
                token
            );

    }

    catch (error) {

        console.error(
            "[Payment] Could not create Razorpay order:",
            error
        );

        throw error;

    }

    showToast(
        "Opening Razorpay secure checkout...",
        "info"
    );

    const paymentResponse =
        await openRazorpayCheckout(
            orderData,
            formData,
            user
        );

    showToast(
        "Verifying payment...",
        "info"
    );

    const result =
        await verifyRazorpayPayment(
            paymentResponse,
            token
        );

    return result;

}
