const express = require("express");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/// Route: Ambil semua produk
router.get("/", getAllProducts);

// Route: Ambil produk berdasarkan ID
router.get("/:id", getProductById);

// Route: Tambah produk (Hanya admin)
router.post("/", authMiddleware, adminMiddleware, createProduct);

// Route: Edit produk (Hanya admin)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// Route: Hapus produk (Hanya admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
