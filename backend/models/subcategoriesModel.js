const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories', // phải trùng tên model
    required: true
  }
});

module.exports = mongoose.model('subcategories', subcategorySchema);
