import { Products } from "../types/productD";
import styles from "../styles/productitem.module.css";
import Link from "next/link";


export default function ProductItem({ product }: { product: Products }) {

  const prices = product.variants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
   <div className={styles.product}>
  <div className={styles.image_wrapper}>
    <Link href={`/products/${product._id}`}>
      <div className={styles.image_link}>
        {/* Ảnh chính và ảnh hover */}
        <img src={`http://localhost:3000/images/${product.image}`} alt={product.name} />
        <img
          src= {`http://localhost:3000/images/${product.image}`}
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
