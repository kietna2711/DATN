var express = require('express');
var router = express.Router();

const { register, login ,verifyToken, getUser} = require('../controllers/userController');
const User = require('../models/userModel');
const passport = require('passport');
const reviewController = require('../controllers/reviewController');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Đăng ký tài khoản với xác thực email
router.post('/register', async (req, res) => {
  try {
    const { email, ...userData } = req.body;
    // Kiểm tra email đã tồn tại chưa
    const exist = await User.findOne({ email });
    if (exist) {
      if (exist.isVerified) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      } else {
        // Nếu user chưa xác thực, xóa user cũ để cho phép đăng ký lại
        await User.deleteOne({ email });
      }
    }
    // Sinh token xác thực
    const verifyToken = crypto.randomBytes(32).toString('hex');
    // Gửi mail xác thực TRƯỚC
    try {
      await sendVerifyMail(email, verifyToken);
    } catch (mailErr) {
      console.error("Lỗi gửi mail:", mailErr);
      return res.status(400).json({ message: "Email không tồn tại hoặc không gửi được email xác thực!" });
    }
    // Nếu gửi mail thành công mới tạo user
    await User.create({
      ...userData,
      email,
      password: await bcrypt.hash(userData.password, 10),
      isVerified: false,
      verifyToken
    });
    res.json({ message: "Đã gửi email xác thực. Vui lòng kiểm tra email để hoàn tất đăng ký!" });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.status(500).json({ message: "Đăng ký thất bại!" });
  }
});

//Đăng nhập
router.post('/login', login);

//Lấy thông tin 1 user theo token
router.get('/userinfo', verifyToken, getUser);

// mới thêm
// Lấy tất cả user
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// thêm 
router.post('/reviews', verifyToken, reviewController.createReview);

// Toggle visible
router.patch('/:id/toggle-visibility', async (req, res) => {
  console.log("PATCH request for: ", req.params.id); //xem thông báo ở terminal
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.visible = !user.visible;//đảo trạng thái 
    user.status = user.visible ? "Hoạt động" : "Khóa"; //visible true "hoạt động", false "Khóa"
    await user.save();
    console.log("New visible:", user.visible); // xem thông báo ở terminal
    res.json({ visible: user.visible, status: user.status });
    console.log("New status:", user.status); // xem thông báo ở terminal
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

// Xác thực email
router.get('/verify-email', async (req, res) => {
  const { token, email } = req.query;
  try {
    const user = await User.findOne({ email, verifyToken: token });
    if (!user) return res.status(400).send('Link xác thực không hợp lệ hoặc đã hết hạn!');
    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();
    // Trả về trang xác nhận có nút đăng nhập
    res.send(`
      <html>
        <head>
          <title>Xác thực thành công</title>
          <meta charset="utf-8" />
          <meta http-equiv="refresh" content="2;url=http://localhost:3007/login" />
        </head>
        <body style="font-family:sans-serif;text-align:center;margin-top:80px;">
          <h2 style="color:green;">✅ Xác thực thành công!</h2>
          <p>Tài khoản của bạn đã được kích hoạt.<br>Đang chuyển tới trang đăng nhập...</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Lỗi xác thực email:", err);
    res.status(500).send('Lỗi xác thực email.');
  }
});

async function sendVerifyMail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const link = `http://localhost:3000/users/verify-email?token=${token}&email=${email}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác thực đăng ký tài khoản',
    html: `
      <div style="font-family:sans-serif;">
        <p>Nhấn nút dưới đây để xác thực tài khoản:</p>
        <a href="${link}" style="display:inline-block;padding:12px 32px;background:#4caf50;color:#fff;text-decoration:none;border-radius:5px;font-size:16px;">
          Xác nhận tài khoản
        </a>
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

module.exports = router;