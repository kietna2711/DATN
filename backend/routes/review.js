const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// GET: lấy review theo productId (chỉ visible)
router.get("/", reviewController.getReviews);

// GET: lấy toàn bộ review cho admin (cả visible & hidden)
router.get("/admin", reviewController.getReviewsAdmin);

// POST: thêm review mới
router.post("/", reviewController.createReview);

// PATCH: đổi trạng thái review (ẩn/hiện)
router.patch("/:id/toggle-status", reviewController.toggleReviewStatus);

module.exports = router;