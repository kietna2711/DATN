const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/orderModel");
const OrderDetail = require("../models/orderDetailModel");
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
  const { amount, orderId, orderInfo, items, shippingInfo, coupon, shippingFee } = req.body;
  const userId = req.user?.id || req.user?._id;

  console.log("orderId FE gửi lên:", orderId); //kiểm lỗi

  // Kiểm tra tham số đầu vào validate
  if (!amount || !orderId || !orderInfo || !items || !shippingInfo) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
  }

  // 1. Lưu đơn hàng vào DB với trạng thái phù hợp (thanh toán momo là paid)
  let newOrder;
  try {
    newOrder = await Order.create({
      orderId,
      shippingInfo: {
        ...shippingInfo,
        userId: userId || null
      },
      shippingFee: shippingFee || 0,
      totalPrice: amount,
      paymentMethod: "momo",
      coupon: coupon || "",
      paymentStatus: "pending",
      orderStatus: "waiting"
    });
  } catch (err) {
    consolog.error("lỗi tạo đơn hàng momo:", err); //hiện lỗi chi tiết
    return res.status(500).json({ message: "Lưu đơn hàng thất bại", detail: err.message });
  }

  // 2. Lưu từng item vào OrderDetail
  try {
    await Promise.all(
      items.map(item =>
        OrderDetail.create({
          orderId: newOrder.orderId || newOrder._id.toString(),
          productId: item.productId,
          productName: item.productName, // Tên sản phẩm có thể lấy từ item
          variant: item.variant,
          quantity: item.quantity,
          image: item.image,
          price: item.price * item.quantity, // Nếu FE gửi price, còn không thì cần truyền thêm
          coupon: coupon || ""
        })
      )
    );
  } catch (err) {
    return res.status(500).json({ message: "Lưu chi tiết đơn hàng thất bại", detail: err.message });
  }

  const requestId = uuidv4();

  // 3. Tạo raw signature string
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

  // 4. Đặt signature
  const signature = crypto.createHmac("sha256", secretKey)
    .update(rawSignature).digest("hex");

  // 5. Tạo body gửi Momo
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
    // 6. Gửi yêu cầu lên Momo
    const momoRes = await axios.post('https://payment.momo.vn/v2/gateway/api/create', requestBody);
    console.log("Response từ Momo:", momoRes.data);
    if (momoRes.data && momoRes.data.resultCode === 0) {
      // Thành công: trả về link thanh toán
      res.json({ paymentUrl: momoRes.data.payUrl });
    } else {
      res.status(400).json({ message: momoRes.data.message || "Lỗi từ Momo", momoRes: momoRes.data });
    }
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ message: "Tạo link thanh toán thất bại!", detail: err?.response?.data || err.message });
  }
});

module.exports = router;