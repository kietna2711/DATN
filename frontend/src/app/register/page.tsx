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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert("Bạn phải đồng ý với Điều khoản!");
      return;
    }
    if (password !== confirm) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }
    setLoading(true);

    try {
      // Thay đổi URL backend đúng với server của bạn
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          `Đăng ký thất bại: ${
            data?.message || JSON.stringify(data) || "Lỗi server"
          }`
        );
      } else {
        alert(`Đăng ký thành công cho ${email}`);
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setAgree(false);
        // Chuyển hướng sang trang đăng nhập
        window.location.href = "/login";
      }
    } catch (error) {
      alert("Lỗi kết nối đến server");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Họ *"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="email"
            placeholder="Địa chỉ Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-email"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              Tôi đồng ý với{" "}
              <a
                href="#"
                style={{ color: "#d16ba5", textDecoration: "underline" }}
              >
                Điều khoản
              </a>
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
          <div className="social-login">
            <button
              className="google-btn"
              type="button"
              onClick={() =>
                (window.location.href = "http://localhost:3000/users/auth/google")
              }
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt=""
              />
              Google
            </button>
            <button
              className="facebook-btn"
              type="button"
              onClick={() =>
                (window.location.href = "http://localhost:3000/users/auth/facebook")
              }
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
                alt=""
              />
              Facebook
            </button>
          </div>
          <Link href="/login" className="register-link">
            Đã có tài khoản? Đăng nhập
          </Link>
        </form>
      </div>
    </div>
  );
}
