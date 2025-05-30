export interface SubCategory {
  _id: string;
  name: string;
  categoryId?: string;
}

export interface Category {
  _id: string;
  name: string;
  subcategories?: SubCategory[];
}
