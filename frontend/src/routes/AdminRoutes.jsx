import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductList from "../pages/admin/ProductList";
import PrivateRoute from "./PrivateRoute"; // Buat file ini untuk melindungi admin routes

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<PrivateRoute element={<AdminDashboard />} />} />
        <Route path="produk" element={<PrivateRoute element={<ProductList />} />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
