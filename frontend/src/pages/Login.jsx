import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if(response.ok) {
            login(data.user, data.token);
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
                <p className="mt-2 text-sm">Belum punya akun? <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/register")}>Daftar</span></p>
            </form>
        </div>
    );
};

export default Login;