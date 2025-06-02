"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./register.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert("Bạn phải đồng ý với Điều khoản!");
      return;
    }
    if (password !== confirm) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }
    // Xử lý đăng ký ở đây
    alert(`Đăng ký thành công cho ${firstName} ${lastName} (${email})`);
  };

  return (
    <div className="container">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
      <div className="circle circle4"></div>
      <div className="circle circle5"></div>

      <div className="register-box">
        <div className="bear-ear left-ear"></div>
        <div className="bear-ear right-ear"></div>
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              placeholder="Tên *"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Họ *"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <input
            type="email"
            placeholder="Địa chỉ Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                required
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
              />
              Tôi đồng ý với <a href="#" style={{ color: "#d16ba5", textDecoration: "underline" }}>Điều khoản</a>
            </label>
          </div>
          <button type="submit">Đăng ký</button>
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
          <Link href="/login" className="register-link">Đã có tài khoản? Đăng nhập</Link>
        </form>
      </div>
    </div>
  );
}