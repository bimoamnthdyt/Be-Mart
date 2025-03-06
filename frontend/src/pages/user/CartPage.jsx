import { useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import UserNavbar from "../../components/UserNavbar";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const CartPage = () => {
  const { cart = { items: [] }, totalPrice, fetchCart } = useContext(AuthContext);

  useEffect(() => {
    fetchCart(); 
}, []);

  // Tambah qty 
  const tambahQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await fetch(`/api/cart/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: quantity + 1 }),
      });
  
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Gagal menambah jumlah produk", error);
    }
  };

  // Kurangi Qty
  const kurangQuantity = async (productId, quantity) => {
    if (quantity === 1) {
      removeItem(productId);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/cart/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: quantity - 1 }),
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Gagal mengurangi jumlah produk", error);
    }
  };

  // Hapus produk dari keranjang
  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Gagal menghapus produk", error);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Checkout berhasil! " + (data.message || ""));
        fetchCart();
      } else {
        alert("Checkout gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Gagal melakukan checkout", error);
    }
  };

  // Format harga ke Rupiah
  const formatRupiah = (angka) => {
    return angka ? angka.toLocaleString("id-ID") : "0";
  };

  return (
    <div>
      <UserNavbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h4 className="md:text-2xl text-center font-extrabold text-gray-800 mb-6">
          Shopping Cart
        </h4>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
            <p className="text-lg font-semibold">Empty cart</p>
            <p className="text-sm">Add a few products to continue shopping!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cart?.items?.map((item) => (
              <div
                key={item.productId || item._id}
                className="flex items-center border-b pb-4 gap-4"
              >
                {/* Gambar Produk */}
                <img
                  src={`http://localhost:5000${item.image}`} // Tambahkan domain backend
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />

                {/* Detail Produk */}
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600 text-sm">Rp {formatRupiah(item.price)}</p>
                </div>

                {/* Tombol + / - / Hapus */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => kurangQuantity(item.productId, item.quantity)}
                    className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaMinus size={14} />
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button
                    onClick={() => tambahQuantity(item.productId, item.quantity)}
                    className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>

                {/* Total Harga & Hapus */}
                <div className="text-right">
                  <p className="font-bold">Rp {formatRupiah(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 mt-2 hover:text-red-700 flex items-center gap-1"
                  >
                    <FaTrash size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total & Checkout */}
            <div className="mt-6 text-right">
              <p className="font-bold text-xl">
                Total Harga: Rp {formatRupiah(totalPrice)}
              </p>
              <button
                onClick={handleCheckout}
                className="bg-orange-400 text-white px-6 py-3 rounded-lg mt-4 hover:bg-orange-500"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
