const Review = require("../models/reviewModel");

// Lấy review cho khách hàng (ẩn review đã bị admin ẩn)
exports.getReviews = async (req, res) => {
  try {
    const { productId, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // Lọc theo productId nếu có
    if (productId) {
      query.productId = productId;
    }

    // Tìm kiếm theo tên người đánh giá hoặc nội dung comment
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 }) // mới nhất lên trước
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      reviews
    });
  } catch (err) {
    console.error("Lỗi lấy review:", err);
    res.status(500).json({ error: "Lỗi server khi lấy review" });
  }
};

// Thêm review mới
exports.createReview = async (req, res) => {
  try {
    const { productId, name, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }
    const review = await Review.create({
      productId,
      name: name || "Khách",
      rating,
      comment,
      status: "visible" // Mặc định khi tạo mới là "visible"
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Đổi trạng thái review (ẩn/hiện)
exports.toggleReviewStatus = async (req, res) => {
  try {
    const { id } = req.params; // id review
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: "Không tìm thấy review" });
    review.status = review.status === "visible" ? "hidden" : "visible";
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
// PATCH /reviews/:id/toggle-status
