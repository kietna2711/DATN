const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false
});

// Tạo virtual cho mảng subcategories (danh mục con)
categorySchema.virtual('subcategories', {
  ref: 'subcategories',         // tên model
  localField: '_id',
  foreignField: 'categoryId'    // trùng với trường bên subcategory
});


// Tạo model categories
const categories = mongoose.model('categories', categorySchema);

module.exports = categories;