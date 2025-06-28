const express = require('express');
const router = express.Router();
const User = require('../models/userprofileModel');
const Profile = require('../models/profileModel');

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
    const { phone, gender, birthDate, addresses } = req.body;

    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    // Kiểm tra profile đã tồn tại chưa
    const profile = await Profile.findOne({ username });
    if (!profile) return res.status(404).json({ message: 'Profile chưa tồn tại cho username này' });

    // Cập nhật thông tin profile
    profile.phone = phone;
    profile.gender = gender;
    profile.birthDate = birthDate;
    profile.addresses = addresses;

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật profile', error: error.message });
  }
});

module.exports = router;