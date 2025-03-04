import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const didFetchOrders = useRef(false); // Mencegah request ganda
  const CACHE_DURATION = 3 * 60 * 1000; 

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("orders", JSON.stringify(data)); // Simpan data di cache
      localStorage.setItem("orders_cache_time", Date.now()); // Simpan waktu penyimpanan cache
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil riwayat pesanan", error);
    }
  };

  useEffect(() => {
    if (!didFetchOrders.current) {
      didFetchOrders.current = true; // Pastikan hanya fetch sekali

      const cachedOrders = JSON.parse(localStorage.getItem("orders"));
      const cacheTime = localStorage.getItem("orders_cache_time");

      // Periksa apakah cache masih berlaku
      if (cachedOrders && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        console.log("Menggunakan data dari cache");
        setOrders(cachedOrders); // Gunakan data dari cache
      } else {
        console.log("Cache expired, mengambil data baru");
        fetchOrders(); // Ambil data baru jika cache sudah kadaluarsa
      }
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
          Riwayat Pesanan Anda
        </h4>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
            <p className="text-lg font-semibold">Riwayat Pesanan kosong</p>
            <p className="text-sm">Yuk lakukan checkout produk impian kamu!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border border-gray-300 text-center">Total Harga</th>
                  <th className="p-3 border border-gray-300 text-center">Produk</th>
                  <th className="p-3 border border-gray-300 text-center">Status</th>
                  <th className="p-3 border border-gray-300 text-center">Pickup</th>
                  <th className="p-3 border border-gray-300 text-center">Aksi</th>
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
                        Detail Pesanan
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
