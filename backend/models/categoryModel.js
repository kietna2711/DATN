const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  hidden: { type: Boolean, required: true }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
categorySchema.virtual('subcategories', {
  ref: 'subcategories',
  localField: '_id',
  foreignField: 'categoryId'
});
module.exports = mongoose.model('categories', categorySchema);