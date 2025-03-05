import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import UserNavbar from "../../components/UserNavbar";
import ProductListUser from "./ProductListUser";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard"); // Jika admin login, ke dashboard admin
    }
  }, [user, navigate]);

  return (
    <div>
      <UserNavbar />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-blue-500 text-white text-center p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold">🔥 Promo Spesial Hari Ini!</h2>
          <p>Diskon hingga 50% untuk produk pilihan.</p>
        </div>
        <ProductListUser />
      </div>
    </div>
  );
};

export default UserDashboard;
