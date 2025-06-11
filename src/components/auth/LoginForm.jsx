import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (user) {
      switch (user.role?.trim().toLowerCase()) {
        case "admin":
          navigate("/admin");
          break;
        case "customer":
          navigate("/");
          break;
        case "partner":
          navigate("/partner/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">ĐĂNG NHẬP</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Tài khoản Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? "Đang tải..." : "ĐĂNG NHẬP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
