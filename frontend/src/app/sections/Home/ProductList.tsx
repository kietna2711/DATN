import { useState } from "react";
import { Products } from "../../types/productD";
import ProductItem from "../../components/ProductItem";
import styles from "@/app/styles/productitem.module.css";
import { Category } from "../../types/categoryD";

export default function ProductList({
  props,
}: {
  props: {
    title: string;
    image?: string;
    category?: Category[];
    product: Products[];
  };
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Nếu có danh mục thì lọc theo activeCategory
  const filteredProducts =
    props.category && props.category.length > 0
      ? activeCategory === "all"
        ? props.product.slice(0, 8)
        : props.product
            .filter((p) => p.categoryId._id === activeCategory)
            .slice(0, 4)
      : props.product.slice(0, 8); // Không có category, lấy 4 sản phẩm đầu

  return (
    <section>
      <div className={styles.container_product}>
        <p className={styles.tieude}>{props.title}</p>

        {/* Chỉ hiển thị nút chọn danh mục nếu có danh mục */}
        {props.category && props.category.length > 0 && (
          <div className={styles.danhmucgau}>
            <button
              onClick={() => setActiveCategory("all")}
              className={activeCategory === "all" ? styles.active : ""}
            >
              Tất cả
            </button>
            {props.category.map((ctgr) => (
              <button
                key={ctgr._id}
                onClick={() => setActiveCategory(ctgr._id)}
                className={activeCategory === ctgr._id ? styles.active : ""}
              >
                {ctgr.name}
              </button>
            ))}
          </div>
        )}

        {/* Ảnh nếu có */}
        {props.image && (
          <div className={styles["img_category_product"]}>
            <img src={props.image} alt="Category" />
          </div>
        )}

        {/* Hiển thị sản phẩm */}
        <div className={styles.products}>
          {filteredProducts.map((p: Products) => (
            <ProductItem product={p} key={p._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
