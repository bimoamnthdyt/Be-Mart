import { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  // Ambil data keranjang dari backend
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.items || []);
    } catch (error) {
      console.error("Gagal mengambil data keranjang", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Kuranging Qty
  const kurangQuantity = async (productId, quantity) => {
    if (quantity === 1) {
      removeItem(productId);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/cart/update/${productId}`,
        { quantity: quantity - 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // Perbarui data setelah perubahan
    } catch (error) {
      console.error("Gagal mengurangi jumlah produk", error);
    }
  };

  // Hapus produk dari keranjang
  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) {
      console.error("Gagal menghapus produk", error);
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
        Keranjang Anda
      </h4>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18l-1 9H4L3 3z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"></path>
          </svg>
          <p className="text-lg font-semibold">Keranjang kosong</p>
          <p className="text-sm">Tambahkan beberapa produk untuk melanjutkan belanja!</p>
        </div>
      ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.productId || item._id} className="border p-2 flex justify-between items-center">
                <span>
                  <strong>{item.name}</strong> - {item.quantity} x Rp {formatRupiah(item.price)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => kurangQuantity(item.productId, item.quantity)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                  >
                    ➖
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CartPage;
