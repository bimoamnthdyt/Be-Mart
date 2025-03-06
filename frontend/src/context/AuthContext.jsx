import { createContext, useEffect, useState, useRef, useCallback } from "react";
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
    const didCheckAuth = useRef(false);

    const logout = useCallback(async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/logout", {}, {
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

        navigate("/");
    }, [token, navigate]);

    useEffect(() => {
        const checkAuth = async () => {
            if (!didCheckAuth.current && token) {
                didCheckAuth.current = true;

                try {
                    const response = await axios.get("http://localhost:5000/api/auth/verify", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    setUser(response.data.user);
                } catch (error) {
                    console.error("Token tidak valid, logout otomatis.");
                    logout();
                }
            }
        };

        checkAuth();
    }, [token, logout]); 

    const fetchCart = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const response = await fetch("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const data = await response.json();
            console.log("Fetched Cart Data:", data);
    
            setCart(data || { items: [] });
            setTotalPrice(data.totalPrice || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart({ items: [] });
            setTotalPrice(0);
        }
    }, [setCart, setTotalPrice]); 

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
