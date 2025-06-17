const Voucher = require('../models/voucherModel');

// Lấy tất cả voucher
const getAllVouchers = async (req, res, next) => {
    try {
        const arr = await Voucher.find();
        res.status(200).json(arr);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Thêm mới voucher
const addVoucher = async (req, res, next) => {
    try {
        const voucherData = req.body;
        const voucher = new Voucher(voucherData);
        await voucher.save();
        res.status(201).json(voucher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Sửa voucher (theo id)

const editVoucher = async (req, res) => {
  try {
    const {
      discountCode, percent, startDate, endDate, description,
      productIds, categoryIds, minOrderValue, maxDiscount,
      usageLimit, used, active
    } = req.body;

    if (!discountCode) {
      return res.status(400).json({ message: "Mã giảm giá không được bỏ trống" });
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      {
        discountCode, percent, startDate, endDate, description,
        productIds, categoryIds, minOrderValue, maxDiscount,
        usageLimit, used, active
      },
      { new: true, runValidators: true }
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật voucher thành công", data: updatedVoucher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllVouchers, addVoucher, editVoucher, };