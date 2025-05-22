import { Products } from "../types/productD";
import { Variant } from "../types/variantD";
import { Category } from "../types/categoryD";


export const getProducts = async (): Promise<Products[]> => {
  const res = await fetch('http://localhost:3000/products');
  if (!res.ok) throw new Error('Lỗi khi tải sản phẩm');
  return await res.json();
};
export async function getDetail(id: string): Promise<Products | null> {
  try {
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();

    const product: Products = {
      _id: data._id || data.id || "",
      name: data.name || "",
      description: data.description || "",
      image: data.image || "",
      images: data.images ?? [],
      categoryId: data.categoryId || data.category || null,
      createdAt: data.createdAt || "",
      variants: Array.isArray(data.variants) ? data.variants : [],
    };
    return product;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}