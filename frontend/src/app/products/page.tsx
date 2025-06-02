"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts, getProductsByCategory, getProductsBySubCategory } from "../services/productService";
import { Products } from "../types/productD";
import ProductList from "../components/ProductAll";
import InstagramSection from "../components/InstagramSection";
import styles from "../styles/productitem.module.css";
import Pagination from "../components/Pagination";


const PRODUCTS_PER_PAGE = 16; // mỗi trang hiển thị 16 sp

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy params từ URL
  const priceFilterParam = searchParams.get("price") || "Tất cả";
  const sortParam = searchParams.get("sort") || "Mới nhất";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceFilter, setPriceFilter] = useState<string>("Tất cả");
  const [sort, setSort] = useState<string>("Mới nhất");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";


    useEffect(() => {
    setCurrentPage(1);
    console.log("Từ khóa tìm kiếm thay đổi:", searchQuery);
    
  }, [searchQuery]);


  // dm
  const categoryId = searchParams.get("category");
  const subCategoryId = searchParams.get("subcategory");

  useEffect(() => {
    async function fetchData() {
      try {
        let data: Products[] = [];
        if (subCategoryId){
          data = await getProductsBySubCategory(subCategoryId);
        }else if(categoryId){
          data = await getProductsByCategory(categoryId);
        }else{
          data = await getProducts();
        }
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true); //reset loading sau mỗi lần lọc
    fetchData();
  }, [categoryId, subCategoryId]);

  function filterByPrice(product: Products) {
    const min = Math.min(...product.variants.map((v) => v.price));
    switch (priceFilterParam) {
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

  function filterBySearch(product: Products) {
    const nameMatch = product.name.toLowerCase().includes(searchQuery);
    const descMatch = product.description?.toLowerCase().includes(searchQuery) || false;
    return nameMatch || descMatch;
  }


  function sortProducts(list: Products[]) {
    if (sortParam === "Mới nhất") {
      return [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    if (sortParam === "Giá : Thấp đến cao") {
      return [...list].sort(
        (a, b) =>
          Math.min(...a.variants.map((v) => v.price)) -
          Math.min(...b.variants.map((v) => v.price))
      );
    }
    if (sortParam === "Giá : Cao đến thấp") {
      return [...list].sort(
        (a, b) =>
          Math.min(...b.variants.map((v) => v.price)) -
          Math.min(...a.variants.map((v) => v.price))
      );
    }
    return list;
  }

  // if (loading) return <div>Đang tải sản phẩm...</div>;
  // if (!products.length) return <div>Không có sản phẩm nào.</div>;

  // Xử lý lọc và sắp xếp
  const filtered = sortProducts(
  products.filter(
    (product) => filterByPrice(product) && filterBySearch(product)
  )
);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  // Lấy sản phẩm cho trang hiện tại
  const pagedProducts = filtered.slice(
    (pageParam - 1) * PRODUCTS_PER_PAGE,
    pageParam * PRODUCTS_PER_PAGE
  );

  // Hàm cập nhật url khi chọn filter/sort/page
  const updateQuery = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    router.push(`?${newParams.toString()}`);
  };

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
            value={priceFilterParam}
            onChange={(e) => {
              updateQuery({ price: e.target.value, page: 1 }); // reset page về 1 khi đổi filter
            }}
          >
            <option>Tất cả</option>
            <option>Dưới 300.000 đ</option>
            <option>Từ 300.000 đ - 500.000 đ</option>
            <option>Từ 500.000 đ - 1.000.000 đ</option>
            <option>Từ 1.000.000 đ - 2.000.000 đ</option>
            <option>Từ 2.00.000 đ - 3.000.000 đ</option>
          </select>
        </div>
        <div className={styles["filter-right"]}>
          <span className={styles["product-total"]}>{filtered.length} Sản phẩm CỬA HÀNG</span>
          <select
            className={styles["filter-select"]}
            value={sortParam}
            onChange={(e) => {
              updateQuery({ sort: e.target.value, page: 1 }); // reset page về 1 khi đổi sort
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
      <Pagination
        currentPage={pageParam}
        totalPages={totalPages}
        onPageChange={(page) => updateQuery({ page })}
      />
      {/* PHẦN INSTAGRAM */}
      <InstagramSection />
    </div>
  );
}