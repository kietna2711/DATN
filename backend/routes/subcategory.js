var express = require('express');
var router = express.Router();

const { getALLSubcategory, addSubcate, editSubcate, deleteSubcate }=
require('../controllers/subcategoryController');

//Lấy tất cả danh mục
router.get('/', getALLSubcategory);

//Lấy chi tiết 1 danh mục
// router.get('/:id',getCategoryById);

module.exports = router;