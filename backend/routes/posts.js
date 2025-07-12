const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const PostCategory = require('../models/postscategoryModel');

// ✅ Lấy bài viết theo slug danh mục (nên đặt TRƯỚC để tránh nhầm với /:id)
router.get('/by-category-slug/:slug', async (req, res) => {
  try {
    const category = await PostCategory.findOne({ slug: req.params.slug });

    if (!category) return res.status(404).json({ message: 'Category not found' });

    const posts = await Post.find({ categoryId: category._id }).sort({ createdAt: -1 });
    
    res.json({
      total: posts.length,
      items: posts,
      categoryTitle: category.title // 👈 Thêm dòng này
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Lấy bài viết theo categoryId
router.get('/category/:categoryId', async (req, res) => {
  const { hidden } = req.query;
  const { categoryId } = req.params;
  const filter = { categoryId };
  if (typeof hidden !== 'undefined') filter.hidden = hidden === 'true';

  try {
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ total: posts.length, items: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Lấy chi tiết bài viết theo slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Lấy danh sách tất cả bài viết
router.get('/', async (req, res) => {
  const { categoryId, hidden } = req.query;
  const filter = {};
  if (categoryId) filter.categoryId = categoryId;
  if (typeof hidden !== 'undefined') filter.hidden = hidden === 'true';

  try {
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ total: posts.length, items: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Thêm mới bài viết
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Cập nhật bài viết
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Xoá bài viết
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Lấy chi tiết bài viết theo ID (nên để sau cùng để tránh conflict)
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
