import { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const updatePickupStatus = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/pickup/${orderId}`,
        { pickupStatus: "sudah diambil" },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui status!");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg overflow-auto">
      <h2 className="text-xl font-bold mb-4">Daftar Pesanan</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full overflow-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-700 text-white text-left">
              <th className="border p-2">ID Pesanan</th>
              <th className="border p-2">Pemesan</th>
              <th className="border p-2">Produk</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Total Harga</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Pickup</th>
              <th className="border p-2 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border hover:bg-gray-100">
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.userId?.email}</td>
                <td className="border p-2">
                  {order.items.map((item) => item.name).join(", ")}
                </td>
                <td className="border p-2">{order.items.map((item) => item.quantity).join(", ")}</td>
                <td className="border p-2">Rp.{order.totalPrice}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">{order.pickupStatus}</td>
                <td className="border p-2">
                  {order.pickupStatus !== "sudah diambil" ? (
                    <button
                      onClick={() => updatePickupStatus(order._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-500 transition"
                    >
                      ✅ Tandai
                    </button>
                  ) : (
                    <span className="text-gray-500">✔ Selesai</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
