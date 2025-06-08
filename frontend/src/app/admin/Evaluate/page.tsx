"use client";
import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Bổ sung productName vào Review
type Review = {
  username: any;
  _id: string;
  productId: string;
  productName?: string;
  name: string;
  rating: number;
  comment: string;
  status: "visible" | "hidden";
  createdAt: string;
};

type ReviewDetail = Review;

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

// Hàm format ngày tháng năm (dd/mm/yyyy)
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Modal/component chi tiết review sản phẩm
function ReviewDetailModal({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<ReviewDetail[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/reviews/admin?productId=${productId}`);
        if (!res.ok) throw new Error("Lỗi mạng!");
        const data = await res.json();
        let reviews = Array.isArray(data.reviews) ? data.reviews : [];
        reviews = reviews.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (!ignore) setDetails(reviews);
        if (reviews[0] && reviews[0].productName) {
          setProductName(reviews[0].productName);
        } else {
          fetchProductName(productId).then(name => { if (!ignore) setProductName(name); });
        }
      } catch (err) {
        if (!ignore) {
          setDetails([]);
          toast.error("Không thể tải chi tiết đánh giá!");
        }
      }
      setLoading(false);
    }
    fetchDetails();
    return () => { ignore = true; };
  }, [productId]);

  // API lấy tên sản phẩm nếu cần
  async function fetchProductName(productId: string): Promise<string> {
    try {
      const res = await fetch(`http://localhost:3000/products/${productId}`);
      if (!res.ok) return productId;
      const data = await res.json();
      return data.product?.name || productId;
    } catch {
      return productId;
    }
  }

  // Không reload khi ẩn/hiện, chỉ cập nhật local state
  const handleToggleVisibility = async (reviewId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/reviews/${reviewId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        }
      });
      const updatedReview = await res.json();

      setDetails(reviews =>
        reviews.map(r =>
          r._id === reviewId ? { ...r, status: updatedReview.status } : r
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
    <div className="modal show" style={{
      display: "block",
      background: "rgba(0,0,0,0.3)"
    }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Chi tiết đánh giá sản phẩm: {productName || productId}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div>Đang tải chi tiết...</div>
            ) : (
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Tên người dùng</th>
                    <th>Số sao</th>
                    <th>Bình luận</th>
                    <th>Ngày đăng</th>
                    <th>Hoạt động</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map(review => (
                    <tr key={review._id}>
                      <td>{review.username ? review.username : review.name || "Ẩn danh"}</td>
                      <td>{renderStars(review.rating)}</td>
                      <td>{review.comment}</td>
                      <td>{formatDate(review.createdAt)}</td>
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
                  {details.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">Không có đánh giá nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const reviewsRef = useRef<Review[]>([]);

  // Hàm fetchReviews chỉ cập nhật khi có thay đổi thực sự (tránh "dựt")
  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:3000/reviews/admin/reviews-latest');
      if (!res.ok) throw new Error("Lỗi mạng!");
      const data = await res.json();
      let newReviews = Array.isArray(data.reviews) ? data.reviews : [];
      // Bình luận mới nhất lên đầu
      newReviews = newReviews.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      // Chỉ setReviews nếu dữ liệu thực sự thay đổi
      const oldString = JSON.stringify(reviewsRef.current.map(r => r._id + r.status + r.comment + r.createdAt));
      const newString = JSON.stringify(newReviews.map((r: { _id: any; status: any; comment: any; createdAt: any; }) => r._id + r.status + r.comment + r.createdAt));
      if (firstLoad || oldString !== newString) {
        setReviews(newReviews);
        reviewsRef.current = newReviews;
        setFirstLoad(false);
      }
      setLoading(false);
    } catch (error) {
      setReviews([]);
      toast.error("Không thể tải dữ liệu đánh giá!");
      setLoading(false);
    }
  };

  // Polling: tự động load bình luận mới nhất, tránh "dựt"
  useEffect(() => {
    setLoading(true);
    fetchReviews();
    const interval = setInterval(() => {
      fetchReviews();
    }, 5000); // 5 giây 1 lần
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleShowDetail = (productId: string) => {
    setSelectedProductId(productId);
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
              {loading && reviews.length === 0 ? (
                <div>Đang tải dữ liệu...</div>
              ) : (
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>Tên người dùng</th>
                      <th>Tên sản phẩm</th>
                      <th>Số sao</th>
                      <th>Bình luận mới nhất</th>
                      <th>Ngày đăng</th>
                      <th>Hoạt động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review._id}>
                        <td>{review.username ? review.username : review.name || "Ẩn danh"}</td>
                        <td>
                          {review.productName
                            ? review.productName
                            : <span className="text-muted">Đang tải...</span>}
                        </td>
                        <td>{renderStars(review.rating)}</td>
                        <td>{review.comment}</td>
                        <td>{formatDate(review.createdAt)}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            type="button"
                            title="Xem chi tiết"
                            onClick={() => handleShowDetail(review.productId)}
                          >
                            <i className="fas fa-list"></i> Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="text-center">Không có đánh giá nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal xem chi tiết review */}
      {selectedProductId && (
        <ReviewDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </main>
  );
}