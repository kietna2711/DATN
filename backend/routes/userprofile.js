const express = require('express');
const User = require('../models/userprofileModel'); // Đảm bảo đường dẫn đúng tới model User
const router = express.Router();

router.get('/usersProfile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Lọc bỏ password, role nếu không cần gửi về client
    const user = await User.findOne({ username }).select('-password -role');

    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
