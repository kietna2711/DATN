const mongoose = require('mongoose');
const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  hidden: { type: Boolean, default: false },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true }
});
module.exports = mongoose.model('subcategories', subcategorySchema);