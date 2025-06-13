const express = require('express');
const router = express.Router();
const PostCategory = require('../models/postscategoryModel');

// Lấy danh sách danh mục bài viết
router.get('/', async (req, res) => {
  try {
    const categories = await PostCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm mới danh mục bài viết
router.post('/', async (req, res) => {
  try {
    const category = new PostCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Sửa danh mục bài viết
router.put('/:id', async (req, res) => {
  try {
    const category = await PostCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Xóa danh mục bài viết
router.delete('/:id', async (req, res) => {
  try {
    const category = await PostCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;