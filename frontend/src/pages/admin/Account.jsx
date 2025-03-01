import { useEffect, useState } from "react";
import axios from "axios";


const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setAccounts(response.data);
    } catch (error) {
      setError("Gagal mengambil data user");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);


  return (
    <div className="p-6 bg-white shadow-lg rounded-lg overflow-x-auto">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Accont</h2>
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        + Account
      </button>
    </div>

    {error && <p className="text-red-500">{error}</p>}

    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-4">Nama</th>
            <th className="border p-4">email</th>
            <th className="border p-4">password</th>
            <th className="border p-4">Role</th>
            <th className="border p-4 w-40">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account._id} className="border hover:bg-gray-100">
              <td className="border p-4">{account.name}</td>
              <td className="border p-4">{account.email}</td>
              <td className="border p-4">hidden</td>
              <td className="border p-4">{account.role}</td>
              <td className="border p-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700" >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Account;
