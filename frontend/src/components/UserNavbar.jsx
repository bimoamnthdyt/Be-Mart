import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext"; 

const UserNavbar = () => {
  const { user, logout} = useContext(AuthContext) || JSON.parse(localStorage.getItem("user")) || {};

  // const [setCartCount] = useState(() => {
  //   // return localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
  // });

  const navigate = useNavigate();
  const didFetchCart = useRef(false); 

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // setCartCount(data.items.length);
        localStorage.setItem("cartCount", data.items.length);
      } catch (error) {
        console.error("Gagal mengambil data keranjang", error);
      }
    };

    if (!didFetchCart.current) {
      didFetchCart.current = true;
      fetchCartCount();
    }
  }, []); 

  return (
    <nav className="bg-gray-800 text-white p-5 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate(user?.role === "admin" ? "/admin/dashboard" : "/")}
      >
        Be-Mart
      </h1>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <p className="text-sm">
            Halo, <strong>{user?.name || JSON.parse(localStorage.getItem("user"))?.name || "Guest"}</strong>
            </p>
            <Link 
              to="/user/cart" 
              className="bg-white text-black px-3 py-1 rounded-2xl border-2 border-transparent hover:border-orange-500">
              🛒 
            </Link>
            <Link 
              to="/user/orders" 
              className="bg-white text-gray-500 px-3 py-1 rounded-2xl border-2 border-transparent hover:border-orange-500">
              📦 Orders
            </Link>
            <button 
              onClick={logout} 
              className="px-3 py-1 rounded-xl border-2 border-transparent hover:border-orange-500">
              Log out
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate("/login")} 
              className="bg-white text-black px-3 py-1 rounded-2xl border-2 border-transparent hover:border-orange-500">
              Login / Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
