const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// GET: lấy review theo productId
router.get("/", reviewController.getReviews);

// POST: thêm review mới
router.post("/", reviewController.createReview);
// PATCH: đổi trạng thái review (ẩn/hiện)
router.patch("/reviews/:id/toggle-status", reviewController.toggleReviewStatus);

module.exports = router;
