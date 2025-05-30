import { Products } from "../types/productD";
import styles from "../styles/productitem.module.css";

export default function ProductItem({ product }: { product: Products }) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const prices = hasVariants
    ? product.variants.map((v) => Number(v.price) || 0)
    : [Number(product.price) || 0];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className={styles.product}>
      <div className={styles.image_wrapper}>
        <a href={`/products/${product._id}`}>
          <div className={styles.image_link}>
            <img src={`http://localhost:3000/images/${product.images[0]}`} alt={product.name} />
            <img
              src={`http://localhost:3000/images/${product.images[1]}`}
              className={styles.image_hover}
              alt={`${product.name} Hover`}
            />
            <img
              src="http://localhost:3000/images/logoXP.png"
              className={styles.logo_left}
              alt="Logo"
            />
            <div className={styles.saleTag}>30%</div>
          </div>
        </a>

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

      <a href={`/products/${product._id}`}>
        <p className={styles.product_name}>{product.name}</p>
      </a>

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

      {/* Size chỉ hiển thị nếu có variants */}
      {hasVariants && (
        <div className={styles.sizes}>
          {product.variants.map((variant, index) => (
            <span
              key={`${variant.size}-${index}`}
              className={`${styles.size_box} ${index === 0 ? styles.active : ""}`}
            >
              {variant.size}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
