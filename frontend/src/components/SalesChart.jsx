import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/sales-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalesData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data penjualan", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {/* <h2 className="text-xl font-bold mb-4">Grafik Penjualan</h2> */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSales" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
