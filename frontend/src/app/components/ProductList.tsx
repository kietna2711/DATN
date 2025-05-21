import { useState } from "react";
import { Products } from "../types/productD";
import ProductItem from "./ProductItem";
import styles from "../styles/productitem.module.css";
import { Category } from "../types/categoryD";

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
  const [activeCategory, setActiveCategory] = useState<string | null>(
    props.category?.[0]?._id || null
  );

  const filteredProducts =
    activeCategory === null
      ? props.product
      : props.product.filter((p) => p.categoryId._id === activeCategory);

  return (
    <section>
      <div className={styles["container-product"]}>
        <p className={styles.tieude}>{props.title}</p>

        {props.category && props.category.length > 0 && (
          <div className={styles.danhmucgau}>
            {props.category.map((ctgr, index) => (
              <button
                key={ctgr._id || index}
                className={
                  ctgr._id === activeCategory ? styles["ctgr-active"] : ""
                }
                onClick={() => setActiveCategory(ctgr._id)}
              >
                {ctgr.name}
              </button>
            ))}
          </div>
        )}

        {props.image && (
          <div className={styles["img-category-product"]}>
            <img src={props.image} alt="Category" />
          </div>
        )}

        <div className={styles.products}>
          {filteredProducts.map((p: Products) => (
            <ProductItem product={p} key={p._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
