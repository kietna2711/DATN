const express = require('express');
const router = express.Router();
const User = require('../models/userprofileModel');
const Profile = require('../models/profileModel');

// GET user + profile by user ID
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -role');
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });
    const profile = await Profile.findOne({ user: id }) || {};
    res.json({ ...user.toObject(), profile });
  } catch (error) {
    console.error('Lỗi khi lấy user và profile theo ID:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT update user & profile by user ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { profile, ...userData } = req.body;
    const oldUser = await User.findById(id);
    if (!oldUser) return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật' });

    // Nếu là Google user, không cho đổi các trường này
    if (oldUser.googleId) {
      userData.email = oldUser.email;
      userData.username = oldUser.username;
      userData.firstName = oldUser.firstName;
      userData.lastName = oldUser.lastName;
    }

    // Cập nhật user chính
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true }).select('-password -role');

    // Cập nhật hoặc tạo mới profile
    let updatedProfile = null;
    if (profile) {
      updatedProfile = await Profile.findOneAndUpdate(
        { user: id },
        { ...profile, user: id },
        { new: true, upsert: true, runValidators: true }
      );
    } else {
      updatedProfile = await Profile.findOne({ user: id }) || {};
    }

    res.json({ ...updatedUser.toObject(), profile: updatedProfile });
  } catch (error) {
    console.error('Lỗi khi cập nhật user và profile:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật user/profile' });
  }
});

module.exports = router;