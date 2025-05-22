import React from "react";
import styles from "../../styles/productsDetail.module.css";
import Gallery from "../../components/Gallery";
import ProductInfo from "../../components/ProductInfo";
import ProductTabs from "../../components/ProductTabs";
import ReviewList from "../../components/ReviewList";
import { Products } from "../../types/productD"; 

// ✅ Hàm lấy sản phẩm từ API
async function getProduct(id: string): Promise<Products | null> {
  try {
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      cache: "no-store", // Không cache, luôn fetch mới
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

// ✅ Component hiển thị sản phẩm
const ProductPage = async ({
  params,
}: {
  params: { id?: string };
}) => {
  if (!params?.id) return <div>Lỗi: không tìm thấy ID sản phẩm</div>;

  const product = await getProduct(params.id);

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className={styles.container_tong}>
      <div className={styles.container_content}>
        <div className={styles.container_v3}>
       <Gallery images={[product.image, ...(product.image || [])]} />
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
