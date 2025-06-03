const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: String,
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["visible", "hidden"], default: "visible" },
});

module.exports = mongoose.model("Review", reviewSchema);