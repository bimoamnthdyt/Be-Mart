import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input 
          type="text" 
          placeholder="Nama" 
          className="w-full p-2 border rounded mb-2" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border rounded mb-2" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 border rounded mb-2" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
        <p className="mt-2 text-sm">Sudah punya akun? <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>Login</span></p>
      </form>
    </div>
  );
};

export default Register;
