const Product = require("../models/Product");


// Ambil semua produk
const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    }catch (error){
        res.status(500).json({message: "Gagal Mengambil Produk!", error: error.message});
    }
};

// Ambil produk berdasarkan ID
const getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan!" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server!", error: error.message });
    }
  };
  
  // Tambah produk (Hanya Admin)
  const createProduct = async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.json({ message: "Produk berhasil ditambahkan!", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Gagal menambahkan produk!", error: error.message });
    }
  };
  
  // Edit produk (Hanya Admin)
  const updateProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Produk tidak ditemukan!" });
      }
      res.json({ message: "Produk berhasil diperbarui!", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server!", error: error.message });
    }
  };
  
  // Hapus produk (Hanya Admin)
  const deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Produk tidak ditemukan!" });
      }
      res.json({ message: "Produk berhasil dihapus!" });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server!", error: error.message });
    }
  };

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
