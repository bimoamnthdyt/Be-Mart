import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Orders from "./pages/admin/Orders";
import Account from "./pages/admin/Account";
import AdminLayout from "./components/AdminLayout";
import ProductList from "./pages/admin/ProductList";

import UserDashboard from "./pages/user/UserDashboard";
import CartPage from "./pages/user/CartPage";
import OrderHistory from "./pages/user/OrderHistory";

// Protected Route untuk akses login
const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

// Redirect jika sudah login
const RedirectIfLoggedIn = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/"} /> : element;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />
          <Route path="/register" element={<RedirectIfLoggedIn element={<Register />} />} />

          {/* Halaman User */}
          <Route path="/user/cart" element={<PrivateRoute element={<CartPage />} />} />
          <Route path="/user/orders" element={<PrivateRoute element={<OrderHistory />} />} />

          {/* Halaman Admin */}
          <Route path="/admin" element={<PrivateRoute element={<AdminLayout />} />} >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="produk" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="account" element={<Account />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
