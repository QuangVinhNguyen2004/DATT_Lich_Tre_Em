const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const mongoose = require('mongoose');

// Lấy tất cả lịch
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('child');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server!', message: err.message });
  }
});

// Lấy lịch theo ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('child');
    if (!schedule) return res.status(404).json({ message: 'Không tìm thấy lịch' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server!', message: err.message });
  }
});

// Tạo mới lịch
router.post('/', async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ error: 'Dữ liệu không hợp lệ!', message: err.message });
  }
});

// Cập nhật lịch
router.put('/:id', async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy lịch' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Cập nhật thất bại!', message: err.message });
  }
});

// Xoá lịch
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy lịch' });
    res.json({ message: 'Xóa thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server!', message: err.message });
  }
});

// Thêm dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
    const sampleSchedules = [
      {
        child: new mongoose.Types.ObjectId(), // Thay bằng ID trẻ thật nếu có
        activity: 'Ăn sáng',
        description: 'Cho bé ăn sáng với sữa và bánh mì',
        startTime: '07:00',
        duration: '30 phút',
        repeat: true
      },
      {
        child: new mongoose.Types.ObjectId(),
        activity: 'Ngủ trưa',
        description: 'Bé nghỉ ngơi sau khi ăn trưa',
        startTime: '12:30',
        duration: '2 giờ',
        repeat: true
      },
      {
        child: new mongoose.Types.ObjectId(),
        activity: 'Học vẽ',
        description: 'Hoạt động sáng tạo buổi chiều',
        startTime: '15:00',
        duration: '45 phút',
        repeat: false
      }
    ];

    await Schedule.insertMany(sampleSchedules);
    res.status(201).json({ message: 'Đã thêm dữ liệu mẫu!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm dữ liệu mẫu', message: err.message });
  }
});

module.exports = router;
