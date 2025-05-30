"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/productsDetail.module.css";
import { Products } from "../types/productD";
import { Variant } from "../types/variantD";

type Props = {
  product: Products;
};


const ProductTabs: React.FC<Props> = ({ product }) => {
  const [tab, setTab] = useState("info");
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const variants: Variant[] = product.variants ?? [];

  return (
    <div className={styles.productTabs}>
      <div className={styles.tab_buttons}>
        <button
          className={`${styles.tabBtn} ${tab === "info" ? styles.tabBtn_active : ""}`}
          onClick={() => setTab("info")}
        >
          THÔNG TIN
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "spec" ? styles.tabBtn_active : ""}`}
          onClick={() => setTab("spec")}
        >
          THÔNG SỐ
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "care" ? styles.tabBtn_active : ""}`}
          onClick={() => setTab("care")}
        >
          BẢO QUẢN &amp; GIẶT GẤU
        </button>
      </div>

      {/* THÔNG TIN SẢN PHẨM */}
      <div
        className={`${styles.tabContent} ${tab === "info" ? styles.tabContent_active : ""}`}

      >
        <h4 className={styles.tabTitle}>THÔNG TIN SẢN PHẨM</h4>
        <p><strong>{product.name}</strong></p>
        <img
          className={styles.productInfoImage}
          src={
            Array.isArray(product.images) && product.images.length > 0
              ? `http://localhost:3000/images/${product.images[0]}`
              : ""
          }
          alt={product.name}
        />


        <div
          ref={contentRef}
          className={styles.productInfoText}
          style={{
            maxHeight: isExpanded ? contentHeight : 140,
            overflow: "hidden",
            transition: "max-height 0.5s ease",
          }}
        >
          <p><strong>Mã sản phẩm:</strong>{product._id}</p>



          {variants.length > 0 && (
            <>
              <p><strong>Kích Thước & Giá:</strong></p>
              {variants.map((v, idx) => (
                <div key={v.size || idx}>
                  Size: {v.size} – {v.price.toLocaleString("vi-VN")}đ
                </div>
              ))}
            </>
          )}


          <p><strong>Chất liệu:</strong><br />
            Vải bên ngoài: lông thú cao cấp.<br />
            Bông nhồi bên trong: 100% bông polyester trắng đàn hồi loại 1.
          </p>
          {Array.isArray(product.images) && product.images.length > 1 && (
            <img
              className={styles.productInfoImage}
              src={`http://localhost:3000/images/${product.images[1]}`}
              alt={product.name}
            />
          )}
          <p><strong>Công dụng:</strong><br />

            Chơi với gấu bông không chỉ giúp tăng tính độc lập, mà còn giúp giảm thiểu căng thẳng, điều hòa huyết áp và kích thích sản sinh hormon Endorphins. Hormon này có tác dụng đem lại cảm giác vui vẻ, yêu đời, tự tin, căng tràn sức sống và kích thích sự sáng tạo.

          </p>

        </div>

        <button className={styles.seeMore} onClick={toggleExpand}>
          {isExpanded ? "THU GỌN NỘI DUNG" : "XEM THÊM NỘI DUNG"}
        </button>
      </div>

      {/* THÔNG SỐ */}
      <div
        className={`${styles.tabContent} ${tab === "spec" ? styles.tabContent_active : ""}`}
        style={{ display: tab === "spec" ? "block" : "none" }}
      >
        <h4 className={styles.tabTitle}>THÔNG SỐ</h4>
        <table className={styles.tabContent_table}>
          <thead>
            <tr>
              <th>Kích thước</th>
              <th>Chiều dài</th>
              <th>Chiều ngang</th>
              <th>Trọng lượng</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Size 1</td><td>70cm</td><td>35cm</td><td>1400g</td></tr>
            <tr><td>Size 2</td><td>40cm</td><td>25cm</td><td>500g</td></tr>
            <tr><td>Size 3</td><td>25cm</td><td>18cm</td><td>160g</td></tr>
          </tbody>
        </table>
      </div>

      {/* BẢO QUẢN */}
      <div
        className={`${styles.tabContent} ${tab === "care" ? styles.tabContent_active : ""}`}
        style={{ display: tab === "care" ? "block" : "none" }}
      >
        <h4 className={styles.tabTitle}>BẢO QUẢN &amp; GIẶT GẤU</h4>
        <p>
          Gấu bông là người bạn thân thiết của nhiều người, đặc biệt là trẻ em. Tuy nhiên, sau một thời gian sử dụng,
          gấu bông sẽ bám bụi bẩn, vi khuẩn và trở thành nơi ẩn trú của các tác nhân gây dị ứng...
        </p>
        <p>
          Chúng tôi đã có một số mẹo để bảo quản và giặt gấu bông hiệu quả mà MiMiBear muốn chia sẻ đến bạn.
        </p>

        <img className={styles.productInfoImage}
          src="https://bemori.vn/wp-content/uploads/2024/08/bao-quan-va-giat-gau-scaled.webp" alt="" />




        <p>
          Để bảo quản gấu bông, bạn nên giữ gấu bông ở nơi khô thoáng, tránh ẩm ướt và ánh nắng trực tiếp. Khi giặt gấu bông, bạn nên giặt bằng nước lạnh, tránh giặt nước nóng và sử dụng chất tẩy mạnh. Bạn cũng nên cho gấu bông vào túi giặt trước khi giặt bằng máy giặt và chọn chế độ giặt nhẹ.
        </p>
        <p><a className={styles.tabContent_a} href="#">Lưu ý tại đây</a></p>
      </div>
    </div>
  );
};

export default ProductTabs;
