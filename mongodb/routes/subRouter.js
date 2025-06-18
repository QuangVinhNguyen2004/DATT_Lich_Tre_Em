const express = require('express');
const router = express.Router();
const Sub = require('../models/sub');

// Tạo mới Sub
router.post('/', async (req, res) => {
  try {
    const newSub = new Sub(req.body);
    const savedSub = await newSub.save();
    res.status(201).json(savedSub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lấy tất cả Sub
router.get('/', async (req, res) => {
  try {
    const subs = await Sub.find();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy Sub theo ID
router.get('/:id', async (req, res) => {
  try {
    const sub = await Sub.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật Sub
router.put('/:id', async (req, res) => {
  try {
    const updatedSub = await Sub.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Xóa Sub
router.delete('/:id', async (req, res) => {
  try {
    await Sub.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Thêm dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
    const sampleSubs = [
      {
        ten: 'Nguyễn Văn A',
        email: 'a@example.com',
        sdt: '0123456789',
        password: 'password123'
      },
      {
        ten: 'Trần Thị B',
        email: 'b@example.com',
        sdt: '0987654321',
        password: 'securepass'
      },
      {
        ten: 'Lê Văn C',
        email: 'c@example.com',
        sdt: '0909090909',
        password: '12345678'
      }
    ];

    const inserted = await Sub.insertMany(sampleSubs);
    res.status(201).json({ message: 'Dữ liệu mẫu đã được thêm', data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
