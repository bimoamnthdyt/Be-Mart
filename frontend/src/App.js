import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route untuk mencegah akses tanpa login
const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

// Redirect jika sudah login
const RedirectIfLoggedIn = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} /> : element;
};

function App() {
  return (
      <Router>
        <AuthProvider>        
          <Routes>
          <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />
          <Route path="/register" element={<RedirectIfLoggedIn element={<Register />} />} />

          {/* Proteksi route biar ga bisa diakses tanpa login */}
          <Route path="/user/dashboard" element={<PrivateRoute element={<UserDashboard />} />} />
          <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />

          <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;