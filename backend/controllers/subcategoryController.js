const subcategoryy = require('../models/subcategoryModel');
const categories = require('../models/categoryModel'); // nếu bạn cần dùng để populate

// Lấy tất cả subcategories
const getALLSubcategory = async (req, res, next) => {
    try {
        const arr = await subcategoryy.find();
        res.status(200).json(arr);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết 1 danh mục (category) kèm subcategories
// const getCategoryById = async (req, res, next) => {
//     try {
//         const category = await categories.findById(req.params.id).populate({
//             path: 'subcategories',
//             select: 'name categoryId'  // chọn các trường cần thiết
//         });
//         if (!category) {
//             return res.status(404).json({ message: 'Danh mục không tồn tại' });
//         }
//         res.status(200).json(category);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Thêm subcategory mới
const addSubcate = async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Tên danh mục con không được bỏ trống" });
        }
        if (!categoryId) {
            return res.status(400).json({ message: "categoryId là bắt buộc" });
        }

        const newSubcategory = new subcategoryy({ name, categoryId });

        const data = await newSubcategory.save();

        res.status(201).json({
            message: 'Thêm danh mục con thành công',
            data
        });
    } catch (error) {
        console.error("Lỗi khi thêm danh mục con:", error);
        res.status(500).json({ message: error.message });
    }
};

// Sửa subcategory
const editSubcate = async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Tên danh mục con không được bỏ trống" });
        }

        // Chỉ cập nhật các trường cần thiết
        const updateData = { name };
        if (categoryId) updateData.categoryId = categoryId;

        const updatedSubcategory = await subcategoryy.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedSubcategory) {
            return res.status(404).json({ message: "Danh mục con không tồn tại" });
        }

        res.status(200).json({
            message: "Cập nhật danh mục con thành công",
            data: updatedSubcategory
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục con:", error);
        res.status(500).json({ message: error.message });
    }
};

// Xóa subcategory
const deleteSubcate = async (req, res) => {
    try {
        const data = await subcategoryy.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({ message: 'Danh mục con không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa danh mục con thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getALLSubcategory, addSubcate, editSubcate, deleteSubcate };
