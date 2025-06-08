const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Email không hợp lệ'],
  },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  visible: { type: Boolean, default: true },
  status: { type: String, default: 'Hoạt động' },
}, {
  timestamps: true,
});

// Ẩn password khi trả về JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

module.exports = User;
