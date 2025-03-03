import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

c// Protected Route untuk akses login
const PrivateRoute = ({ element }) => {
  return (
    <AuthContext.Consumer>
      {({ user }) => (user ? element : <Navigate to="/login" />)}
    </AuthContext.Consumer>
  );
};

// Redirect jika sudah login
const RedirectIfLoggedIn = ({ element }) => {
  return (
    <AuthContext.Consumer>
      {({ user }) =>
        user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} /> : element
      }
    </AuthContext.Consumer>
  );
};


export default PrivateRoute;
