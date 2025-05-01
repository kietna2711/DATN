//Tạo cấu trúc schema cho dữ liệu categories
const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    tenDM : {type: String, required : true },
    mota : {type: String, required : true }
});

//Tạo model từ Schema trên collection categories
//Chạy vô CSDL Mongo để lấy dữ liệu của categories ra
//  và kiểm tra dữ liệu đó có khớp với schema dữ liệu vừa tạo
const categories = mongoose.model('danhmuc',categorySchema);

module.exports = categories;