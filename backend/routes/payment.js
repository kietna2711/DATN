const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/orderModel");
const { v4: uuidv4 } = require("uuid");

// Thông tin cấu hình Momo
const partnerCode = "MOMOYS4Y20250609";
const accessKey = "RHUgLUY2qTrOvKBz";
const secretKey = "4Vf1eeXWH0DqBN7IzDvKePIGMPb4fk2m";
const redirectUrl = "http://localhost:3007/checkout/momo/return";
const ipnUrl = "http://localhost:3000/payment/payment-ipn";

const authenticateToken = require('../middleware/auth');

// Tạo endpoint thanh toán momo
router.post("/momo", authenticateToken, async (req, res) => {
  const { amount, orderId, orderInfo, items, shippingInfo, coupon } = req.body;  // Log orderId FE gửi lên để kiểm tra
  const userId = req.user?.id || req.user?._id; //có thể là id hoặc _id

  console.log("orderId FE gửi lên:", orderId);

  // Kiểm tra tham số đầu vào validate
  if (!amount || !orderId || !orderInfo || !items || !shippingInfo) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
  }

  // Chỉ lấy dữ liệu tối giản cho items
  const itemsToSave = items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    variant: item.variant,
    image: item.image, // chỉ 1 hình đã chọn lúc mua
  }));

//1. Lưu đơn hàng vào DB với status: "pending"
  try{
      await Order.create({
      orderId,
      items: itemsToSave, // truyền từ FE
      shippingInfo: {
        ...shippingInfo,
        userId: userId || null //nếu chưa login thì null
      },
      totalPrice: amount,
      paymentMethod: "momo",
      coupon: coupon || "",
      status: "pending",
    });
  } catch (err){
    return res.status(500).json({ message: "Lưu đơn hàng thất bại", detail: err.message });
  }

  const requestId = uuidv4();

  // 2. Tạo raw signature string
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

  // 3. Đặt signature
  const signature = crypto.createHmac("sha256", secretKey)
    .update(rawSignature).digest("hex");

  // 4. Tạo body gửi Momo
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
    // 5. Gửi yêu cầu lên Momo
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