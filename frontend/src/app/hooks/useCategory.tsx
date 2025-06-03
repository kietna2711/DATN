import { useEffect, useState } from "react";
import { createCategory, updateCategory, getCategories } from "../services/categoryService";
import { Category } from "../types/categoryD";
import { createSubcategory, updateSubcategory } from "../services/subcategoryService";

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (!Array.isArray(data)) {
        console.error("API trả về không phải mảng:", data);
        return;
      }
      setCategories(data);
      console.log("[fetchCategories] Cập nhật categories:", data);
    } catch (err) {
      console.error("Không thể tải danh mục:", err);
    }
  };

  // Fetch categories once when mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a new category
  const addCategory = async (data: { name: string; hidden: boolean }) => {
    try {
      await createCategory({ ...data, subcategories: [] });
      await fetchCategories(); // reload lại sau khi thêm
    } catch (err) {
      alert("Thêm danh mục thất bại");
    }
  };

  // Update the name of a category
  const updateCategoryName = async (_id: string, name: string) => {
    try {
      const cat = categories.find(c => c._id === _id);
      if (!cat) return;
      await updateCategory(_id, { ...cat, name });
      await fetchCategories(); // reload lại sau khi cập nhật
    } catch (err) {
      alert("Cập nhật tên danh mục thất bại");
    }
  };

  // Toggle the visibility of a category
  const toggleVisibility = async (_id: string) => {
    const cat = categories.find(c => c._id === _id);
    if (!cat) return;
    try {
      await updateCategory(_id, {
        ...cat,
        hidden: !cat.hidden
      });
      await fetchCategories(); // reload lại sau khi cập nhật
    } catch (err) {
      alert("Ẩn/hiện danh mục thất bại");
    }
  };

  // Add a new subcategory to a category
  const addSubcategoryToCategory = async (parentId: string, sub: { name: string; hidden: boolean }) => {
    try {
      await createSubcategory({ ...sub, categoryId: parentId });
      await fetchCategories(); // reload lại sau khi thêm sub
    } catch (err) {
      alert("Thêm danh mục con thất bại");
    }
  };

  // Update the name of a subcategory
  const updateSubcategoryName = async (subId: string, name: string, parentId: string) => {
    const cat = categories.find(c => c._id === parentId);
    if (!cat) return;
    const sub = cat.subcategories?.find(s => s._id === subId);
    if (!sub) return;
    try {
      await updateSubcategory(subId, { name, hidden: sub.hidden });
      await fetchCategories();
    } catch (err) {
      alert("Cập nhật tên danh mục con thất bại");
    }
  };

  // Toggle the visibility of a subcategory (cho dạng cây)
  const toggleSubcategoryVisibility = async (subId: string, parentId: string) => {
    const cat = categories.find(c => c._id === parentId);
    if (!cat) {
      console.log("Không tìm thấy category với id:", parentId);
      return;
    }
    const sub = cat.subcategories?.find(s => s._id === subId);
    if (!sub) {
      console.log("Không tìm thấy subcategory với id:", subId, "trong category", parentId);
      return;
    }

    console.log("Gọi toggleSubcategoryVisibility với subId", subId, "parentId", parentId, "current hidden:", sub.hidden);

    try {
      const res = await updateSubcategory(subId, { name: sub.name, hidden: !sub.hidden });
      console.log("API updateSubcategory trả về:", res);
      await fetchCategories();
      console.log("Fetch lại categories sau khi update subcategory");
    } catch (err) {
      console.error("Ẩn/hiện danh mục con thất bại", err);
      alert("Ẩn/hiện danh mục con thất bại");
    }
  };

  return {
    categories,
    addCategory,
    updateCategoryName,
    toggleVisibility,
    toggleSubcategoryVisibility,
    updateSubcategoryName,
    selectAll,
    addSubcategoryToCategory,
    fetchCategories,
  };
};