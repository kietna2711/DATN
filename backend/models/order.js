const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      variant: String,
      quantity: Number,
      images: String
    },
  ],
  shippingInfo: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Thêm userId để biết đơn của ai
    name: String,
    phone: String,
    address: String,
    note: String,
    cityId: String,
    districtId: String,
    wardId: String,
  },
  totalPrice: Number,
  paymentMethod: String,
  coupon: String,
  status: { type: String, default: "pending" }, // pending | paid | failed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);