"use client";
import React, { useState } from "react";
import "./login.css"; // Copy toàn bộ CSS của bạn vào file này
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    alert(`Email: ${email}\nPassword: ${password}\nRemember: ${remember}`);
  };

  return (
    <div className="container">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
      <div className="circle circle4"></div>
      <div className="circle circle5"></div>

      <form className="login-box" onSubmit={handleSubmit}>
        <div className="bear-ear left-ear"></div>
        <div className="bear-ear right-ear"></div>
        <h2>Đăng Nhập</h2>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            Nhớ tôi sau nhé
          </label>
          <Link href="/forget" className="forgot">Quên mật khẩu?</Link>
        </div>
        <button type="submit">Đăng nhập</button>
        <div className="social-login">
          <button className="google-btn" type="button">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="" />
            Google
          </button>
          <button className="facebook-btn" type="button">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="" />
            Facebook
          </button>
        </div>
        <Link href="/register" className="register-link">Bạn chưa có tài khoản?</Link>
      </form>
    </div>
  );
}