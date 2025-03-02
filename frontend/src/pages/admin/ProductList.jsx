import { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../../components/ProductModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Notifikasi
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 6000);
  };

  // Ambil data produk dari API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      setError("Gagal mengambil data produk");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pencarian & Filter
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, products]);

  // Tambah produk
  const handleAddProduct = async (newProduct) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Anda tidak memiliki akses untuk menambah produk.", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        showNotification("Produk berhasil ditambahkan!", "success");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        throw new Error("Server tidak mengembalikan status 201");
      }
    } catch (err) {
      showNotification(`Gagal menambahkan produk: ${err.message}`, "error");
    }
  };

  // Edit produk
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Simpan edit produk
  const handleSaveEdit = async (updatedProduct) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Anda tidak memiliki akses untuk mengedit produk.", "error");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification("Produk berhasil diperbarui!", "success");
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      showNotification("Gagal mengupdate produk.", "error");
    }
  };

  // Hapus produk
  const deleteProduct = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Anda tidak memiliki akses untuk menghapus produk.", "error");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification("Produk berhasil dihapus!", "error");
      fetchProducts();
    } catch (err) {
      showNotification("Gagal menghapus produk.", "error");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Produk</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Notifikasi */}
      {notification && (
        <div className={`p-2 mb-4 rounded text-white text-sm ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {notification.message}
        </div>
      )}

      {/* Pesan Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Pencarian & Filter */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Cari Produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/2 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded w-1/3 text-sm"
        >
          <option value="">Pilih Kategori</option>
          <option value="Ikan dan Daging">Ikan dan Daging</option>
          <option value="Buah buahan">Buah buahan</option>
          <option value="Minuman">Minuman</option>
          <option value="Makanan Segar">Makanan Segar</option>
          <option value="Makanan Siap Saji">Makanan Siap Saji</option>
          <option value="Barang Rumah Tangga">Barang Rumah Tangga</option>
          <option value="Produk Kecantikan">Produk Kecantikan</option>
        </select>
      </div>

      {/* Tabel Produk */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="border p-2">Nama</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Deskripsi</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border hover:bg-gray-100">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">Rp.{product.price}</td>
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">{product.description}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2 flex gap-2">
                  <button onClick={() => handleEditClick(product)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400">✏️</button>
                  <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Produk */}
      <ProductModal product={editingProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={editingProduct ? handleSaveEdit : handleAddProduct} />
    </div>
  );
};

export default ProductList;
