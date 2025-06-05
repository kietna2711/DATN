const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String },
  facebookId: { type: String },
  firstName: String,
  lastName: String,
  username: { type: String },
  role: { type: String, default: 'user' },
  visible: { type: Boolean, default: true },
  status: { type: String, default: 'Hoạt động' }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);