import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  //Ambil data produk dari server
  const fetchProducts = () => {
    axios.get("http://localhost:5000/products")
      .then((res) => {
        console.log("Produk terbaru dari server:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //Fungsi untuk menghapus produk
  const deleteProduct = (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    axios.delete(`http://localhost:5000/products/${id}`)
      .then(() => {
        console.log("Produk Berhasil dihapus");
        fetchProducts(); // Perbarui daftar produk setelah penghapusan
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  //Fungsi untuk mengedit produk
  const handleEdit = (product) => {
    setEditProduct(product); // Simpan produk yang dipilih untuk diedit
    setModalOpen(true); // Buka modal edit
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Daftar Produk</h2>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => { setEditProduct(null); setModalOpen(true); }}
      >
        + Tambah
      </button>

      {/* Modal Form untuk Tambah/Edit Produk */}
      <ProductForm
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        refreshProducts={fetchProducts}
        editProduct={editProduct} // Kirim data produk yang akan diedit
      />

      {/* List Produk */}
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>Harga: <b>Rp{product.price}</b></p>
            <p>Stok: {product.stock}</p>

            {/* Tombol Edit */}
            <button
              className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
              onClick={() => handleEdit(product)}
            >
              Edit
            </button>

            {/* Tombol Hapus */}
            <button
              className="bg-red-500 text-white py-1 px-3 rounded"
              onClick={() => deleteProduct(product._id)}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
