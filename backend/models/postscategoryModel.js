zzconst mongoose = require('mongoose');

const postCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  hidden: { type: Boolean, default: false }
}, { collection: 'postscategories' }); // Đúng tên collection

module.exports = mongoose.model('PostCategory', postCategorySchema);