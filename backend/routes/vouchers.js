const express = require('express');
const router = express.Router();
const { addVoucher, editVoucher, getAllVouchers } = require('../controllers/voucherController');

// Thêm voucher
router.post('/', addVoucher);
// Sửa voucher
router.put('/:id', editVoucher);
// Lấy tất cả voucher
router.get('/', getAllVouchers);

module.exports = router;