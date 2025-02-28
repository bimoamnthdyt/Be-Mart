import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const AdminSidebar = () => {
  const {logout} = useContext(AuthContext);
    return (
      <div className="h-scree w-64 bg-blue-400 text-white fixed top-0 left-0 p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li className="mb-2">
            <NavLink to="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-500">
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/orders" className="block py-2 px-4 rounded hover:bg-gray-500">
              Kelola Pesanan
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/produk" className="block py-2 px-4 rounded hover:bg-gray-500">
              Kelola Produk
            </NavLink>
          </li>
          <li className="mt-6">
            <button
              onClick={logout} // Logout langsung memanggil fungsi logout
              className="block w-full text-center py-2 px-4 rounded-3xl bg-blue-600 hover:bg-blue-900"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  }
  
  export default AdminSidebar;