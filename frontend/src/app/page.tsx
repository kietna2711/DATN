"use client";

import { useEffect, useState } from "react";
import Banner from "./sections/Home/Banner";
import ProductList from "./sections/Home/ProductList";
import { Products } from "./types/productD";
import { Category } from "./types/categoryD";
import { getProducts, getProductsNew } from "./services/productService";
import { getCategories } from "./services/categoryServie";
import ProductSlider from "./sections/Home/ProductSlider";
import ProductCollection from "./sections/Home/ProductCollection";
import ServiceSection from "./sections/Home/ServiceSection";
import ProductNew from "./sections/Home/ProductNew";

// import ProductNew from "./sections/Home/ProductHot";
import ProductHotSlider from "./sections/Home/ProductHotSlider";
import { getProductsHot } from "./services/productService";


export default function HomePage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProducts, setNewProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotProducts, setHotProducts] = useState<Products[]>([]);


  useEffect(() => {
    getProducts()
      .then(data => {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sorted);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getProductsNew()
      .then(data => setNewProducts(data))
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

  useEffect(() => {
  getProductsHot()
    .then(data => setHotProducts(data))
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  return (
    <main>
      <Banner />
      <ProductCollection />
      <ProductNew
        props={{
          title: "Sản phẩm mới",
          description: "Những chú gấu bông hot nhất, đáng yêu nhất, luôn sẵn sàng ôm bạn!",
          products: newProducts,
        }}
      />
      <ProductSlider
        props={{
          title: "Gấu bông yêu thích",
          products: products.slice(0, 8),
        }}
      />
      <ProductHotSlider
        props={{
          title: "Sản phẩm hot",
          products: hotProducts,
        }}
      />

      <ProductList
        props={{
          title: "Danh sách gấu bông",
          category: categories,
          image: "http://localhost:3000/images/image 37.png",
          product: products.slice(0, 8),
        }}
      />
      <ServiceSection />
    </main>
  );
}
