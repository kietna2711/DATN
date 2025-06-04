"use client";
import React, { useState } from "react";
import "./login.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Lấy danh sách user từ API
      const res = await fetch("http://localhost:3000/users");
      const users = await res.json();

      // Tìm user khớp email và password
      const found = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!found) {
        setError("Sai tài khoản hoặc mật khẩu!");
        return;
      }

      // Kiểm tra tài khoản bị khóa
      if (!found.visible) {
        setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        return;
      }

      // Lưu thông tin user vào localStorage (hoặc sessionStorage)
      localStorage.setItem("user", JSON.stringify(found));
      if (remember) {
        localStorage.setItem("remember", "true");
      } else {
        localStorage.removeItem("remember");
      }
      // Chuyển hướng sang trang chủ
      router.push("/");
    } catch (err) {
      setError("Lỗi kết nối máy chủ!");
    }
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
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
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
          <button
            className="google-btn"
            type="button"
            onClick={() =>
              (window.location.href = "http://localhost:3000/users/auth/google")
            }
          >
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