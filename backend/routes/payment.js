const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/order");
const { v4: uuidv4 } = require("uuid");

// Thông tin cấu hình Momo
const partnerCode = "MOMOYS4Y20250609";
const accessKey = "RHUgLUY2qTrOvKBz";
const secretKey = "4Vf1eeXWH0DqBN7IzDvKePIGMPb4fk2m";
const redirectUrl = "http://localhost:3007/checkout/momo/return";
const ipnUrl = "http://localhost:3000/payment/payment-ipn";

// Tạo endpoint thanh toán momo
router.post("/momo", async (req, res) => {
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

// IPN từ Momo: cập nhật trạng thái đơn hàng về paid, có kiểm tra signature
// router.post("/payment-ipn", async (req, res) => {
//   try {
//     const {
//       partnerCode, accessKey, requestId, amount, orderId, orderInfo,
//       orderType, transId, resultCode, message, payType, responseTime,
//       extraData, signature
//     } = req.body;

//     // 1. Tạo lại rawSignature giống như MoMo gửi
//     const rawSignature =
//       `accessKey=${accessKey}` +
//       `&amount=${amount}` +
//       `&extraData=${extraData}` +
//       `&message=${message}` +
//       `&orderId=${orderId}` +
//       `&orderInfo=${orderInfo}` +
//       `&orderType=${orderType}` +
//       `&partnerCode=${partnerCode}` +
//       `&payType=${payType}` +
//       `&requestId=${requestId}` +
//       `&responseTime=${responseTime}` +
//       `&resultCode=${resultCode}` +
//       `&transId=${transId}`;

//     // 2. Tính lại signature
//     const serverSignature = crypto.createHmac("sha256", secretKey)
//       .update(rawSignature)
//       .digest("hex");

//     // 3. So sánh signature
//     if (signature !== serverSignature) {
//       return res.status(400).json({ message: "Sai chữ ký xác thực!" });
//     }

//     // 4. Cập nhật đơn hàng
//     if (resultCode == 0) {
//       const order = await Order.findOneAndUpdate(
//         { orderId },
//         { status: "paid" }
//       );
//       if (!order) {
//         // Nếu không tìm thấy đơn hàng, có thể log lại để kiểm tra
//         return res.status(404).json({ message: "Không tìm thấy đơn hàng để cập nhật" });
//       }
//       return res.status(200).json({ message: "Đã cập nhật trạng thái đơn hàng sang 'paid'" });
//     } else {
//       await Order.findOneAndUpdate(
//         { orderId },
//         { status: "failed" }
//       );
//       return res.status(200).json({ message: "Thanh toán thất bại, trạng thái đơn hàng đã được cập nhật" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi xử lý IPN", detail: err.message });
//   }
// });

module.exports = router;