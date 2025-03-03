import { useState, useEffect } from "react";
import axios from "axios";
import SalesChart from "../../components/SalesChart";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        console.error("Gagal Mengambil Statistik");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

      {/* Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Total Pengguna</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Total Produk</h2>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Total Pesanan</h2>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Grafik Penjualan */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Grafik Penjualan</h2>
        <SalesChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
