const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orderController");
const authenticateToken = require('../middleware/auth');

// POST /orders - Tạo đơn hàng mới
router.post("/", authenticateToken, ordersController.createOrder);

// GET /orders/status/:orderId - Kiểm tra trạng thái đơn hàng
router.get("/status/:orderId", ordersController.getOrderStatus);

module.exports = router;