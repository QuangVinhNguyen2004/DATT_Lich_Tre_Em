const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub'},
  child_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Child'},
  noi_dung: { type: String},
  thoi_gian_tao: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Diary', DiarySchema);
