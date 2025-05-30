export interface SubCategory {
  _id: string;
  name: string;
  categoryId?: string;
}

export interface Category {
  length: number;
  _id: string;
  name: string;
  subcategories?: SubCategory[];
}
