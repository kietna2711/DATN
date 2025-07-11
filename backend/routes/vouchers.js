const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

// API cho admin - lấy tất cả voucher
router.get('/', voucherController.getAllVouchers);

router.get('/:id', voucherController.getVoucherById);
router.post('/', voucherController.addVoucher);
router.put('/:id', voucherController.editVoucher);
// (Có thể bổ sung delete nếu cần)

module.exports = router;