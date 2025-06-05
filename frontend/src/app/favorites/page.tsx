"use client";
import React, { useEffect, useState } from "react";
import { Products } from "../types/productD";
import ProductItem from "../components/ProductItem"; // Đã có sẵn, bạn dùng lại
import styles from "../styles/productitem.module.css"; // Sử dụng chung style lưới
import Pagination from "../components/Pagination"; // Dùng lại pagination nếu có

const PRODUCTS_PER_PAGE = 16;

const FavoritePage = () => {
  const [favorites, setFavorites] = useState<Products[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  // Xóa khỏi yêu thích
  const removeFavorite = (id: string) => {
    const updated = favorites.filter(
      (p) => ((p._id ?? p.id)?.toString() !== id)
    );
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Phân trang
  const totalPages = Math.ceil(favorites.length / PRODUCTS_PER_PAGE);
  const pagedFavorites = favorites.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className={styles.container_product}>
      <h1>Danh sách yêu thích của bạn</h1>
      {favorites.length === 0 ? (
        <p>Không có sản phẩm nào trong danh sách yêu thích.</p>
      ) : (
        <>
            <div className={styles.products}>
                {pagedFavorites.map((product) => (
                <ProductItem key={product._id ?? product.id} product={product} />
                ))}
            </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default FavoritePage;