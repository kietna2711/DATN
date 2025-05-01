var express = require('express');
var router = express.Router();

const { getAllCategories, getCategoryById}=
require('../controllers/categoryController');

//Lấy tất cả danh mục
router.get('/', getAllCategories);

//Lấy chi tiết 1 danh mục
router.get('/:id',getCategoryById);

module.exports = router;
