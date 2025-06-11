const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Thông tin cấu hình Momo
const partnerCode = "MOMOYS4Y20250609";
const accessKey = "RHUgLUY2qTrOvKBz";
const secretKey = "4Vf1eeXWH0DqBN7IzDvKePIGMPb4fk2m";
const redirectUrl = "http://localhost:3000/payment-return";
const ipnUrl = "http://localhost:3000/payment-ipn";

// Tạo endpoint thanh toán momo
router.post("/momo", async (req, res) => {
  const { amount, orderId, orderInfo } = req.body;
  // Log orderId FE gửi lên để kiểm tra
  console.log("orderId FE gửi lên:", orderId);

  // Kiểm tra tham số đầu vào
  if (!amount || !orderId || !orderInfo) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
  }

  const requestId = uuidv4();

  // 1. Tạo raw signature string
  const rawSignature =
    "accessKey=" + accessKey +
    "&amount=" + amount +
    "&extraData=" +
    "&ipnUrl=" + ipnUrl +
    "&orderId=" + orderId +
    "&orderInfo=" + orderInfo +
    "&partnerCode=" + partnerCode +
    "&redirectUrl=" + redirectUrl +
    "&requestId=" + requestId +
    "&requestType=captureWallet";

  // 2. Đặt signature
  const signature = crypto.createHmac("sha256", secretKey)
    .update(rawSignature).digest("hex");

  // 3. Tạo body gửi Momo
  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    amount: `${amount}`,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData: "",
    requestType: "captureWallet",
    signature
  };

  // Log body gửi lên Momo
  console.log("Body gửi lên Momo:", requestBody);

  try {
    // 4. Gửi yêu cầu lên Momo
    const momoRes = await axios.post('https://payment.momo.vn/v2/gateway/api/create', requestBody);
    // Log response trả về từ Momo
    console.log("Response từ Momo:", momoRes.data);

    if (momoRes.data && momoRes.data.resultCode === 0) {
      // Thành công: trả về link thanh toán
      res.json({ paymentUrl: momoRes.data.payUrl });
    } else {
      // Lỗi từ Momo
      res.status(400).json({ message: momoRes.data.message || "Lỗi từ Momo", momoRes: momoRes.data });
    }
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ message: "Tạo link thanh toán thất bại!", detail: err?.response?.data || err.message });
  }
});

module.exports = router;