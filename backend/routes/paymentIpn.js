// const Order = require('../models/order'); // Model Order của bạn

// router.post("/payment-ipn", async (req, res) => {
//   console.log("Nhận được IPN từ MOMO:", req.body);
//   const data = req.body;
//   // Kiểm tra signature ở đây...
//   if (data.resultCode === 0) {
//     // Tìm order theo orderId (nên gửi thêm info từ FE khi bắt đầu thanh toán)
//     let order = await Order.findOne({ orderId: data.orderId });
//     if (!order) {
//       // Nếu chưa có đơn hàng thì tạo mới
//       order = new Order({
//         orderId: data.orderId,
//         // Thêm các trường khác: items, shippingInfo, amount, userId, ...
//         paymentMethod: "momo",
//         status: "paid",
//         // ... các trường khác từ FE
//       });
//       await order.save();
//     } else {
//       // Nếu có rồi thì cập nhật trạng thái
//       order.status = "paid";
//       await order.save();
//     }
//   }
//   res.status(200).send("OK");
// });