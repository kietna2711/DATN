"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Review = {
  _id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  status: "visible" | "hidden";
  createdAt: string;
};

function renderStars(stars: number) {
  const full = Math.floor(stars);
  const empty = 5 - full;
  return (
    <span style={{ color: "#FFD700" }}>
      {[...Array(full)].map((_, i) => (
        <i key={"full" + i} className="fas fa-star"></i>
      ))}
      {[...Array(empty)].map((_, i) => (
        <i key={"empty" + i} className="far fa-star"></i>
      ))}
      {" "}({stars})
    </span>
  );
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState("");

  // Lấy dữ liệu từ API
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/reviews");
        if (!res.ok) throw new Error("Lỗi mạng!");
        const data = await res.json();
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch (error) {
        setReviews([]);
        toast.error("Không thể tải dữ liệu đánh giá!");
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  // Đồng hồ realtime
  useEffect(() => {
    function updateClock() {
      const today = new Date();
      const weekday = [
        "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
      ];
      const day = weekday[today.getDay()];
      let dd: string | number = today.getDate();
      let mm: string | number = today.getMonth() + 1;
      const yyyy = today.getFullYear();
      let h: string | number = today.getHours();
      let m: string | number = today.getMinutes();
      let s: string | number = today.getSeconds();
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      dd = dd < 10 ? "0" + dd : dd;
      mm = mm < 10 ? "0" + mm : mm;
      const nowTime = `${h} giờ ${m} phút ${s} giây`;
      const dateStr = `${day}, ${dd}/${mm}/${yyyy}`;
      setClock(`${dateStr} - ${nowTime}`);
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle ẩn/hiện đánh giá
  const handleToggleVisibility = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/reviews/${id}/toggle-status`, { method: "PATCH" });
      if (!res.ok) throw new Error("Đổi trạng thái thất bại");
      const updatedReview = await res.json();

      setReviews(reviews =>
        reviews.map(r =>
          r._id === id ? { ...r, status: updatedReview.status } : r
        )
      );

      toast.success(
        updatedReview.status === "visible"
          ? "Đánh giá đã được hiển thị!"
          : "Đánh giá đã được ẩn!"
      );
    } catch (err) {
      toast.error("Không thể đổi trạng thái review!");
    }
  };

  return (
    <main className="app-content">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active">
            <a href="#"><b>Quản lý đánh giá</b></a>
          </li>
        </ul>
        <div id="clock">{clock}</div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              {loading ? (
                <div>Đang tải dữ liệu...</div>
              ) : (
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>ID đánh giá</th>
                      <th>Tên người dùng</th>
                      <th>Tên sản phẩm</th>
                      <th>Số sao</th>
                      <th>Bình luận</th>
                      <th>Ngày đăng</th>
                      <th>Trạng thái</th>
                      <th>Hoạt động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review._id}>
                        <td>{review._id}</td>
                        <td>{review.name}</td>
                        <td>{review.productId}</td>
                        <td>{renderStars(review.rating)}</td>
                        <td>{review.comment}</td>
                        <td>{review.createdAt}</td>
                        <td>
                          <span className={`badge ${review.status === "visible" ? "bg-success" : "bg-secondary"}`}>
                            {review.status === "visible" ? "Hiển thị" : "Đã ẩn"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-light btn-sm toggle-visibility"
                            type="button"
                            title="Ẩn/Hiện"
                            onClick={() => handleToggleVisibility(review._id)}
                          >
                            <i className={`fas ${review.status === "visible" ? "fa-eye" : "fa-eye-slash"}`}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center">Không có đánh giá nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}