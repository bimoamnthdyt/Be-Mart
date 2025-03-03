import { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const UserDashboard = () => {
  const [products, setProducts] = useState([]);

  // ✅ Ambil daftar produk dari backend
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil produk", error);
    }
  };

  // ✅ Panggil fetchProducts() saat komponen pertama kali dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Tambahkan produk ke keranjang
  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Produk ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Gagal menambah ke keranjang", error);
    }
  };

  const formatRupiah = (angka) => {
    return angka.toLocaleString("id-ID");
  };

  return (
    <div>
      <UserNavbar />
      <div className="p-6">
      <h4 className="md:text-2xl text-center font-extrabold text-gray-800 mb-6">
        Daftar Produk
      </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <p>Produk tidak tersedia.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="border p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                {/* <h2 className="text-sm font-italic">{product.description}</h2> */}
                <p className="text-base text-gray-700">Rp {formatRupiah(product.price)}</p>
                <button
                  onClick={() => addToCart(product._id)}
                  className="bg-green-400 text-white text-sm px-3 py-1 mt-2 rounded-md hover:bg-green-600 w-fit"
                >
                  + Keranjang
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
