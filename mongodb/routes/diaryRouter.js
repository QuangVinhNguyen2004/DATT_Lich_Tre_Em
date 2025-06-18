const express = require('express');
const router = express.Router();
const Diary = require('../models/diary');
const Sub = require('../models/sub');
const Child = require('../models/Child');

// Tạo nhật ký mới
router.post('/', async (req, res) => {
  try {
    const diary = new Diary(req.body);
    const saved = await diary.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lấy tất cả nhật ký
router.get('/', async (req, res) => {
  try {
    const diaries = await Diary.find()
      .populate('user_id', 'ten')
      .populate('child_id', 'ten');
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
    const user = await Sub.findOne();
    const child = await Child.findOne();
    if (!user || !child) {
      return res.status(404).json({ message: 'Cần ít nhất 1 user và 1 child để seed.' });
    }

    const sampleDiaries = [
      {
        user_id: user._id,
        child_id: child._id,
        noi_dung: 'Hôm nay bé ăn ngon và chơi ngoan.',
        
      },
      {
        user_id: user._id,
        child_id: child._id,
        noi_dung: 'Bé bắt đầu học đánh vần, rất thông minh.',
     
      }
    ];

    const inserted = await Diary.insertMany(sampleDiaries);
    res.status(201).json({ message: 'Đã seed nhật ký thành công', data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
