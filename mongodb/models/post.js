const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub' },
  noi_dung: { type: String },
  loai: { type: String },
  trang_thai: { type: String, enum: ['chờ duyệt', 'đã duyệt', 'bị từ chối'], default: 'chờ duyệt' },
  thoi_gian_tao: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
