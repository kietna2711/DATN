import { SubCategory } from "../types/categoryD";


const API_URL = "http://localhost:3000/subcategories";

// Lấy toàn bộ danh mục con (R)
export const getSubcategories = async (): Promise<SubCategory[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Lỗi khi tải danh mục con");
  return res.json();
};

// Lấy chi tiết 1 danh mục con theo ID từ backend
export const getSubcategoryById = async (_id: string): Promise<SubCategory> => {
  const res = await fetch(`${API_URL}/${_id}`);
  if (!res.ok) throw new Error("Không tìm thấy danh mục con với id: " + _id);
  return res.json();
};

// Thêm danh mục con mới (C)
export const createSubcategory = async (
  data: Omit<SubCategory, "_id">
): Promise<SubCategory> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Lỗi khi thêm danh mục con");
  return res.json();
};

// Cập nhật danh mục con (U)
export const updateSubcategory = async (
  _id: string,
  data: Partial<SubCategory>
): Promise<SubCategory> => {
  const res = await fetch(`${API_URL}/${_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Lỗi khi cập nhật danh mục con");
  return res.json();
};

// Xoá danh mục con (D)
export const deleteSubcategory = async (_id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Lỗi khi xoá danh mục con");
};
