const mongoose = require("mongoose"); // <-- Dòng này phải có!
const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    console.log("Body nhận được:", req.body); // log data gửi lên để kiểm tra
    const { items, shippingInfo, totalPrice, paymentMethod, coupon } = req.body;
    const newOrder = new Order({
      items,
      shippingInfo,
      totalPrice,
      paymentMethod,
      coupon
    });
    await newOrder.save();
    res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });
  } catch (err) {
    console.error("Lỗi backend:", err); // log lỗi chi tiết
    res.status(500).json({ message: "Đặt hàng thất bại!", error: err.message });
  }
});

module.exports = router;