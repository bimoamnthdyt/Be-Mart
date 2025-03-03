import { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Ambil daftar produk dari backend
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil produk", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Tambahkan produk ke keranjang
  const addToCart = async (productId, stock) => {
    const quantity = quantities[productId] || 1; // Ambil jumlah dari input, default 1
    if (quantity > stock) {
      alert("Jumlah melebihi stok yang tersedia!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      // console.log("Mengirim ke backend:", { productId, quantity });
  
      await axios.post(
        "/api/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Produk (${quantity} item) berhasil ditambahkan ke keranjang!`);
    } catch (error) {
      console.error("Gagal menambah ke keranjang", error);
    }
  };

  const formatRupiah = (angka) => {
    return angka.toLocaleString("id-ID");
  };

  const handleQuantityChange = (productId, value, stock) => {
    const qty = Math.max(1, Math.min(stock, Number(value))); 
    setQuantities((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  return (
    <div>
      <UserNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <p>Produk tidak tersedia.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="border p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-700">Rp {product.price.toLocaleString("id-ID")}</p>
                <p className="text-gray-500 text-sm">Stok: {product.stock}</p>

                {/* Input jumlah barang */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={quantities[product._id] || 1}
                    onChange={(e) => handleQuantityChange(product._id, e.target.value, product.stock)}
                    className="border rounded px-2 py-1 w-16 text-center"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => addToCart(product._id, product.stock)}
                    className="bg-green-500 text-white text-sm px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
