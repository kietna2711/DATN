const categories = require('../models/categoryModel');



// Hàm lấy danh mục và populate subcategories
const getAllCategories = async (req, res) => {
  try {
    const categoriesList = await categories.find().populate({
      path: 'subcategories',
      select: 'name'
    });
    res.status(200).json(categoriesList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//Hàm lấy chi tiết 1 danh mục
const getCategoryById = async (req, res, next) => {
  try {
    const arr = await categories.findById(req.params.id).populate({
      path: 'subcategories',
      select: 'name'
    });
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//export ra để các file khác có thể sử dụng
module.exports ={ getAllCategories, getCategoryById};