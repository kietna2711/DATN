"use client";

import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { Category } from "../../types/categoryD";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "@/app/styles/productcollection.module.css";


export default function ProductCollection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  return (
    <div className={styles.wrapper}>
      <p className={styles.tieude}>Bộ sưu tập gấu bông</p>
      <div className={styles.bangTruot}>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index}>
                <a href={`products?category=${cat._id}`} className={styles.theSanPham}>
                    <img src="http://localhost:3000/images/image 26.png" alt={cat.name} />
                    <p className={styles.tenSanPham}>{cat.name}</p>
                </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
