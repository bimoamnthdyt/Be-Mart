const express = require("express");
const {addToCart, getCart, updateCartItem, removeCartItem} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// tambah produk ke keranjang 
router.post("/add", authMiddleware, addToCart);
// get isi keranjang user
router.get("/", authMiddleware, getCart);
//update jumlah keranjang
router.put("/update/:productId", authMiddleware, updateCartItem);
// Hapus keranjang
router.delete("/remove/:productId", authMiddleware, removeCartItem);

module.exports = router;