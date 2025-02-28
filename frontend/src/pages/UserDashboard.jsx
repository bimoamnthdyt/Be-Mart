import {useContext } from "react";
import AuthContext from "../context/AuthContext";


const UserDashboard = () => {
    const {logout} = useContext (AuthContext);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p>Selamat datang di Dashboard User!</p>
        <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
      </div>
    );
  };
  
  export default UserDashboard;