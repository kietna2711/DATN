import React from "react";
import styles from "../../styles/productsDetail.module.css";
import Gallery from "../../components/Gallery";
import ProductInfo from "../../components/ProductInfo";
import ProductTabs from "../../components/ProductTabs";
import ReviewList from "../../components/ReviewList";
import { getDetail } from "../../services/productService"; // đúng đường dẫn tới hàm getDetail

const ProductPage = async ({
  params,
}: {
  params: { id?: string };
}) => {
  if (!params?.id) return <div>Lỗi: không tìm thấy ID sản phẩm</div>;

  const product = await getDetail(params.id);

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className={styles.container_tong}>
      <div className={styles.container_content}>
        <div className={styles.container_v3}>
          <Gallery images={[product.image, ...(product.images ?? [])]} />
          <ProductInfo product={product} />
        </div>
        <div className={styles.content_container_tong}>
          <ProductTabs />
          <ReviewList />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;