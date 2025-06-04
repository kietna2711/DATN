const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  productId: String,
  name: String,
  rating: Number,
  comment: String,
  status: { type: String, enum: ["visible", "hidden"], default: "visible" },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Review", reviewSchema);