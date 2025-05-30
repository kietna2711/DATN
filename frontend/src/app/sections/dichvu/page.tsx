import React from 'react';
import styles from './dichvu.module.css';
import InstagramSection from '../../components/InstagramSection';

const servicesData = [
  {
    title: "In Gấu Bông Cá Nhân Hóa",
    desc: "Dịch Vụ In Ấn Gấu Bông Cá Nhân Hóa Theo Yêu Cầu",
    img: "https://bemori.vn/wp-content/uploads/2025/04/thumb-in-ten.webp",
    link: "/dich-vu/in-gau-bong"
  },
  {
    title: "Tích Điểm Hoàn Tiền",
    desc: "Chính Sách Khách Hàng Thân Thiết Và Tích Điểm Hoàn Tiền",
    img: "https://bemori.vn/wp-content/uploads/2025/03/tich-diem.webp",
    link: "/dich-vu/tich-diem"
  },
  {
    title: "Đổi Trả 3 Ngày",
    desc: "Dịch Vụ Đổi Trả Trong Vòng 3 Ngày",
    img: "https://bemori.vn/wp-content/uploads/2025/03/doi-tra.webp",
    link: "/dich-vu/doi-tra"
  },
  {
    title: "Khâu Gấu Miễn Phí",
    desc: "Khâu Gấu Miễn Phí – Giải Quyết Nỗi Lo Rách Chỉ",
    img: "https://bemori.vn/wp-content/uploads/2025/03/khau-gau.webp",
    link: "/dich-vu/khau-gau"
  },
  {
    title: "Giao Hàng Siêu Tốc",
    desc: "Giao Hàng Siêu Tốc Toàn Quốc",
    img: "https://bemori.vn/wp-content/uploads/2025/03/giao-hang.webp",
    link: "/dich-vu/giao-hang"
  },
  {
    title: "Tặng Thiệp Ý Nghĩa",
    desc: "Tặng Thiệp Ý Nghĩa – Gửi Gắm Tình Cảm",
    img: "https://bemori.vn/wp-content/uploads/2025/03/tang-thiep.webp",
    link: "/dich-vu/tang-thiep"
  },
  {
    title: "Hút Chân Không",
    desc: "Hút Chân Không Gấu Bông Miễn Phí",
    img: "https://bemori.vn/wp-content/uploads/2025/03/nen-nho.webp",
    link: "/dich-vu/hut-chan-khong"
  },
  {
    title: "Gói Quà Giá Rẻ",
    desc: "Gói Quà Giá Rẻ – Bọc Quà Siêu Xinh",
    img: "https://bemori.vn/wp-content/uploads/2025/03/boc-qua.webp",
    link: "/dich-vu/goi-qua"
  },
  {
    title: "Bảo Hành Trọn Đời",
    desc: "Bảo Hành Gấu Bông Trọn Đời",
    img: "https://bemori.vn/wp-content/uploads/2025/03/bao-hanh.webp",
    link: "/dich-vu/bao-hanh"
  },
  {
    title: "Làm Mới Bông Gòn",
    desc: "Làm Mới Bông Gòn – Nhồi Thêm Bông",
    img: "https://bemori.vn/wp-content/uploads/2025/03/bong-gon.webp",
    link: "/dich-vu/lam-moi-bong"
  },
  {
    title: "Giặt Gấu Chuyên Nghiệp",
    desc: "Giặt Gấu Chuyên Nghiệp – Chăm Sóc Gấu Yêu",
    img: "https://bemori.vn/wp-content/uploads/2025/03/giat-gau.webp",
    link: "/dich-vu/giat-gau"
  }
];

const Services: React.FC = () => {
  return (
    <>
      <div className={styles['services-container']}>
        <div className={styles['services-title']}>DỊCH VỤ NỔI BẬT CHỈ CÓ TẠI BEMORI</div>
        <div className={styles['services-grid']}>
          {servicesData.map((service, index) => (
            <div key={index} className={styles['service-card']}>
              <img className={styles['service-img']} src={service.img} alt={service.title} />
              <a href={service.link} style={{ textDecoration: 'none' }}>
                <div className={styles['service-desc']}>{service.desc}</div>
              </a>
              <div className={styles['service-link-wrap']}>
                <hr />
                <a className={styles['service-link']} href={service.link}>Xem thêm</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHẦN INSTAGRAM */}
      <InstagramSection />
    </>
  );
};

export default Services;
