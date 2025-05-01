//Tạo cấu trúc schema cho dữ liệu product
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  tenSP: { type: String, required: true },
  mota: { type: String },
  anhSP: { type: String, required: true },
  ngayTao: { type: Date, required: true},
  soluong : { type: Number, required: true },
  //ref: 'Categories' để liên kết với collection Categories
  danhMuc_id: { type: mongoose.Schema.Types.ObjectId, ref: 'danhmuc' },
  
},{versionKey: false});


// Tạo model từ schema trên Collection products
const productModel = mongoose.model('sanpham', productSchema);

module.exports = productModel;
