import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Orders from "./pages/admin/Orders";
import Account from "./pages/admin/Account";
import AdminLayout from "./components/AdminLayout";
import ProductList from "./pages/admin/ProductList";

// Protected Route untuk halaman yang membutuhkan login
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

// Redirect jika pengguna sudah login
const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} />;
  }
  return children;
};

//  Wrapper untuk halaman admin (harus login & admin)
const AdminRoute = () => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Halaman Login & Register */}
          <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
          <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />

          {/* Halaman User */}
          <Route path="/user/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

          {/* Halaman Admin */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="" element={<AdminLayout />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="produk" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="account" element={<Account />} />
          </Route>

          {/* Redirect jika route tidak ditemukan */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
