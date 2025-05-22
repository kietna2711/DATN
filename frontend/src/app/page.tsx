"use client";

import { useEffect, useState } from "react";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";
import { Products } from "./types/productD";
import { Category } from "./types/categoryD";
import { getProducts } from "./services/productService";
import { getCategories } from "./services/categoryServie";
import ProductSlider from "./components/ProductSlider";
// import ProductSlider from "./components/ProductSlider";

export default function HomePage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(data => {
        // Sắp xếp theo ngày tạo mới nhất (createdAt giảm dần)
        const sortedByDate = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sortedByDate);
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
      <ProductSlider
        props={{
          title: "Danh sách gấu bông",
          products: products.slice(0, 5),
        }}
      />
      {error && <p>Lỗi: {error}</p>}
      {!error && products.length > 0 && (
        <ProductList
          props={{
            title: "Danh sách gấu bông",
            category: categories,
            image: "http://localhost:3000/images/image 37.png",
            product: products.slice(0, 8)
          }}
        />
      )}

    </main>
  );
}
