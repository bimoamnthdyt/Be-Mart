import { createContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

const AuthContext   = createContext();

export const AuthProvider = ({children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
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


    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        if(userData.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/user/dashboard");
        }
    };

    const logout = async () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    try {
        await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("Logout error:", error);
    }

    navigate("/login");
};

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
             {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;