var express = require('express');
var router = express.Router();

const { register, login ,verifyToken, getUser} = require('../controllers/userController');
const User = require('../models/userModel');
const passport = require('passport');
const reviewController = require('../controllers/reviewController');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Biến toàn cục lưu tạm thông tin đăng ký
global.tempRegister = global.tempRegister || {};

// Đăng ký: chỉ gửi OTP, không lưu user
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, username, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email này đã tồn tại" });
    }
    // Sinh OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Gửi OTP qua email
    try {
      await sendVerifyOTP(email, otp);
    } catch (mailErr) {
      return res.status(400).json({ message: "Không gửi được email xác thực!" });
    }
    // Lưu thông tin đăng ký tạm thời
    global.tempRegister[email] = {
      email,
      firstName,
      lastName,
      username,
      password,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000 // 10 phút
    };
    res.json({ message: "Đã gửi mã xác thực về email. Vui lòng kiểm tra email để hoàn tất đăng ký!" });
  } catch (err) {
    res.status(500).json({ message: "Đăng ký thất bại!" });
  }
});

//Đăng nhập
router.post('/login', login);

//Lấy thông tin 1 user theo token
router.get('/userinfo', verifyToken, getUser);

// Lấy tất cả user
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Thêm review
router.post('/reviews', verifyToken, reviewController.createReview);

// Toggle visible
router.patch('/:id/toggle-visibility', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.visible = !user.visible;
    user.status = user.visible ? "Hoạt động" : "Khóa";
    await user.save();
    res.json({ visible: user.visible, status: user.status });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Cập nhật vai trò người dùng
router.patch('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập với Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback Google OAuth
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3007/login?error=access_denied'
  }),
  (req, res) => {
    // Thành công
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role},
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.redirect(
      `http://localhost:3007/oauth-success?user=${encodeURIComponent(JSON.stringify(req.user))}&token=${token}`
    );
  }
);

// XÓA toàn bộ phần xác thực email bằng link (token)
// KHÔNG còn router.get('/verify-email', ...)
// KHÔNG còn sendVerifyMail

// Chỉ giữ xác thực OTP qua email
async function sendVerifyOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Mã xác thực đăng ký tài khoản',
    html: `
      <div style="font-family:sans-serif;">
        <p>Mã xác thực đăng ký tài khoản của bạn là:</p>
        <div style="font-size:24px;font-weight:bold;color:#d63384;margin:16px 0;">${otp}</div>
        <p>Mã này có hiệu lực trong 10 phút.</p>
      </div>
    `,
  });
}

// Khôi phục mật khẩu - gửi email xác nhận
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

  // Tạo OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP = otp;
  user.resetOTPExpire = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút
  await user.save();

  // Gửi email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Mã OTP đặt lại mật khẩu',
    html: `<p>Mã OTP của bạn là: <b>${otp}</b> (có hiệu lực trong 10 phút)</p>`,
  });

  res.json({ message: "Đã gửi OTP về email!" });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, resetOTP: otp });
  if (!user || !user.resetOTPExpire || user.resetOTPExpire < Date.now()) {
    return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn!" });
  }
  // Xác thực thành công, cho phép đổi mật khẩu
  res.json({ message: "OTP hợp lệ!" });
});

// Đổi mật khẩu
router.post('/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email, resetOTP: otp });
  if (!user || !user.resetOTPExpire || user.resetOTPExpire < Date.now()) {
    return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn!" });
  }
  user.password = await bcrypt.hash(password, 10);
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  await user.save();
  res.json({ message: "Đổi mật khẩu thành công!" });
});

// Lấy khách hàng mới trong 7 ngày gần nhất
router.get('/new-this-week', async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const users = await User.find({ createdAt: { $gte: weekAgo } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy khách hàng mới trong tuần" });
  }
});

// Xác thực OTP đăng ký
router.post('/verify-otp-register', async (req, res) => {
  const { email, otp } = req.body;
  const temp = global.tempRegister[email];
  if (!temp || temp.otp !== otp || temp.otpExpire < Date.now()) {
    return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn!" });
  }
  // Lưu user vào DB
  const hashPassword = await bcrypt.hash(temp.password, 10);
  await User.create({
    email: temp.email,
    firstName: temp.firstName,
    lastName: temp.lastName,
    username: temp.username,
    password: hashPassword,
    isVerified: true
  });
  // Xóa dữ liệu tạm
  delete global.tempRegister[email];
  res.json({ message: "Xác thực tài khoản thành công!" });
});

module.exports = router;