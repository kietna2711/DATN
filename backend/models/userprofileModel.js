const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: { type: String, default: 'user' },
  visible: { type: Boolean, default: true },
  status: { type: String, default: 'Hoạt động' }
  // Đã bỏ các trường profile ra ngoài
}, {
  timestamps: true,
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema, 'users');