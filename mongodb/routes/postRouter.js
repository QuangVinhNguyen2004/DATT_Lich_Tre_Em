const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Sub = require('../models/sub');

// Tạo bài đăng mới
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lấy tất cả bài đăng
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user_id', 'ten email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy bài đăng theo ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user_id', 'ten');
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật bài đăng
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Xóa bài đăng
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa bài đăng thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Thêm dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
 

    const samplePosts = [
      {
        user_id: "6852ca0f53c359e900cd2dc1",
        noi_dung: 'Tôi chia sẻ cách dạy con học toán mỗi ngày rất hiệu quả.',
        loai: 'chia sẻ',
        trang_thai: 'đã duyệt'
      
      },
      {
        user_id: "6852ca0f53c359e900cd2dc2",
        noi_dung: 'Có phụ huynh nào từng cho con học online? Cho mình xin ý kiến.',
        loai: 'hỏi đáp',
        trang_thai: 'chờ duyệt'
      
      }
   
    ];

    const inserted = await Post.insertMany(samplePosts);
    res.status(201).json({ message: 'Seed dữ liệu bài viết thành công', data: inserted });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
