import { Products } from "../types/productD";
import styles from "../styles/productitem.module.css";

export default function ProductItem({ product }: { product: Products }) {
  const prices = product.variants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className={styles.product}>
      <div className={styles.image_wrapper}>
        {/* Ảnh chính và ảnh hover */}
        <img src={product.image} alt={product.name} />
        <img
          src={product.image} 
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

      {/* Tên sản phẩm */}
      <p>{product.name}</p>

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
