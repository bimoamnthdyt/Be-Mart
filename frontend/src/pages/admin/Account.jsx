import { useEffect, useState } from "react";
import axios from "axios";


const Account = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Fungsi notifikasi
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Ambil data user dari API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      setError("Gagal mengambil data user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter pencarian
  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, users]);

  // Hapus user
  const deleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("User berhasil dihapus!", "success");
      fetchUsers();
    } catch (err) {
      showNotification("Gagal menghapus user.", "error");
    }
  };

  // Edit user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification("User berhasil diperbarui!", "success");
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      showNotification("Gagal mengupdate user.", "error");
    }
  };

  const togglePasswordVisibility  = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Daftar Pengguna</h2>
      </div>

      {/* Notifikasi */}
      {notification && (
        <div
          className={`p-3 mb-4 rounded text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Pesan Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Pencarian & Filter */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Cari User..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded w-1/3"
        >
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Tabel User */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-700 text-white text-left">
              <th className="border p-4">Nama</th>
              <th className="border p-4">Email</th>
              {/* <th className="border p-4">Password</th> */}
              <th className="border p-4">Role</th>
              <th className="border p-4 w-40">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border hover:bg-gray-100">
                <td className="border p-4">{user.name}</td>
                <td className="border p-4">{user.email}</td>
                <td className="border p-4">{user.role}</td>
                <td className="border p-4 flex gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-cyan-900 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition duration-300 shadow-md"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <input
              type="text"
              value={editingUser?.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="email"
              value={editingUser?.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <select
              value={editingUser?.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              className="p-2 border rounded w-full mb-4"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={() => handleSaveEdit(editingUser)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Simpan</button>
            <button onClick={() => setIsModalOpen(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg">Batal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
