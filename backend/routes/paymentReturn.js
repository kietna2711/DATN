// const express = require("express");
// const router = express.Router();
// const Order = require('../models/order');

// // Route xử lý redirect sau khi thanh toán Momo
// router.get("/payment-return", async (req, res) => {
//   const {orderId, message, resultCode } = req.query;

//   if (!orderId){
//     return res.send("Thiếu thông tin mã đơn hàng!");
//   }
//   const order = await Order.findOne({ orderId});
//   if (!order){
//     return res.send("Không tìm thấy đơn hàng để cập nhật trạng thái!");
//   }

//   if (resultCode === "0") {
//     order.status = "paid";
//     await order.save();
//     // Thanh toán thành công, cập nhật trạng thái đơn hàng trong DB nếu cần
//     res.send("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
//   } else {
//     order.status = "failed";
//     await order.save();
//     res.send("Thanh toán thất bại: " + (message || "Không rõ lỗi"));
//   }
// });

// module.exports = router;