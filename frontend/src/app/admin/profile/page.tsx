"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";

type AdminData = {
  name: string;
  email: string;
  isGoogle: boolean;
  role: string;
  lastLogin: string;
};

export default function AdminProfilePage() {
  const [adminData, setAdminData] = useState<AdminData>({
    name: "",
    email: "",
    isGoogle: false,
    role: "Quản trị viên",
    lastLogin: "",
  });

  // State cho đổi mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassMsg, setChangePassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ oldPassword?: string; newPassword?: string; confirmPassword?: string }>({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isGoogle =
      !!user.googleId ||
      user.provider === "google" ||
      user.isGoogle ||
      user.loginType === "google";

    setAdminData({
      name: user.fullName || user.name || user.username || "",
      email: user.email || "",
      isGoogle,
      role: user.role || "Quản trị viên",
      lastLogin: user.lastLogin
        ? new Date(user.lastLogin).toLocaleString("vi-VN")
        : "",
    });
  }, []);

  // Hàm đổi mật khẩu
  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChangePassMsg(null);
    const errors: { oldPassword?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!oldPassword) errors.oldPassword = "Vui lòng nhập mật khẩu hiện tại!";
    if (!newPassword) errors.newPassword = "Vui lòng nhập mật khẩu mới!";
    else if (newPassword.length < 6) errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự!";
    if (!confirmPassword) errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới!";
    else if (newPassword && newPassword !== confirmPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp!";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const token = localStorage.getItem("token");
    const username = adminData.name;

    if (!token || !username) {
      setChangePassMsg({ type: "error", text: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại." });
      return;
    }

    fetch(`http://localhost:3000/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Đổi mật khẩu không thành công");
        }
        return data;
      })
      .then(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setChangePassMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
      })
      .catch((err) => {
        console.error(err);
        setChangePassMsg({ type: "error", text: err.message || "Đổi mật khẩu không thành công" });
      });
  };

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        {/* Thông tin cá nhân */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
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
              <div className="mb-2">
                <span className="badge bg-primary">{adminData.role}</span>
              </div>
            </div>
          </div>

          {/* Form đổi mật khẩu */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">Đổi mật khẩu</h5>
            {adminData.isGoogle ? (
              <div className="alert alert-info mb-0">
                Tài khoản Google không thể đổi mật khẩu tại đây. 
                Vui lòng đổi mật khẩu trực tiếp trong <b>Google Account</b>.
              </div>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.oldPassword ? "is-invalid" : ""}`}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  {fieldErrors.oldPassword && (
                    <div className="invalid-feedback">{fieldErrors.oldPassword}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu mới</label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.newPassword ? "is-invalid" : ""}`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {fieldErrors.newPassword && (
                    <div className="invalid-feedback">{fieldErrors.newPassword}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Nhập lại mật khẩu mới</label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.confirmPassword ? "is-invalid" : ""}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {fieldErrors.confirmPassword && (
                    <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-warning w-100">
                  Đổi mật khẩu
                </button>
                {changePassMsg && (
                  <div className={`mt-3 alert alert-${changePassMsg.type === "success" ? "success" : "danger"}`}>
                    {changePassMsg.text}
                  </div>
                )}
              </form>
            )}
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