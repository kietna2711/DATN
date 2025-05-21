import { Products } from "../types/productD";
import ProductItem from "./ProductItem";
import styles from "../styles/productitem.module.css";
import { Category } from '../types/categoryD';

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
  return (
    <section>
      <div className={styles["container-product"]}>
        <p className={styles.tieude}>{props.title}</p>
        {props.category && props.category.length > 0 && (
          <div className={styles.danhmucgau}>
            {props.category.map((ctgr, index) => (
              <a
                href="#"
                key={ctgr._id || index}
                className={index === 0 ? styles["ctgr-active"] : ""}
              >
                {ctgr.name}
              </a>
            ))}
          </div>
        )}
        {props.image && (
          <div className={styles["img-category-product"]}>
            <img src={props.image} alt="Category" />
          </div>
        )}

        <div className={styles.products}>
          {props.product.map((p: Products) => (
            <ProductItem product={p} key={p._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
