const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const PostCategory = require('../models/postscategoryModel');
const slugify = require('slugify');
const multer = require("multer");
const path = require("path");

// ✅ Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ GET tất cả bài viết (có lọc)
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

// ✅ GET theo slug danh mục
router.get('/by-category-slug/:slug', async (req, res) => {
  try {
    const category = await PostCategory.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const posts = await Post.find({ categoryId: category._id }).sort({ createdAt: -1 });
    res.json({
      total: posts.length,
      items: posts,
      categoryTitle: category.title
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET theo categoryId
router.get('/category/:categoryId', async (req, res) => {
  const { hidden } = req.query;
  const filter = { categoryId: req.params.categoryId };
  if (typeof hidden !== 'undefined') filter.hidden = hidden === 'true';

  try {
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ total: posts.length, items: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET theo slug bài viết
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET theo ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ POST tạo mới
router.post("/", upload.fields([
  { name: "img", maxCount: 1 },
  { name: "images", maxCount: 10 }
]), async (req, res) => {
  try {
    const data = req.body;

    // ✅ Lưu tên file thay vì đường dẫn
    if (req.files?.img) {
      data.img = req.files.img[0].filename;
    }
    if (req.files?.images) {
      data.images = req.files.images.map(file => file.filename);
    }

    if (!data.slug && data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const post = new Post(data);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ PUT cập nhật
// ✅ PUT cập nhật
router.put("/:id", upload.fields([
  { name: "img", maxCount: 1 },
  { name: "images", maxCount: 10 }
]), async (req, res) => {
  try {
    const data = req.body;

    // Ảnh đại diện
    if (req.files?.img && req.files.img.length > 0) {
      data.img = req.files.img[0].filename;
    } else if (data.existingImg) {
      data.img = data.existingImg;
    } else {
      data.img = null; // nếu xoá
    }

    // Ảnh phụ
    const existingImages = Array.isArray(data.existingImages)
      ? data.existingImages
      : data.existingImages
        ? [data.existingImages]
        : [];

    const uploadedImages = req.files?.images
      ? req.files.images.map((file) => file.filename)
      : [];

    data.images = [...existingImages, ...uploadedImages];

    // Tạo slug nếu chưa có
    if (!data.slug && data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!updatedPost) return res.status(404).json({ message: "Not found" });

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


// ✅ DELETE bài viết
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
