'use client';
import React, { useEffect, useState } from 'react';
import './userprofile.css';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  status: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const username = pathParts[pathParts.length - 1];
    const token = localStorage.getItem('token');

    if (!username) {
      alert('Không có username trong URL');
      return;
    }

    fetch(`http://localhost:3000/api/usersProfile/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(err => {
        console.error(err);
        alert('Lỗi hoặc không tìm thấy user');
        window.location.href = '/login';
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSave = () => {
    if (!user) return;
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/api/usersProfile/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user),
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi cập nhật dữ liệu');
        alert('Cập nhật thành công!');
      })
      .catch(err => console.error('Lỗi khi cập nhật:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    window.location.href = '/login';
  };

  if (!user) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container">
      <div className="header">
        <div className="profile-header">
          <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <h2>{user.lastName} {user.firstName}</h2>
            <div className="user-status">
              <span className="status-badge status-active">{user.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="menu-item active">
            <span className="menu-icon">👤</span> Thông tin cá nhân
          </div>
          <div className="menu-item">
            <span className="menu-icon">📦</span> Đơn hàng
          </div>
          <div className="menu-item">
            <span className="menu-icon">🔒</span> Quên mật khẩu
          </div>
          <div className="menu-item" onClick={() => setShowLogoutConfirm(true)}>
            <span className="menu-icon">➡️</span> Đăng xuất
          </div>
        </div>

        <div className="content-area">
          <div className="section-title">Thông tin cá nhân</div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="lastName">Họ</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Tên</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Trạng thái</label>
              <input
                type="text"
                id="status"
                name="status"
                value={user.status}
                readOnly
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🐻 Bạn có chắc chắn muốn đăng xuất?</h3>
            <p>Nhấn tiếp tục để rời khỏi tài khoản.</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowLogoutConfirm(false)}>Huỷ</button>
              <button className="btn btn-confirm" onClick={handleLogout}>Tiếp tục</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
