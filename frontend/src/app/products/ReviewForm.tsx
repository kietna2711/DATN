'use client';
import React, { useState } from 'react';
import styles from '../styles/ReviewForm.module.css';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewForm = ({ productId }: { productId: string }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>("");

  const handleStarClick = (star: number) => {
    if (rating === star) {
      setRating(star - 1);
    } else {
      setRating(star);
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra lỗi
    if (rating === 0) {
      setError("Vui lòng chọn số sao!");
      toast.warn("Vui lòng chọn số sao!", { position: "top-center" });
      return;
    }
    if (!comment.trim()) {
      setError("Vui lòng nhập bình luận!");
      toast.warn("Vui lòng nhập bình luận!", { position: "top-center" });
      return;
    }

    setError("");
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (res.ok) {
        toast.success('Cảm ơn bạn đã gửi đánh giá >.<', { position: "top-center" });
        setRating(0);
        setComment('');
      } else if (res.status === 401 || res.status === 403) {
        toast.error('Bạn cần đăng nhập để đánh giá!', { position: "top-center" });
      } else {
        toast.error('Đã có lỗi xảy ra! Xin thử lại.', { position: "top-center" });
      }
    } catch (err) {
      toast.error('Không thể gửi đánh giá. Kiểm tra kết nối mạng!', { position: "top-center" });
    }
  };

  return (
    <>
      {/* ToastContainer: chỉ nên để 1 ở root, nhưng nếu chưa có thì đặt ở đây */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
      <form onSubmit={handleSubmit} className={styles.reviewForm} noValidate>
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
          onChange={(e) => { setComment(e.target.value); setError(""); }}
          placeholder="Bạn nghĩ gì về sản phẩm này?"
          rows={4}
          required
        />
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        <button className={styles.submitBtn} type="submit">Gửi đánh giá</button>
      </form>
    </>
  );
};

export default ReviewForm;