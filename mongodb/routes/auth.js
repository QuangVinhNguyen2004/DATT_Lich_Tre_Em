const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// API: Lấy danh sách tất cả tài khoản
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // không trả về password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Đăng ký
router.post('/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  console.log('Dữ liệu từ client:', req.body);

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin người dùng.' });
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(409).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công', userId: newUser._id });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
});


// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Bước 1: Kiểm tra đầu vào
  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
  }

  try {
    // Bước 2: Tìm người dùng trong CSDL
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Tài khoản không tồn tại' });
    }

    // Bước 3: So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    // Bước 4: Trả kết quả thành công
    res.json({
      message: 'Đăng nhập thành công',
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại.' });
  }
});


module.exports = router;
