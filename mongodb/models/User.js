const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    match: [/^\d{9,11}$/, 'Số điện thoại không hợp lệ'],
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
