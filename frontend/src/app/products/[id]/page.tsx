import { getDetail } from "../../services/productService";
import Gallery from "../Gallery";
import ProductInfo from "../ProductInfo";
import ProductTabs from "../ProductTabs";
import ReviewList from "../ReviewList";
import styles from "../../styles/productsDetail.module.css";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;

  const product = await getDetail(id);
  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
  return (
    <div className={styles.container_tong}>
      <div className={styles.container_content}>
        <div className={styles.container_v3}>
          <Gallery
        images={
          Array.isArray(product.images)
            ? product.images.map((img) => `http://localhost:3000//images/${img}`)
            : []
        }
      />



          <ProductInfo product={product} />
        </div>
        <div className={styles.content_container_tong}>
          <ProductTabs product={product} />
          <ReviewList />
        </div>
      </div>
    </div>
  );
}