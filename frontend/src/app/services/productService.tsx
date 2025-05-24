import { Products } from "../types/productD";
import { Variant } from "../types/variantD";
import { Category } from "../types/categoryD";

/**
 * Lấy danh sách sản phẩm
 */

export const getProducts = async (): Promise<Products[]> => {
  const res = await fetch("http://localhost:3000/products");
  if (!res.ok) throw new Error("Lỗi khi tải sản phẩm");
  return await res.json();
};

//  * Lấy chi tiết một sản phẩm theo id
//  
export async function getDetail(id: string): Promise<Products | null> {
  try {
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    console.log("Fetched data:", data);
    const product: Products = {
      _id: typeof data._id === "string" ? data._id : (typeof data.id === "string" ? data.id : ""),
      name: typeof data.name === "string" ? data.name : "",
      description: typeof data.description === "string" ? data.description : "",
      image: typeof data.image === "string" ? data.image : "",
      categoryId: data.categoryId && typeof data.categoryId === "object" ? data.categoryId : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      variants: Array.isArray(data.variants) ? data.variants : [],
      sold: typeof data.sold === "number" ? data.sold : 0,
    };
    return product;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

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

  // console.log("📦 Sản phẩm mới nhất (đầu tiên là mới nhất):", latestProducts);

  return latestProducts;
};
