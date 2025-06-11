'use client';
import React, { useEffect, useState } from 'react';
import AddressManager from './AddressManager';
import './userprofile.css';

interface Address {
  id: string;
  detail: string;
}

interface Profile {
  phone?: string;
  gender?: string;
  birthDate?: string;
  addresses?: Address[];
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  status: string;
  googleId?: string;
  profile?: Profile;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'password' | 'address'>('profile');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData) {
      window.location.href = '/login';
      return;
    }

    const parsedUser = JSON.parse(userData);
    const isGoogleUser = !!parsedUser.googleId;

    if (isGoogleUser) {
      if (!parsedUser.profile) {
        parsedUser.profile = { addresses: [] };
      } else if (!parsedUser.profile.addresses) {
        parsedUser.profile.addresses = [];
      }
      setUser(parsedUser);
    } else {
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const userId = parsedUser._id;
      fetch(`http://localhost:3000/api/usersProfile/id/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
          return res.json();
        })
        .then((data: any) => {
          if (!data.profile) data.profile = { addresses: [] };
          else if (!data.profile.addresses) data.profile.addresses = [];
          setUser(data);
        })
        .catch(err => {
          console.error('Lỗi khi lấy user:', err);
          window.location.href = '/login';
        });
    }
  }, []);

  const isGoogleUser = !!user?.googleId;

  // Handler cho trường của user (khi chỉnh sửa)
  const handleUserEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editUser) return;
    const { name, value } = e.target;
    setEditUser(prev => prev ? { ...prev, [name]: value } : prev);
  };

  // Handler cho trường của profile (khi chỉnh sửa)
  const handleProfileEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editUser) return;
    const { name, value } = e.target;
    setEditUser(prev => prev ? {
      ...prev,
      profile: { ...prev.profile, [name]: value }
    } : prev);
  };

  // Cập nhật địa chỉ (khi chỉnh sửa)
  const handleEditAddresses = (newAddresses: Address[]) => {
    if (!editUser) return;
    setEditUser(prev => prev ? {
      ...prev,
      profile: { ...prev.profile, addresses: newAddresses }
    } : prev);
  };

  // Khi chưa chỉnh sửa: hiển thị readonly
  const renderUserInfo = () => (
    <div className="form-grid">
      <div className="form-group">
        <label>Họ</label>
        <input type="text" value={user?.lastName || ''} disabled />
      </div>
      <div className="form-group">
        <label>Tên</label>
        <input type="text" value={user?.firstName || ''} disabled />
      </div>
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input type="text" value={user?.username || ''} disabled />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="text" value={user?.email || ''} disabled />
      </div>
      <div className="form-group">
        <label>Số điện thoại</label>
        <input type="text" value={user?.profile?.phone || ''} disabled />
      </div>
      <div className="form-group">
        <label>Giới tính</label>
        <input type="text" value={user?.profile?.gender || ''} disabled />
      </div>
      <div className="form-group">
        <label>Ngày sinh</label>
        <input type="text" value={user?.profile?.birthDate ? user.profile.birthDate.slice(0, 10) : ''} disabled />
      </div>
    </div>
  );

  // Form chỉnh sửa cho user thường
  const renderEditFormNormal = () => (
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="lastName">Họ</label>
        <input type="text" id="lastName" name="lastName" value={editUser?.lastName || ''} onChange={handleUserEditChange} />
      </div>
      <div className="form-group">
        <label htmlFor="firstName">Tên</label>
        <input type="text" id="firstName" name="firstName" value={editUser?.firstName || ''} onChange={handleUserEditChange} />
      </div>
      <div className="form-group">
        <label htmlFor="username">Tên đăng nhập</label>
        <input type="text" id="username" name="username" value={editUser?.username || ''} onChange={handleUserEditChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={editUser?.email || ''} onChange={handleUserEditChange} />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Số điện thoại</label>
        <input type="text" id="phone" name="phone" value={editUser?.profile?.phone || ''} onChange={handleProfileEditChange} />
      </div>
      <div className="form-group">
        <label htmlFor="gender">Giới tính</label>
        <select id="gender" name="gender" value={editUser?.profile?.gender || ''} onChange={handleProfileEditChange}>
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="birthDate">Ngày sinh</label>
        <input type="date" id="birthDate" name="birthDate" value={editUser?.profile?.birthDate ? editUser.profile.birthDate.slice(0, 10) : ''} onChange={handleProfileEditChange} />
      </div>
    </div>
  );

  // Form chỉnh sửa cho user Google
  const renderEditFormGoogle = () => (
    <div className="form-grid">
      <div className="form-group">
        <label>Họ</label>
        <input type="text" value={editUser?.lastName || ''} disabled />
      </div>
      <div className="form-group">
        <label>Tên</label>
        <input type="text" value={editUser?.firstName || ''} disabled />
      </div>
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input type="text" value={editUser?.username || ''} disabled />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="text" value={editUser?.email || ''} disabled />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Số điện thoại</label>
        <input type="text" id="phone" name="phone" value={editUser?.profile?.phone || ''} onChange={handleProfileEditChange} />
      </div>
      <div className="form-group">
        <label htmlFor="gender">Giới tính</label>
        <select id="gender" name="gender" value={editUser?.profile?.gender || ''} onChange={handleProfileEditChange}>
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="birthDate">Ngày sinh</label>
        <input type="date" id="birthDate" name="birthDate" value={editUser?.profile?.birthDate ? editUser.profile.birthDate.slice(0, 10) : ''} onChange={handleProfileEditChange} />
      </div>
    </div>
  );

  // Bắt đầu chỉnh sửa
  const startEdit = () => {
    setIsEditing(true);
    setEditUser(JSON.parse(JSON.stringify(user)));
  };

  // Huỷ chỉnh sửa
  const cancelEdit = () => {
    setIsEditing(false);
    setEditUser(null);
  };

  // Lưu thay đổi
  const handleSave = () => {
    if (!editUser) return;
    const token = localStorage.getItem('token');
    const body: any = isGoogleUser
      ? {
          profile: {
            phone: editUser.profile?.phone || '',
            gender: editUser.profile?.gender || '',
            birthDate: editUser.profile?.birthDate || '',
            addresses: editUser.profile?.addresses || []
          }
        }
      : {
          firstName: editUser.firstName,
          lastName: editUser.lastName,
          username: editUser.username,
          email: editUser.email,
          profile: {
            phone: editUser.profile?.phone || '',
            gender: editUser.profile?.gender || '',
            birthDate: editUser.profile?.birthDate || '',
            addresses: editUser.profile?.addresses || []
          }
        };
    fetch(`http://localhost:3000/api/usersProfile/${editUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi cập nhật dữ liệu');
        return res.json();
      })
      .then((updatedUser) => {
        if (!updatedUser.profile) updatedUser.profile = { addresses: [] };
        if (!updatedUser.profile.addresses) updatedUser.profile.addresses = [];
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        setEditUser(null);
        alert('Cập nhật thành công!');
      })
      .catch(err => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Lỗi khi cập nhật!');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    window.location.href = '/login';
  };

  if (!user) return <p>Đang tải dữ liệu người dùng...</p>;

  return (
    <div className="container">
      <div className="header">
        <div className="profile-header">
          <div className="avatar">{user.username?.charAt(0).toUpperCase() || '?'}</div>
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
          <div className={`menu-item ${currentTab === 'profile' ? 'active' : ''}`} onClick={() => setCurrentTab('profile')}>👤 Thông tin cá nhân</div>
          <div className={`menu-item ${currentTab === 'orders' ? 'active' : ''}`} onClick={() => setCurrentTab('orders')}>📦 Đơn hàng</div>
          {!isGoogleUser && (
            <div className={`menu-item ${currentTab === 'password' ? 'active' : ''}`} onClick={() => setCurrentTab('password')}>🔒 Quên mật khẩu</div>
          )}
          <div className={`menu-item ${currentTab === 'address' ? 'active' : ''}`} onClick={() => setCurrentTab('address')}>🏠 Địa chỉ</div>
          <div className="menu-item" onClick={() => setShowLogoutConfirm(true)}>➡️ Đăng xuất</div>
        </div>

        <div className="content-area">
          {currentTab === 'profile' && (
            <>
              <div className="section-title">Thông tin cá nhân</div>
              {!isEditing && (
                <>
                  {renderUserInfo()}
                  <button className="btn btn-primary" onClick={startEdit}>Chỉnh sửa</button>
                </>
              )}
              {isEditing && (
                <>
                  {isGoogleUser ? renderEditFormGoogle() : renderEditFormNormal()}
                  <div style={{ marginTop: 16 }}>
                    <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
                    <button className="btn btn-cancel" style={{ marginLeft: 8 }} onClick={cancelEdit}>Huỷ</button>
                  </div>
                </>
              )}
            </>
          )}

          {currentTab === 'address' && (
            <>
              {/* Nếu muốn chỉnh sửa địa chỉ độc lập, bỏ comment đoạn dưới */}
              {/* {!isEditing && (
                <button className="btn btn-primary" onClick={startEdit}>Chỉnh sửa địa chỉ</button>
              )}
              {isEditing && (
                <div style={{ marginBottom: 8 }}>
                  <button className="btn btn-primary" onClick={handleSave}>Lưu địa chỉ</button>
                  <button className="btn btn-cancel" style={{ marginLeft: 8 }} onClick={cancelEdit}>Huỷ</button>
                </div>
              )} */}
              <AddressManager
                addresses={isEditing ? (editUser?.profile?.addresses || []) : (user.profile?.addresses || [])}
                onUpdateAddresses={isEditing ? handleEditAddresses : () => {}}
                onSaveAddresses={isEditing ? handleSave : undefined}
                readOnly={!isEditing}
              />
            </>
          )}

          {currentTab === 'orders' && <div><h3>Đơn hàng (chưa có dữ liệu)</h3></div>}
          {currentTab === 'password' && <div><h3>Quên mật khẩu (chưa có dữ liệu)</h3></div>}
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