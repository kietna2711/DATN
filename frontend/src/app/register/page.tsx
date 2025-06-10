"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./register.css";
import { useShowMessage } from "../utils/useShowMessage";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const showMessage = useShowMessage("register", "user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password || !confirm) {
      showMessage.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra email hợp lệ
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      showMessage.error("Email không hợp lệ!");
      return;
    }

    // Kiểm tra tên đăng nhập không chứa ký tự đặc biệt và tối thiểu 4 ký tự
    if (!/^[a-zA-Z0-9_]{4,}$/.test(username)) {
      showMessage.error("Tên đăng nhập phải từ 4 ký tự, không chứa ký tự đặc biệt!");
      return;
    }

    // Kiểm tra mật khẩu tối thiểu 6 ký tự
    if (password.length < 6) {
      showMessage.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Kiểm tra mật khẩu nhập lại
    if (password !== confirm) {
      showMessage.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    // Kiểm tra đồng ý điều khoản
    if (!agree) {
      showMessage.error("Bạn phải đồng ý với Điều khoản!");
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
          username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage.error(
          `Đăng ký thất bại: ${
            data?.message || JSON.stringify(data) || "Lỗi server"
          }`
        );
      } else {
        showMessage.success(`Đăng ký thành công cho ${email}`);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setAgree(false);
        setUsername("");
        // KHÔNG lưu user/token vào localStorage ở đây!
        window.location.href = "/login";
      }
    } catch (error) {
      showMessage.error("Lỗi kết nối đến server");
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
            type="text"
            placeholder="Tên đăng nhập *"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
