'use client';
import React, { useState } from 'react';
import './addressmanager.css';

interface Address {
  id: string;
  detail: string;
}

interface Props {
  addresses?: Address[];
  onUpdateAddresses: (newAddresses: Address[]) => void;
}

const AddressManager: React.FC<Props> = ({ addresses = [], onUpdateAddresses }) => {
  const [newAddress, setNewAddress] = useState('');

  const handleAddAddress = () => {
    if (newAddress.trim() === '') return;

    const newEntry: Address = {
      id: Date.now().toString(),
      detail: newAddress.trim(),
    };

    onUpdateAddresses([...addresses, newEntry]);
    setNewAddress('');
  };

  const handleDelete = (id: string) => {
    const filtered = addresses.filter(addr => addr.id !== id);
    onUpdateAddresses(filtered);
  };

  return (
    <div className="address-manager">
      <h3>🏠 Quản lý địa chỉ</h3>

      {addresses.length === 0 ? (
        <p className="empty-text">Bạn chưa có địa chỉ, vui lòng nhập địa chỉ của bạn.</p>
      ) : (
        <ul className="address-list">
          {addresses.map(addr => (
            <li key={addr.id}>
              <span>{addr.detail}</span>
              <button className="delete-btn" onClick={() => handleDelete(addr.id)}>Xoá</button>
            </li>
          ))}
        </ul>
      )}

      <div className="input-group">
        <input
          type="text"
          placeholder="Nhập địa chỉ mới"
          value={newAddress}
          onChange={e => setNewAddress(e.target.value)}
        />
        <button onClick={handleAddAddress}>Thêm địa chỉ</button>
      </div>
    </div>
  );
};

export default AddressManager;
