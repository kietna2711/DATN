const express = require('express');
const router = express.Router();
const User = require('../models/userprofileModel');
const Profile = require('../models/profileModel');
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Product = require('../models/productModel');



// Lấy thông tin user + profile theo username
router.get('/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    // Tìm user theo username
    const user = await User.findOne({ username }).select('-password -role');
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    // Tìm profile theo username
    const profile = await Profile.findOne({ username }) || null;
    res.json({ ...user.toObject(), profile });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Tạo profile mới cho username (chỉ khi chưa có profile cho username này)
router.post('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { phone, gender, birthDate, addresses } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Thiếu username hợp lệ' });
    }

    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    // Kiểm tra profile đã tồn tại chưa
    const existingProfile = await Profile.findOne({ username });
    if (existingProfile) return res.status(400).json({ message: 'Profile đã tồn tại cho username này' });

    // Tạo mới profile
    const profile = new Profile({ username, phone, gender, birthDate, addresses });
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username đã tồn tại (duplicate key)' });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo profile', error: error.message });
  }
});

// Cập nhật profile (chỉ khi đã tồn tại)
router.put('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { phone, gender, birthDate, addresses, firstName, lastName } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    // Cập nhật họ tên nếu có
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    await user.save();

    // Cập nhật profile
    const profile = await Profile.findOne({ username });
    if (!profile) return res.status(404).json({ message: 'Profile chưa tồn tại' });

    profile.phone = phone;
    profile.gender = gender;
    profile.birthDate = birthDate;
    profile.addresses = addresses;

    await profile.save();

    res.json({ ...user.toObject(), profile: profile.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật profile', error: error.message });
  }
});


// Lấy đơn hàng có shippingInfo.name trùng username
router.get('/by-username-ordername/:username', async (req, res) => {
  const { username } = req.params;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Thiếu hoặc sai username' });
  }

  try {
    const orders = await Order.find({ 'shippingInfo.name': username }).sort({ createdAt: -1 });

    const result = await Promise.all(
      orders.map(async (order) => {
        const orderId = order.orderId || order._id.toString();
        const details = await OrderDetail.find({ orderId });

        const products = await Promise.all(
          details.map(async (d) => {
            let image = '';
            try {
              if (d.productId) {
                const product = await Product.findById(d.productId).select('images');
                if (product?.images?.length > 0) {
                  image = product.images[0];
                }
              }
            } catch (e) {
              console.error(`Lỗi khi lấy ảnh cho sản phẩm ${d.productId}:`, e);
            }

            return {
              productId: d.productId?.toString() || '',
              productName: d.productName || '',
              quantity: d.quantity || 0,
              variant: d.variant || '',
              price: d.price || 0,
              image,
            };
          })
        );

        return { ...order.toObject(), products };
      })
    );

    return res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    return res.status(500).json({ error: 'Lỗi server khi lấy đơn hàng' });
  }
});

// routes/orders.js
router.put('/update-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) return res.status(400).json({ error: 'Thiếu orderId' });

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

    const currentStatus = order.orderStatus;
    const paymentMethod = order.paymentMethod.toLowerCase();
    const paymentStatus = order.paymentStatus;

    // ✅ Trường hợp: Huỷ đơn khi đang chờ xác nhận
    if (currentStatus === 'waiting') {
      order.orderStatus = 'cancelled';
    }

    // ✅ Trường hợp: Xác nhận đã nhận hàng khi đang giao
    else if (currentStatus === 'shipping') {
      order.orderStatus = 'delivered';

      // ✅ Nếu là COD thì chuyển sang đã thanh toán
      if (paymentMethod === 'cod' && paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
      }

      // ✅ Nếu là momo thì không đổi paymentStatus vì đã là 'paid'
    }

    await order.save();

    return res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái:', error);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật trạng thái' });
  }
});


module.exports = router;