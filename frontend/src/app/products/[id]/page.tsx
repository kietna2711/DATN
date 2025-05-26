import { getDetail } from "../../services/productService";
import Gallery from "../../components/Gallery";
import ProductInfo from "../../components/ProductInfo";
import ProductTabs from "../../components/ProductTabs";
import ReviewList from "../../components/ReviewList";
import styles from "../../styles/productsDetail.module.css";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {

  if (!params?.id) return
  const product = await getDetail(params.id);
  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
  return (
    <div className={styles.container_tong}>
      <div className={styles.container_content}>
        <div className={styles.container_v3}>
          <Gallery images={product.image ? [product.image] : []} />
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