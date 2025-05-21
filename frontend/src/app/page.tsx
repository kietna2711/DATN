"use client";

import { useEffect, useState } from "react";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";
import { Products } from "./types/productD";
import { Category } from "./types/categoryD";
import { getProducts } from "./services/productService";
import { getCategories } from "./services/categoryServie";

export default function HomePage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  return (
    <main>
      <Banner />
      {error && <p>Lỗi: {error}</p>}
      {!error && products.length > 0 && (
        <ProductList
          props={{
            title: "Danh sách gấu bông",
            category: categories,
            image: "http://localhost:3000/images/image 37.png",
            product: products.slice(0, 4),
          }}
        />
      )}
    </main>
  );
}
