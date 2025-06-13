const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');

// Lấy danh sách bài viết (hỗ trợ phân trang, lọc)
router.get('/', async (req, res) => {
  const { categoryId, hidden } = req.query;
  const filter = {};
  if (categoryId) filter.categoryId = categoryId;
  if (typeof hidden !== 'undefined') filter.hidden = hidden === 'true';

  try {
    const items = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ total: items.length, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm mới bài viết
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Sửa bài viết
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Xóa bài viết
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lấy chi tiết bài viết
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;