import { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../../components/ProductModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Untuk notifikasi sukses/error
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);


  // Notifikasi 
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 6000); 
  };

  // Fungsi pencarian & filter
  useEffect(() => {
    let filtered = products;
  
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (categoryFilter) {
      filtered = filtered.filter((product) => 
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
  
    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, products]);


    // Ambil data produk dari API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
        setMessage(null); 
      } catch (error) {
        setError("Gagal mengambil data produk");
      }
    };
  
    useEffect(() => {
      fetchProducts();
    }, []);
  

  // Tambah produk
  const handleAddProduct = async (newProduct) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Anda tidak memiliki akses untuk menambah produk.", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        newProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        showNotification("Produk berhasil ditambahkan!", "success");
        setIsModalOpen(false);
        setEditingProduct(null);
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

  // Simpan perubahan edit produk
  const handleSaveEdit = async (updatedProduct) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Anda tidak memiliki akses untuk mengedit produk.", "error");
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
        showNotification("Produk berhasil diperbarui!", "success");
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        throw new Error("Gagal memperbarui produk.");
      }
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
      showNotification("Gagal menghapus produk, pastikan Anda memiliki akses.", "error");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produk</h2>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} 
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Notifikasi & Feedback */}
    {notification && (
      <div
        className={`p-3 mb-4 rounded text-white ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {notification.message}
      </div>
    )}

    {/* Pesan Error */}
    {error && <p className="text-red-500">{error}</p>}


      {/* Pencarian & Filter */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Cari Produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded w-1/3"
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
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-700 text-white text-left">
              <th className="border p-4">Nama</th>
              <th className="border p-4">Harga</th>
              <th className="border p-4">Stok</th>
              <th className="border p-4">Deskripsi</th>
              <th className="border p-4">Kategori</th>
              <th className="border p-4 w-40">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border hover:bg-gray-100">
                <td className="border p-4">{product.name}</td>
                <td className="border p-4">Rp.{product.price}</td>
                <td className="border p-4">{product.stock}</td>
                <td className="border p-4">{product.description}</td>
                <td className="border p-4">{product.category}</td>
                <td className="border p-4 flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex items-center gap-2 bg-cyan-900 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition duration-300 shadow-md"
                  >
                    ✏️
                  </button>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Produk */}
      <ProductModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingProduct ? handleSaveEdit : handleAddProduct}
      />
    </div>
  );
};

export default ProductList;
