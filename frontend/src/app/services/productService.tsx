import { Products } from "../types/productD";


export const getProducts = async (): Promise<Products[]> => {
  const res = await fetch('http://localhost:3000/products');
  if (!res.ok) throw new Error('Lỗi khi tải sản phẩm');
  return await res.json();
};
