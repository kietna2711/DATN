const express = require('express');
const router = express.Router();
const GiftOption = require('../models/giftoptionModel');

// Lấy tất cả gift options
router.get('/', async (req, res) => {
  try {
    const gifts = await GiftOption.find();
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm gift option mới
router.post('/', async (req, res) => {
  const newGift = new GiftOption({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    color: req.body.color,
     occasion: req.body.occasion
  });

  try {
    const savedGift = await newGift.save();
    res.status(201).json(savedGift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
