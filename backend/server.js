// Mengimpor Modul yang Dibutuhkan
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Inisialisasi Aplikasi Express
const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// Model Produk
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number
});
const Product = mongoose.model("Product", ProductSchema);

// Route: Ambil semua produk
app.get("/products", async (req, res) => {  // ✅ Fix requestAnimationFrame jadi req
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
    }
});

// Route: Tambah produk baru
app.post("/products", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json({ message: "Produk berhasil ditambahkan!" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menambahkan produk!", error: err.message });
    }
});

// Route: Hapus produk berdasarkan ID
app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Produk tidak ditemukan!" });
        }

        res.json({ message: "Produk berhasil dihapus!" });
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
    }
});

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
