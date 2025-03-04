import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import UserNavbar from "../../components/UserNavbar";

const CartPage = () => {
  const { cart, totalPrice, fetchCart } = useContext(AuthContext);

  // Kurangi Qty
  const kurangQuantity = async (productId, quantity) => {
    if (quantity === 1) {
      removeItem(productId);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/cart/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: quantity - 1 }),
      });
      fetchCart(); // Perbarui cart setelah mengurangi qty
    } catch (error) {
      console.error("Gagal mengurangi jumlah produk", error);
    }
  };

  // Hapus produk dari keranjang
  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); // Perbarui cart setelah menghapus produk
    } catch (error) {
      console.error("Gagal menghapus produk", error);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Checkout berhasil! " + (data.message || ""));
        fetchCart(); // Kosongkan keranjang setelah checkout
      } else {
        alert("Checkout gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Gagal melakukan checkout", error);
    }
  };

  const formatRupiah = (angka) => {
    return angka.toLocaleString("id-ID");
  };

  return (
    <div>
      <UserNavbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h4 className="md:text-2xl text-center font-extrabold text-gray-800 mb-6">
          Keranjang Anda
        </h4>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
            <p className="text-lg font-semibold">Keranjang kosong</p>
            <p className="text-sm">Tambahkan beberapa produk untuk melanjutkan belanja!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border border-gray-300">Produk</th>
                  <th className="p-3 border border-gray-300 text-center">Harga Satuan</th>
                  <th className="p-3 border border-gray-300 text-center">Jumlah</th>
                  <th className="p-3 border border-gray-300 text-center">Total</th>
                  <th className="p-3 border border-gray-300 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId || item._id} className="border border-gray-300">
                    <td className="p-3 border border-gray-300">{item.name}</td>
                    <td className="p-3 border border-gray-300 text-center">Rp {formatRupiah(item.price)}</td>
                    <td className="p-3 border border-gray-300 text-center">{item.quantity}</td>
                    <td className="p-3 border border-gray-300 text-center font-bold">
                      Rp {formatRupiah(item.price * item.quantity)}
                    </td>
                    <td className="p-3 border border-gray-300 text-center flex items-center justify-center gap-2">
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
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 font-bold text-lg text-right">Total Harga: Rp {formatRupiah(totalPrice)}</div>
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 w-full"
            >
              Checkout Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
