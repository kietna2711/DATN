const mongoose = require('mongoose');

const variantsSchema = new mongoose.Schema({
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true },
}, {
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.id;        // Xóa trường 'id' nếu có
      delete ret.productId; // Xóa trường 'productId'
      return ret;
    }
  },
  id: false
});

const variantsModel = mongoose.model('variants', variantsSchema);

module.exports = variantsModel;
