const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: { type: Array, required: true },
  createdAt: { type: Date, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
    subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategories'
  }
}, {
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.id;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  },
  id: false
});

// Tạo virtual cho mảng variants
productSchema.virtual('variants', {
  ref: 'variants',
  localField: '_id',
  foreignField: 'productId'
});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;
