import { Category } from "../types/categoryD";

// Lấy toàn bộ danh mục
export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch("http://localhost:3000/categories");
  if (!res.ok) throw new Error("Lỗi khi tải danh mục");
  return res.json();
};

// Lấy chi tiết 1 danh mục theo ID từ backend (đã có populate)
export const getCategoryById = async (_id: string): Promise<Category> => {
  const res = await fetch(`http://localhost:3000/categories/${_id}`);
  if (!res.ok) throw new Error("Không tìm thấy danh mục với id: " + _id);
  return res.json();
};
