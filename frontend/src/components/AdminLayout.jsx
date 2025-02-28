import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      {/*Sidebar di kiri */}
      <AdminSidebar />

      {/*Konten halaman admin */}
      <div className="pl-40 p-6 w-full max-w-4xl">{children}</div>
    </div>
  );
};

export default AdminLayout;
