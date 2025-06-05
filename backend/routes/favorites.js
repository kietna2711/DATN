const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorites');

// POST - Thêm yêu thích
router.post('/', favoriteController.addFavorite);

// GET - Lấy danh sách yêu thích theo userId
router.get('/', favoriteController.getFavoritesByUser); // userId lấy từ query


// DELETE - Xóa yêu thích
// Router:
router.delete('/:productId', favoriteController.removeFavorite);

module.exports = router;