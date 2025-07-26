const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const {verifyToken, verifyAdmin} = require('../controllers/userController');
const authenticateToken = require("../middleware/auth"); 
// API cho admin - lấy tất cả voucher
router.get('/', voucherController.getAllVouchers);

router.get('/:id', voucherController.getVoucherById);
router.post('/', authenticateToken, verifyToken, voucherController.addVoucher);
router.put('/:id', authenticateToken, verifyToken, voucherController.editVoucher);
// (Có thể bổ sung delete nếu cần)

module.exports = router;