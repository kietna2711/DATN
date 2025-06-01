var express = require('express');
var router = express.Router();

const { getAllCategories, getCategoryById, deleteCate, addCate, editCate}=
require('../controllers/categoryController');

//Lấy tất cả danh mục
router.get('/', getAllCategories);

//Lấy chi tiết 1 danh mục
router.get('/:id',getCategoryById);
router.delete('/:id', deleteCate);
router.post('/',addCate);
router.patch('/:id',editCate);
module.exports = router;
