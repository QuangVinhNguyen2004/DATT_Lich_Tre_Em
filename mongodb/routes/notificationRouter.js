const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// Lấy danh sách tất cả notification
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().populate('schedule_id');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo mới 1 notification
router.post('/', async (req, res) => {
  const { schedule_id, noi_dung, thoi_gian } = req.body;

  if (!schedule_id || !noi_dung || !thoi_gian) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
  }

  const notification = new Notification({
    schedule_id,
    noi_dung,
    thoi_gian
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy thông báo theo id
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('schedule_id');
    if (!notification) return res.status(404).json({ message: 'Không tìm thấy notification' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa notification theo id
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Không tìm thấy notification' });

    await notification.remove();
    res.json({ message: 'Xóa notification thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật notification theo id
router.put('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Không tìm thấy notification' });

    const { schedule_id, noi_dung, thoi_gian } = req.body;
    if (schedule_id) notification.schedule_id = schedule_id;
    if (noi_dung) notification.noi_dung = noi_dung;
    if (thoi_gian) notification.thoi_gian = thoi_gian;

    const updated = await notification.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Route tạo dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
    // Dữ liệu mẫu
    const sampleData = [
      {
        schedule_id: '60f5f4e2e7b2b21d10a5a1c4', // Thay bằng ObjectId thực tế trong db Schedule của bạn
        noi_dung: 'Nhắc nhở: Lịch sinh hoạt sắp bắt đầu',
      
      },
      {
        schedule_id: '60f5f4e2e7b2b21d10a5a1c5',
        noi_dung: 'Thông báo: Hoạt động thể dục buổi sáng',
        
      }
    ];

    // Xóa hết dữ liệu cũ (nếu muốn)
    await Notification.deleteMany({});

    // Tạo dữ liệu mẫu
    const created = await Notification.insertMany(sampleData);

    res.json({ message: 'Tạo dữ liệu mẫu thành công', data: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
