import { createContext, useContext, useEffect, useState } from "react";
import { authService, userService } from "../services/api";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await userService.getMe();
        const user = res.data.data.data;
        if (user) {
          setUser(user);
        }
        setLoading(false);
      } catch (error) {}
    }
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.data.status === "success") {
        setUser(res.data.data.user);
        return res.data.data.user;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || "Không thể đăng nhập");
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
      navigate("/");
      return true;
    } catch (err) {
      throw new Error("Không thể đăng xuất");
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await authService.forgotPassword(email);
      if (res.data.status === "success") return true;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          "Có vấn đề xảy ra trong quá trình xác nhận!"
      );
    }
  };

  const resetPassword = async (email, token, password, passwordConfirm) => {
    try {
      const res = await authService.resetPassword(
        email,
        token,
        password,
        passwordConfirm
      );
      if (res.data.status === "success") return true;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Không thể đặt lại mật khẩu"
      );
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
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
