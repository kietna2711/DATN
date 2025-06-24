const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // unique!
  phone: String,
  gender: String,
  birthDate: String,
  addresses: [{ id: String, detail: String }]
}, { timestamps: true });
module.exports = mongoose.model('Profile', profileSchema);