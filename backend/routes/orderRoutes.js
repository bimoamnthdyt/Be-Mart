const express = require("express");
const { checkout, payOrder, getUserOrders, updateStatusPickup } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

//user cekout dari keranjang
router.post("/checkout", authMiddleware, checkout);
//user bayar
router.put("/pay/:orderId", authMiddleware, payOrder);
// daftar pesanan user
router.get("/", authMiddleware, getUserOrders);
//admin perbarui status order
router.put("/pickup/:orderId", authMiddleware, adminMiddleware, updateStatusPickup);

module.exports = router;