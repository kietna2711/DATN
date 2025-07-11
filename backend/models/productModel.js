const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: { type: [String], required: true },
  price: { type: Number, required: true }, // Thêm dòng này
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories', // Đúng nếu model export là 'categories'
    required: true
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategories',
  }
}, {
  timestamps: true, // ✅ Tự động thêm createdAt và updatedAt
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.id;
      // Xóa id trong categoryId nếu có
      if (ret.categoryId && ret.categoryId.id) {
        delete ret.categoryId.id;
      }
      // Xóa id trong subcategoryId nếu có
      if (ret.subcategoryId && ret.subcategoryId.id) {
        delete ret.subcategoryId.id;
      }
      return ret;
    }
  },
  toObject: {
    virtuals: true
  },
  id: false
});

// ✅ Tạo virtual cho mảng variants
productSchema.virtual('variants', {
  ref: 'variants',
  localField: '_id',
  foreignField: 'productId'
});

// ✅ Tạo model
const productModel = mongoose.model('products', productSchema);

module.exports = productModel;
