const categories = require('../models/categoryModel');

//Hàm lấy tất cả danh mục
const getAllCategories =async(req, res, next)=> {
    try {
      //Hàm find là hàm lấy tất cả document
      const arr = await categories.find();
      res.status(200).json(arr);
    } catch (error) {
      res.status(500).json({message : error.message});
    }
}

//Hàm lấy chi tiết 1 danh mục
const getCategoryById =async(req, res, next)=> {
    try {
      //Hàm findById là hàm lấy 1 document dựa vào ID
      const arr = await categories.findById(req.params.id);
      res.status(200).json(arr);
    } catch (error) {
      res.status(500).json({message : error.message});
    }
  }
//export ra để các file khác có thể sử dụng
module.exports ={ getAllCategories, getCategoryById};