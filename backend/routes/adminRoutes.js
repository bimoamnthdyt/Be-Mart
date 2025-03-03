const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Endpoint untuk mendapatkan statistik dashboard admin (Hanya admin)
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil statistik" });
  }
});

// Contoh endpoint lain yang bisa diakses tanpa autentikasi admin
router.get("/some-public-route", async (req, res) => {
  res.json({ message: "Route ini tidak membutuhkan autentikasi admin" });
});

module.exports = router;
