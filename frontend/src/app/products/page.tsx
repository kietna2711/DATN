"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts, getProductsByCategory, getProductsBySubCategory } from "../services/productService";
import { Products } from "../types/productD";
import ProductList from "../components/ProductAll";
import InstagramSection from "../components/InstagramSection";
import styles from "../styles/productitem.module.css";
import Pagination from "../components/Pagination";
import { getCategories } from "../services/categoryService";
import { Category } from "../types/categoryD";

const PRODUCTS_PER_PAGE = 16; // mỗi trang hiển thị 16 sp

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy params từ URL
  const priceFilterParam = searchParams.get("price") || "Tất cả";
  const sortParam = searchParams.get("sort") || "Mới nhất";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const categoryId = searchParams.get("category") || "";
  const subCategoryId = searchParams.get("subcategory") || "";

  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // Reset page về 1 khi từ khóa tìm kiếm thay đổi
  useEffect(() => {
    if (pageParam !== 1) {
      updateQuery({ page: 1 });
    }
    // eslint-disable-next-line
  }, [searchQuery]);

  useEffect(() => {
    async function fetchData() {
      try {
        let data: Products[] = [];
        if (subCategoryId) {
          data = await getProductsBySubCategory(subCategoryId);
        } else if (categoryId) {
          data = await getProductsByCategory(categoryId);
        } else {
          data = await getProducts();
        }
        // Lọc sản phẩm mới nếu có query new=true
        if (searchParams.get("new") === "true") {
          if (data.length && typeof data[0].isNew !== "undefined") {
            data = data.filter((prod) => prod.isNew);
          } else {
            const now = new Date();
            data = data.filter((prod) => {
              const created = new Date(prod.createdAt);
              const diff = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
              return diff <= 30;
            });
          }
        }
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
    // eslint-disable-next-line
  }, [categoryId, subCategoryId, searchParams]);

  function filterByPrice(product: Products) {
    const min = Math.min(...product.variants.map((v) => v.price));
    switch (priceFilterParam) {
      case "Dưới 300.000 đ":
        return min < 300000;
      case "Từ 300.000 đ - 500.000 đ":
        return min >= 300000 && min <= 500000;
      case "Từ 500.000 đ - 1.000.000 đ":
        return min > 500000 && min <= 1000000;
      case "Từ 1.000.000 đ - 2.000.000 đ":
        return min > 1000000 && min <= 2000000;
      case "Từ 2.000.000 đ - 3.000.000 đ":
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
      if (value === undefined || value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    router.push(`?${newParams.toString()}`);
  };

  // Dropdown danh mục + danh mục con
  const currentCategory = categories.find(c => c._id === categoryId);

  return (
    <div>
      {/* Filter Bar */}
      <div className={styles["filter-bar"]}>
        <div className={styles["filter-left"]}>
          {/* Dropdown danh mục + danh mục con */}
          <div style={{ display: "flex", gap: 8 }}>
            <select
              className={styles["filter-select"]}
              value={categoryId}
              onChange={e => {
                updateQuery({ category: e.target.value, subcategory: "", page: 1 });
              }}
            >
              <option value="">Tất cả danh mục</option>
              {categories
                .filter(cat => !cat.hidden)
                .map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
              <select
                className={styles["filter-select"]}
                value={subCategoryId}
                onChange={e => updateQuery({ subcategory: e.target.value, page: 1 })}
              >
                <option value="">Tất cả danh mục con</option>
                {currentCategory.subcategories
                  .filter(sub => !sub.hidden)
                  .map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
          {/* Dropdown lọc giá tiền */}
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
            <option>Từ 2.000.000 đ - 3.000.000 đ</option>
          </select>
        </div>
        <div className={styles["filter-right"]}>
          <span className={styles["product-total"]}>{filtered.length} Sản phẩm</span>
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