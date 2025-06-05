"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/productsDetail.module.css";
import { Products } from "../types/productD";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";


const ProductInfo = ({ product }: { product: Products }) => {
  const variants = product.variants ?? [];
  const [activeSize, setActiveSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const productId = (product._id ?? product.id)?.toString();

 useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    // Ép kiểu sang string để so sánh chắc chắn
    const exists = favorites.some((item: Products) => ((item._id ?? item.id)?.toString() === productId));
    setIsFavorite(exists);
  }, [productId]);



  useEffect(() => {
    // Đọc tham số size từ URL nếu có
    const params = new URLSearchParams(window.location.search);
    const sizeParam = params.get("size");
    if (sizeParam) {
      const idx = variants.findIndex(v => v.size === sizeParam);
      if (idx !== -1) setActiveSize(idx);
    }
    // Chỉ chạy 1 lần khi component mount
    // eslint-disable-next-line
  }, [variants]);

  const toggleFavorite = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const exists = favorites.some((item: Products) => ((item._id ?? item.id)?.toString() === productId));
  let updatedFavorites;
  if (exists) {
    updatedFavorites = favorites.filter((item: Products) => ((item._id ?? item.id)?.toString() !== productId));
  } else {
    updatedFavorites = [...favorites, product];
  }
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  setIsFavorite(!exists);

  // Thêm dòng này để thông báo cho Header cập nhật lại số:
  window.dispatchEvent(new Event("favoriteChanged"));
};
  const currentVariant = variants[activeSize];

  return (
    <div className={styles.productInfo_v3_noCard}>
      <div className={styles.productDetail_innerWrap}>
        <div className={styles.titleRow}>
          <span
            className={styles.heartIcon}
            title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            onClick={toggleFavorite}
          >
            {isFavorite ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />}
          </span>
          <span className={styles.productTitle}>{product.name}</span>
        </div>
        <div className={styles.productPrice}>
          {currentVariant
            ? `${currentVariant.price.toLocaleString("vi-VN")} đ`
            : "Liên hệ"}
        </div>
        <div className={styles.productSizeNote}>
          Kích thước:
          {variants.map((v, i) => (
            <span
              key={v.size}
              className={`${styles.btnSize} ${activeSize === i ? styles.btnSize_active : ""}`}
              onClick={() => setActiveSize(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveSize(i);
              }}
            >
              {v.size}
            </span>
          ))}
        </div>

        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Kích thước</th>
              <th>Giá SP</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, idx) => (
              <tr key={v.size} className={idx === activeSize ? styles.activeRow : ""}>
                <td>{v.size}</td>
                <td className={styles.price}>
                  {v.price.toLocaleString("vi-VN")} đ
                </td>
                <td>
                  {idx === activeSize && <span style={{color: "#0a0"}}>Đang chọn</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.buyRow}>
          <div className={styles.quantity_v4}>
            <button
              className={styles.quantity_v4_button}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >-</button>
            <input className={styles.quantity_v4_input} type="text" value={quantity} readOnly />
            <button
              className={styles.quantity_v4_button}
              onClick={() => setQuantity(q => q + 1)}
            >+</button>
          </div>
          <button className={styles.addToCart_v4}>THÊM VÀO GIỎ HÀNG</button>
        </div>

        <div className={styles.phoneBuy}>
          <a href="tel:0979896616" className={styles.phone_v4}>
            <img
              src="https://img.icons8.com/material-outlined/24/ffffff/phone--v1.png"
              className={styles.phoneIcon}
              alt="Icon điện thoại"
            />
            0979896616
          </a>
          <button className={styles.buyNow_v4}>MUA NGAY</button>
        </div>

        <div className={styles.productBadges}>
          <span>100% bông trắng tinh khiết</span>
          <span>100% ảnh thực bản quyền Bemori</span>
          <span>Bảo hành dưỡng chỉ trọn đời</span>
          <span>Nén gấu bông nhỏ gọn</span>
        </div>

        <hr className={styles.infoDivider} />

        <div className={styles.productSection}>
          <div className={styles.sectionTitle}>ĐẶC ĐIỂM NỔI BẬT</div>
          <ul className={styles.productSection_ul}>
            <li>Chất liệu mềm mại, đảm bảo an toàn</li>
            <li>Bông polyester 3D trắng cao cấp, đàn hồi cao</li>
            <li>Đường may tỉ mỉ, chắc chắn</li>
            <li>Đa dạng kích thước</li>
            <li>Màu sắc tươi tắn</li>
          </ul>
        </div>

        <div className={styles.productSection_khuyenmai}>
          <div className={styles.sectionTitle}>KHUYẾN MẠI</div>
          <ul className={styles.productSection_ul}>
            <li>Tặng kèm thiệp ý nghĩa: Thiệp sinh nhật, tình yêu, cảm ơn, ngày lễ...</li>
            <li>Gói túi kính buộc nơ siêu xinh</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;