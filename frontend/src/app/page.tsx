"use client"


import { useEffect, useState } from "react";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";
import { Products } from "./types/productD";
import { Category } from "./types/categoryD";
import { getProducts } from "./services/productService";

const categories: Category[] = [
  { _id: "1", name: "GẤU BÔNG TỐT NGHIỆP" },
  { _id: "2", name: "GẤU BÔNG SINH NHẬT" },
  { _id: "3", name: "GẤU BÔNG QUÀ TẶNG" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Products[]>([]);
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

  return (
    <main>
      <Banner />
      {loading && <p>Đang tải sản phẩm...</p>}
      {error && <p>Lỗi: {error}</p>}
      {!loading && !error && (
        <ProductList
          props={{
            title: "Danh sách gấu bông",
            category: categories,
            image: "img/image51.png",
            product: products.slice(0, 4),
          }}
        />
      )}
    </main>
  );
}

