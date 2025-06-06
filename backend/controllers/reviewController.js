const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Lấy review cho khách hàng (ẩn review đã bị admin ẩn, hoặc lấy tất cả cho admin)
// Route: /reviews
exports.getReviews = async (req, res) => {
  try {
    const { productId, search, page = 1, limit = 10 } = req.query;
    const query = { status: "visible" };
    if (productId) query.productId = productId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const username = req.user?.username || null;

    res.json({
      username,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      reviews: reviews.map(r => ({
        ...r.toObject(),
        commenterName: r.username 
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy review" });
  }
};

// Route: /admin/reviews
exports.getReviewsAdmin = async (req, res) => {
  try {
    const { productId, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (productId) query.productId = productId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      reviews
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy review" });
  }
};

// Thêm review mới
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const username = req.user?.username || "Ẩn danh";
    const review = await Review.create({ productId, rating, comment, username, status: "visible" });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
  console.log('req.user:', req.user);
};

// Đổi trạng thái review (ẩn/hiện)
exports.toggleReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    console.log("Review found:", review);
    if (!review) return res.status(404).json({ error: "Không tìm thấy review" });
    review.status = review.status === "visible" ? "hidden" : "visible";
    await review.save();
    console.log("Review after save:", review);
    res.json(review);
  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy review mới nhất cho mỗi sản phẩm
exports.getLatestReviewPerProduct = async (req, res) => {
  try {
    // Group by productId, lấy review mới nhất
    const latestReviews = await Review.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$productId",
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      {
        $addFields: {
          productIdObj: { $toObjectId: "$productId" } // Nếu productId là string, convert sang ObjectId
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productIdObj",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $addFields: {
          productName: { $arrayElemAt: ["$productInfo.name", 0] }
        }
      },
      {
        $project: {
          productInfo: 0,
          productIdObj: 0
        }
      }
    ]);

    res.json({ reviews: latestReviews });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy review mới nhất theo sản phẩm" });
  }
};