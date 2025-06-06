const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // mã hóa mật khẩu
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  visible: { type: Boolean, default: true },
  status: { type: String, default: 'Hoạt động' },
});

// Kiểm tra nếu model User đã tồn tại thì dùng lại, không tạo mới
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

module.exports = User;
