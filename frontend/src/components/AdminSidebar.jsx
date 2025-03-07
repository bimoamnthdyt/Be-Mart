import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="w-60 h-screen bg-gray-800 text-white fixed top-0 left-0 p-5 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `block py-3 px-4 rounded-lg transition border-2 border-transparent ${
            isActive ? "bg-gray-800 border-orange-600" : "hover:border-orange-500"
          }`
        }
      >
        DASHBOARD
      </NavLink>
        </li>
        <li>
        <NavLink
            to="/admin/produk"
            className={({ isActive }) =>
              `block py-3 px-4 rounded-lg transition border-2 border-transparent ${
                isActive ? "bg-gray-800 border-orange-600" : "hover:border-orange-500"}`
            }
          >
            PRODUK
          </NavLink>
        </li>
        <li>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `block py-3 px-4 rounded-lg transition border-2 border-transparent ${
              isActive ? "bg-gray-800 border-orange-600" : "hover:border-orange-500"}`
          }
        >
          PESANAN
        </NavLink>
        </li>
        <li>
        <NavLink
          to="/admin/account"
          className={({ isActive }) =>
            `block py-3 px-4 rounded-lg transition border-2 border-transparent ${
              isActive ? "bg-gray-800 border-orange-600" : "hover:border-orange-500"}`
          }
        >
          USER/ACCOUNT
        </NavLink>
        </li>
      </ul>
      <button
        onClick={logout}
        className="mt-10 w-full text-center py-3 px-4 rounded-lg border-2 border-transparent hover:border-orange-500 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
