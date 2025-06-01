import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/login.css";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading, error, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không trùng khớp!");
      return;
    }
    const success = await signup(name, email, password, confirmPassword);
    if (success) navigate("/");
  };

  if (user) navigate("/");

  return (
    <div className="login-container">
      <div className="signup-box">
        <h2 className="login-title">ĐĂNG KÝ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên</label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Tên của bạn"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? "Đang tải..." : "ĐĂNG KÝ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
