"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";

type Category = {
  id: number;
  name: string;
  visible: boolean;
  checked: boolean;
};

const initialCategories: Category[] = [
  { id: 1, name: "Bàn ăn", visible: true, checked: false },
  { id: 2, name: "Ghế gỗ", visible: true, checked: false },
  { id: 3, name: "Điện tử", visible: false, checked: false },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
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

  // Toggle ẩn/hiện danh mục
  const handleToggleVisibility = (id: number) => {
    setCategories(categories =>
      categories.map(cat =>
        cat.id === id ? { ...cat, visible: !cat.visible } : cat
      )
    );
  };

  // Xóa danh mục
  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories => categories.filter(cat => cat.id !== id));
    }
  };

  // Thêm danh mục mới
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() === "") return;
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory.trim(),
        visible: true,
        checked: false,
      },
    ]);
    setNewCategory("");
    setShowModal(false);
  };

  // Chọn tất cả
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setCategories(categories =>
      categories.map(cat => ({ ...cat, checked: !selectAll }))
    );
  };

  // Chọn từng dòng
  const handleCheck = (id: number) => {
    setCategories(categories =>
      categories.map(cat =>
        cat.id === id ? { ...cat, checked: !cat.checked } : cat
      )
    );
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active"><a href="#"><b>Quản lý danh mục</b></a></li>
        </ul>
        <div id="clock">{clock}</div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <div className="row element-button">
                <div className="col-sm-2">
                  <button
                    className="btn btn-add btn-sm"
                    title="Thêm"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-plus"></i> Thêm danh mục
                  </button>
                </div>
              </div>
              <table className="table table-hover table-bordered" id="sampleTable">
                <thead>
                  <tr>
                    <th style={{ width: "10px" }}>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                        />
                    </th>
                    <th>Tên danh mục</th>
                    <th>Trạng thái</th>
                    <th>Ẩn/Hiện</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td width="10">
                        <input
                          type="checkbox"
                          checked={cat.checked}
                          onChange={() => handleCheck(cat.id)}
                        />
                      </td>
                      <td>{cat.name}</td>
                      <td>
                        <span className={`badge ${cat.visible ? "bg-success" : "bg-secondary"}`}>
                          {cat.visible ? "Hiển thị" : "Đã ẩn"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-light btn-sm toggle-visibility"
                          type="button"
                          title="Ẩn/Hiện"
                          onClick={() => handleToggleVisibility(cat.id)}
                        >
                          <i className={`fas ${cat.visible ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm btn-delete-category"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">Không có danh mục nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Modal Thêm Danh Mục */}
              {showModal && (
                <div className="modal d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <form onSubmit={handleAddCategory}>
                        <div className="modal-header">
                          <h5 className="modal-title">Thêm danh mục mới</h5>
                          <button type="button" className="close" onClick={() => setShowModal(false)}>
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <label htmlFor="categoryName">Tên danh mục</label>
                            <input
                              type="text"
                              className="form-control"
                              id="categoryName"
                              value={newCategory}
                              onChange={e => setNewCategory(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="submit" className="btn btn-save">Lưu lại</button>
                          <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              {/* End Modal */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}