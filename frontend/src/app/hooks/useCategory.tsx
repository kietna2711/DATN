import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory as apiDelete,
  updateCategory,
  getCategories,
} from "../services/categoryService";
import { Category } from "../types/categoryD";

export const useCategory = () => {
  const [categories, setCategories] = useState<(Category & { checked?: boolean })[]>([]);
  const [selectAll, setSelectAll] = useState(false);

    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        // Kiểm tra dữ liệu hợp lệ
        if (!Array.isArray(data)) {
          console.error("API trả về không phải mảng:", data);
          return;
        }

        setCategories(data.map(cat => ({ ...cat, checked: false })));
      } catch (err) {
        console.error("Không thể tải danh mục:", err);
      }
    };
    fetchCategories();

  const addCategory = async (data: { name: string; hidden: boolean }) => {
    try {
      const newCategory = await createCategory({
        ...data,
        subcategories: [],
      });

      setCategories(prev => [...prev, { ...newCategory, checked: false }]);
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      alert("Thêm danh mục thất bại");
    }
  };

  const updateCategoryName = async (_id: string, name: string) => {
    try {
      const updated = await updateCategory(_id, { name });
      setCategories(prev =>
        prev.map(c => (c._id === _id ? { ...c, name: updated.name } : c))
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật tên danh mục:", err);
    }
  };

  const deleteCategory = async (_id: string) => {
    try {
      await apiDelete(_id);
      setCategories(prev => prev.filter(c => c._id !== _id));
    } catch (err) {
      console.error("Lỗi khi xoá danh mục:", err);
    }
  };

  const toggleVisibility = async (_id: string) => {
    const cat = categories.find(c => c._id === _id);
    if (!cat) return;

    try {
      const updated = await updateCategory(_id, {
        hidden: !cat.hidden,
        name: cat.name,
      });

      setCategories(prev =>
        prev.map(c => (c._id === _id ? { ...c, hidden: updated.hidden } : c))
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục", err);
      alert("Lỗi khi cập nhật danh mục");
    }
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setCategories(prev => prev.map(c => ({ ...c, checked: newValue })));
  };

  const toggleCheck = (_id: string) => {
    setCategories(prev =>
      prev.map(c => (c._id === _id ? { ...c, checked: !c.checked } : c))
    );
  };

  return {
    categories,
    addCategory,
    updateCategoryName,
    deleteCategory,
    toggleVisibility,
    toggleSelectAll,
    toggleCheck,
    selectAll,
  };
};
