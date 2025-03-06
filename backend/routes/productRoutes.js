const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));// Simpan file di folder uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});
const upload = multer({ storage });

// Route: Ambil semua produk
router.get("/", getAllProducts);

// Route: Ambil produk berdasarkan ID
router.get("/:id", getProductById);

// Route: Tambah produk (Hanya admin) dengan upload gambar
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);

// Route: Edit produk (Hanya admin) dengan upload gambar
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);

// Route: Hapus produk (Hanya admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
