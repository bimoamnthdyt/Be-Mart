import UserNavbar from "../../components/UserNavbar";
import ProductListUser from "./ProductListUser";

const UserDashboard = () => {
  return (
    <div>
      <UserNavbar />
      <div className="p-6 max-w-5xl mx-auto">
        {/* Banner Diskon */}
        <div className="bg-blue-500 text-white text-center p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold">🔥 Promo Spesial Hari Ini!</h2>
          <p>Diskon hingga 50% untuk produk pilihan.</p>
        </div>
        <ProductListUser />

        {/*untuk fitur baru seperti rekomendasi, best seller, dll */}
      </div>
    </div>
  );
};

export default UserDashboard;
