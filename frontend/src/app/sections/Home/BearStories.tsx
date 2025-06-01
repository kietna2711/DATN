"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/app/styles/bearstories.module.css";

const stories = [
  {
    img: "https://bemori.vn/wp-content/uploads/2025/05/thumb-goi-y-qua-16-cho-be-mam-non.webp",
    alt: "June 1st Gift",
    title: "Gợi Ý Quà 1/6 Cho Bé Mầm Non: Gấu Bông Dưới 100K Đẹp, Tiết Kiệm",
    link: "#",
  },
  {
    img: "https://bemori.vn/wp-content/uploads/2025/05/Thumb-bai-viet.webp",
    alt: "Name Printed Bears",
    title: "Ngày Của Bé – Deal Siêu To: Túi Mù Khổng Lồ 399K Phá Đảo Mùa Hè",
    link: "#",
  },
  {
    img: "https://bemori.vn/wp-content/uploads/2025/04/thumb-gau-bong-in-ten-gia-bao-nhieu.webp",
    alt: "Graduation Bears",
    title: "Gấu Bông In Tên Giá Bao Nhiêu Tiền? Cập Nhật Bảng Giá Mới Nhất",
    link: "#",
  },
  {
    img: "https://bemori.vn/wp-content/uploads/2025/04/thumb-bst-gau-tot-nghiep-hoat-hinh.webp",
    alt: "Graduation Bears",
    title: "Gấu Bông Tốt Nghiệp Hoạt Hình: Món Quà “Must-Have” Cho Lễ Ra Trường",
    link: "#",
  },
  {
    img: "https://upload.bemori.vn/chuyen-nha-gau/feedback-tui-mu-khong-lo/thumb-tui-mu-khong-lo.webp",
    alt: "Graduation Bears",
    title: "Khám Phá Blindbox Khổng Lồ 399K Của Bemori Có Gì Hấp Dẫn?",
    link: "#",
  },
];

export default function BearStories() {
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className={styles.bgsContainer}>
      <h2 className={styles.bgsHeader}>Chuyện Nhà Gấu</h2>
      <Slider {...settings} className={styles.bgsCarousel}>
        {stories.map((story, index) => (
          <div key={index} className={styles.bgsSlide}>
            <img src={story.img} alt={story.alt} />
            <div className={styles.bgsCaption}>
              <p>{story.title}</p>
              <a href={story.link}>Xem thêm</a>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
