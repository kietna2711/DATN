const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      productName: String,
      variant: String,
      quantity: Number,
      price: Number,
      images: [String],
    },
  ],
  shippingInfo: {
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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("order", orderSchema);