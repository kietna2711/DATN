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
          productName: item.productName, // Tên sản phẩm có thể lấy từ item
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
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    // Thêm tên sản phẩm cho mỗi đơn hàng
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        // Tìm các OrderDetail thuộc order này
        const details = await OrderDetail.find({ orderId: order.orderId || order._id });
        // Nếu trong OrderDetail đã lưu productName thì dùng luôn
        // Nếu productName không có, bạn cần populate từ Product model
        const productNames = details.map(d => d.productName || "Sản phẩm đã xóa");
        return {
          ...order.toObject(),
          productNames,
        };
      })
    );
    res.json(ordersWithProducts);
  } catch (err) {
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

// ✅ GET: Kiểm tra trạng thái đơn hàng sau thanh toán (dành cho VNPay & Momo)
exports.getOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { vnp_ResponseCode, resultCode } = req.query;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Nếu đã thanh toán, không làm gì
    if (order.paymentStatus === "paid") {
      return res.status(200).json({ status: "paid" });
    }

    // ✅ Nếu thanh toán VNPAY thành công
    if (vnp_ResponseCode === "00") {
      order.paymentStatus = "paid";
      await order.save();
      return res.status(200).json({ status: "paid" });
    }

    // ✅ Nếu thanh toán Momo thành công
    if (resultCode === "0") {
      order.paymentStatus = "paid";
      await order.save();
      return res.status(200).json({ status: "paid" });
    }

    // ❌ Nếu thanh toán thất bại
    if (vnp_ResponseCode || resultCode) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(200).json({ status: "failed" });
    }

    // ⏳ Nếu chưa có callback
    return res.status(200).json({ status: "pending" });
  } catch (err) {
    console.error("Get order status error:", err);
    res.status(500).json({ message: "Lỗi server", detail: err.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      orders.map(async (order) => {
        // orderId có thể là string hoặc _id, tùy cách bạn lưu lúc tạo OrderDetail
        const details = await OrderDetail.find({
          orderId: order.orderId || order._id.toString(),
        });
        // Lấy tên sản phẩm từ productName (vì bạn đã lưu sẵn khi tạo OrderDetail)
        const productNames = details.map(d => d.productName || '');
        return {
          ...order.toObject(),
          productNames,
        };
      })
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;
    const order = await Order.findOneAndUpdate(
      { $or: [{ orderId: id }, { _id: id }] },
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// module.exports = {
//   createOrder,
//   getAllOrders,
//   getOrders,
//   updateOrderStatus,
//   getOrderStatus, // dùng version mới nhất ở trên
// };
