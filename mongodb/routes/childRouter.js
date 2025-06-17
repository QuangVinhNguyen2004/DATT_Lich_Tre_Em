const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Child = require('../models/Child');

// Lấy tất cả trẻ em (không populate user_id)
router.get('/', async (req, res) => {
  try {
    const children = await Child.find(); // ❌ Không dùng populate
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server!', message: err.message });
  }
});


// Lấy theo ID
router.get('/:id', async (req, res) => {
  try {
    const child = await Child.findById(req.params.id).populate('user_id');
    if (!child) return res.status(404).json({ message: 'Không tìm thấy trẻ em' });
    res.json(child);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server!', message: err.message });
  }
});

// Thêm mới
router.post('/', async (req, res) => {
  try {
    const newChild = new Child(req.body);
    await newChild.save();
    res.status(201).json(newChild);
  } catch (err) {
    res.status(400).json({ error: 'Dữ liệu không hợp lệ!', message: err.message });
  }
});

// Cập nhật
router.put('/:id', async (req, res) => {
  try {
    const updated = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy trẻ em' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Cập nhật thất bại!', message: err.message });
  }
});

// Xóa
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Child.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy trẻ em' });
    res.json({ message: 'Xóa thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server!', message: err.message });
  }
});

// Thêm dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
    const sampleData = [
      {
        child_id: 'C001',
        user_id: new mongoose.Types.ObjectId(), 
        name: 'Nguyễn Văn An',
        age: 5,
        birth_date: new Date('2019-04-10'),
        gender: 'Nam' 
      },
      {
        child_id: 'C002',
        user_id: new mongoose.Types.ObjectId(),
        name: 'Trần Thị Bảo',
        age: 4,
        birth_date: new Date('2020-06-15'),
        gender: 'Nữ'
      }
    ];

    await Child.insertMany(sampleData);
    res.status(201).json({ message: 'Đã thêm dữ liệu mẫu!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm dữ liệu mẫu', message: err.message });
  }
});

module.exports = router;
