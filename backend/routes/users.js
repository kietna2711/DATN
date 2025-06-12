var express = require('express');
var router = express.Router();

const { register, login ,verifyToken, getUser} = require('../controllers/userController');
const User = require('../models/userModel');
const passport = require('passport');
const reviewController = require('../controllers/reviewController');
const jwt = require('jsonwebtoken');

//Đăng ký
router.post('/register', register);

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

module.exports = router;