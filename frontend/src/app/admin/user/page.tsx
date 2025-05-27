"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  dob: string;
  role: string;
  status: "Hoạt động" | "Khóa" | "Đã ẩn";
  checked: boolean;
  visible: boolean;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    username: "nguyenvana",
    dob: "10/09/1998",
    role: "Admin",
    status: "Hoạt động",
    checked: false,
    visible: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    username: "tranthib",
    dob: "02/12/1999",
    role: "User",
    status: "Khóa",
    checked: false,
    visible: false,
  },
  // Thêm các user khác nếu cần
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectAll, setSelectAll] = useState(false);
  const [clock, setClock] = useState("");

  // Đồng hồ realtime
  useEffect(() => {
    function updateClock() {
      const today = new Date();
      const weekday = [
        "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
      ];
      const day = weekday[today.getDay()];
      let dd: string | number = today.getDate();
      let mm: string | number = today.getMonth() + 1;
      const yyyy = today.getFullYear();
      let h: string | number = today.getHours();
      let m: string | number = today.getMinutes();
      let s: string | number = today.getSeconds();
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      dd = dd < 10 ? "0" + dd : dd;
      mm = mm < 10 ? "0" + mm : mm;
      const nowTime = `${h} giờ ${m} phút ${s} giây`;
      const dateStr = `${day}, ${dd}/${mm}/${yyyy}`;
      setClock(`${dateStr} - ${nowTime}`);
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Chọn tất cả
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setUsers(users =>
      users.map(u => ({ ...u, checked: !selectAll }))
    );
  };

  // Chọn từng dòng
  const handleCheck = (idx: number) => {
    setUsers(users =>
      users.map((u, i) =>
        i === idx ? { ...u, checked: !u.checked } : u
      )
    );
  };

  // Toggle ẩn/hiện user
  const handleToggleVisibility = (idx: number) => {
    setUsers(users =>
      users.map((u, i) =>
        i === idx
          ? {
              ...u,
              visible: !u.visible,
              status: !u.visible
                ? u.role === "Admin"
                  ? "Hoạt động"
                  : "Hoạt động"
                : "Đã ẩn",
            }
          : u
      )
    );
  };

  // Xóa tất cả user đã chọn
  const handleDeleteAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các user đã chọn?")) {
      setUsers(users => users.filter(u => !u.checked));
      setSelectAll(false);
    }
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active"><a href="#"><b>Quản lý user</b></a></li>
        </ul>
        <div id="clock">{clock}</div>
      </div>
      <div className="row element-button">
        <div className="col-sm-2">
          <a className="btn btn-add btn-sm" href="form-add-user.html" title="Thêm">
            <i className="fas fa-plus"></i> Tạo mới user
          </a>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-delete btn-sm" type="button" title="Xóa tất cả" onClick={handleDeleteAll}>
            <i className="fas fa-trash-alt"></i> Xóa tất cả
          </button>
        </div>
        {/* Các nút tải file, in, xuất excel/pdf, sao chép có thể bổ sung sau */}
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <table className="table table-hover table-bordered" id="sampleTable">
                <thead>
                  <tr>
                    <th style={{ width: "10px" }}>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Ngày sinh</th>
                    <th>Quyền</th>
                    <th>Trạng thái</th>
                    <th>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u.id}>
                      <td width="10">
                        <input
                          type="checkbox"
                          checked={u.checked}
                          onChange={() => handleCheck(idx)}
                        />
                      </td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.username}</td>
                      <td>{u.dob}</td>
                      <td>{u.role}</td>
                      <td>
                        <span className={`badge ${
                          u.status === "Hoạt động"
                            ? "bg-success"
                            : u.status === "Khóa"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-light btn-sm toggle-visibility"
                          type="button"
                          title="Ẩn/Hiện"
                          onClick={() => handleToggleVisibility(idx)}
                        >
                          <i className={`fas ${u.visible ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center">Không có user nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Có thể bổ sung modal xác nhận xóa, sửa user nếu cần */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}