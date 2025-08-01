const mongoose = require('mongoose');

const GiftOptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
   occasion: { type: String }
});

module.exports = mongoose.model('GiftOption', GiftOptionSchema);
