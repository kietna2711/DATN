"use client";
import React, { useState } from "react";
import styles from "../styles/productsDetail.module.css";

interface Review {
  name: string;
  rating: number;
  comment: string;
}

const reviews: Review[] = [
  {
    name: "Nguyễn Văn A",
    rating: 5,
    comment: "Sản phẩm rất đẹp, đáng tiền!",
  },
  {
    name: "Nguyễn Văn B",
    rating: 4,
    comment: "Đóng gói đẹp, giao hàng nhanh.",
  },
  {
    name: "Nguyễn Văn A",
    rating: 5,
    comment: "Sản phẩm rất đẹp, đáng tiền!",
  },
  {
    name: "Nguyễn Văn B",
    rating: 4,
    comment: "Đóng gói đẹp, giao hàng nhanh.",
  },
  {
    name: "Nguyễn Văn A",
    rating: 5,
    comment: "Sản phẩm rất đẹp, đáng tiền!",
  },
  {
    name: "Nguyễn Văn B",
    rating: 4,
    comment: "Đóng gói đẹp, giao hàng nhanh.",
  },
  {
    name: "Nguyễn Văn A",
    rating: 5,
    comment: "Sản phẩm rất đẹp, đáng tiền!",
  },
  {
    name: "Nguyễn Văn B",
    rating: 4,
    comment: "Đóng gói đẹp, giao hàng nhanh.",
  },
  // ... những review khác
];

const reviewsPerPage = 7;

const ReviewList: React.FC = () => {
  const [page, setPage] = useState<number>(1);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const reviewsToShow = reviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage
  );

  return (
    <div className={styles.review_section}>
      <h2>Đánh giá của khách hàng</h2>
      <div id="review-list">
        {reviewsToShow.map((r, i) => (
          <div className={styles.review_item} key={i}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewerName}>{r.name}</span>
              <span className={styles.reviewRating}>{"⭐".repeat(r.rating)}</span>
            </div>
            <div className={styles.reviewComment}>{r.comment}</div>
          </div>
        ))}
      </div>
      <div id="pagination">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`${styles.paginationBtn} ${
              page === idx + 1 ? styles.paginationBtn_active : ""
            }`}
            onClick={() => setPage(idx + 1)}
            type="button"
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
