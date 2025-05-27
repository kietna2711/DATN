export interface SubCategory {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  subcategories?: SubCategory[];
}
