import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const { login, logout, signup } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      return await login(email, password);
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  const handleSignUp = async (name, email, password, passwordConfirm) => {
    try {
      setIsLoading(true);
      setError(null);
      return await signup(name, email, password, passwordConfirm);
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignUp,
    isLoading,
    error,
  };
};

export default useAuth;
