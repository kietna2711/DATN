"use client";
import React, { useRef, useState } from "react";
import "./verify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useShowMessage } from "../utils/useShowMessage"; // Thêm dòng này

export default function Verify() {
  const router = useRouter();
  const [error, setError] = useState("");
  const showMessage = useShowMessage("verify-otp", "user"); // Sử dụng hook
  const inputs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // Tự động chuyển focus khi nhập/xóa số
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (value && !/^\d$/.test(value)) {
      setError("Mã OTP chỉ được nhập số!");
    } else {
      setError("");
      if (value.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].current?.focus();
      }
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // reset lỗi cũ
    // Lấy mã OTP từ các ô input
    const otpArr = inputs.map(ref => ref.current?.value || "");
    const otp = otpArr.join("");
    const email = new URLSearchParams(window.location.search).get("email");

    if (!email) {
      setError("Thiếu email!");
      return;
    }
    if (otp.length !== 6) {
      setError("Mã OTP phải đủ 6 số!");
      return;
    }
    if (!otpArr.every(char => /^\d$/.test(char))) {
      setError("Mã OTP chỉ được nhập số!");
      return;
    }

    // Gửi OTP và email lên backend để xác thực
    const res = await fetch("http://localhost:3000/users/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      showMessage.success("Xác thực thành công! Vui lòng đặt lại mật khẩu.");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
      }, 1200);
    } else {
      setError(data.message || "Mã OTP không đúng hoặc đã hết hạn!");
    }
  };

  return (
    <div className="container">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
      <div className="circle circle4"></div>
      <div className="circle circle5"></div>

      <div className="verify-container">
        <div className="bear-ear left-ear"></div>
        <div className="bear-ear right-ear"></div>
        <h2>Nhập mã xác thực</h2>
        <p>Vui lòng nhập mã xác thực gồm 6 số đã gửi về email của bạn.</p>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="code-inputs">
            {inputs.map((ref, idx) => (
              <input
                key={idx}
                ref={ref}
                type="text"
                maxLength={1}
                pattern="[0-9]*"
                inputMode="numeric"
                required
                onInput={e => handleInput(e as React.ChangeEvent<HTMLInputElement>, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
              />
            ))}
          </div>
          {error && (
            <div className="input-error" style={{ textAlign: "center", margin: "8px 0" }}>
              {error}
            </div>
          )}
          <button type="submit">Xác nhận</button>
          <Link href="/forget" className="register-link">Gửi lại mã</Link>
        </form>
      </div>
    </div>
  );
}