"use client";
import { CategoryModal } from "@/app/components/admin/CategoryModal";
import { CategoryTable } from "@/app/components/admin/CategoryTable";
import { useCategory } from "@/app/hooks/useCategory";
import React, { useState, useEffect } from "react";

export default function CategoryManagement() {
  const {
    categories,
    addCategory,
    deleteCategory,
    toggleVisibility,
    toggleSelectAll,
    toggleCheck,
    selectAll,
    updateCategoryName, 
  } = useCategory();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleEdit = (_id: string) => {
    const cat = categories.find(c => c._id === _id);
    if (cat) {
      setEditId(_id);
      setEditName(cat.name);
      setShowModal(true);
    }
  };

  const handleSaveEdit = async ({ name }: { name: string; hidden: boolean }) => {
    if (editId) {
      await updateCategoryName(editId, name);
      setShowModal(false);
      setEditId(null);
      setEditName("");
    }
  };


  const [clock, setClock] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const weekday = [
        "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
      ];
      const d = weekday[today.getDay()];
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const h = String(today.getHours()).padStart(2, "0");
      const m = String(today.getMinutes()).padStart(2, "0");
      const s = String(today.getSeconds()).padStart(2, "0");

      setClock(`${d}, ${dd}/${mm}/${yyyy} - ${h} giờ ${m} phút ${s} giây`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active"><b>Quản lý danh mục</b></li>
        </ul>
        <div id="clock">{clock}</div>
      </div>

      <div className="tile">
        <div className="tile-body">
          <button className="btn btn-add btn-sm mb-3" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Thêm danh mục
          </button>

          <CategoryTable
            categories={categories}
            selectAll={selectAll}
            onToggleSelectAll={toggleSelectAll}
            onToggleCheck={toggleCheck}
            onToggleVisibility={toggleVisibility}
            onDelete={deleteCategory}
            onEdit={handleEdit}
          />

          {showModal && (
            <CategoryModal
              onClose={() => {
                setShowModal(false);
                setEditId(null);
                setEditName("");
              }}
              onSave={editId ? handleSaveEdit : addCategory}
              initialName={editId ? editName : ""}
            />
          )}
        </div>
      </div>
    </main>
  );
}
