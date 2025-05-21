"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/productitem.module.css";

interface Product {
  id: number;
  title: string;
  imgMain: string;
  imgHover: string;
  logo: string;
  salePercent: string;
  oldPrice: string;
  salePrice: string;
  sizes: string[];
}

const productsData: Product[] = [
  {
    id: 1,
    title: "Gấu Bông Baby Three Thỏ Thị Trấn",
    imgMain: "img/image28.png",
    imgHover: "img/Gau-Bong-Capybara-Ca-Sau-1-500x500.jpg",
    logo: "img/Rectangle 3.png",
    salePercent: "-30%",
    oldPrice: "132.500 đ",
    salePrice: "120.000 đ",
    sizes: ["40cm", "50cm", "70cm"],
  },
  // ... thêm sản phẩm nếu cần
];

interface GbProductProps {
  product: Product;
}

const GbProduct: React.FC<GbProductProps> = ({ product }) => {
  const [activeSize, setActiveSize] = useState<string>(product.sizes[0]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className={styles["gb-product"]}>
      <div
        className={styles["gb-image-wrapper"]}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered ? product.imgHover : product.imgMain}
          alt={product.title}
          className={styles["gb-image"]}
        />
        <img src={product.logo} className={styles["gb-logo-left"]} alt="logo" />
        <div className={styles["gb-saleTag"]}>{product.salePercent}</div>
        <button className={styles["gb-buy-now-btn"]}>
          <img
            src="img/pink-teddy-bear-icon-vector-behance-hd-flat-colored-outline_675131_wh860-removebg-preview.png"
            className={styles["gb-bear-left"]}
            alt="Bear Left"
          />
          MUA NGAY
          <img
            src="img/pink-teddy-bear-icon-vector-behance-hd-flat-colored-outline_675131_wh860-removebg-preview.png"
            className={styles["gb-bear-right"]}
            alt="Bear Right"
          />
        </button>
      </div>
      <p>{product.title}</p>
      <div className={styles["gb-prices-sale"]}>
        <div className={styles["gb-price-sale"]}>{product.oldPrice}</div>
        <div className={styles["gb-price"]}>{product.salePrice}</div>
      </div>
      <div className={styles["gb-sizes"]}>
        {product.sizes.map((size) => (
          <span
            key={size}
            className={`${styles["gb-size-box"]} ${
              activeSize === size ? styles["gb-active"] : ""
            }`}
            onClick={() => setActiveSize(size)}
          >
            {size}
          </span>
        ))}
      </div>
    </div>
  );
};

const GBSieuSale: React.FC = () => {
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2300,
    arrows: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className={styles["gb-container"]}>
      <p className={styles["gb-title"]}>GẤU BÔNG SIÊU SALE</p>
      <Slider className={styles["gb-products"]} {...settings}>
        {productsData.map((product) => (
          <GbProduct key={product.id} product={product} />
        ))}
      </Slider>
      <div className={styles["gb-see-more"]}>
        <a href="#">XEM THÊM</a>
      </div>
    </div>
  );
};

export default GBSieuSale;
