"use client";
import React, { useRef } from "react";
import "./verify.css"; 
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Verify() {
  const router = useRouter();
  const inputs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // Tự động chuyển focus khi nhập/xóa số
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (value.length === 1 && idx < inputs.length - 1) {
      inputs[idx + 1].current?.focus();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý xác thực ở đây
    router.push("/login");
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
          <button type="submit">Xác nhận</button>
          <Link href="/forget" className="register-link">Gửi lại mã</Link>
        </form>
      </div>
    </div>
  );
}