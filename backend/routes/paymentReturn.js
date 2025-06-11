const express = require("express");
const router = express.Router();

// Route xử lý redirect sau khi thanh toán Momo
router.get("/payment-return", (req, res) => {
  const { message, resultCode } = req.query;
  if (resultCode === "0") {
    // Thanh toán thành công, cập nhật trạng thái đơn hàng trong DB nếu cần
    res.send("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
  } else {
    res.send("Thanh toán thất bại: " + (message || "Không rõ lỗi"));
  }
});

module.exports = router;