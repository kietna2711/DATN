const express = require('express');
const auth = require('../middleware/auth'); // đường dẫn đúng
const User = require('../models/userprofileModel'); // Đảm bảo đường dẫn đúng tới model UserProfile
const router = express.Router();

/**
 * GET /api/usersProfile/:username
 * Lấy thông tin người dùng theo username (ẩn password và role)
 */
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password -role');

    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    res.json(user);
  } catch (error) {
    console.error('Lỗi khi lấy user theo username:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

/**
 * PUT /api/usersProfile/:id
 * Cập nhật thông tin người dùng theo _id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password -role');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Lỗi khi cập nhật user:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật user' });
  }
});

module.exports = router;
