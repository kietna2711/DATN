import { Products } from "../types/productD";
import styles from "../styles/productitem.module.css";
import Link from "next/link";
import { Category } from "../types/categoryD";

// Component con hiển thị từng sản phẩm
function ProductItem({ product }: { product: Products }) {
  const prices = product.variants.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  return (
    <div className={styles.product}>
      <div className={styles.image_wrapper}>
        <Link href={`/products/${product._id}`}>
          <div className={styles.image_link}>
            {/* Ảnh chính và ảnh hover */}
            <img
              src={`http://localhost:3000/images/${product.images[0]}`}
              alt={product.name}
            />
            <img
              src={`http://localhost:3000/images/${product.images[1]}`}
              className={styles.image_hover}
              alt={`${product.name} Hover`}
            />

            {/* Logo trái */}
            <img
              src="http://localhost:3000/images/logoXP.png"
              className={styles.logo_left}
              alt="Logo"
            />

            {/* Tag giảm giá */}
            <div className={styles.saleTag}>30%</div>
          </div>
        </Link>

        {/* Nút mua ngay */}
        <button className={styles.buy_now_btn}>
          <img
            src="http://localhost:3000/images/button.png"
            className={styles.bear_left}
            alt="Bear Left"
          />
          MUA NGAY
          <img
            src="http://localhost:3000/images/button.png"
            className={styles.bear_right}
            alt="Bear Right"
          />
        </button>
      </div>

      {/* Tên sản phẩm (có thể cho vào Link nếu muốn click vào tên để xem chi tiết) */}
      <Link href={`/products/${product._id}`}>
        <p className={styles.product_name}>{product.name}</p>
      </Link>

      {/* Giá */}
      <div className={styles.prices_sale}>
        <div className={styles.price}>
          {minPrice.toLocaleString("vi-VN")} đ
        </div>
        {minPrice !== maxPrice && (
          <div className={styles.price_sale}>
            {maxPrice.toLocaleString("vi-VN")} đ
          </div>
        )}
      </div>

      {/* Size */}
      <div className={styles.sizes}>
        {product.variants.map((variant, index) => (
          <span
            key={variant.size}
            className={`${styles.size_box} ${index === 0 ? styles.active : ""}`}
          >
            {variant.size}
          </span>
        ))}
      </div>
    </div>
  );
}

// Component cha hiển thị danh sách sản phẩm
export default function ProductAll({
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
      <div className={styles.container_product}>
        <p className={styles.tieude}>{props.title}</p>

        {/* Ảnh nếu có */}
        {props.image && (
          <div className={styles["img_category_product"]}>
            <img src={props.image} alt="Category" />
          </div>
        )}

        {/* Hiển thị tất cả sản phẩm */}
        <div className={styles.products}>
          {props.product.map((p: Products) => (
            <ProductItem product={p} key={p._id} />
          ))}
        </div>
      </div>
    </section>
  );
}