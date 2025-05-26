import { Category } from "./categoryD";
import { Variant } from "./variantD";


export interface Products {
  _id: string;           // id dạng string theo JSON bạn nhận
  name: string;
  description: string;
  image: string;
  categoryId: Category;  // categoryId là một object chứ không phải number/string
  createdAt: Date;     // hoặc Date nếu bạn parse
  variants: Variant[];
  sold: number;
}