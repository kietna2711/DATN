const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// GET /orders/status/:orderId -- kiểm tra trạng thái đơn hàng
router.get("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { resultCode } = req.query; // FE truyền lên nếu có

    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    // Nếu đang pending và resultCode=0 (thành công), cập nhật trạng thái sang paid
    if (order.status === "pending" && resultCode === "0") {
      order.status = "paid";
      await order.save();
    }
    if (order.status === "pending" && resultCode && resultCode !== "0") {
      order.status = "failed";
      await order.save();
    }
    res.json({ status: order.status });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// POST /orders (tạo đơn hàng mới)
router.post("/", async (req, res) => {
  try {
    const { items, shippingInfo, totalPrice, paymentMethod, coupon, orderId } = req.body;
    const userId = req.user?.id || req.user?._id;

    const itemsToSave = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      variant: item.variant,
      image: item.image
    }));

    const newOrder = new Order({
      orderId: orderId || undefined,
      items: itemsToSave,
      shippingInfo: {
        ...shippingInfo,
        userId: userId || null
      },
      totalPrice,
      paymentMethod,
      coupon
    });
    await newOrder.save();
    res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Đặt hàng thất bại!", error: err.message });
  }
});

module.exports = router;