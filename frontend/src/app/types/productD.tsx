import { Category, SubCategory } from "./categoryD";
import { Variant } from "./variantD";


export interface Products {
  image: any;
  _id: string;           // id dạng string theo JSON bạn nhận
  name: string;
  description: string;
  price: number;
  images: string[];                    // Mảng đường dẫn ảnh
  categoryId: Category[];               // Sau khi populate: là 1 object
  createdAt: Date;
  variants: Variant[];               // Mảng biến thể đã populate
  sold: number;
  subcategoryId?: SubCategory[];     // Sản có thể có hoặc không có
}
