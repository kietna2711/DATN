import { Products } from "../types/productD";

export const getProducts = async (): Promise<Products[]> => {
  const res = await fetch("http://localhost:3000/products");
  if (!res.ok) throw new Error("Lỗi khi tải sản phẩm");
  return await res.json();
};

export const getProductsNew = async (): Promise<Products[]> => {
  const res = await fetch("http://localhost:3000/products");
  if (!res.ok) throw new Error("Lỗi khi tải sản phẩm mới");

  const data = await res.json();
  const sorted = (data as Products[])
    .map(product => ({
      ...product,
      createdAt: new Date(product.createdAt),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const latestProducts = sorted.slice(0, 8);

  console.log("📦 Sản phẩm mới nhất (đầu tiên là mới nhất):", latestProducts);

  return latestProducts;
};
