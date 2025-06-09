router.post("/payment-ipn", (req, res) => {
  // Xác thực và cập nhật trạng thái đơn hàng trong DB
  // req.body chứa thông tin giao dịch và chữ ký
  // Bạn kiểm tra signature, xác nhận thành công thì cập nhật order status = "paid"
  res.status(200).send("OK");
});