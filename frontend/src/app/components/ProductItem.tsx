import { Products } from "../types/productD";
import styles from "../styles/productitem.module.css";

export default function ProductItem({ product }: { product: Products }) {
  // Lấy giá thấp nhất trong các variants
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    // <a href={`/products/${product._id}`} className={styles.product}>
      <div className={styles.product}>
        <div className={styles.imageWrapper}>
          <img src={product.image} alt="Gấu Bông" />
          <img
            src={product.image}
            className={styles.imageHover}
            alt="Gấu Bông Hover"
          />
          <img
            src="http://localhost:3000/images/logoXP.png"
            className={styles.logoLeft}
            alt="logo"
          />
          <div className={styles.saleTag}></div>
          <button className={styles.buyNowBtn}>
            <img
              src="http://localhost:3000/images/button.png"
              className={styles.bearLeft}
              alt="Bear Left"
            />
            MUA NGAY
            <img
              src="http://localhost:3000/images/button.png"
              className={styles.bearRight}
              alt="Bear Right"
            />
          </button>
        </div>

        <p>{product.name}</p>

        <div className={styles.pricesSale}>
          <div className={styles.price}>
            {minPrice.toLocaleString("vi-VN")} đ
          </div>
        </div>

        <div className={styles.sizes}>
          {product.variants.map((variant) => (
            <span key={variant.size} className={styles.sizeBox}>
              {variant.size}
            </span>
          ))}
        </div>
      </div>
    // </a>
  );
}
