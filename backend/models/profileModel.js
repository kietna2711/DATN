const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
  id: String,
  detail: String
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: String,
  gender: String,
  birthDate: String,
  addresses: [AddressSchema]
});
module.exports = mongoose.model('Profile', ProfileSchema);