import { createContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    });
    
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [cart, setCart] = useState([]); 
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    // Mencegah request ganda
    const didCheckAuth = useRef(false); 
    // const didFetchCart = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!didCheckAuth.current && token) {
                didCheckAuth.current = true;

                try {
                    const response = await fetch("http://localhost:5000/api/auth/verify", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (!response.ok) {
                        throw new Error("Token tidak valid");
                    }

                    const userData = JSON.parse(localStorage.getItem("user"));
                    setUser(userData);
                } catch (error) {
                    setUser(null);
                    setToken("");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
        };

        checkAuth();
    }, [token]);

    //Fungsi Fetch Data Cart
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const { data } = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCart(data.items || []);
            setTotalPrice(data.totalPrice || 0);
        } catch (error) {
            console.error("Gagal mengambil data keranjang", error);
        }
    };

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/user/dashboard");
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error("Logout error:", error);
        }

        setUser(null);
        setToken("");
        setCart([]); 
        setTotalPrice(0);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ 
            user, setUser, 
            token, setToken, 
            cart, setCart, 
            totalPrice, setTotalPrice, 
            fetchCart, 
            login, logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
