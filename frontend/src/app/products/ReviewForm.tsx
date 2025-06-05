'use client';
import React, { useState } from 'react';
import styles from '../styles/ReviewForm.module.css';

const ReviewForm = ({ productId }: { productId: string }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  // Nếu click vào sao đang chọn, giảm rating đi 1 (bỏ chọn sao đó và các sao cao hơn)
  const handleStarClick = (star: number) => {
    if (rating === star) {
      setRating(star - 1);
    } else {
      setRating(star);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Vui lòng chọn số sao!');
      return;
    }
    const res = await fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment }),
    });

    if (res.ok) {
      alert('Gửi đánh giá thành công!');
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h3 className={styles.formTitle}>Đánh giá sản phẩm</h3>
      <div className={styles.starRating}>
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${rating >= star ? styles.filled : ''}`}
            onClick={() => handleStarClick(star)}
            aria-label={`${star} sao`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStarClick(star);
            }}
          >
            ★
          </span>
        ))}
      </div>
      <label htmlFor="review-comment" className={styles.label}>Bình luận của bạn</label>
      <textarea
        id="review-comment"
        className={styles.textarea}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Bạn nghĩ gì về sản phẩm này?"
        rows={4}
        required
      />
      <button className={styles.submitBtn} type="submit">Gửi đánh giá</button>
    </form>
  );
};

export default ReviewForm;