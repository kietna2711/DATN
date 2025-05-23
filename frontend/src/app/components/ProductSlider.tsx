import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/productitem.module.css";
import ProductItem from "./ProductItem";
import { Products } from "../types/productD";

type ProductSliderProps = {
  props: {
    title: string;
    products: Products[];
  };
};

export default function ProductSlider({ props }: ProductSliderProps) {
  const { title, products } = props;

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
    <section>
      <div className={styles.container_product}>
        <p className={styles.tieude}>{title}</p>
        <Slider {...settings} className={styles.gb_products}>
          {products.map((product) => (
            <div key={product._id}>
              <ProductItem product={product} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
