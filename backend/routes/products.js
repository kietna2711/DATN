var express = require('express');
var router = express.Router();

const { getAllProducts, getProductById,addPro,editPro,deletePro } =
require('../controllers/productController');

const {verifyToken, verifyAdmin} = require('../controllers/userController');
//Lấy tất cả sản phẩm
router.get('/', getAllProducts);

//Lấy chi tiết 1 sản phẩm
router.get('/:id', getProductById);

//Thêm sản phẩm
router.post('/', addPro);
// router.post('/',  addPro);

//Sửa sản phẩm
router.patch('/:id', verifyToken, verifyAdmin, editPro);

//Xóa sản phẩm
router.delete('/:id', deletePro);
// router.delete('/:id', verifyToken, verifyAdmin, deletePro);
module.exports = router;
