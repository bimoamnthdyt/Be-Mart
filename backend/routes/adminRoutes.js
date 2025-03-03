const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

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

//edit
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(404).json({message: "User tidak ditemukan"});
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({message: "Gagal memperbarui User", error});
  }
});


router.get("/sales-stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find();

    const salesData = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("id-ID", { month: "long", year: "numeric" });

      if (!salesData[month]) {
        salesData[month] = 0;
      }

      salesData[month] += order.totalPrice;
    });

    const formattedData = Object.keys(salesData).map((month) => ({
      month,
      totalSales: salesData[month],
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data penjualan", error: error.message });
  }
});

module.exports = router;
