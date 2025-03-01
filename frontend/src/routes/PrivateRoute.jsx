import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  console.log("User:", user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/user/dashboard" />; // Jika bukan admin, redirect ke UserDashboard
  }

  return element;
};

export default PrivateRoute;
