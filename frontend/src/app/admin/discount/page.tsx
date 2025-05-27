"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";

type Discount = {
  id: string;
  code: string;
  desc: string;
  value: number;
  type: "percent" | "amount";
  minOrder?: number;
  maxUsage?: number;
  startDate?: string;
  endDate?: string;
  status: "Đang hoạt động" | "Hết hạn" | "Chưa kích hoạt";
};

const initialDiscounts: Discount[] = [
  {
    id: "GG001",
    code: "SALE50",
    desc: "Giảm 50% đơn hàng",
    value: 50,
    type: "percent",
    endDate: "2025-06-01",
    status: "Đang hoạt động",
  },
  {
    id: "GG002",
    code: "SALE100K",
    desc: "Giảm 100.000đ cho đơn từ 1 triệu",
    value: 100000,
    type: "amount",
    endDate: "2025-06-15",
    status: "Hết hạn",
  },
];

export default function DiscountManagement() {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Discount, "id">>({
    code: "",
    desc: "",
    value: 0,
    type: "percent",
    minOrder: undefined,
    maxUsage: undefined,
    startDate: "",
    endDate: "",
    status: "Đang hoạt động",
  });

  // Mở modal tạo mới
  const openAddModal = () => {
    setEditIndex(null);
    setForm({
      code: "",
      desc: "",
      value: 0,
      type: "percent",
      minOrder: undefined,
      maxUsage: undefined,
      startDate: "",
      endDate: "",
      status: "Đang hoạt động",
    });
    setShowModal(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (idx: number) => {
    const d = discounts[idx];
    setEditIndex(idx);
    setForm({
      code: d.code,
      desc: d.desc,
      value: d.value,
      type: d.type,
      minOrder: d.minOrder,
      maxUsage: d.maxUsage,
      startDate: d.startDate || "",
      endDate: d.endDate || "",
      status: d.status,
    });
    setShowModal(true);
  };

  // Xóa mã giảm giá
  const handleDelete = (idx: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      setDiscounts(discounts => discounts.filter((_, i) => i !== idx));
    }
  };

  // Xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    if (type === "radio") {
      setForm({ ...form, [name]: value });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "number") {
      setForm({ ...form, [name]: value === "" ? undefined : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Lưu mã giảm giá (thêm mới hoặc cập nhật)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) return;
    if (editIndex === null) {
      setDiscounts([
        ...discounts,
        {
          ...form,
          id: `GG${(discounts.length + 1).toString().padStart(3, "0")}`,
        },
      ]);
    } else {
      setDiscounts(discounts =>
        discounts.map((d, i) =>
          i === editIndex ? { ...d, ...form } : d
        )
      );
    }
    setShowModal(false);
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb">
          <li className="breadcrumb-item">Quản lý giảm giá</li>
          <li className="breadcrumb-item">
            <a href="#" onClick={e => { e.preventDefault(); openAddModal(); }}>
              Tạo mã giảm giá mới
            </a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">Danh sách mã giảm giá</h3>
            <div className="tile-body">
              <button className="btn btn-add btn-sm mb-3" onClick={openAddModal}>
                <i className="fas fa-plus"></i> Tạo mã giảm giá mới
              </button>
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mã giảm giá</th>
                    <th>Mô tả</th>
                    <th>Phần trăm / Số tiền</th>
                    <th>HSD</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((d, idx) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.code}</td>
                      <td>{d.desc}</td>
                      <td>
                        {d.type === "percent" ? `${d.value}%` : `${d.value.toLocaleString()}đ`}
                      </td>
                      <td>
                        {d.endDate
                          ? new Date(d.endDate).toLocaleDateString("vi-VN")
                          : ""}
                      </td>
                      <td>
                        <span className={`badge ${d.status === "Đang hoạt động" ? "bg-success" : d.status === "Hết hạn" ? "bg-secondary" : "bg-warning"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => openEditModal(idx)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDelete(idx)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {discounts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">Không có mã giảm giá nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Thêm/Chỉnh sửa Mã Giảm Giá */}
      {showModal && (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editIndex === null ? "Tạo mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
                  </h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Mã giảm giá</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="SALE50"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mô tả</label>
                    <input
                      type="text"
                      className="form-control"
                      name="desc"
                      value={form.desc}
                      onChange={handleChange}
                      placeholder="Giảm 50% đơn hàng"
                    />
                  </div>
                  <div className="form-group">
                    <label>Kiểu giảm giá</label><br />
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="type"
                        id="percentType"
                        value="percent"
                        checked={form.type === "percent"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="percentType">Phần trăm (%)</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="type"
                        id="amountType"
                        value="amount"
                        checked={form.type === "amount"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="amountType">Số tiền cố định</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Giá trị</label>
                    <input
                      type="number"
                      className="form-control"
                      name="value"
                      value={form.value}
                      onChange={handleChange}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Đơn hàng tối thiểu (tuỳ chọn)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minOrder"
                      value={form.minOrder ?? ""}
                      onChange={handleChange}
                      placeholder="Nhập số tiền tối thiểu"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số lượt sử dụng tối đa</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxUsage"
                      value={form.maxUsage ?? ""}
                      onChange={handleChange}
                      placeholder="100, vô hạn"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={form.startDate || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày kết thúc</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      value={form.endDate || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                      className="form-control"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option>Đang hoạt động</option>
                      <option>Hết hạn</option>
                      <option>Chưa kích hoạt</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-save">Lưu</button>
                  <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}