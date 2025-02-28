const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            name: String,
            price: Number,
            quantity: Number,
        },
    ],
    totalPrice: {type: Number, required: true}, // total harga pesanan
    status: {
        type: String,
        enum: ["pending", "dibayar", "selesai" ],
        default: "pending",
    },
    pickupStatus: {
        type: String,
        enum: ["belum diambil", "siap diambil", "sudah diambil"],
        default: "belum diambil",
    },
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Order", OrderSchema);