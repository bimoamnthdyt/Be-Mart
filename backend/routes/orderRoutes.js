const express = require("express");
const { checkout, payOrder, getUserOrders, updateStatusPickup, getAllOrders} = require("../controllers/orderController");
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

router.get("/all", authMiddleware, adminMiddleware, getAllOrders);

module.exports = router;