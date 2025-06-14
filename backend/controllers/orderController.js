const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');

// POST: Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, totalPrice, paymentMethod, coupon, orderId, shippingFee } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!items || !shippingInfo || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    // Xác định trạng thái thanh toán mặc định
    let paymentStatus = 'pending';
    if (paymentMethod === 'cod') {
      paymentStatus = 'unpaid';
    }
    // let paymentStatus = 'pending';
    // if (paymentMethod === 'momo' || paymentMethod === 'vnpay') {
    //   paymentStatus = 'paid';
    // }
    // if (paymentMethod === 'cod') {
    //   paymentStatus = 'unpaid';
    // }

    // 1. Lưu thông tin đơn hàng tổng quan khi tạo Order:
    const newOrder = new Order({
      orderId: orderId || undefined,
      shippingInfo: {
        ...shippingInfo,
        userId: userId || null
      },     
      shippingFee: shippingFee || 0, //phí ship
      totalPrice,
      paymentMethod,
      coupon,
      paymentStatus,           // Trạng thái thanh toán
      orderStatus: 'waiting'   // Mặc định là chờ xác nhận
    });
    await newOrder.save();

    // 2. Lưu từng item vào OrderDetail
    const details = await Promise.all(
      items.map(item =>
        OrderDetail.create({
          orderId: newOrder.orderId || newOrder._id.toString(),
          productId: item.productId,
          variant: item.variant,
          quantity: item.quantity,
          image: item.image,
          price: item.price * item.quantity,
          coupon: coupon || ""
        })
      )
    );

    res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder, orderDetails: details });
  } catch (err) {
    res.status(500).json({ message: "Đặt hàng thất bại!", error: err.message });
  }
};

// GET: lấy tất cả đơn hàng (ADMIN)
exports.getAllOrders = async (req, res) =>{
  try{
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err){
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// PUT: Cập nhật trạng thái đơn hàng (ADMIN)
exports.updateOrderStatus = async (req, res) =>{
  try{
    const { orderId } = req.params;
    const { orderStatus } = req.body; //
    const order = await Order.findOneAndUpdate(
      { $or: [ { orderId }, { _id: orderId } ] },
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch(err){
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// GET: Kiểm tra trạng thái đơn hàng (bổ sung để tránh lỗi route)
exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { resultCode } = req.query;

    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    // Nếu đang pending và resultCode=0 (thành công), cập nhật trạng thái thanh toán sang paid
    if (order.paymentStatus === "pending" && resultCode === "0") {
      order.paymentStatus = "paid";
      await order.save();
    }
    if (order.paymentStatus === "pending" && resultCode && resultCode !== "0") {
      order.paymentStatus = "unpaid";
      await order.save();
    }
    res.json({ status: order.paymentStatus });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};