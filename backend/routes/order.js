  const express = require("express");
  const router = express.Router();
  const ordersController = require("../controllers/orderController");
  const authenticateToken = require('../middleware/auth');

  // GET /orders - Lấy tất cả đơn hàng (admin)
  router.get("/", ordersController.getAllOrders);

  // PUT /orders/:orderId - Cập nhật trạng thái đơn hàng
  router.put("/:orderId", ordersController.updateOrderStatus);
  
  // POST /orders - Tạo đơn hàng mới
  router.post("/", authenticateToken, ordersController.createOrder);

  // GET /orders/status/:orderId - Kiểm tra trạng thái đơn hàng
  router.get("/status/:orderId", ordersController.getOrderStatus);

  module.exports = router;