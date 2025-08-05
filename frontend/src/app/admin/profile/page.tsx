"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const accessStats = [
  { week: "Tuần 1", month: "Tháng 7", visits: 120 },
  { week: "Tuần 2", month: "Tháng 7", visits: 98 },
  { week: "Tuần 3", month: "Tháng 7", visits: 110 },
  { week: "Tuần 4", month: "Tháng 7", visits: 150 },
  { week: "Tuần 1", month: "Tháng 8", visits: 130 },
  { week: "Tuần 2", month: "Tháng 8", visits: 105 },
  { week: "Tuần 3", month: "Tháng 8", visits: 140 },
  { week: "Tuần 4", month: "Tháng 8", visits: 160 },
];

type AdminData = {
  name: string;
  email: string;
  isGoogle: boolean; // true nếu là tài khoản google
};

export default function AdminProfilePage() {
  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [adminData, setAdminData] = useState<AdminData>({
    name: "",
    email: "",
    isGoogle: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Xác định tài khoản đăng nhập qua Google
    // Ví dụ: Có thuộc tính googleId hoặc provider === "google"
    const isGoogle =
      !!user.googleId ||
      user.provider === "google" ||
      user.isGoogle ||
      user.loginType === "google";
    setAdminData({
      name: user.fullName || user.name || user.username || "",
      email: user.email || "",
      isGoogle,
    });
    fetch("http://localhost:3007/api/admin/increase-visit", { method: "POST" });
  }, []);

  // Đổi mật khẩu thường
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!oldPass || !newPass || !confirmPass) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (newPass.length < 6) {
      setMessage("Mật khẩu mới phải ít nhất 6 ký tự.");
      return;
    }
    if (newPass !== confirmPass) {
      setMessage("Mật khẩu mới không khớp.");
      return;
    }
    setLoading(true);
    try {
      // Lấy token từ localStorage nếu có
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3007/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          oldPassword: oldPass,
          newPassword: newPass,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Đổi mật khẩu thành công!");
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
        setShowChangePass(false);
      } else {
        setMessage(data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        {/* Thông tin cá nhân */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              {/* Avatar với chữ cái đầu */}
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#ffd700",
                  color: "#b30000",
                  fontSize: 44,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  border: "3px solid #fffbe6",
                  boxShadow: "0 2px 8px #ffd70099",
                }}
              >
                {adminData.name && adminData.name.trim() !== ""
                  ? adminData.name.trim().split(" ").filter(Boolean).pop()?.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <h4 className="mb-1">{adminData.name}</h4>
              <div className="mb-2 text-muted">{adminData.email}</div>
              {adminData.isGoogle ? (
                <div className="alert alert-warning py-2 mt-2">
                  <i className="fab fa-google me-2"></i>
                  Tài khoản Google không thể đổi mật khẩu trên hệ thống!
                </div>
              ) : (
                <>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowChangePass((v) => !v)}
                  >
                    Đổi mật khẩu
                  </button>
                  {showChangePass && (
                    <form className="mt-3" onSubmit={handleChangePassword}>
                      <div className="mb-2">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Mật khẩu cũ"
                          value={oldPass}
                          onChange={(e) => setOldPass(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Mật khẩu mới"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Nhập lại mật khẩu mới"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      {message && (
                        <div className="alert alert-info py-1 mb-2">{message}</div>
                      )}
                      <button
                        className="btn btn-warning btn-sm"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Biểu đồ truy cập */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-warning text-dark">
              <b>Biểu đồ lượt truy cập admin theo tuần</b>
            </div>
            <div className="card-body" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accessStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    name="Lượt truy cập"
                    stroke="#ff7300"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3" style={{ fontSize: 13 }}>
          <b>
            Copyright {new Date().getFullYear()} Phần mềm quản lý bán hàng | Dev Mimi Bear
          </b>
        </div>
      </div>
    </main>
  );
}