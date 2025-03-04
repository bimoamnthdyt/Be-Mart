import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext"; 

const UserNavbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const [cartCount, setCartCount] = useState(() => {
    return localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
  });

  const navigate = useNavigate();
  const didFetchCart = useRef(false); // Prevent duplicate fetch

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartCount(data.items.length);
        localStorage.setItem("cartCount", data.items.length);
      } catch (error) {
        console.error("Gagal mengambil data keranjang", error);
      }
    };

    if (!didFetchCart.current) {
      didFetchCart.current = true; // Pastikan hanya fetch sekali
      fetchCartCount();
    }
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate(user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard")}
      >
        Be-Mart
      </h1>
      <div className="flex items-center gap-4">
        {user && (
          <p className="text-sm">
            Halo, <strong>{user.name}</strong>
          </p>
        )}
        <Link to="/user/cart" className="bg-white text-blue-500 px-3 py-1 rounded">
          🛒 
        </Link>
        <Link to="/user/orders" className="bg-white text-blue-500 px-3 py-1 rounded">
          📦 Pesanan
        </Link>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-700">
          Keluar
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;
