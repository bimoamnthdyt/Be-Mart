import { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../../components/ProductModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ambil data produk dari API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      setError("Gagal mengambil data produk");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi  menghapus produk
  const deleteProduct = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda tidak memiliki akses untuk menghapus produk.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
    } catch (err) {
      alert("Gagal menghapus produk, pastikan Anda memiliki akses.");
    }
  };

  // Fungsi membuka modal tambah produk
  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Fungsi menambah produk baru
  const handleAddProduct = async (newProduct) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda tidak memiliki akses untuk menambah produk.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setIsModalOpen(false);
        fetchProducts(); 
      } else {
        throw new Error("Server tidak mengembalikan status 201");
      }
    } catch (err) {
      alert(`Gagal menambahkan produk: ${err.response ? err.response.data.message : err.message}`);
    }
  };

  // Fungsi membuka modal edit produk
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Fungsi  menyimpan perubahan produk (update)
  const handleSaveEdit = async (updatedProduct) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda tidak memiliki akses untuk mengedit produk.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        updatedProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        throw new Error("Gagal memperbarui produk.");
      }
    } catch (err) {
      alert("Gagal mengupdate produk.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produk</h2>
        <button 
          onClick={handleAddClick} 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Tambah Produk
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Tabel Produk */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-4">Nama</th>
              <th className="border p-4">Harga</th>
              <th className="border p-4">Stok</th>
              <th className="border p-4">Deskripsi</th>
              <th className="border p-4">Kategori</th>
              <th className="border p-4 w-40">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border hover:bg-gray-100">
                <td className="border p-4">{product.name}</td>
                <td className="border p-4">Rp {product.price}</td>
                <td className="border p-4">{product.stock}</td>
                <td className="border p-4">{product.description}</td>
                <td className="border p-4">{product.category}</td>
                <td className="border p-4">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductModal
        product={editingProduct} // Jika null, berarti mode tambah
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingProduct ? handleSaveEdit : handleAddProduct}
      />
    </div>
  );
};

export default ProductList;
