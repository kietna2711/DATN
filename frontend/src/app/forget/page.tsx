"use client";
import React, { useState } from "react";
import "./forget.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Forget() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý gửi email ở đây (gọi API nếu cần)
    // Sau khi gửi thành công, chuyển sang trang xác thực
    router.push("/verify");
  };

  return (
    <div className="container">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
      <div className="circle circle4"></div>
      <div className="circle circle5"></div>

      <div className="forget-container">
        <div className="bear-ear left-ear"></div>
        <div className="bear-ear right-ear"></div>
        <h2>Quên mật khẩu</h2>
        <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="submit">Gửi liên kết</button>
          <Link href="/login" className="register-link">Quay lại đăng nhập</Link>
        </form>
      </div>
    </div>
  );
}