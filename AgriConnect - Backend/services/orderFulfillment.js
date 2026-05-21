const Order =
    require("../models/order");

const Rental =
    require("../models/rental");

async function fulfillCartItems(
    items,
    user,
    paymentId
) {

    const orderIds = [];
    const rentalIds = [];
    const errors = [];
    let successCount = 0;

    for (
        const item of items
    ) {

        try {

            if (
                item.mode === "rent"
            ) {

                const totalDays =
                    Number(item.rentalDays || 1);

                const rentalPricePerDay =
                    Number(
                        item.rentalPricePerDay ||
                        item.price ||
                        0
                    );

                const totalAmount =
                    rentalPricePerDay *
                    totalDays *
                    Number(item.quantity || 1);

                const startDate =
                    new Date();

                const endDate =
                    new Date();

                endDate.setDate(
                    endDate.getDate() +
                    totalDays
                );

                const rental =
                    new Rental({

                        equipmentName:
                            item.name,

                        equipmentId:
                            item.id,

                        renterName:
                            user.name,

                        renterId:
                            user._id,

                        ownerName:
                            item.sellerName,

                        ownerId:
                            item.sellerId ||
                            "000000000000000000000000",

                        rentalPricePerDay,

                        totalDays,

                        totalAmount,

                        startDate,

                        endDate,

                        location:
                            item.location,

                        image:
                            item.image,

                        status:
                            "pending",

                        paymentId:
                            paymentId || null,

                        paymentStatus:
                            paymentId
                                ? "paid"
                                : "cod"

                    });

                await rental.save();

                rentalIds.push(
                    rental._id
                );

            }

            else {

                const order =
                    new Order({

                        productName:
                            item.name,

                        price:
                            Number(item.price),

                        quantity:
                            Number(item.quantity || 1),

                        buyerName:
                            user.name,

                        buyerId:
                            user._id,

                        farmerName:
                            item.sellerName,

                        farmerId:
                            item.sellerId ||
                            "000000000000000000000000",

                        location:
                            item.location,

                        image:
                            item.image,

                        paymentId:
                            paymentId || null,

                        paymentStatus:
                            paymentId
                                ? "paid"
                                : "cod"

                    });

                await order.save();

                orderIds.push(
                    order._id
                );

            }

            successCount += 1;

        }

        catch (error) {

            console.error(error);

            errors.push(
                item.name
            );

        }

    }

    return {
        successCount,
        errors,
        orderIds,
        rentalIds
    };

}

module.exports = {
    fulfillCartItems
};
