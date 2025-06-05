const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authenticateToken = require("../middleware/auth"); // Đảm bảo đúng đường dẫn!

// GET: lấy review theo productId (chỉ visible)
router.get("/", reviewController.getReviews);

// GET: lấy toàn bộ review cho admin (cả visible & hidden)
router.get("/admin", reviewController.getReviewsAdmin);
// GET: lấy review mới nhất cho mỗi sản phẩm (dùng cho trang chủ)
router.get("/admin/reviews-latest", reviewController.getLatestReviewPerProduct);

// POST: thêm review mới (PHẢI CÓ MIDDLEWARE XÁC THỰC)
router.post("/", authenticateToken, reviewController.createReview);

// PATCH: đổi trạng thái review (ẩn/hiện)
router.patch("/:id/toggle-status", authenticateToken, reviewController.toggleReviewStatus);

module.exports = router;