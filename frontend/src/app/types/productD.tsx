import { Category } from "./categoryD";
import { Variant } from "./variantD";


export interface Product {
  _id: string;           // id dạng string theo JSON bạn nhận
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: Category;  // categoryId là một object chứ không phải number/string
  createdAt: string;     // hoặc Date nếu bạn parse
  variants: Variant[];
}