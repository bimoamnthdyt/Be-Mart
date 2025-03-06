const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  image: { type: String, required: false },// URL gambar produk
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
