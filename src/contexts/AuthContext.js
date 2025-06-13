// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/api";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        // Check if user is already logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Invalid user data in localStorage", error);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await authService.login(email, password);
            if (res.data.status === "success") {
                setUser(res.data.data.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.data.user)
                );
                return res.data.data.user;
            }
        } catch (err) {
            throw new Error(
                err.response?.data?.message || "Không thể đăng nhập"
            );
        }
    };

    const signup = async (name, email, password, passwordConfirm) => {
        try {
            const res = await authService.signup(
                name,
                email,
                password,
                passwordConfirm
            );
            if (res.data.status === "success") {
                setUser(res.data.data.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.data.user)
                );
                return true;
            }
        } catch (err) {
            throw new Error(err.response?.data?.message || "Không thể đăng kí");
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            localStorage.removeItem("user");
            navigate("/");
            return true;
        } catch (err) {
            throw new Error("Không thể đăng xuất");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
