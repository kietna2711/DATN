// services/categoryService.ts
import { Category } from "../types/categoryD";

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch("http://localhost:3000/categories");
  if (!res.ok) throw new Error("Lỗi khi tải danh mục");
  const data = await res.json();
  return data;
};
