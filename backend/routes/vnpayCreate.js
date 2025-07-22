const express = require("express");
const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
require("dotenv").config();

const router = express.Router();

router.post("/payment/vnpay/create_payment", async (req, res) => {
  const { amount, orderId, orderInfo } = req.body;

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const orderIdFormatted = orderId || moment(date).format("HHmmss");

  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderIdFormatted,
    vnp_OrderInfo: orderInfo || "Thanh toán đơn hàng",
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // Sort params
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  sortedParams.vnp_SecureHash = signed;

  const paymentUrl = `${process.env.VNP_URL}?${qs.stringify(sortedParams, { encode: true })}`;

  return res.status(200).json({ paymentUrl });
});

module.exports = router;
