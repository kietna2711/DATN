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

  // GET /orders - Lấy danh sách đơn hàng (dùng cho React admin)
  router.get("/", ordersController.getOrders);

  // PUT /orders/:id - Cập nhật trạng thái đơn hàng (nếu cần)
  router.put("/:id", ordersController.updateOrderStatus);

  // Nếu muốn cho phép xóa đơn hàng, bỏ comment bên dưới
  // router.delete("/:id", ordersController.deleteOrder);

  module.exports = router;