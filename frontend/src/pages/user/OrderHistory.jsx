import { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (error) {
        console.error("Gagal mengambil riwayat pesanan", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="p-6">
      <h4 className="md:text-2xl text-center font-extrabold text-gray-800 mb-6">
        Pesanan
      </h4>
        {orders.length === 0 ? (
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
          <p className="text-lg font-semibold">Riwayat Pesanan kosong</p>
          <p className="text-sm">Yuk Chekout produk Impian Kamu!</p>
        </div>
      ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id} className="border p-2">
                <strong>ID:</strong> {order._id} <br />
                <strong>Status:</strong> {order.status} <br />
                <strong>Total Harga:</strong> Rp {order.totalPrice.toLocaleString()} <br />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
