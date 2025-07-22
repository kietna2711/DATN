const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/orderModel");
const OrderDetail = require("../models/orderDetailModel");
const { v4: uuidv4 } = require("uuid");
const authenticateToken = require("../middleware/auth");
const moment = require("moment");
const qs = require("qs");

// --- CẤU HÌNH MOMO ---
const momoPartnerCode = "MOMOYS4Y20250609";
const momoAccessKey = "RHUgLUY2qTrOvKBz";
const momoSecretKey = "4Vf1eeXWH0DqBN7IzDvKePIGMPb4fk2m";
const momoRedirectUrl = "http://localhost:3007/checkout/momo/return";
const momoIpnUrl = "http://localhost:3000/payment/payment-ipn";

// --- CẤU HÌNH VNPAY ---
const vnp_TmnCode = "63ZDG94B";
const vnp_HashSecret = "D6FW0IWLPVLUHW42F7RDZQXASY82IAEQ";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:3007/checkout/vnpay/return";


// ====== MOMO ROUTE ======
router.post("/momo", authenticateToken, async (req, res) => {
  const { amount, orderId, orderInfo, items, shippingInfo, coupon, shippingFee } = req.body;
  const userId = req.user?.id || req.user?._id;

  if (!amount || !orderId || !orderInfo || !items || !shippingInfo) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
  }

  let newOrder;
  try {
    newOrder = await Order.create({
      orderId,
      shippingInfo: { ...shippingInfo, userId: userId || null },
      shippingFee: shippingFee || 0,
      totalPrice: amount,
      paymentMethod: "momo",
      coupon: coupon || "",
      paymentStatus: "pending",
      orderStatus: "waiting",
    });
  } catch (err) {
    return res.status(500).json({ message: "Lưu đơn hàng thất bại", detail: err.message });
  }

  try {
    await Promise.all(items.map((item) =>
      OrderDetail.create({
        orderId: newOrder.orderId || newOrder._id.toString(),
        productId: item.productId,
        productName: item.productName,
        variant: item.variant,
        quantity: item.quantity,
        image: item.image,
        price: item.price * item.quantity,
        coupon: coupon || "",
      })
    ));
  } catch (err) {
    return res.status(500).json({ message: "Lưu chi tiết đơn hàng thất bại", detail: err.message });
  }

  const requestId = uuidv4();
  const rawSignature =
    "accessKey=" + momoAccessKey +
    "&amount=" + amount +
    "&extraData=" +
    "&ipnUrl=" + momoIpnUrl +
    "&orderId=" + orderId +
    "&orderInfo=" + orderInfo +
    "&partnerCode=" + momoPartnerCode +
    "&redirectUrl=" + momoRedirectUrl +
    "&requestId=" + requestId +
    "&requestType=captureWallet";

  const signature = crypto.createHmac("sha256", momoSecretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: momoPartnerCode,
    accessKey: momoAccessKey,
    requestId,
    amount: `${amount}`,
    orderId,
    orderInfo,
    redirectUrl: momoRedirectUrl,
    ipnUrl: momoIpnUrl,
    extraData: "",
    requestType: "captureWallet",
    signature,
  };

  try {
    const momoRes = await axios.post("https://payment.momo.vn/v2/gateway/api/create", requestBody);
    if (momoRes.data && momoRes.data.resultCode === 0) {
      res.json({ paymentUrl: momoRes.data.payUrl });
    } else {
      res.status(400).json({ message: momoRes.data.message || "Lỗi từ Momo", momoRes: momoRes.data });
    }
  } catch (err) {
    res.status(500).json({ message: "Tạo link thanh toán thất bại!", detail: err?.response?.data || err.message });
  }
});

// ====== VNPAY ROUTE ======
// routes/payment.js - thêm đoạn này thay cho create_payment_url
router.post("/vnpay", authenticateToken, async (req, res) => {
  const {
    amount, orderId, orderInfo, items, shippingInfo, coupon, shippingFee, orderType, bankCode
  } = req.body;

  const userId = req.user?.id || req.user?._id;

  if (!amount || !orderId || !orderInfo || !items || !shippingInfo) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
  }

  // B1.1: Tạo đơn hàng trong DB
  let newOrder;
  try {
    newOrder = await Order.create({
      orderId,
      shippingInfo: { ...shippingInfo, userId: userId || null },
      shippingFee: shippingFee || 0,
      totalPrice: amount,
      paymentMethod: "vnpay",
      coupon: coupon || "",
      paymentStatus: "pending",
      orderStatus: "waiting",
    });
  } catch (err) {
    return res.status(500).json({ message: "Lưu đơn hàng thất bại", detail: err.message });
  }
  // B1.2: Tạo chi tiết đơn hàng trong DB
  try {
    await Promise.all(items.map((item) =>
      OrderDetail.create({
        orderId: newOrder.orderId || newOrder._id.toString(),
        productId: item.productId,
        productName: item.productName,
        variant: item.variant,
        quantity: item.quantity,
        image: item.image,
        price: item.price * item.quantity,
        coupon: coupon || "",
      })
    ));
  } catch (err) {
    return res.status(500).json({ message: "Lưu chi tiết đơn hàng thất bại", detail: err.message });
  }

  // B2: Tạo link thanh toán VNPAY
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const txnRef = orderId;
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType || "billpayment",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl = vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });

  res.json({ paymentUrl });
});


// ====== HÀM SẮP XẾP THAM SỐ VNPAY ======
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

module.exports = router;
