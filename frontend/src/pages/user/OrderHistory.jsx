import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const didFetchOrders = useRef(false); // Mencegah request ganda

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

  useEffect(() => {
    if (!didFetchOrders.current) {
      didFetchOrders.current = true; 
      fetchOrders(); 
    }
  }, []);

  // Fungsi untuk format harga
  const formatRupiah = (angka) => {
    return angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  return (
    <div>
      <UserNavbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h4 className="md:text-2xl text-center font-extrabold text-gray-800 mb-6">
         Order History
        </h4>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
            <p className="text-lg font-semibold">Empty Order History</p>
            <p className="text-sm">Let's checkout your dream product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border border-gray-300 text-center">Total Price</th>
                  <th className="p-3 border border-gray-300 text-center">Product</th>
                  <th className="p-3 border border-gray-300 text-center">Status</th>
                  <th className="p-3 border border-gray-300 text-center">Pickup</th>
                  <th className="p-3 border border-gray-300 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border border-gray-300">
                    <td className="p-3 border border-gray-300 text-center font-bold">
                      {formatRupiah(order.totalPrice)}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {order.items.map((item) => item.name).join(", ")}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">{order.status}</td>
                    <td className="p-3 border border-gray-300 text-center">{order.pickupStatus}</td>
                    <td className="p-3 border border-gray-300 text-center flex items-center justify-center gap-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Detail Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
