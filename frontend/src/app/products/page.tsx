"use client";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { Products } from "../types/productD";
import ProductList from "../components/ProductList";
import InstagramSection from "../components/InstagramSection";
import styles from "../styles/productitem.module.css";

const PRODUCTS_PER_PAGE = 12; //mỗi trang hiển thị 12 sp

export default function ProductsPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<string>("Tất cả");
  const [sort, setSort] = useState<string>("Mới nhất");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function filterByPrice(product: Products) {
    const min = Math.min(...product.variants.map((v) => v.price));
    switch (priceFilter) {
      case "Dưới 300.000 đ":
        return min < 300000;
      case "Từ 300.000 đ - 500.000 đ":
        return min >= 300000 && min <= 500000;
      case "Từ 500.000 đ - 1.000.000 đ":
        return min > 500000 && min <= 1000000;
      case "Từ 1.00.000 đ - 2.000.000 đ":
        return min > 1000000 && min <= 2000000;
      case "Từ 2.00.000 đ - 3.000.000 đ":
        return min > 2000000 && min <= 3000000;
      default:
        return true;
    }
  }

  function sortProducts(list: Products[]) {
    if (sort === "Mới nhất") {
      return [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    if (sort === "Giá : Thấp đến cao") {
      return [...list].sort(
        (a, b) =>
          Math.min(...a.variants.map((v) => v.price)) -
          Math.min(...b.variants.map((v) => v.price))
      );
    }
    if (sort === "Giá : Cao đến thấp") {
      return [...list].sort(
        (a, b) =>
          Math.max(...b.variants.map((v) => v.price)) -
          Math.max(...a.variants.map((v) => v.price))
      );
    }
    return list;
  }

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (!products.length) return <div>Không có sản phẩm nào.</div>;

  // Xử lý lọc và sắp xếp
  const filtered = sortProducts(products.filter(filterByPrice));
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  // Lấy sản phẩm cho trang hiện tại
  const pagedProducts = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Hàm render pagination
  function renderPagination() {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; ++i) {
      pages.push(
        <a
          key={i}
          className={i === currentPage ? styles.printer : ""}
          onClick={() => setCurrentPage(i)}
          style={{
            cursor: "pointer",
            fontWeight: i === currentPage ? 700 : 400,
          }}
        >
          {i}
        </a>
      );
    }
    return (
      <div className={styles.pagination}>
        {pages}
        {/* Next page */}
        {currentPage < totalPages && (
          <a
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{
              cursor: "pointer",
              fontWeight: 700,
            }}
            title="Trang tiếp theo"
          >
            &#8250;
          </a>
        )}
        {/* Last page */}
        {currentPage < totalPages && (
          <a
            onClick={() => setCurrentPage(totalPages)}
            style={{
              cursor: "pointer",
              fontWeight: 700,
            }}
            title="Trang cuối"
          >
            &#187;
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className={styles["filter-bar"]}>
        <div className={styles["filter-left"]}>
          <button className={styles["filter-button"]}>
            <svg className={styles["filter-icon"]} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f72585" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8l6 6v6l6-6V8H6z" />
            </svg>
            Lọc
          </button>
          <select
            className={styles["filter-select"]}
            value={priceFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setPriceFilter(e.target.value);
            }}
          >
            <option>Tất cả</option>
            <option>Dưới 300.000 đ</option>
            <option>Từ 300.000 đ - 500.000 đ</option>
            <option>Từ 500.000 đ - 1.000.000 đ</option>
            <option>Từ 1.00.000 đ - 2.000.000 đ</option>
            <option>Từ 2.00.000 đ - 3.000.000 đ</option>
          </select>
        </div>
        <div className={styles["filter-right"]}>
          <span className={styles["product-total"]}>{filtered.length} Sản phẩm CỬA HÀNG</span>
          <select
            className={styles["filter-select"]}
            value={sort}
            onChange={(e) => {
              setCurrentPage(1);
              setSort(e.target.value);
            }}
          >
            <option>Mới nhất</option>
            <option>Bán chạy nhất</option>
            <option>Giá : Thấp đến cao</option>
            <option>Giá : Cao đến thấp</option>
            <option>% Giảm giá</option>
            <option>Nổi bật</option>
          </select>
        </div>
      </div>
      {/* Danh sách sản phẩm */}
      <ProductList
        props={{
          title: "Tất cả sản phẩm",
          product: pagedProducts,
        }}
      />
      {/* Pagination */}
      {renderPagination()}
      {/* PHẦN INSTAGRAM */}
      <InstagramSection />
    </div>
  );
}