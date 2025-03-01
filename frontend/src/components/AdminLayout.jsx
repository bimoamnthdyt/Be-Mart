import AdminSidebar from "./AdminSidebar";
import {Outlet} from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 ml-60">
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminLayout;