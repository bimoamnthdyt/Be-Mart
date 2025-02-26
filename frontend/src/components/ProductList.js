import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";


function ProductList() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  // const MySwal = withReactContent(Swal);

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

  const deleteProduct = (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return; 
    axios.delete(`/products/${id}`)
    .then (() => {
      console.log("Produk Berhasil di hapus");
      fetchProducts(); // Perbarui daftar produk setelah penghapusan
    })
    .catch((err) => console.error("Error deleting product:", err));
  }
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Daftar Produk</h2>
      <button className="bg-green-500 text-white py-2 px-4 rounded mb-4" onClick={() => setModalOpen(true)} >
        + </button>

      <ProductForm isOpen={modalOpen} closeModal={() => setModalOpen(false)} refreshProducts={fetchProducts} />

      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>Harga: <b>Rp{product.price}</b></p>
            <p>Stok: {product.stock}</p>
            <button 
              className="bg-red-500 text-white py-1 px-3 mt-2 rounded"
              onClick={() => deleteProduct(product._id)} > Hapus </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
