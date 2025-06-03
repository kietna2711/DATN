"use client";
import { SubcategoryModal } from "@/app/components/admin/SubcategoryModal";
import { CategoryTable } from "@/app/components/admin/CategoryTable";
import { useCategory } from "@/app/hooks/useCategory";
import React, { useState } from "react";
import { CategoryModal } from "@/app/components/admin/CategoryModal";

export default function CategoryManagement() {
  const {
    categories,
    addCategory,
    toggleVisibility,
    updateCategoryName,
    addSubcategoryToCategory,
    toggleSubcategoryVisibility,
    updateSubcategoryName,
    fetchCategories,
  } = useCategory();

  // Modal states:
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showSubModal, setShowSubModal] = useState(false);
  const [subParentId, setSubParentId] = useState<string | null>(null);

  // --- Sửa subcategory ---
  const [showSubEditModal, setShowSubEditModal] = useState(false);
  const [editSubId, setEditSubId] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState("");
  const [editSubParentId, setEditSubParentId] = useState<string | null>(null);

  // Bắt sự kiện sửa
  const handleEdit = (_id: string, isSub?: boolean, parentId?: string) => {
    if (isSub && parentId) {
      const cat = categories.find(c => c._id === parentId);
      const sub = cat?.subcategories?.find(s => s._id === _id);
      if (sub) {
        setEditSubId(_id);
        setEditSubParentId(parentId);
        setEditSubName(sub.name);
        setShowSubEditModal(true);
      }
      return;
    }
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

  // Sửa subcategory (gọi useCategory, sau đó fetchCategories lại)
  const handleSaveEditSub = async (name: string) => {
    if (editSubId && editSubParentId) {
      await updateSubcategoryName(editSubId, name, editSubParentId);
      setShowSubEditModal(false);
      setEditSubId(null);
      setEditSubName("");
      setEditSubParentId(null);
    }
  };

  const handleAddSub = (parentId: string) => {
    setSubParentId(parentId);
    setShowSubModal(true);
  };
  const handleSaveSub = async (name: string) => {
    if (subParentId) {
      await addSubcategoryToCategory(subParentId, { name, hidden: false });
    }
    setShowSubModal(false);
    setSubParentId(null);
  };

  return (
    <main className="app-content">
      <div className="tile">
        <div className="tile-body">
          <button className="btn btn-add btn-sm mb-3" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Thêm danh mục
          </button>
            <CategoryTable
              categories={categories}
              onToggleVisibility={(id, isSub, parentId) => {
                if (isSub && parentId) {
                  toggleSubcategoryVisibility(id, parentId);
                } else {
                  toggleVisibility(id);
                }
              }}
              onEdit={handleEdit}
              onAddSub={handleAddSub}
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
          {showSubModal && (
            <SubcategoryModal
              onClose={() => setShowSubModal(false)}
              onSave={handleSaveSub}
            />
          )}
          {showSubEditModal && (
            <SubcategoryModal
              onClose={() => setShowSubEditModal(false)}
              onSave={handleSaveEditSub}
              initialName={editSubName}
            />
          )}
        </div>
      </div>
    </main>
  );
}